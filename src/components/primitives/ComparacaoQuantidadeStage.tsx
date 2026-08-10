import React from "react";
import { motion } from "motion/react";
import { ComparacaoQuantidadeSpec, GrupoQuantidadeSpec } from "../../curriculum/procedimentos/comparacaoQuantidadeContract";
import { Grupo } from "./Grupo";
import { PalcoEscalado } from "./PalcoEscalado";

const ERRO_MS = 2400;
const ACERTO_MS = 1100;

type Fase = "idle" | "erro" | "acerto";

export interface ComparacaoQuantidadeMostrar {
  destacarAmbos?: boolean;
  /** Índice zero-based do último par demonstrado: 0 = só o primeiro par. */
  parear?: number;
  pulsarGrupos?: boolean;
}

interface Props {
  spec: ComparacaoQuantidadeSpec;
  onAnswer?: (valor: number) => void;
  disabled?: boolean;
  falar?: (texto: string) => void;
  mostrar?: ComparacaoQuantidadeMostrar | null;
}

function itensDoGrupo(grupo: GrupoQuantidadeSpec) {
  return Array.from({ length: grupo.quantidade }, (_, i) => (
    <motion.span
      key={`${grupo.emoji}-${i}`}
      data-grupo-quantidade-item
      aria-hidden
      className={grupo.distribuicao === "espalhada"
        ? "m-2 inline-flex items-center justify-center text-[28px] leading-none"
        : grupo.distribuicao === "compacta"
          ? "-m-0.5 inline-flex items-center justify-center text-[28px] leading-none"
          : "inline-flex items-center justify-center text-[28px] leading-none"}
      style={{ transform: `scale(${grupo.escalaItem})` }}
      initial={{ opacity: 0, scale: 0.7 * grupo.escalaItem }}
      animate={{ opacity: 1, scale: grupo.escalaItem }}
      transition={{ delay: 0.04 * i, duration: 0.25 }}
    >
      {grupo.emoji}
    </motion.span>
  ));
}

function Pareamento({ spec, limitePares, mostrarSobra }: {
  spec: ComparacaoQuantidadeSpec;
  limitePares?: number;
  mostrarSobra: boolean;
}) {
  const paresTotais = Math.min(spec.grupos[0].quantidade, spec.grupos[1].quantidade);
  const paresVisiveis = limitePares == null
    ? paresTotais
    : Math.max(0, Math.min(paresTotais, limitePares));
  const sobraEsquerda = spec.grupos[0].quantidade - paresTotais;
  const sobraDireita = spec.grupos[1].quantidade - paresTotais;
  return (
    <motion.div
      data-comparacao-pareamento
      data-pares-visiveis={paresVisiveis}
      className="mt-2 flex flex-col items-center gap-1 rounded-xl border border-blue-200 bg-blue-50/90 px-3 py-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="text-xs font-bold text-blue-900">Um de cada lado</span>
      <div className="flex max-w-[290px] flex-wrap justify-center gap-1" aria-hidden>
        {Array.from({ length: paresVisiveis }, (_, i) => (
          <span key={i} data-comparacao-par className="text-sm">●—●</span>
        ))}
      </div>
      {mostrarSobra && (sobraEsquerda > 0 || sobraDireita > 0) && (
        <span data-comparacao-sobra className="text-sm font-black text-blue-800">
          {sobraEsquerda > 0 ? `Sobrou ${sobraEsquerda} à esquerda` : `Sobrou ${sobraDireita} à direita`}
        </span>
      )}
    </motion.div>
  );
}

export function ComparacaoQuantidadeStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [fase, setFase] = React.useState<Fase>("idle");
  const [escolhido, setEscolhido] = React.useState<number | null>(null);
  const [mostrarPares, setMostrarPares] = React.useState(false);
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => {
    setFase("idle");
    setEscolhido(null);
    setMostrarPares(false);
    return () => {
      if (timer.current != null) window.clearTimeout(timer.current);
    };
  }, [spec]);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const travado = Boolean(disabled) || fase !== "idle" || emAula;
  const paresTutorial = typeof mostrar?.parear === "number" ? mostrar.parear + 1 : 0;
  const pareamentoDeErro = fase === "erro" && spec.autoParearNoErro;
  const exibirPareamento = pareamentoDeErro || mostrarPares || paresTutorial > 0;
  const limitePares = pareamentoDeErro || mostrarPares ? undefined : paresTutorial;
  const mostrarSobra = pareamentoDeErro || mostrarPares;

  function tocar(i: number) {
    if (travado) return;
    setEscolhido(i);
    const certo = i === spec.resposta;
    onAnswer?.(i);
    if (!certo) {
      setFase("erro");
      falar?.(spec.explain);
      timer.current = window.setTimeout(() => {
        setFase("idle");
        setEscolhido(null);
        // A explicação pode mostrar a solução; o retry precisa voltar limpo.
        setMostrarPares(false);
      }, ERRO_MS);
      return;
    }
    setFase("acerto");
    falar?.("Isso. O grupo que sobrou no pareamento tem mais.");
    timer.current = window.setTimeout(() => setFase("idle"), ACERTO_MS);
  }

  return (
    <PalcoEscalado>
      <div
        data-comparacao-quantidade-stage
        data-comparacao-nivel={spec.nivel}
        data-armadilha-tamanho={spec.armadilhaTamanho || undefined}
        data-armadilha-espaco={spec.armadilhaEspaco || undefined}
        className="flex flex-col items-center gap-2 select-none"
      >
        <div className="flex items-stretch justify-center gap-3">
          {spec.grupos.map((grupo, i) => {
            const selecionado = escolhido === i;
            const correto = fase === "acerto" && i === spec.resposta;
            const erro = fase === "erro" && selecionado;
            const destaqueAula = Boolean(mostrar?.destacarAmbos);
            const pulsarAula = Boolean(mostrar?.pulsarGrupos);
            return (
              <motion.div
                key={`${grupo.emoji}-${grupo.quantidade}-${i}`}
                data-comparacao-grupo={i}
                data-quantidade={grupo.quantidade}
                data-distribuicao={grupo.distribuicao}
                data-caixa={`${grupo.caixa.largura}x${grupo.caixa.altura}`}
                animate={erro
                  ? { x: [0, -4, 4, 0] }
                  : correto || pulsarAula
                    ? { scale: [1, 1.04, 1] }
                    : destaqueAula
                      ? { opacity: 1 }
                      : {}}
                transition={{ duration: pulsarAula ? 0.7 : 0.35 }}
                style={{
                  width: grupo.caixa.largura,
                  minHeight: grupo.caixa.altura,
                  opacity: emAula && !destaqueAula && !pulsarAula && paresTutorial === 0 ? 0.78 : 1,
                }}
              >
                <Grupo
                  items={itensDoGrupo(grupo)}
                  onClick={() => tocar(i)}
                  disabled={travado}
                  selected={correto}
                  rotulo={`grupo ${i + 1}`}
                />
              </motion.div>
            );
          })}
        </div>

        {spec.pareamentoDisponivel && fase === "idle" && !emAula && (
          <button
            type="button"
            data-comparacao-parear
            disabled={Boolean(disabled)}
            onClick={() => setMostrarPares(v => !v)}
            className="rounded-full border border-blue-300 bg-white px-3 py-1 text-xs font-bold text-blue-800 shadow-sm"
          >
            {mostrarPares ? "Esconder pares" : "Quer parear?"}
          </button>
        )}

        {exibirPareamento && (
          <Pareamento spec={spec} limitePares={limitePares} mostrarSobra={mostrarSobra} />
        )}
      </div>
    </PalcoEscalado>
  );
}
