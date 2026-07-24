import React, { useEffect, useRef, useState } from "react";
import { C, FONT, speak, sfx } from "../Mascot";
import PlaceScene, { Place } from "./PlaceScene";

/**
 * JourneyScene 🚀 — a VIAGEM NARRADA (kind `journey`): mostra os lugares em sequência
 * (casa → bairro → cidade → … → Terra), um por vez, com o NOME e a narração da
 * composição ("muitas casas formam um bairro"). A transição é suave: a nova cena ENTRA
 * em cena (leve zoom-in + fade — a sensação de "afastar e ver o lugar maior"), sem
 * motor de zoom complexo (decisão do Zeus). São imagens prontas + transição bonita.
 *
 * A criança comanda o ritmo (botão "Próximo →"); há também um avanço automático gentil.
 * Ao chegar no último lugar, revela a pergunta (onDone) — aí ela responde.
 */

export interface JourneyStop {
  slot: string;
  label: string;
  say: string;
}

interface Props {
  journey: JourneyStop[];
  sound: boolean;
  onDone: () => void;
}

export default function JourneyScene({ journey, sound, onDone }: Props) {
  const [step, setStep] = useState(0);
  const last = journey.length - 1;
  const timer = useRef<number | null>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const clearTimer = () => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
  };

  // A cada parada: narra e agenda o avanço automático (gentil, proporcional à fala).
  useEffect(() => {
    const stop = journey[step];
    if (sound) speak(stop.say);
    clearTimer();
    const wait = Math.min(6500, 2800 + stop.say.length * 45);
    timer.current = window.setTimeout(() => {
      if (step < last) setStep((s) => s + 1);
      else doneRef.current();
    }, wait);
    return clearTimer;
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = () => {
    try { window.speechSynthesis?.cancel(); } catch (e) {}
    clearTimer();
    if (step < last) { if (sound) sfx.tick(); setStep(step + 1); }
    else doneRef.current();
  };

  const replay = () => {
    if (sound) speak(journey[step].say);
  };

  const cur = journey[step];

  return (
    <div className="flex flex-col items-center gap-3 py-1">
      {/* a cena (entra com zoom-in suave a cada troca) */}
      <div style={{ width: 210, height: 210, position: "relative" }}>
        <div key={step} className="jr-emerge" style={{ position: "absolute", inset: 0 }}>
          <PlaceScene slot={cur.slot as Place} size={210} />
        </div>
      </div>

      {/* o NOME do lugar (pílula grande, ajuda a fixar) */}
      <div
        className="jr-emerge"
        key={`lbl-${step}`}
        style={{
          fontFamily: FONT, fontWeight: 900, fontSize: 22, color: C.ink,
          background: "#FFF7E6", border: `3px solid #FCD34D`, borderRadius: 999,
          padding: "4px 20px", boxShadow: "0 4px 0 #F0C24B",
        }}
      >
        {cur.label}
      </div>

      {/* bolinhas de progresso da viagem */}
      <div className="flex items-center gap-1.5">
        {journey.map((_, i) => (
          <span
            key={i}
            style={{
              width: i === step ? 12 : 8, height: i === step ? 12 : 8, borderRadius: 999,
              background: i <= step ? C.grape : "#E2E8F0", transition: "all .2s",
            }}
          />
        ))}
      </div>

      {/* comandos */}
      <div className="flex items-center gap-2 mt-0.5">
        <button
          onClick={replay}
          className="select-none cursor-pointer active:translate-y-0.5 transition-all"
          style={{ fontFamily: FONT, fontWeight: 800, fontSize: 13, color: C.grape, background: "#F1EDFF", border: `2px solid ${C.grape}`, borderRadius: 12, padding: "8px 14px" }}
        >
          🔊 Ouvir
        </button>
        <button
          onClick={next}
          className="select-none cursor-pointer active:translate-y-0.5 transition-all"
          style={{ fontFamily: FONT, fontWeight: 900, fontSize: 15, color: "#fff", background: C.grape, border: "none", borderRadius: 14, padding: "9px 22px", boxShadow: "0 4px 0 rgba(0,0,0,0.15)" }}
        >
          {step < last ? "Próximo →" : "Vamos lá! 👇"}
        </button>
      </div>
    </div>
  );
}
