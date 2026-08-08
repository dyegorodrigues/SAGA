import React from "react";
import { motion } from "motion/react";
import { AnswerMeta } from "../../types";
import { MedidasSpec } from "../../curriculum/procedimentos/medidasContract";
import { AcaoDeMedida, diagnosticar, evidenciasDe } from "../../curriculum/procedimentos/medidasProcedure";
import { Balanca } from "./Balanca";
import { PalcoEscalado } from "./PalcoEscalado";
import { Recipientes } from "./Recipientes";

type Fase = "idle" | "erro" | "acerto" | "fecho";
const ERRO_MS = 2500;
const ACERTO_MS = 1800;

interface Props {
  spec: MedidasSpec;
  onAnswer?: (valor: number | string, meta: AnswerMeta) => void;
  disabled?: boolean;
  falar?: (texto: string) => void;
  mostrar?: { verificar?: boolean; destacarCerto?: boolean } | null;
}

function RotuloPeso({ emoji, escala }: { emoji: string; escala: number }) {
  return <span aria-hidden className="block leading-none" style={{ fontSize: `${Math.round(31 * escala)}px` }}>{emoji}</span>;
}

function ReferenciaDePeso({ valor }: { valor: number }) {
  const angulo = Math.max(-12, Math.min(12, (valor - 5) * 3));
  return (
    <span className="relative mt-1 block h-7 w-16" aria-hidden>
      <span className="absolute bottom-1 left-1/2 h-5 w-[3px] -translate-x-1/2 bg-slate-400" />
      <span className="absolute left-1/2 top-2 h-[3px] w-14 -translate-x-1/2 rounded bg-slate-500" style={{ transform: `translateX(-50%) rotate(${angulo}deg)` }} />
      <span className="absolute left-1 top-4 h-2 w-4 rounded-b-full border-2 border-slate-400" />
      <span className="absolute right-1 top-4 h-2 w-4 rounded-b-full border-2 border-slate-400" />
    </span>
  );
}

export function MedidasStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [fase, setFase] = React.useState<Fase>("idle");
  const [ordem, setOrdem] = React.useState<number[]>([]);
  const [verificado, setVerificado] = React.useState(spec.modo === "peso");
  const timers = React.useRef<number[]>([]);

  const limpar = React.useCallback(() => {
    timers.current.forEach(t => window.clearTimeout(t));
    timers.current = [];
  }, []);
  const agendar = React.useCallback((fn: () => void, ms: number) => {
    const t = window.setTimeout(fn, ms);
    timers.current.push(t);
  }, []);

  React.useEffect(() => {
    limpar();
    setFase("idle");
    setOrdem([]);
    setVerificado(spec.modo === "peso");
    return limpar;
  }, [spec, limpar]);

  React.useEffect(() => {
    if (mostrar?.verificar && spec.modo === "capacidade") setVerificado(true);
  }, [mostrar, spec.modo]);

  const emAula = Boolean(mostrar && Object.keys(mostrar).length);
  const travado = Boolean(disabled) || fase !== "idle" || emAula;

  function acao(escolhido: number, ordemProduzida?: number[]): AcaoDeMedida {
    return {
      modo: spec.modo,
      escolhido,
      certo: spec.resposta,
      ordemProduzida,
      ordemCerta: spec.ordemCerta,
      ordemVisual: spec.ordemVisual,
      contraintuitivo: spec.contraintuitivo,
      formatosDiferentes: spec.formatosDiferentes,
      verificou: verificado,
      maiorVisual: spec.maiorVisual,
    };
  }

  function metaDa(a: AcaoDeMedida): AnswerMeta {
    return {
      source: "medidas",
      misconception: diagnosticar(a),
      evidencias: evidenciasDe(a),
    };
  }

  function resolver(valor: number | string, certo: boolean, a: AcaoDeMedida) {
    if (!certo) {
      setFase("erro");
      if (spec.modo === "capacidade") setVerificado(true);
      falar?.(spec.modo === "peso"
        ? "O tamanho engana. Olhe qual lado da balança desceu."
        : "O formato engana. Vamos despejar no mesmo recipiente para comparar.");
      onAnswer?.(valor, metaDa(a));
      agendar(() => {
        setFase("idle");
        setOrdem([]);
        if (spec.modo === "capacidade") setVerificado(false);
      }, ERRO_MS);
      return;
    }
    setFase("acerto");
    if (spec.modo === "capacidade") setVerificado(true);
    falar?.(spec.modo === "peso" ? "Isso. A balança mostrou o mais pesado." : "Isso. No mesmo recipiente dá para ver.");
    onAnswer?.(valor, metaDa(a));
    agendar(() => setFase("fecho"), ACERTO_MS);
  }

  function escolher(i: number) {
    if (travado) return;
    if (!spec.seriacao) {
      const a = acao(i);
      resolver(i, i === spec.resposta, a);
      return;
    }
    if (ordem.includes(i)) return;
    const nova = [...ordem, i];
    setOrdem(nova);
    if (nova.length < spec.itens.length) return;
    const certo = nova.every((v, k) => v === spec.ordemCerta[k]);
    const a = acao(certo ? spec.resposta : -1, nova);
    resolver(certo ? "ordenado" : "ordem_errada", certo, a);
  }

  const destaqueCerto = fase === "acerto" || fase === "fecho" || Boolean(mostrar?.destacarCerto);

  return (
    <PalcoEscalado>
      <div className="flex w-[340px] max-w-full flex-col items-center gap-3 select-none" data-medidas-stage data-medidas-modo={spec.modo}>
        {spec.modo === "peso" && !spec.seriacao && (
          <div className="relative h-[205px] w-[300px] max-w-full overflow-visible">
            <div className="absolute left-1/2 top-0 w-[260px] -translate-x-1/2 origin-top scale-[0.82]">
              <Balanca
                leftItems={[{ id: spec.itens[0].id, weight: spec.itens[0].valor, label: <RotuloPeso emoji={spec.itens[0].emoji} escala={spec.itens[0].tamanhoVisual} /> }]}
                rightItems={[{ id: spec.itens[1].id, weight: spec.itens[1].valor, label: <RotuloPeso emoji={spec.itens[1].emoji} escala={spec.itens[1].tamanhoVisual} /> }]}
                onPanClick={side => escolher(side === "left" ? 0 : 1)}
              />
            </div>
            {destaqueCerto && (
              <motion.span
                className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-800"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              >
                {spec.itens[spec.resposta].emoji} ↓
              </motion.span>
            )}
          </div>
        )}

        {spec.modo === "peso" && spec.seriacao && (
          <div className="grid w-full grid-cols-3 gap-2" data-medidas-weight-order>
            {spec.itens.map((item, i) => {
              const posto = ordem.indexOf(i);
              return (
                <button
                  key={item.id}
                  type="button"
                  className="relative min-h-[132px] rounded-2xl border-2 border-slate-200 bg-white p-2 shadow-sm focus-visible:outline-4 focus-visible:outline-blue-500"
                  onClick={() => escolher(i)} disabled={travado || posto >= 0}
                  aria-label={`${item.nome} ${i + 1}`}
                >
                  <span aria-hidden className="block leading-none" style={{ fontSize: `${Math.round(44 * item.tamanhoVisual)}px` }}>{item.emoji}</span>
                  <ReferenciaDePeso valor={item.valor} />
                  {posto >= 0 && <span className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">{posto + 1}</span>}
                </button>
              );
            })}
          </div>
        )}

        {spec.modo === "capacidade" && (
          <Recipientes
            itens={spec.itens}
            verificado={verificado}
            disabled={travado}
            ordem={ordem}
            onChoose={escolher}
            onVerify={() => setVerificado(true)}
          />
        )}
      </div>
    </PalcoEscalado>
  );
}
