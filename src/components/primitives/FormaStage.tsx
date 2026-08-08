import React from "react";
import { motion } from "motion/react";
import { PalcoEscalado } from "./PalcoEscalado";
import { FiguraDesenhada } from "./ShapeCanvas";
import { FormaSpec, LADO_DO_CONTEINER, OpcaoDeForma, VAO } from "../../curriculum/procedimentos/formaContract";
import { AcaoDeForma, descricaoDeLados, FALAS, Forma, NOME } from "../../curriculum/procedimentos/formaProcedure";

const DURACAO_ERRO = 2500;
const DURACAO_ACERTO = 2200;

type Fase = "idle" | "erro" | "acerto" | "fecho";

interface Props {
  spec: FormaSpec;
  onAnswer?: (valor: string, acao: AcaoDeForma) => void;
  disabled?: boolean;
  falar?: (texto: string) => void;
  mostrar?: {
    destacarTodas?: boolean;
    /** Demonstra semanticamente A FORMA CERTA da questão atual. */
    contarLadosAlvo?: boolean;
    /** Gira somente A FORMA CERTA da questão atual. */
    girarAlvo?: boolean;
  } | null;
}

const MARCADORES: Record<Forma, Array<{ left: string; top: string }>> = {
  circulo: [],
  triangulo: [
    { left: "50%", top: "6%" },
    { left: "8%", top: "88%" },
    { left: "92%", top: "88%" },
  ],
  quadrado: [
    { left: "50%", top: "6%" },
    { left: "94%", top: "50%" },
    { left: "50%", top: "94%" },
    { left: "6%", top: "50%" },
  ],
  retangulo: [
    { left: "50%", top: "6%" },
    { left: "94%", top: "50%" },
    { left: "50%", top: "94%" },
    { left: "6%", top: "50%" },
  ],
};

function MarcadoresDeLados({ forma, giro: _giro }: { forma: Forma; giro: number }) {
  if (forma === "circulo") {
    return (
      <span
        data-forma-side-zero
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/95 px-2 py-1 text-[11px] font-black text-blue-700 shadow"
      >
        0 lados
      </span>
    );
  }
  return (
    <span
      aria-hidden
      data-forma-side-markers
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 60 }}
    >
      {MARCADORES[forma].map((p, i) => (
        <span
          key={i}
          data-forma-side-marker
          className="absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-[10px] font-black text-white shadow"
          style={{ ...p, zIndex: 70 }}
        >
          {i + 1}
        </span>
      ))}
    </span>
  );
}

function MiniForma({ opcao }: { opcao: OpcaoDeForma }) {
  return (
    <div className="relative flex h-[76px] w-[92px] items-center justify-center rounded-xl border-2 border-slate-200 bg-white">
      <FiguraDesenhada
        figura={opcao.figura}
        giro={opcao.giro}
        tamanho={Math.min(54, opcao.tamanho)}
        cor={opcao.cor}
        objeto={opcao.objeto}
      />
    </div>
  );
}

function ComparacaoDoErro({ escolhida, certa }: { escolhida: OpcaoDeForma; certa: OpcaoDeForma }) {
  return (
    <div
      data-forma-comparison
      aria-live="polite"
      className="flex w-full items-stretch justify-center gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50/90 p-2"
    >
      {[{ titulo: "Você tocou", opcao: escolhida }, { titulo: "Compare com", opcao: certa }].map(({ titulo, opcao }) => (
        <div key={titulo} className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
          <span className="text-[11px] font-black text-slate-500">{titulo}</span>
          <MiniForma opcao={opcao} />
          <span className="text-[12px] font-black text-slate-700">{descricaoDeLados(opcao.figura)}</span>
        </div>
      ))}
    </div>
  );
}

export function FormaStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [fase, setFase] = React.useState<Fase>("idle");
  const [escolhida, setEscolhida] = React.useState<number | null>(null);
  const [entradaSeq, setEntradaSeq] = React.useState(0);
  const timers = React.useRef<number[]>([]);

  const limparTimers = React.useCallback(() => {
    timers.current.forEach(id => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const agendar = React.useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  React.useEffect(() => {
    limparTimers();
    setFase("idle");
    setEscolhida(null);
    setEntradaSeq(n => n + 1);
    return limparTimers;
  }, [spec, limparTimers]);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const travado = Boolean(disabled) || fase !== "idle" || emAula;
  const corretaIdx = spec.opcoes.findIndex(o => o.figura === spec.resposta);
  const escolhidaOpcao = escolhida == null ? null : spec.opcoes[escolhida];
  const corretaOpcao = spec.opcoes[corretaIdx];

  function acaoDa(opcao: OpcaoDeForma): AcaoDeForma {
    return {
      pedida: spec.alvo,
      escolhida: opcao.figura,
      pedidaGirada: spec.alvoGirado,
      escolhidaEmPe: opcao.giro === 0,
    };
  }

  function responder(i: number) {
    if (travado) return;
    const opcao = spec.opcoes[i];
    const certo = opcao.figura === spec.resposta;
    setEscolhida(i);

    if (!certo) {
      setFase("erro");
      falar?.(FALAS.erroSuave(opcao.figura, spec.resposta));
      onAnswer?.(opcao.figura, acaoDa(opcao));
      agendar(() => {
        setEscolhida(null);
        setFase("idle");
      }, DURACAO_ERRO);
      return;
    }

    setFase("acerto");
    falar?.(FALAS.acerto(opcao.figura));
    // Publica antes do cinema: RT mede decisão, não os 2,2s de animação.
    onAnswer?.(opcao.figura, acaoDa(opcao));
    agendar(() => setFase("fecho"), DURACAO_ACERTO);
  }

  const colunas = spec.opcoes.length === 4 ? 2 : spec.opcoes.length;

  return (
    <PalcoEscalado>
      <div className="flex flex-col items-center gap-3 select-none">
        <div
          role="group"
          aria-label="As formas"
          className="grid justify-center"
          style={{ gridTemplateColumns: `repeat(${colunas}, ${LADO_DO_CONTEINER}px)`, gap: VAO }}
        >
          {spec.opcoes.map((o, i) => {
            const certa = i === corretaIdx;
            const selecionada = i === escolhida;
            const erroEscolhido = fase === "erro" && selecionada && !certa;
            const mostrarCertaNoErro = fase === "erro" && certa;
            const sucesso = (fase === "acerto" || fase === "fecho") && certa;
            const tutorialTodas = emAula && mostrar?.destacarTodas;
            const tutorialAlvo = emAula && certa && (mostrar?.contarLadosAlvo || mostrar?.girarAlvo);
            // A lição gira 360° no acerto. No fecho, 360° deve permanecer
            // como estado final (visualmente igual a 0°), sem uma segunda volta
            // inversa 360→0 que faria a legenda nascer girando/cortada.
            const rodando = (fase === "acerto" && certa) || Boolean(emAula && certa && mostrar?.girarAlvo);
            const manterRotacaoFinal = sucesso || Boolean(emAula && certa && mostrar?.girarAlvo);
            const mostraLados = sucesso || Boolean(emAula && certa && mostrar?.contarLadosAlvo);

            let opacity = 1;
            if (fase === "erro" && !erroEscolhido && !mostrarCertaNoErro) opacity = 0.28;
            if (fase === "fecho" && !certa) opacity = 0;
            if (emAula && (mostrar?.contarLadosAlvo || mostrar?.girarAlvo) && !certa) opacity = 0.28;

            const borderColor = erroEscolhido
              ? "#F97316"
              : (mostrarCertaNoErro || sucesso)
                ? "#16A34A"
                : tutorialAlvo
                  ? "#2563EB"
                  : tutorialTodas
                    ? "#60A5FA"
                    : "#C7D7F0";

            return (
              <motion.button
                key={`${entradaSeq}-${o.figura}-${i}`}
                type="button"
                data-forma-figura={o.figura}
                data-forma-representacao={o.objeto ? "real" : "pura"}
                data-forma-spinning={rodando ? "true" : undefined}
                data-forma-close={fase === "fecho" && certa ? "true" : undefined}
                disabled={travado}
                onClick={() => responder(i)}
                aria-label={NOME[o.figura]}
                className="relative flex items-center justify-center overflow-visible rounded-2xl"
                style={{
                  width: LADO_DO_CONTEINER,
                  height: LADO_DO_CONTEINER,
                  backgroundColor: tutorialTodas || tutorialAlvo ? "rgba(37,99,235,0.08)" : "#F8FAFC",
                  border: `${tutorialAlvo ? 4 : 3}px solid ${borderColor}`,
                  boxShadow: tutorialAlvo ? "0 0 0 5px rgba(37,99,235,0.10)" : "none",
                  padding: 0,
                  zIndex: mostraLados ? 20 : undefined,
                }}
                initial={{ opacity: 0, scale: 0.82, rotate: i % 2 === 0 ? -8 : 8 }}
                animate={{
                  opacity,
                  scale: sucesso ? 1.08 : (tutorialAlvo ? [1, 1.06, 1] : 1),
                  rotate: manterRotacaoFinal ? 360 : 0,
                  x: erroEscolhido ? [0, -6, 6, 0] : 0,
                }}
                transition={rodando
                  ? { duration: fase === "acerto" ? 2.2 : 1.6, ease: "easeInOut" }
                  : erroEscolhido
                    ? { duration: 0.4 }
                    : { duration: 0.55, delay: i * 0.14 }}
              >
                <FiguraDesenhada
                  figura={o.figura}
                  giro={o.giro}
                  tamanho={o.tamanho}
                  cor={o.cor}
                  objeto={o.objeto}
                />
                {mostraLados && <MarcadoresDeLados forma={o.figura} giro={o.giro} />}
                {fase === "fecho" && certa && (
                  <span data-forma-close-label className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white px-2 py-1 text-[12px] font-black text-blue-800 shadow">
                    {descricaoDeLados(o.figura)}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {fase === "erro" && escolhidaOpcao && corretaOpcao && (
          <ComparacaoDoErro escolhida={escolhidaOpcao} certa={corretaOpcao} />
        )}
      </div>
    </PalcoEscalado>
  );
}
