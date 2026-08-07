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

/**
 * `TouchPlaceStage` — a tela de N1.13, ficha F04.
 *
 * ---
 *
 * ### As três coisas que só existem aqui
 *
 * 1. **A contagem em voz alta a cada encaixe.** A §4 põe a voz contando —
 *    *"uma..."* — no momento em que o objeto assenta, e a §7 repete no howto:
 *    *"conte enquanto coloca"*. É a ficha inteira: o número dito no ato é o que
 *    liga a palavra à quantidade produzida.
 * 2. **As recusas.** Nos níveis com vaga, o excedente é empurrado de volta
 *    (§4), então o estado final está **sempre certo** e `NAO_MONITORA_ALVO`
 *    nunca apareceria no repouso. A tentativa é a única evidência. Mesma
 *    armadilha do `TUDO_CABE` da F51.
 * 3. **O fecho.** §4: última vaga preenchida → 500ms de pausa → os objetos
 *    brilham → a voz conta tudo. A pausa não é enfeite: é o tempo de a criança
 *    ver o conjunto completo antes de a voz nomeá-lo.
 */

/** §4: "última vaga preenchida → **500ms de pausa** → os objetos brilham". */
const PAUSA_DO_FECHO = 500;
/** §4: o fecho inteiro leva 2,5s; a voz conta durante ele. */
const DURACAO_DO_FECHO = 1500;

interface Props {
  spec: ProducaoSpec;
  onAnswer?: (valor: number, acao: AcaoDeProducao) => void;
  disabled?: boolean;
  /** A voz do app. §4: ela conta a cada encaixe e conta tudo no fecho. */
  falar?: (texto: string) => void;
  /** O passo da micro-aula (§8), vindo do `tutShow`. */
  mostrar?: {
    /** §8: "Preciso de três estrelas." — as vagas pulsam. */
    pulsarVagas?: boolean | number[];
    /** §8: "Uma..." — a Mão Fantasma leva o primeiro da bandeja à vaga. */
    maoFantasma?: unknown;
  } | null;
}

export function TouchPlaceStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [ocupadas, setOcupadas] = React.useState<number[]>([]);
  const [naMao, setNaMao] = React.useState(false);
  const [recusas, setRecusas] = React.useState(0);
  const [balanco, setBalanco] = React.useState(0);
  const [fechando, setFechando] = React.useState(false);
  const [encerrado, setEncerrado] = React.useState(false);
  const relogios = React.useRef<number[]>([]);

  React.useEffect(() => () => { relogios.current.forEach(window.clearTimeout); }, []);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const colocados = ocupadas.length;
  const naBandeja = spec.bandeja - colocados - (naMao ? 1 : 0);
  const travado = disabled || encerrado || emAula;

  function agendar(fn: () => void, ms: number) {
    relogios.current.push(window.setTimeout(fn, ms));
  }

  function encerrar(quantos: number, recusasFinais: number) {
    if (encerrado) return;
    setEncerrado(true);
    const acao: AcaoDeProducao = {
      colocados: quantos,
      alvo: spec.alvo,
      bandeja: spec.bandeja,
      recusas: recusasFinais,
      comAndaime: spec.comAndaime,
    };
    onAnswer?.(quantos, acao);
  }

  function pegar() {
    if (travado || naMao || naBandeja <= 0) return;
    setNaMao(true);
  }

  function colocar(toque: Ponto) {
    if (travado) return;

    // Tocar a vaga sem ter pegado antes vale como pegar-e-colocar. Exigir a
    // ordem certa seria transformar sequência de gestos em requisito, e a
    // competência aqui é produzir quantidade, não seguir protocolo.
    const tinha = naMao || naBandeja > 0;
    if (!tinha) return;

    const livre = ancoraMaisProxima(spec.ancoras, ocupadas, toque);

    // §4, excesso: "o objeto não cola — volta flutuando para a bandeja, e a cena
    // dá um leve balanço. A voz: 'já colocamos três!'". Vale onde há vaga: é a
    // vaga que é o limite (ver `limitaExcesso`).
    const excedeu = spec.limitaExcesso && colocados >= spec.alvo;
    if (excedeu || livre < 0) {
      setNaMao(false);
      setRecusas(r => r + 1);
      setBalanco(b => b + 1);
      falar?.(FALAS.excesso(spec.alvo, spec.tema.genero));
      return;
    }

    const agora = [...ocupadas, livre];
    setOcupadas(agora);
    setNaMao(false);
    // §4, o encaixe: a voz CONTA. "uma...", "duas...". Com concordância (§6.5).
    falar?.(FALAS.aoEncaixar(agora.length, spec.tema.genero));

    // §2: "as vagas fantasma mostram quantas faltam e encerram sozinhas".
    // Sem vaga não há como a tela saber que ela terminou — daí o "Pronto!".
    if (encerraSozinha(spec.nivel) && agora.length >= spec.alvo) {
      agendar(() => {
        setFechando(true);
        falar?.(FALAS.fecho(spec.alvo, spec.tema.genero, spec.tema.plural, spec.tema.singular));
        agendar(() => encerrar(agora.length, recusas), DURACAO_DO_FECHO);
      }, PAUSA_DO_FECHO);
    }
  }

  /**
   * O "Pronto!" — a divergência declarada em `producaoProcedure`.
   *
   * Sem ele, *"parou antes"* (§6) não é observável e a tela dos níveis 4 e 5
   * espera para sempre. Ele só aparece depois do primeiro objeto: na hora do
   * primeiro gesto, a tela é a que a §3 desenha.
   */
  function concluir() {
    if (travado || colocados === 0) return;
    const certo = colocados === spec.alvo && recusas === 0;
    setFechando(certo);
    falar?.(certo
      ? FALAS.fecho(spec.alvo, spec.tema.genero, spec.tema.plural, spec.tema.singular)
      : FALAS.erroSuave(colocados, spec.alvo, spec.tema.genero));
    agendar(() => encerrar(colocados, recusas), certo ? DURACAO_DO_FECHO : 900);
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
        onColocar={colocar}
        disabled={travado}
        balanco={balanco}
        fechando={fechando}
        pulsarVagas={emAula ? Boolean(mostrar?.pulsarVagas) : false}
        maoFantasma={emAula ? mostrar?.maoFantasma != null : false}
      />

      {/* A faixa de comando. Altura reservada mesmo vazia: sem isso a tela
          salta 48px quando o primeiro objeto assenta, e salto de layout no meio
          do gesto é o tipo de coisa que faz criança de 4 anos errar o alvo. */}
      <div
        className="mt-3 flex items-center justify-center gap-3"
        style={{ width: LARGURA_DA_CENA, height: 48 }}
      >
        {/* §5, nível 5: "o pedido é falado só uma vez, sem repetir". Nos outros
            níveis ela pode pedir de novo — sem limite e sem penalidade, como na
            F05. Tirar o botão do nível 5 é o degrau; tirá-lo de todos apagaria
            o degrau e endureceria os quatro primeiros. */}
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

        {colocados > 0 && !encerrado && (
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
