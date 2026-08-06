import React from "react";
import { motion } from "motion/react";
import { FiguraDesenhada, FiguraDesenhavel } from "./ShapeCanvas";
import { PalcoEscalado } from "./PalcoEscalado";
import {
  FormaSpec,
  LADO_DO_CONTEINER,
  LARGURA_DE_PROJETO,
  VAO,
} from "../../curriculum/procedimentos/formaContract";
import {
  AcaoDeForma,
  FALAS,
  Forma,
  LADOS,
  NOME,
} from "../../curriculum/procedimentos/formaProcedure";

/**
 * `FormaStage` — a tela de GE.02, ficha F48.
 *
 * ---
 *
 * ### O giro de 360° no acerto é a lição, não a comemoração
 *
 * §4: *"a forma escolhida **gira lentamente 360°**, mostrando que continua sendo
 * a mesma em qualquer posição. Os lados são contados com destaque."*
 *
 * > *"Ver a forma girar e continuar sendo triângulo é o que ensina invariância."*
 *
 * É por isso que a volta é **inteira e lenta**: meia volta mostraria a forma
 * numa posição nova, não a mesma forma passando por todas.
 *
 * ### Os contêineres são idênticos, e isso é regra de conteúdo
 *
 * §3. Contêiner maior para a forma certa deixaria a criança acertar sem olhar a
 * forma — e olhar a forma é a competência inteira. O que varia no nível 3 é o
 * **desenho** dentro da caixa; a caixa, nunca.
 */

interface Props {
  spec: FormaSpec;
  onAnswer?: (valor: string, acao: AcaoDeForma) => void;
  disabled?: boolean;
  /** A voz do app. §4: ela conta os lados no acerto e no erro. */
  falar?: (texto: string) => void;
  /** O passo da micro-aula (§8). */
  mostrar?: {
    /** §8: "Procuramos o triângulo." */
    destacarTodas?: boolean;
    /** §8: "Ele tem três lados." */
    contarLados?: number;
    /** §8: "Mesmo virado, é triângulo!" */
    girarForma?: number;
  } | null;
}

export function FormaStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [escolhida, setEscolhida] = React.useState<number | null>(null);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const respondeu = escolhida !== null;
  const travado = disabled || respondeu || emAula;

  const porLinha = spec.opcoes.length >= 4 ? 2 : spec.opcoes.length;

  function escolher(i: number) {
    if (travado) return;
    const opcao = spec.opcoes[i];
    setEscolhida(i);

    const certa = spec.opcoes.find(o => o.figura === spec.resposta)!;
    falar?.(opcao.figura === spec.resposta
      ? (spec.solidos
        ? FALAS.acertoSolido(spec.resposta as never)
        : FALAS.acerto(spec.resposta as Forma))
      : (spec.solidos
        ? FALAS.erroDeSolido(opcao.figura as never, spec.resposta as never)
        : FALAS.erroSuave(opcao.figura as Forma, spec.resposta as Forma)));

    onAnswer?.(String(opcao.figura), {
      pedida: spec.resposta,
      escolhida: opcao.figura,
      pedidaGirada: certa.giro !== 0,
      escolhidaEmPe: opcao.giro === 0,
    });
  }

  return (
    <PalcoEscalado>
    <div className="flex flex-col items-center gap-3 select-none" style={{ width: LARGURA_DE_PROJETO }}>
      <div
        role="group"
        aria-label="As formas"
        className="grid"
        style={{ gridTemplateColumns: `repeat(${porLinha}, ${LADO_DO_CONTEINER}px)`, gap: VAO }}
      >
        {spec.opcoes.map((o, i) => {
          const certa = o.figura === spec.resposta;
          const escolhi = escolhida === i;
          const emFoco = emAula && (mostrar?.destacarTodas === true || mostrar?.girarForma !== undefined);
          return (
            <motion.button
              key={`${o.figura}-${i}`}
              type="button"
              disabled={travado}
              onClick={() => escolher(i)}
              aria-label={NOME[o.figura]}
              className="flex items-center justify-center rounded-2xl"
              style={{
                // §3: contêineres IDÊNTICOS. O tamanho não é pista.
                width: LADO_DO_CONTEINER,
                height: LADO_DO_CONTEINER,
                backgroundColor: "#F8FAFC",
                border: `3px solid ${respondeu && certa ? "#16A34A" : "#C7D7F0"}`,
                overflow: "hidden",
              }}
              // §4, acerto: a forma escolhida gira 360° e continua a mesma.
              // A volta é INTEIRA: meia volta mostraria uma posição nova, não a
              // mesma forma passando por todas elas.
              animate={{
                rotate: (respondeu && escolhi && certa) || (emAula && mostrar?.girarForma) ? 360 : 0,
                scale: escolhi && !certa ? [1, 0.94, 1] : 1,
                opacity: respondeu && !certa && !escolhi ? 0.45 : 1,
              }}
              transition={{ duration: (respondeu && escolhi && certa) || emAula ? 2.2 : 0.4, ease: "easeInOut" }}
            >
              <FiguraDesenhada
                figura={o.figura as FiguraDesenhavel}
                giro={o.giro}
                tamanho={o.tamanho}
                cor={o.cor}
                objeto={o.objeto}
              />
              {/* §4, fecho: "a forma correta com os lados numerados". Só depois
                  da resposta — antes, o número de lados É o gabarito. */}
              {respondeu && certa && !spec.solidos && (
                <span
                  aria-hidden
                  className="absolute rounded-lg px-1.5"
                  style={{
                    marginTop: LADO_DO_CONTEINER - 26,
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#15803D",
                    backgroundColor: "rgba(255,255,255,0.94)",
                  }}
                >
                  {LADOS[spec.resposta as Forma] === 0
                    ? "nenhum lado"
                    : `${LADOS[spec.resposta as Forma]} lados`}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* §8: "Ele tem três lados." — o passo da micro-aula que conta os lados. */}
      {emAula && mostrar?.contarLados !== undefined && (
        <p className="text-center text-[15px] font-bold" style={{ color: "#2563EB" }}>
          {mostrar.contarLados} lados
        </p>
      )}
    </div>
    </PalcoEscalado>
  );
}
