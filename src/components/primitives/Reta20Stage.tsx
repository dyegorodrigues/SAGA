import React from "react";
import { sfx } from "../Mascot";
import { InteractiveNumberLineSurface, TapRetaGeometry } from "./InteractiveNumberLine";
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

function falaDeChegada(spec: Reta20Spec, escolhido: number): string {
  if (spec.modo !== "saltar") return String(escolhido);
  const percurso = numerosNoPercurso(spec.posicaoInicial, escolhido);
  return `${percurso.join(", ")}. Chegou no ${escolhido}.`;
}

/**
 * Palco F19. A reta é responsiva por construção (posições em porcentagem), então
 * não passa pelo `PalcoEscalado`, reservado aos desenhos de geometria fixa.
 * Precisão do dedo é resolvida pela geometria da superfície antes de qualquer
 * hipótese conceitual.
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
  ) {
    const acao = construirAcao(escolhido, gesto);
    // `contouMarcaInicial` pertence só à tentativa que acabou de ser capturada.
    setContouMarcaInicial(false);

    if (escolhido === spec.alvo) {
      setPosicao(escolhido);
      setPercurso({ de: spec.posicaoInicial, ate: escolhido });
      falar?.(falaDeChegada(spec, escolhido));
    } else {
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
    setContouMarcaInicial(false);
    animandoRef.current = true;
    setAnimando(true);
    setPercurso(null);

    passos.forEach((numero, index) => {
      const timer = window.setTimeout(() => {
        setPosicao(numero);
        setPercurso({ de: spec.posicaoInicial, ate: numero });
        sfx.tick();

        if (index === passos.length - 1) {
          falar?.(falaDeChegada(spec, spec.alvo));
          animandoRef.current = false;
          setAnimando(false);
          onAnswer?.(spec.alvo, acao, manipulacao);
        }
      }, (index + 1) * TEMPO_POR_SALTO_MS);
      timersRef.current.push(timer);
    });
  }

  function tocarTick(valor: number, geometry?: TapRetaGeometry) {
    if (travado || animandoRef.current) return;

    let escolhido = valor;
    let manipulacao: EventoManipulacao = { precisoEmDestinoErrado: valor !== spec.alvo };
    if (geometry) {
      const resolvido = resolverSolturaReta(
        { x: geometry.clientX, left: geometry.rect.left, width: geometry.rect.width },
        spec,
      );
      escolhido = resolvido.escolhido;
      manipulacao = {
        ...resolvido.manipulacao,
        precisoEmDestinoErrado: escolhido !== spec.alvo,
      };
    }

    // Assinatura observável de CONTA_MARCAS: tocar a própria partida antes de
    // escolher outro destino conta a marca inicial como se fosse intervalo.
    if (spec.modo === "saltar" && escolhido === spec.posicaoInicial && escolhido !== spec.alvo) {
      setContouMarcaInicial(true);
      return;
    }

    if (spec.modo === "saltar" && escolhido === spec.alvo) {
      animarSaltoCorretoPorToque(manipulacao);
      return;
    }
    publicarImediato(escolhido, "toque", manipulacao);
  }

  function atravessarTickNoArrasto(_valor: number) {
    if (travado || animandoRef.current) return;
    sfx.tick();
  }

  function soltarArrasto(clientX: number, rect: DOMRect) {
    if (travado || animandoRef.current) return;
    const resolvido = resolverSolturaReta({ x: clientX, left: rect.left, width: rect.width }, spec);
    // Uma soltura fora da reta não pode virar acerto por clamp.
    const escolhido = resolvido.manipulacao.foraDeAlvoValido
      ? spec.posicaoInicial
      : resolvido.escolhido;
    publicarImediato(escolhido, "arrasto", resolvido.manipulacao);
  }

  const alvoTutorial = typeof mostrar?.pulsarAlvo === "number" ? mostrar.pulsarAlvo : spec.alvo;
  const mostraArcosAssistidos = spec.nivel === 2 && spec.modo === "saltar";

  return (
    <div
      className="relative mx-auto w-full max-w-[720px]"
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
  );
}