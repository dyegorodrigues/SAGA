import React from "react";
import { InteractiveNumberLineSurface } from "./InteractiveNumberLine";
import { PalcoEscalado } from "./PalcoEscalado";
import { Reta20Spec } from "../../curriculum/procedimentos/reta20Contract";
import {
  AcaoReta20,
  numerosNoPercurso,
  resolverSolturaReta,
} from "../../curriculum/procedimentos/reta20Procedure";
import { EventoManipulacao } from "../../curriculum/procedimentos/filtroMotor";

const TEMPO_POR_SALTO_MS = 380;

interface MostrarReta20 {
  desenharReta?: boolean;
  destacarExtremos?: boolean;
  pulsarAlvo?: boolean | number;
  maoFantasma?: boolean;
}

interface Props {
  spec: Reta20Spec;
  onAnswer?: (valor: number, acao: AcaoReta20, manipulacao: EventoManipulacao) => void;
  disabled?: boolean;
  falar?: (texto: string) => void;
  mostrar?: MostrarReta20 | null;
}

/**
 * Palco F19. O estado matemático é deliberadamente menor que a superfície:
 * origem, destino resolvido, percurso e assinatura observável do gesto.
 * Precisão do dedo não é decidida aqui como misconception.
 */
export function Reta20Stage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [posicao, setPosicao] = React.useState(spec.posicaoInicial);
  const [percurso, setPercurso] = React.useState<{ de: number; ate: number } | null>(null);
  const [erroPulse, setErroPulse] = React.useState(0);
  const [contouMarcaInicial, setContouMarcaInicial] = React.useState(false);
  const [animando, setAnimando] = React.useState(false);
  const animandoRef = React.useRef(false);
  const timersRef = React.useRef<number[]>([]);

  function limparTimers() {
    timersRef.current.forEach(id => window.clearTimeout(id));
    timersRef.current = [];
  }

  React.useEffect(() => {
    limparTimers();
    animandoRef.current = false;
    setAnimando(false);
    setPosicao(spec.posicaoInicial);
    setPercurso(null);
    setErroPulse(0);
    setContouMarcaInicial(false);
    return limparTimers;
  }, [spec]);

  const emAula = Boolean(mostrar && Object.keys(mostrar).length);
  const travado = Boolean(disabled) || emAula;

  function construirAcao(escolhido: number, gesto: "arrasto" | "toque"): AcaoReta20 {
    return {
      escolhido,
      posicaoInicial: spec.posicaoInicial,
      alvo: spec.alvo,
      salto: spec.salto,
      gesto,
      contouMarcaInicial,
    };
  }

  function publicarImediato(
    escolhido: number,
    gesto: "arrasto" | "toque",
    manipulacao: EventoManipulacao,
    audioDoPercursoJaAconteceu = false,
  ) {
    const acao = construirAcao(escolhido, gesto);

    if (escolhido === spec.alvo) {
      setPosicao(escolhido);
      setPercurso({ de: spec.posicaoInicial, ate: escolhido });
      if (!audioDoPercursoJaAconteceu) {
        if (spec.modo === "saltar") {
          numerosNoPercurso(spec.posicaoInicial, escolhido).forEach(numero => falar?.(String(numero)));
        } else {
          falar?.(String(escolhido));
        }
      }
    } else {
      // F19 §4: erro matemático volta à partida. Um gesto motor abortado/fora da
      // reta também retorna à origem, mas não recebe shake nem mensagem conceitual.
      setPosicao(spec.posicaoInicial);
      setPercurso(null);
      if (!manipulacao.foraDeAlvoValido) {
        setErroPulse(pulse => pulse + 1);
        falar?.("Volte ao ponto de partida. Observe a direção e conte os pulos.");
      }
    }

    onAnswer?.(escolhido, acao, manipulacao);
  }

  function animarSaltoCorretoPorToque(manipulacao: EventoManipulacao) {
    if (animandoRef.current) return;
    const passos = numerosNoPercurso(spec.posicaoInicial, spec.alvo);
    if (!passos.length) {
      publicarImediato(spec.alvo, "toque", manipulacao);
      return;
    }

    const acao = construirAcao(spec.alvo, "toque");
    animandoRef.current = true;
    setAnimando(true);
    setPercurso(null);

    passos.forEach((numero, index) => {
      const timer = window.setTimeout(() => {
        setPosicao(numero);
        setPercurso({ de: spec.posicaoInicial, ate: numero });
        // F19 §4: som e movimento são a MESMA representação, no mesmo instante.
        falar?.(String(numero));

        if (index === passos.length - 1) {
          animandoRef.current = false;
          setAnimando(false);
          onAnswer?.(spec.alvo, acao, manipulacao);
        }
      }, (index + 1) * TEMPO_POR_SALTO_MS);
      timersRef.current.push(timer);
    });
  }

  function tocarTick(valor: number) {
    if (travado || animandoRef.current) return;
    // Assinatura observável de CONTA_MARCAS: no salto, tocar a própria partida
    // antes de escolher outro tick conta a marca inicial como se fosse intervalo.
    if (spec.modo === "saltar" && valor === spec.posicaoInicial && valor !== spec.alvo) {
      setContouMarcaInicial(true);
      return;
    }

    const manipulacao = { precisoEmDestinoErrado: valor !== spec.alvo };
    if (spec.modo === "saltar" && valor === spec.alvo) {
      animarSaltoCorretoPorToque(manipulacao);
      return;
    }
    publicarImediato(valor, "toque", manipulacao);
  }

  function atravessarTickNoArrasto(valor: number) {
    if (travado || animandoRef.current) return;
    // O áudio nasce do deslocamento observado, não do endpoint final.
    falar?.(String(valor));
  }

  function soltarArrasto(clientX: number, rect: DOMRect) {
    if (travado || animandoRef.current) return;
    const resolvido = resolverSolturaReta({ x: clientX, left: rect.left, width: rect.width }, spec);
    // O resolver geométrico clampa coordenadas para descobrir o tick mais próximo,
    // mas uma soltura declaradamente fora da reta NÃO pode virar acerto por clamp.
    // Publicamos a origem como valor neutro de retry, preservando `foraDeAlvoValido`
    // para que o filtro motor impeça qualquer misconception/Radar.
    const escolhido = resolvido.manipulacao.foraDeAlvoValido
      ? spec.posicaoInicial
      : resolvido.escolhido;
    publicarImediato(escolhido, "arrasto", resolvido.manipulacao, true);
  }

  const alvoTutorial = typeof mostrar?.pulsarAlvo === "number" ? mostrar.pulsarAlvo : spec.alvo;
  const mostraArcosAssistidos = spec.nivel === 2 && spec.modo === "saltar";

  return (
    <PalcoEscalado>
      <div
        className="relative w-full max-w-[720px]"
        data-reta20-stage
        data-reta-modo={spec.modo}
        data-reta-animando={animando ? "true" : "false"}
      >
        {mostrar?.desenharReta && (
          <div className="mb-2 text-center text-sm font-black text-indigo-700" data-reta-tutorial>
            A reta organiza os números em ordem.
          </div>
        )}

        <InteractiveNumberLineSurface
          start={spec.inicio}
          end={spec.fim}
          position={posicao}
          emoji={spec.emoji}
          disabled={travado}
          interactionDisabled={animando}
          numeraisVisiveis={spec.numeraisVisiveis}
          target={emAula ? alvoTutorial : undefined}
          pulsarTarget={Boolean(mostrar?.pulsarAlvo)}
          pathFrom={percurso?.de ?? null}
          pathTo={percurso?.ate ?? null}
          assistPathFrom={mostraArcosAssistidos ? spec.posicaoInicial : null}
          assistPathTo={mostraArcosAssistidos ? spec.alvo : null}
          errorPulse={erroPulse}
          onTapTick={tocarTick}
          onDragTick={atravessarTickNoArrasto}
          onDragRelease={soltarArrasto}
        />

        {mostrar?.destacarExtremos && (
          <div className="pointer-events-none absolute inset-x-8 top-12 flex justify-between text-xs font-black text-indigo-700" aria-hidden>
            <span>{spec.inicio}</span><span>{spec.fim}</span>
          </div>
        )}

        {mostrar?.maoFantasma && (
          <div className="pointer-events-none absolute left-1/2 top-2 text-2xl" aria-hidden>☝️</div>
        )}

        {erroPulse > 0 && (
          <div data-reta-erro className="sr-only" aria-live="polite">
            O foguete voltou ao ponto de partida. Observe a direção e conte os espaços.
          </div>
        )}
      </div>
    </PalcoEscalado>
  );
}