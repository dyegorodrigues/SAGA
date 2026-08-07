import React from "react";
import { TouchPlace } from "./TouchPlace";
import { PalcoEscalado } from "./PalcoEscalado";
import {
  ProducaoSpec,
  ancoraMaisProxima,
  LARGURA_DA_CENA,
  Ponto,
} from "../../curriculum/procedimentos/producaoContract";
import {
  AcaoDeProducao,
  FALAS,
  ROTULO_DE_FECHO,
  encerraSozinha,
} from "../../curriculum/procedimentos/producaoProcedure";

/** §4: última vaga preenchida → 500ms de pausa → brilho/fecho. */
const PAUSA_DO_FECHO = 500;
/** A voz/fecho visual permanece por 1,5s antes de publicar a resposta terminal. */
const DURACAO_DO_FECHO = 1500;
/** Erro suave do `Pronto!`: informa, devolve a ação à criança e não avança. */
const DURACAO_DO_ERRO = 900;

interface Props {
  spec: ProducaoSpec;
  onAnswer?: (valor: number, acao: AcaoDeProducao) => void;
  disabled?: boolean;
  falar?: (texto: string) => void;
  mostrar?: {
    pulsarVagas?: boolean | number[];
    maoFantasma?: unknown;
  } | null;
}

/**
 * `TouchPlaceStage` — F04/N1.13.
 *
 * Regras de fronteira:
 * - o palco conta cada encaixe e possui o feedback/retry da produção;
 * - o GameLoop recebe cada declaração `Pronto!` para diagnóstico, mas não fala
 *   por cima nem transforma o erro suave em erro terminal;
 * - nos níveis com vagas, a última vaga trava a interação IMEDIATAMENTE e só
 *   então espera 500ms para o fecho. A janela de animação nunca vira uma janela
 *   diagnóstica para um dedo rápido (§8.3-bis);
 * - uma nova `spec` é uma nova questão: nenhum estado/timer vaza entre elas.
 */
export function TouchPlaceStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [ocupadas, setOcupadas] = React.useState<number[]>([]);
  const [naMao, setNaMao] = React.useState(false);
  const [recusas, setRecusas] = React.useState(0);
  const [balanco, setBalanco] = React.useState(0);
  const [fechando, setFechando] = React.useState(false);
  const [feedbackErro, setFeedbackErro] = React.useState(false);
  const [encerrado, setEncerrado] = React.useState(false);

  const relogios = React.useRef<number[]>([]);
  const recusasRef = React.useRef(0);
  const encerradoRef = React.useRef(false);

  function limparRelogios() {
    relogios.current.forEach(window.clearTimeout);
    relogios.current = [];
  }

  React.useEffect(() => {
    // Nova questão = estado novo, mesmo que tema/alvo coincidam.
    limparRelogios();
    setOcupadas([]);
    setNaMao(false);
    setRecusas(0);
    recusasRef.current = 0;
    setBalanco(0);
    setFechando(false);
    setFeedbackErro(false);
    setEncerrado(false);
    encerradoRef.current = false;
    return limparRelogios;
  }, [spec]);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const colocados = ocupadas.length;
  const naBandeja = spec.bandeja - colocados - (naMao ? 1 : 0);
  const travado = Boolean(disabled) || encerrado || fechando || feedbackErro || emAula;

  function agendar(fn: () => void, ms: number) {
    const id = window.setTimeout(() => {
      relogios.current = relogios.current.filter(x => x !== id);
      fn();
    }, ms);
    relogios.current.push(id);
  }

  function leitura(quantos: number, recusasFinais = recusasRef.current): AcaoDeProducao {
    return {
      colocados: quantos,
      alvo: spec.alvo,
      bandeja: spec.bandeja,
      recusas: recusasFinais,
      comAndaime: spec.comAndaime,
    };
  }

  function encerrar(quantos: number) {
    if (encerradoRef.current) return;
    encerradoRef.current = true;
    setEncerrado(true);
    onAnswer?.(quantos, leitura(quantos));
  }

  function pegar() {
    if (travado || naMao || naBandeja <= 0) return;
    setNaMao(true);
  }

  function cancelarPegada() {
    if (travado) return;
    setNaMao(false);
  }

  function colocar(toque: Ponto) {
    if (travado) return;

    // Toque alternativo: tocar a vaga/cena sem pegar antes continua válido.
    // O arrasto real é oferecido pela primitiva, não imposto como único gesto.
    const tinhaObjeto = naMao || naBandeja > 0;
    if (!tinhaObjeto) return;

    const livre = ancoraMaisProxima(spec.ancoras, ocupadas, toque);
    const excedeu = spec.limitaExcesso && colocados >= spec.alvo;

    if (excedeu || livre < 0) {
      setNaMao(false);
      setBalanco(b => b + 1);
      falar?.(FALAS.excesso(spec.alvo, spec.tema.genero));

      // A pausa cinematográfica depois da última vaga não é teste conceitual.
      // Se a tela já alcançou o alvo, não somamos recusa por um toque que caiu
      // na janela de animação. Em níveis sem andaime o excesso fica materializado
      // como `colocados > alvo`, que é evidência legítima de não ter parado.
      if (colocados < spec.alvo) {
        setRecusas(r => {
          const proxima = r + 1;
          recusasRef.current = proxima;
          return proxima;
        });
      }
      return;
    }

    const agora = [...ocupadas, livre];
    setOcupadas(agora);
    setNaMao(false);
    falar?.(FALAS.aoEncaixar(agora.length, spec.tema.genero));

    if (encerraSozinha(spec.nivel) && agora.length >= spec.alvo) {
      // Trava já no último encaixe. Os 500ms são silêncio pedagógico, não uma
      // chance escondida para produzir outro diagnóstico.
      setFechando(true);
      agendar(() => {
        falar?.(FALAS.fecho(spec.alvo, spec.tema.genero, spec.tema.plural, spec.tema.singular));
        agendar(() => encerrar(agora.length), DURACAO_DO_FECHO);
      }, PAUSA_DO_FECHO);
    }
  }

  /**
   * Divergência já declarada no procedimento: níveis sem vaga precisam de um
   * ato explícito de “parei”; timer de silêncio é proibido pela §2.
   *
   * Se faltou, preserva o que ela já produziu e permite completar. Se passou,
   * reinicia a tentativa depois do feedback porque sem gesto de remoção não há
   * caminho honesto de volta ao alvo. Em ambos os casos o GameLoop recebe a
   * tentativa para o Radar, mas o palco continua dono do retry.
   */
  function concluir() {
    if (travado || colocados === 0) return;
    const certo = colocados === spec.alvo && recusasRef.current === 0;

    if (certo) {
      setFechando(true);
      falar?.(FALAS.fecho(spec.alvo, spec.tema.genero, spec.tema.plural, spec.tema.singular));
      agendar(() => encerrar(colocados), DURACAO_DO_FECHO);
      return;
    }

    setFeedbackErro(true);
    falar?.(FALAS.erroSuave(colocados, spec.alvo, spec.tema.genero));
    onAnswer?.(colocados, leitura(colocados));

    agendar(() => {
      if (colocados > spec.alvo) {
        // Sem vaga não existe “desencaixar” na ficha. Uma nova tentativa limpa
        // é menos ambígua que deixar a criança presa num estado irrecuperável.
        setOcupadas([]);
        setNaMao(false);
        setRecusas(0);
        recusasRef.current = 0;
      }
      setFeedbackErro(false);
    }, DURACAO_DO_ERRO);
  }

  return (
    <PalcoEscalado>
      <div className="flex flex-col items-center select-none">
        <TouchPlace
          tema={spec.tema}
          ancoras={spec.ancoras}
          vagas={spec.vagas}
          ocupadas={ocupadas}
          naBandeja={Math.max(0, naBandeja)}
          capacidade={spec.bandeja}
          naMao={naMao}
          onPegar={pegar}
          onCancelar={cancelarPegada}
          onColocar={colocar}
          disabled={travado}
          balanco={balanco}
          fechando={fechando}
          pulsarVagas={emAula ? Boolean(mostrar?.pulsarVagas) : false}
          maoFantasma={emAula ? mostrar?.maoFantasma != null : false}
        />

        <div
          className="mt-3 flex items-center justify-center gap-3"
          style={{ width: LARGURA_DA_CENA, height: 48 }}
        >
          {spec.repetivel && !encerrado && (
            <button
              type="button"
              onClick={() => falar?.(spec.falado)}
              disabled={travado}
              aria-label="Ouvir o pedido de novo"
              className="flex items-center justify-center rounded-2xl"
              style={{
                width: 56,
                height: 44,
                backgroundColor: "#F8FAFC",
                border: "2px solid #C7D7F0",
                fontSize: 22,
              }}
            >
              <span aria-hidden>🔊</span>
            </button>
          )}

          {colocados > 0 && !encerrado && !spec.comAndaime && (
            <button
              type="button"
              onClick={concluir}
              disabled={travado}
              className="rounded-2xl px-6"
              style={{
                height: 44,
                backgroundColor: "#2563EB",
                border: "2px solid #1D4ED8",
                color: "#FFFFFF",
                fontSize: 17,
                fontWeight: 800,
              }}
            >
              {ROTULO_DE_FECHO}
            </button>
          )}
        </div>
      </div>
    </PalcoEscalado>
  );
}
