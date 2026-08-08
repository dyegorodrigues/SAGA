import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const self = path.join(root, "src/p22_3a_checkpoint.test.ts");
const files = [
  "AI_Studio_Lab/codex/RETOMADA.md",
  "AI_Studio_Lab/codex/HANDOFF_CONTINUIDADE_IA.md",
  "AI_Studio_Lab/codex/DECISAO_P22_DIVIDAS_CURRICULARES.md",
].map(p => path.join(root, p));
const originals = new Map(files.map(p => [p, fs.readFileSync(p, "utf8")]));

function writeAtomic(file: string, content: string) {
  const tmp = `${file}.p22tmp`;
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, file);
}

function patch(file: string, transform: (s: string) => string) {
  const before = originals.get(file)!;
  const after = transform(before);
  if (after === before) throw new Error(`checkpoint P22.3A sem ancora em ${file}`);
  writeAtomic(file, after);
}

describe("P22.3A — checkpoint vivo", () => {
  it("aponta a retomada para JD4 e se auto-remove", () => {
    try {
      const retomada = files[0];
      patch(retomada, s => {
        let out = s.replace(
          "P22.1/GM.12 e P22.2/N4.09 concluídas; próxima tarefa exata: P22.3A/N1.07.",
          "P22.1/GM.12, P22.2/N4.09 e P22.3A/N1.07 concluídas; próxima tarefa exata: P22.3B/JD4.",
        );
        out = out.replace(
          "- **P22.2 — N4.09 promovida como estreia Composer e telemetria de área corrigida**.",
          "- **P22.2 — N4.09 promovida como estreia Composer e telemetria de área corrigida**.\n- **P22.3A — Jornada N1.07 completada: sucessor, antecessor e ordenação com prereqs canônicos**.",
        );
        out = out.replace("## 7. PRÓXIMA TAREFA EXATA — P22.3A N1.07", "## 7. P22.3A — N1.07 CONCLUÍDA");
        out = out.replace("## 8. Depois de P22.3", `## 8. PRÓXIMA TAREFA EXATA — P22.3B JD4\n\nRegistrar JD4 no Jardim **somente como automaticidade de N1.07**, preservando progresso em \\`dojoTracks\\` e sem alterar domínio da Jornada. Seguir a escada canônica: sucessor 1–5, sucessor 1–10, sucessor 1–20 com retirada de apoio, antecessor 2–10 e alternância sucessor/antecessor 1–20. Validar áudio, tempo como diagnóstico (não domínio), rollback, sonda e gates.\n\n## 9. Depois de P22.3`);
        return out;
      });

      const handoff = files[1];
      patch(handoff, s => {
        let out = s.replace(
          "P22.1 e P22.2 concluídas; próximo passo P22.3A/N1.07.",
          "P22.1, P22.2 e P22.3A concluídas; próximo passo P22.3B/JD4.",
        );
        out = out.replace(
          "- P22.2 — N4.09 promovida e telemetria de área corrigida.",
          "- P22.2 — N4.09 promovida e telemetria de área corrigida.\n- P22.3A — N1.07 alinhada ao grafo: sucessor, antecessor, ordenação e prereqs N1.02+N1.06.",
        );
        out = out.replace("## Próximo passo — P22.3A N1.07", "## P22.3A — N1.07 concluída");
        out = out.replace("## Depois", `## Próximo passo — P22.3B JD4\n\nJD4 é fluência/automaticidade da competência-mãe N1.07. Não reabrir a compreensão já fechada; implementar a escada JD4 no Jardim com estado separado da Jornada, áudio e meta temporal apenas diagnóstica.\n\n## Depois`);
        return out;
      });

      const decisao = files[2];
      patch(decisao, s => {
        let out = s.replace("P22.3A é o próximo lote.", "P22.3A está concluída. P22.3B/JD4 é o próximo lote.");
        out = out.replace("## 6. P22.3A — próxima execução", "## 6. P22.3A — CONCLUÍDA");
        out += `\n\n## Checkpoint P22.3A — 8/ago/2026\n\nA Jornada N1.07 agora usa os prereqs canônicos \\`N1.02 + N1.06\\` e observa os cinco micros do grafo: sucessor até 5, sucessor até 10, antecessor até 5, antecessor até 10 e ordenação de 3–4 numerais. O Composer recebeu apenas duas extensões opt-in no \\`plain\\`: prompt correto para \\`jump_size < 0\\` e modo \\`ordering\\`; o comportamento default permanece intacto. Há teste permanente \\`N1.07.test.ts\\`. O lote foi validado localmente com contratos focais, TypeScript, auditores, suíte completa e build; no publicador transacional também passou a sonda N1.07 antes de ser commitado. Próximo: P22.3B/JD4.\n`;
        return out;
      });

      for (const file of files) expect(fs.readFileSync(file, "utf8")).toContain("P22.3A");
      fs.rmSync(self, { force: true });
    } catch (error) {
      for (const [file, content] of originals) writeAtomic(file, content);
      fs.rmSync(self, { force: true });
      throw error;
    }
  });
});
