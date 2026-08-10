import React from "react";
import { AnswerMeta } from "../../types";
import { ReguaSpec } from "../../curriculum/procedimentos/reguaContract";
import {
  AcaoDeRegua,
  diagnosticarRegua,
  evidenciasDaRegua,
  resolverSolturaRegua,
} from "../../curriculum/procedimentos/reguaProcedure";
import { PalcoEscalado } from "./PalcoEscalado";
import { Regua } from "./Regua";

const UNIT_PX = 22;
const OBJECT_LEFT = 24;
const TRACK_WIDTH = 344;

interface Props {
  spec: ReguaSpec;
  onAnswer?: (valor: string, meta: AnswerMeta) => void;
  disabled?: boolean;
  falar?: (texto: string) => void;
  mostrar?: {
    destacarClipes?: boolean;
    revelarRegua?: boolean;
    destacarZero?: boolean;
    piscarMarcaFinal?: boolean;
    mostrarDesalinhamento?: boolean;
    alinharRegua?: boolean;
  } | null;
}

function botaoClasse(ativo = false) {
  return `min-h-11 min-w-11 rounded-xl border-2 px-3 py-2 text-sm font-black shadow-sm focus-visible:outline-4 focus-visible:outline-blue-500 ${
    ativo ? "border-blue-500 bg-blue-100 text-blue-900" : "border-slate-200 bg-white text-slate-800"
  }`;
}

function metaDa(spec: ReguaSpec, acao: AcaoDeRegua): AnswerMeta {
  return {
    source: "medidas",
    misconception: diagnosticarRegua(acao, spec),
    evidencias: evidenciasDaRegua(acao, spec),
    manipulacao: acao.manipulacao,
  };
}

function ObjetoMedido({ spec, comprimento }: { spec: ReguaSpec; comprimento: number }) {
  const item = spec.itens[0];
  return (
    <div
      className="absolute top-2 flex h-11 items-center justify-center overflow-hidden rounded-xl border-2 border-sky-300 bg-sky-50 text-2xl shadow-sm"
      style={{ left: OBJECT_LEFT, width: Math.max(44, comprimento * UNIT_PX) }}
      data-regua-object
      data-regua-object-left={OBJECT_LEFT}
      data-regua-object-length={comprimento}
      aria-label={`${item.nome} a medir`}
    >
      <span aria-hidden>{item.emoji}</span>
      <span className="ml-1 truncate text-[11px] font-black text-sky-900">{item.nome}</span>
    </div>
  );
}

export function ReguaStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [alinhado, setAlinhado] = React.useState(spec.reguaAlinhada);
  const [alinhouManualmente, setAlinhouManualmente] = React.useState(false);
  const [rulerLeft, setRulerLeft] = React.useState(
    OBJECT_LEFT - spec.offsetInicialCm * UNIT_PX,
  );
  const [estimativa, setEstimativa] = React.useState<number | null>(null);
  const [valorSelecionado, setValorSelecionado] = React.useState<number | null>(null);
  const [medidos, setMedidos] = React.useState<string[]>([]);
  const drag = React.useRef<{ pointerId: number; x: number; left: number; t: number } | null>(null);

  React.useEffect(() => {
    setAlinhado(spec.reguaAlinhada);
    setAlinhouManualmente(false);
    setRulerLeft(OBJECT_LEFT - spec.offsetInicialCm * UNIT_PX);
    setEstimativa(null);
    setValorSelecionado(null);
    setMedidos([]);
    drag.current = null;
  }, [spec]);

  React.useEffect(() => {
    if (mostrar?.alinharRegua) {
      setRulerLeft(OBJECT_LEFT);
      setAlinhado(true);
      // Tutorial não é evidência da criança.
      setAlinhouManualmente(false);
    }
  }, [mostrar?.alinharRegua]);

  const precisaAlinhar = spec.modo === "alinhar" || spec.modo === "estimar";
  const estimativaFeita = spec.modo !== "estimar" || estimativa !== null;
  const podeManipular = precisaAlinhar && estimativaFeita && !alinhado && !disabled;

  function publicar(valor: string, acao: AcaoDeRegua) {
    onAnswer?.(valor, metaDa(spec, acao));
  }

  function alinharPorToque() {
    if (disabled || !estimativaFeita) return;
    setRulerLeft(OBJECT_LEFT);
    setAlinhado(true);
    setAlinhouManualmente(true);
    falar?.("Zero alinhado com a ponta. Agora leia onde o objeto termina.");
  }

  function pointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!podeManipular) return;
    drag.current = { pointerId: e.pointerId, x: e.clientX, left: rulerLeft, t: performance.now() };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function pointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const atual = drag.current;
    if (!atual || atual.pointerId !== e.pointerId || !podeManipular) return;
    const proximo = atual.left + (e.clientX - atual.x);
    setRulerLeft(Math.max(OBJECT_LEFT - spec.escalaMax * UNIT_PX, Math.min(OBJECT_LEFT + 2 * UNIT_PX, proximo)));
  }

  function pointerEnd(e: React.PointerEvent<HTMLDivElement>) {
    const atual = drag.current;
    if (!atual || atual.pointerId !== e.pointerId) return;
    const finalLeft = atual.left + (e.clientX - atual.x);
    const acao = resolverSolturaRegua({
      rulerLeft: finalLeft,
      objectLeft: OBJECT_LEFT,
      unitPx: UNIT_PX,
      duracaoMs: performance.now() - atual.t,
    }, spec);
    drag.current = null;

    if (acao.alinhado) {
      setRulerLeft(OBJECT_LEFT);
      setAlinhado(true);
      setAlinhouManualmente(true);
      falar?.("Zero alinhado. Agora veja a marca onde o objeto termina.");
      return;
    }

    const diagnostico = diagnosticarRegua(acao, spec);
    // Soltura sem assinatura conceitual é só gesto incompleto: não vira tentativa.
    if (!diagnostico) {
      setRulerLeft(OBJECT_LEFT - spec.offsetInicialCm * UNIT_PX);
      falar?.("Quase. Tente colocar o zero bem na ponta do objeto.");
      return;
    }

    falar?.(diagnostico === "comeca-no-um"
      ? "Olhe a primeira marca: a régua começa no zero, não no um."
      : "A ponta do objeto precisa encontrar a marca zero.");
    publicar("__alinhamento_incorreto__", {
      ...acao,
      unidadeEscolhida: "cm",
      unidadeCerta: "cm",
      alinhouManualmente: true,
    });
  }

  function responderComprimento(valor: number) {
    if (disabled) return;
    if (spec.modo === "estimar" && valor === spec.valorCerto) {
      setValorSelecionado(valor);
      return;
    }
    publicar(`${valor}:${spec.unidade}`, {
      alinhado,
      marcaAlinhada: alinhado ? 0 : spec.offsetInicialCm,
      alinhouManualmente,
      valorEscolhido: valor,
      valorCerto: spec.valorCerto,
      unidadeEscolhida: spec.unidade,
      unidadeCerta: spec.unidadeCerta ?? spec.unidade,
      estimouAntes: estimativa !== null,
      estimativa: estimativa ?? undefined,
    });
  }

  function responderUnidade(unidade: "cm" | "m") {
    if (disabled || valorSelecionado === null) return;
    publicar(`${valorSelecionado}:${unidade}`, {
      alinhado,
      marcaAlinhada: alinhado ? 0 : spec.offsetInicialCm,
      alinhouManualmente,
      valorEscolhido: valorSelecionado,
      valorCerto: spec.valorCerto,
      unidadeEscolhida: unidade,
      unidadeCerta: "cm",
      estimouAntes: estimativa !== null,
      estimativa: estimativa ?? undefined,
    });
  }

  if (spec.modo === "informal") {
    const quantidade = spec.valorCerto ?? 1;
    return (
      <PalcoEscalado>
        <div className="flex w-[330px] max-w-full flex-col items-center gap-4" data-regua-stage data-regua-mode="informal">
          <div className="flex min-h-14 items-center rounded-xl border-2 border-sky-200 bg-sky-50 px-5 text-3xl" aria-label={spec.itens[0].nome}>
            {spec.itens[0].emoji}
          </div>
          <div className={`flex flex-wrap justify-center gap-1 rounded-xl p-2 ${mostrar?.destacarClipes ? "ring-4 ring-blue-300" : ""}`} data-regua-clipes>
            {Array.from({ length: quantidade }, (_, i) => (
              <span key={i} aria-hidden className="inline-flex h-9 w-5 items-center justify-center rounded-full border-2 border-slate-400 text-[10px]">↕</span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2" aria-label="Escolha quantos clipes">
            {spec.alternativas.map(valor => (
              <button key={valor} type="button" className={botaoClasse()} disabled={disabled}
                onClick={() => publicar(`${valor}:clipes`, {
                  alinhado: true,
                  marcaAlinhada: 0,
                  valorEscolhido: valor,
                  valorCerto: quantidade,
                  unidadeEscolhida: "clipes",
                  unidadeCerta: "clipes",
                })}>
                {valor}
              </button>
            ))}
          </div>
          {mostrar?.revelarRegua && <div className="scale-90"><Regua max={8} destacarZero /></div>}
        </div>
      </PalcoEscalado>
    );
  }

  if (spec.modo === "comparar") {
    return (
      <PalcoEscalado>
        <div className="flex w-[340px] max-w-full flex-col gap-3" data-regua-stage data-regua-mode="comparar">
          {spec.itens.map(item => {
            const medido = medidos.includes(item.id);
            return (
              <div key={item.id} className="rounded-2xl border-2 border-slate-200 bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl" aria-hidden>{item.emoji}</span>
                  <span className="font-black text-slate-800">{item.nome}</span>
                </div>
                <div className="overflow-hidden pb-1">
                  <Regua max={12} destacarMarca={medido ? item.comprimentoCm : null} />
                </div>
                <button
                  type="button"
                  className={`${botaoClasse(medido)} mt-2 w-full`}
                  disabled={disabled || medido}
                  onClick={() => setMedidos(prev => [...new Set([...prev, item.id])])}
                >
                  {medido ? `${item.comprimentoCm} cm` : "Medir"}
                </button>
              </div>
            );
          })}
          {medidos.length === spec.itens.length && (
            <div className="flex gap-2" aria-label="Escolha o objeto mais comprido">
              {spec.itens.map(item => (
                <button
                  key={item.id}
                  type="button"
                  className={`${botaoClasse()} flex-1`}
                  disabled={disabled}
                  onClick={() => publicar(`item:${item.id}`, {
                    alinhado: true,
                    marcaAlinhada: 0,
                    itemEscolhido: item.id,
                    itemCerto: spec.itemCerto,
                    unidadeEscolhida: "cm",
                    unidadeCerta: "cm",
                  })}
                >
                  {item.emoji} {item.nome}
                </button>
              ))}
            </div>
          )}
        </div>
      </PalcoEscalado>
    );
  }

  if (spec.modo === "estimar" && estimativa === null) {
    return (
      <PalcoEscalado>
        <div className="flex w-[330px] max-w-full flex-col items-center gap-4" data-regua-stage data-regua-mode="estimar" data-regua-estimate-phase>
          <span className="text-5xl" aria-hidden>{spec.itens[0].emoji}</span>
          <p className="text-center text-sm font-bold text-slate-700">Sem medir ainda: qual parece uma boa estimativa?</p>
          <div className="flex flex-wrap justify-center gap-2">
            {spec.estimativas?.map(valor => (
              <button key={valor} type="button" className={botaoClasse()} disabled={disabled} onClick={() => {
                setEstimativa(valor);
                falar?.("Boa estimativa. Agora use a régua para conferir.");
              }}>
                {valor} cm
              </button>
            ))}
          </div>
        </div>
      </PalcoEscalado>
    );
  }

  const comprimento = spec.valorCerto ?? spec.itens[0].comprimentoCm;
  return (
    <PalcoEscalado>
      <div
        className="flex w-[360px] max-w-full flex-col items-center gap-3 select-none"
        data-regua-stage
        data-regua-mode={spec.modo}
        data-regua-aligned={alinhado ? "true" : "false"}
      >
        <div className="relative h-[150px] w-[344px] max-w-full overflow-visible rounded-2xl bg-slate-50" data-regua-plane>
          <ObjetoMedido spec={spec} comprimento={comprimento} />
          <div
            className={`absolute top-[65px] touch-none ${podeManipular ? "cursor-grab active:cursor-grabbing" : ""}`}
            style={{ left: rulerLeft }}
            data-regua-draggable
            data-regua-zero-left={rulerLeft}
            onPointerDown={pointerDown}
            onPointerMove={pointerMove}
            onPointerUp={pointerEnd}
            onPointerCancel={() => { drag.current = null; }}
          >
            <Regua
              max={spec.escalaMax}
              destacarZero={Boolean(mostrar?.destacarZero) || alinhado}
              destacarMarca={mostrar?.piscarMarcaFinal ? comprimento : null}
            />
          </div>
        </div>

        {precisaAlinhar && !alinhado && (
          <button type="button" className={`${botaoClasse()} w-full`} disabled={disabled || !estimativaFeita} onClick={alinharPorToque} data-regua-tap-align>
            Alinhar o zero sem arrastar
          </button>
        )}

        {(!precisaAlinhar || alinhado) && valorSelecionado === null && (
          <div className="flex flex-wrap justify-center gap-2" aria-label="Leia o comprimento na régua" data-regua-answer-buttons>
            {spec.alternativas.map(valor => (
              <button key={valor} type="button" className={botaoClasse()} disabled={disabled} onClick={() => responderComprimento(valor)}>
                {valor} cm
              </button>
            ))}
          </div>
        )}

        {spec.modo === "estimar" && valorSelecionado !== null && (
          <div className="flex gap-2" aria-label="Escolha a unidade" data-regua-unit-buttons>
            {(["cm", "m"] as const).map(unidade => (
              <button key={unidade} type="button" className={botaoClasse()} disabled={disabled} onClick={() => responderUnidade(unidade)}>
                {valorSelecionado} {unidade}
              </button>
            ))}
          </div>
        )}

        {spec.modo === "estimar" && estimativa !== null && (
          <p className="text-xs font-bold text-slate-500">Sua estimativa: {estimativa} cm · agora confira.</p>
        )}
        <span className="sr-only">Área útil da régua: {TRACK_WIDTH} pixels.</span>
      </div>
    </PalcoEscalado>
  );
}
