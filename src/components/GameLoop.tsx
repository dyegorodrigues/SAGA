import React, { useState, useEffect, useRef } from "react";
import { Kid, Track, Question, Progress } from "../types";
import { RapidFire } from "./exercises/RapidFire";
import { SingaporeBars } from "./exercises/SingaporeBars";
import { commitProgress } from "../utils/progressEngine";
import { auth } from "../lib/firebase";
import {
  C,
  FONT,
  BODY,
  Mascote,
  StarChip,
  ProgressBar,
  SoundBtn,
  Burst,
  sfx,
  speak,
  stopSpeak,
  pickVoice,
  applyTheme,
  pickPraise,
  PRAISE,
  OOPS,
  THEMES,
  ShapeSVG,
  TensDots,
  NumberBond,
  TenFrame,
  MoneyNote,
  MoneyCoin,
  SceneSVG,
  EmojiRow,
  BigText,
} from "./Mascot";
import { hasTutorial, tutorialSteps, hasAulinha, aulaSeen, markAulaSeen } from "../utils/tutorials";
import SyllableScene from "./scenes/SyllableScene";
import WeatherScene, { Weather } from "./scenes/WeatherScene";
import GrowthScene from "./scenes/GrowthScene";
import DayPartScene, { DayPart } from "./scenes/DayPartScene";
import EmotionScene, { Emotion } from "./scenes/EmotionScene";
import PersonLifeScene from "./scenes/PersonLifeScene";
import AnimalLifeScene from "./scenes/AnimalLifeScene";
import NestScene from "./scenes/NestScene";
import { NumberLine } from "./NumberLine";
import { InteractiveNumberLine } from "./InteractiveNumberLine";
import { DragGroup } from "./DragGroup";
import { ArrayGrid } from "./ArrayGrid";
import { InteractiveVertical } from "./InteractiveVertical";
import { VisualAddition } from "./primitives/VisualAddition";
import { ScatteredItems } from "./primitives/ScatteredItems";
import { LinkingCubes } from "./primitives/LinkingCubes";
import { TakeApart } from "./primitives/TakeApart";
import { GhostHand } from "./GhostHand";
import JourneyScene from "./scenes/JourneyScene";
import PlaceScene, { Place } from "./scenes/PlaceScene";
import { FichaRenderer } from "./FichaRenderer";

interface GameProps {
  kid: Kid;
  track: Track;
  prog0: Progress;
  sound: boolean;
  onToggleSound: () => void;
  onCommit: (p: Progress, right: boolean, stars: number, ms: number, missionDone?: boolean) => void;
  firstMissionToday?: boolean;
  onExit: () => void;
  onAlbum: () => void;
  stage: number;
  /** missão de nível escolhido no seletor 🎯: sem aquecimento e sem revisão do banco */
  exactLvl?: boolean;
}

const TOTAL_Q = 8;
const totalQFor = (track: Track) => (track as any).totalQ || TOTAL_Q;

const qSig = (q: Question) =>
  [
    q.kind,
    q.prompt,
    q.answer,
    q.expr || q.big || "",
    q.a ?? "",
    q.b ?? "",
    q.n ?? "",
    q.t ?? "",
    q.u ?? "",
    q.story || "",
    (q.coins || []).join("."),
    (q.notes || []).join("."),
    (q.rows || []).map((r) => r.e + r.n).join("."),
    (q.items || []).map((i) => i.e + i.pos).join("."),
  ].join("|");

const qSpeech = (q: Question, withHowto = true) => {
  const base = q.kind === "story" ? q.story || "" : q.prompt + (q.kind === "math" ? " ... " + q.expr : "");
  // sayTarget = o som-alvo falado mas nunca escrito (não entrega a resposta na tela)
  const alvo = q.sayTarget ? " ... " + q.sayTarget : "";
  // howto = instrução de COMO fazer; falada só na 1ª questão (evita repetição robótica)
  return base + alvo + (withHowto && q.howto ? " ... " + q.howto : "");
};

function sanitizeQ(q: Question) {
  const { review, sig, ...rest } = q;
  return JSON.parse(JSON.stringify(rest));
}

// nomes falados dos números nas aulinhas (a mãozinha conta em PALAVRAS, não dígitos)
const NUM_PT = [
  "Um", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito", "Nove", "Dez",
  "Onze", "Doze", "Treze", "Catorze", "Quinze", "Dezesseis", "Dezessete", "Dezoito", "Dezenove", "Vinte",
];
const numPt = (n: number) => NUM_PT[n - 1] || String(n);

function drawQuestion(track: Track, p: Progress, lvlOverride?: number, pure = false) {
  // pure = missão de nível escolhido a dedo (seletor 🎯): sem revisão do banco,
  // só questões DAQUELE nível — é o que o pai/criança pediu para ver/treinar
  const bank = p.bank || [];
  if (!pure && bank.length && Math.random() < 0.35) {
    const item = bank[Math.floor(Math.random() * bank.length)];
    const q = JSON.parse(JSON.stringify(item.q));
    if (q.kind !== "groups" && Array.isArray(q.options)) {
      q.options = shuffle(q.options);
    }
    return { ...q, review: true, sig: item.sig };
  }
  return track.gen(lvlOverride ?? p.lvl);
}

/** Aquecimento (Parte E): as 2 primeiras questões vêm um nível abaixo — vitória fácil de entrada. */
const WARMUP_QUESTIONS = 2;
const warmupLvl = (lvl: number) => Math.max(1, lvl - 1);

const shuffle = (arr: any[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

import { trackMisconception } from "../utils/radarEngine";

export function GameLoop({
  kid,
  track,
  prog0,
  sound,
  onToggleSound,
  onCommit,
  onExit,
  onAlbum,
  stage,
  firstMissionToday = false,
  exactLvl = false,
}: GameProps) {
  const [idx, setIdx] = useState(0);
  const [t0, setT0] = useState(() => Date.now());
  const [prog, setProg] = useState<Progress>(() => ({ ...prog0 }));
  const [q, setQ] = useState<Question>(() => drawQuestion(track, prog0, exactLvl ? prog0.lvl : warmupLvl(prog0.lvl), exactLvl));
  const [status, setStatus] = useState<"right" | "wrong" | null>(null);
  const [sel, setSel] = useState<any>(null);
  const [stars, setStars] = useState(0);
  const [ok, setOk] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [done, setDone] = useState(false);
  const [bonus, setBonus] = useState(0);
  const [replays, setReplays] = useState(0);
  // Fluidez: guarda a transição pendente para a criança PULAR com um toque
  const advanceRef = useRef<null | (() => void)>(null);
  const lastSpokenPromptRef = useRef<string | null>(null);

  // Pula na hora: corta a voz e vai para a próxima (criança no comando do ritmo)
  
  const advanceNow = () => {
    if (!advanceRef.current) return;
    stopSpeak();
    const go = advanceRef.current;
    advanceRef.current = null;
    go();
  };

  // Sair da tela = voz morre NA HORA (o app não pode continuar falando fora dele)
  useEffect(() => () => stopSpeak(), []);

  // AI Tutor states
    const [guidedIdx, setGuidedIdx] = useState<number | null>(null);
  const [mockTutorialN, setMockTutorialN] = useState<number | null>(null);

  useEffect(() => {
    if (guidedIdx === null) setMockTutorialN(null);
  }, [guidedIdx]);
  const [qErrors, setQErrors] = useState(0);
  const [hiddenOpts, setHiddenOpts] = useState<any[]>([]);
  const [showClockTutorial, setShowClockTutorial] = useState(false);
  // kind `order` (ordenar/sequenciar): a criança toca as cenas na ordem certa
  const [orderTaps, setOrderTaps] = useState<any[]>([]);
    const [orderShake, setOrderShake] = useState<any>(null);
  // kind `flash` (subitização): o grupo aparece por ~2s e some — "quantos eram?"
  const [flashHidden, setFlashHidden] = useState(false);
  // tutorial guiado 👉 generalizado: legenda do passo atual (null = parado)
  const [guidedNarr, setGuidedNarr] = useState<string | null>(null);
  // aula com IMAGENS: cena que o passo atual do tutorial manda mostrar (null = a da questão)
  const [tutShow, setTutShow] = useState<Record<string, any> | string | number | null>(null);
  // kind `journey` (viagem narrada): true quando a viagem terminou e a pergunta aparece
  const [journeyDone, setJourneyDone] = useState(false);
  // TOQUE DUPLO inteligente (auditoria HCI-Kids): em questões audíveis, o 1º toque
  // numa opção só OUVE e arma (borda amarela); o 2º toque na MESMA opção confirma.
  // Mata o 🔊 microscópico: a criança nunca mais é penalizada por pontaria.
  const [armedOpt, setArmedOpt] = useState<any>(null);
  // AULINHA 🎬: banner de re-oferta (após 2 erros seguidos) + fim-de-aula + 1ª visita
  const [aulaSuggest, setAulaSuggest] = useState(false);
  const wrongStreakRef = useRef(0);
  const aulaEndRef = useRef<null | (() => void)>(null);
  const qRef = useRef<Question>(q);

  useEffect(() => {
    if (q.rt_max_s && !status && !done && (q.kind !== 'journey' || journeyDone)) {
      setTimeLeft(q.rt_max_s);
      const iv = setInterval(() => {
        setTimeLeft((v) => {
          if (v && v > 1) return v - 1;
          clearInterval(iv);
          return 0;
        });
      }, 1000);
      return () => clearInterval(iv);
    } else {
      setTimeLeft(null);
    }
  }, [q, status, done, journeyDone]);

  useEffect(() => {
    if (timeLeft === 0 && !status && !done) {
      handlePick('__timeout__', false);
    }
  }, [timeLeft, status, done]);

  qRef.current = q;
  // timers das aulinhas: registrados aqui e LIMPOS ao trocar de questão (aula nunca
  // "vaza" para a questão seguinte falando números da anterior)
  const aulaTimersRef = useRef<{ t: number[]; i: number[] }>({ t: [], i: [] });
  const aulaT = (f: () => void, ms: number) => { aulaTimersRef.current.t.push(window.setTimeout(f, ms)); };
  const aulaI = (f: () => void, ms: number) => { const id = window.setInterval(f, ms); aulaTimersRef.current.i.push(id); return id; };
  const stopAulaTimers = () => {
    aulaTimersRef.current.t.forEach((id) => clearTimeout(id));
    aulaTimersRef.current.i.forEach((id) => clearInterval(id));
    aulaTimersRef.current = { t: [], i: [] };
  };
  // decidida UMA vez na montagem: a 1ª questão da missão ganha aula automática se a
  // criança nunca viu a aulinha deste kind (depois disso, só botão/algoritmo)
  const [autoAula, setAutoAula] = useState(() => hasAulinha(q) && !aulaSeen(kid.id, q.kind));
  const [promptDone, setPromptDone] = useState(!sound);
  
  // Update autoAula state on question change
  useEffect(() => {
    setAutoAula(idx === 0 ? (hasAulinha(q) && !aulaSeen(kid.id, q.kind)) : false);
    setPromptDone(!sound);
  }, [q, idx, kid.id]);

  useEffect(() => {
    applyTheme(kid.theme);
    pickVoice();
  }, [kid.theme]);

  // reset do sequenciamento a cada questão nova (+ mata timers de aulinha em curso)
  useEffect(() => {
    setOrderTaps([]);
    setOrderShake(null);
    setGuidedNarr(null);
    setTutShow(null);
    setJourneyDone(false);
    stopAulaTimers();
    setGuidedIdx(null);
    setQErrors(0);
    setHiddenOpts([]);
    answeredRef.current = false;
    setArmedOpt(null);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tutorial guiado 👉 (generalizado): toca os passos narrados do kind, um a um,
  // com a cena visível. A mãozinha do Contar, agora para qualquer cena nova.
  const startGuidedTutorial = (isAuto: boolean = true) => {
    if (guidedNarr !== null || status) return;
    const steps = tutorialSteps(q);
    if (!steps.length) return;
    sfx.level();
    const q0 = qRef.current;
    let i = 0;
    const play = () => {
      if (qRef.current !== q0) return; // a questão mudou no meio: aula morta
      if (i >= steps.length) {
        setGuidedNarr(null);
        setTutShow(null);
        fireAulaEnd();
        return;
      }
      const st = steps[i++];
      setGuidedNarr(st.say);
      setTutShow(st.show ?? null);
      if (sound) {
        // o próximo passo SÓ entra quando a fala deste TERMINA (nunca corta no meio)
        speak(st.say, { ...(q.lang ? { lang: q.lang } : {}), onEnd: () => aulaT(play, 550) });
      } else {
        aulaT(play, st.ms ?? Math.max(2000, st.say.length * 65));
      }
    };
    play();
  };

  /* ---------------- AULINHA 🎬 (orquestração do momento 0) ----------------
     Uma porta única para TODA mini-aula (mãozinha animada dos kinds antigos ou
     passos narrados dos novos). Regras (pedido do Zeus): automática na 1ª visita
     ao kind; botão "ver de novo" sempre; re-oferta após 2 erros seguidos. */

  // avisa quem estiver esperando o fim da aula (ex.: falar o enunciado depois dela)
  const fireAulaEnd = () => {
    const f = aulaEndRef.current;
    aulaEndRef.current = null;
    if (f) f();
  };

  const playAulinha = (isAuto: boolean = false) => {
    if (status) return;
    setAulaSuggest(false);
    markAulaSeen(kid.id, q.kind);
    if (q.kind === "count") startGuidedCount(isAuto);
    else if (q.kind === "sum") startGuidedSum(isAuto);
    else if (q.kind === "subvis") startGuidedSubvis(isAuto);
    else if (q.kind === "tens") startGuidedTens(isAuto);
    else startGuidedTutorial(isAuto);
  };

  // 1ª visita ao kind: a aulinha toca SOZINHA (cena montada primeiro) e o enunciado
  // é falado DEPOIS dela — nunca antes (senão a aula cortaria a fala no meio)
  useEffect(() => {
    if (!autoAula) return;
    const t = setTimeout(() => {
      const q0 = qRef.current;
      aulaEndRef.current = () => {
        // só fala o enunciado se ainda estamos na MESMA questão, sem resposta dada
        if (sound && qRef.current === q0 && !advanceRef.current) {
          setTimeout(() => { speak(qSpeech(q0, true), q0.lang ? { lang: q0.lang } : {}); lastSpokenPromptRef.current = q0.kind + "|" + q0.prompt; }, 350);
        }
      };
      playAulinha(true);
    }, 800);
    return () => clearTimeout(t);
  }, [autoAula]); // eslint-disable-line react-hooks/exhaustive-deps

  // gancho de verificação (?e2e=1): expõe a questão atual pro harness dirigir os
  // cliques (respostas certas/erradas de propósito). Inócuo em produção.
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.location.search.includes("e2e=1")) { (window as any).__q = q; (window as any).__idx = idx; }
    } catch (e) {}
  }, [q]);

  // flash (subitização): mostra o grupo por um relance, depois esconde.
  // Tempo curto (e menor em níveis altos) para treinar reconhecer SEM contar.
  const peekMs = (q.n ?? 0) <= 3 ? 2000 : (q.n ?? 0) <= 5 ? 1700 : 1400;
  useEffect(() => {
    if (q.kind !== "flash") return;
    setFlashHidden(false);
    const t = setTimeout(() => setFlashHidden(true), peekMs);
    return () => clearTimeout(t);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  // "Ver de novo": re-mostra o grupo por um instante (gentil — a faixa é pequena
  // de propósito, então reolhar não vira contagem lenta).
  const peekAgain = () => {
    if (status) return;
    if (sound) sfx.tick();
    setFlashHidden(false);
    setTimeout(() => setFlashHidden(true), 1200);
  };

  const handleOrderTap = (value: any) => {
    if (status) return;
    const seq = q.answer as any[];
    const expected = seq[orderTaps.length];
    if (value === expected) {
      const nt = [...orderTaps, value];
      setOrderTaps(nt);
      if (sound) sfx.tick();
      if (nt.length === seq.length) handlePick(value, true); // completou → resolve
    } else {
      // toque fora de ordem: sacode, marca erro (conta como bad) e recomeça — nunca trava
            setOrderShake(value);
      if (sound) sfx.wrong();
      setTimeout(() => {
        setOrderTaps([]);
        setOrderShake(null);
      }, 450);
    }
  };

  useEffect(() => {
    // journey narra sozinho; na 1ª visita com aulinha automática, a AULA vem primeiro
    // e o enunciado é falado ao fim dela (ver efeito da aulinha)
    if (sound && !done && !status && q.kind !== "journey" && !autoAula) {
      // "como fazer" só na 1ª questão da missão; depois vai direto ao enunciado
      const speechId = q.kind + "|" + q.prompt;
      if (lastSpokenPromptRef.current !== speechId) {
        lastSpokenPromptRef.current = speechId;
        speak(qSpeech(q, idx === 0), { ...(q.lang ? { lang: q.lang } : {}), onEnd: () => setPromptDone(true) });
      }
    }
  }, [q, done, autoAula]); // eslint-disable-line react-hooks/exhaustive-deps

  // journey: ao terminar a viagem, faz a pergunta de reconhecimento
  useEffect(() => {
    if (journeyDone && sound && !status) speak(q.prompt);
  }, [journeyDone]); // eslint-disable-line react-hooks/exhaustive-deps

  // 🪙 moedinhas da missão: 1 por acerto + 3 por completar + 5 na primeira do dia
  // (no "jogar de novo" da mesma tela, o bônus de primeira missão não se repete)
  const coinsEarned = ok + 3 + (firstMissionToday && replays === 0 ? 5 : 0);

  useEffect(() => {
    if (sound && done) {
      sfx.fanfare();
      speak(`Parabéns! Missão completa! Você ganhou ${stars} estrelas e ${coinsEarned} moedinhas!`);
    }
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  // trava SÍNCRONA anti-spam de toque (auditoria: 2 toques no mesmo tick passavam
  // pelo `status` ainda nulo e gravavam progresso em dobro / pulavam questões)
  const answeredRef = useRef(false);

  const handlePick = (val: any, forcedRight?: boolean) => {
    if (status || answeredRef.current) return;
    
    // forcedRight: usado por interações que decidem o acerto por conta própria (ex.: `order`)
    const right = forcedRight !== undefined ? forcedRight : val === q.answer;

    // --- CAMADA 1 (Erro Suave) ---
    // Apenas se errou E for uma questão com opções simples (ou grupos)
    if (!right && val !== '__timeout__' && (q.options || q.groups)) {
      if (qErrors === 0) {
        setQErrors(1);
        setHiddenOpts((prev) => [...prev, val]);
        if (sound) sfx.wrong();
        speak("Ops, não é esse. Olha de novo!");
        setToast("Olha de novo! 👀");
        setTimeout(() => setToast(null), 2500);
        return; // não avança, não marca answeredRef
      }
      if (qErrors === 1) {
        setQErrors(2);
        setHiddenOpts((prev) => [...prev, val]);
        if (sound) sfx.wrong();
        const dica = q.explain || "Tente com cuidado!";
        speak("Quase! " + dica);
        setToast("Dica: " + dica);
        setTimeout(() => setToast(null), 4000);
        return; // não avança, não marca answeredRef
      }
      // Se errou a 3ª vez, segue pro erro terminal e avança
      
      // Registra a misconception no Radar se houver e estiver mapeada nas opções
      const pickedOpt = q.options.find((o: any) => o.value === val);
      if (pickedOpt && pickedOpt.misconception) {
        trackMisconception(kid.id, track.graphId || track.id, pickedOpt.tag || pickedOpt.misconception);
      }
    }

    answeredRef.current = true;
    const p = { ...prog, bank: [...(prog.bank || [])] };
    p.tot++;
    let currentToast = null;

    // AULINHA 🎬: 2 erros seguidos na missão → o algoritmo re-oferece a mini-aula
    if (right) {
      wrongStreakRef.current = 0;
      setAulaSuggest(false);
    } else {
      wrongStreakRef.current++;
      if (wrongStreakRef.current >= 2 && hasAulinha(q)) setAulaSuggest(true);
    }

    if (right) {
      p.ok++;
      // bolinha conquistada só com ACERTO no nível (pular de nível pelo seletor 🎯 não pinta bolinha de graça)
      p.maxLvl = Math.max(p.maxLvl || 1, p.lvl);
      p.streak++;
      p.bad = 0;
      if (p.streak >= 3 && p.lvl < 5) {
        p.lvl++;
        p.streak = 0;
        p.maxLvl = Math.max(p.maxLvl || 1, p.lvl);
        currentToast = `Subiu para o nível ${p.lvl}! 🚀`;
      } else if (p.streak >= 3 && p.lvl === 5 && !p.dom) {
        // Domínio Absoluto 👑: coroou o nível máximo da trilha (nunca se perde)
        p.dom = true;
        currentToast = "DOMÍNIO ABSOLUTO! 👑✨";
      }
    } else {
      p.streak = 0;
      // Aquecimento: erro nas 2 primeiras questões só ajusta o ritmo — nunca rebaixa
      if (idx >= WARMUP_QUESTIONS) {
        p.bad++;
        // Frustration Engine (Camada 3): Downgrade após 3 erros
        if (p.bad >= 3 && p.lvl > 1) {
          p.lvl--;
          p.bad = 0;
          currentToast = "Vamos voltar um passinho para treinar! 💪";
        }
      }
    }

    // AI smart review: mastering a missed question after 2 hits
    if (q.review) {
      const bi = p.bank.findIndex((b) => b.sig === q.sig);
      if (bi >= 0) {
        if (right) {
          const hits = (p.bank[bi].hits || 0) + 1;
          if (hits >= 2) {
            p.bank.splice(bi, 1);
            p.mast = (p.mast || 0) + 1;
            if (!currentToast) currentToast = "Você dominou essa! 🧠✨";
          } else {
            p.bank[bi] = { ...p.bank[bi], hits };
          }
        } else {
          p.bank[bi] = { ...p.bank[bi], hits: 0 };
        }
      }
    } else if (!right) {
      const sig = qSig(q);
      if (!p.bank.some((b) => b.sig === sig)) {
        p.bank.push({ sig, hits: 0, q: sanitizeQ(q) });
        if (p.bank.length > 10) p.bank.shift();
      }
    }

    const durationMs = Math.min(30000, Math.max(0, Date.now() - t0));

    // ⭐ XP vitalício e Nivelamento por Velocidade (Dojo)
    let starGain = 0;
    if (right) {
      if (q.kind === "rapid-fire") {
        if (durationMs <= 3000) starGain = 15; // Genialidade (Subitização mental)
        else if (durationMs <= 10000) starGain = 5; // Mediano
        else starGain = 2; // Contando nos dedos
      } else {
        starGain = 1;
      }
    }
    
    const nextStars = stars + starGain;
    const nextOk = ok + (right ? 1 : 0);
    const isLast = idx === totalQFor(track) - 1;
    let nextBonus = 0;

    p.stars = (p.stars || 0) + starGain;

    if (isLast && nextOk === totalQFor(track)) {
      nextBonus = 5;
      p.stars += 5;
    }

    // E1 (Professor Mágico): telemetria da habilidade — quando praticou + fluência real.
    // O rt é média móvel (70% história, 30% agora): rápido = automatizado; lento = dedos.
    p.lastDay = new Date().toISOString().slice(0, 10);
    p.rt = Math.round(p.rt ? p.rt * 0.7 + durationMs * 0.3 : durationMs);
    
    // Fast level up for rapid-fire
    if (right && q.kind === "rapid-fire" && durationMs <= 3000 && p.lvl < 5) {
      // Speed bonus helps level up faster
      if (p.streak < 3) p.streak = 3; 
    }

    if (!q.isFallback) {
      onCommit(p, right, starGain + nextBonus, durationMs, isLast);
    }

    if (sound) {
      if (right) sfx.right();
      else sfx.wrong();
      if (currentToast && currentToast.startsWith("Subiu")) sfx.level();
    }

    const activeTheme = THEMES[kid.theme] || THEMES.classico;
    const praises = activeTheme.praise || PRAISE;
    // Ao ACERTAR: elogio CURTO e rápido (fluidez — a criança que sabe não espera).
    // O elogio TEMÁTICO (divertido/longo) é RARO de propósito: só no 1º acerto da
    // missão (auditoria do Zeus: elogio maluco toda hora cansa e vira ruído).
    // Ao ERRAR: o momento de ensino — mostra/fala o PORQUÊ (explain).
    const SHORT_OK = ["Isso! 🎉", "Muito bem! ⭐", "Boa! 👏", "Acertou! 🌟", "Perfeito! ✨"];
    const firstOkOfMission = right && ok === 0;
    const baseFb = right
      ? (firstOkOfMission ? praises[Math.floor(Math.random() * praises.length)] : SHORT_OK[Math.floor(Math.random() * SHORT_OK.length)])
      : OOPS[Math.floor(Math.random() * OOPS.length)];
    const showExplain = !!q.explain && !right;
    const fb = showExplain ? `${baseFb} ${q.explain}` : baseFb;

    setProg(p);
    setStatus(right ? "right" : "wrong");
    setSel(val);
    setToast(currentToast);
    setMsg(fb);
    

    setOk(nextOk);
    setStars(nextStars);

    let transitioned = false;
    const doTransition = () => {
      if (transitioned) return; // não roda duas vezes (voz terminou E/OU criança pulou)
      transitioned = true;
      advanceRef.current = null;
      setGuidedIdx(null);
      if (isLast) {
        setDone(true);
        setStars(nextStars + nextBonus);
        setBonus(nextBonus);
        setToast(null);
      } else {
        const nextIdx = idx + 1;
        setIdx(nextIdx);
        setT0(Date.now());
        setQ(drawQuestion(track, p, exactLvl ? p.lvl : nextIdx < WARMUP_QUESTIONS ? warmupLvl(p.lvl) : p.lvl, exactLvl));
        setStatus(null);
        setSel(null);
        setToast(null);
        setMsg(null);
      }
    };

    // A criança pode PULAR a qualquer momento tocando na tela (ver advanceNow)
    advanceRef.current = doTransition;

    if (sound) {
      speak(fb, {
        pitch: right ? 1.3 : 1.05,
        onEnd: () => {
          // acerto: passa quase na hora; erro com explicação: respira mais
          setTimeout(() => advanceRef.current && advanceRef.current(), showExplain ? 700 : right ? 250 : 500);
        }
      });
      // rede de segurança: se a voz falhar TOTALMENTE, o app não trava (tempo folgado
      // pra jamais atropelar uma explicação em curso; o botão Avançar segue na tela).
      // Só dispara se AINDA formos a transição pendente (nunca a da próxima questão).
      setTimeout(() => { if (advanceRef.current === doTransition) doTransition(); }, showExplain ? 18000 : 8000);
    } else {
      // sem som, dá tempo de LER a explicação antes de passar
      setTimeout(() => advanceRef.current && advanceRef.current(), showExplain ? 3200 : right ? 900 : 1600);
    }
  };

  /* Corpo comum das mãozinhas que CONTAM (contar/somar/tirar): a intro NARRADA
     explica o conceito com o dedo já no 1º item; a contagem só começa quando a
     intro TERMINA de verdade (onEnd — nunca timer fixo cortando fala); a frase
     final fecha com a cardinalidade (o último número é o total). */
  const runCountAula = (total: number, intro: string, finale: string, isAuto: boolean, isMock: boolean = false) => {
    if (guidedIdx !== null || total <= 0) return;
    sfx.level();
    const q0 = qRef.current;
    setGuidedIdx(0);
    let current = 0;
    
    // Se for um pedido de ajuda (não automático) E tiver mais de 2 itens,
    // o mascote só conta os dois primeiros (Scaffold) e encoraja a criança a continuar.
    const shouldScaffold = !isAuto && total > 2 && !isMock;
    const limit = (shouldScaffold && !isMock) ? 2 : total;
    
    speak(`${intro} ... Um!`, {
      onEnd: () => {
        if (qRef.current !== q0) return; // a questão mudou no meio: aula morta
        const id = aulaI(() => {
          current++;
          if (current < limit) {
            setGuidedIdx(current);
            speak(numPt(current + 1) + "!");
            sfx.tick();
          } else {
            clearInterval(id);
            setGuidedIdx(null);
            if (shouldScaffold) {
               aulaT(() => speak("Agora continue você!", { onEnd: fireAulaEnd }), 400);
            } else {
               aulaT(() => speak(finale, { onEnd: fireAulaEnd }), 700);
            }
          }
        }, 1150);
      },
    });
  };

  const startGuidedCount = (isAuto: boolean = true) => {
    const realN = q.n || 3;
    const mockN = realN === 3 ? 4 : 3;
    setMockTutorialN(mockN);
    runCountAula(
      mockN,
      "Veja como a gente conta! Aponte um por um:",
      `... então são ${numPt(mockN).toLowerCase()}! O último número é o total! Agora é sua vez!`,
      isAuto,
      true
    );
  };
  const startGuidedSum = (isAuto: boolean = true) => {
    const total = (q.a || 0) + (q.b || 0);
    runCountAula(
      total,
      "Somar é JUNTAR os dois grupos! Vamos contar tudo, um por um:",
      `${q.a} mais ${q.b}... contamos tudo junto: ${total}! 🎉`,
      isAuto
    );
  };

  const startGuidedSubvis = (isAuto: boolean = true) => {
    const remains = (q.a || 0) - (q.b || 0);
    runCountAula(
      remains,
      "Tirar é ver o que SOBRA! Os riscados foram embora. Vamos contar só o que ficou:",
      `Tiramos ${q.b} e sobraram ${remains}! 🎉`,
      isAuto
    );
  };

  const startGuidedTens = (isAuto: boolean = true) => {
    if (guidedIdx !== null) return;
    sfx.level();
    const q0 = qRef.current;
    setGuidedIdx(0); // 0 = destaca as dezenas
    const numTens = q.t || 0;
    const numUnits = q.u || 0;
    speak(`Aqui temos ${numTens} ${numTens > 1 ? "dezenas" : "dezena"}, que vale ${numTens * 10}!`, {
      onEnd: () => {
        if (qRef.current !== q0) return;
        aulaT(() => {
          setGuidedIdx(1); // 1 = destaca as unidades
          speak(`E mais ${numUnits} ${numUnits !== 1 ? "unidades" : "unidade"}.`, {
            onEnd: () => {
              if (qRef.current !== q0) return;
              aulaT(() => {
                setGuidedIdx(null);
                speak(`Tudo junto forma o número ${numTens * 10 + numUnits}!`, { onEnd: fireAulaEnd });
              }, 600);
            },
          });
        }, 600);
      },
    });
  };

  

  const restart = () => {
    setReplays((r) => r + 1);
    setIdx(0);
    setT0(Date.now());
    setQ(drawQuestion(track, prog, exactLvl ? prog.lvl : warmupLvl(prog.lvl), exactLvl));
    setStatus(null);
    setSel(null);
    setStars(0);
    setOk(0);
    setToast(null);
    setMsg(null);
    setDone(false);
    setBonus(0);
    
  };

  if (done) {
    return (
      <div className="mk-pop text-center mt-10">
        <Burst />
        <div className="mk-bounce mb-3">
          <Mascote theme={kid.theme} size={112} />
        </div>
        <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, color: C.ink }}>
          Aventura Concluída!
        </div>
        <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.sunDark, marginTop: 10 }}>
          +{stars} ⭐{bonus > 0 && <span style={{ fontSize: 16, color: C.mintDark }}> (bônus especial!)</span>}
        </div>
        <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: "#9A3412", marginTop: 4 }}>
          +{coinsEarned} 🪙{firstMissionToday && <span style={{ fontSize: 14, color: C.mintDark }}> (primeira missão do dia! +5)</span>}
        </div>
        <div style={{ color: C.sub, fontWeight: 800, fontSize: 16, marginTop: 6 }}>
          {ok} de {totalQFor(track)} acertos!
        </div>

        <div className="mt-8 flex flex-col gap-3.5">
          {track.id !== "matricula" && (
            <button
              onClick={() => {
                sfx.tick();
                restart();
              }}
              className="w-full relative overflow-hidden select-none transition-all cursor-pointer active:translate-y-1 py-4 text-xl text-white font-bold"
              style={{
                fontFamily: FONT,
                background: C.mint,
                boxShadow: `0 6px 0 ${C.mintDark}`,
                border: "none",
                borderRadius: 8,
              }}
            >
              Jogar de novo 🔁
            </button>
          )}

          <button
            onClick={() => {
              sfx.tick();
              onAlbum();
            }}
            className="w-full relative overflow-hidden select-none transition-all cursor-pointer active:translate-y-1 py-3.5 text-lg text-white font-bold"
            style={{
              fontFamily: FONT,
              background: C.pink,
              boxShadow: `0 5px 0 ${C.pinkDark}`,
              border: "none",
              borderRadius: 8,
            }}
          >
            Trocar por Amiguinhos 🎁
          </button>

          <button
            onClick={() => {
              sfx.tick();
              onExit();
            }}
            className="w-full py-3.5 text-lg font-bold select-none cursor-pointer border-2 transition-all active:translate-y-0.5"
            style={{
              fontFamily: FONT,
              background: C.card,
              color: C.ink,
              borderColor: C.line,
              boxShadow: `0 4px 0 ${C.line}`,
              borderRadius: 8,
            }}
          >
            Ver Outros Jogos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mk-pop text-left">
      {toast && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-50 text-white font-bold text-sm px-5 py-2.5 rounded-md shadow-lg border-b-4"
          style={{
            top: 18,
            animation: "mkToast 2s ease both",
            background: C.grape,
            borderColor: C.grapeDark,
          }}
        >
          {toast}
        </div>
      )}

      {/* Game navigation header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          onClick={() => {
            sfx.tick();
            onExit();
          }}
          className="w-11 h-11 flex items-center justify-center font-bold text-lg select-none cursor-pointer border-2 active:translate-y-0.5 rounded-md"
          style={{
            background: C.card,
            color: C.ink,
            borderColor: C.line,
            boxShadow: `0 4px 0 ${C.line}`,
          }}
        >
          ✕
        </button>
        <ProgressBar idx={idx} total={totalQFor(track)} />
        <SoundBtn on={sound} onToggle={onToggleSound} />
        <StarChip n={stars} />
      </div>

      {/* Narrative Mascot Header Row */}
      <div className="mb-4 flex items-start gap-3">
        <div className={`w-14 flex-shrink-0 cursor-pointer ${status === "right" ? "mk-bounce" : ""}`}>
          <Mascote 
            theme={kid.theme} 
            stage={stage} 
            size={54} 
            kid={kid} 
            animation={status === "right" ? "happy" : status === "wrong" ? "idle" : "walk"}
            className="hover:scale-105 active:scale-95 transition-all" 
          />
        </div>
        <div
          onClick={() => {
            if (status) advanceNow(); // já respondeu → tocar no balão pula para a próxima
            else if (sound) speak(qSpeech(q), q.lang ? { lang: q.lang } : {}); // ainda não → repete o enunciado (no idioma certo!)
          }}
          className="flex-1 cursor-pointer transition-all active:scale-[0.99]"
          style={{
            background: status === "right" ? "#E9FBF0" : status === "wrong" ? "#FFF4F4" : C.card,
            border: `3px solid ${
              status === "right" ? C.mint : status === "wrong" ? C.melon : C.line
            }`,
            borderRadius: 18,
            padding: "10px 14px",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 17,
            color: status === "right" ? C.mintDark : status === "wrong" ? C.melonDark : C.ink,
          }}
        >
          {status ? msg : q.prompt}
        </div>

        
      </div>

      {q.review && !status && (
        <div className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-md text-xs font-bold mb-3">
          🧠 Prática Espaçada / Revisão Inteligente
        </div>
      )}

      <div className="relative">
        {status === "right" && <Burst />}
        {q.kind === "rapid-fire" && <RapidFire q={q} onAnswer={handlePick} disabled={status !== null} timeLeft={timeLeft} />}
        {q.kind === "singapore-bars" && <SingaporeBars q={q} onAnswer={handlePick} disabled={status !== null} />}
        {q.kind !== "rapid-fire" && q.kind !== "singapore-bars" && (
          <>
        {/* Dynamic Canvas Area (escondida no `order`: as próprias peças são a cena) */}
        <div className="mk-pop" style={{ background: C.card, borderRadius: 24, boxShadow: `0 6px 0 ${C.line}`, padding: "20px 14px", ...(q.kind === "order" || q.kind === "groups" ? { display: "none" } : {}) }}>
          {q.uiProps ? (
            <FichaRenderer key={idx} question={q} onAnswer={handlePick} disabled={status !== null} promptDone={promptDone} />

          ) : (
            <>
              {q.kind === "count" && q.emoji && q.n != null && (
            <div className="flex flex-col items-center gap-3">
              <EmojiRow emoji={q.emoji} n={mockTutorialN !== null ? mockTutorialN : q.n} highlightIndex={guidedIdx} />                                        
            </div>
          )}
          {q.kind === "subvis" && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-wrap justify-center gap-2">
                {q.emoji && <EmojiRow emoji={q.emoji} n={(q.a || 0) - (q.b || 0)} startIndex={1} highlightIndex={guidedIdx !== null && guidedIdx < ((q.a || 0) - (q.b || 0)) ? guidedIdx : null} />}
                {q.emoji && <EmojiRow emoji={q.emoji} n={q.b || 0} startIndex={(q.a || 0) - (q.b || 0) + 1} crossedOut={true} highlightIndex={guidedIdx !== null && guidedIdx >= ((q.a || 0) - (q.b || 0)) ? guidedIdx - ((q.a || 0) - (q.b || 0)) : null} />}
              </div>
              <div className="mt-2">
                {q.expr && <BigText size={34}>{q.expr}</BigText>}
              </div>
            </div>
          )}
          {q.kind === "sum" && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-wrap justify-center gap-2">
                {q.emoji && <EmojiRow emoji={q.emoji} n={q.a || 0} startIndex={1} highlightIndex={guidedIdx !== null && guidedIdx < (q.a || 0) ? guidedIdx : null} />}
                {q.emoji && <EmojiRow emoji={q.emoji} n={q.b || 0} startIndex={(q.a || 0) + 1} highlightIndex={guidedIdx !== null && guidedIdx >= (q.a || 0) ? guidedIdx - (q.a || 0) : null} state="acerto" />}
              </div>
              <div className="mt-2">
                {q.expr && <BigText size={34}>{q.expr}</BigText>}
              </div>
            </div>
          )}


          {q.kind === "pattern" && q.shown && (
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {q.shown.map((e, i) => (
                <div
                  key={i}
                  className="mk-pop"
                  style={{
                    animationDelay: `${i * 80}ms`,
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: C.soft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                  }}
                >
                  <span className="m-auto">{e}</span>
                </div>
              ))}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  border: `3px dashed ${C.grape}`,
                  color: C.grape,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT,
                  fontSize: 26,
                  fontWeight: 700,
                }}
              >
                ?
              </div>
            </div>
          )}

          {q.kind === "math" && q.expr && (
            <BigText>{q.expr}</BigText>
          )}

          {q.kind === "plain" && q.big && (
            <BigText>{status === "right" && q.bigCompleted ? q.bigCompleted : q.big}</BigText>
          )}

          {q.kind === "clock" && q.hour != null && q.minute != null && (
            <div className="flex flex-col items-center gap-4 py-2 select-none">
              <div className="relative w-44 h-44 rounded-md border-6 bg-white shadow-lg flex items-center justify-center transition-all" style={{ borderColor: C.line }}>
                {/* Clock rim accent */}
                <div className="absolute inset-2 rounded-md border border-dashed border-slate-200" />
                
                {/* Clock numbers */}
                {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, idx) => {
                  const angle = (idx * 30 * Math.PI) / 180;
                  const radius = 62; // radius of clock numbers layout
                  const x = Math.sin(angle) * radius;
                  const y = -Math.cos(angle) * radius;
                  return (
                    <span
                      key={num}
                      className="absolute text-sm font-black text-slate-800"
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                        fontFamily: FONT,
                      }}
                    >
                      {num}
                    </span>
                  );
                })}
                
                {/* Clock hands */}
                {/* Hour Hand */}
                <div
                  className="absolute bottom-1/2 left-1/2 w-2 h-11 bg-slate-900 rounded-md origin-bottom"
                  style={{
                    transform: `translate(-50%, 0) rotate(${((q.hour % 12) * 30) + (q.minute * 0.5)}deg)`,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                  }}
                />
                {/* Minute Hand */}
                <div
                  className="absolute bottom-1/2 left-1/2 w-1.5 h-16 bg-indigo-500 rounded-md origin-bottom"
                  style={{
                    transform: `translate(-50%, 0) rotate(${q.minute * 6}deg)`,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                  }}
                />
                
                {/* Center Pin */}
                <div className="absolute w-4.5 h-4.5 bg-red-500 rounded-md border-3 border-white shadow-md z-10" />
              </div>

              {/* Interactive Pedagogical Tutorial Button */}
              {!status && (
                <button
                  onClick={() => {
                    sfx.level();
                    setShowClockTutorial(true);
                    if (sound) {
                      speak("O ponteiro pequeno mostra as horas, e o ponteiro grande mostra os minutos! Se o ponteiro grande estiver no doze, é uma hora exata. Se estiver no seis, é meia hora, ou seja, trinta minutos!");
                    }
                  }}
                  className="mt-2 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-800 font-extrabold text-xs px-4 py-2 rounded-md flex items-center gap-1.5 active:scale-95 transition-all shadow-md cursor-pointer"
                  style={{ fontFamily: FONT }}
                >
                  <span>🧭 Como Ler o Relógio? (Aprender Rápido!) 💡</span>
                </button>
              )}
            </div>
          )}

          {q.kind === "tens" && q.t != null && q.u != null && (
            <div className="flex flex-col items-center gap-3">
              <TensDots t={q.t} u={q.u} highlightIndex={guidedIdx} />
              
            </div>
          )}

          {q.kind === "blend" && q.shown && q.shown.length === 2 && (
            <SyllableScene
              c={q.shown[0]}
              v={q.shown[1]}
              syllable={String(q.answer).toLowerCase()}
              revealed={status !== null}
              right={status === "right"}
            />
          )}

          {/* Durante a AULINHA, o passo pode trocar a cena (tutShow): a imagem acompanha a voz */}
          {q.kind === "weather" && q.big && (
            <div className="flex justify-center"><WeatherScene type={(tutShow ?? q.big) as Weather} /></div>
          )}

          {q.kind === "grow" && q.n != null && (
            <div className="flex justify-center"><GrowthScene stage={(tutShow ?? q.n) as 1 | 2 | 3 | 4} /></div>
          )}

          {q.kind === "daypart" && q.big && (
            <div className="flex justify-center"><DayPartScene type={(tutShow ?? q.big) as DayPart} /></div>
          )}

          {q.kind === "emotion" && q.big && (
            <div className="flex justify-center"><EmotionScene type={(tutShow ?? q.big) as Emotion} /></div>
          )}

          {q.kind === "lifestage" && q.n != null && (
            <div className="flex justify-center"><PersonLifeScene stage={(tutShow ?? q.n) as 1 | 2 | 3 | 4} /></div>
          )}

          {q.kind === "animal" && q.n != null && (
            <div className="flex justify-center"><AnimalLifeScene stage={(tutShow ?? q.n) as 1 | 2 | 3 | 4} /></div>
          )}

          {q.kind === "array" && <ArrayGrid q={q} />}
          {q.kind === "bond" && q.a != null && q.b != null && (
            <NumberBond whole={q.a} part={q.b} missingWhole={q.big === "topo"} />
          )}

          {q.kind === "numberline" && <NumberLine min={q.nlStart} max={q.nlEnd} targetValue={q.nlTarget} currentValue={typeof tutShow === "number" ? tutShow : (q.nlStartPos ?? null)} onValueClick={status === null ? handlePick : undefined} />}
          {q.kind === "numberline-interactive" && <InteractiveNumberLine q={q} onAnswer={handlePick} disabled={status !== null} />}
          {q.kind === "drag-group" && <DragGroup q={q} onAnswer={handlePick} disabled={status !== null} />}
          {q.kind === "visual-addition" && q.a != null && q.b != null && <VisualAddition a={q.a} b={q.b} emojiA={q.uiProps?.emojiA || q.emoji} emojiB={q.uiProps?.emojiB || q.emoji} showNumbers={q.uiProps?.showNumbers !== false} />}
          {q.kind === "scattered" && q.n != null && <ScatteredItems n={q.n} emoji={q.emoji || "⭐"} ordered={q.uiProps?.ordered} />}
          {q.kind === "linking-cubes" && q.groups && <LinkingCubes groups={q.groups.map(g => ({ n: g.n, color: (g as any).color || "bg-blue-400" }))} showNumbers={q.uiProps?.showNumbers} />}
          {q.kind === "take-apart" && q.a != null && q.b != null && q.n != null && <TakeApart total={q.n} knownSplit={{a: q.a, b: q.b}} />}

          {q.kind === "vertical" && <InteractiveVertical q={q} onAnswer={handlePick} disabled={status !== null} />}
          {q.kind === "tenframe" && q.n != null && (
            <TenFrame filled={q.n} filled2={q.big === "add" ? q.u ?? null : null} destacarFileira={typeof tutShow === "object" && tutShow?.destacarFileira ? tutShow.destacarFileira : null} flashDurationMs={q.uiProps?.flashDurationMs} state={status === "right" ? "acerto" : status === "wrong" ? "erro-suave" : "ocioso"} />
          )}

          {q.kind === "flash" && q.emoji && q.n != null && (
            <div className="flex flex-col items-center justify-center gap-2" style={{ minHeight: 140 }}>
              {!flashHidden ? (
                <div className="flex flex-wrap items-center justify-center gap-2.5" style={{ maxWidth: 250 }}>
                  {Array.from({ length: q.n }).map((_, i) => (
                    <span key={i} className="mk-pop" style={{ fontSize: 42, animationDelay: `${i * 50}ms` }}>
                      {q.emoji}
                    </span>
                  ))}
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 64, lineHeight: 1 }}>🙈</div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 15, color: C.sub }}>Quantos eram? 🤔</div>
                  {!status && (
                    <button
                      onClick={peekAgain}
                      className="mt-1 select-none cursor-pointer active:translate-y-0.5 transition-all"
                      style={{ fontFamily: FONT, fontWeight: 800, fontSize: 13, color: C.grape, background: "#F1EDFF", border: `2px solid ${C.grape}`, borderRadius: 12, padding: "6px 14px" }}
                    >
                      👀 Ver de novo
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {q.kind === "money" && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {(q.notes || []).map((v, i) => (
                <span key={"n" + i} className="mk-drop" style={{ animationDelay: `${i * 90}ms` }}>
                  <MoneyNote v={v} />
                </span>
              ))}
              {(q.coins || []).map((v, i) => (
                <span key={"c" + i} className="mk-drop" style={{ animationDelay: `${((q.notes || []).length + i) * 90}ms` }}>
                  <MoneyCoin v={v} />
                </span>
              ))}
            </div>
          )}

          {q.kind === "picto" && q.rows && (
            <div>
              {q.title && (
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: C.sub, textAlign: "center", marginBottom: 10 }}>
                  {q.title}
                </div>
              )}
              <div className="flex flex-col gap-2.5">
                {q.rows.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 text-left">
                    <span className="text-3xl w-10 text-center">{r.e}</span>
                    <span className="text-slate-200 font-extrabold">│</span>
                    <span className="flex flex-wrap gap-1">
                      {Array.from({ length: r.n }).map((_, j) => (
                        <span key={j} className="mk-drop" style={{ fontSize: 22, animationDelay: `${i * 120 + j * 60}ms` }}>
                          {r.e}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {q.kind === "story" && q.story && (
            <div>
              <div className="text-center text-4xl mb-2">{q.emoji}</div>
              {/* a própria frase é tocável: reouvir o enunciado no idioma certo, quantas vezes quiser */}
              <div
                role="button"
                onClick={() => {
                  if (sound && !status) speak(q.story! + (q.sayTarget ? " ... " + q.sayTarget : ""), q.lang ? { lang: q.lang } : {});
                }}
                className="px-1 cursor-pointer active:scale-[0.98] transition-transform"
                style={{ fontFamily: BODY, fontWeight: 800, fontSize: 17, color: C.ink, textAlign: "center", lineHeight: 1.5 }}
              >
                🔊 {q.story}
              </div>
              <div style={{ color: C.sub, fontWeight: 700, fontSize: 11, textAlign: "center", marginTop: 10 }}>
                👂 Toque na frase para ouvir de novo, quantas vezes quiser!
              </div>
            </div>
          )}

          {q.kind === "scene" && q.items && (
            <SceneSVG items={q.items} />
          )}

          {/* journey (viagem narrada): a viagem enquanto roda; a cena final ao terminar */}
          {q.kind === "journey" && q.journey && (
            journeyDone ? (
              <div className="flex flex-col items-center gap-2">
                <PlaceScene slot={q.big as Place} size={200} />
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 20, color: C.ink }}>
                  {q.journey[q.journey.length - 1].label}
                </div>
              </div>
            ) : (
              <JourneyScene journey={q.journey} sound={sound} onDone={() => setJourneyDone(true)} />
            )
          )}
          </>
          )}

        </div>
        </>
        )}
      </div>

      {q.kind !== "rapid-fire" && q.kind !== "singapore-bars" && (
        <>
      {/* AULINHA 🎬 re-oferecida pelo algoritmo: 2 erros seguidos → convite gentil */}
      {aulaSuggest && !status && hasAulinha(q) && guidedIdx === null && guidedNarr === null && (
        <div className="flex justify-center mt-3">
          <button
            onClick={() => playAulinha(false)}
            className="animate-bounce select-none cursor-pointer active:translate-y-0.5 transition-all flex items-center gap-2"
            style={{
              fontFamily: FONT, fontWeight: 900, fontSize: 14, color: "#fff",
              background: C.grape, border: "none", borderRadius: 14,
              padding: "10px 18px", boxShadow: "0 4px 0 rgba(0,0,0,0.2)",
            }}
          >
            💡 Tá difícil? Vem ver a aulinha! 👉
          </button>
        </div>
      )}

      {/* Tutorial guiado 👉 (generalizado): a mãozinha do Contar, para as cenas novas */}
      {hasTutorial(q) && !status && (
        guidedNarr !== null ? (
          <div
            className="mt-3 mx-auto p-3 rounded-2xl text-center mk-optin"
            style={{ maxWidth: 330, background: "#EEF2FF", border: `2px solid ${C.grape}`, fontFamily: BODY, fontWeight: 800, fontSize: 14, color: C.ink, lineHeight: 1.4 }}
          >
            💡 {guidedNarr}
          </div>
        ) : (
          <div className="flex justify-center mt-3">
            <button
              onClick={() => playAulinha(false)}
              className="bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-700 font-extrabold text-xs px-4 py-2 rounded-md flex items-center gap-1.5 active:scale-95 transition-all shadow-sm cursor-pointer"
              style={{ fontFamily: FONT }}
            >
              <span>👉 Como faz? 🫵</span>
            </button>
          </div>
        )
      )}

      {/* Answer Button Grid Options */}
      <div className="mt-5">
        {q.kind === "journey" && !journeyDone ? (
          // durante a viagem: sem opções ainda — a criança só viaja e escuta
          <div className="text-center py-2" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 13, color: C.sub }}>
            🚀 Boa viagem! No fim você responde.
          </div>
        ) : q.kind === "flash" && !flashHidden ? (
          // durante o relance: sem números na tela, só o convite a OLHAR
          <div className="text-center py-4" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 15, color: C.grape }}>
            👀 Olhe rápido...
          </div>
        ) : q.kind === "order" ? (
          <div className="grid grid-cols-2 gap-3">
            {q.options && q.options.map((o, i) => {
              const pos = orderTaps.indexOf(o.value);
              const done = pos >= 0;
              const big = q.big as string;
              const val: any = o.value;
              const scene =
                big === "lifestage" ? <PersonLifeScene stage={val} size={140} /> :
                big === "grow" ? <GrowthScene stage={val} size={140} /> :
                big === "daypart" ? <DayPartScene type={val} size={140} /> :
                big === "weather" ? <WeatherScene type={val} size={140} /> :
                big === "animal" ? <AnimalLifeScene stage={val} size={140} /> :
                big === "lugar" ? <NestScene kind={val} size={140} /> :
                // sem cena mapeada: mostra o próprio rótulo grande
                <span className="flex items-center justify-center text-center px-2" style={{ minHeight: 90, fontFamily: FONT, fontWeight: 800, fontSize: 20, color: C.ink }}>{o.label}</span>;
              return (
                <button
                  key={i}
                  data-ov={String(o.value)}
                  onClick={() => handleOrderTap(o.value)}
                  disabled={!!status}
                  className={`relative select-none cursor-pointer rounded-2xl overflow-hidden transition-all active:translate-y-1 ${orderShake === o.value ? "mk-shake" : ""}`}
                  style={{ border: `3px solid ${done ? C.mint : C.line}`, boxShadow: `0 5px 0 ${done ? C.mintDark : C.line}`, background: C.card, opacity: done ? 0.65 : 1 }}
                >
                  {scene}
                  {done && (
                    <span className="absolute top-1.5 left-1.5 w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-lg" style={{ background: C.mint, fontFamily: FONT }}>
                      {pos + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : q.kind === "groups" && q.groups ? (
          <div className="grid grid-cols-2 gap-4">
            {q.groups.map((gr, i) => {
              const isAns = i === q.answer;
              const picked = sel === i;
              let bg = C.card;
              let borderCol = C.line;

              if (status) {
                if (isAns) {
                  bg = "#E9FBF0";
                  borderCol = C.mint;
                } else if (picked) {
                  bg = "#FFEDED";
                  borderCol = C.melon;
                }
              }

              const isHidden = hiddenOpts.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (isHidden) return;
                    handlePick(i);
                  }}
                  disabled={!!status || isHidden}
                  className={`mk-optin select-none cursor-pointer border-3 card-block p-4 transition-all active:translate-y-1 ${
                    picked && status === "wrong" ? "mk-shake" : ""
                  } ${isHidden ? "opacity-0 pointer-events-none" : ""}`}
                  style={{
                    background: bg,
                    borderColor: borderCol,
                    boxShadow: `0 6px 0 ${C.line}`,
                    minHeight: 120,
                  }}
                >
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {Array.from({ length: gr.n }).map((_, j) => (
                      <span key={j} className="text-3xl">
                        {gr.emoji}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <>
          {q.options && q.kind !== "numberline-interactive" && q.kind !== "drag-group" && (<div className={`gap-3.5 ${(q.kind === "take-apart" || q.kind === "sequence" || q.options.some(o => !!o.groups)) ? "flex flex-col" : "grid grid-cols-2"}`}>
            {q.options.map((o, i) => {
              const isAnswer = o.value === q.answer;
              const picked = sel === o.value;
              let bg = C.card;
              let fg = C.ink;
              let shadow = C.line;

              if (status) {
                if (isAnswer) {
                  bg = C.mint;
                  fg = "#fff";
                  shadow = C.mintDark;
                } else if (picked) {
                  bg = C.melon;
                  fg = "#fff";
                  shadow = C.melonDark;
                } else {
                  fg = C.sub;
                }
              }

              const armed = q.audibleOptions && armedOpt === o.value;
              const isHidden = hiddenOpts.includes(o.value);
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (status || isHidden) return;
                    // toque duplo nas questões audíveis: 1º OUVE e arma; 2º confirma
                    if (q.audibleOptions && armedOpt !== o.value) {
                      setArmedOpt(o.value);
                      speak(String(o.say ?? o.label).toLowerCase(), q.lang ? { lang: q.lang } : {});
                      return;
                    }
                    handlePick(o.value);
                  }}
                  disabled={!!status || isHidden}
                  className={`mk-optin select-none cursor-pointer py-4 px-2 border-none transition-all active:translate-y-1 rounded-2xl text-center flex flex-col items-center justify-center relative ${
                    picked && status === "wrong" ? "mk-shake" : ""
                  } ${isHidden ? "opacity-0 pointer-events-none" : ""}`}
                  style={{
                    animationDelay: `${i * 70}ms`,
                    fontFamily: FONT,
                    fontWeight: 700,
                    background: bg,
                    color: fg,
                    boxShadow: armed ? `0 5px 0 #D97706, 0 0 0 4px #FBBF24` : `0 5px 0 ${shadow}`,
                    minHeight: 74,
                  }}
                >
                  {/* Opção audível: o BOTÃO INTEIRO é o alto-falante (toque duplo).
                      O 🔊 é só um selo indicativo — não é mais alvo de toque. */}
                  {q.audibleOptions && !status && (
                    <span className="absolute top-1 right-1.5 text-sm" style={{ pointerEvents: "none", opacity: armed ? 1 : 0.55 }}>
                      {armed ? "👂" : "🔊"}
                    </span>
                  )}
                  {q.kind === "shapes" && o.shape && o.color ? (
                    <span className="mk-pulse inline-block" style={{ animationDelay: `${i * 260}ms` }}>
                      <ShapeSVG id={o.shape} color={o.color} />
                    </span>
                  ) : o.groups ? (
                    <div className="flex flex-col items-center gap-2 px-2 py-1">
                      {o.label && <span className="text-xl font-black">{o.label}</span>}
                      <div className="scale-[0.6] sm:scale-75 origin-center">
                        <LinkingCubes groups={o.groups.map(g => ({n: g.n, color: g.color || "bg-blue-400"}))} numberAbove showPlus />
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: q.kind === "pattern" ? 36 : String(o.label).length > 2 ? 24 : 34 }}>
                      {o.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>)}
          {q.audibleOptions && !status && (
            <div className="text-center mt-2" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 11.5, color: C.sub }}>
              👂 Toque para OUVIR · toque de novo para escolher
            </div>
          )}
          </>
        )}
      </div>

      </>
      )}

      {/* Botão AVANÇAR — surge ao responder; deixa a criança seguir no ritmo dela */}
      {status && (
        <button
          onClick={advanceNow}
          className="mt-4 w-full py-3 text-lg font-black text-white select-none cursor-pointer border-none rounded-2xl transition-all active:translate-y-1 mk-optin flex items-center justify-center gap-2"
          style={{
            fontFamily: FONT,
            background: status === "right" ? C.mint : C.ocean,
            boxShadow: `0 5px 0 ${status === "right" ? C.mintDark : C.oceanDark}`,
          }}
        >
          <span>{idx >= totalQFor(track) - 1 ? "Ver Resultado" : "Avançar"}</span>
          <span>→</span>
        </button>
      )}

      {showClockTutorial && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white card-block border-4 border-indigo-400 p-6 max-w-sm w-full shadow-2xl relative mk-pop select-none text-center">
            <button
              onClick={() => {
                sfx.tick();
                setShowClockTutorial(false);
              }}
              className="absolute top-3 right-3 w-8 h-8 rounded-md border-2 border-slate-300 flex items-center justify-center font-bold text-slate-500 hover:bg-slate-50"
            >
              ✕
            </button>
            <div className="text-4xl mb-2 animate-bounce">🧭</div>
            <h3 className="text-xl font-black text-indigo-900" style={{ fontFamily: FONT }}>
              Segredos do Reloginho!
            </h3>
            <p className="text-xs text-slate-500 font-bold mb-4">
              Aprenda com o Mascote de forma super rápida! 💡
            </p>

            <div className="space-y-4 text-left text-sm font-extrabold text-slate-700 leading-snug">
              <div className="flex items-start gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xl">🖤</span>
                <div>
                  <span className="text-indigo-950 font-bold">Ponteiro Curto (Preto):</span>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">Ele aponta para as HORAS! Se apontar para o 3, são 3 horas.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-indigo-50 p-2.5 rounded-xl border border-indigo-100">
                <span className="text-xl">💙</span>
                <div>
                  <span className="text-indigo-600 font-bold">Ponteiro Longo (Azul):</span>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">Ele aponta para os MINUTOS! Ele anda mais rápido.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                <span className="text-xl">⭐</span>
                <div>
                  <span className="text-amber-800 font-bold">Se o Azul apontar para o 12:</span>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">Significa hora exata! Minutos valem <span className="text-amber-600">00</span>.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-xl">🍕</span>
                <div>
                  <span className="text-emerald-800 font-bold">Se o Azul apontar para o 6:</span>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">Significa "meia hora", ou seja, <span className="text-emerald-600">30 minutos</span>!</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sfx.level();
                setShowClockTutorial(false);
              }}
              className="mt-5 w-full bg-indigo-600 text-white font-bold py-3 px-5 rounded-2xl shadow-md border-b-4 border-indigo-800 active:translate-y-0.5 active:border-b-2 transition-all text-sm"
              style={{ fontFamily: FONT }}
            >
              Entendi! Vamos Jogar! 👍
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
