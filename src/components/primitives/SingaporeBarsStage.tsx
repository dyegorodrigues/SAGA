import React from "react";
import { tokens, UIState } from "../../styles/tokens";
import { BarSlot, SingaporeBarSpec } from "../../curriculum/procedimentos/storyBarsContract";

interface Props {
  bars: SingaporeBarSpec;
  state?: UIState;
}

/** Largura fixa da caixa desconhecida: dimensioná-la revelaria a resposta. */
const LARGURA_INCOGNITA = 64;
const UNIDADE = 18;
const ALTURA = 44;

/**
 * Representação matemática de N3.10 — a relação, e só ela.
 *
 * Este palco não conhece personagem, emoji, texto nem competência: recebe três
 * segmentos e um layout. A narrativa pertence ao `StoryPanel`, e é essa
 * separação que permite ao diagnóstico distinguir erro de leitura de erro de
 * estrutura.
 *
 * O `SingaporeBars` original continua intocado: ele representa a composição
 * `A + B = total` por arrasto e é usado pelo caminho legado, pela galeria e
 * pelo GameLoop. Aqui a barra é leitura, não interação — a resposta é dada nas
 * alternativas.
 */
export function SingaporeBarsStage({ bars, state = "ocioso" }: Props) {
  const comparacao = bars.layout === "comparison";

  return (
    <section
      aria-label={comparacao ? "Barras comparadas" : "Barra de parte e todo"}
      className={`flex flex-col items-center gap-2 w-full ${tokens.estado[state]}`}
    >
      <Linha
        rotulo={bars.roles.whole}
        segmentos={[{ slot: bars.whole, role: bars.roles.whole }]}
      />
      <Linha
        rotulo={`${bars.roles.part1} e ${bars.roles.part2}`}
        segmentos={[
          { slot: bars.part1, role: bars.roles.part1 },
          { slot: bars.part2, role: bars.roles.part2 },
        ]}
        destacarUltimo={comparacao}
      />
    </section>
  );
}

interface SegmentoRotulado {
  slot: BarSlot;
  role: string;
}

function Linha({
  rotulo,
  segmentos,
  destacarUltimo = false,
}: {
  rotulo: string;
  segmentos: SegmentoRotulado[];
  destacarUltimo?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 w-full justify-center">
      <span
        className="text-xs text-right shrink-0"
        style={{ color: tokens.cor.texto.secundario, width: 96 }}
      >
        {rotulo}
      </span>
      <div className="flex items-stretch" style={{ minHeight: ALTURA }}>
        {segmentos.map(({ slot, role }, i) => (
          <Segmento
            key={i}
            slot={slot}
            role={role}
            primeiro={i === 0}
            ultimo={i === segmentos.length - 1}
            destaque={destacarUltimo && i === segmentos.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function Segmento({
  slot,
  role,
  primeiro,
  ultimo,
  destaque,
}: {
  slot: BarSlot;
  role: string;
  primeiro: boolean;
  ultimo: boolean;
  destaque: boolean;
}) {
  const desconhecido = !slot.known;
  const largura = slot.known ? Math.max(UNIDADE, slot.value * UNIDADE) : LARGURA_INCOGNITA;

  return (
    <div
      role="img"
      // Cada segmento anuncia o próprio papel: numa comparação, ouvir apenas o
      // número não diz à criança que aquele pedaço é a diferença.
      aria-label={desconhecido ? `${role}: quantidade desconhecida` : `${role}: ${slot.value}`}
      className="flex items-center justify-center font-bold"
      style={{
        width: largura,
        height: ALTURA,
        backgroundColor: desconhecido
          ? tokens.cor.superficie.destaque
          : destaque
            ? tokens.cor.elementos.base_B
            : tokens.cor.elementos.base_A,
        color: desconhecido ? tokens.cor.texto.principal : tokens.cor.texto.inverso,
        borderColor: tokens.cor.elementos.borda,
        borderWidth: 2,
        borderStyle: desconhecido ? "dashed" : "solid",
        borderRightWidth: ultimo ? 2 : 0,
        borderTopLeftRadius: primeiro ? tokens.tamanho.raio : 0,
        borderBottomLeftRadius: primeiro ? tokens.tamanho.raio : 0,
        borderTopRightRadius: ultimo ? tokens.tamanho.raio : 0,
        borderBottomRightRadius: ultimo ? tokens.tamanho.raio : 0,
      }}
    >
      {desconhecido ? "?" : slot.value}
    </div>
  );
}
