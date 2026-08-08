import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const self = path.join(root, "src/p22_final_checkpoint.test.ts");
const paths = {
  retomada: path.join(root, "AI_Studio_Lab/codex/RETOMADA.md"),
  handoff: path.join(root, "AI_Studio_Lab/codex/HANDOFF_CONTINUIDADE_IA.md"),
  decisao: path.join(root, "AI_Studio_Lab/codex/DECISAO_P22_DIVIDAS_CURRICULARES.md"),
};
const original = Object.fromEntries(Object.entries(paths).map(([k,p]) => [k, fs.readFileSync(p,"utf8")])) as Record<string,string>;
function writeAtomic(file:string, content:string){ const tmp=`${file}.p22tmp`; fs.writeFileSync(tmp,content); fs.renameSync(tmp,file); }
function patch(file:string,before:string,after:string){ if(after===before) throw new Error(`P22 final: nenhuma alteração em ${file}`); writeAtomic(file,after); }

describe("P22 — checkpoint final",()=>{
  it("fecha P22 e aponta auditoria longitudinal dos motores",()=>{
    try{
      let r=original.retomada;
      r=r.replace(/> \*\*VIGENTE[^\n]*/,"> **VIGENTE em 8/ago/2026 — P21 e P22 concluídas; próxima tarefa exata: auditoria longitudinal dos motores adaptativos/meta-algoritmos.**");
      r += `\n\n## CHECKPOINT FINAL P22 — CONCLUÍDA\n\n- P22.1: GM.12 promovida;\n- P22.2: N4.09 promovida e telemetria de área corrigida;\n- P22.3A: N1.07 completada com sucessor, antecessor e ordenação;\n- P22.3B: JD4 registrada como automaticidade separada da Jornada;\n- P22.4: N1.09 ganhou ficha autoral/TS completa para conjuntos 10–20, continuação interna e regressiva;\n- P22.5: GM.02 ganhou ficha autoral/TS pré-leitora para partes do dia, ontem/hoje/amanhã, dias da semana e ordenação de eventos.\n\nEstado canônico: **94 fichas Markdown / 90 de 90 competências cobertas**. Journey TS/registry: **31/31**. Composer: **26 registrados / 26 ativos / 0 inativos**. Servido sem placeholder: **51/90**. Fallback real: **39/90**. N1.09 e GM.02 continuam com legado apenas como rollback; a cobertura autoral completa não transforma o legado parcial em fonte de verdade.\n\n### Próxima tarefa exata\n\nExecutar a **auditoria longitudinal dos motores adaptativos/meta-algoritmos** antes de novas migrações de conteúdo: Progress Engine, Composer/Minha Aula, Radar, Oficina, Jardim/Dojo, FD/PD, matrícula, mixed challenge, Leitner/retenção, domínio/evidências, unlock e telemetria. Primeiro inventariar fluxo real ponta a ponta; depois corrigir motores por evidência.\n`;
      patch(paths.retomada,original.retomada,r);

      let h=original.handoff;
      h=h.replace(/> \*\*VIGENTE[^\n]*/,"> **VIGENTE — 8/ago/2026. P21 e P22 concluídas; próximo passo: auditoria longitudinal dos motores adaptativos/meta-algoritmos.**");
      h += `\n\n## P22 — FECHADA\n\nP22.4/N1.09 e P22.5/GM.02 fecharam as duas últimas lacunas autorais sem reduzir o cânone. Estado final: 94 fichas Markdown cobrindo 90/90 competências; 31 fichas TS de Jornada registradas; Composer 26/26 ativo; 51 competências servidas sem placeholder; 39 fallbacks reais. N1.09 substitui o legado parcial de sequência mantendo rollback; GM.02 substitui o legado insuficiente “Manhã ou Noite?” mantendo rollback.\n\n## Próximo passo\n\nAuditar longitudinalmente os motores: progressão, seleção da Minha Aula/Composer, Radar, Oficina, Jardim, FD/PD, matrícula, mixed challenge, Leitner/retenção, evidências/domínio, unlock e telemetria. Não tratar existência de motor como prova de coerência entre motores.\n`;
      patch(paths.handoff,original.handoff,h);

      let d=original.decisao;
      d=d.replace(/P22\.3A e P22\.3B estão concluídas\. P22\.4\/N1\.09 é o próximo lote\./,"P22.3A, P22.3B, P22.4 e P22.5 estão concluídas. P22 está FECHADA.");
      d += `\n\n## Checkpoint P22.4 — N1.09\n\nN1.09 passou a ter ficha autoral e TS próprias com prereqs canônicos N1.04+N1.02. A escada cobre contagem de conjuntos 10–15 e 10–20, continuação de sequência de ponto interno e regressiva até zero; L5 mistura os quatro micros. O legado de sequência permanece rollback, não evidência de domínio integral. A exceção autoral N1.09 foi removida.\n\n## Checkpoint P22.5 — GM.02\n\nGM.02 permanece Tempo cotidiano e ganhou ficha autoral/TS F0 pré-leitora: partes do dia, ontem/hoje/amanhã, dias da semana e ordenação de eventos. O Composer ganhou somente modos opt-in de plain com cenas/ícones e comandos falados. O legado “Manhã ou Noite?” permanece rollback. A exceção autoral GM.02 foi removida.\n\n## P22 — RESULTADO FINAL\n\n- cobertura autoral: **90/90 competências**;\n- fichas Markdown: **94**;\n- Journey TS/registry: **31/31**;\n- Composer registrado/ativo: **26/26**;\n- registrado/inativo: **0**;\n- servido sem placeholder: **51/90**;\n- fallback real: **39/90**.\n\nA P22 termina aqui. Próxima fase: auditoria longitudinal dos motores adaptativos/meta-algoritmos, seguida de correções dos motores, mega auditoria pedagógica, auditoria integrada JD/FD/PD e release hardening.\n`;
      patch(paths.decisao,original.decisao,d);

      expect(fs.readFileSync(paths.retomada,"utf8")).toContain("90 de 90 competências");
      fs.rmSync(self,{force:true});
    }catch(error){ for(const [k,p] of Object.entries(paths)) writeAtomic(p,original[k]); fs.rmSync(self,{force:true}); throw error; }
  });
});
