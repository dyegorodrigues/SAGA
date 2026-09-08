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
 * ## Os dois do som
 *
 * `som`, `som-baixo` e `som-mudo` são o mesmo alto-falante em três estados, e
 * `ouvido` é "estou escutando". Não é enfeite: as fichas que tocam áudio
 * mostram um enquanto o som sai e outro quando para, e é assim que a criança
 * que ainda não lê sabe se o botão funcionou.
 *
 * ## Os do bichinho
 *
 * `maca`, `bola`, `soneca`, `racao` são as AÇÕES do companheiro; `humor` e
 * `energia`, as duas barras; e as três caras (`cara-feliz`, `cara-sono`,
 * `cara-saudade`) são o estado dele. Aqui o desenho não é reforço, é a
 * informação: uma criança de seis anos lê a cara do bichinho antes de ler a
 * palavra ao lado — e por isso ela não pode mudar de aparelho para aparelho.
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
  | "porcento" | "reta" | "balanca" | "formas" | "regua" | "barras"
  | "som" | "som-baixo" | "som-mudo" | "ouvido"
  | "materia-mundo" | "materia-portugues" | "materia-ingles" | "materia-ciencias"
  | "maca" | "bola" | "soneca" | "humor" | "energia" | "racao"
  | "cara-feliz" | "cara-sono" | "cara-saudade" | "dica" | "lapis" | "coracao";

interface Props {
  nome: NomeDoIcone;
  /** Lado da caixa, em pixels. */
  tamanho?: number;
  className?: string;
}

/** A pasta pública onde a arte mora. Um teste cobra que todo nome tenha arquivo. */
export const PASTA_DOS_ICONES = "icones";

/**
 * A costura para o app servido como ARQUIVO ÚNICO.
 *
 * `scripts/gerar-arquivo-unico.mjs` empacota o SAGA inteiro num só `.html` —
 * para abrir sem servidor, mandar por mensagem, ou publicar onde não dá para
 * subir uma pasta. Ali não existe `/icones/tutor.svg`: não há pasta, não há
 * servidor, e o pedido sairia para o nada. O gerador então põe a arte
 * embutida neste objeto, e é ele que responde.
 *
 * Fora desse caso o objeto não existe e nada muda — o app continua pedindo o
 * arquivo à pasta, que é o caminho normal e o que o teste do disco cobra.
 */
declare global {
  // eslint-disable-next-line no-var
  var __SAGA_ARTE_EMBUTIDA__: Partial<Record<NomeDoIcone, string>> | undefined;
}

export function caminhoDoIcone(nome: NomeDoIcone): string {
  const embutida = globalThis.__SAGA_ARTE_EMBUTIDA__?.[nome];
  if (embutida) return embutida;
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
/**
 * O desenho de cada MATÉRIA, para as abas da Jornada.
 *
 * Matemática reaproveita o mesmo `contagem` da ilha N1 de propósito: é a mesma
 * matéria, e dois desenhos diferentes para ela fariam a criança achar que são
 * dois lugares.
 *
 * **Inglês deixou de ser uma bandeira.** Era `🇺🇸`, e virou o desenho de letras.
 * Uma bandeira amarra o idioma a um país — o app ensina inglês, não os Estados
 * Unidos, e a criança que aprende inglês na Inglaterra, na Austrália ou na
 * Nigéria não está aprendendo outra matéria. É juízo meu e desfaz-se numa
 * linha, se o dono do projeto preferir a bandeira.
 */
export const ICONE_DA_MATERIA: Record<string, NomeDoIcone> = {
  mundo: "materia-mundo",
  mat: "contagem",
  port: "materia-portugues",
  eng: "materia-ingles",
  sci: "materia-ciencias",
};

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
