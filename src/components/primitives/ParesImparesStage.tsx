import React, { useMemo, useState } from "react";
import type { AnswerMeta } from "../../types";
import type { ParesImparesF38Spec, ParesImparesOpcao } from "../../curriculum/procedimentos/paresImparesContract";
import { tokens } from "../../styles/tokens";
import { DragGroup } from "./DragGroup";

interface Props {
  spec: ParesImparesF38Spec;
  disabled?: boolean;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

export function ParesImparesStage({ spec, disabled = false, onAnswer }: Props) {
  const totalDuplas = Math.floor(spec.quantidade / 2);
  const [progresso, setProgresso] = useState({ itensRestantes: spec.quantidade, duplas: 0 });
  const pronto = !spec.formarDuplas || progresso.duplas >= totalDuplas;
  const ultimo = spec.quantidade % 10;
  const paresVisuais = useMemo(() => Array.from({ length: Math.floor(spec.quantidade / 2) }, (_, i) => i), [spec.quantidade]);

  const responder = (option: ParesImparesOpcao) => {
    if (disabled || !pronto) return;
    onAnswer(option.value, option.misconception ? { misconception: option.misconception } : undefined);
  };

  return (
    <section className="w-full flex flex-col items-center gap-5" data-f38-stage={spec.etapa}>
      <div
        className="w-full rounded-2xl p-4 text-center"
        style={{ backgroundColor: tokens.cor.superficie.destaque, color: tokens.cor.texto.principal, border: `2px solid ${tokens.cor.elementos.borda}` }}
      >
        <div className="text-sm font-bold" style={{ color: tokens.cor.texto.secundario }}>DragGroup · modo duplas</div>
        {spec.etapa === "regra-soma" && spec.soma ? (
          <div className="text-4xl font-black mt-2" aria-label={`${spec.soma.a} mais ${spec.soma.b}`}>{spec.soma.a} + {spec.soma.b}</div>
        ) : (
          <div className="text-5xl font-black mt-2" aria-label={`${spec.quantidade} objetos`}>{spec.quantidade}</div>
        )}
        {spec.regraUltimoAlgarismo && (
          <div className="mt-2 font-bold">Último algarismo: <span className="text-2xl">{ultimo}</span></div>
        )}
      </div>

      {spec.formarDuplas ? (
        <div className="w-full">
          <DragGroup
            sourceCount={spec.quantidade}
            destCount={Math.max(1, totalDuplas)}
            sourceEmoji="●"
            boxCapacity={2}
            disabled={disabled}
            onProgress={({ itemsLeft, boxes }) => setProgresso({ itensRestantes: itemsLeft, duplas: boxes.filter(v => v === 2).length })}
          />
          <div
            className="mt-3 w-full rounded-xl p-3 text-center font-bold"
            style={{ backgroundColor: tokens.cor.superficie.cartao, color: tokens.cor.texto.principal, border: `2px solid ${tokens.cor.elementos.borda}` }}
            aria-live="polite"
          >
            Duplas: {progresso.duplas} · Restam: {progresso.itensRestantes}
          </div>
        </div>
      ) : spec.etapa === "decidir-visual" ? (
        <div className="w-full flex flex-col items-center gap-3">
          {spec.quantidade === 0 ? (
            <div
              className="w-full rounded-xl p-5 text-center font-bold"
              style={{ backgroundColor: tokens.cor.superficie.cartao, color: tokens.cor.texto.principal, border: `2px dashed ${tokens.cor.elementos.borda}` }}
            >
              Nenhum objeto: 0 duplas completas e 0 sobrando.
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {paresVisuais.map(i => (
                <div key={i} className="flex gap-1 rounded-lg p-2" style={{ backgroundColor: tokens.cor.elementos.preenchimento }}><span>●</span><span>●</span></div>
              ))}
            </div>
          )}
        </div>
      ) : spec.etapa === "regra-soma" && spec.soma ? (
        <div className="w-full rounded-xl p-4 text-center" style={{ backgroundColor: tokens.cor.superficie.cartao, color: tokens.cor.texto.principal }}>
          Pense na paridade de cada parcela e confirme no total: {spec.quantidade}.
        </div>
      ) : (
        <div className="w-full rounded-xl p-4 text-center" style={{ backgroundColor: tokens.cor.superficie.cartao, color: tokens.cor.texto.principal }}>
          A regra do último algarismo é um atalho para a mesma pergunta: dá para formar duplas sem sobrar?
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 w-full" aria-label="Escolha par ou ímpar">
        {spec.opcoes.map(option => (
          <button
            key={option.value}
            type="button"
            disabled={disabled || !pronto}
            onClick={() => responder(option)}
            className="rounded-xl font-black text-lg px-4 py-3 disabled:opacity-50"
            style={{
              minHeight: tokens.tamanho.alvo,
              backgroundColor: tokens.cor.acao.primaria,
              color: tokens.cor.texto.inverso,
              border: `2px solid ${tokens.cor.elementos.borda}`,
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
