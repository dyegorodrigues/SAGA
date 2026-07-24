import { describe, it, expect } from "vitest";
import { computeUnlockStatus } from "./src/utils/unlockEngine";
import { Progress } from "./src/types";

// deterministic seed random for the simulation
function mulberry32(a: number) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

describe("Simulador Orquestrado - Aprendiz Simulado", () => {
  it("roda a simulação orquestrada com física da Oficina", () => {
    
    function runSimulations(kidName: string, baseAccuracy: number, hasGapIn10: boolean, executions: number = 30) {
      let allSessions = [];
      let allRadars = [];
      let allRescues = [];
      
      console.log(`\n======================================================`);
      console.log(`[SIMULAÇÃO EM LOTE] Semente: 42 | Data: ${new Date().toISOString().split('T')[0]} | Versão Motores: v2.2`);
      console.log(`Perfil: ${kidName}`);
      console.log(`Execuções: ${executions}`);
      
      let rand = mulberry32(42);

      for(let exec = 0; exec < executions; exec++) {
          let sessions = 0;
          const pMap: Record<string, Progress> = {};
          
          if(kidName.includes("Téo")) {
             // Zero progress
          } else {
             // Rocha starts with basic stuff
             ["N1.01", "N1.02", "N1.03", "N1.04", "N1.05", "N1.06", "N1.07", "N1.08", "N1.09", "AL.01", "AL.02", "GE.01", "GE.02", "GM.02", "N1.12", "N3.01", "N3.02"].forEach(id => {
               pMap[id] = { lvl: 5, maxLvl: 5, streak: 3, bad: 0, dom: true, bank: [], stars: 0, ok: 0, tot: 0, mast: 0 };
             });
          }
          
          const progOf = (id: string) => pMap[id] || { lvl: 1, maxLvl: 1, streak: 0, bad: 0, dom: false, bank: [], stars: 0, ok: 0, tot: 0, mast: 0 };
          const updateProg = (id: string, updates: Partial<Progress>) => {
            pMap[id] = { ...progOf(id), ...updates };
          };
          
          let radarTriggers = 0;
          let rescueMissions = 0;
          let consecutiveErrorsN111 = 0;
          let N110_fixed = false;
          let rescuesForN110 = 0;
          let N110_prereq_probed = false;
          let logOutput = exec === 0; // only log first execution to avoid spam

          while (sessions < 200) {
            sessions++;
            const status = computeUnlockStatus(pMap);
            
            if (status.dominated.includes("N1.11")) {
              if (logOutput) console.log(`>> [Execução 1] ${kidName} Atingiu DOMÍNIO em N1.11 em ${sessions} sessões.`);
              break;
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
              if (rescuesForN110 >= 3 && !N110_prereq_probed) {
                  if (logOutput) console.log(`[Sessão ${sessions}] ⚠️ Teto de 3 resgates atingido! Motor sondando pré-requisito do pré-requisito (N1.08) e avisando painel.`);
                  N110_prereq_probed = true;
                  // simulating that identifying the deeper root cause makes fixing N1.10 easier now
                  hasGapIn10 = false;
              } else {
                  if (logOutput) console.log(`[Sessão ${sessions}] Radar detectou padrão de erro em N1.11! 🔥 Abrindo Missão de Resgate para N1.10!`);
                  frontierId = "N1.10"; 
                  doingRescue = true;
                  rescueMissions++;
                  rescuesForN110++;
                  consecutiveErrorsN111 = 0;
              }
            } else if (frontierId === "N1.10" && hasGapIn10 && !N110_fixed && pMap["N1.10"] && pMap["N1.10"].maxLvl < 3) {
                 doingRescue = true; // Still doing rescue if it's the active frontier
            }

            const p = progOf(frontierId);
            let isCorrect = rand() < baseAccuracy;
            
            if (hasGapIn10) {
              if (frontierId === "N1.11" && p.lvl! >= 3 && !N110_fixed) {
                isCorrect = rand() < (baseAccuracy - 0.4); 
              }
              if (frontierId === "N1.10" && doingRescue) {
                isCorrect = rand() < (baseAccuracy + 0.1); 
              }
            }
            
            if (isCorrect) {
              const newStreak = (p.streak || 0) + 1;
              let newLvl = p.lvl || 1;
              let newMaxLvl = p.maxLvl || 1;
              let dom = p.dom;
              
              // Física da Oficina: Sobe com 2 acertos, Academia: Sobe com 3
              const requiredStreak = doingRescue ? 2 : 3;
              
              if (newStreak >= requiredStreak) {
                if (newLvl < 5) {
                  newLvl++;
                  if (newLvl > newMaxLvl) newMaxLvl = newLvl;
                } else {
                  if(!doingRescue) dom = true; 
                  // If doing rescue, we don't naturally dominate here, dom is for the real frontier.
                }
                updateProg(frontierId, { streak: 0, lvl: newLvl, maxLvl: newMaxLvl, dom });
                if (logOutput) console.log(`[Sessão ${sessions}] Acertou ${requiredStreak}x! Subiu para Nível ${newLvl} em ${frontierId}`);
                
                // Oficina: alvo é destravar (maxLvl 3), não coroar.
                if (doingRescue && frontierId === "N1.10" && newMaxLvl >= 3) {
                  if (logOutput) console.log(`[Sessão ${sessions}] 🔧 Resgate concluído! N1.10 destravado (nível ${newMaxLvl}). Lacuna fechada. Retornando ao fluxo principal.`);
                  N110_fixed = true;
                  rescuesForN110 = 0; // reset for this specific prereq
                }
              } else {
                updateProg(frontierId, { streak: newStreak, bad: 0 });
              }
            } else {
              const newBad = (p.bad || 0) + 1;
              if (frontierId === "N1.11") consecutiveErrorsN111++;
              if (newBad >= 2) {
                let newLvl = p.lvl || 1;
                if (newLvl > 1) {
                  newLvl--;
                  if (logOutput) console.log(`[Sessão ${sessions}] Errou 2x em ${frontierId}. Recuando invisível para Nível ${newLvl} para maior apoio.`);
                }
                updateProg(frontierId, { streak: 0, bad: 0, lvl: newLvl });
              } else {
                updateProg(frontierId, { streak: 0, bad: newBad });
              }
            }
          }
          allSessions.push(sessions);
          allRadars.push(radarTriggers);
          allRescues.push(rescueMissions);
      }
      
      const medianSessions = allSessions.sort((a,b)=>a-b)[Math.floor(executions/2)];
      const minS = allSessions[0];
      const maxS = allSessions[executions-1];
      
      console.log(`\n>> RESULTADO AGREGADO (${executions} execuções):`);
      console.log(`>> Sessões para dominar N1.11: Mediana ${medianSessions} (faixa: ${minS} - ${maxS})`);
      console.log(`>> Disparos do Radar (Mediana): ${allRadars.sort((a,b)=>a-b)[Math.floor(executions/2)]}`);
      console.log(`>> Missões de Resgate (Mediana): ${allRescues.sort((a,b)=>a-b)[Math.floor(executions/2)]}`);
    }

    runSimulations("Téo (4 anos, do zero)", 0.85, false, 30);
    runSimulations("Rocha (6 anos, lacuna severa nos Amigos do 10)", 0.8, true, 30);
    
    expect(true).toBe(true);
  });
});
