import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { TouchCountSpec, linhasDaCena } from "../../curriculum/procedimentos/touchCountContract";
import {
  AcaoDeContagem,
  FALA_DO_REPETIDO,
} from "../../curriculum/procedimentos/touchCountProcedure";

/**
 * `TouchCount` — a tela de N1.02 (ficha F27) e N1.04 (ficha F01).
 *
 * ---
 *
 * ### A gramática que os dois modos compartilham
 *
 * > **uma ação = um alvo = um numeral.** O numeral é o produto do ato.
 *
 * Isso não é enfeite: é o que separa **contar** (N1.04) de **parear** (N1.01).
 * No pareamento, o gesto produz um encaixe; aqui, produz um número. Se o numeral
 * não saltar do ato, a criança vê uma tela de toque, não uma tela de contagem.
 *
 * É também o que permite que N1.04 venha depois de N1.02 sem violar a regra de
 * *uma coisa nova por tela*: o modo `toque` **retira** o canhão e mantém a
 * gramática. Para a criança, não é um desenho novo — é o mesmo com menos coisas.
 *
 * ### As três regras invioláveis da F01 §4
 *
 * 1. **Ordem livre.** Qualquer alvo não contado responde ao toque. Nunca se
 *    exige a sequência da esquerda para a direita, e nada pulsa sugerindo por
 *    onde começar.
 * 2. **Silêncio é proibido.** Todo toque responde — inclusive o repetido, que
 *    balança e fala *"esse já contamos!"*. **Sem penalidade, sem X:** um toque
 *    mudo ensina que o app quebrou, não que o objeto já foi contado.
 * 3. **O numeral é o produto do ato.**
 *
 * ### O teclado só sobe no fim
 *
 * A pergunta *"quantos foram?"* aparece depois do último alvo, com uma pausa —
 * o silêncio é parte da ficha: dá tempo de a criança processar. E é ali que o
 * marco cognitivo se revela: se ela **volta a tocar** os objetos para responder,
 * o último número não respondeu à pergunta, e o palco registra isso.
 */

interface Props {
  spec: TouchCountSpec;
  /** Recebe o número escolhido e o que a ação revelou. */
  onAnswer?: (valor: number, acao: AcaoDeContagem) => void;
  disabled?: boolean;
  /**
   * Quantos alvos já nascem contados.
   *
   * Existe para a **sonda de layout**. O teclado só aparece depois do último
   * toque, então uma sonda que mede o estado inicial nunca veria a metade da
   * tela onde mora a pergunta — e foi exatamente uma sobreposição de layout,
   * invisível para 1074 testes, que fez esta sonda existir.
   *
   * A criança nunca recebe isto: o GameLoop não passa a prop, e ela não muda
   * nada no estado inicial (`0`).
   */
  preenchidos?: number;
  /**
   * A voz do app. As duas fichas mandam a voz falar o número **no mesmo
   * instante** do estouro/toque (F27 §4, F01 §4) — a competência do N1.02 é
   * ORAL, e sem a fala o exercício vira um jogo de mira.
   *
   * Injetada em vez de importada para o palco continuar testável sem áudio.
   */
  falar?: (texto: string) => void;
  /** O passo atual da micro-aula, vindo do `tutShow` do GameLoop. */
  mostrar?: {
    /** Acende o conjunto inteiro: "vamos contar juntos". */
    destacarGrupo?: boolean;
    /** O índice do alvo que a Mão Fantasma está tocando. */
    maoFantasma?: number;
    /** O numeral que a coreografia está falando. */
    numeral?: number;
    /** Pulsa os alvos que ainda faltam: "agora você conta!". */
    pulsarRestantes?: boolean;
  } | null;
}

/** O tamanho do alvo. Dedo de criança de 4 anos: nada abaixo disto. */
const ALVO = 52;

/**
 * O intervalo mínimo entre dois tiros, em milissegundos.
 *
 * Abaixo disto o canhão engasga. Não é anti-trapaça: é a F27 §4 dizendo que o
 * *limite físico ensina o ritmo* — a criança que metralha nunca sincroniza a
 * fala com a ação, que é a competência inteira do N1.02.
 */
const INTERVALO_MINIMO_DO_TIRO = 420;

/** O canhão. A F27 §3 pede "grande (mínimo 120px)". */
const CANHAO = 128;

export function TouchCount({ spec, onAnswer, disabled, preenchidos, falar, mostrar }: Props) {
  const semMovimento = useReducedMotion();
  /** A ordem em que cada alvo foi contado. `0` = ainda não contado. */
  // `jaFeitos` da ficha é a âncora do counting-on: os alvos já feitos nascem
  // feitos, e é olhando para eles que a criança sabe de onde continuar.
  // `preenchidos` é só para a sonda, e nunca reduz o que a ficha já mandou.
  const [ordem, setOrdem] = React.useState<number[]>(
    () => spec.alvos.map((_, i) =>
      (i < Math.max(spec.jaFeitos, preenchidos ?? 0) ? i + 1 : 0)));
  const [repetidos, setRepetidos] = React.useState(0);
  const [aviso, setAviso] = React.useState<string | null>(null);
  /** Ela voltou a tocar depois de a pergunta subir? É o marco da F01. */
  const [recontou, setRecontou] = React.useState(false);
  /** O numeral que acabou de saltar no centro da cena (F27 §4). */
  const [saltando, setSaltando] = React.useState<number | null>(null);
  /** O canhão engasgou: tiro rápido demais. Não é erro — é limite físico. */
  const [engasgou, setEngasgou] = React.useState(false);
  const ultimoTiro = React.useRef(0);

  const contados = ordem.filter(o => o > 0).length;
  const terminou = contados === spec.total;
  const perguntando = terminou && spec.pergunta !== null;

  function tocar(i: number) {
    if (disabled) return;
    // No rítmico quem dispara é o canhão: o balão não é botão.
    if (spec.modo === "ritmico") return;

    // A ordem destes dois testes É o diagnóstico. Recontar, na F01, significa
    // exatamente voltar a tocar os objetos JÁ CONTADOS para responder "quantos
    // são?" — então perguntar primeiro "já estava contado?" classificaria o
    // marco cognitivo da ficha como um toque repetido qualquer, e ele nunca
    // seria detectado. A pergunta estar no ar vem antes de tudo.
    if (perguntando) {
      setRecontou(true);
      setAviso(FALA_DO_REPETIDO);
      return;
    }

    if (ordem[i] > 0) {
      // Regra 2: silêncio é proibido. Responde, e não pune.
      setRepetidos(n => n + 1);
      setAviso(FALA_DO_REPETIDO);
      return;
    }
    setAviso(null);
    const numero = contados + 1;
    setOrdem(atual => atual.map((o, j) => (j === i ? numero : o)));
    // F01 §4: "a voz fala o número no mesmo instante do salto".
    falar?.(String(numero));
  }

  /**
   * O disparo do canhão — a interação do modo `ritmico`.
   *
   * ### O que estava errado
   *
   * A primeira versão fazia a criança tocar CADA balão, que é a interação do
   * modo `toque`. A F27 §3 põe **um canhão na base** e a §4 descreve o disparo:
   * um toque no canhão, uma bala, um balão, um número. Colapsar os dois modos
   * numa interação só apagou justamente o que a ficha ensina — *contar é agir
   * no tempo certo*, não escolher alvo.
   *
   * ### O engasgo
   *
   * *"Não existe erro nesta ficha. Se tocar duas vezes rápido, o canhão engasga
   * e não dispara. Limite físico ensina o ritmo."* (F27 §4). É a única coisa
   * que ensina sincronia entre falar e agir — sem ela, a criança metralha e a
   * correspondência um-a-um nunca se forma.
   */
  function dispararCanhao() {
    if (disabled) return;
    const agora = Date.now();
    if (agora - ultimoTiro.current < INTERVALO_MINIMO_DO_TIRO) {
      setEngasgou(true);
      setAviso("Devagar! Um de cada vez.");
      window.setTimeout(() => setEngasgou(false), 320);
      return;
    }
    const proximo = ordem.findIndex(o => o === 0);
    if (proximo < 0) return;

    ultimoTiro.current = agora;
    setEngasgou(false);
    setAviso(null);
    const numero = contados + 1;
    setOrdem(atual => atual.map((o, j) => (j === proximo ? numero : o)));
    // A voz fala o número no MESMO instante do estouro. A competência é oral.
    falar?.(String(numero));
    setSaltando(numero);
    window.setTimeout(() => setSaltando(atual => (atual === numero ? null : atual)), 700);
  }

  function responder(n: number) {
    if (disabled) return;
    onAnswer?.(n, {
      marcados: contados,
      total: spec.total,
      toquesRepetidos: repetidos,
      recontouAntesDeResponder: recontou,
      resposta: n,
      arranjo: spec.arranjo,
    });
  }

  /** O numeral que o alvo mostra: a posição dele na contagem, deslocada. */
  const numeralDe = (i: number) => ordem[i];

  const acesoPelaAula = mostrar?.destacarGrupo === true;

  return (
    <div className="w-full max-w-[390px] px-3 py-2">
      {/* O enunciado NÃO sai aqui: o app já o desenha na caixa acima do palco
          (`GameLoop.tsx` → `q.prompt`). Imprimir de novo punha a pergunta duas
          vezes na tela — o §6.32 outra vez, e desta vez escondido porque a
          sonda montava o palco sem o enquadramento do app. */}

      {/* O contador do modo rítmico: a sequência fica visível, 1 · 2 · 3.
          No nível 4 ela some — a competência é oral e ele precisa segurar
          a sequência de cabeça. */}
      {spec.modo === "ritmico" && spec.mostraNumeral && (
        <div
          // `role` explícito: `aria-label` numa `div` genérica é atributo
          // proibido pela WCAG — o axe pegou, e estava certo. Sem papel, o
          // rótulo simplesmente não é anunciado a quem usa leitor de tela.
          role="group"
          aria-label="Números que já saíram"
          className="mb-1 flex min-h-[28px] items-center justify-end gap-1 pr-1"
        >
          {ordem.filter(o => o > 0).sort((a, b) => a - b).map(o => (
            <span
              key={o}
              className="rounded-md bg-indigo-100 px-1.5 text-base font-black text-indigo-700"
            >
              {o}
            </span>
          ))}
        </div>
      )}

      <div
        role="group"
        aria-label={`${spec.artigo === "as" ? "As" : "Os"} ${spec.nome}`}
        className="relative w-full overflow-hidden rounded-2xl bg-slate-50"
        // A altura sai das LINHAS da cena. Fixa em 132px, as duas linhas do
        // nível 5 do canhão nasciam cortadas — e recorte não é vazamento nem
        // colisão, então a sonda não pegou: só o print mostrou.
        style={{ height: linhasDaCena(spec.alvos) * (ALVO + 24) + 24 }}
      >
        {spec.alvos.map((a, i) => {
          const contado = ordem[i] > 0;
          // Balão estourado saiu da cena: não responde mais ao tiro. Ele fica
          // no lugar, invisível, porque remover do fluxo faria os balões
          // restantes escorregarem para debaixo do dedo da criança.
          const estourado = contado && spec.aoMarcar === "estourar";
          // Os que a cena JÁ trouxe feitos deixam rastro. A criança viu os
          // dela explodirem; estes não — sumir sem deixar marca faria a âncora
          // do counting-on virar um buraco, e um buraco não conta nada. Com o
          // rastro ela vê "dois já foram" e sabe de onde continuar.
          const jaVeioFeito = estourado && i < spec.jaFeitos;
          const maoAqui = mostrar?.maoFantasma === i;
          // Regra 1: nada pulsa sugerindo por onde começar. O pulsar só existe
          // quando a micro-aula devolve a vez — "agora você conta!".
          const pulsa = mostrar?.pulsarRestantes === true && !contado;

          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => tocar(i)}
              // No rítmico o balão é CENÁRIO: quem age é o canhão. Deixá-lo
              // clicável ofereceria duas interações para a mesma ação e
              // devolveria a escolha de alvo, que é o modo `toque`.
              disabled={disabled || estourado || spec.modo === "ritmico"}
              // Sem `aria-hidden`: o alvo já feito CARREGA sentido — é a
              // âncora de onde continuar. Escondê-lo do leitor de tela tiraria
              // de quem não enxerga justamente a informação que a cena dá de
              // graça a quem enxerga.
              aria-label={jaVeioFeito
                ? `${spec.nome}, este já estourei: ${numeralDe(i)}`
                : contado
                  ? `${spec.nome}, já contei: ${numeralDe(i)}`
                  : `${spec.nome}, ainda não contei`}
              aria-pressed={contado}
              className="absolute flex items-center justify-center rounded-full"
              style={{
                left: `${a.x}%`,
                top: `${a.y}%`,
                width: ALVO,
                height: ALVO,
                marginLeft: -ALVO / 2,
                marginTop: -ALVO / 2,
                fontSize: 34,
                lineHeight: 1,
              }}
              animate={semMovimento ? undefined : {
                scale: pulsa ? [1, 1.12, 1] : 1,
                rotate: maoAqui ? [0, -6, 6, 0] : 0,
              }}
              transition={{ duration: 0.5, repeat: pulsa ? Infinity : 0, repeatDelay: 0.6 }}
            >
              <span
                style={{
                  // `colorir`: o cinza vira cor quando o dedo passa.
                  // `nada`: o desmame do nível 5 — ela segura mentalmente.
                  // `estourar`: o balão some; o lugar dele fica, vazio.
                  filter: spec.aoMarcar === "colorir" && !contado && !acesoPelaAula
                    ? "grayscale(1)" : "none",
                  opacity: estourado
                    ? (jaVeioFeito ? 0.22 : 0)
                    : (spec.aoMarcar === "colorir" && !contado && !acesoPelaAula ? 0.35 : 1),
                  ...(jaVeioFeito ? { filter: "grayscale(1)" } : {}),
                  transition: "opacity 180ms, filter 200ms",
                }}
              >
                {spec.emoji}
              </span>

              {/* O numeral salta do ato. No nível 5 do rítmico ele não aparece
                  escrito, mas o alvo segue marcado — são coisas distintas. */}
              {/* O numeral da micro-aula. A coreografia da F01 §8 declara
                  `numeral: 1` junto com `maoFantasma: 0` — a voz diz "UM" e o
                  número salta. Este bloco existia como PROP e não como desenho:
                  a aula prometia um numeral que a tela nunca mostrava. */}
              {!contado && maoAqui && mostrar?.numeral !== undefined && (
                <span
                  aria-hidden
                  className="absolute -top-1 -right-1 rounded-full bg-indigo-600 px-1.5 text-sm font-black text-white"
                >
                  {mostrar.numeral}
                </span>
              )}

              {contado && !estourado && spec.mostraNumeral && (
                <motion.span
                  initial={semMovimento ? false : { scale: 0, y: 0 }}
                  animate={{ scale: 1, y: -2 }}
                  transition={{ type: "spring", stiffness: 420, damping: 14 }}
                  aria-hidden
                  className="absolute -top-1 -right-1 rounded-full bg-indigo-600 px-1.5 text-sm font-black text-white"
                >
                  {numeralDe(i)}
                </motion.span>
              )}
            </motion.button>
          );
        })}

        {/* O numeral que SALTA grande no centro, no instante do estouro
            (F27 §4). Sem ele o número não é o produto do ato: aparecia direto
            no contador, longe do balão, e a criança não ligava um ao outro.
            No nível 4 em diante ele não aparece escrito — a voz continua. */}
        {spec.modo === "ritmico" && saltando !== null && spec.mostraNumeral && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-black text-indigo-600"
            initial={semMovimento ? false : { scale: 0 }}
            animate={{ scale: [0, 1.4, 1] }}
            transition={{ duration: 0.4 }}
          >
            {saltando}
          </motion.span>
        )}

        {/* A Mão Fantasma do nível 1. */}
        {mostrar?.maoFantasma !== undefined && spec.alvos[mostrar.maoFantasma] && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute text-3xl"
            style={{
              left: `${spec.alvos[mostrar.maoFantasma].x}%`,
              top: `${spec.alvos[mostrar.maoFantasma].y}%`,
              marginLeft: 6,
              marginTop: 6,
            }}
            animate={semMovimento ? undefined : { scale: [1, 0.85, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            👆
          </motion.span>
        )}
      </div>

      {/* O canhão da F27 §3: na base, centralizado, grande. É ele quem dispara —
          um toque, uma bala, um balão, um número. */}
      {spec.modo === "ritmico" && (
        <div className="mt-2 flex justify-center">
          <motion.button
            type="button"
            onClick={dispararCanhao}
            disabled={disabled || terminou}
            aria-label={terminou ? "Acabaram os balões" : "Disparar o canhão"}
            // `amber-500` dava 2.13:1 com texto branco, abaixo do mínimo de 3:1 para
            // texto grande — a sonda mediu. Um passo mais escuro passa sem mudar
            // a cor do canhão.
            className="rounded-3xl bg-amber-700 px-6 py-3 text-2xl font-black text-white shadow-lg disabled:opacity-40"
            style={{ minWidth: CANHAO }}
            animate={semMovimento ? undefined : {
              // O recuo do §4 ("kickback 8px, 100ms") e o engasgo com fumaça.
              y: engasgou ? 0 : [0, 8, 0],
              rotate: engasgou ? [0, -3, 3, -3, 0] : 0,
            }}
            transition={{ duration: engasgou ? 0.3 : 0.18 }}
          >
            {engasgou ? "💨" : "🔥"} FOGO
          </motion.button>
        </div>
      )}

      {/* Silêncio é proibido: o toque repetido responde, e não pune. */}
      <p
        role="status"
        aria-live="polite"
        className="mt-1 min-h-[24px] text-center text-base font-bold text-amber-700"
      >
        {aviso ?? ""}
      </p>

      {/* O teclado sobe só depois do último alvo. */}
      {perguntando && (
        <div className="mt-1">
          <p className="mb-2 text-center text-lg font-black text-slate-800">
            {spec.pergunta}
          </p>
          <div role="group" aria-label="Teclado" className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: spec.tecladoAte }, (_, k) => k + 1).map(n => (
              <button
                key={n}
                type="button"
                onClick={() => responder(n)}
                disabled={disabled}
                className="h-12 w-12 rounded-2xl bg-white text-xl font-black text-slate-800 shadow ring-2 ring-slate-200"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* O fecho do rítmico não é pergunta: é a sequência inteira, falada. */}
      {terminou && spec.pergunta === null && (
        <p className="mt-1 text-center text-lg font-black text-emerald-700">
          Foram {spec.total} {spec.nome}!
        </p>
      )}
    </div>
  );
}
