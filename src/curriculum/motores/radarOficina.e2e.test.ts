import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  isMotorSlip,
  misconceptionForAnswer,
} from "../../components/gameloop/answerPolicy";
import {
  createQuestionDiagnostics,
  recordQuestionAttempt,
  summarizeQuestionDiagnostics,
} from "../../components/gameloop/questionDiagnostics";
import { MisconceptionTag } from "../../constants/misconceptions";
import { AnswerMeta, Progress, Question, Track } from "../../types";
import { getRescueItems, trackMisconception } from "./radarEngine";
import { prescribeMisconceptionRescue, RESCUE_UNLOCK_LEVEL } from "./rescuePlanner";

/**
 * A cadeia inteira, de um toque errado até a Missão de Resgate.
 *
 * Cada elo já tem teste próprio. Este arquivo testa outra coisa: que os elos
 * continuam **encaixados**. O defeito que ele previne não mora em módulo
 * nenhum — mora entre eles, e por isso passaria despercebido por todos os
 * testes unitários ao mesmo tempo.
 *
 * Cânone em jogo: §8.3-bis (filtro motor), §11.4 (padrão, não erro solto),
 * §8.4 (a Oficina tem física própria).
 */

const arrastavel: Question = {
  kind: "drag-group",
  prompt: "Leve as unidades para a caixa da dezena.",
  answer: 10,
  options: [
    { value: 10 },
    { value: 9, misconception: MisconceptionTag.OFF_BY_ONE },
  ],
};

const progresso = (over: Partial<Progress> = {}): Progress => ({
  lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0, ...over,
});

const trilha = (id: string): Track => ({
  id, graphId: id, name: id, icon: "🔧", color: "#000", dark: "#000",
  gen: () => ({ kind: "plain", prompt: id, options: [], answer: 1 }),
});

/**
 * Reproduz a ordem de operações do `handlePick`: filtro motor primeiro, depois
 * hipótese, depois registro. A ordem é o contrato — um teste no fim deste
 * arquivo prova que o `GameLoop` real ainda a respeita.
 */
function responder(
  diagnostics: ReturnType<typeof createQuestionDiagnostics>,
  valor: unknown,
  meta?: AnswerMeta,
): "ignorado" | "registrado" {
  const acertou = valor === arrastavel.answer;
  if (!acertou && isMotorSlip(meta)) return "ignorado";
  recordQuestionAttempt(diagnostics, acertou, misconceptionForAnswer(arrastavel, valor, meta));
  return "registrado";
}

describe("do toque ao Radar", () => {
  it("escorregão de dedo não conta tentativa, não marca erro, não gera hipótese", () => {
    const d = createQuestionDiagnostics();

    expect(responder(d, 9, { manipulacao: { corrigiuSozinha: true } })).toBe("ignorado");
    expect(responder(d, 9, { manipulacao: { foraDeAlvoValido: true } })).toBe("ignorado");
    expect(responder(d, 9, { manipulacao: { duracaoMs: 90 } })).toBe("ignorado");
    responder(d, 10);

    // "não pontua, não vira tag, não alimenta o Radar, não aparece no painel dos pais"
    expect(summarizeQuestionDiagnostics(d, true)).toEqual({
      attemptCount: 1,
      recoveredAfterError: false,
      misconceptionTags: [],
    });
  });

  it("gesto íntegro em destino errado atravessa a cadeia inteira", () => {
    const d = createQuestionDiagnostics();
    responder(d, 9, { manipulacao: { precisoEmDestinoErrado: true } });
    responder(d, 10);

    expect(summarizeQuestionDiagnostics(d, true)).toEqual({
      attemptCount: 2,
      recoveredAfterError: true,
      misconceptionTags: [MisconceptionTag.OFF_BY_ONE],
    });
  });

  it("a mesma hipótese repetida na questão chega ao Radar uma vez só", () => {
    const d = createQuestionDiagnostics();
    responder(d, 9, { manipulacao: { precisoEmDestinoErrado: true } });
    responder(d, 9, { manipulacao: { repetiuMesmoDestino: true } });
    responder(d, 9, { manipulacao: { precisoEmDestinoErrado: true } });

    const resumo = summarizeQuestionDiagnostics(d, false);
    expect(resumo.attemptCount).toBe(3);
    expect(resumo.misconceptionTags).toEqual([MisconceptionTag.OFF_BY_ONE]);

    // Três toques errados na MESMA questão são um erro só para o Radar — do
    // contrário uma questão sozinha já bastaria para forjar o "padrão" do §11.4.
    const pMap: Record<string, Progress> = { "N1.02": progresso() };
    resumo.misconceptionTags.forEach(tag => trackMisconception(pMap["N1.02"], tag));
    expect(pMap["N1.02"].misconceptions).toHaveLength(1);
    expect(getRescueItems("kid", pMap)).toEqual([]);
  });
});

describe("do Radar à Oficina", () => {
  it("uma questão inteira de escorregões não abre resgate algum", () => {
    const pMap: Record<string, Progress> = { "N1.04": progresso() };

    for (const manipulacao of [
      { corrigiuSozinha: true },
      { foraDeAlvoValido: true },
      { distanciaDoAlvoCorreto: 30, raioDeSnap: 40 },
      { duracaoMs: 50 },
    ]) {
      const d = createQuestionDiagnostics();
      responder(d, 9, { manipulacao });
      responder(d, 10);
      summarizeQuestionDiagnostics(d, true).misconceptionTags
        .forEach(tag => trackMisconception(pMap["N1.04"], tag));
    }

    expect(pMap["N1.04"].misconceptions ?? []).toEqual([]);
    expect(getRescueItems("kid", pMap)).toEqual([]);
  });

  it("duas questões distintas com a mesma hipótese conceitual abrem a Missão", () => {
    const pMap: Record<string, Progress> = {
      "N1.01": progresso({ maxLvl: 3 }),
      "N1.02": progresso({ maxLvl: 1 }),
      "N1.04": progresso(),
    };

    for (let questao = 0; questao < 2; questao++) {
      const d = createQuestionDiagnostics();
      responder(d, 9, { manipulacao: { precisoEmDestinoErrado: true } });
      responder(d, 10);
      summarizeQuestionDiagnostics(d, true).misconceptionTags
        .forEach(tag => trackMisconception(pMap["N1.04"], tag));
    }

    expect(getRescueItems("kid", pMap)).toContain("N1.04");

    const prescricao = prescribeMisconceptionRescue(
      "N1.04",
      [trilha("N1.01"), trilha("N1.02"), trilha("N1.04")],
      pMap,
    );

    // A Oficina desce ao pré-requisito que ainda bloqueia, e o alvo é destravar
    // — nunca coroar. Levar a domínio pleno é trabalho da Academia (§8.4).
    expect(prescricao?.targetNodeId).toBe("N1.02");
    expect(prescricao?.requiredLevel).toBe(RESCUE_UNLOCK_LEVEL);
    expect(prescricao?.requiredLevel).toBeLessThan(5);
    expect(prescricao?.escalated).toBe(false);
    // Dose proporcional: buraco de 2 níveis toma a maior parte da sessão.
    expect(prescricao?.questionBudget).toBe(8);
  });

  it("o retorno é coerente: a Missão só existe se houver ficha real para ela", () => {
    const pMap: Record<string, Progress> = { "N1.02": progresso({ maxLvl: 1 }) };
    // Sem trilha para o alvo, o motor não inventa conteúdo nem cai em fallback.
    expect(prescribeMisconceptionRescue("N1.04", [], pMap)).toBeNull();
  });
});

describe("a fiação real do GameLoop, e não só a simulada", () => {
  const gameLoop = readFileSync(
    resolve(__dirname, "../../components/GameLoop.tsx"),
    "utf8",
  );

  it("consulta o filtro motor ANTES de registrar a tentativa", () => {
    const posFiltro = gameLoop.indexOf("isMotorSlip(answerMeta)");
    const posRegistro = gameLoop.indexOf("recordQuestionAttempt(");

    expect(posFiltro, "GameLoop deixou de consultar o filtro motor").toBeGreaterThan(-1);
    expect(posRegistro).toBeGreaterThan(-1);
    // Se o registro vier primeiro, o escorregão marca `hadError` e envenena
    // `recoveredAfterError` mesmo com a tag corretamente descartada.
    expect(posFiltro).toBeLessThan(posRegistro);
  });

  it("o escorregão sai por cima, sem som de erro e sem gastar tentativa", () => {
    const bloco = gameLoop.slice(
      gameLoop.indexOf("isMotorSlip(answerMeta)"),
      gameLoop.indexOf("recordQuestionAttempt("),
    );
    expect(bloco).toContain("return;");
    expect(bloco, "erro motor não é erro: não pode tocar som de erro").not.toContain("sfx.wrong");
    expect(bloco).not.toContain("setQErrors");
    expect(bloco).not.toContain("setHiddenOpts");
  });
});
