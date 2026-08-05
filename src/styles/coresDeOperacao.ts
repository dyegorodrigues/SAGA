/**
 * Cor por operação aritmética — o padrão visual que a criança aprende junto
 * com o símbolo.
 *
 * ---
 *
 * **Por que existe.** Uma criança de 7 anos reconhece cor antes de ler símbolo.
 * Se toda soma do aplicativo é verde e toda multiplicação é roxa, a cor vira
 * uma segunda pista que chega mais rápido que o sinal — e ajuda exatamente no
 * momento em que duas telas parecidas poderiam se confundir (o triângulo da
 * família aditiva contra o da multiplicativa).
 *
 * **A regra que impede isso de virar armadilha:** a cor **NUNCA carrega o
 * significado sozinha.** Ela sempre acompanha o símbolo (`+`, `−`, `×`, `÷`).
 * Cor sozinha excluiria a criança daltônica — e daltonismo em meninos é comum
 * (cerca de 1 em 12). O símbolo é a informação; a cor é o reforço.
 *
 * **Como foram escolhidas**, medindo em vez de opinando:
 *
 * | Operação | Cor | Contraste no branco | Mínimo WCAG |
 * |---|---|---|---|
 * | adição | `#2563EB` azul | 5,17:1 | 4,5:1 |
 * | subtração | `#C2410C` laranja | 5,18:1 | 4,5:1 |
 * | multiplicação | `#7E22CE` roxo | 6,98:1 | 4,5:1 |
 * | divisão | `#0F766E` verde-petróleo | 5,47:1 | 4,5:1 |
 *
 * **A escolha é estética, e o dono do projeto decide.** O azul foi para a
 * adição por ser a operação que a criança mais vê. Frio e quente separam a
 * família aditiva (azul e laranja); roxo e verde-petróleo, a multiplicativa.
 *
 * A verificação de daltonismo é **rede de segurança, não decisão de design** —
 * ela não escolhe a cor, só avisa se a escolha ficou ilegível. E ela não
 * precisa dirigir nada, porque quem carrega o significado é o SÍMBOLO. Ainda
 * assim: os seis pares ficaram entre 66 e 212 de distância sob deuteranopia,
 * todos acima do limiar de 60.
 *
 * **O que ficou de fora, e por quê.** O vermelho é cor de erro no SAGA, e o
 * cânone proíbe vermelho de reprovação em tela de criança (§11.6) — uma operação
 * vermelha ensinaria que subtrair é errado.
 *
 * **A separação de papéis que torna isto seguro.** O aplicativo já usa verde
 * para acerto e laranja para erro suave. Cor de OPERAÇÃO e cor de FEEDBACK vivem
 * em elementos diferentes — a figura contra o anel da resposta — e em momentos
 * diferentes: o feedback só aparece depois que a criança responde. Um teste
 * garante que nenhuma cor de operação chega perto de uma cor de feedback, para
 * que a criança nunca leia "certo" numa figura que só diz "isto é uma soma".
 */

export type Operacao = "adicao" | "subtracao" | "multiplicacao" | "divisao";

export interface EstiloDaOperacao {
  /** O sinal — a informação de verdade. A cor só reforça. */
  simbolo: string;
  cor: string;
  /** Versão clara, para preenchimento de fundo. */
  fundo: string;
  /** Como a voz nomeia a operação, para quem não lê. */
  verbo: string;
}

export const OPERACAO: Record<Operacao, EstiloDaOperacao> = {
  adicao: { simbolo: "+", cor: "#2563EB", fundo: "#EFF6FF", verbo: "somados" },
  subtracao: { simbolo: "−", cor: "#C2410C", fundo: "#FFF7ED", verbo: "subtraídos" },
  multiplicacao: { simbolo: "×", cor: "#7E22CE", fundo: "#FAF5FF", verbo: "multiplicados" },
  divisao: { simbolo: "÷", cor: "#0F766E", fundo: "#F0FDFA", verbo: "divididos" },
};

/** A operação inversa — a que desfaz. */
export const INVERSA: Record<Operacao, Operacao> = {
  adicao: "subtracao",
  subtracao: "adicao",
  multiplicacao: "divisao",
  divisao: "multiplicacao",
};
