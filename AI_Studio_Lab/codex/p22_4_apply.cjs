const fs = require("node:fs");
const cp = require("node:child_process");

const mode = process.argv[2];
const branch = "codex/integrar-bloco-f0";
const stableCiCommit = "40c571e2d642f80deabb697ebe1d24e3ece450e7";
const self = "AI_Studio_Lab/codex/p22_4_apply.cjs";

function once(text, before, after, label) {
  if (!text.includes(before)) throw new Error(`P22.4: âncora ausente — ${label}`);
  return text.replace(before, after);
}
function run(command) {
  console.log(`[P22.4] $ ${command}`);
  cp.execSync(command, { stdio: "inherit" });
}

function apply() {
  const composerPath = "src/curriculum/Composer.ts";
  let composer = fs.readFileSync(composerPath, "utf8");
  composer = once(
    composer,
`      case "plain": {
        // P22.3B: alternância de vizinhos é opt-in para JD4. Ela mede fluência`,
`      case "plain": {
        // P22.4: gramática de contagem até 20. Os quatro modos são opt-in e
        // deixam o plain legado intacto para todas as outras competências.
        if (["count_objects", "sequence_next", "countdown_next", "counting_mixed"].includes(String(params.modo))) {
          const requestedMode = String(params.modo);
          const countingMode = requestedMode === "counting_mixed"
            ? ["count_objects", "sequence_next", "countdown_next"][randomInt(0, 2)]
            : requestedMode;

          if (countingMode === "count_objects") {
            const min = params.n_min ?? 10;
            const max = params.n_max ?? 20;
            if (!Number.isInteger(min) || !Number.isInteger(max) || min < 1 || min > max || max > 20) {
              throw new Error(\`Intervalo inválido para count_objects em \${ficha.id}/\${micro.id}.\`);
            }
            const target = randomInt(min, max);
            emoji = EMOJIS[randomInt(0, EMOJIS.length - 1)];
            n = target;
            answer = target;
            big = Array.from({ length: target }, () => emoji).join(" ");
            uiProps = { text: big };
            options = numericOptions(target, Math.max(0, target - 2), Math.min(20, target + 2));
            evaluate = ans => Number(ans) === target;
            promptOverride = "Quantos objetos há aqui? Conte e escolha o número.";
          } else if (countingMode === "sequence_next") {
            const min = params.start ?? 4;
            const max = params.end ?? 17;
            if (!Number.isInteger(min) || !Number.isInteger(max) || min < 1 || min > max || max > 17) {
              throw new Error(\`Intervalo inválido para sequence_next em \${ficha.id}/\${micro.id}.\`);
            }
            const start = randomInt(min, max);
            const correta = [start + 1, start + 2, start + 3];
            const respostas = [
              correta,
              [start, start + 1, start + 2],
              [1, 2, 3],
              [start + 1, start + 3, start + 2],
            ].map(seq => seq.join(" · "));
            answer = correta.join(" · ");
            big = \`\${start} → …\`;
            uiProps = { text: big };
            options = Array.from(new Set(respostas)).map(value => ({ label: value, value })).sort(() => Math.random() - 0.5);
            evaluate = ans => String(ans) === answer;
            promptOverride = \`Comece no \${start}. Qual trilha continua a contagem certinho?\`;
          } else {
            const min = params.start ?? 3;
            const max = params.end ?? 10;
            if (!Number.isInteger(min) || !Number.isInteger(max) || min < 3 || min > max || max > 20) {
              throw new Error(\`Intervalo inválido para countdown_next em \${ficha.id}/\${micro.id}.\`);
            }
            const start = randomInt(min, max);
            const correta = [start - 1, start - 2, start - 3];
            const respostas = [
              correta,
              [start, start - 1, start - 2],
              [start + 1, start + 2, start + 3],
              [start - 1, start - 3, start - 2],
            ].map(seq => seq.join(" · "));
            answer = correta.join(" · ");
            big = \`\${start} → …\`;
            uiProps = { text: big };
            options = Array.from(new Set(respostas)).map(value => ({ label: value, value })).sort(() => Math.random() - 0.5);
            evaluate = ans => String(ans) === answer;
            promptOverride = \`Comece no \${start} e conte para trás. Qual trilha está certa?\`;
          }
        } else if (params.modo === "neighbor_alternating") {
          // P22.3B: alternância de vizinhos é opt-in para JD4. Ela mede fluência`,
    "modos de contagem plain",
  );
  fs.writeFileSync(composerPath, composer);

  fs.writeFileSync("src/curriculum/fichas/jornada/N1.09.ts", `import { FichaCompetencia } from "../../schema";
import { MisconceptionTag } from "../../../constants/misconceptions";

/** N1.09 — contagem até 20 e a partir de qualquer número. */
export const N1_09: FichaCompetencia = {
  id: "N1.09",
  nome: "Contagem até 20 e a partir de qualquer número",
  strand: "N1",
  faixa: "F0",
  prereqs: ["N1.04", "N1.02"],
  bncc: "EF01MA01",
  howto: "Conte cada objeto uma vez ou continue a sequência do número em que ela começou.",
  explain: "A contagem não precisa começar no um. Cada palavra-numero aponta para o próximo número da sequência; para voltar, seguimos a ordem ao contrário.",
  distratores: [
    { regra: "n+1", tag: MisconceptionTag.OFF_BY_ONE },
    { regra: "n-1", tag: MisconceptionTag.OFF_BY_ONE },
  ],
  niveis: {
    1: { primitiva: "scattered", micro: "contar15", andaime: "alto" },
    2: { primitiva: "scattered", micro: "contar20", andaime: "medio" },
    3: { primitiva: "plain", micro: "partirDeN", andaime: "medio" },
    4: { primitiva: "plain", micro: "regressiva", andaime: "minimo" },
    5: { primitiva: "plain", micro: "misto", andaime: "minimo" },
  },
  micros: [
    {
      id: "contar15",
      fonte: "GRAFO_N1.09",
      alvo: "contar conjuntos de 10 a 15 objetos com correspondência um-a-um",
      kinds: ["scattered"],
      params: { n_min: 10, n_max: 15, audio_prompt: "Conte os objetos. Quantos há?" },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
    {
      id: "contar20",
      fonte: "GRAFO_N1.09",
      alvo: "contar conjuntos de 10 a 20 objetos sem perder nem repetir itens",
      kinds: ["scattered"],
      params: { n_min: 10, n_max: 20, audio_prompt: "Conte com calma. Quantos objetos há?" },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
    {
      id: "partirDeN",
      fonte: "GRAFO_N1.09",
      alvo: "iniciar a sequência em um número interno e continuar sem voltar ao um",
      kinds: ["plain"],
      params: { modo: "sequence_next", start: 4, end: 17 },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
    {
      id: "regressiva",
      fonte: "GRAFO_N1.09",
      alvo: "continuar uma contagem regressiva simples até zero",
      kinds: ["plain"],
      params: { modo: "countdown_next", start: 3, end: 10 },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
    {
      id: "misto",
      fonte: "GRAFO_N1.09",
      alvo: "recuperar flexivelmente contagem de objetos, continuação a partir de N e regressiva",
      kinds: ["plain"],
      params: { modo: "counting_mixed", n_min: 10, n_max: 20, start: 4, end: 10 },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
  ],
  erros_tipicos: [
    { id: "SEQUENCE_BREAK", descricao: "Quebra a sequência ou pula um número." },
    { id: "CANNOT_START_ARBITRARY", descricao: "Precisa voltar ao um para continuar uma contagem iniciada em outro número." },
    { id: "SKIP_NUMBERS", descricao: "Pula ou repete objetos/números durante a contagem." },
  ],
};
`);

  fs.writeFileSync("src/curriculum/fichas/jornada/N1.09.test.ts", `import { describe, expect, it } from "vitest";
import { Composer } from "../../Composer";
import { misconceptionForAnswer } from "../../../components/gameloop/answerPolicy";
import { N1_09 } from "./N1.09";

const sample = (level: number, count = 100) =>
  Array.from({ length: count }, () => Composer.generate(N1_09, level));

describe("P22.4 — N1.09 contagem flexível até 20", () => {
  it("preserva o cânone e os prerequisitos", () => {
    expect(N1_09.faixa).toBe("F0");
    expect(N1_09.prereqs).toEqual(["N1.04", "N1.02"]);
    expect(N1_09.micros.map(m => m.id)).toEqual(["contar15", "contar20", "partirDeN", "regressiva", "misto"]);
  });

  it("L1-L2 contam conjuntos 10..15 e 10..20", () => {
    for (const [level, max] of [[1, 15], [2, 20]] as const) {
      for (const q of sample(level)) {
        expect(q.kind).toBe("scattered");
        expect(Number(q.answer)).toBeGreaterThanOrEqual(10);
        expect(Number(q.answer)).toBeLessThanOrEqual(max);
        expect(q.n).toBe(q.answer);
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
      }
    }
  });

  it("L3 começa em N interno e oferece a continuação correta", () => {
    for (const q of sample(3, 140)) {
      const start = Number(String(q.big).split("→")[0].trim());
      const expected = [start + 1, start + 2, start + 3].join(" · ");
      expect(start).toBeGreaterThanOrEqual(4);
      expect(start).toBeLessThanOrEqual(17);
      expect(q.answer).toBe(expected);
      expect(q.options?.map(option => String(option.value))).toContain(expected);
      expect(q.evaluate?.(q.answer)).toBe(true);
    }
  });

  it("L4 faz regressiva simples e alcança zero quando o início permite", () => {
    let viuZero = false;
    for (const q of sample(4, 220)) {
      const start = Number(String(q.big).split("→")[0].trim());
      const expected = [start - 1, start - 2, start - 3].join(" · ");
      expect(q.answer).toBe(expected);
      expect(q.options?.map(option => String(option.value))).toContain(expected);
      expect(q.evaluate?.(q.answer)).toBe(true);
      if (expected.split(" · ").includes("0")) viuZero = true;
    }
    expect(viuZero).toBe(true);
  });

  it("L5 mistura as três famílias sem transformar velocidade em domínio", () => {
    let objetos = 0;
    let frente = 0;
    let tras = 0;
    for (const q of sample(5, 360)) {
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.options?.map(option => String(option.value))).toContain(String(q.answer));
      expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
      if (typeof q.answer === "number") objetos += 1;
      else if (q.prompt.toLowerCase().includes("para trás")) tras += 1;
      else frente += 1;
    }
    expect(objetos).toBeGreaterThan(0);
    expect(frente).toBeGreaterThan(0);
    expect(tras).toBeGreaterThan(0);
    expect(N1_09.niveis[5].rt_alvo).toBeUndefined();
  });
});
`);

  const registryPath = "src/curriculum/fichas/index.ts";
  let registry = fs.readFileSync(registryPath, "utf8");
  registry = once(registry,
    "import { N1_08 } from './jornada/N1.08';\nimport { N1_10 } from './jornada/N1.10';",
    "import { N1_08 } from './jornada/N1.08';\nimport { N1_09 } from './jornada/N1.09';\nimport { N1_10 } from './jornada/N1.10';",
    "import Journey N1.09",
  );
  registry = once(registry,
    "N1_01, N1_02, N1_03, N1_04, N1_06, N1_07, N1_08, N1_10, N1_11, N1_13,",
    "N1_01, N1_02, N1_03, N1_04, N1_06, N1_07, N1_08, N1_09, N1_10, N1_11, N1_13,",
    "registrar Journey N1.09",
  );
  fs.writeFileSync(registryPath, registry);

  const canaryPath = "src/curriculum/motores/composerCanary.ts";
  let canary = fs.readFileSync(canaryPath, "utf8");
  canary = once(canary,
    'import { N1_08 } from "../fichas/jornada/N1.08";\nimport { N1_13 }',
    'import { N1_08 } from "../fichas/jornada/N1.08";\nimport { N1_09 } from "../fichas/jornada/N1.09";\nimport { N1_13 }',
    "import Composer N1.09",
  );
  canary = once(canary,
    '  "N1.07": N1_07,\n  "N1.08": N1_08,\n\n  // F04:',
    '  "N1.07": N1_07,\n  "N1.08": N1_08,\n  // P22.4: contagem até 20; desligado volta ao gVis_Sequence legado.\n  "N1.09": N1_09,\n\n  // F04:',
    "registry Composer N1.09",
  );
  fs.writeFileSync(canaryPath, canary);

  const idsPath = "src/curriculum/motores/composerCanaryIds.ts";
  let ids = fs.readFileSync(idsPath, "utf8");
  ids = once(ids,
    '  "N1.06",\n  "N1.13",',
    '  "N1.06",\n  "N1.09",\n  "N1.13",',
    "promover N1.09",
  );
  fs.writeFileSync(idsPath, ids);

  const contractPath = "src/curriculum/motores/canaryContract.test.ts";
  let contract = fs.readFileSync(contractPath, "utf8");
  contract = once(contract,
    'import { N1_08 } from "../fichas/jornada/N1.08";\nimport { N1_10 }',
    'import { N1_08 } from "../fichas/jornada/N1.08";\nimport { N1_09 } from "../fichas/jornada/N1.09";\nimport { N1_10 }',
    "import contrato N1.09",
  );
  contract = once(contract,
    '  "N1.07": N1_07,\n  "N1.08": N1_08,\n  "N1.10": N1_10,',
    '  "N1.07": N1_07,\n  "N1.08": N1_08,\n  "N1.09": N1_09,\n  "N1.10": N1_10,',
    "registro contrato N1.09",
  );
  fs.writeFileSync(contractPath, contract);

  const auditorPath = "AI_Studio_Lab/tools/ficha_catalog_auditor.cjs";
  let auditor = fs.readFileSync(auditorPath, "utf8");
  auditor = once(auditor, "const EXPECTED_FICHAS = 92;", "const EXPECTED_FICHAS = 93;", "contagem de fichas");
  auditor = once(auditor,
    '  ["N1.09", "P21/P22: nó do grafo ainda sem ficha Markdown; decisão pedagógica deliberada pendente."],\n',
    "",
    "remover exceção N1.09",
  );
  fs.writeFileSync(auditorPath, auditor);

  fs.writeFileSync("AI_Studio_Lab/pedagogia/fichas/FICHA_P22_N1_09_CONTAGEM.md", `# FICHA P22-N1.09 — Contagem flexível até 20
**Competência:** N1.09 (contagem até 20 e a partir de qualquer número) · **Primitiva:** \`ScatteredItems\` + \`plain\` · **Faixa:** F0

## 1. Objetivo observável
A criança conta conjuntos de 10–20 elementos, continua uma sequência iniciada em qualquer número trabalhado e faz regressiva simples até zero sem precisar reiniciar no 1.

## 2. Pré-requisitos
N1.04 (contagem por toque) + N1.02 (sequência oral estável). N1.13 não é pré-requisito nem substituto: produzir uma quantidade e continuar uma sequência são habilidades diferentes.

## 3. Escada de cinco níveis
1. 10–15 objetos dispersos; 2. 10–20 objetos dispersos; 3. sequência iniciada em N; 4. regressiva; 5. recuperação mista das três famílias. A dificuldade muda por escopo/flexibilidade, não por cronômetro.

## 4. Cena e roteiro
L1/L2 mostram objetos grandes e tocáveis visualmente; a voz pergunta “Quantos há?”. L3 mostra apenas o número inicial e alternativas com trilhas numéricas, para provar que a criança consegue partir daquele N. L4 inverte explicitamente a direção: “conte para trás”. L5 alterna famílias sem anunciar qual estratégia usar.

## 5. Exemplos e não-exemplos
Exemplos: 13 objetos → 13; começar em 7 → 8·9·10; começar em 6 e voltar → 5·4·3. Não-exemplos diagnósticos: voltar para 1, repetir o número inicial, saltar um termo, trocar a direção ou perder um objeto no conjunto.

## 6. Erros e feedback
OFF_BY_ONE em contagem numérica recebe reconferência visual. Quebra de sequência recebe a trilha correta falada devagar a partir do ponto de erro. “Voltar ao 1” não é marcado como falha de conhecimento de numeral: é dependência de recitação e pede treino de partida arbitrária.

## 7. Linguagem pré-leitora e acessibilidade
Áudio carrega a instrução; texto é apoio. Numerais e objetos são o conteúdo principal. Alternativas têm touch targets inteiros; nenhuma resposta depende de ler uma frase. Em 320/390/900 a cena deve caber sem rolagem horizontal.

## 8. Evidência de domínio
Evidência precisa aparecer em mais de uma sessão e em todas as famílias: contar 10–20, partir de N e regressiva. Tempo de resposta pode ser observado, mas não coroa domínio conceitual.

## 9. Rollback e contraprovas
O legado \`gVis_Sequence\` permanece como rollback operacional, não como cânone: ele cobre somente continuação parcial. Contraprova obrigatória: uma criança que resolve “qual vem depois?” mas não conta 17 objetos ou não consegue 6→5→4 não domina N1.09.
`);

  const sondaPath = "sonda/cenas.tsx";
  let sonda = fs.readFileSync(sondaPath, "utf8");
  sonda = once(sonda,
    'import { N1_08 } from "../src/curriculum/fichas/jornada/N1.08";\nimport { AL_02 }',
    'import { N1_08 } from "../src/curriculum/fichas/jornada/N1.08";\nimport { N1_09 } from "../src/curriculum/fichas/jornada/N1.09";\nimport { AL_02 }',
    "import sonda N1.09",
  );
  sonda = once(sonda,
`  // N1.09 — produzir quantidade (F04), implementada e NÃO ativada. Três estados
  // que valem olhar: a vaga pulsando (nível 1), o contorno discreto (nível 3) e
  // a CENA LIVRE (nível 4), que é onde a ficha diz estar o salto — e onde a
  // tela tem de sustentar até 12 objetos sem vaga nenhuma guiando.
  { nome: "N1.09 (o nó antigo) segue com o legado de contagem (nível 2)", render: (s) => <Exercicio id="N1.09" lvl={2} semente={s} /> },
  ...[1, 3, 4, 5].map(lvl => ({
    nome: \`N1.13 produzir quantidade (nível \${lvl})\`,`,
`  // P22.4 — N1.09 volta ao significado canônico. O legado continua medido
  // porque é o rollback; as cinco cenas autorais provam o runtime promovido.
  { nome: "P22.4 N1.09 rollback legado de sequência (nível 2)", render: (s) => <Exercicio id="N1.09" lvl={2} semente={s} /> },
  ...[1, 2, 3, 4, 5].map(lvl => ({
    nome: \`P22.4 N1.09 autoral (nível \${lvl})\`,
    render: (s: number) => <ExercicioDaFicha ficha={N1_09} lvl={lvl} semente={s} />,
  })),
  // N1.13 permanece a competência separada de PRODUZIR quantidade.
  ...[1, 3, 4, 5].map(lvl => ({
    nome: \`N1.13 produzir quantidade (nível \${lvl})\`,`,
    "sonda N1.09 autoral + rollback",
  );
  sonda = once(sonda,
    'nome: "N1.09 micro-aula: as vagas pulsando",',
    'nome: "N1.13 micro-aula: as vagas pulsando",',
    "corrigir rótulo antigo N1.13",
  );
  fs.writeFileSync(sondaPath, sonda);

  console.log("[P22.4] patch aplicado no workspace");
}

function publish() {
  run(`git show ${stableCiCommit}:.github/workflows/ci.yml > .github/workflows/ci.yml`);
  fs.rmSync(self, { force: true });
  run('git config user.name "saga-ci-bot"');
  run('git config user.email "saga-ci-bot@users.noreply.github.com"');
  run("git add -A");
  run("git diff --cached --check");
  run('git commit -m "P22.4: constroi e promove N1.09"');
  run(`git push origin HEAD:${branch}`);
}

if (mode === "apply") apply();
else if (mode === "publish") publish();
else throw new Error("uso: node p22_4_apply.cjs <apply|publish>");
