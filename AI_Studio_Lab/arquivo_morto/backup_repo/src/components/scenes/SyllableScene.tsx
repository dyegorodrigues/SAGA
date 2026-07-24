import React, { useEffect, useState } from "react";
import { C, FONT } from "../Mascot";

/**
 * SyllableScene 🏭 — a fusão visual da sílaba (Biblioteca de Cenas Vivas).
 *
 * Kind `blend`: as duas letras deslizam uma para a outra e se fundem numa
 * bolha-mistério (❓). O RESULTADO só é revelado quando a criança responde —
 * mostrar a sílaba pronta entregaria a resposta (as opções são escritas).
 * O SOM do alvo vem da voz do enunciado (sílaba INTEIRA via TTS — nunca fonema
 * colado; ver docs/graphogame-blueprint.md §5). Reouvir = tocar no balão.
 *
 * Usos do kind (Constituição regra 2): Fábrica de Sílabas N1-3 (hoje),
 * Cola-Sílabas do Leitor Veloz e Fábrica de Palavras (blueprint §4).
 * Visual adaptado do SyllableBlender do gemini-lab (só a animação; o áudio de
 * fonemas de lá é a causa raiz dos bugs de voz e ficou de fora).
 */
export default function SyllableScene({
  c,
  v,
  syllable,
  revealed,
  right,
}: {
  c: string;
  v: string;
  syllable: string;
  revealed: boolean;
  right: boolean;
}) {
  // fases: apart (letras separadas) → merged (fundidas na bolha-mistério)
  const [merged, setMerged] = useState(false);
  useEffect(() => {
    setMerged(false);
    const t = setTimeout(() => setMerged(true), 1100);
    return () => clearTimeout(t);
  }, [c, v]);

  const letter = (txt: string, dir: 1 | -1) => (
    <span
      className="inline-flex items-center justify-center rounded-full border-4 shadow-md"
      style={{
        width: 64,
        height: 64,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 30,
        color: "#4338CA",
        background: "#E0E7FF",
        borderColor: "#818CF8",
        transition: "all .45s ease-in-out",
        transform: merged ? `translateX(${dir * 44}px) scale(.4)` : "none",
        opacity: merged ? 0 : 1,
      }}
    >
      {txt}
    </span>
  );

  return (
    <div className="flex flex-col items-center select-none py-1">
      <div className="relative flex items-center justify-center gap-6" style={{ height: 84 }}>
        {letter(c, 1)}
        <span
          className="font-black text-slate-300"
          style={{ fontSize: 28, transition: "all .3s", opacity: merged ? 0 : 1, transform: merged ? "scale(0)" : "none" }}
        >
          +
        </span>
        {letter(v, -1)}
        {/* a bolha do resultado: mistério até a resposta, sílaba revelada depois */}
        <span
          className="absolute inline-flex items-center justify-center rounded-full border-4 shadow-lg"
          style={{
            width: 74,
            height: 74,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: revealed ? 28 : 32,
            color: revealed ? (right ? "#15803D" : "#4338CA") : "#B45309",
            background: revealed ? (right ? "#DCFCE7" : "#E0E7FF") : "#FEF3C7",
            borderColor: revealed ? (right ? "#4ADE80" : "#818CF8") : "#FCD34D",
            transition: "all .35s ease-out",
            transform: merged ? "scale(1)" : "scale(0)",
            animation: merged && !revealed ? "sylPulse 1.6s ease-in-out infinite" : "none",
          }}
        >
          {revealed ? syllable : "❓"}
        </span>
      </div>
      {!revealed && (
        <div style={{ color: C.sub, fontWeight: 700, fontSize: 11, textAlign: "center", marginTop: 6 }}>
          👂 Toque no balão de fala lá em cima para ouvir de novo!
        </div>
      )}
      {revealed && right && <div className="text-2xl mt-1">✨</div>}
      <style>{`@keyframes sylPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }`}</style>
    </div>
  );
}
