import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { EmojiRow } from "./EmojiRow";
import { MaoDeDedos } from "./MaoDeDedos";
import {
  EmojiRowSpec,
  PecaDoPadrao,
  chaveDaPeca,
  falaDaRevelacao,
  maoCanonica,
  posicionarFileira,
} from "../../curriculum/procedimentos/emojiRowContract";

/**
 * `EmojiRowStage` — a tela das três fichas da fileira.
 *
 * | Ficha | Competência | Modo | O que a criança faz |
 * |---|---|---|---|
 * | JD1 | N1.03 | `flash` | vê objetos piscarem e diz quantos eram |
 * | JD2 | N1.08 | `flash-mao` | vê uma ou duas mãos piscarem e diz quantos dedos |
 * | F52 | AL.02 | `padrao` | vê a sequência e escolhe a peça da lacuna |
 *
 * ---
 *
 * ### O palco compõe a primitiva, não a substitui
 *
 * Os objetos são desenhados pelo **próprio `EmojiRow`** nos três arranjos —
 * fila, padrão de dado e disperso —, mudando só as posições. Desenhar o dado
 * num componente novo seria o defeito §6.31-bis: a criança veria dois desenhos
 * para a mesma coisa e leria o nível 3 como assunto novo.
 *
 * ### A fase é a guarda, não a boa vontade
 *
 * As alternativas **não existem no DOM** enquanto os objetos estão na tela, e os
 * objetos **não existem no DOM** enquanto as alternativas estão. Não é opacidade
 * nem `visibility`: é a fase que monta um ou outro. O relance da JD1 (§2) só
 * funciona se os objetos realmente saírem — deixá-los escondidos por CSS
 * devolveria a contagem a quem inspeciona, e devolveria o vazamento a qualquer
 * bug de transição.
 *
 * ### A escada da P1 mora aqui
 *
 * `revelando` é o degrau *plain* — a fileira **parada**, com o numeral escrito.
 * A §4 manda revelar no acerto E no erro, e a §8 manda revelar na micro-aula.
 * É a única forma de a criança ver o desenho em repouso sem que isso destrua o
 * relance (que exige o sumiço). Ver `emojiRowProcedure` para a decisão inteira.
 */

interface Props {
  spec: EmojiRowSpec;
  onAnswer?: (valor: number | string) => void;
  disabled?: boolean;
  /**
   * A voz do app. §4 das três fichas manda falar na revelação — e na JD2 a fala
   * É a aula ("uma mão cheia e dois — sete!"). Injetada, não importada, para o
   * palco continuar testável sem áudio.
   */
  falar?: (texto: string) => void;
  /**
   * Prende a fase.
   *
   * Existe para a **sonda de layout** e para os testes. A cena passa por cinco
   * fases em poucos segundos; uma sonda que mede o estado inicial nunca veria
   * as alternativas, e uma que mede tarde nunca veria os objetos. Medir tela em
   * movimento não é medir (§6.31).
   *
   * A criança nunca recebe isto: o GameLoop não passa a prop.
   */
  fase?: Fase;
  /** O passo atual da micro-aula, vindo do `tutShow` do GameLoop. */
  mostrar?: {
    /** §8: "Prepare o olho!" — o ponto que fixa o olhar. */
    fixarOlhar?: boolean;
    /** §8: o relance de DEMONSTRAÇÃO. `n` para objetos, `mao` para dedos. */
    flash?: { n?: number; mao?: number; ms?: number };
    /** §8: a fileira PARADA, com o numeral. É o degrau *plain* da escada. */
    revelar?: number | { mao: number };
    /** F52 §8: a sequência inteira acesa. */
    destacarSequencia?: boolean;
    /** F52 §8: a moldura sobre o pedaço que se repete. */
    molduraUnidade?: number[];
    /** F52 §8: a lacuna pulsando — "o que vem agora?". */
    pulsarLacuna?: boolean;
  } | null;
}

export type Fase =
  /** O ponto pisca no centro: "prepare o olho…" (§4). */
  | "preparando"
  /** Três pulsos, 3… 2… 1. Só visual, sem número escrito (§4). */
  | "regressiva"
  /** Os objetos aparecem instantaneamente (§4). */
  | "flash"
  /** 400ms de silêncio: a área fica limpa e a imagem assenta (§4). */
  | "silencio"
  /** As alternativas sobem da base (§4). */
  | "perguntando"
  /** Os objetos reaparecem confirmando o que ela viu (§4). */
  | "revelando"
  /** F52 §4: a sequência entra elemento a elemento, com ritmo constante. */
  | "entrando";

/** A área de relance. §3: "retângulo neutro, fundo branco, centralizado". */
const ALTURA_DA_AREA = 176;

/**
 * A largura útil dentro do cartão do app, a 390px.
 *
 * 390 − 28 (padrão do cartão) − 24 (o `px-3` deste palco) − 4 (a borda da área)
 * − 8 (a folga do `px-1` da fila). Medida, não chutada: é o §6.16, e foi uma
 * largura chutada que fez a reta numérica rolar na horizontal.
 */
const LARGURA_UTIL = 326;

/** O vão entre as casas do padrão. */
const VAO = 4;

/** A área do padrão: a sequência é uma linha, e uma linha não pede 176px. */
const ALTURA_DO_PADRAO = 96;

/**
 * A faixa do numeral da revelação, dentro da área.
 *
 * Reservada SEMPRE, mesmo antes de haver o que escrever nela: se ela só
 * existisse na revelação, o campo mudaria de tamanho no meio da cena e o
 * desenho pularia justamente no instante em que a criança volta a olhar.
 */
const FAIXA_DO_NUMERAL = 30;

/** O ritmo de entrada da sequência do padrão (F52 §4: 200ms cada). */
const RITMO_DO_PADRAO = 200;

export function EmojiRowStage({ spec, onAnswer, disabled, falar, fase: faseFixa, mostrar }: Props) {
  const semMovimento = useReducedMotion();
  const [faseInterna, setFaseInterna] = React.useState<Fase>(
    spec.modo === "padrao" ? "entrando" : "preparando",
  );
  const [escolha, setEscolha] = React.useState<number | string | null>(null);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  // A fase presa vale até a criança responder: depois disso quem manda é a
  // resposta. Sem esta ressalva, a sonda (que prende a fase) e os testes
  // veriam o clique não produzir revelação nenhuma.
  const fase: Fase = escolha !== null ? faseInterna : (faseFixa ?? faseInterna);
  const acertou = escolha !== null && escolha === spec.resposta;

  /* A máquina do roteiro (§4). Cada tempo vem do contrato, não de um número
     digitado aqui: mexer no ritmo é mexer na ficha. */
  React.useEffect(() => {
    if (faseFixa || emAula) return;
    const r = spec.roteiro;
    const passos: [Fase, number][] = spec.modo === "padrao"
      ? [["entrando", (spec.sequencia?.casas.length ?? 0) * RITMO_DO_PADRAO + 400]]
      : [
        ["preparando", r.preparacao],
        ["regressiva", r.regressiva],
        ["flash", r.flash],
        ["silencio", r.silencio],
      ];

    let vivo = true;
    const timers: number[] = [];
    let acumulado = 0;
    for (let i = 1; i < passos.length; i += 1) {
      acumulado += passos[i - 1][1];
      const destino = passos[i][0];
      timers.push(window.setTimeout(() => { if (vivo) setFaseInterna(destino); }, acumulado));
    }
    acumulado += passos[passos.length - 1][1];
    timers.push(window.setTimeout(() => { if (vivo) setFaseInterna("perguntando"); }, acumulado));

    return () => { vivo = false; timers.forEach(window.clearTimeout); };
  }, [spec, faseFixa, emAula]);

  function escolher(valor: number | string) {
    if (disabled || escolha !== null) return;
    setEscolha(valor);
    setFaseInterna("revelando");
    const fala = falaDaRevelacao(spec, valor === spec.resposta);
    if (fala) falar?.(fala);
    onAnswer?.(valor);
  }

  const mostrandoObjetos = fase === "flash" || fase === "revelando";
  const revelando = fase === "revelando";

  /** A altura do campo do desenho: a área menos a faixa reservada do numeral. */
  const alturaDoCampo = spec.modo === "padrao"
    ? ALTURA_DO_PADRAO
    : ALTURA_DA_AREA - FAIXA_DO_NUMERAL;

  /** A peça do banco por trás de uma alternativa. `null` fora do modo padrão. */
  const pecaDoBanco = (valor: number | string) =>
    spec.sequencia?.banco.find(p => chaveDaPeca(p) === valor) ?? null;

  /* ---------------------------------------------------------------- *
   *  A cena
   * ---------------------------------------------------------------- */

  /**
   * A quantidade que a cena desenha AGORA.
   *
   * Na micro-aula é a quantidade de **demonstração** da §8 (`flash: { n: 2 }`),
   * nunca a da pergunta. É isso que torna a coreografia uma aula: a criança vê
   * o desenho, ouve quanto era e não é cobrada de nada. Usar `spec.total` aqui
   * transformaria a aula em gabarito.
   */
  const demo = mostrar?.flash?.n
    ?? (typeof mostrar?.revelar === "number" ? mostrar.revelar : undefined);
  const demoMao = mostrar?.flash?.mao
    ?? (typeof mostrar?.revelar === "object" ? mostrar.revelar.mao : undefined);

  const quantosObjetos = demo ?? spec.total ?? 0;
  const pontos = demo !== undefined
    // A cena de demonstração tem outra quantidade e por isso outras posições:
    // reaproveitar as da pergunta deixaria objetos sobrando ou faltando lugar.
    ? posicionarFileira(demo, "fila", () => 0.5)
    : (revelando && !acertou ? spec.pontosDaRevelacao : spec.pontos);

  const maosDaCena = demoMao !== undefined ? [maoCanonica(demoMao)] : (spec.maos ?? []);

  const objetosVisiveis = emAula
    ? (mostrar?.flash !== undefined || mostrar?.revelar !== undefined)
    : mostrandoObjetos;
  const paradoNaAula = emAula && mostrar?.revelar !== undefined;

  function areaDoRelance() {
    if (!objetosVisiveis) {
      if (emAula && mostrar?.fixarOlhar) return <PontoDeFixacao semMovimento={semMovimento} />;
      if (fase === "preparando") return <PontoDeFixacao semMovimento={semMovimento} />;
      if (fase === "regressiva") return <Regressiva semMovimento={semMovimento} />;
      // "O sumiço: desaparecem instantaneamente. A área fica limpa" (§4) — e o
      // print mostrou o que "limpa" virava: um retângulo branco vazio, que é
      // exatamente a moldura vazia lida como bug do Padrão Ouro §6.6.
      //
      // A área continua **sem objeto nenhum** (é isso que o relance exige), e
      // ganha uma marca ÚNICA e não contável dizendo que eles sumiram. Uma marca
      // só: qualquer coisa repetida ali seria contável, e a criança contaria a
      // marca em vez de lembrar do desenho.
      return <AreaVazia />;
    }

    if (spec.modo === "flash-mao") {
      return (
        <div
          role="group"
          aria-label={revelando || paradoNaAula ? "as mãos que apareceram" : "a área do relance"}
          className="flex h-full items-center justify-center gap-3"
        >
          {maosDaCena.map((m, i) => (
            <MaoDeDedos
              key={i}
              mao={m}
              revelando={revelando || paradoNaAula}
              // O erro suave mostra a mão cheia em bloco (§4): é a âncora do 5
              // aparecendo, e é ela que a criança precisa aprender a ver.
              destacarCheia={revelando && !acertou}
            />
          ))}
        </div>
      );
    }

    // O padrão de dado precisa de campo QUADRADO.
    //
    // As posições são percentuais, e a área é 330×176: a diagonal do dois saía
    // com 145px na horizontal contra 78px na vertical — dois objetos distantes,
    // não a figura ⚄. O andaime do nível 3 é justamente a figura ser
    // reconhecível como um todo (§5), e esticada ela não é. Mesma família do
    // §6.33: quando N peças compõem UMA figura, a geometria é decidida pela
    // figura, nunca herdada da caixa que calhou de existir.
    const arranjoAgora = revelando && !acertou ? "dado" : spec.arranjo;
    const quadrado = arranjoAgora === "dado" && demo === undefined;

    const fileira = (
      <EmojiRow
        emoji={spec.emoji ?? "⭐"}
        n={quantosObjetos}
        pontos={pontos}
        startIndex={1}
      />
    );

    return (
      <div
        role="group"
        // O rótulo não conta os objetos antes da resposta: contar aqui daria o
        // gabarito a quem ouve a tela. Na revelação, conta — o olho já viu.
        aria-label={revelando || paradoNaAula
          ? `${quantosObjetos} ${quantosObjetos === 1 ? "objeto" : "objetos"}`
          : "a área do relance"}
        className="flex h-full w-full items-center justify-center"
      >
        {/* Sem `state`: a §4 diz que quem brilha é o BOTÃO escolhido, e que os
            objetos apenas "reaparecem". Pintar a fileira de verde ou laranja
            acrescentaria ao cânone — e o `acerto` do token ainda aplica
            `scale-110` na caixa inteira, que a área recorta. */}
        {quadrado
          ? <div className="relative" style={{ width: alturaDoCampo, height: alturaDoCampo }}>{fileira}</div>
          : <div className="relative h-full w-full">{fileira}</div>}
      </div>
    );
  }

  /* ---------------------------------------------------------------- *
   *  O padrão — F52
   * ---------------------------------------------------------------- */

  function areaDoPadrao() {
    const seq = spec.sequencia;
    if (!seq) return null;
    const molduraAtiva = emAula ? mostrar?.molduraUnidade : undefined;
    const aceso = emAula && mostrar?.destacarSequencia === true;
    const pulsaLacuna = emAula
      ? mostrar?.pulsarLacuna === true
      : fase === "perguntando";
    /** A entrada elemento a elemento do §4. Fora dela, tudo já está na tela. */
    const entrando = fase === "entrando" && !emAula && !semMovimento;

    // A sequência cabe em UMA linha, sempre.
    //
    // Com casa fixa de 44px, as dez casas do ABC quebravam em duas linhas e a
    // segunda recentralizava: o padrão virava dois pedaços soltos. Padrão é
    // ritmo, e ritmo quebrado não se lê — a criança não tem como ver a
    // repetição que a ficha inteira existe para ensinar.
    //
    // O lado sai da figura inteira e é imposto a cada casa (§6.33), e a largura
    // é medida, não chutada (§6.16): nada rola na horizontal.
    const lado = Math.min(46, Math.floor((LARGURA_UTIL - VAO * (seq.casas.length - 1)) / seq.casas.length));

    return (
      <div
        role="group"
        aria-label="a sequência"
        className="flex h-full flex-nowrap items-center justify-center px-1"
        style={{ gap: VAO }}
      >
        {seq.casas.map((peca, i) => {
          const naMoldura = molduraAtiva?.includes(i) === true;
          const eLacuna = peca === null;
          const preenchida = eLacuna && escolha !== null;
          return (
            <motion.div
              key={i}
              className="flex shrink-0 items-center justify-center rounded-xl"
              style={{
                width: lado,
                height: lado,
                border: eLacuna
                  ? "3px dashed #6D28D9"
                  : naMoldura ? "3px solid #B45309" : "3px solid transparent",
                background: naMoldura ? "#FEF3C7" : aceso ? "#EEF2FF" : "#F8FAFC",
                lineHeight: 1,
              }}
              // A entrada elemento a elemento, no ritmo do §4 — é o ritmo que
              // faz a criança perceber a repetição antes de raciocinar sobre
              // ela. O atraso vem do índice, então a ordem é a da sequência.
              initial={entrando ? { opacity: 0, scale: 0.6 } : false}
              animate={semMovimento ? undefined : {
                opacity: 1,
                scale: (eLacuna && pulsaLacuna) ? [1, 1.12, 1] : 1,
              }}
              transition={(eLacuna && pulsaLacuna)
                ? { duration: 0.7, repeat: Infinity }
                : { duration: 0.22, delay: entrando ? (i * RITMO_DO_PADRAO) / 1000 : 0 }}
            >
              {peca
                ? <Peca peca={peca} lado={lado} />
                : preenchida
                  ? <Peca peca={seq.correta} lado={lado} />
                  : <span aria-hidden style={{ color: "#6D28D9", fontWeight: 900, fontSize: lado * 0.6 }}>?</span>}
            </motion.div>
          );
        })}
      </div>
    );
  }

  /* ---------------------------------------------------------------- *
   *  A tela
   * ---------------------------------------------------------------- */

  const perguntando = fase === "perguntando" || fase === "revelando";

  return (
    <div className="w-full max-w-[390px] px-3 py-2">
      {/* O enunciado NÃO sai aqui: o app já o desenha na caixa acima do palco
          (`GameLoop.tsx` → `q.prompt`). Imprimir de novo punha a pergunta duas
          vezes na tela — o §6.32, escondido porque a sonda montava o palco sem
          o enquadramento do app (RETOMADA §7.4). */}

      <div
        className="flex w-full flex-col overflow-hidden rounded-2xl border-2 border-slate-200 bg-white"
        // O relance precisa da altura: é nela que o padrão de dado ganha campo
        // quadrado. O padrão não — a sequência é uma linha, e uma moldura três
        // vezes mais alta que o conteúdo é vazio que a criança tenta interpretar.
        style={{ height: spec.modo === "padrao" ? ALTURA_DO_PADRAO : ALTURA_DA_AREA }}
      >
        <div className="relative w-full" style={{ height: alturaDoCampo }}>
          {spec.modo === "padrao" ? areaDoPadrao() : areaDoRelance()}
        </div>

        {/* O numeral da revelação vive DENTRO da área, colado à figura — solto
            embaixo dela ele encostava na barra de alternativas e lia como um
            quarto botão (número órfão, §6.34).
            E vive numa FAIXA PRÓPRIA, sempre reservada: sobreposto ao campo,
            ele imprimia por cima do objeto de baixo do padrão de dado. Colisão
            se resolve por construção, nunca por ajuste de pixel (§6.29) — com a
            faixa reservada não existe posição em que os dois se encontrem. */}
        {spec.modo !== "padrao" && (
          <p
            className="flex shrink-0 items-center justify-center text-lg font-black"
            style={{ height: FAIXA_DO_NUMERAL, color: "#22315C" }}
          >
            {(revelando || paradoNaAula) ? (() => {
              const n = paradoNaAula ? (demo ?? demoMao ?? 0) : (spec.total ?? 0);
              const coisa = spec.modo === "flash-mao" ? (n === 1 ? "dedo" : "dedos") : "";
              return `${n === 1 ? "Era" : "Eram"} ${n}${coisa ? " " + coisa : ""}`;
            })() : ""}
          </p>
        )}
      </div>

      {/* As alternativas SOBEM DA BASE, e só depois do silêncio (§4). Enquanto
          os objetos estão na tela elas não existem: o convite é a OLHAR. */}
      {!emAula && !perguntando && (
        <p
          className="py-5 text-center text-base font-black"
          // O roxo da marca dá 4.35:1 neste tamanho — um fio abaixo do mínimo.
          // Um passo mais escuro passa sem mudar a identidade (§6.30).
          style={{ color: "#5B3FD9" }}
        >
          👀 Olhe rápido…
        </p>
      )}

      {!emAula && perguntando && (
        <div
          role="group"
          aria-label="Alternativas"
          className="mt-3 flex flex-wrap justify-center gap-3"
        >
          {spec.alternativas.map(a => {
            const escolhida = escolha === a.valor;
            const certa = a.valor === spec.resposta;
            return (
              <motion.button
                key={String(a.valor)}
                type="button"
                onClick={() => escolher(a.valor)}
                disabled={disabled || escolha !== null}
                // O idioma do botão é o do app: mesma altura, mesmo raio, e a
                // sombra sólida de 5px que a criança já viu em todas as outras
                // competências. Com anel fino e sombra difusa, os botões liam
                // como desabilitados — desenho novo onde nada mudou (§6.36).
                className="flex min-h-[74px] min-w-[84px] items-center justify-center rounded-2xl px-4 transition-all active:translate-y-1"
                style={{
                  fontFamily: "inherit",
                  fontWeight: 800,
                  color: "#22315C",
                  // Branco sobre o cartão branco, o botão sumia: sobrava a
                  // sombra de baixo e os numerais pareciam soltos no ar. Só o
                  // print mostrou — no jsdom nada tem cor computada, e o axe
                  // também não vê (§6.30). A superfície precisa existir.
                  border: "2px solid #C7D7F0",
                  boxShadow: `0 4px 0 ${escolha !== null && certa ? "#2FB98C" : "#C7D7F0"}`,
                  fontSize: a.rotulo.length > 2 ? 22 : 30,
                  // §4: "o botão escolhido BRILHA". O verde do acerto e o âmbar
                  // do erro suave — sem X, sem penalidade, é a ficha inteira.
                  background: escolha === null ? "#F8FAFC"
                    : certa ? "#D1FAE5"
                      : escolhida ? "#FEF3C7" : "#F8FAFC",
                }}
                animate={semMovimento || !escolhida ? undefined : { scale: [1, 1.12, 1] }}
                transition={{ duration: 0.35 }}
              >
                {/* No padrão, a peça do banco é desenhada pelo MESMO componente
                    da casa. Com o rótulo em texto, três bolas saíam em fila no
                    banco e em cacho na sequência: duas figuras para a mesma
                    peça, e a criança tendo de deduzir que eram a mesma (§6.33). */}
                {pecaDoBanco(a.valor)
                  ? <Peca peca={pecaDoBanco(a.valor)!} lado={54} />
                  : a.rotulo}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Uma peça do padrão. No nível crescente ela é um GRUPO, não um item.
 *
 * **O mesmo desenho na casa e no banco.** O print mostrou três maçãs em cacho
 * dentro da casa e três maçãs em fila no banco: a criança via duas figuras e
 * tinha de deduzir que eram a mesma peça. É o §6.33 — quando a peça aparece em
 * dois lugares, a forma é decidida uma vez e imposta nos dois; só o `lado` muda.
 */
function Peca({ peca, lado }: { peca: PecaDoPadrao; lado: number }) {
  if (peca.quantidade <= 1) {
    return (
      <span aria-label={chaveDaPeca(peca)} style={{ fontSize: lado * 0.62, lineHeight: 1 }}>
        {peca.emoji}
      </span>
    );
  }
  // Duas colunas: um cacho compacto, que cabe na casa e no botão sem mudar de
  // proporção. Uma fila cresceria com a quantidade e estouraria a casa no 4.
  const colunas = Math.min(2, peca.quantidade);
  const corpo = lado / (colunas + 0.6);
  return (
    <span
      aria-label={`${peca.quantidade} peças`}
      className="grid place-items-center"
      style={{
        gridTemplateColumns: `repeat(${colunas}, 1fr)`,
        fontSize: corpo,
        lineHeight: 1,
      }}
    >
      {Array.from({ length: peca.quantidade }).map((_, i) => (
        <span key={i}>{peca.emoji}</span>
      ))}
    </span>
  );
}

/**
 * A área depois do sumiço.
 *
 * §3 e §4 mandam a área ficar **vazia** enquanto a criança responde — e o print
 * mostrou o que "vazia" virou: um retângulo branco de 176px sem nada, que é a
 * moldura vazia lida como bug do §6.6 ("uma pessoa que conhece o projeto leu
 * como defeito — logo uma criança lê também").
 *
 * A saída não é devolver objetos: é **uma** marca, não contável, dizendo que
 * eles sumiram. Duas marcas já seriam uma quantidade na tela de uma ficha cuja
 * pergunta é uma quantidade.
 */
function AreaVazia() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1">
      <span aria-hidden style={{ fontSize: 52, lineHeight: 1 }}>🙈</span>
      <span className="text-sm font-bold" style={{ color: "#6B7AA8" }}>
        Sumiram!
      </span>
    </div>
  );
}

/** §4 Preparação: "um ponto pisca no centro da área (fixa o olhar)". */
function PontoDeFixacao({ semMovimento }: { semMovimento: boolean | null }) {
  return (
    <div className="flex h-full items-center justify-center">
      <motion.span
        aria-hidden
        className="block rounded-full bg-indigo-600"
        style={{ width: 18, height: 18 }}
        animate={semMovimento ? undefined : { scale: [1, 0.6, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
    </div>
  );
}

/**
 * §4 Contagem regressiva: "três pulsos suaves: 3… 2… 1 (**só visual, sem número
 * escrito**)".
 *
 * O parêntese da ficha é a especificação inteira desta função. Escrever "3 2 1"
 * na tela numa competência de 4 anos, cuja pergunta é um número, poria três
 * numerais no ar imediatamente antes das alternativas — e a criança que ainda
 * não lê número veria só piscos, enquanto a que lê veria uma dica falsa.
 */
function Regressiva({ semMovimento }: { semMovimento: boolean | null }) {
  return (
    <div role="presentation" className="flex h-full items-center justify-center gap-4">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          aria-hidden
          className="block rounded-full bg-indigo-300"
          style={{ width: 14, height: 14 }}
          animate={semMovimento ? undefined : { scale: [0.7, 1.25, 0.7] }}
          transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}
