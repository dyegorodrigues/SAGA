import React from "react";
import { Question } from "../../types";
import { LegacyExercise } from "./LegacyExercise";
import { RapidFire } from "./RapidFire";
import { SingaporeBars } from "./SingaporeBars";

interface Props {
  q: Question;
  status: "right" | "wrong" | null;
  onAnswer: (val: any) => void;
  // Legacy props pass-through
  guidedIdx?: number | null;
  playAulinha?: () => void;
  handlePick?: (i: number) => void;
  pickedId?: number | null;
}

export function ExerciseRenderer({ 
  q, 
  status, 
  onAnswer, 
  guidedIdx, 
  playAulinha, 
  handlePick, 
  pickedId 
}: Props) {
  
  const disabled = status !== null;

  if (q.kind === "rapid-fire") {
    return <RapidFire q={q} onAnswer={onAnswer} disabled={disabled} />;
  }
  
  if (q.kind === "singapore-bars") {
    return <SingaporeBars q={q} onAnswer={onAnswer} disabled={disabled} />;
  }

  // Fallback to legacy
  return (
    <LegacyExercise 
      q={q} 
      status={status} 
      guidedIdx={guidedIdx} 
      playAulinha={playAulinha}
      handlePick={handlePick}
      pickedId={pickedId}
    />
  );
}
