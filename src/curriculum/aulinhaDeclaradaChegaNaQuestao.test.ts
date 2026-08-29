import { describe, expect, it } from "vitest";
import { JOURNEY_FICHAS } from "./fichas";
import { normalizeFichaTutorial } from "./fichaQuestionContract";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "./motores/composerCanary";
import { hasAulinha, tutorialSteps } from "../utils/tutorials";
import type { FichaCompetencia } from "./schema";

/**
 * §6.36 — a aulinha que a ficha declara precisa chegar na questão.
 *
 * ## O defeito que este portão observa
 *
 * O portão de onboarding (`visualOnboardingGate`) pergunta à ficha: você
 * declara `params.tutorial` para a estreia da linguagem visual? Se declara,
 * a Coverage Matrix marca `onboarding=presente` e a dívida some.
 *
 * Só que a ficha é dado. Entre o dado e a criança há dois pontos de perda,
 * ambos silenciosos:
 *
 * 1. `parseComposerParams` copia chave por chave. Uma chave que ninguém
 *    lembrou de listar é descartada sem erro — foi exatamente assim que a
 *    ficha F27 declarou `modo: "ritmico"` e o canhão de balões saiu como
 *    peixinhos na tela;
 * 2. `normalizeFichaTutorial` descarta passo que não tem `say`/`fala` de
 *    texto. Escrever `{ texto: "..." }` por engano não quebra nada: o passo
 *    simplesmente não existe.
 *
 * Em qualquer um dos dois casos a Matrix continuaria dizendo `presente` e a
 * criança continuaria estreando a ferramenta sozinha. O portão de onboarding
 * ficaria verde medindo a intenção, não a entrega.
 *
 * ## O que este teste mede
 *
 * A varredura é por descoberta: percorre toda ficha registrada no Composer,
 * acha a micro de cada nível pelo próprio `niveis[n].micro`, e para cada micro
 * que declara tutorial exige que TODOS os passos declarados cheguem em
 * `tutorialSteps(questão)` — que é a função que o GameLoop chama para narrar.
 * Nenhum id é escrito à mão: promover uma ficha a coloca sob o portão no mesmo
 * instante, sem editar este arquivo.
 *
 * ## Prova de vida
 *
 * Com a varredura cega — lista vazia — "ninguém perde passo" e "eu não olhei"
 * são a mesma tela verde. Por isso o teste também afirma quantos pares
 * (ficha, nível) ele de fato observou. Hoje são 147; o piso de 100 deixa
 * espaço para rollback legítimo e ainda desmascara a cegueira.
 */

interface ParObservado {
  chave: string;
  declarados: string[];
  brutos: number;
}

function varrer(): { pares: ParObservado[]; perdas: string[] } {
  const pares: ParObservado[] = [];
  const perdas: string[] = [];

  for (const ficha of JOURNEY_FICHAS as FichaCompetencia[]) {
    if (!hasComposerFicha(ficha.id)) continue;

    for (const nivel of [1, 2, 3, 4, 5]) {
      const microId = ficha.niveis?.[nivel]?.micro;
      const micro = ficha.micros.find(candidato => candidato.id === microId);
      const bruto = (micro?.params as { tutorial?: unknown } | undefined)?.tutorial;
      if (!Array.isArray(bruto) || bruto.length === 0) continue;

      const chave = `${ficha.id}|${nivel}`;
      const declarados = (normalizeFichaTutorial(bruto) ?? []).map(passo => passo.say);
      if (declarados.length < bruto.length) {
        perdas.push(`${chave}: a ficha escreve ${bruto.length} passos e ${bruto.length - declarados.length} não têm fala de texto — some antes de sair da ficha`);
        continue;
      }

      let questao;
      try {
        questao = generateRegisteredFichaQuestion(ficha.id, nivel);
      } catch (erro) {
        perdas.push(`${chave}: a questão nem foi gerada — ${(erro as Error).message}`);
        continue;
      }

      const chegaram = tutorialSteps(questao).map(passo => passo.say);
      if (!hasAulinha(questao)) {
        perdas.push(`${chave}: a ficha declara aulinha e o GameLoop não vê nenhuma`);
        continue;
      }
      for (const fala of declarados) {
        if (!chegaram.includes(fala)) perdas.push(`${chave}: a fala "${fala}" não chegou na questão`);
      }

      pares.push({ chave, declarados, brutos: bruto.length });
    }
  }

  return { pares, perdas };
}

describe("§6.36 — a aulinha declarada na ficha chega na questão", () => {
  it("nenhum passo declarado se perde entre a ficha e a narração", () => {
    const { perdas } = varrer();
    expect(
      perdas,
      ["Aulinha declarada que não chega na criança:", ...perdas.map(linha => `  ${linha}`), "", "A ficha promete a estreia; quem narra é o GameLoop. Entre os dois, a fala sumiu."].join("\n"),
    ).toEqual([]);
  });

  it("a varredura enxerga as aulinhas que existem — senão a tela verde é cegueira", () => {
    const { pares } = varrer();
    expect(
      pares.length,
      "a varredura parou de encontrar aulinha declarada: o portão acima virou decoração",
    ).toBeGreaterThan(100);
    expect(
      pares.some(par => par.chave === "N4.02|1"),
      "a estreia do ArrayGrid na N4.02 saiu da varredura",
    ).toBe(true);
  });
});
