import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const self = path.join(root, "src/p22_3b_checkpoint.test.ts");
const paths = {
  retomada: path.join(root, "AI_Studio_Lab/codex/RETOMADA.md"),
  handoff: path.join(root, "AI_Studio_Lab/codex/HANDOFF_CONTINUIDADE_IA.md"),
  decisao: path.join(root, "AI_Studio_Lab/codex/DECISAO_P22_DIVIDAS_CURRICULARES.md"),
};
const original = Object.fromEntries(Object.entries(paths).map(([k, p]) => [k, fs.readFileSync(p, "utf8")])) as Record<string, string>;
function writeAtomic(file: string, content: string) { const tmp = `${file}.p22tmp`; fs.writeFileSync(tmp, content); fs.renameSync(tmp, file); }
function changed(file: string, before: string, after: string) { if (after === before) throw new Error(`P22.3B checkpoint sem ancora em ${file}`); writeAtomic(file, after); }

describe("P22.3B — checkpoint vivo", () => {
  it("fecha JD4 e aponta N1.09", () => {
    try {
      let r = original.retomada;
      r = r.replace("P22.1/GM.12, P22.2/N4.09 e P22.3A/N1.07 concluídas; próxima tarefa exata: P22.3B/JD4.", "P22.1/GM.12, P22.2/N4.09, P22.3A/N1.07 e P22.3B/JD4 concluídas; próxima tarefa exata: P22.4/N1.09.");
      r = r.replace("- **P22.3A — Jornada N1.07 completada: sucessor, antecessor e ordenação com prereqs canônicos**.", "- **P22.3A — Jornada N1.07 completada: sucessor, antecessor e ordenação com prereqs canônicos**.\n- **P22.3B — JD4 registrada no Jardim como automaticidade de N1.07, sem substituir domínio da Jornada**.");
      r = r.replace("## 8. PRÓXIMA TAREFA EXATA — P22.3B JD4", "## 8. P22.3B — JD4 CONCLUÍDA");
      r += "\n\n## PRÓXIMA TAREFA EXATA — P22.4 N1.09\n\nConstruir a ficha autoral e TS de **Contagem até 20 e a partir de qualquer número** sem reutilizar N1.13. Cobrir os quatro micros canônicos: conjuntos 10–15, conjuntos 10–20, continuar sequência de um ponto interno e regressiva 10→0. Manter experiência pré-leitora e provar que o legado parcial não é usado como evidência de domínio completo.\n";
      changed(paths.retomada, original.retomada, r);

      let h = original.handoff;
      h = h.replace("P22.1, P22.2 e P22.3A concluídas; próximo passo P22.3B/JD4.", "P22.1, P22.2, P22.3A e P22.3B concluídas; próximo passo P22.4/N1.09.");
      h = h.replace("- P22.3A — N1.07 alinhada ao grafo: sucessor, antecessor, ordenação e prereqs N1.02+N1.06.", "- P22.3A — N1.07 alinhada ao grafo: sucessor, antecessor, ordenação e prereqs N1.02+N1.06.\n- P22.3B — JD4 adicionada ao Jardim como fluência de N1.07; L5 alterna sucessor/antecessor e `rt_alvo` segue metadado diagnóstico.");
      h = h.replace("## Próximo passo — P22.3B JD4", "## P22.3B — JD4 concluída");
      h += "\n\n## Próximo passo — P22.4 N1.09\n\nCriar a competência autoral que falta para contagem até 20/a partir de qualquer número. Não sequestrar N1.13 e não considerar o gerador legado de sequência como cobertura suficiente.\n";
      changed(paths.handoff, original.handoff, h);

      let d = original.decisao;
      d = d.replace("P22.3A está concluída. P22.3B/JD4 é o próximo lote.", "P22.3A e P22.3B estão concluídas. P22.4/N1.09 é o próximo lote.");
      d += "\n\n## Checkpoint P22.3B — JD4\n\nJD4 foi registrada no catálogo Jardim com prereq N1.07 e cinco níveis canônicos: sucessor 1–5 com reta, sucessor 1–10, sucessor até 20 sem depender da reta, antecessor 2–10 e alternância sucessor/antecessor 1–20 no L5. O Composer ganhou apenas o modo opt-in `neighbor_alternating`; `rt_alvo: 3000` permanece metadado de fluência, não evidência de domínio da Jornada. Há teste permanente `JD4.test.ts`. O lote passou TypeScript/testes/auditores/build no checkout isolado e foi publicado somente após o publicador transacional aprovar também a sonda JD4. Próximo: P22.4/N1.09.\n";
      changed(paths.decisao, original.decisao, d);

      expect(fs.readFileSync(paths.retomada, "utf8")).toContain("P22.4/N1.09");
      fs.rmSync(self, { force: true });
    } catch (error) {
      writeAtomic(paths.retomada, original.retomada); writeAtomic(paths.handoff, original.handoff); writeAtomic(paths.decisao, original.decisao); fs.rmSync(self, { force: true }); throw error;
    }
  });
});
