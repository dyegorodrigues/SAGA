import React from "react";
import { AnswerMeta } from "../../types";
import { ItemRegua, ReguaSpec } from "../../curriculum/procedimentos/reguaContract";
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

function tipoDoItem(item: ItemRegua): string {
  return item.id.replace(/-(?:a|b)$/, "");
}

/**
 * O comprimento visual É o comprimento matemático. Não existe mais uma cápsula
 * genérica contendo um emoji: cada objeto ocupa a largura que a criança mede.
 */
function ObjetoVisual({ item }: { item: ItemRegua }) {
  const tipo = tipoDoItem(item);
  return (
    <div
      className="relative h-10 w-full"
      data-regua-measure-object
      data-regua-object-kind={tipo}
      role="img"
      aria-label={item.nome}
    >
      {tipo === "lapis" && (
        <>
          <span aria-hidden className="absolute left-0 right-3 top-3 h-4 rounded-l-sm border border-amber-700 bg-yellow-300 shadow-sm" />
          <span aria-hidden className="absolute left-0 top-3 h-4 w-3 rounded-l-sm border-r border-rose-700 bg-rose-400" />
          <span aria-hidden className="absolute right-0 top-3 h-4 w-4 bg-amber-200" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />
          <span aria-hidden className="absolute right-0 top-[17px] h-2 w-2 bg-slate-700" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />
        </>
      )}
      {tipo === "borracha" && (
        <>
          <span aria-hidden className="absolute inset-x-0 top-2 h-7 rounded-md border-2 border-rose-500 bg-gradient-to-r from-rose-300 via-rose-200 to-sky-200 shadow-sm" />
          <span aria-hidden className="absolute left-[42%] top-2 h-7 w-2 -skew-x-12 bg-white/85" />
        </>
      )}
      {tipo === "carrinho" && (
        <>
          <span aria-hidden className="absolute bottom-2 left-1 right-1 h-5 rounded-[9px_12px_6px_6px] border-2 border-red-700 bg-red-500 shadow-sm" />
          <span aria-hidden className="absolute bottom-6 left-[24%] h-4 w-[42%] rounded-t-xl border-2 border-b-0 border-red-700 bg-red-400" />
          <span aria-hidden className="absolute bottom-[2px] left-[16%] h-3 w-3 rounded-full border-2 border-slate-700 bg-slate-900" />
          <span aria-hidden className="absolute bottom-[2px] right-[16%] h-3 w-3 rounded-full border-2 border-slate-700 bg-slate-900" />
          <span aria-hidden className="absolute bottom-[26px] left-[33%] h-2 w-[22%] rounded-sm bg-sky-100/90" />
        </>
      )}
      {tipo === "livro" && (
        <>
          <span aria-hidden className="absolute inset-x-0 top-1 h-8 rounded-sm border-2 border-red-800 bg-red-600 shadow-sm" />
          <span aria-hidden className="absolute bottom-2 left-2 right-1 h-[2px] bg-amber-100" />
          <span aria-hidden className="absolute bottom-1 left-1 top-2 w-2 rounded-sm bg-red-800/80" />
        </>
      )}
      {tipo === "pincel" && (
        <>
          <span aria-hidden className="absolute left-0 right-8 top-[17px] h-2 rounded-full border border-amber-800 bg-amber-500 shadow-sm" />
          <span aria-hidden className="absolute right-7 top-[13px] h-4 w-5 rounded-sm border border-slate-500 bg-slate-300" />
          <span aria-hidden className="absolute right-0 top-[10px] h-6 w-8 bg-sky-500" style={{ clipPath: "polygon(0 18%, 100% 0, 100% 100%, 0 82%)" }} />
        </>
      )}
    </div>
  );
}

function ObjetoMedido({ spec, comprimento }: { spec: ReguaSpec; comprimento: number }) {
  const item = spec.itens[0];
  return (
    <div
      className="absolute top-3"
      style={{ left: OBJECT_LEFT, width: Math.max(66, comprimento * UNIT_PX) }}
      data-regua-object
      data-regua-object-left={OBJECT_LEFT}
      data-regua-object-length={comprimento}
    >
      <ObjetoVisual item={item} />
    </div>
  );
}

/**
 * PalcoEscalado usa transform:scale. PointerEvent chega em px renderizados,
 * enquanto `left`/UNIT_PX estão no plano lógico. Converter pela escala real do
 * elemento evita que o drag alinhe em 390px e erre sistematicamente em 320px.
 */
function deltaLogico(e: React.PointerEvent<HTMLDivElement>, xInicial: number): number {
  const natural = e.currentTarget.offsetWidth;
  const renderizado = e.currentTarget.getBoundingClientRect().width;
  const escala = natural > 0 && renderizado > 0 ? renderizado / natural : 1;
  return (e.clientX - xInicial) / escala;
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
    if (typeof e.currentTarget.setPointerCapture === "function") {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  }

  function pointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const atual = drag.current;
    if (!atual || atual.pointerId !== e.pointerId || !podeManipular) return;
    const proximo = atual.left + deltaLogico(e, atual.x);
    setRulerLeft(Math.max(OBJECT_LEFT - spec.escalaMax * UNIT_PX, Math.min(OBJECT_LEFT + 2 * UNIT_PX, proximo)));
  }

  function pointerEnd(e: React.PointerEvent<HTMLDivElement>) {
    const atual = drag.current;
    if (!atual || atual.pointerId !== e.pointerId) return;
    const finalLeft = atual.left + deltaLogico(e, atual.x);
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
    const larguraObjeto = Math.max(104, quantidade * 34);
    return (
      <PalcoEscalado>
        <div className="flex w-[330px] max-w-full flex-col items-center gap-4" data-regua-stage data-regua-mode="informal">
          <div className="text-sm font-black text-slate-700">{spec.itens[0].nome}</div>
          <div style={{ width: larguraObjeto }} className="max-w-[280px]">
            <ObjetoVisual item={spec.itens[0]} />
          </div>
          <div role="img" className={`flex items-center justify-center gap-0.5 rounded-xl border border-slate-200 bg-white px-2 py-1 shadow-sm ${mostrar?.destacarClipes ? "ring-4 ring-blue-300" : ""}`} data-regua-clipes aria-label={`${quantidade} clipes iguais`}>
            {Array.from({ length: quantidade }, (_, i) => (
              <span key={i} aria-hidden className="inline-flex h-8 w-7 items-center justify-center text-2xl leading-none">📎</span>
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
          {spec.itens.map((item, index) => {
            const medido = medidos.includes(item.id);
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                data-regua-compare-item={item.id}
                data-regua-compare-length={item.comprimentoCm}
                data-regua-compare-kind={tipoDoItem(item)}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-black text-slate-800">Objeto {index + 1} · {item.nome}</span>
                  {medido && <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-black text-blue-700">{item.comprimentoCm} cm</span>}
                </div>
                <div className="relative h-[112px] overflow-visible pb-1" data-regua-compare-plane>
                  <div
                    className="absolute left-0 top-0"
                    style={{ width: Math.max(66, item.comprimentoCm * UNIT_PX) }}
                    data-regua-compare-object
                    data-regua-object-kind={tipoDoItem(item)}
                  >
                    <ObjetoVisual item={item} />
                  </div>
                  <div className="absolute left-0 top-[42px]">
                    <Regua max={12} destacarZero destacarMarca={medido ? item.comprimentoCm : null} />
                  </div>
                </div>
                <button
                  type="button"
                  className={`${botaoClasse(medido)} mt-2 w-full`}
                  aria-label={medido ? `${item.nome} mede ${item.comprimentoCm} centímetros` : `Medir ${item.nome}`}
                  disabled={disabled || medido}
                  onClick={() => setMedidos(prev => [...new Set([...prev, item.id])])}
                >
                  {medido ? "Medido" : "Medir"}
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
                  {item.nome}
                </button>
              ))}
            </div>
          )}
        </div>
      </PalcoEscalado>
    );
  }

  if (spec.modo === "estimar" && estimativa === null) {
    const larguraEstimativa = Math.max(110, Math.min(260, (spec.valorCerto ?? 6) * 20));
    return (
      <PalcoEscalado>
        <div className="flex w-[330px] max-w-full flex-col items-center gap-4" data-regua-stage data-regua-mode="estimar" data-regua-estimate-phase>
          <div className="text-sm font-black text-slate-700">{spec.itens[0].nome}</div>
          <div style={{ width: larguraEstimativa }} className="max-w-[270px]">
            <ObjetoVisual item={spec.itens[0]} />
          </div>
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
        <div className="flex w-[344px] max-w-full items-center justify-between px-1 text-sm">
          <span className="font-black text-slate-800">{spec.itens[0].nome}</span>
          <span className="text-xs font-bold text-slate-500">meça da ponta até a ponta</span>
        </div>
        <div className="relative h-[150px] w-[344px] max-w-full overflow-visible rounded-2xl border border-slate-200 bg-white shadow-inner" data-regua-plane>
          <ObjetoMedido spec={spec} comprimento={comprimento} />
          <div
            className={`absolute top-[67px] touch-none ${podeManipular ? "cursor-grab active:cursor-grabbing" : ""}`}
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
