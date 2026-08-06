import React from "react";
import { Dedo, DEDOS, MaoSpec } from "../../curriculum/procedimentos/emojiRowContract";

/**
 * A mão da ficha JD2 — a skin do `EmojiRow` em modo relâmpago.
 *
 * ---
 *
 * ### Por que uma mão desenhada, e não o emoji ✋
 *
 * A JD2 §3 escreve a regra de desenho e ela é incompatível com emoji:
 *
 * > *"silhueta limpa, sem unha, sem anel, sem detalhe. Dedos levantados em
 * > **contraste forte** contra os dobrados. Nunca contar com a cor da pele para
 * > transmitir informação. A mão é sempre mostrada **de frente, na mesma
 * > orientação**, em todos os níveis."*
 *
 * Emoji de mão não tem configuração arbitrária de dedos (não existe "🖐 com o
 * anelar dobrado"), muda de desenho por plataforma e carrega tom de pele. Cada
 * uma dessas três coisas quebra a ficha sozinha.
 *
 * ### O que carrega a informação
 *
 * **O comprimento**, não a cor. Dedo levantado é longo e cheio; dobrado é um
 * toco vazado com contorno. Quem não distingue as duas cores continua vendo a
 * diferença — é a regra de acessibilidade do §10, e aqui ela não é acréscimo:
 * a §3 já a escrevia como "contraste forte".
 *
 * ### O rótulo não conta os dedos
 *
 * `aria-label` diz *"uma mão"*, nunca *"uma mão com três dedos"*. A pergunta da
 * ficha é quantos dedos apareceram: um rótulo que responde entrega o gabarito a
 * quem usa leitor de tela — e a lista de verificação do canário cobra
 * exatamente isto ("a tela renderizada não fala o número que a pergunta pede").
 * Na **revelação**, depois de respondida, o número entra no rótulo: aí o olho
 * também já viu.
 */

interface Props {
  mao: MaoSpec;
  /** Aresta do desenho, em pixels. */
  tamanho?: number;
  /**
   * A resposta já foi dada — o rótulo pode contar os dedos.
   *
   * Só na revelação (§4). Antes disso, contar no rótulo é entregar a resposta a
   * quem ouve a tela em vez de vê-la.
   */
  revelando?: boolean;
  /**
   * Destaca a mão CHEIA em bloco.
   *
   * JD2 §4, erro suave: *"a mão reaparece com a mão cheia (5) destacada em bloco
   * e os dedos extras piscando separados"*. É a âncora do 5 sendo mostrada, não
   * um enfeite de erro.
   */
  destacarCheia?: boolean;
}

/* As medidas do desenho. Derivadas umas das outras: constante mágica ao lado de
   outra medida é o cheiro do §6.28. */
const LARGURA = 108;
const ALTURA = 128;
/** A linha onde os dedos nascem: o topo da palma. */
const BASE_DOS_DEDOS = 74;
const LARGURA_DO_DEDO = 15;
/**
 * O toco do dedo dobrado.
 *
 * Ele nasce **na mesma linha** dos levantados e sobe pouco. O primeiro desenho
 * punha o toco começando abaixo dessa linha, e o resultado no print foi um
 * buraco claro dentro da palma: o dedo dobrado lia como um defeito da mão, não
 * como um dedo. Correto e ilegível é o mesmo que errado (§6.25).
 */
const TOCO = 22;

/** O topo de cada dedo levantado. A silhueta da mão real, sem detalhe. */
const TOPO_DO_DEDO: Record<Exclude<Dedo, "polegar">, number> = {
  indicador: 22,
  medio: 12,
  anelar: 20,
  minimo: 36,
};

/** O centro horizontal de cada dedo. */
const CENTRO_DO_DEDO: Record<Exclude<Dedo, "polegar">, number> = {
  indicador: 33,
  medio: 52,
  anelar: 71,
  minimo: 89,
};

/**
 * As cores.
 *
 * ### O que o print mostrou
 *
 * A palma era do MESMO tom cheio dos dedos levantados, e a mão saía como um
 * bloco azul com paus em cima — a criança não via dedos, via uma mancha. O
 * contraste que a §3 pede é entre dedo **levantado** e dedo **dobrado**, e a
 * palma competindo nesse contraste apagava os dois.
 *
 * Agora a palma é neutra e contornada, e o tom cheio fica reservado para o que
 * carrega a informação. Quem não distingue as cores continua vendo, porque a
 * informação está no **comprimento** — a cor só reforça (§10).
 */
const CHEIO = "#4338CA";
const VAZIO = "#B9BAD6";
const PALMA = "#F1F1FA";
const CONTORNO = "#5B5B7A";

export function MaoDeDedos({ mao, tamanho = 108, revelando, destacarCheia }: Props) {
  const levantado = (d: Dedo) => mao.levantados.includes(d);
  const emBloco = destacarCheia === true && mao.cheia;

  return (
    <svg
      role="img"
      aria-label={revelando ? `uma mão com ${mao.levantados.length} dedos levantados` : "uma mão"}
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      width={tamanho}
      height={(tamanho * ALTURA) / LARGURA}
      style={{ display: "block" }}
    >
      {/* A mão cheia destacada em bloco: uma moldura em volta da mão inteira,
          não dedo a dedo. §4 diz "em bloco" porque a âncora é a mão como
          unidade — piscar os cinco separados ensinaria a contar cinco. */}
      {emBloco && (
        <rect
          x={2} y={4} width={LARGURA - 4} height={ALTURA - 8}
          rx={14} fill="#FEF3C7" stroke="#B45309" strokeWidth={3}
        />
      )}

      {/* A palma vem PRIMEIRO, e os dedos por cima dela.
          Desenhada por último, ela tapava os dedos dobrados: só 16px de toco
          sobravam acima da borda, e a criança via um buraco claro no meio da
          mão em vez de um dedo dobrado. Foi o print que mostrou — nenhum teste
          pergunta se a figura parece uma mão (§6.25). */}
      <rect
        x={22} y={BASE_DOS_DEDOS} width={74} height={ALTURA - BASE_DOS_DEDOS - 6}
        rx={18} fill={PALMA} stroke={CONTORNO} strokeWidth={2.5}
      />

      {/* Os quatro dedos. Todos terminam DENTRO da palma, para ficarem presos a
          ela; o que muda é onde começam. Levantado sobe 40 a 62; dobrado sobe
          22. É o COMPRIMENTO que carrega a informação — quem não distingue as
          cores continua vendo a diferença (§10). */}
      {DEDOS.filter((d): d is Exclude<Dedo, "polegar"> => d !== "polegar").map(d => {
        const cima = levantado(d);
        const topo = cima ? TOPO_DO_DEDO[d] : BASE_DOS_DEDOS - TOCO;
        return (
          <rect
            key={d}
            x={CENTRO_DO_DEDO[d] - LARGURA_DO_DEDO / 2}
            y={topo}
            width={LARGURA_DO_DEDO}
            height={BASE_DOS_DEDOS - topo + 12}
            rx={LARGURA_DO_DEDO / 2}
            fill={cima ? CHEIO : VAZIO}
            stroke={CONTORNO}
            strokeWidth={2.5}
          />
        );
      })}

      {/* O polegar sai do lado esquerdo, sempre do mesmo lado: a mão não gira
          (§3). Dobrado, ele não some nem vira um ponto solto — encolhe contra a
          palma, que é o que um polegar dobrado faz. */}
      {levantado("polegar") ? (
        <rect
          x={-2} y={BASE_DOS_DEDOS + 2} width={40} height={LARGURA_DO_DEDO}
          rx={LARGURA_DO_DEDO / 2} fill={CHEIO} stroke={CONTORNO} strokeWidth={2.5}
          transform={`rotate(-38 ${20} ${BASE_DOS_DEDOS + 9})`}
        />
      ) : (
        <rect
          x={10} y={BASE_DOS_DEDOS + 10} width={22} height={LARGURA_DO_DEDO}
          rx={LARGURA_DO_DEDO / 2} fill={VAZIO} stroke={CONTORNO} strokeWidth={2.5}
        />
      )}
    </svg>
  );
}
