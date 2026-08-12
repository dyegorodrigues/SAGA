import React, { useEffect, useMemo, useRef, useState } from "react";
import { Quadrado100 } from "./Quadrado100";
import { Quadrado100Spec } from "../../curriculum/procedimentos/quadrado100Contract";
import { AcaoQuadrado100 } from "../../curriculum/procedimentos/quadrado100Procedure";

interface Quadrado100StageProps {
  spec: Quadrado100Spec;
  disabled?: boolean;
  falar?: (texto: string) => void;
  mostrar?: Record<string, unknown> | null;
  onAnswer: (valor: number, acao: AcaoQuadrado100) => void;
}

function centroDaCasa(n: number): { x: number; y: number } {
  const indice = Math.max(0, Math.min(99, n - 1));
  return {
    x: (indice % 10) * 10 + 5,
    y: Math.floor(indice / 10) * 10 + 5,
  };
}

function casasDoTutorial(mostrar?: Record<string, unknown> | null): number[] {
  if (!mostrar) return [];
  const numeros: number[] = [];
  for (const chave of ["destacarCasa", "piscarCasa"]) {
    const valor = mostrar[chave];
    if (typeof valor === "number") numeros.push(valor);
  }
  const ligacao = mostrar.ligarCasas;
  if (Array.isArray(ligacao)) {
    for (const valor of ligacao) if (typeof valor === "number") numeros.push(valor);
  }
  return [...new Set(numeros.filter(n => n >= 1 && n <= 100))];
}

export function Quadrado100Stage({
  spec,
  disabled = false,
  falar,
  mostrar,
  onAnswer,
}: Quadrado100StageProps) {
  const [indice, setIndice] = useState(0);
  const [reveladas, setReveladas] = useState<number[]>([]);
  const [toques, setToques] = useState<number[]>([]);
  const [revisoes, setRevisoes] = useState(0);
  const [errada, setErrada] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState("");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    setIndice(0);
    setReveladas([]);
    setToques([]);
    setRevisoes(0);
    setErrada(null);
    setMensagem("");
    return () => {
      for (const timer of timers.current) window.clearTimeout(timer);
      timers.current = [];
    };
  }, [spec.nivel, spec.inicio, spec.alvo, spec.modo]);

  const esperado = spec.caminho[Math.min(indice, spec.caminho.length - 1)] ?? spec.alvo;
  const tutorial = useMemo(() => casasDoTutorial(mostrar), [mostrar]);
  const destacados = useMemo(() => [
    ...(spec.mostrarInicio ? [spec.inicio] : []),
    ...reveladas,
    ...tutorial,
  ], [reveladas, spec.inicio, spec.mostrarInicio, tutorial]);

  const percursoDesenhado = useMemo(() => {
    if (spec.modo === "lacunas") return [];
    return [
      ...(spec.mostrarInicio ? [spec.inicio] : []),
      ...reveladas.filter(n => spec.caminho.includes(n)),
    ];
  }, [reveladas, spec.caminho, spec.inicio, spec.modo, spec.mostrarInicio]);

  const linhaDoTutorial = useMemo(() => {
    const ligacao = mostrar?.ligarCasas;
    return Array.isArray(ligacao)
      ? ligacao.filter((valor): valor is number => typeof valor === "number" && valor >= 1 && valor <= 100)
      : [];
  }, [mostrar]);

  const pontos = (numeros: number[]) => numeros
    .map(centroDaCasa)
    .map(p => `${p.x},${p.y}`)
    .join(" ");

  const registrarResposta = (valor: number, completo: boolean, proximosToques: number[], proximasRevisoes: number) => {
    const acao: AcaoQuadrado100 = {
      modo: spec.modo,
      inicio: spec.inicio,
      caminho: [...spec.caminho],
      toques: proximosToques,
      esperado,
      ultimoToque: valor,
      acertosParciais: completo ? spec.caminho.length : indice,
      revisoes: proximasRevisoes,
      completo,
    };
    onAnswer(valor, acao);
  };

  const tocar = (n: number) => {
    if (disabled || reveladas.includes(n)) return;
    const proximosToques = [...toques, n];
    setToques(proximosToques);

    if (n !== esperado) {
      const proximasRevisoes = revisoes + 1;
      setRevisoes(proximasRevisoes);
      setErrada(n);
      setMensagem("Procure o padrão do quadro e tente outra vez.");
      falar?.(
        spec.modo === "vertical" || (spec.modo === "vizinho" && Math.abs(spec.passo) === 10)
          ? "Dez casas para cima ou para baixo ficam na mesma coluna."
          : "Olhe as casas vizinhas e tente outra vez.",
      );
      registrarResposta(n, false, proximosToques, proximasRevisoes);
      const timer = window.setTimeout(() => setErrada(null), 650);
      timers.current.push(timer);
      return;
    }

    const proximasReveladas = [...reveladas, n];
    setReveladas(proximasReveladas);
    setMensagem(`${n}. Muito bem.`);
    falar?.(String(n));

    const completo = indice >= spec.caminho.length - 1;
    if (!completo) {
      setIndice(indice + 1);
      return;
    }

    setMensagem("Percurso completo!");
    const timer = window.setTimeout(
      () => registrarResposta(n, true, proximosToques, revisoes),
      450,
    );
    timers.current.push(timer);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-1 sm:px-2" data-testid="quadrado100-f36">
      <div className="min-h-8 mb-2 text-center font-black text-slate-700" aria-live="polite">
        {spec.modo === "lacunas" && !disabled
          ? `Encontre a casa do número ${esperado}.`
          : mensagem || "Toque na próxima casa do caminho."}
      </div>

      <div className="relative max-w-lg mx-auto">
        <Quadrado100
          highlightedNumbers={destacados}
          hiddenNumbers={spec.casasOcultas}
          revealedNumbers={reveladas}
          incorrectNumber={errada}
          interactive={!disabled}
          trackSelection={false}
          onNumberClick={tocar}
        />

        {(percursoDesenhado.length > 1 || linhaDoTutorial.length > 1) && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none text-indigo-500/70"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {percursoDesenhado.length > 1 && (
              <polyline
                points={pontos(percursoDesenhado)}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            )}
            {linhaDoTutorial.length > 1 && (
              <polyline
                points={pontos(linhaDoTutorial)}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeDasharray="2 2"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
        )}
      </div>
    </div>
  );
}
