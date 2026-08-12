import React from "react";
import { Question } from "../../types";

/**
 * A casca continua sendo a ÚNICA dona do enunciado. Algumas fichas, porém,
 * transformam uma palavra do próprio enunciado em material pedagógico — F47
 * manda a preposição aparecer enfatizada e piscar enquanto é falada.
 *
 * A decisão fica num helper da casca, não dentro do Stage: assim não surgem dois
 * prompts concorrentes e a primitiva continua desenhando apenas a interação.
 */
export function emphasisForQuestion(q: Question): string | undefined {
  const ui = q.uiProps as { referencial?: unknown; pedida?: unknown } | undefined;
  if (q.kind === "shapecanvas" && ui?.referencial && typeof ui.pedida === "string") {
    return ui.pedida;
  }
  return undefined;
}

export function QuestionPrompt({ q }: { q: Question }) {
  const emphasis = emphasisForQuestion(q);
  if (!emphasis) return <>{q.prompt}</>;

  const start = q.prompt.toLocaleLowerCase("pt-BR").indexOf(emphasis.toLocaleLowerCase("pt-BR"));
  if (start < 0) return <>{q.prompt}</>;

  const before = q.prompt.slice(0, start);
  const hit = q.prompt.slice(start, start + emphasis.length);
  const after = q.prompt.slice(start + emphasis.length);

  return (
    <>
      {before}
      <strong
        data-prompt-emphasis
        className="font-black underline decoration-4 underline-offset-4 animate-pulse"
        style={{ color: "#1D4ED8", textDecorationColor: "#60A5FA" }}
      >
        {hit}
      </strong>
      {after}
    </>
  );
}
