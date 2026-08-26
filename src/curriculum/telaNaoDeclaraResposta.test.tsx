// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { FichaRenderer } from "../components/FichaRenderer";
import { JOURNEY_FICHAS } from "./fichas";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "./motores/composerCanary";

/**
 * CLASS-009 — a tela não pode declarar a própria resposta.
 *
 * A varredura renderiza cada ficha servida pelo Composer, apaga os botões e
 * pergunta se o rótulo da alternativa correta ainda está escrito no suporte.
 * Se estiver, a criança lê em vez de resolver.
 *
 * O gate é fechado por descoberta, não por lista de inclusão (D068): qualquer
 * ficha nova que vaze reprova sem ninguém precisar lembrar de inscrevê-la. O
 * registro abaixo existe só para segurar o estado medido, e tem catraca nos
 * dois sentidos — entrada nova reprova, entrada que parou de vazar também.
 */
type Motivo = "LEGITIMO" | "A-REPARAR";
const REGISTRO: Record<string, { motivo: Motivo; porque: string }> = {
  // Legítimos: o rótulo é o nome de um objeto que a tela precisa nomear para
  // que a pergunta faça sentido — régua, eixo, categoria, peça.
  "AL.02": { motivo: "LEGITIMO", porque: "a fileira do padrão é o próprio objeto observado; escondê-la apaga a pergunta" },
  "AL.03": { motivo: "LEGITIMO", porque: "rótulos de marcação da reta numérica" },
  "GM.02": { motivo: "LEGITIMO", porque: "os ícones da cena são o objeto da comparação" },
  "GE.04": { motivo: "LEGITIMO", porque: "o enunciado nomeia a propriedade testada (rola/empilha); a alternativa a ecoa" },
  "GE.05": { motivo: "LEGITIMO", porque: "o enunciado dita a casa do mapa; a habilidade é executar a coordenada" },
  "GE.08": { motivo: "LEGITIMO", porque: "o enunciado dita o par ordenado; a habilidade é localizá-lo no plano" },
  "GE.10": { motivo: "LEGITIMO", porque: "as vistas precisam de rótulo A/B/C para poderem ser escolhidas" },
  "N2.06": { motivo: "LEGITIMO", porque: "\"paridade\" no apoio contém \"par\" por acaso de substring" },
  "N1.07": { motivo: "LEGITIMO", porque: "rótulos de marcação da reta: em L2 a régua vai até 10 e a resposta é 10; esconder a marca apaga a pergunta" },
  "N7.01": { motivo: "LEGITIMO", porque: "rótulos de marcação da reta dos inteiros" },
  "N7.02": { motivo: "LEGITIMO", porque: "rótulos de marcação da reta dos inteiros" },
  "PE.02": { motivo: "LEGITIMO", porque: "as barras do gráfico precisam de rótulo de categoria" },
  "N6.01": { motivo: "LEGITIMO", porque: "em comparar, o numeral sob cada quadrado identifica qual é qual; a comparação por área pintada é a estratégia concreta do nível" },
  "PE.03": { motivo: "LEGITIMO", porque: "em comparar-chances os sacos precisam de rótulo A/B para poderem ser escolhidos" },
  "PE.04": { motivo: "LEGITIMO", porque: "os sacos precisam de rótulo A/B para poderem ser escolhidos" },
  "N4.03": { motivo: "LEGITIMO", porque: "a contagem saltada é a estratégia ensinada em L1, não um gabarito impresso" },

  // A reparar: o suporte afirma a resposta que o enunciado pergunta.

  // `N4.09` saiu daqui. A detecção dela era artefato de colagem, não eco: com
  // resposta 26, o texto grudava o `2` de "3 × 2" no `6` seguinte e formava
  // "3x26". A ficha nunca escreveu 26 em lugar nenhum. Medida por elemento, ela
  // não declara a resposta em nível nenhum, e a justificativa antiga
  // ("produtos parciais coincidem com a resposta") racionalizava o artefato.
};

/**
 * Cinco sementes, e o veredito exige unanimidade em algum nível.
 *
 * Vazamento estrutural — o apoio escreve a resposta porque é assim que a tela
 * é montada — reproduz em toda amostra. Coincidência numérica não: a resposta
 * do perímetro em GM.07 bate com a medida de OUTRO lado só em alguns sorteios,
 * e a parte que falta em N1.10 iguala a parte visível só quando a divisão é
 * simétrica. Com semente fixa e caso fixo, coincidência parecia estrutural.
 *
 * Isso deixou de ser teórico quando a CLASS-003 passou a sortear os casos:
 * cada reparo desloca o fluxo do PRNG, e um gate que reprova por coincidência
 * acusaria ficha diferente a cada commit. Foi assim que N6.03 apareceu.
 */
const SEMENTES = [0x2f6e2b1, 0x5bd1e99, 0x1a2b3c4, 0x6e11d07, 0x24c8fa3];

/**
 * Vazamentos caso-dependentes já triados, por `ficha|nível`.
 *
 * A catraca destes é de mão única, e de propósito: parcial NOVO reprova,
 * parcial que sumiu não. A taxa de um parcial depende do fluxo do PRNG, e a
 * CLASS-003 desloca esse fluxo a cada reparo — cobrar permanência aqui traria
 * de volta exatamente a fragilidade que a unanimidade veio remover.
 */
const PARCIAIS_CONHECIDOS: Record<string, string> = {
  "AL.02|5": "a fileira do padrão é o objeto observado; o emoji da resposta aparece nela em parte dos sorteios",
  "GM.02|5": "os ícones da cena são o objeto da comparação; coincidem com a resposta em parte dos sorteios",
};
const norm = (t: string) => t.replace(/\s+/g, "").replace(/×/g, "x").toLowerCase();
/**
 * Texto do suporte com a fronteira dos ELEMENTOS preservada.
 *
 * `textContent` concatena nós vizinhos sem separador nenhum: os marcadores da
 * reta numérica, que a criança vê como caixas separadas, viram `024681012`.
 * Juntar os nós de texto com espaço devolve o que está de fato na tela.
 */
function textoPorElemento(raiz: HTMLElement): string {
  const pedacos: string[] = [];
  const caminhante = raiz.ownerDocument.createTreeWalker(raiz, 4 /* NodeFilter.SHOW_TEXT */);
  for (let no = caminhante.nextNode(); no; no = caminhante.nextNode()) {
    const texto = (no.textContent ?? "").trim();
    if (texto) pedacos.push(texto);
  }
  return pedacos.join(" ");
}
const normEspacado = (t: string) => t.replace(/\s+/g, " ").replace(/×/g, "x").toLowerCase();

/**
 * Rótulo numérico só conta como declarado quando é o mesmo número.
 *
 * `norm` apaga os espaços de propósito, para pegar um "1 0" escrito solto. O
 * efeito colateral aparece quando a resposta é um numeral curto: `10` "aparece"
 * dentro de `100% é o inteiro`, que é apoio fixo da N6.03 e não diz nada sobre
 * a pergunta. Os três seeds fixos nunca tinham sorteado resposta 10 ali; a
 * varredura da CLASS-003 deslocou o fluxo do PRNG e o falso positivo apareceu.
 *
 * A fronteira de dígito sozinha não resolve: sobre o texto colado, a reta
 * numérica vira `0246810121416` e todo numeral fica ladeado por dígitos —
 * silenciaria AL.03, N4.03 e N4.09, que são detecções reais e legítimas. Por
 * isso a fronteira é medida sobre o texto POR ELEMENTO, onde `10` continua
 * casando entre os marcadores da régua e para de casar dentro de `100`.
 *
 * Nada real foi silenciado, e não é promessa: a catraca de entradas obsoletas
 * reprova nomeando a ficha se alguma detecção conhecida sumir.
 */
function declara(suporte: string, suporteEspacado: string, rotulo: string): boolean {
  if (!/^\d+$/.test(rotulo)) return suporte.includes(rotulo);
  return new RegExp(`(?<!\\d)${rotulo}(?!\\d)`).test(suporteEspacado);
}
const original = Math.random;
afterEach(() => { Math.random = original; });

function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => {
    estado = (estado * 1664525 + 1013904223) >>> 0;
    return estado / 0x100000000;
  };
}

function varrer(): { vazam: Set<string>; parciais: string[] } {
  // Por (ficha, nível): quantas amostras foram avaliadas e quantas vazaram.
  // O denominador importa — amostra pulada não é amostra que não vazou.
  const contagem = new Map<string, { avaliadas: number; vazaram: number }>();
  const ids = JOURNEY_FICHAS.map(ficha => ficha.id).filter(hasComposerFicha);
  for (const semente of SEMENTES) {
    semear(semente);
    for (const id of ids) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const question = generateRegisteredFichaQuestion(id, nivel);
        const certa = (question.options ?? []).find(option => question.evaluate?.(option.value));
        const rotulo = norm(String(certa?.label ?? certa?.value ?? ""));
        if (!certa || rotulo.length < 2) continue;
        const { container, unmount } = render(<FichaRenderer question={question} onAnswer={() => undefined} />);
        const copia = container.cloneNode(true) as HTMLElement;
        for (const botao of [...copia.querySelectorAll("button")]) botao.remove();
        const chave = `${id}|${nivel}`;
        const placar = contagem.get(chave) ?? { avaliadas: 0, vazaram: 0 };
        placar.avaliadas += 1;
        if (declara(norm(copia.textContent ?? ""), normEspacado(textoPorElemento(copia)), rotulo)) placar.vazaram += 1;
        contagem.set(chave, placar);
        unmount();
      }
    }
  }
  const vazam = new Set<string>();
  const parciais: string[] = [];
  for (const [chave, { avaliadas, vazaram }] of contagem) {
    if (avaliadas === 0) continue;
    if (vazaram === avaliadas) vazam.add(chave.split("|")[0]);
    else if (vazaram > 0) parciais.push(`${chave} (${vazaram}/${avaliadas})`);
  }
  return { vazam, parciais: parciais.sort() };
}

describe("CLASS-009 — nenhuma tela declara a resposta que ela mesma pergunta", () => {
  it("a varredura cobre todas as fichas servidas pelo Composer", () => {
    const servidas = JOURNEY_FICHAS.map(ficha => ficha.id).filter(hasComposerFicha);
    expect(servidas.length).toBeGreaterThanOrEqual(75);
  });

  it("nenhuma ficha vaza fora do registro medido, e nenhuma entrada do registro está obsoleta", { timeout: 180000 }, () => {
    const { vazam } = varrer();
    const novas = [...vazam].filter(id => !REGISTRO[id]).sort();
    const obsoletas = Object.keys(REGISTRO).filter(id => !vazam.has(id)).sort();

    expect(novas, `fichas novas declarando a própria resposta: ${novas.join(", ")}`).toEqual([]);
    expect(obsoletas, `entradas do registro que pararam de vazar — remova-as: ${obsoletas.join(", ")}`).toEqual([]);
  });

  it("nenhum vazamento é parcial: caso-dependente é coincidência, e coincidência não é veredito", { timeout: 180000 }, () => {
    // Um (ficha, nível) que vaza em algumas sementes e não em outras não está
    // declarando a resposta: está esbarrando nela. Foi assim que N6.03 apareceu
    // (7 em 187) e que GM.07 e N1.10 apareceriam se o rótulo de um dígito
    // entrasse na varredura — a resposta do perímetro bate com a medida de
    // outro lado só em alguns sorteios.
    //
    // Enquanto a CLASS-003 sorteia casos, cada reparo desloca o fluxo do PRNG.
    // Sem esta asserção, um parcial entraria ou sairia do veredito em silêncio
    // a cada commit, e o registro acusaria ficha diferente sem ninguém ter
    // mexido nela. Parcial novo aqui é para triar, não para registrar às cegas.
    const { parciais } = varrer();
    const novos = parciais.filter(entrada => !PARCIAIS_CONHECIDOS[entrada.split(" ")[0]]);
    expect(novos, `vazamentos caso-dependentes novos, para triar:\n${novos.join("\n")}`).toEqual([]);
    for (const [chave, porque] of Object.entries(PARCIAIS_CONHECIDOS)) {
      expect(porque.length, `${chave} sem justificativa`).toBeGreaterThan(20);
    }
  });

  it("a fila de reparo do Gate B′ é explícita e não some sem recibo", () => {
    const aReparar = Object.entries(REGISTRO).filter(([, item]) => item.motivo === "A-REPARAR").map(([id]) => id).sort();
    expect(aReparar).toEqual([]);
    for (const [, item] of Object.entries(REGISTRO)) expect(item.porque.length).toBeGreaterThan(20);
  });
});
