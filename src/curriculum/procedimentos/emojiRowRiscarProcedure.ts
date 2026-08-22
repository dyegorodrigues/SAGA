import { AnswerMeta } from "../../types";
import { masteryDisqualifier } from "../masterySignals";
import { diagnosticoDaRespostaRiscar, EmojiRowRiscarSpec } from "./emojiRowRiscarContract";
import { EmojiRowRiscarMisconception } from "./emojiRowRiscarSemantics";

export interface AcaoEmojiRowRiscar {
  resposta: number;
  correta: boolean;
  riscados: number;
  precedidoPorRespondeRemovido: boolean;
}

export function metaEmojiRowRiscar(
  acao: AcaoEmojiRowRiscar,
  spec: EmojiRowRiscarSpec,
): AnswerMeta {
  const misconception = diagnosticoDaRespostaRiscar(spec, acao.resposta);
  const evidencias = acao.correta && acao.precedidoPorRespondeRemovido
    ? [masteryDisqualifier(EmojiRowRiscarMisconception.RESPONDE_O_REMOVIDO)]
    : [];
  return {
    ...(misconception ? { misconception } : {}),
    ...(evidencias.length ? { evidencias } : {}),
  };
}
