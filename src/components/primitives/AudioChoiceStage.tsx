import React from "react";
import { AudioChoice } from "./AudioChoice";
import { AudioChoiceSpec } from "../../curriculum/procedimentos/audioChoiceContract";
import { FALAS, RespostaOuvida } from "../../curriculum/procedimentos/audioChoiceProcedure";

/**
 * `AudioChoiceStage` — a tela de N1.06, ficha F05.
 *
 * ---
 *
 * ### O que ela guarda, e por que
 *
 * A primitiva desenha e reporta; este palco conta as **repetições** e monta a
 * leitura que o Radar recebe. As duas coisas que só existem aqui:
 *
 * 1. **Quantas vezes ela pediu para ouvir de novo.** A §4 diz *"sem limite de
 *    repetições, sem penalidade"* — o número não pune, informa. A §9 exige
 *    *"pelo menos um acerto na primeira audição, sem repetir"*, e sem contar
 *    isso o critério de domínio não teria como existir.
 * 2. **A ordem em que a tela mostrou as alternativas.** A tag `NAO_ESCUTOU` da
 *    §6 é *"sempre a primeira opção"* — uma hipótese sobre POSIÇÃO. Sem a
 *    ordem, ela não é observável.
 *
 * ### O erro não diz "errou"
 *
 * §4, e a ficha chama isso de *"o detalhe que faz funcionar"*:
 *
 * > *"No erro, a voz **não diz 'errou'** — ela **repete o número pedido**. O
 * > feedback É a informação que faltava."*
 */

interface Props {
  spec: AudioChoiceSpec;
  onAnswer?: (valor: number, leitura: RespostaOuvida) => void;
  disabled?: boolean;
  /** A voz do app. §4: ela confirma no acerto e repete o número no erro. */
  falar?: (texto: string) => void;
  /** O passo da micro-aula, vindo do `tutShow`. §8. */
  mostrar?: {
    /** §8: "Aperte aqui pra escutar." — o botão de som pulsa. */
    pulsar?: string;
    /** §8: "TRÊS." — as ondas saem do botão. */
    ondasSonoras?: boolean;
    /** §8: "Agora ache o três." — as opções pulsam. */
    pulsarOpcoes?: boolean;
  } | null;
}

export function AudioChoiceStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [repeticoes, setRepeticoes] = React.useState(0);
  const [escolha, setEscolha] = React.useState<number | null>(null);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const acertou = escolha !== null && escolha === spec.resposta;

  function escolher(valor: number | string) {
    const n = Number(valor);
    if (disabled || escolha !== null || Number.isNaN(n)) return;
    setEscolha(n);

    // §4: no acerto a voz repete o número; no erro, TAMBÉM repete o número —
    // devagar e mais alto. Em nenhum dos dois ela diz "errou".
    falar?.(n === spec.resposta ? FALAS.acerto(spec.alvo) : FALAS.erroSuave(spec.alvo));

    onAnswer?.(n, {
      resposta: n,
      alvo: spec.alvo,
      alternativas: spec.alternativas,
      repeticoes,
    });
  }

  return (
    <div className="flex w-full flex-col items-center select-none">
      {/* §3: a tela é DELIBERADAMENTE VAZIA. Nada além do botão e dos numerais.
          Nenhum cartão, nenhuma moldura, nenhum mascote — qualquer elemento
          extra compete com a única coisa que importa, que é o som. */}
      <AudioChoice
        // A palavra, não o numeral: é ela que o `speak` recebe, e ela nunca é
        // escrita na tela. O gerador antigo imprimia "🔊 TRÊS" e a criança
        // resolvia LENDO — exatamente o que esta ficha existe para dispensar.
        audioPrompt={spec.palavra}
        options={spec.alternativas}
        onSelect={escolher}
        disabled={disabled || escolha !== null}
        velocidade={spec.velocidade}
        onRepetir={() => setRepeticoes(r => r + 1)}
        realceDaOpcao={o => {
          if (escolha === null) return null;
          if (Number(o) === spec.resposta) return "acerto";
          return Number(o) === escolha ? "erro" : null;
        }}
        pulsarBotao={emAula ? mostrar?.pulsar === "botaoSom" : escolha === null}
        pulsarOpcoes={emAula ? mostrar?.pulsarOpcoes === true : false}
        mostrarOpcoes={!emAula || mostrar?.pulsarOpcoes === true || mostrar?.pulsar === undefined}
      />

      {/* §4, fecho: "o numeral certo fica sozinho na tela, grande, enquanto a
          voz o repete — a associação som-símbolo é reforçada no fim". É o que
          fixa a ponte: ver o símbolo enquanto ouve o som. */}
      {escolha !== null && (
        <p
          className="mt-2 text-center text-5xl font-black"
          style={{ color: acertou ? "#15803D" : "#22315C" }}
          aria-live="polite"
        >
          {spec.alvo}
        </p>
      )}
    </div>
  );
}
