import React from "react";
import { motion } from "motion/react";
import { MaterialDouradoSpec } from "../../curriculum/procedimentos/materialDouradoContract";
import { AcaoMaterialDourado } from "../../curriculum/procedimentos/materialDouradoProcedure";
import { MaterialDourado, MaterialTenBar, MaterialUnitCube } from "./MaterialDourado";
import { PalcoEscalado } from "./PalcoEscalado";

interface MostrarMaterialDourado {
  destacarUnidades?: boolean;
  destacarAlvoTroca?: boolean;
  pulsarEquivalencia?: boolean;
}

interface Props {
  spec: MaterialDouradoSpec;
  onAnswer?: (valor: number, acao: AcaoMaterialDourado) => void;
  disabled?: boolean;
  falar?: (texto: string) => void;
  mostrar?: MostrarMaterialDourado | null;
}

export function MaterialDouradoStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [agrupadas, setAgrupadas] = React.useState(0);
  const [contouSubdivisoes, setContouSubdivisoes] = React.useState(false);
  const [dezenasProduzidas, setDezenasProduzidas] = React.useState(0);
  const [unidadesProduzidas, setUnidadesProduzidas] = React.useState(0);

  React.useEffect(() => {
    setAgrupadas(0);
    setContouSubdivisoes(false);
    setDezenasProduzidas(0);
    setUnidadesProduzidas(0);
  }, [spec]);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const travado = Boolean(disabled) || emAula;
  const trocaCompleta = !spec.exigeTroca || agrupadas >= 10;

  function agruparUma() {
    if (travado || !spec.exigeTroca || agrupadas >= 10) return;
    const proxima = agrupadas + 1;
    setAgrupadas(proxima);
    if (proxima === 10) falar?.("Dez unidades viraram uma dezena. Dez. Uma dezena.");
  }

  function responderLeitura(valor: number) {
    if (travado || !trocaCompleta) return;
    onAnswer?.(valor, {
      modo: "ler",
      resposta: valor,
      dezenasProduzidas: spec.dezenas,
      unidadesProduzidas: spec.unidades,
      contouSubdivisoes,
      completouTroca: trocaCompleta,
    });
  }

  function responderProducao() {
    if (travado) return;
    const valor = dezenasProduzidas * 10 + unidadesProduzidas;
    onAnswer?.(valor, {
      modo: "produzir",
      resposta: valor,
      dezenasProduzidas,
      unidadesProduzidas,
      // No modo produção as barras são átomos: a UI não oferece subdivisão
      // interativa, então 4/5 corretas realmente são sem recontar a barra.
      contouSubdivisoes: false,
      completouTroca: true,
    });
  }

  const leitura = spec.modo === "ler";

  return (
    <PalcoEscalado>
      <div className="flex w-full max-w-[340px] flex-col items-center gap-3 select-none" data-material-dourado-stage data-material-modo={spec.modo}>
        {leitura && spec.exigeTroca && !trocaCompleta && (
          <div className="flex w-full flex-col gap-3">
            <div
              className={`rounded-2xl border-2 border-dashed p-3 ${mostrar?.destacarUnidades ? "border-amber-500 bg-amber-50" : "border-slate-200 bg-slate-50"}`}
              aria-label={`${10 - agrupadas} unidades ainda soltas`}
            >
              <div className="flex flex-wrap justify-center gap-2">
                {Array.from({ length: 10 - agrupadas }, (_, i) => (
                  <button
                    type="button"
                    key={`solta-${i}`}
                    data-material-unidade-solta
                    aria-label={`agrupar cubinho ${agrupadas + 1}`}
                    disabled={travado}
                    onClick={agruparUma}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-200 bg-white shadow-sm disabled:cursor-default"
                  >
                    <MaterialUnitCube />
                  </button>
                ))}
              </div>
            </div>

            <div
              data-material-alvo-troca
              className={`min-h-24 rounded-2xl border-2 border-dashed p-3 text-center ${mostrar?.destacarAlvoTroca ? "border-blue-500 bg-blue-50" : "border-blue-200 bg-white"}`}
            >
              <div className="mb-2 text-xs font-black uppercase tracking-wide text-blue-700">Junte 10 aqui</div>
              <div className="flex flex-wrap justify-center gap-1">
                {Array.from({ length: agrupadas }, (_, i) => <MaterialUnitCube key={`alvo-${i}`} />)}
              </div>
              <div className="mt-2 text-xs font-bold text-slate-600">{agrupadas}/10</div>
            </div>
          </div>
        )}

        {leitura && trocaCompleta && (
          <>
            {spec.exigeTroca && (
              <motion.div
                data-material-equivalencia
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: mostrar?.pulsarEquivalencia ? [1, 1.06, 1] : 1 }}
                className="rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-900"
              >
                {spec.equivalencia}
              </motion.div>
            )}

            <div data-material-dezena-fundida={spec.exigeTroca || undefined} className="w-full">
              <MaterialDourado
                dezenas={spec.dezenas}
                unidades={spec.unidades}
                onTenSubunitClick={() => setContouSubdivisoes(true)}
              />
            </div>

            <div className="grid w-full grid-cols-2 gap-2" aria-label="Escolha o número representado">
              {spec.alternativas.map(valor => (
                <button
                  type="button"
                  key={valor}
                  data-material-resposta
                  data-material-resposta-errada={valor !== spec.resposta || undefined}
                  disabled={travado}
                  onClick={() => responderLeitura(valor)}
                  className="min-h-12 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-lg font-black text-slate-800 shadow-sm active:translate-y-0.5 disabled:cursor-default"
                >
                  {valor}
                </button>
              ))}
            </div>
          </>
        )}

        {!leitura && (
          <>
            <div className="rounded-2xl bg-indigo-50 px-5 py-3 text-center">
              <div className="text-xs font-black uppercase tracking-wide text-indigo-700">Monte este número</div>
              <div className="text-4xl font-black text-indigo-950">{spec.alvoNumeral}</div>
            </div>

            <MaterialDourado dezenas={dezenasProduzidas} unidades={unidadesProduzidas} />

            <div className="grid w-full grid-cols-2 gap-3">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-center">
                <div className="mb-2 text-xs font-black uppercase text-amber-900">Dezenas</div>
                <div className="mb-2 flex min-h-12 items-center justify-center">
                  {dezenasProduzidas > 0 ? <MaterialTenBar /> : <span className="text-slate-400">0</span>}
                </div>
                <div className="flex justify-center gap-2">
                  <button type="button" aria-label="tirar uma dezena" disabled={travado || dezenasProduzidas === 0} onClick={() => setDezenasProduzidas(v => Math.max(0, v - 1))} className="h-10 w-10 rounded-full bg-white font-black shadow disabled:opacity-40">−</button>
                  <span className="flex min-w-8 items-center justify-center font-black">{dezenasProduzidas}</span>
                  <button type="button" data-material-add-dezena aria-label="adicionar uma dezena" disabled={travado || dezenasProduzidas >= 9} onClick={() => setDezenasProduzidas(v => Math.min(9, v + 1))} className="h-10 w-10 rounded-full bg-white font-black shadow disabled:opacity-40">+</button>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-center">
                <div className="mb-2 text-xs font-black uppercase text-amber-900">Unidades</div>
                <div className="mb-2 flex min-h-12 items-center justify-center">
                  {unidadesProduzidas > 0 ? <MaterialUnitCube /> : <span className="text-slate-400">0</span>}
                </div>
                <div className="flex justify-center gap-2">
                  <button type="button" aria-label="tirar uma unidade" disabled={travado || unidadesProduzidas === 0} onClick={() => setUnidadesProduzidas(v => Math.max(0, v - 1))} className="h-10 w-10 rounded-full bg-white font-black shadow disabled:opacity-40">−</button>
                  <span className="flex min-w-8 items-center justify-center font-black">{unidadesProduzidas}</span>
                  <button type="button" data-material-add-unidade aria-label="adicionar uma unidade" disabled={travado || unidadesProduzidas >= 9} onClick={() => setUnidadesProduzidas(v => Math.min(9, v + 1))} className="h-10 w-10 rounded-full bg-white font-black shadow disabled:opacity-40">+</button>
                </div>
              </div>
            </div>

            <button
              type="button"
              data-material-pronto
              disabled={travado}
              onClick={responderProducao}
              className="min-h-12 rounded-full bg-indigo-600 px-6 py-3 text-sm font-black text-white shadow-md active:translate-y-0.5 disabled:opacity-50"
            >
              Pronto
            </button>
          </>
        )}
      </div>
    </PalcoEscalado>
  );
}
