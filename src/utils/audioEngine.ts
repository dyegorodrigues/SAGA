let SPEAK_SEQ = 0;
const VOICE_CACHE: Record<string, HTMLAudioElement> = {};

export const AudioEngine = {
  stop: () => {
    SPEAK_SEQ++;
    try { window.speechSynthesis?.cancel(); } catch (e) {}
  },
  
  // Future Luna Studio Integration
  playPremium: async (audioId: string, onEnd?: () => void) => {
    SPEAK_SEQ++;
    const seq = SPEAK_SEQ;
    
    // Fallback to TTS if Luna Studio audio isn't available
    console.log(`[Luna Studio] Playing: ${audioId}`);
    
    // Simulate real audio duration for the prototype
    setTimeout(() => {
      if (seq === SPEAK_SEQ && onEnd) onEnd();
    }, 1500); 
  },

  speak: (text: string, opts: { rate?: number; pitch?: number; onEnd?: () => void; lang?: string } = {}) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      if (opts.onEnd) opts.onEnd();
      return;
    }
    
    const seq = ++SPEAK_SEQ;
    window.speechSynthesis.cancel();
    
    const u = new SpeechSynthesisUtterance(text);
    u.lang = opts.lang || "pt-BR";
    u.rate = opts.rate ?? 1.05;
    u.pitch = opts.pitch ?? 1.25;
    
    u.onend = () => {
      if (seq === SPEAK_SEQ && opts.onEnd) opts.onEnd();
    };
    
    u.onerror = () => {
      if (seq === SPEAK_SEQ && opts.onEnd) opts.onEnd();
    }
    
    window.speechSynthesis.speak(u);
  }
};
