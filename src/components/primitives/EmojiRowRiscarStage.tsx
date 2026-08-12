import React, { useEffect, useMemo, useState } from "react";
import { EmojiRowRiscarSpec } from "../../curriculum/procedimentos/emojiRowRiscarContract";
import { AcaoEmojiRowRiscar } from "../../curriculum/procedimentos/emojiRowRiscarProcedure";
import { EmojiRow } from "./EmojiRow";

interface Props {
  spec: EmojiRowRiscarSpec;
  disabled?: boolean;
  promptDone?: boolean;
  mostrar?: unknown;
  falar?: (texto: string) => void;
  onAnswer: (valor: number, acao: AcaoEmojiRowRiscar) => void;
}

function primeiros(qtd: number): number[] {
  return Array.from({ length: qtd }, (_, index) => index);
}

export function EmojiRowRiscarStage({
  spec,
  disabled = false,
  promptDone = true,
  mostrar,
  falar,
  onAnswer,
}: Props) {
  const inicial = useMemo(() => {
    if (spec.preRiscados) return primeiros(spec.remover);
    if (spec.maoFantasma && spec.representacao !== "simbolo") return [0];
    return [];
  }, [spec.preRiscados, spec.maoFantasma, spec.representacao, spec.remover]);
  const [riscados, setRiscados] = useState<number[]>(inicial);
  const [equacaoLiberada, setEquacaoLiberada] = useState(spec.preRiscados || spec.representacao === "simbolo");
  const [respondeuRemovido, setRespondeuRemovido] = useState(false);
  const [erroSuave, setErroSuave] = useState(false);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    setRiscados(inicial);
    setEquacaoLiberada(spec.preRiscados || spec.representacao === "simbolo");
    setRespondeuRemovido(false);
    setErroSuave(false);
    setAviso("");
  }, [inicial, spec.total, spec.remover, spec.representacao, spec.preRiscados]);

  useEffect(() => {
    if (spec.preRiscados || spec.representacao === "simbolo") return;
    if (riscados.length < spec.remover) {
      setEquacaoLiberada(false);
      return;
    }
    const timer = setTimeout(() => setEquacaoLiberada(true), 600);
    return () => clearTimeout(timer);
  }, [riscados.length, spec.preRiscados, spec.representacao, spec.remover]);

  const show = mostrar && typeof mostrar === "object" ? mostrar as Record<string, unknown> : null;
  const alfabetizando = show?.alfabetizarModo === "riscar";
  if (alfabetizando) {
    const indice = typeof show?.marcarIndice === "number" ? show.marcarIndice : 0;
    return (
      <section data-mode-literacy="riscar" aria-label="Aprender o significado do risco" className="space-y-4 rounded-3xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xl font-black text-blue-950">X = saiu</p>
        <p className="text-sm font-semibold text-blue-900">O objeto continua no mesmo lugar para mostrar de onde ele saiu.</p>
        <EmojiRow emoji={spec.emoji} n={Math.max(3, spec.total)} markedIndices={[indice]} markStyle="x" promptDone />
      </section>
    );
  }

  const demonstracaoDoTutorial = show && (
    show.destacarTodos === true
    || typeof show.riscar === "number"
    || show.pulsarRestantes === true
  );
  if (demonstracaoDoTutorial) {
    const marcados = show?.destacarTodos === true
      ? []
      : typeof show?.riscar === "number"
        ? [show.riscar]
        : inicial;
    return (
      <section data-mode-tutorial="riscar" aria-label="Demonstração de tirar riscando" className={show?.pulsarRestantes === true ? "animate-pulse" : ""}>
        <EmojiRow emoji={spec.emoji} n={spec.total} markedIndices={marcados} markStyle="x" promptDone />
      </section>
    );
  }

  const markStyle = spec.representacao === "fantasma" ? "ghost" : "x";
  const podeRiscar = spec.representacao === "x" || spec.representacao === "fantasma";
  const marcar = (index: number) => {
    if (disabled || !promptDone || !podeRiscar) return;
    if (riscados.includes(index)) return;
    if (riscados.length >= spec.remover) {
      const texto = `Só ${spec.remover}!`;
      setAviso(texto);
      falar?.(texto);
      return;
    }
    const next = [...riscados, index];
    setRiscados(next);
    setAviso(`${next.length} de ${spec.remover} saíram.`);
    falar?.(String(next.length));
  };

  const responder = (valor: number) => {
    if (disabled || !promptDone) return;
    const correta = valor === spec.restante;
    const respondeuRemovidoAgora = !correta && valor === spec.remover;
    if (respondeuRemovidoAgora) setRespondeuRemovido(true);
    if (!correta) {
      setErroSuave(true);
      setTimeout(() => setErroSuave(false), 1500);
    }
    onAnswer(valor, {
      resposta: valor,
      correta,
      riscados: riscados.length,
      precedidoPorRespondeRemovido: respondeuRemovido || respondeuRemovidoAgora,
    });
  };

  return (
    <section data-emojirow-riscar-stage data-representacao={spec.representacao} className="mx-auto w-full max-w-2xl space-y-5 text-center">
      {spec.representacao !== "simbolo" && (
        <div className={erroSuave ? "animate-pulse" : ""}>
          <EmojiRow
            emoji={spec.emoji}
            n={spec.total}
            markedIndices={riscados}
            markStyle={markStyle}
            markInteractive={podeRiscar}
            onItemMark={marcar}
            disabled={disabled}
            promptDone={promptDone}
          />
        </div>
      )}

      <div aria-live="polite" className="min-h-6 text-sm font-bold text-slate-600">{aviso}</div>

      {equacaoLiberada && (
        <div data-equacao-riscar className="space-y-4">
          <div className="text-3xl font-black text-slate-900" aria-label={`${spec.total} menos ${spec.remover} igual a interrogação`}>
            {spec.total} − {spec.remover} = ?
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6" aria-label="Teclado de resposta">
            {Array.from({ length: spec.tecladoAte + 1 }, (_, valor) => (
              <button
                key={valor}
                type="button"
                disabled={disabled || !promptDone}
                onClick={() => responder(valor)}
                aria-label={`Responder ${valor}`}
                className="min-h-14 rounded-2xl border-2 border-slate-300 bg-white text-xl font-black text-slate-900 disabled:opacity-50"
              >
                {valor}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
