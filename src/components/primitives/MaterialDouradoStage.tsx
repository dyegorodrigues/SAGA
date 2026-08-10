import React from "react";
import { motion } from "motion/react";
import { MaterialDouradoSpec } from "../../curriculum/procedimentos/materialDouradoContract";
import { AcaoMaterialDourado } from "../../curriculum/procedimentos/materialDouradoProcedure";
import { MaterialDourado, MaterialTenBar, MaterialUnitCube } from "./MaterialDourado";
import { TenFrame } from "./TenFrame";
import { PalcoEscalado } from "./PalcoEscalado";

interface MostrarMaterialDourado {
  pulsarMoldura?: boolean;
  preencherAte?: number;
  fundirEmBarra?: boolean;
  destacarBarra?: boolean;
}

interface Props {
  spec: MaterialDouradoSpec;
  onAnswer?: (valor: number, acao: AcaoMaterialDourado) => void;
  disabled?: boolean;
  falar?: (texto: string) => void;
  mostrar?: MostrarMaterialDourado | null;
}

/**
 * F21/N2.01 — o sistema decimal precisa ACONTECER na tela.
 *
 * L1/L2: cada cubinho é movido para a zona de troca; somente o décimo fecha o
 * grupo e cria uma barra. L3 mantém a ação, mas retira a TenFrame. L4 inverte
 * a direção (numeral → material). L5 retira o material e pede decomposição D/U.
 */
export function MaterialDouradoStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [soltas, setSoltas] = React.useState(spec.total);
  const [naTroca, setNaTroca] = React.useState(0);
  const [dezenasFormadas, setDezenasFormadas] = React.useState(0);
  const [contouUmAUm, setContouUmAUm] = React.useState(false);
  const [dezenasProduzidas, setDezenasProduzidas] = React.useState(0);
  const [unidadesProduzidas, setUnidadesProduzidas] = React.useState(0);

  React.useEffect(() => {
    setSoltas(spec.total);
    setNaTroca(0);
    setDezenasFormadas(0);
    setContouUmAUm(false);
    setDezenasProduzidas(0);
    setUnidadesProduzidas(0);
  }, [spec]);

  const emAula = Boolean(mostrar && Object.keys(mostrar).length);
  const travado = Boolean(disabled) || emAula;
  const agrupando = spec.modo === "agrupar";
  const montando = spec.modo === "montar";
  const decompondo = spec.modo === "decompor";
  const agrupamentoConcluido = agrupando
    && dezenasFormadas === spec.dezenas
    && naTroca === 0
    && soltas === spec.unidades;

  function moverUmaParaTroca() {
    if (travado || !agrupando || soltas <= spec.unidades || dezenasFormadas >= spec.dezenas) return;
    const proxima = naTroca + 1;
    setSoltas(v => Math.max(0, v - 1));

    if (proxima === 10) {
      setNaTroca(0);
      setDezenasFormadas(v => v + 1);
      falar?.("Dez! Viraram uma barra! Isso é uma dezena.");
    } else {
      setNaTroca(proxima);
    }
  }

  function responderAgrupamento(valor: number) {
    if (travado || !agrupamentoConcluido) return;
    onAnswer?.(valor, {
      modo: "agrupar",
      resposta: valor,
      dezenasProduzidas: dezenasFormadas,
      unidadesProduzidas: soltas,
      contouUmAUm,
      trocasConcluidas: dezenasFormadas,
    });
  }

  function responderComposicao(modo: "montar" | "decompor") {
    if (travado) return;
    const valor = dezenasProduzidas * 10 + unidadesProduzidas;
    onAnswer?.(valor, {
      modo,
      resposta: valor,
      dezenasProduzidas,
      unidadesProduzidas,
      contouUmAUm: false,
      trocasConcluidas: 0,
    });
  }

  const tutorialPreenche = Math.max(0, Math.min(10, Math.round(mostrar?.preencherAte ?? 0)));

  return (
    <PalcoEscalado>
      <div
        className="flex w-full max-w-[340px] flex-col items-center gap-3 select-none"
        data-material-dourado-stage
        data-material-modo={spec.modo}
      >
        {emAula && (
          <div className="w-full rounded-2xl border-2 border-indigo-200 bg-indigo-50/70 p-3" aria-label="Demonstração da dezena">
            {(mostrar?.pulsarMoldura || tutorialPreenche > 0) && (
              <motion.div
                data-material-tenframe
                animate={mostrar?.pulsarMoldura ? { scale: [1, 1.035, 1] } : { scale: 1 }}
                transition={{ repeat: mostrar?.pulsarMoldura ? Infinity : 0, duration: 1.1 }}
              >
                <TenFrame moldura={{ casas: 10, ocupadas: Array.from({ length: tutorialPreenche }, (_, i) => i), emoji: "🟨" }} />
                <div className="sr-only" aria-hidden>
                  {Array.from({ length: tutorialPreenche }, (_, i) => <span key={i} data-tutorial-frame-filled />)}
                </div>
              </motion.div>
            )}
            {(mostrar?.fundirEmBarra || mostrar?.destacarBarra) && (
              <motion.div
                data-material-dezena-fundida
                className="mt-2 flex justify-center rounded-xl p-2"
                animate={mostrar?.destacarBarra ? { scale: [1, 1.08, 1], filter: ["brightness(1)", "brightness(1.18)", "brightness(1)"] } : { scale: 1 }}
              >
                <MaterialTenBar />
              </motion.div>
            )}
          </div>
        )}

        {agrupando && (
          <>
            <div
              className="flex w-full flex-wrap justify-center gap-2 rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/60 p-3"
              aria-label={`${soltas} cubinhos soltos`}
            >
              {Array.from({ length: soltas }, (_, i) => (
                <button
                  type="button"
                  key={`solta-${i}`}
                  data-material-unidade-solta
                  draggable={!travado && soltas > spec.unidades}
                  aria-label={`mover cubinho ${i + 1} para o grupo de dez`}
                  disabled={travado || soltas <= spec.unidades}
                  onClick={moverUmaParaTroca}
                  onDragStart={event => {
                    if (travado || soltas <= spec.unidades) return;
                    event.dataTransfer?.setData("text/plain", "material-unit");
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-white shadow-sm disabled:cursor-default disabled:opacity-75"
                >
                  <MaterialUnitCube />
                </button>
              ))}
            </div>

            <motion.div
              data-material-alvo-troca
              className={`w-full min-h-24 rounded-2xl border-2 border-dashed p-3 text-center ${spec.usarMoldura ? "border-blue-300 bg-blue-50/60" : "border-indigo-300 bg-indigo-50/40"}`}
              onDragOver={event => event.preventDefault()}
              onDrop={event => {
                event.preventDefault();
                moverUmaParaTroca();
              }}
              animate={mostrar?.pulsarMoldura ? { scale: [1, 1.025, 1] } : { scale: 1 }}
            >
              <div className="mb-1 text-xs font-black uppercase tracking-wide text-blue-800">
                {spec.usarMoldura ? "Junte 10 na moldura" : "Forme um grupo de 10"}
              </div>
              {spec.usarMoldura ? (
                <div data-material-tenframe>
                  <TenFrame moldura={{ casas: 10, ocupadas: Array.from({ length: naTroca }, (_, i) => i), emoji: "🟨" }} />
                </div>
              ) : (
                <div
                  role="img"
                  className="mx-auto grid w-fit grid-cols-5 gap-1 rounded-xl bg-white p-2"
                  aria-label={`${naTroca} de 10 no grupo`}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <span key={i} aria-hidden className={`h-5 w-5 rounded-sm border ${i < naTroca ? "border-amber-600 bg-amber-400" : "border-slate-300 bg-slate-100"}`} />
                  ))}
                </div>
              )}
              <div className="mt-1 text-xs font-bold text-slate-600">{naTroca}/10</div>
            </motion.div>

            {dezenasFormadas > 0 && (
              <div className="w-full rounded-2xl border border-amber-200 bg-white p-3">
                <div className="mb-2 text-center text-xs font-black uppercase tracking-wide text-amber-900">Dezenas formadas</div>
                <div className="flex flex-wrap items-end justify-center gap-2">
                  {Array.from({ length: dezenasFormadas }, (_, i) => (
                    <motion.div
                      key={`barra-${i}`}
                      data-material-dezena-fundida
                      initial={{ opacity: 0, scale: 0.7, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                    >
                      <MaterialTenBar tenIndex={i} onInspect={() => setContouUmAUm(true)} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {dezenasFormadas > 0 && (
              <motion.div
                data-material-equivalencia
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-950"
              >
                {spec.equivalencia}
              </motion.div>
            )}

            {agrupamentoConcluido && (
              <div className="grid w-full grid-cols-2 gap-2" aria-label="Escolha o número representado">
                {spec.alternativas.map(valor => (
                  <button
                    type="button"
                    key={valor}
                    data-material-resposta
                    data-material-resposta-errada={valor !== spec.total || undefined}
                    disabled={travado}
                    onClick={() => responderAgrupamento(valor)}
                    className="min-h-12 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-lg font-black text-slate-800 shadow-sm active:translate-y-0.5 disabled:cursor-default"
                  >
                    {valor}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {montando && (
          <>
            <div className="rounded-2xl bg-indigo-50 px-5 py-3 text-center">
              <div className="text-xs font-black uppercase tracking-wide text-indigo-700">Monte este número</div>
              <div className="text-4xl font-black text-indigo-950">{spec.alvoNumeral}</div>
            </div>
            <div data-material-dourado-visual className="w-full">
              <MaterialDourado dezenas={dezenasProduzidas} unidades={unidadesProduzidas} />
            </div>
            <ControlesDU
              dezenas={dezenasProduzidas}
              unidades={unidadesProduzidas}
              setDezenas={setDezenasProduzidas}
              setUnidades={setUnidadesProduzidas}
              disabled={travado}
              prefixo="material"
            />
            <button
              type="button"
              data-material-pronto
              disabled={travado}
              onClick={() => responderComposicao("montar")}
              className="min-h-12 rounded-full bg-indigo-600 px-6 py-3 text-sm font-black text-white shadow-md active:translate-y-0.5 disabled:opacity-50"
            >
              Pronto
            </button>
          </>
        )}

        {decompondo && (
          <>
            <div className="w-full rounded-2xl bg-slate-50 px-5 py-4 text-center">
              <div className="text-4xl font-black text-slate-950">{spec.total}</div>
              <div className="mt-1 text-sm font-bold text-slate-600">quantas dezenas + quantas unidades?</div>
            </div>
            <ControlesDU
              dezenas={dezenasProduzidas}
              unidades={unidadesProduzidas}
              setDezenas={setDezenasProduzidas}
              setUnidades={setUnidadesProduzidas}
              disabled={travado}
              prefixo="decompor"
              semMaterial
            />
            <button
              type="button"
              data-decompor-pronto
              disabled={travado}
              onClick={() => responderComposicao("decompor")}
              className="min-h-12 rounded-full bg-slate-800 px-6 py-3 text-sm font-black text-white shadow-md active:translate-y-0.5 disabled:opacity-50"
            >
              Pronto
            </button>
          </>
        )}
      </div>
    </PalcoEscalado>
  );
}

function ControlesDU({
  dezenas,
  unidades,
  setDezenas,
  setUnidades,
  disabled,
  prefixo,
  semMaterial = false,
}: {
  dezenas: number;
  unidades: number;
  setDezenas: React.Dispatch<React.SetStateAction<number>>;
  setUnidades: React.Dispatch<React.SetStateAction<number>>;
  disabled: boolean;
  prefixo: "material" | "decompor";
  semMaterial?: boolean;
}) {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-center">
        <div className="mb-2 text-xs font-black uppercase text-amber-900">Dezenas</div>
        {!semMaterial && <div className="mb-2 flex min-h-12 items-center justify-center">{dezenas > 0 ? <MaterialTenBar /> : <span className="text-slate-400">0</span>}</div>}
        <div className="flex justify-center gap-2">
          <button type="button" aria-label="tirar uma dezena" disabled={disabled || dezenas === 0} onClick={() => setDezenas(v => Math.max(0, v - 1))} className="h-10 w-10 rounded-full bg-white font-black shadow disabled:opacity-40">−</button>
          <span className="flex min-w-8 items-center justify-center font-black">{dezenas}</span>
          <button
            type="button"
            data-material-add-dezena={prefixo === "material" || undefined}
            data-decompor-add-dezena={prefixo === "decompor" || undefined}
            aria-label="adicionar uma dezena"
            disabled={disabled || dezenas >= 9}
            onClick={() => setDezenas(v => Math.min(9, v + 1))}
            className="h-10 w-10 rounded-full bg-white font-black shadow disabled:opacity-40"
          >+</button>
        </div>
      </div>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-center">
        <div className="mb-2 text-xs font-black uppercase text-amber-900">Unidades</div>
        {!semMaterial && <div className="mb-2 flex min-h-12 items-center justify-center">{unidades > 0 ? <MaterialUnitCube /> : <span className="text-slate-400">0</span>}</div>}
        <div className="flex justify-center gap-2">
          <button type="button" aria-label="tirar uma unidade" disabled={disabled || unidades === 0} onClick={() => setUnidades(v => Math.max(0, v - 1))} className="h-10 w-10 rounded-full bg-white font-black shadow disabled:opacity-40">−</button>
          <span className="flex min-w-8 items-center justify-center font-black">{unidades}</span>
          <button
            type="button"
            data-material-add-unidade={prefixo === "material" || undefined}
            data-decompor-add-unidade={prefixo === "decompor" || undefined}
            aria-label="adicionar uma unidade"
            disabled={disabled || unidades >= 9}
            onClick={() => setUnidades(v => Math.min(9, v + 1))}
            className="h-10 w-10 rounded-full bg-white font-black shadow disabled:opacity-40"
          >+</button>
        </div>
      </div>
    </div>
  );
}
