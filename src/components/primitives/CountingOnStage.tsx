import React, { useEffect, useMemo, useState } from "react";
import type {
  CountingOnResolutionShow,
  CountingOnSpec,
} from "../../curriculum/procedimentos/countingOnContract";
import {
  CountingOnMisconception,
  type CountingOnMisconception as CountingOnMisconceptionTag,
} from "../../curriculum/procedimentos/countingOnSemantics";
import type {
  AcaoCountingOn,
  EstrategiaDePartidaCountingOn,
} from "../../curriculum/procedimentos/countingOnProcedure";
import { LinkingCubes } from "./LinkingCubes";
import { NumberLine } from "./NumberLine";

interface Props {
  spec: CountingOnSpec;
  disabled?: boolean;
  promptDone?: boolean;
  mostrar?: unknown;
  falar?: (texto: string) => void;
  onAnswer: (valor: number, acao: AcaoCountingOn) => void;
}

type Fase = "partida" | "saltos" | "resposta";

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function opcoesResposta(total: number, limite: number): number[] {
  return unique([total - 1, total, total + 1].filter(value => value >= 0 && value <= limite)).sort((a, b) => a - b);
}

function tutorialSnapshot(spec: CountingOnSpec, mostrar: Record<string, unknown>): CountingOnResolutionShow {
  const salto = typeof mostrar.demonstrarSalto === "number"
    ? Math.max(0, Math.min(spec.menor, Math.round(mostrar.demonstrarSalto)))
    : 0;
  const marcadorDeclarado = typeof mostrar.marcador === "number" ? mostrar.marcador : null;
  const marcarMaior = mostrar.marcarPonto === "maior" || mostrar.piscarNumeral === "maior";
  const marcador = marcadorDeclarado ?? (marcarMaior || salto > 0 ? spec.maior + salto : null);
  const cubosContados = typeof mostrar.cubosContados === "number"
    ? Math.max(0, Math.min(spec.menor, Math.round(mostrar.cubosContados)))
    : salto;
  const saltos = Array.isArray(mostrar.saltos)
    ? mostrar.saltos as { de: number; para: number }[]
    : Array.from({ length: cubosContados }, (_, i) => ({ de: spec.maior + i, para: spec.maior + i + 1 }));

  return {
    representacao: spec.representacao,
    marcador,
    cubosContados,
    saltos,
    ...(mostrar.destacarBloco === "A" ? { destacarBloco: "A" as const } : {}),
    ...(typeof mostrar.piscarNumeral === "number" ? { piscarNumeral: mostrar.piscarNumeral } : {}),
    ...(typeof mostrar.resultado === "number" ? { resultado: mostrar.resultado } : {}),
  };
}

export function CountingOnStage({
  spec,
  disabled = false,
  promptDone = true,
  mostrar,
  falar,
  onAnswer,
}: Props) {
  const [fase, setFase] = useState<Fase>("partida");
  const [marcador, setMarcador] = useState<number | null>(null);
  const [cubosContados, setCubosContados] = useState(0);
  const [mostrarRetaErro, setMostrarRetaErro] = useState(false);
  const [aviso, setAviso] = useState("");
  const [errosConceituais, setErrosConceituais] = useState<CountingOnMisconceptionTag[]>([]);

  useEffect(() => {
    setFase("partida");
    setMarcador(null);
    setCubosContados(0);
    setMostrarRetaErro(false);
    setAviso("");
    setErrosConceituais([]);
  }, [spec.maior, spec.menor, spec.total, spec.nivel]);

  const showObject = mostrar && typeof mostrar === "object" ? mostrar as Record<string, unknown> : null;
  const snapshot = useMemo(() => showObject ? tutorialSnapshot(spec, showObject) : null, [showObject, spec]);
  const modoDemonstracao = snapshot !== null;
  const marcadorVisual = snapshot?.marcador ?? marcador;
  const cubosVisual = snapshot?.cubosContados ?? cubosContados;
  const mostrarCubos = spec.representacao === "cubos-reta";
  const mostrarReta = spec.representacao !== "simbolo" || mostrarRetaErro || (modoDemonstracao && snapshot?.marcador !== null);
  const minReta = Math.max(0, spec.maior - 1);
  const maxReta = Math.min(spec.tecladoAte, spec.total + 1);

  const registrarErro = (tag: CountingOnMisconceptionTag) => {
    setErrosConceituais(current => unique([...current, tag]));
  };

  const escolherPartida = (valor: number, estrategia: EstrategiaDePartidaCountingOn) => {
    if (disabled || !promptDone || modoDemonstracao) return;
    if (valor !== spec.maior) {
      const tag = estrategia === "um"
        ? CountingOnMisconception.CONTA_TUDO
        : CountingOnMisconception.NAO_ESCOLHE_MAIOR;
      registrarErro(tag);
      const texto = tag === CountingOnMisconception.CONTA_TUDO
        ? `${spec.maior} já está pronto. Não volte para o um.`
        : `Comece pelo maior, ${spec.maior}. Assim são menos pulos.`;
      setAviso(texto);
      falar?.(texto);
      onAnswer(-1, {
        tipo: "partida",
        correta: false,
        valor,
        esperado: spec.maior,
        estrategiaPartida: estrategia,
        errosConceituais: [tag],
      });
      return;
    }

    setMarcador(spec.maior);
    setAviso(`${spec.maior} já está pronto.`);
    falar?.(`${spec.maior}. Agora conte só mais ${spec.menor}.`);
    setFase(spec.representacao === "simbolo" ? "resposta" : "saltos");
  };

  const saltar = (valor: number) => {
    if (disabled || !promptDone || modoDemonstracao || fase !== "saltos" || marcador === null) return;
    const esperado = marcador + 1;
    if (valor !== esperado) {
      registrarErro(CountingOnMisconception.OFF_BY_ONE);
      setAviso(`Um pulo anda uma casa. Depois de ${marcador} vem ${esperado}.`);
      falar?.(`Depois de ${marcador}, ${esperado}.`);
      onAnswer(-1, {
        tipo: "salto",
        correta: false,
        valor,
        esperado,
        errosConceituais: [CountingOnMisconception.OFF_BY_ONE],
      });
      return;
    }

    const nextCount = cubosContados + 1;
    setMarcador(valor);
    setCubosContados(nextCount);
    setAviso(`${nextCount} de ${spec.menor} pulos: ${valor}.`);
    falar?.(String(valor));
    if (nextCount >= spec.menor) setFase("resposta");
  };

  const responder = (valor: number) => {
    if (disabled || !promptDone || modoDemonstracao || fase !== "resposta") return;
    const correta = valor === spec.total;
    let erroDaResposta: CountingOnMisconceptionTag | undefined;
    if (!correta && Math.abs(valor - spec.total) === 1) {
      erroDaResposta = CountingOnMisconception.OFF_BY_ONE;
      registrarErro(erroDaResposta);
    }
    if (!correta && spec.retaApareceAoErrar) setMostrarRetaErro(true);
    setAviso(correta
      ? `${spec.maior} mais ${spec.menor}: ${spec.total}.`
      : spec.retaApareceAoErrar
        ? `Use a reta a partir do ${spec.maior} e confira os ${spec.menor} pulos.`
        : "Confira os pulos a partir do número maior.");
    onAnswer(valor, {
      tipo: "resposta",
      correta,
      valor,
      esperado: spec.total,
      errosConceituais: correta ? errosConceituais : erroDaResposta ? [erroDaResposta] : [],
    });
  };

  return (
    <section
      data-counting-on-stage
      data-representacao={spec.representacao}
      data-fase={modoDemonstracao ? "demonstracao" : fase}
      data-maior={spec.maior}
      data-menor={spec.menor}
      data-total={spec.total}
      data-marcador={marcadorVisual ?? ""}
      data-cubos-contados={cubosVisual}
      className="mx-auto w-full max-w-3xl space-y-4 text-center"
      aria-label="Contar a partir do número maior"
    >
      {mostrarCubos && (
        <div className="rounded-3xl bg-slate-50 px-1 py-4 sm:px-4">
          <LinkingCubes
            groups={[
              { n: spec.maior, color: "bg-blue-400" },
              { n: spec.menor, color: "bg-amber-400", highlightCount: cubosVisual },
            ]}
            numberAbove
            joinGroups
            compact
          />
          {spec.maoFantasma && !modoDemonstracao && fase === "partida" && (
            <p data-mao-fantasma className="mt-2 text-sm font-bold text-slate-700">👆 O bloco maior já está pronto.</p>
          )}
        </div>
      )}

      {mostrarReta && (
        <div data-counting-on-line className="rounded-3xl bg-white px-1 shadow-sm">
          <NumberLine
            min={minReta}
            max={maxReta}
            currentValue={marcadorVisual}
            onValueClick={modoDemonstracao || fase !== "saltos" ? undefined : saltar}
            larguraPorPonto={42}
          />
        </div>
      )}

      {!modoDemonstracao && fase === "partida" && (
        <div className="space-y-3" data-start-choice>
          <p className="text-base font-extrabold text-slate-800">De onde é melhor começar?</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button type="button" disabled={disabled || !promptDone} onClick={() => escolherPartida(spec.maior, "maior")} className="min-h-14 rounded-2xl border-2 border-slate-300 bg-white px-3 text-lg font-black disabled:opacity-50">Do {spec.maior}</button>
            <button type="button" disabled={disabled || !promptDone} onClick={() => escolherPartida(spec.menor, "menor")} className="min-h-14 rounded-2xl border-2 border-slate-300 bg-white px-3 text-lg font-black disabled:opacity-50">Do {spec.menor}</button>
            <button type="button" disabled={disabled || !promptDone} onClick={() => escolherPartida(1, "um")} className="min-h-14 rounded-2xl border-2 border-slate-300 bg-white px-3 text-lg font-black disabled:opacity-50">Contar do 1</button>
          </div>
        </div>
      )}

      {!modoDemonstracao && fase === "saltos" && (
        <p className="rounded-2xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-950">Toque na próxima casa da reta. Cada pulo usa um cubo amarelo.</p>
      )}

      {!modoDemonstracao && fase === "resposta" && (
        <div data-counting-on-answer className="space-y-3">
          <div className="text-3xl font-black text-slate-900" aria-label={`${spec.maior} mais ${spec.menor} igual a interrogação`}>
            {spec.maior} + {spec.menor} = ?
          </div>
          <div className="grid grid-cols-3 gap-2" aria-label="Opções de resposta">
            {opcoesResposta(spec.total, spec.tecladoAte).map(valor => (
              <button key={valor} type="button" disabled={disabled || !promptDone} onClick={() => responder(valor)} className="min-h-14 rounded-2xl border-2 border-slate-300 bg-white text-xl font-black disabled:opacity-50">
                {valor}
              </button>
            ))}
          </div>
        </div>
      )}

      <div aria-live="polite" className="min-h-6 text-sm font-bold text-slate-700">{aviso}</div>
    </section>
  );
}
