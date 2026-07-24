import { computeUnlockStatus } from "./src/utils/unlockEngine";
import { Progress, Track } from "./src/types";
import { tracksForGrade } from "./src/subjects";

function runOrchestratedSimulation(baseAccuracy: number, hasGapIn10: boolean): { sessions: number, radarTriggers: number, rescueMissions: number, dom: boolean } {
  let sessions = 0;
  const pMap: Record<string, Progress> = {};
  const progOf = (id: string) => pMap[id] || { lvl: 1, maxLvl: 1, streak: 0, bad: 0, dom: false, bank: [], stars: 0, ok: 0, tot: 0, mast: 0 };
  const updateProg = (id: string, updates: Partial<Progress>) => {
    pMap[id] = { ...progOf(id), ...updates };
  };

  let radarTriggers = 0;
  let rescueMissions = 0;
  let consecutiveErrorsN111 = 0;
  let N110_fixed = false;

  while (sessions < 500) {
    sessions++;
    const status = computeUnlockStatus(pMap);
    if (status.dominated.includes("N1.11")) {
      return { sessions, radarTriggers, rescueMissions, dom: true };
    }

    let frontierId = status.frontier.includes("N1.11") ? "N1.11" : status.frontier[0];
    if (!frontierId) {
      const available = status.opened.filter(id => !status.dominated.includes(id));
      frontierId = available[0];
    }
    if (!frontierId) break;

    let doingRescue = false;
    if (frontierId === "N1.11" && consecutiveErrorsN111 >= 2) {
      radarTriggers++;
      frontierId = "N1.10";
      doingRescue = true;
      rescueMissions++;
      consecutiveErrorsN111 = 0;
    }

    const p = progOf(frontierId);
    let isCorrect = Math.random() < baseAccuracy;

    if (hasGapIn10) {
      if (frontierId === "N1.11" && p.lvl! >= 3 && !N110_fixed) {
        isCorrect = Math.random() < (baseAccuracy - 0.4);
      }
      if (frontierId === "N1.10" && doingRescue) {
        isCorrect = Math.random() < (baseAccuracy + 0.1);
      }
    }

    if (isCorrect) {
      const newStreak = (p.streak || 0) + 1;
      let newLvl = p.lvl || 1;
      let newMaxLvl = p.maxLvl || 1;
      let dom = p.dom;
      if (newStreak >= 3) {
        if (newLvl < 5) {
          newLvl++;
          if (newLvl > newMaxLvl) newMaxLvl = newLvl;
        } else {
          dom = true;
        }
        updateProg(frontierId, { streak: 0, lvl: newLvl, maxLvl: newMaxLvl, dom });
        if (frontierId === "N1.10" && dom) {
          N110_fixed = true;
        }
      } else {
        updateProg(frontierId, { streak: newStreak, bad: 0 });
      }
    } else {
      const newBad = (p.bad || 0) + 1;
      if (frontierId === "N1.11") consecutiveErrorsN111++;
      if (newBad >= 2) {
        let newLvl = p.lvl || 1;
        if (newLvl > 1) newLvl--;
        updateProg(frontierId, { streak: 0, bad: 0, lvl: newLvl });
      } else {
        updateProg(frontierId, { streak: 0, bad: newBad });
      }
    }
  }
  return { sessions, radarTriggers, rescueMissions, dom: false };
}

function runAggregate(kidName: string, accuracy: number, hasGap: boolean, runs: number = 100) {
  const results = [];
  for (let i = 0; i < runs; i++) {
    results.push(runOrchestratedSimulation(accuracy, hasGap));
  }
  
  const successful = results.filter(r => r.dom);
  if (successful.length === 0) {
    console.log(`>> [${kidName}] Não dominou N1.11 em nenhuma das ${runs} execuções.`);
    return;
  }
  
  const sessions = successful.map(r => r.sessions).sort((a, b) => a - b);
  const rescues = successful.map(r => r.rescueMissions).sort((a, b) => a - b);
  
  const medianSessions = sessions[Math.floor(sessions.length / 2)];
  const minSessions = sessions[0];
  const maxSessions = sessions[sessions.length - 1];
  
  const medianRescues = rescues[Math.floor(rescues.length / 2)];
  const minRescues = rescues[0];
  const maxRescues = rescues[rescues.length - 1];

  console.log(`\n=== PERFIL: ${kidName} ===`);
  console.log(`- Sessões para dominar N1.11: Mediana ${medianSessions} (faixa: ${minSessions} a ${maxSessions})`);
  console.log(`- Missões de Resgate (Oficina): Mediana ${medianRescues} (faixa: ${minRescues} a ${maxRescues})`);
  console.log(`- Taxa de Sucesso em <200 sessões: ${(successful.length / runs * 100).toFixed(1)}%`);
}

const seed = Date.now();
console.log(`SIMULADOR DO APRENDIZ (Orquestração Completa). Seed: ${seed}`);
console.log(`Data/Hora: ${new Date().toISOString()}`);
console.log(`Motores: Composer v2, Radar v1, Oficina v1\n`);

runAggregate("Téo (4 anos, do zero)", 0.85, false, 100);
