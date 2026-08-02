import { Question } from "../../types";

export interface VerticalStageProps {
  vTop: number;
  vBot: number;
  showPlaceValue: boolean;
  showRegroup: boolean;
  showAlgorithm: boolean;
}

export function verticalStageProps(question: Question): VerticalStageProps {
  return {
    vTop: question.vTop ?? 0,
    vBot: question.vBot ?? 0,
    showPlaceValue: false,
    showRegroup: false,
    showAlgorithm: true,
    ...(question.uiProps ?? {}),
  };
}
