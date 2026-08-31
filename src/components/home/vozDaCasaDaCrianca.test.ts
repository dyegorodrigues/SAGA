import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * A casa da criança fala com a criança.
 *
 * ## O que este portão existe para impedir
 *
 * A casa da criança estava escrita para o autor do currículo. Medido antes
 * deste teste existir, tudo isto visível na tela de uma criança de 1º ano:
 *
 * > "Roteiro Pedagógico Guiado" · "Prescrição do Sensei" · "Aula do Dia · Base
 * > Perceptual" · "recuperar automaticidade" · "Fluência complementar" ·
 * > "revisão/reconstrução no radar" · "Tempo Estimado: 31h 15m restantes"
 *
 * Nenhuma dessas frases é lida por quem tem seis anos — e seis anos é o COMEÇO
 * da Jornada, a idade com menos leitura do aplicativo inteiro. Uma tela que a
 * criança não lê é uma tela onde ela toca no que for maior e mais colorido: o
 * Tutor, que existe para dizer o que fazer agora, vira enfeite.
 *
 * Junto vinha o emoji decorativo no fim de cada frase — "conquistas diárias 🦊",
 * "sem pressa 🌟", "Começar Sondagem 🚀". Além de ser desenho do sistema (cada
 * aparelho mostra o seu), é a assinatura visual de texto gerado no automático,
 * e é o que fazia a tela parecer rascunho em vez de produto.
 *
 * ## O que se cobra, e por que assim
 *
 * A varredura é sobre os arquivos da CASA, descobertos lendo a pasta — não uma
 * lista escrita à mão, que ficaria para trás na primeira tela nova.
 *
 * **Emoji.** Proibido em texto de interface. A exceção é estrutural, não uma
 * lista de perdoados: emoji que é VALOR de um campo `icon:` ou `emoji:` é
 * CONTEÚDO — o `➕` que nomeia o templo da soma (cânone das cores de operação)
 * e o `🏰` que é o cenário que a criança compra com moedinha. Conteúdo não é
 * cópia de interface; enfeite no fim da frase é.
 *
 * **Vocabulário.** As palavras abaixo foram lidas da tela real antes da
 * correção. Cada uma tem tradução de criança, e o termo técnico continua vivo
 * onde é lido por adulto: `ParentDashboard`, nomes de código, documentação.
 */

const PASTA = resolve(__dirname);
const CASCA = resolve(__dirname, "..", "KidHomeScreen.tsx");

/** Emoji e símbolos decorativos. Faixas amplas de propósito: o portão erra para o lado de barrar. */
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{2694}-\u{2697}]/u;

/**
 * Palavra de adulto, com a tradução que entrou no lugar.
 * Cada linha aqui é uma frase que já esteve na tela da criança.
 */
const PALAVRAS_DE_ADULTO: Array<[RegExp, string]> = [
  [/Roteiro Pedagógico/i, '"O que vem na missão"'],
  [/automaticidade/i, '"sair sem pensar" / "ficar rápido"'],
  [/Prescrição do Sensei/i, '"O Sensei separou para você"'],
  [/Base Perceptual/i, '"deixar rápido"'],
  [/Fluência complementar/i, '"para ficar rápido"'],
  [/Base já compreendida/i, '"Você já entende"'],
  [/Treino causal/i, '"Vamos treinar"'],
  [/Meta de recuperação/i, '"Chegar no nível N"'],
  [/reconstrução/i, '"treinar de novo"'],
  [/O Radar encontrou/i, '"Coisas que vale treinar"'],
  [/Painel Completo/i, '"Ver a Oficina inteira"'],
  [/Tempo Estimado/i, "o tempo restante é informação do painel dos pais"],
  [/\bCompactar\b/i, '"Menos"'],
  [/\bExpandir\b/i, '"Mais"'],
  [/repertório/i, '"o que você já sabe"'],
];

/** Os arquivos da casa, descobertos — não escritos à mão. */
function arquivosDaCasa(): string[] {
  const daPasta = readdirSync(PASTA)
    .filter(n => n.endsWith(".tsx") && !n.includes(".test."))
    .map(n => resolve(PASTA, n));
  return [...daPasta, CASCA];
}

/**
 * Só o texto que a criança vê.
 *
 * Fora: comentário (é conversa entre quem programa), `import`, e o VALOR de um
 * campo `icon:`/`emoji:` — conteúdo, não cópia. Sem tirar o comentário, este
 * próprio arquivo e os cabeçalhos que explicam a regra seriam acusados por
 * citarem o que a regra proíbe.
 */
function textoDeInterface(caminho: string): string[] {
  const bruto = readFileSync(caminho, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1")
    .replace(/^\s*import[\s\S]*?from\s+["'].*?["'];?$/gm, "")
    .replace(/\b(icon|emoji)\s*:\s*("[^"]*"|'[^']*'|`[^`]*`)/g, "$1: <conteúdo>");
  return bruto.split(/\r?\n/);
}

describe("a casa da criança fala com a criança", () => {
  it("a varredura enxerga as telas da casa", () => {
    // Prova de vida: uma varredura vazia passaria calada.
    expect(arquivosDaCasa().length, "a casa tem várias telas").toBeGreaterThanOrEqual(6);
  });

  it("nenhum emoji do sistema no texto da interface", () => {
    const achados: string[] = [];
    for (const caminho of arquivosDaCasa()) {
      const nome = caminho.split("/").slice(-1)[0];
      textoDeInterface(caminho).forEach((linha, i) => {
        if (EMOJI.test(linha)) achados.push(`${nome}:${i + 1}  ${linha.trim().slice(0, 90)}`);
      });
    }
    expect(
      achados,
      ["Emoji na cópia da interface — use `<Icone>`, que é arte nossa e igual em todo aparelho:", ...achados].join("\n"),
    ).toEqual([]);
  });

  it("nenhuma palavra que a criança de seis anos não lê", () => {
    const achados: string[] = [];
    for (const caminho of arquivosDaCasa()) {
      const nome = caminho.split("/").slice(-1)[0];
      const texto = textoDeInterface(caminho).join("\n");
      for (const [padrao, traducao] of PALAVRAS_DE_ADULTO) {
        if (padrao.test(texto)) achados.push(`${nome}: ${padrao.source} → prefira ${traducao}`);
      }
    }
    expect(
      achados,
      ["Vocabulário de adulto na tela da criança:", ...achados, "", "O termo técnico continua valendo no painel dos pais e no código."].join("\n"),
    ).toEqual([]);
  });
});
