let SPEAK_SEQ = 0;

export const AudioPlayer = {
  stop: () => {
    SPEAK_SEQ++;
    try { window.speechSynthesis?.cancel(); } catch (e) {}
  },
  
  // Future Luna Studio Integration
  play: (audioId: string, onEnd?: () => void) => {
    SPEAK_SEQ++;
    const seq = SPEAK_SEQ;
    
    // Fallback to TTS if Luna Studio audio isn't available
    console.log(`[Luna Studio] Playing: ${audioId}`);
    
    // Simulate real audio duration for the prototype
    setTimeout(() => {
      if (seq === SPEAK_SEQ && onEnd) onEnd();
    }, 1500); 
  },

  speak: (text: string, onEnd?: () => void) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }
    
    const seq = ++SPEAK_SEQ;
    window.speechSynthesis.cancel();
    
    console.log(`[Luna Studio Fallback TTS] ${text}`);
    
    if (!text) return;
    const cleanText = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{FE0F}]/gu, '').trim();
    const u = new SpeechSynthesisUtterance(cleanText);
    u.lang = "pt-BR";
    u.rate = 1.05;
    u.pitch = 1.25;
    
    u.onend = () => {
      if (seq === SPEAK_SEQ && onEnd) onEnd();
    };
    
    u.onerror = () => {
      if (seq === SPEAK_SEQ && onEnd) onEnd();
    }
    
    window.speechSynthesis.speak(u);
  }
};
