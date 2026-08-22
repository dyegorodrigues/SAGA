import React from "react";
import type { AnswerMeta, Option } from "../../types";
import { Grupo } from "../../components/primitives/Grupo";
import type { EqualGroupsF97Spec } from "./equalGroupsContract";
import { EqualGroupsEvidence } from "./equalGroupsSemantics";

interface Props {
  spec: EqualGroupsF97Spec;
  options: Option[];
  disabled?: boolean;
  onAnswer: (value: number, meta?: AnswerMeta) => void;
}

export function EqualGroupsStage({ spec, options, disabled, onAnswer }: Props): React.ReactElement {
  const groups = Array.from({ length: spec.grupos }, (_, groupIndex) => React.createElement(
    "div",
    { key: groupIndex, "data-equal-group": "", "data-items": spec.porGrupo },
    React.createElement(Grupo, {
      disabled: true,
      rotulo: `Grupo ${groupIndex + 1} com ${spec.porGrupo} itens`,
      items: Array.from({ length: spec.porGrupo }, (_, itemIndex) => React.createElement(
        "span",
        { key: itemIndex, "aria-hidden": true, className: "inline-block h-5 w-5 rounded-full bg-blue-500" },
      )),
    }),
  ));

  const notation = React.createElement(
    "div",
    { className: "mt-5 flex flex-wrap items-center justify-center gap-3 text-2xl font-black" },
    spec.mostrarSoma ? React.createElement("span", { "data-equal-groups-sum": "" }, spec.somaRepetida) : null,
    spec.mostrarSoma && spec.mostrarMultiplicacao ? React.createElement("span", { "aria-hidden": true }, "↔") : null,
    spec.mostrarMultiplicacao ? React.createElement("span", { "data-equal-groups-multiplication": "" }, spec.multiplicacao) : null,
  );

  const answerButtons = options.map((option, index) => React.createElement(
    "button",
    {
      key: `${option.value}-${index}`,
      type: "button",
      disabled,
      "data-equal-groups-option": String(option.value),
      className: "min-h-14 rounded-2xl border-2 border-slate-200 bg-white px-3 py-2 text-xl font-black text-slate-800",
      onClick: () => onAnswer(Number(option.value), {
        ...(option.misconception ? { misconception: option.misconception } : {}),
        ...(Number(option.value) === spec.total && spec.nivel >= 3
          ? { evidencias: [EqualGroupsEvidence.NOTACAO_MULTIPLICATIVA] }
          : {}),
      }),
    },
    option.label ?? String(option.value),
  ));

  return React.createElement(
    "section",
    { className: "mx-auto w-full max-w-4xl", "data-equal-groups-stage": "", "data-representation": spec.representacao },
    React.createElement("p", { className: "mb-4 text-center text-xl font-black text-slate-800", "data-equal-groups-phrase": "" }, spec.frase),
    React.createElement("div", { className: "flex flex-wrap justify-center gap-3", "data-equal-groups-visual": "" }, groups),
    notation,
    React.createElement("div", { className: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4", "data-equal-groups-options": "" }, answerButtons),
  );
}
