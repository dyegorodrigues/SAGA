import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { varrerCoresLiterais } from "./varreduraDeCores";

/**
 * Catraca das cores literais — o visual não pode piorar sem alguém decidir.
 *
 * `src/styles/tokens.ts` já traz o sistema certo: nomes por função
 * (`acao.primaria`, `feedback.acerto`, `superficie.cartao`) e a indireção
 * `var(--token, emergência)` que permite trocar a identidade inteira do app
 * editando um arquivo. Foi bem desenhado e quase não foi usado.
 *
 * O estado medido em 15/08/2026, antes deste portão existir:
 *
 * - 22 dos 187 componentes importam os tokens;
 * - 2.028 cores literais espalhadas por 78 arquivos;
 * - 250 cores distintas, das quais **680 pares são visualmente
 *   indistinguíveis** entre si (distância RGB < 18);
 * - 71 azuis diferentes, 44 laranjas, 30 vermelhos;
 * - as 20 cores mais usadas cobrem 52,6% dos usos — o resto é ruído;
 * - nenhuma variável `--cor-*` é definida em lugar nenhum, então hoje o app
 *   roda inteiro nos valores de emergência: o interruptor do tema está na
 *   parede, sem fio.
 *
 * 680 pares quase-idênticos não é escolha estética, é acidente acumulado. E a
 * maior concentração está em `components/primitives` — a régua, a reta, o
 * material dourado, a balança. Justamente onde a criança encosta o dedo, e
 * onde a identidade visual do SAGA de fato mora.
 *
 * Este portão NÃO exige consertar nada agora. Ele congela o problema no
 * tamanho de hoje: cada arquivo tem um teto, e o teto só desce. Enquanto a
 * fábrica curricular corre, o débito visual para de crescer — e cada arquivo
 * migrado fica migrado, porque a baseline acompanha para baixo.
 *
 * Migrar depois é mecânico e sem risco pedagógico: trocar a cor literal pelo
 * token de mesma função. Quando a lista zerar, trocar o design do app inteiro
 * passa a ser editar as variáveis num arquivo só — inclusive para ter tema
 * escuro e tema de alto contraste para criança com baixa visão.
 */
const RAIZ = resolve(__dirname, "..", "..");
const CAMINHO_BASELINE = resolve(__dirname, "cores-literais.baseline.json");
const BASELINE: Record<string, number> = JSON.parse(readFileSync(CAMINHO_BASELINE, "utf8"));

const COMO_ATUALIZAR = "Rode `npm run cores:baseline` e comite o JSON junto com a mudança.";

describe("catraca das cores literais", () => {
  const atual = varrerCoresLiterais(RAIZ);

  it("nenhum arquivo novo introduz cor literal", () => {
    const novos = Object.keys(atual).filter(arquivo => BASELINE[arquivo] === undefined);

    expect(
      novos,
      [
        "Arquivo novo escrevendo cor na mão:",
        ...novos.map(a => `  ${a} (${atual[a]})`),
        "",
        "Use `tokens.cor.*` de `src/styles/tokens.ts`, pelo nome da FUNÇÃO da cor:",
        "  ação primária · feedback de acerto/erro · superfície · texto · elementos.",
        "Falta um caso? Acrescente o token ao sistema — não uma cor solta ao componente.",
      ].join("\n"),
    ).toEqual([]);
  });

  it("nenhum arquivo existente ganha mais cor literal do que já tinha", () => {
    const pioraram = Object.keys(atual)
      .filter(a => BASELINE[a] !== undefined && atual[a] > BASELINE[a])
      .map(a => `  ${a}: ${BASELINE[a]} → ${atual[a]}`);

    expect(
      pioraram,
      ["Arquivo ganhou cor literal nova:", ...pioraram, "", "A catraca só desce."].join("\n"),
    ).toEqual([]);
  });

  it("a baseline acompanha o que já foi migrado", () => {
    // Sem isto a catraca afrouxa sozinha: quem migrasse um arquivo hoje
    // deixaria o teto antigo de pé, e amanhã as mesmas cores voltariam sem
    // ninguém perceber. Melhorar exige registrar a melhora.
    const melhoraram = Object.keys(BASELINE)
      .filter(a => (atual[a] ?? 0) < BASELINE[a])
      .map(a => `  ${a}: ${BASELINE[a]} → ${atual[a] ?? 0}`);

    expect(
      melhoraram,
      ["Cor literal removida — registre a melhora:", ...melhoraram, "", COMO_ATUALIZAR].join("\n"),
    ).toEqual([]);
  });
});
