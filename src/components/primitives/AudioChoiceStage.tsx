import React from "react";
import { AudioChoice } from "./AudioChoice";
import { AudioChoiceSpec } from "../../curriculum/procedimentos/audioChoiceContract";
import { FALAS } from "../../curriculum/procedimentos/audioChoiceProcedure";
import { RespostaOuvidaRuntime } from "../../curriculum/procedimentos/audioChoiceRuntime";

interface Props {
  spec: AudioChoiceSpec;
  onAnswer?: (valor: number, leitura: RespostaOuvidaRuntime) => void;
  disabled?: boolean;
  falar?: (texto: string) => void;
  /**
   * Sinal temporal para a CASCA do app. O palco não imprime enunciado: quando
   * a primeira audição termina, avisa o GameLoop, que passa a mostrar q.prompt.
   */
  onPrimeiraAudicaoConcluida?: () => void;
  mostrar?: {
    pulsar?: string;
    ondasSonoras?: boolean;
    pulsarOpcoes?: boolean;
  } | null;
}

const TEMPO_ERRO_SUAVE = 1800;

/**
 * F05: botão sozinho → primeira audição automática → opções. No erro, o
 * numeral volta e o botão continua disponível; só o acerto produz o fecho.
 *
 * O ENUNCIADO NÃO mora aqui. A fronteira Padrão Ouro é: palco desenha a
 * interação; GameLoop desenha q.prompt. Este palco apenas emite o momento em
 * que a casca pode revelá-lo sem violar a abertura da §4.
 */
export function AudioChoiceStage({
  spec,
  onAnswer,
  disabled,
  falar,
  onPrimeiraAudicaoConcluida,
  mostrar,
}: Props) {
  const [repeticoes, setRepeticoes] = React.useState(0);
  const [tentativas, setTentativas] = React.useState(0);
  const [escolha, setEscolha] = React.useState<number | null>(null);
  const [opcoesVisiveis, setOpcoesVisiveis] = React.useState(false);
  const erroTimer = React.useRef<number | null>(null);
  const primeiraAudicaoCallback = React.useRef(onPrimeiraAudicaoConcluida);

  React.useEffect(() => {
    primeiraAudicaoCallback.current = onPrimeiraAudicaoConcluida;
  }, [onPrimeiraAudicaoConcluida]);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const acertou = escolha !== null && escolha === spec.resposta;
  const errouEmFeedback = escolha !== null && !acertou;

  React.useEffect(() => {
    if (erroTimer.current !== null) window.clearTimeout(erroTimer.current);
    setRepeticoes(0);
    setTentativas(0);
    setEscolha(null);
    setOpcoesVisiveis(false);
    return () => {
      if (erroTimer.current !== null) window.clearTimeout(erroTimer.current);
    };
  }, [spec]);

  function primeiraAudicaoTerminou() {
    setOpcoesVisiveis(true);
    primeiraAudicaoCallback.current?.();
  }

  function escolher(valor: number | string) {
    const n = Number(valor);
    if (disabled || emAula || escolha !== null || !opcoesVisiveis || Number.isNaN(n)) return;

    const tentativa = tentativas + 1;
    setTentativas(tentativa);
    setEscolha(n);
    const certo = n === spec.resposta;

    falar?.(certo ? FALAS.acerto(spec.alvo) : FALAS.erroSuave(spec.alvo));

    const leitura: RespostaOuvidaRuntime = {
      resposta: n,
      alvo: spec.alvo,
      alternativas: spec.alternativas,
      repeticoes,
      tentativa,
      primeiraAudicaoConcluida: true,
    };
    onAnswer?.(n, leitura);

    if (!certo) {
      erroTimer.current = window.setTimeout(() => {
        erroTimer.current = null;
        setEscolha(null);
      }, TEMPO_ERRO_SUAVE);
    }
  }

  const mostrarOpcoes = emAula ? mostrar?.pulsarOpcoes === true : opcoesVisiveis;

  return (
    <div className="flex w-full flex-col items-center select-none">
      {!acertou && (
        <AudioChoice
          audioPrompt={spec.palavra}
          options={spec.alternativas}
          onSelect={escolher}
          disabled={disabled || emAula}
          optionsDisabled={errouEmFeedback}
          velocidade={spec.velocidade}
          autoPlay={!emAula}
          onPrimeiraAudicao={primeiraAudicaoTerminou}
          onRepetir={() => setRepeticoes(r => r + 1)}
          realceDaOpcao={o => {
            if (escolha === null) return null;
            if (acertou) return Number(o) === spec.resposta ? "acerto" : null;
            return Number(o) === escolha ? "erro" : null;
          }}
          pulsarBotao={emAula
            ? mostrar?.pulsar === "botaoSom"
            : opcoesVisiveis && !acertou}
          pulsarOpcoes={emAula ? mostrar?.pulsarOpcoes === true : false}
          ondasAtivas={emAula && mostrar?.ondasSonoras === true}
          mostrarOpcoes={mostrarOpcoes}
        />
      )}

      {acertou && (
        <p
          data-fecho-audiochoice
          className="mt-2 text-center text-6xl font-black"
          style={{ color: "#15803D" }}
          aria-live="polite"
        >
          {spec.alvo}
        </p>
      )}
    </div>
  );
}
