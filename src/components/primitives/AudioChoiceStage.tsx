import React from "react";
import { AudioChoice } from "./AudioChoice";
import { AudioChoiceSpec } from "../../curriculum/procedimentos/audioChoiceContract";
import { FALAS, RespostaOuvida } from "../../curriculum/procedimentos/audioChoiceProcedure";

interface Props {
  spec: AudioChoiceSpec;
  onAnswer?: (valor: number, leitura: RespostaOuvida) => void;
  disabled?: boolean;
  falar?: (texto: string) => void;
  mostrar?: {
    pulsar?: string;
    ondasSonoras?: boolean;
    pulsarOpcoes?: boolean;
  } | null;
}

const TEMPO_ERRO_SUAVE = 1800;

/**
 * F05: botão sozinho → primeira audição automática → opções. No erro, o numeral
 * volta e o botão continua disponível; só o acerto produz o fecho com o símbolo
 * correto sozinho. A versão anterior mostrava opções desde o primeiro frame e
 * travava toda a tela depois de qualquer escolha errada.
 */
export function AudioChoiceStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [repeticoes, setRepeticoes] = React.useState(0);
  const [tentativas, setTentativas] = React.useState(0);
  const [escolha, setEscolha] = React.useState<number | null>(null);
  const [opcoesVisiveis, setOpcoesVisiveis] = React.useState(false);
  const erroTimer = React.useRef<number | null>(null);

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

  function escolher(valor: number | string) {
    const n = Number(valor);
    if (disabled || emAula || escolha !== null || !opcoesVisiveis || Number.isNaN(n)) return;

    const tentativa = tentativas + 1;
    setTentativas(tentativa);
    setEscolha(n);
    const certo = n === spec.resposta;

    // §4: nenhum "errou". O feedback é ouvir novamente a informação-alvo.
    falar?.(certo ? FALAS.acerto(spec.alvo) : FALAS.erroSuave(spec.alvo));

    const leitura = {
      resposta: n,
      alvo: spec.alvo,
      alternativas: spec.alternativas,
      repeticoes,
      // Campos adicionais preservam a diferença entre primeira audição e
      // primeira RESPOSTA. O procedimento legado ainda os ignora; o fio com o
      // Radar é tratado separadamente na fronteira do GameLoop.
      tentativa,
      primeiraAudicaoConcluida: true,
    } as RespostaOuvida & { tentativa: number; primeiraAudicaoConcluida: boolean };
    onAnswer?.(n, leitura);

    if (!certo) {
      // A opção "desliza de volta" e a criança pode tentar novamente. O botão
      // de som permanece ativo durante este intervalo (§4).
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
          onPrimeiraAudicao={() => setOpcoesVisiveis(true)}
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

      {/* §4 Fecho: somente depois do ACERTO o numeral correto fica sozinho. */}
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
