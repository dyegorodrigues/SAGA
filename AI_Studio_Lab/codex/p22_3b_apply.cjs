const fs = require("node:fs");
const cp = require("node:child_process");

const mode = process.argv[2];
const branch = "codex/integrar-bloco-f0";
const stableCiCommit = "a5a154de91ac4d90f6b0f4af00a557710d76b0e7";
const self = "AI_Studio_Lab/codex/p22_3b_apply.cjs";

function once(text, before, after, label) {
  if (!text.includes(before)) throw new Error(`P22.3B: âncora ausente — ${label}`);
  return text.replace(before, after);
}
function run(command) {
  console.log(`[P22.3B] $ ${command}`);
  cp.execSync(command, { stdio: "inherit" });
}

function apply() {
  const composerPath = "src/curriculum/Composer.ts";
  let composer = fs.readFileSync(composerPath, "utf8");
  composer = once(
    composer,
`      case "plain": {
        // P22.3A: ordenação é opt-in; nenhuma outra ficha plain muda de semântica.
        if (params.modo === "ordering") {`,
`      case "plain": {
        // P22.3B: alternância de vizinhos é opt-in para JD4. Ela mede fluência
        // de um conceito já aprendido; não cria uma nova competência da Jornada.
        if (params.modo === "neighbor_alternating") {
          const start = params.start ?? 1;
          const end = params.end ?? 20;
          if (!Number.isInteger(start) || !Number.isInteger(end) || start >= end) {
            throw new Error(\`Intervalo inválido para vizinhos em \${ficha.id}/\${micro.id}.\`);
          }
          const jump = Math.random() < 0.5 ? 1 : -1;
          const currentMin = jump > 0 ? start : start - jump;
          const currentMax = jump > 0 ? end - jump : end;
          const current = randomInt(currentMin, currentMax);
          answer = current + jump;
          big = String(current);
          uiProps = { text: String(current) };
          options = numericOptions(Number(answer), start, end);
          evaluate = ans => Number(ans) === answer;
          promptOverride = jump < 0 ? "Qual número vem antes?" : "Qual número vem depois?";
        } else if (params.modo === "ordering") {`,
    "plain/neighbor_alternating",
  );
  fs.writeFileSync(composerPath, composer);

  const jardimPath = "src/curriculum/fichas/dojo/jardim/index.ts";
  let jardim = fs.readFileSync(jardimPath, "utf8");
  jardim = once(
    jardim,
`/** JD5 completa: a Jornada formaliza no L5; o Jardim preserva o L5 sem moldura. */
export const JD5: FichaCompetencia = {`,
`/**
 * JD4 — O Passo Seguinte. Mãe: N1.07.
 *
 * Exceção de transição dentro do Jardim: a camada é majoritariamente
 * pré-simbólica, mas JD4 começa oralmente e consolida a vizinhança numérica já
 * compreendida na Jornada. Não ensina contagem de 2 em 2 e não usa N1.09 como
 * segunda mãe; essas ideias permanecem conteúdo curricular separado.
 */
export const JD4: FichaCompetencia = {
  id: "JD4",
  nome: "Jardim · O Passo Seguinte",
  strand: "JD",
  faixa: "F0",
  prereqs: ["N1.07"],
  howto: "Escute ou veja o número e responda o vizinho sem voltar a contar desde o um.",
  explain: "O sucessor é o vizinho da direita; o antecessor é o vizinho da esquerda.",
  distratores: [],
  niveis: {
    1: { primitiva: "numberline", micro: "sucessor5", rt_alvo: 4000 },
    2: { primitiva: "numberline", micro: "sucessor10", rt_alvo: 3500 },
    3: { primitiva: "plain", micro: "sucessor20", rt_alvo: 3500 },
    4: { primitiva: "plain", micro: "antecessor10", rt_alvo: 3500 },
    5: { primitiva: "plain", micro: "alternado20", rt_alvo: 3000 },
  },
  micros: [
    {
      id: "sucessor5",
      fonte: "JD4",
      alvo: "recuperar o sucessor até 5 com a reta ainda disponível",
      kinds: ["numberline"],
      params: { start: 1, end: 5, jump_size: 1, audio_prompt: "Qual número vem depois?" },
      dominio,
    },
    {
      id: "sucessor10",
      fonte: "JD4",
      alvo: "recuperar o sucessor até 10 com apoio reduzido",
      kinds: ["numberline"],
      params: { start: 1, end: 10, jump_size: 1, audio_prompt: "Qual número vem depois?" },
      dominio,
    },
    {
      id: "sucessor20",
      fonte: "JD4",
      alvo: "recuperar o sucessor até 20 sem reta",
      kinds: ["plain"],
      params: { start: 1, end: 20, jump_size: 1, audio_prompt: "Qual número vem depois?" },
      dominio,
    },
    {
      id: "antecessor10",
      fonte: "JD4",
      alvo: "recuperar o antecessor até 10 sem recitar a sequência inteira",
      kinds: ["plain"],
      params: { start: 1, end: 10, jump_size: -1, audio_prompt: "Qual número vem antes?" },
      dominio,
    },
    {
      id: "alternado20",
      fonte: "JD4",
      alvo: "alternar sucessor e antecessor até 20 com acesso direto",
      kinds: ["plain"],
      params: { modo: "neighbor_alternating", start: 1, end: 20 },
      dominio,
    },
  ],
  erros_tipicos: [
    { id: "RECITA_TUDO", descricao: "Volta ao um e recita a sequência antes de responder." },
    { id: "INVERTE_DIRECAO", descricao: "Confunde antes e depois." },
    { id: "SO_VAI_PRA_FRENTE", descricao: "Sucessor está automático, mas o antecessor ainda trava." },
  ],
};

/** JD5 completa: a Jornada formaliza no L5; o Jardim preserva o L5 sem moldura. */
export const JD5: FichaCompetencia = {`,
    "inserir JD4",
  );
  jardim = once(
    jardim,
`/**
 * Todas as trilhas cujo manipulativo ja existe. JD4 continua fora: e outra divida
 * e nao deve entrar de carona na P17.
 */
export const JARDIM: TrilhaDoJardim[] = [
  { ficha: JD1, mae: "N1.03", destravaNoNivel: 3 },
  { ficha: JD2, mae: "N1.08", destravaNoNivel: 3 },
  { ficha: JD3, mae: "N1.11", destravaNoNivel: 3 },
  { ficha: JD5, mae: "N1.10", destravaNoNivel: 3 },
];`,
`/** Todas as cinco trilhas canônicas do Jardim. */
export const JARDIM: TrilhaDoJardim[] = [
  { ficha: JD1, mae: "N1.03", destravaNoNivel: 3 },
  { ficha: JD2, mae: "N1.08", destravaNoNivel: 3 },
  { ficha: JD3, mae: "N1.11", destravaNoNivel: 3 },
  { ficha: JD4, mae: "N1.07", destravaNoNivel: 3 },
  { ficha: JD5, mae: "N1.10", destravaNoNivel: 3 },
];`,
    "registrar JD4 no Jardim",
  );
  fs.writeFileSync(jardimPath, jardim);

  const sessionPath = "src/curriculum/motores/jardimSession.ts";
  let session = fs.readFileSync(sessionPath, "utf8");
  session = once(
    session,
`  JD3: { icon: "🔟", color: "#EDE9FE", dark: "#7C3AED" },
  JD5: { icon: "🧠", color: "#FEF3C7", dark: "#D97706" },`,
`  JD3: { icon: "🔟", color: "#EDE9FE", dark: "#7C3AED" },
  JD4: { icon: "👣", color: "#FCE7F3", dark: "#DB2777" },
  JD5: { icon: "🧠", color: "#FEF3C7", dark: "#D97706" },`,
    "visual JD4",
  );
  fs.writeFileSync(sessionPath, session);

  const fichaMdPath = "AI_Studio_Lab/pedagogia/fichas/FICHAS_F0_COMPLETAS.md";
  let fichaMd = fs.readFileSync(fichaMdPath, "utf8");
  fichaMd = once(
    fichaMd,
    '| **3** | sucessor | **não** | até 10 |',
    '| **3** | sucessor | **não** | até 20 |',
    "escopo JD4 L3",
  );
  fichaMd = once(
    fichaMd,
    '**audioPrompt:** *"Escute e diga o que vem depois."*\n**howto:** *"Pense na sequência. Depois do cinco vem sempre o mesmo número."*\n**explain:** *"Olhe a reta: o próximo é o vizinho da direita, um passinho à frente."*',
    '**audioPrompt:** *"Escute e responda o vizinho pedido."*\n**howto:** *"Pense na sequência sem voltar ao um. Depois e antes têm vizinhos fixos."*\n**explain:** *"Na reta, o sucessor é o vizinho da direita e o antecessor é o vizinho da esquerda."*',
    "falas JD4 bidirecionais",
  );
  fs.writeFileSync(fichaMdPath, fichaMd);

  const dojoPath = "AI_Studio_Lab/pedagogia/DOJO_SAGA.md";
  let dojo = fs.readFileSync(dojoPath, "utf8");
  dojo = once(dojo, '**Versão 1.5 · Agosto 2026 · Especificação completa do pilar de fluência**', '**Versão 1.6 · Agosto 2026 · Especificação completa do pilar de fluência**', "versão Dojo");
  dojo = once(
    dojo,
    '> *O número acima acompanha SEMPRE a última entrada do changelog no fim do arquivo. Cabeçalho e changelog divergentes = documento inválido (Bíblia §1).*\n*v1.5',
    '> *O número acima acompanha SEMPRE a última entrada do changelog no fim do arquivo. Cabeçalho e changelog divergentes = documento inválido (Bíblia §1).*\n*v1.6 (ago/2026) — P22.3B: JD4 entra no runtime como automaticidade exclusiva de N1.07. A referência histórica N1.07/N1.09 é desfeita após a separação curricular de N1.09; contar de 2 em 2 deixa de ocupar JD4 e aguarda destino curricular próprio. O Jardim é majoritariamente pré-simbólico, mas JD4 é uma ponte oral→simbólica inicial deliberada. Cinco degraus: sucessor até 5/10 com reta, sucessor até 20 sem reta, antecessor até 10 e alternância até 20. `dojoTracks` continua separado da Jornada e tempo nunca concede domínio conceitual.*\n*v1.5',
    "changelog v1.6",
  );
  dojo = once(
    dojo,
    '- **JD4 · O Passo Seguinte** (mãe: N1.07/N1.09): "cinco!" (áudio) → toca o que vem depois, cada vez mais rápido; depois contar de 2 em 2 no ritmo do tambor (semente de AL.03 e das tabuadas). **Ainda não entra no runtime P8; permanece dívida curricular separada.**',
    '- **JD4 · O Passo Seguinte** (mãe: **N1.07**): áudio/estímulo numérico → sucessor com apoio, depois sem reta, antecessor e finalmente alternância até 20. É a exceção de transição oral→simbólica do Jardim. **Não usa N1.09 como segunda mãe e não treina contagem de 2 em 2**; essa ideia histórica permanece válida como conteúdo, mas exige destino curricular próprio. **Runtime P22.3B ativo em `dojoTracks`.**',
    "bullet JD4 vigente",
  );
  fs.writeFileSync(dojoPath, dojo);

  const testPath = "src/curriculum/fichas/dojo/jardim/JD4.test.ts";
  fs.writeFileSync(testPath, `import { describe, expect, it } from "vitest";
import { misconceptionForAnswer } from "../../../../components/gameloop/answerPolicy";
import { Composer } from "../../../Composer";
import { JOURNEY_FICHAS } from "../../index";
import { jardimProgressProjection, jardimTrack, resolveJardimState } from "../../../motores/jardimSession";
import { JD4, JARDIM } from ".";

const progress = (lvl: number, maxLvl = lvl) => ({
  lvl, maxLvl, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0,
});
const sample = (level: number, count = 80) =>
  Array.from({ length: count }, () => Composer.generate(JD4, level));

describe("P22.3B — JD4 O Passo Seguinte", () => {
  it("é trilha do Jardim, mãe exclusiva N1.07 e nunca nó da Journey", () => {
    const config = JARDIM.find(item => item.ficha.id === "JD4");
    expect(config).toMatchObject({ mae: "N1.07", destravaNoNivel: 3 });
    expect(JD4.prereqs).toEqual(["N1.07"]);
    expect(JOURNEY_FICHAS.some(ficha => ficha.id === "JD4")).toBe(false);
  });

  it("destrava pela compreensão da mãe e a projeção jamais cria domínio conceitual", () => {
    const config = JARDIM.find(item => item.ficha.id === "JD4")!;
    expect(resolveJardimState(config, progress(2)).unlocked).toBe(false);
    const open = resolveJardimState(config, progress(3), {
      unlocked: false, mastered: true, family: "JD", currentStep: 5, highestStep: 5,
    });
    expect(open.unlocked).toBe(true);
    const projection = jardimProgressProjection(open);
    expect(projection.dom).toBe(false);
    expect(projection.mast).toBe(0);
    expect(projection.bank).toEqual([]);
  });

  it("preserva rt_alvo como fluência nos cinco degraus", () => {
    const config = JARDIM.find(item => item.ficha.id === "JD4")!;
    const track = jardimTrack(config);
    expect(track.totalQ).toBe(8);
    expect([1, 2, 3, 4, 5].map(level => track.gen(level).rt_max_s)).toEqual([4, 3.5, 3.5, 3.5, 3]);
  });

  it("L1-L2 recuperam sucessor com reta dentro do escopo", () => {
    for (const level of [1, 2]) {
      for (const q of sample(level)) {
        const spec = q.uiProps as { startPos: number };
        expect(q.kind).toBe("numberline");
        expect(Number(q.answer)).toBe(spec.startPos + 1);
        expect(Number(q.answer)).toBeLessThanOrEqual(level === 1 ? 5 : 10);
        expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
      }
    }
  });

  it("L3 amplia sucessor até 20 sem reta e L4 treina antecessor", () => {
    for (const q of sample(3, 140)) {
      expect(q.kind).toBe("plain");
      expect(q.prompt.toLowerCase()).toContain("depois");
      expect(Number(q.answer)).toBe(Number(q.big) + 1);
      expect(Number(q.answer)).toBeLessThanOrEqual(20);
    }
    for (const q of sample(4, 140)) {
      expect(q.kind).toBe("plain");
      expect(q.prompt.toLowerCase()).toContain("antes");
      expect(Number(q.answer)).toBe(Number(q.big) - 1);
      expect(Number(q.answer)).toBeGreaterThanOrEqual(1);
    }
  });

  it("L5 alterna as duas direções sem sair de 1..20", () => {
    let antes = 0;
    let depois = 0;
    for (const q of sample(5, 240)) {
      const current = Number(q.big);
      const answer = Number(q.answer);
      expect(q.kind).toBe("plain");
      expect(answer).toBeGreaterThanOrEqual(1);
      expect(answer).toBeLessThanOrEqual(20);
      expect(Math.abs(answer - current)).toBe(1);
      expect(q.options?.map(option => Number(option.value))).toContain(answer);
      expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
      if (q.prompt.toLowerCase().includes("antes")) {
        antes += 1;
        expect(answer).toBe(current - 1);
      } else {
        depois += 1;
        expect(q.prompt.toLowerCase()).toContain("depois");
        expect(answer).toBe(current + 1);
      }
    }
    expect(antes).toBeGreaterThan(0);
    expect(depois).toBeGreaterThan(0);
  });
});
`);

  console.log("[P22.3B] patch aplicado no workspace");
}

function publish() {
  run(`git show ${stableCiCommit}:.github/workflows/ci.yml > .github/workflows/ci.yml`);
  fs.rmSync(self, { force: true });
  run('git config user.name "saga-ci-bot"');
  run('git config user.email "saga-ci-bot@users.noreply.github.com"');
  run("git add -A");
  run("git diff --cached --check");
  run('git commit -m "P22.3B: registra JD4 como automaticidade"');
  run(`git push origin HEAD:${branch}`);
}

if (mode === "apply") apply();
else if (mode === "publish") publish();
else throw new Error("uso: node p22_3b_apply.cjs <apply|publish>");
