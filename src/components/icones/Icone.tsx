import React from "react";

/**
 * Os ícones do SAGA — arte hospedada, não emoji do sistema.
 *
 * ## O problema
 *
 * `🦊 🗺️ 🥋 🔧` são glifos do SISTEMA OPERACIONAL. A mesma tela mostra um
 * desenho da Apple no iPad, um do Google no Android e um da Microsoft no
 * Windows: três estilos, três paletas, três pesos de traço, nenhum deles nosso.
 * Num app cuja identidade é a própria interface, isso é a diferença entre
 * "produto" e "protótipo". Pior: onde o sistema não tem aquele emoji, ele
 * desenha um quadrado vazio — e a criança vê um buraco.
 *
 * ## A tentativa que não deu certo, e por quê
 *
 * A primeira versão deste arquivo desenhava tudo à mão em SVG de traço: uma
 * cor, linha de 1,8px, caixa de 24×24 — o estilo de ícone de barra de
 * ferramentas. Ficou pior que o emoji, e o motivo não é falta de capricho: é
 * categoria errada. Emoji não é ícone de traço; é ILUSTRAÇÃO. A raposa da Apple
 * tem dezenas de curvas, três tons de laranja e sombra interna. Traço fino ao
 * lado disso lê como rascunho — ainda mais num app para criança de seis anos,
 * onde a tela inteira é colorida.
 *
 * Comparado lado a lado, não houve dúvida. O registro certo era ilustração
 * colorida, e ilustração boa já existe pronta e com licença livre.
 *
 * ## O que se usa
 *
 * **Fluent Emoji da Microsoft, estilo 3D, licença MIT**, copiado para
 * `public/icones/` — ver `CREDITOS.md` e `LICENSE.txt` ao lado dos arquivos.
 * Arte profissional, a mesma em todo aparelho, servida como arquivo estático
 * (não entra no bundle) e trocável um a um sem tocar em código.
 *
 * ## O que este componente garante
 *
 * - **Nome do SAGA, não do Unicode.** Pede-se `"fracao"`, não `"pizza"`. O que
 *   a ilha ensina é estável; a arte escolhida para representá-la pode mudar.
 * - **`aria-hidden`.** O rótulo de texto ao lado já nomeia a coisa — o ícone é
 *   reforço, nunca a informação sozinha, mesma regra das cores de operação.
 * - **Caminho com `BASE_URL`.** Se o app for publicado numa subpasta, o
 *   caminho absoluto `/icones/...` quebraria; este acompanha a base do build.
 * - **Tamanho fixo em CSS.** A altura não depende da métrica da fonte, que era
 *   o que desalinhava a barra de abas de aparelho para aparelho.
 * - **Sombra de contorno.** Sem ela o quimono do Dojô — branco, com faixa preta
 *   — praticamente sumia no fundo branco da barra de abas. A sombra é fraca de
 *   propósito: define a silhueta de toda a arte sem sujar nenhuma.
 */

export type NomeDoIcone =
  | "tutor" | "jornada" | "dojo" | "oficina"
  | "travada" | "coroa" | "fronteira" | "estrela" | "moeda"
  | "contagem" | "posicional" | "adicao" | "multiplicacao" | "fracao"
  | "porcento" | "reta" | "balanca" | "formas" | "regua" | "barras";

interface Props {
  nome: NomeDoIcone;
  /** Lado da caixa, em pixels. */
  tamanho?: number;
  className?: string;
}

/** A pasta pública onde a arte mora. Um teste cobra que todo nome tenha arquivo. */
export const PASTA_DOS_ICONES = "icones";

export function caminhoDoIcone(nome: NomeDoIcone): string {
  const base = import.meta.env?.BASE_URL ?? "/";
  return `${base.endsWith("/") ? base : `${base}/`}${PASTA_DOS_ICONES}/${nome}.svg`;
}

/**
 * O desenho de cada ilha do mapa.
 *
 * Chaveado pelo prefixo da competência (`N4.03` → `N4`), que é o mesmo
 * `islandId` que `ISLAND_INFO` publica. Sem entrada aqui não há desenho: um
 * teste varre as ilhas que o currículo realmente serve e cobra que todas
 * estejam neste mapa E que o arquivo exista em disco — para que uma ilha nova
 * nasça sem ícone e o teste avise, em vez de a criança encontrar a imagem
 * quebrada no mapa.
 */
export const ICONE_DA_ILHA: Record<string, NomeDoIcone> = {
  N1: "contagem",
  N2: "posicional",
  N3: "adicao",
  N4: "multiplicacao",
  N5: "fracao",
  N6: "porcento",
  N7: "reta",
  AL: "balanca",
  GE: "formas",
  GM: "regua",
  PE: "barras",
};

export function Icone({ nome, tamanho = 24, className }: Props) {
  return (
    <img
      src={caminhoDoIcone(nome)}
      width={tamanho}
      height={tamanho}
      style={{ width: tamanho, height: tamanho, filter: "drop-shadow(0 1px 1.5px rgba(15,23,42,0.22))" }}
      className={className}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}
