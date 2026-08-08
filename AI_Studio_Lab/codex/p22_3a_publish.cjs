const fs = require("node:fs");
const cp = require("node:child_process");

const branch = "codex/integrar-bloco-f0";
const self = "AI_Studio_Lab/codex/p22_3a_publish.cjs";
const composerPath = "src/curriculum/Composer.ts";
const fichaPath = "src/curriculum/fichas/jornada/N1.07.ts";
const testPath = "src/curriculum/fichas/jornada/N1.07.test.ts";
const canonPath = "AI_Studio_Lab/pedagogia/fichas/FICHAS_F0_COMPLETAS.md";
const retomadaPath = "AI_Studio_Lab/codex/RETOMADA.md";
const handoffPath = "AI_Studio_Lab/codex/HANDOFF_CONTINUIDADE_IA.md";
const decisaoPath = "AI_Studio_Lab/codex/DECISAO_P22_DIVIDAS_CURRICULARES.md";

function run(command, extraEnv = {}) {
  console.log(`\n[p22.3a] $ ${command}`);
  cp.execSync(command, {
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
}

function replaceOnce(text, before, after, label) {
  if (!text.includes(before)) throw new Error(`âncora ausente: ${label}`);
  return text.replace(before, after);
}

function cleanupPublisher() {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  if (pkg.scripts?.posttest === `node ${self}`) delete pkg.scripts.posttest;
  fs.writeFileSync("package.json", `${JSON.stringify(pkg, null, 2)}\n`);
  fs.rmSync(self, { force: true });
}

function publishCleanupOnly(reason) {
  console.error(`\n[p22.3a] falha: ${reason}`);
  try {
    run(`git fetch origin ${branch}`);
    run(`git reset --hard origin/${branch}`);
    cleanupPublisher();
    run('git config user.name "saga-ci-bot"');
    run('git config user.email "saga-ci-bot@users.noreply.github.com"');
    run("git add -A");
    try { run('git commit -m "chore: limpa bancada P22.3A apos falha"'); } catch {}
    try { run(`git push origin HEAD:${branch}`); } catch {}
  } catch (cleanupError) {
    console.error("[p22.3a] cleanup também falhou", cleanupError);
  }
}

try {
  // O checkout do evento pull_request pode ser um merge sintético. Depois de a
  // suíte baseline passar, voltamos explicitamente ao head real da branch antes
  // de tocar em qualquer arquivo permanente.
  run(`git fetch origin ${branch}`);
  run(`git reset --hard origin/${branch}`);

  let composer = fs.readFileSync(composerPath, "utf8");
  composer = replaceOnce(
    composer,
`      case "numberline": {
        const start = params.start || 0;
        const end = params.end || 10;
        const jump = params.jump_size || 1;
        const current = randomInt(start, end - jump);
        const next = current + jump;
        
        uiProps = {
          start,
          end,
          interactive: true,
          startPos: current, showJumps: [{from: current, to: next}]
        };
        evaluate = (ans) => ans === next;
        answer = next;
        big = String(current);
        options = numericOptions(answer, start, end);
        break;
      }
`,
`      case "numberline": {
        const start = params.start ?? 0;
        const end = params.end ?? 10;
        const jump = params.jump_size ?? 1;
        if (!Number.isInteger(start) || !Number.isInteger(end) || !Number.isInteger(jump) || jump === 0 || start >= end) {
          throw new Error(\`Intervalo/salto invalido na reta de \${ficha.id}/\${micro.id}.\`);
        }
        const currentMin = jump > 0 ? start : start - jump;
        const currentMax = jump > 0 ? end - jump : end;
        if (currentMin > currentMax) {
          throw new Error(\`Salto \${jump} nao cabe na reta \${start}..\${end} de \${ficha.id}/\${micro.id}.\`);
        }
        const current = randomInt(currentMin, currentMax);
        const next = current + jump;

        uiProps = {
          start,
          end,
          interactive: true,
          startPos: current,
          showJumps: [{ from: current, to: next }],
        };
        evaluate = ans => Number(ans) === next;
        answer = next;
        big = String(current);
        options = numericOptions(answer, start, end);
        break;
      }
`,
    "numberline bidirecional",
  );

  composer = replaceOnce(
    composer,
`      case "plain": {
        if (params.complemento_dez) {`,
`      case "plain": {
        // P22.3A — modo opt-in de ordenação. As demais fichas plain preservam
        // exatamente o caminho anterior.
        if (params.modo === "ordering") {
          const start = params.start ?? 1;
          const end = params.end ?? 10;
          if (!Number.isInteger(start) || !Number.isInteger(end) || end - start + 1 < 4) {
            throw new Error(\`Intervalo invalido para ordenacao em \${ficha.id}/\${micro.id}.\`);
          }
          const count = randomInt(3, 4);
          const first = randomInt(start, end - count + 1);
          const ascending = Array.from({ length: count }, (_, index) => first + index);
          const correct = ascending.join(" → ");
          const reversed = [...ascending].reverse();
          const swapped = [...ascending];
          [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
          const rotated = [...ascending.slice(1), ascending[0]];
          const sequences = Array.from(new Set(
            [ascending, reversed, swapped, rotated].map(sequence => sequence.join(" → ")),
          ));
          const cards = [...ascending].sort(() => Math.random() - 0.5);
          answer = correct;
          big = cards.join("   ");
          uiProps = { text: big, cards };
          options = sequences.map(sequence => ({
            label: sequence,
            value: sequence,
            ...(sequence === correct ? {} : { misconception: MisconceptionTag.ORDEM_ERRADA }),
          })).sort(() => Math.random() - 0.5);
          evaluate = ans => String(ans) === correct;
          promptOverride = String(params.audio_prompt ?? "Coloque os números do menor para o maior.");
        } else if (params.complemento_dez) {`,
    "plain ordering",
  );

  composer = replaceOnce(
    composer,
`        } else if (typeof params.start === "number" && typeof params.end === "number") {
          const jump = params.jump_size || 1;
          const current = randomInt(params.start, params.end - jump);
          answer = current + jump;
          big = String(current);
          uiProps = { text: String(current) };
          options = numericOptions(answer, params.start, params.end);
          evaluate = (ans) => ans === answer;
          promptOverride = "Qual número vem depois?";
`,
`        } else if (typeof params.start === "number" && typeof params.end === "number") {
          const jump = params.jump_size ?? 1;
          if (!Number.isInteger(jump) || jump === 0 || params.start >= params.end) {
            throw new Error(\`Intervalo/salto invalido no plain de \${ficha.id}/\${micro.id}.\`);
          }
          const currentMin = jump > 0 ? params.start : params.start - jump;
          const currentMax = jump > 0 ? params.end - jump : params.end;
          if (currentMin > currentMax) {
            throw new Error(\`Salto \${jump} nao cabe no intervalo \${params.start}..\${params.end} de \${ficha.id}/\${micro.id}.\`);
          }
          const current = randomInt(currentMin, currentMax);
          answer = current + jump;
          big = String(current);
          uiProps = { text: String(current) };
          options = numericOptions(answer, params.start, params.end);
          evaluate = ans => Number(ans) === answer;
          promptOverride = jump < 0 ? "Qual número vem antes?" : "Qual número vem depois?";
`,
    "plain salto bidirecional",
  );
  fs.writeFileSync(composerPath, composer);

  fs.writeFileSync(fichaPath, `import { FichaCompetencia } from "../../schema";

/**
 * N1.07 — ordem, sucessor e antecessor até 10.
 * A Jornada mede compreensão; JD4, depois, mede automaticidade.
 */
export const N1_07: FichaCompetencia = {
  id: "N1.07",
  nome: "Ordem, sucessor e antecessor até 10",
  strand: "N1",
  faixa: "F0",
  prereqs: ["N1.02", "N1.06"],
  bncc: "EF01MA01",
  howto: "Use a ordem da contagem para descobrir quem vem antes, quem vem depois e como colocar os números em sequência.",
  explain: "O antecessor vem imediatamente antes; o sucessor vem imediatamente depois.",
  distratores: [],
  niveis: {
    1: { primitiva: "numberline", micro: "a", andaime: "mao_fantasma" },
    2: { primitiva: "numberline", micro: "b", andaime: "alto" },
    3: { primitiva: "plain", micro: "c", andaime: "medio" },
    4: { primitiva: "plain", micro: "d", andaime: "minimo" },
    5: { primitiva: "plain", micro: "e", rt_alvo: 3000 },
  },
  micros: [
    { id: "a", fonte: "GRAFO_N1.07", alvo: "identificar o sucessor até 5 com apoio da reta", kinds: ["numberline"], params: { start: 1, end: 5, jump_size: 1, audio_prompt: "Qual número vem depois?" }, dominio: { acertos: 4, de: 5, sessoes: 2 } },
    { id: "b", fonte: "GRAFO_N1.07", alvo: "identificar o sucessor até 10 com apoio reduzido", kinds: ["numberline"], params: { start: 1, end: 10, jump_size: 1, audio_prompt: "Qual número vem depois?" }, dominio: { acertos: 4, de: 5, sessoes: 2 } },
    { id: "c", fonte: "GRAFO_N1.07", alvo: "identificar o antecessor até 5", kinds: ["plain"], params: { start: 1, end: 5, jump_size: -1, audio_prompt: "Qual número vem antes?" }, dominio: { acertos: 4, de: 5, sessoes: 2 } },
    { id: "d", fonte: "GRAFO_N1.07", alvo: "identificar o antecessor até 10", kinds: ["plain"], params: { start: 1, end: 10, jump_size: -1, audio_prompt: "Qual número vem antes?" }, dominio: { acertos: 4, de: 5, sessoes: 2 } },
    { id: "e", fonte: "GRAFO_N1.07", alvo: "ordenar 3 a 4 numerais consecutivos em ordem crescente", kinds: ["plain"], params: { modo: "ordering", start: 1, end: 10, audio_prompt: "Coloque os números do menor para o maior." }, dominio: { acertos: 4, de: 5, sessoes: 2 } },
  ],
  erros_tipicos: [
    { id: "direcao_invertida", descricao: "Confunde antes e depois e se move para o lado oposto na sequência." },
    { id: "repete_estimulo", descricao: "Repete o número apresentado em vez de escolher seu vizinho." },
    { id: "ordem_errada", descricao: "Reconhece os numerais isolados, mas não os organiza na sequência crescente." },
  ],
};
`);

  fs.writeFileSync(testPath, `import { describe, expect, it } from "vitest";
import { Composer } from "../../Composer";
import { misconceptionForAnswer } from "../../../components/gameloop/answerPolicy";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { N1_07 } from "./N1.07";

const sample = (level: number, n = 80) =>
  Array.from({ length: n }, () => Composer.generate(N1_07, level));

describe("N1.07 — ordem, sucessor e antecessor", () => {
  it("segue faixa e prerequisitos canônicos", () => {
    expect(N1_07.faixa).toBe("F0");
    expect(N1_07.prereqs).toEqual(["N1.02", "N1.06"]);
    expect(N1_07.micros.map(m => m.id)).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("L1-L2 observam sucessor", () => {
    for (const level of [1, 2]) for (const q of sample(level)) {
      const spec = q.uiProps as { startPos: number; showJumps: Array<{ from: number; to: number }> };
      expect(q.kind).toBe("numberline");
      expect(Number(q.answer)).toBe(spec.startPos + 1);
      expect(spec.showJumps).toEqual([{ from: spec.startPos, to: Number(q.answer) }]);
      expect(q.evaluate?.(q.answer)).toBe(true);
    }
  });

  it("L3-L4 observam antecessor sem escapar do intervalo", () => {
    for (const level of [3, 4]) for (const q of sample(level)) {
      expect(q.kind).toBe("plain");
      expect(q.prompt.toLowerCase()).toContain("antes");
      expect(Number(q.answer)).toBe(Number(q.big) - 1);
      expect(Number(q.answer)).toBeGreaterThanOrEqual(1);
      expect(q.evaluate?.(q.answer)).toBe(true);
    }
  });

  it("L5 ordena 3–4 numerais e diagnostica apenas distratores", () => {
    for (const q of sample(5, 140)) {
      const correct = String(q.answer);
      const numbers = correct.split("→").map(value => Number(value.trim()));
      expect([3, 4]).toContain(numbers.length);
      expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
      expect(new Set(numbers).size).toBe(numbers.length);
      expect(q.options).toHaveLength(4);
      expect(q.options?.filter(option => String(option.value) === correct)).toHaveLength(1);
      expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
      for (const option of q.options ?? []) {
        if (String(option.value) !== correct) {
          expect(option.misconception).toBe(MisconceptionTag.ORDEM_ERRADA);
        }
      }
    }
  });

  it("todos os níveis mantêm gabarito selecionável e acerto sem misconception", () => {
    for (let level = 1; level <= 5; level += 1) {
      for (const q of sample(level, 30)) {
        expect(q.options?.map(option => String(option.value))).toContain(String(q.answer));
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
      }
    }
  });
});
`);

  let canon = fs.readFileSync(canonPath, "utf8");
  canon = replaceOnce(
    canon,
    '**Competência:** N1.07 (sucessor e antecessor) · **Primitiva:** `AudioChoice` + `NumberLine` · **Faixa:** F0 · **Também é trilha do Dojo (JD4)**',
    '**Competência:** N1.07 (ordem, sucessor e antecessor) · **Primitiva:** `NumberLine` + `plain` · **Faixa:** F0 · **JD4 é a trilha posterior de automaticidade**',
    "identidade autoral N1.07/JD4",
  );
  const foundation = '**O que a criança aprende:** que cada número tem um **próximo fixo** — e que "próximo" significa "mais um".\n';
  canon = replaceOnce(
    canon,
    foundation,
    `${foundation}\n**Escopo da Jornada N1.07:** a competência canônica inclui **sucessor, antecessor e ordenação de 3–4 numerais**. A Jornada observa os três componentes. JD4 automatiza a vizinhança depois; não substitui compreensão nem concede domínio da Jornada.\n`,
    "escopo conceitual N1.07",
  );
  const oldDomain = '## 9. Domínio\n`{ acertos: 3, de: 3, sessoes: 2 }` — e **regra extra**: os acertos precisam ser **sem recitar** (medido pelo tempo de resposta: abaixo de 4 segundos indica acesso direto, acima indica contagem).';
  const newDomain = '## 9. Domínio / automaticidade\nNa **Jornada N1.07**, domínio conceitual exige evidência de sucessor, antecessor e ordenação e **nunca depende de velocidade**. No **JD4**, `{ acertos: 3, de: 3, sessoes: 2 }` e o tempo descrevem automaticidade/fluência, sem coroar a competência-mãe.';
  canon = replaceOnce(canon, oldDomain, newDomain, "domínio versus automaticidade");
  fs.writeFileSync(canonPath, canon);

  // Atualiza o checkpoint no mesmo lote, mas só será publicado depois dos gates.
  let retomada = fs.readFileSync(retomadaPath, "utf8");
  retomada = replaceOnce(
    retomada,
    '> **VIGENTE em 8/ago/2026 — P21 concluída; P22 em execução. P22.1/GM.12 e P22.2/N4.09 concluídas; próxima tarefa exata: P22.3A/N1.07.**',
    '> **VIGENTE em 8/ago/2026 — P21 concluída; P22 em execução. P22.1/GM.12, P22.2/N4.09 e P22.3A/N1.07 concluídas; próxima tarefa exata: P22.3B/JD4.**',
    "cabeçalho RETOMADA",
  );
  retomada = replaceOnce(
    retomada,
    '- **P22.2 — N4.09 promovida como estreia Composer e telemetria de área corrigida**.',
    '- **P22.2 — N4.09 promovida como estreia Composer e telemetria de área corrigida**.\n- **P22.3A — N1.07 alinhada ao grafo: sucessor, antecessor, ordenação e prereqs canônicos**.',
    "fechados RETOMADA",
  );
  retomada = replaceOnce(retomada, '## 7. PRÓXIMA TAREFA EXATA — P22.3A N1.07', '## 7. P22.3A — N1.07 CONCLUÍDA', "seção P22.3A RETOMADA");
  retomada += '\n\n## PRÓXIMA TAREFA EXATA — P22.3B JD4\n\nRegistrar JD4 no Jardim **somente como automaticidade de N1.07**. Preservar `dojoTracks` separado da Jornada; `rt_alvo` é metadado de fluência e nunca domínio conceitual. Validar cinco níveis, telemetria, sonda e gates antes de abrir N1.09.\n';
  fs.writeFileSync(retomadaPath, retomada);

  let handoff = fs.readFileSync(handoffPath, "utf8");
  handoff = replaceOnce(
    handoff,
    '> **VIGENTE — 8/ago/2026. P21 concluída; P22.1 e P22.2 concluídas; próximo passo P22.3A/N1.07.**',
    '> **VIGENTE — 8/ago/2026. P21 concluída; P22.1, P22.2 e P22.3A concluídas; próximo passo P22.3B/JD4.**',
    "cabeçalho HANDOFF",
  );
  handoff = replaceOnce(
    handoff,
    '- P22.2 — N4.09 promovida e telemetria de área corrigida.',
    '- P22.2 — N4.09 promovida e telemetria de área corrigida.\n- P22.3A — N1.07 alinhada ao grafo: sucessor, antecessor, ordenação e prereqs `N1.02 + N1.06`.',
    "fechados HANDOFF",
  );
  handoff = replaceOnce(handoff, '## Próximo passo — P22.3A N1.07', '## P22.3A — N1.07 concluída', "seção P22.3A HANDOFF");
  handoff += '\n\n## Próximo passo — P22.3B JD4\n\nImplementar JD4 como fluência/automaticidade posterior de N1.07, com estado separado da Jornada. Não usar velocidade para conceder domínio conceitual.\n';
  fs.writeFileSync(handoffPath, handoff);

  let decisao = fs.readFileSync(decisaoPath, "utf8");
  decisao = replaceOnce(decisao, 'P22.1 e P22.2 estão concluídas. P22.3A é o próximo lote.', 'P22.1, P22.2 e P22.3A estão concluídas. P22.3B/JD4 é o próximo lote.', "estado DECISAO P22");
  decisao = replaceOnce(decisao, '## 6. P22.3A — próxima execução', '## 6. P22.3A — CONCLUÍDA', "seção P22.3A DECISAO");
  decisao += '\n\n## Checkpoint P22.3A — 8/ago/2026\n\nN1.07 agora corresponde ao grafo: faixa F0, prereqs `N1.02 + N1.06`, sucessor até 5/10, antecessor até 5/10 e ordenação de 3–4 numerais. O Composer ganhou somente o modo opt-in `plain/ordering`; os saltos genéricos agora respeitam direção negativa sem escapar do intervalo. O rollback legado permanece congelado. `N1.07.test.ts` trava o contrato e acerto não gera misconception. Próximo lote: P22.3B/JD4 como automaticidade separada.\n';
  fs.writeFileSync(decisaoPath, decisao);

  // Gates do estado NOVO. `npx vitest` evita disparar este posttest novamente.
  run("npx vitest run src/curriculum/fichas/jornada/N1.07.test.ts src/curriculum/motores/canaryContract.test.ts");
  run("npm run auditar");
  run("npm run fichas:auditar");
  run("npm run fichas:conferir");
  run("npm run grafo:check");
  run("npx tsc --noEmit");
  run('npm run sonda -- "N1.07"', { SONDA_CHROME: "/usr/bin/google-chrome" });
  run("npx vitest run");
  run("npm run build");
  run("npm run pr:check");
  run("git diff --check");

  cleanupPublisher();
  run('git config user.name "saga-ci-bot"');
  run('git config user.email "saga-ci-bot@users.noreply.github.com"');
  run("git add -A");
  run('git commit -m "P22.3A: completa N1.07 canônica"');
  run(`git push origin HEAD:${branch}`);
  console.log("\n[p22.3a] publicado com sucesso");
} catch (error) {
  publishCleanupOnly(error?.stack || String(error));
  process.exitCode = 1;
}
