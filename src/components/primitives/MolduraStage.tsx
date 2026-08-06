import React from "react";
import { motion } from "motion/react";
import { TenFrame } from "./TenFrame";
import { PalcoEscalado } from "./PalcoEscalado";
import { LARGURA_DE_PROJETO, MolduraSpec } from "../../curriculum/procedimentos/tenFrameContract";
import { AcaoDaMoldura, FALAS } from "../../curriculum/procedimentos/tenFrameProcedure";

/**
 * `MolduraStage` — a tela das três fichas da moldura de dez.
 *
 * | ficha | competência | pergunta |
 * |---|---|---|
 * | F02 | N1.08 | *"quantas você vê?"* |
 * | JD3 | N1.11 | *"quantos faltam pra encher?"* |
 * | JD5 | N1.10 | *"quantos ficaram escondidos?"* |
 *
 * ---
 *
 * ### A coreografia da JD3, que é o conteúdo da ficha
 *
 * > §4: *"a moldura **vazia** aparece por 600ms — a criança vê o alvo antes de
 * > ver o preenchimento."* … *"as fichas somem. **A moldura vazia permanece
 * > 300ms** e depois some também — o vazio é a última coisa que a criança vê."*
 * >
 * > *"Por que a moldura vazia aparece antes e fica depois: a competência é
 * > sobre o vazio. Se o vazio só existir junto com o cheio, a criança olha para
 * > o cheio."*
 *
 * O modo legado fazia o oposto: escondia moldura e fichas de uma vez e punha um
 * 🙈 no lugar. A ficha inteira mora nesses 300ms.
 *
 * ### E o acerto da F02
 *
 * > §4: *"o momento pedagógico central é o acerto: a fileira acender **inteira
 * > de uma vez** é o que ensina a ver 5 como unidade. Se acender célula por
 * > célula, ensina contagem — o oposto."*
 */

export type FaseDaMoldura =
  | "preparando" | "regressiva" | "mostrando" | "vazio"
  | "tampando" | "perguntando" | "revelando";

/** §4 da JD3: a moldura vazia antes, a regressiva, e o vazio que sobra depois. */
const PREPARO_MS = 600;
const REGRESSIVA_MS = 900;
const VAZIO_DEPOIS_MS = 300;
/** §4 da JD5: a tampa desliza — devagar o bastante para ver, rápido o bastante para não contar. */
const TAMPA_MS = 700;

interface Props {
  spec: MolduraSpec;
  onAnswer?: (valor: number, acao: AcaoDaMoldura) => void;
  disabled?: boolean;
  falar?: (texto: string) => void;
  /** Prende a fase — a sonda mede um estado por vez. */
  fase?: FaseDaMoldura;
  /** O passo da micro-aula (§8). */
  mostrar?: {
    destacarFileira?: 1 | 2;
    piscarFileira?: 1 | 2;
    contar?: number;
    moldura?: { vazia?: boolean };
    flash?: unknown;
    preencherFaltantes?: number;
    contarUmAUm?: number;
    taparN?: number;
    pulsarTampa?: boolean;
  } | null;
}

export function MolduraStage({ spec, onAnswer, disabled, falar, fase: faseFixa, mostrar }: Props) {
  const [faseInterna, setFaseInterna] = React.useState<FaseDaMoldura>(
    spec.modo === "faltam" ? "preparando" : "mostrando",
  );
  const [escolha, setEscolha] = React.useState<number | null>(null);
  const relogios = React.useRef<number[]>([]);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const fase: FaseDaMoldura = escolha !== null ? "revelando" : (faseFixa ?? faseInterna);
  const acertou = escolha !== null && escolha === spec.resposta;

  React.useEffect(() => {
    relogios.current.forEach(window.clearTimeout);
    relogios.current = [];
    if (faseFixa || emAula) return;

    const agenda = (fn: () => void, ms: number) => {
      relogios.current.push(window.setTimeout(fn, ms));
    };

    if (spec.modo === "faltam") {
      // A moldura vazia primeiro: a criança vê o ALVO antes do preenchimento.
      setFaseInterna("preparando");
      agenda(() => setFaseInterna("regressiva"), PREPARO_MS);
      agenda(() => setFaseInterna("mostrando"), PREPARO_MS + REGRESSIVA_MS);
      const some = PREPARO_MS + REGRESSIVA_MS + (spec.flashMs ?? 1200);
      // O vazio é a ÚLTIMA coisa que ela vê. Estes 300ms são a ficha.
      agenda(() => setFaseInterna("vazio"), some);
      agenda(() => setFaseInterna("perguntando"), some + VAZIO_DEPOIS_MS);
    } else if (spec.modo === "escondidos") {
      setFaseInterna("mostrando");
      // §4: a contagem em voz alta na abertura é OBRIGATÓRIA nos níveis 1-2 —
      // "sem ela, a criança não constrói o total na memória e o exercício vira
      // adivinhação".
      if (spec.contaEmVozAlta) falar?.(contagemDoTotal(spec.total ?? 0));
      agenda(() => setFaseInterna("tampando"), 2500);
      agenda(() => setFaseInterna("perguntando"), 2500 + TAMPA_MS + 500);
    } else if (spec.flashMs) {
      setFaseInterna("mostrando");
      agenda(() => setFaseInterna("perguntando"), spec.flashMs);
    } else {
      setFaseInterna("perguntando");
    }

    return () => relogios.current.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec, faseFixa, emAula]);

  function escolher(valor: number) {
    if (disabled || escolha !== null) return;
    setEscolha(valor);
    const certo = valor === spec.resposta;
    if (spec.modo === "faltam") {
      falar?.(certo
        ? FALAS.faltam.acerto(spec.cheias, spec.resposta)
        : FALAS.faltam.erroSuave(spec.resposta));
    } else if (spec.modo === "escondidos") {
      falar?.(certo
        ? FALAS.escondidos.acerto(spec.resposta)
        : FALAS.escondidos.erroSuave(spec.resposta));
    } else {
      falar?.(certo ? FALAS.contar.acerto(spec.resposta) : FALAS.contar.erroSuave);
    }
    onAnswer?.(valor, {
      modo: spec.modo,
      nivel: spec.nivel,
      resposta: valor,
      alvo: spec.resposta,
      cheias: spec.cheias,
      casas: spec.casas,
      visiveis: spec.visiveis,
      total: spec.total,
      disperso: spec.disperso,
      semMoldura: spec.semMoldura,
    });
  }

  /**
   * ⚠️ A tampa levanta na revelação — **inclusive no erro**.
   *
   * §4 da JD5: no acerto *"a tampa levanta revelando os escondidos, que piscam
   * juntos"*; no erro suave *"a tampa levanta devagar, revelando um por um, e a
   * voz conta os escondidos"*. Nas duas ela levanta, e é ela levantando que
   * responde a pergunta. Mantê-la fechada no erro esconde exatamente a
   * informação que o erro pediu.
   */
  const escondendo = spec.modo === "escondidos"
    && (fase === "tampando" || fase === "perguntando");
  const tapadas = escondendo || (emAula && mostrar?.taparN)
    ? spec.ocupadas.slice(-(mostrar?.taparN ?? spec.escondidas ?? 0))
    : [];
  // §4, fecho: "os dois subgrupos separados por cor — os que ficaram e os que
  // sumiram". Só na revelação; antes disso não há o que separar.
  const revelados = spec.modo === "escondidos" && fase === "revelando"
    ? spec.ocupadas.slice(-(spec.escondidas ?? 0))
    : [];

  /**
   * ⚠️ Com a pergunta no ar, a área fica VAZIA — e vazia quer dizer sem moldura.
   *
   * A JD3 §3 é literal: *"a moldura de 10 … aparece e some. **A área fica vazia
   * enquanto ela responde.**"* E a §4 fecha: a moldura vazia dura 300ms *"e
   * depois some também"*.
   *
   * Eu tinha deixado a moldura vazia na tela durante a resposta, e isso não é
   * um detalhe de encenação: com as dez casas à vista, a criança **conta as
   * vazias uma a uma** — que é precisamente o que a §7 proíbe o `explain` de
   * sugerir, e o que a ficha inteira existe para dispensar. O print mostrou.
   *
   * Vale também para o nível 4 da F02, cuja §5 diz *"flash de 2 segundos (a
   * moldura some)"*. Onde não houve flash (F02 níveis 3 e 5), a moldura fica —
   * ali a criança olha e responde, e esconder seria inventar outra ficha.
   */
  const areaVazia = fase === "perguntando" && (spec.modo === "faltam" || spec.flashMs !== null);

  return (
    <PalcoEscalado>
    <div className="flex flex-col items-center gap-3 select-none" style={{ width: LARGURA_DE_PROJETO }}>
      {fase === "regressiva" ? (
        <Regressiva />
      ) : areaVazia ? (
        <AreaSumida />
      ) : (
        <TenFrame
          moldura={{
            casas: spec.casas,
            ocupadas: spec.ocupadas,
            tapadas,
            revelados,
            // §6.34: o enunciado da F02 nomeia estrelas, ovos ou medalhas, e a
            // criança desta faixa não lê — a única pergunta é a falada. Disco
            // azul genérico com a voz pedindo estrelas é voz e tela dizendo
            // coisas diferentes.
            emoji: spec.emoji,
            // §4 da F02, fecho: o numeral grande semitransparente sobre a
            // moldura. Só no modo `contar` — nas outras duas o número da
            // resposta não é o que está desenhado.
            numeralDoFecho: fase === "revelando" && spec.modo === "contar" ? spec.resposta : null,
            semMoldura: spec.semMoldura && fase !== "revelando",
            // A moldura VAZIA: antes do flash e — o que a ficha exige — depois
            // dele, sozinha por 300ms.
            soAMoldura: fase === "preparando" || fase === "vazio"
              || (emAula && mostrar?.moldura?.vazia === true),
            // §4 da F02: a fileira acende INTEIRA, e só no acerto ou na aula.
            fileiraAcesa: emAula
              ? (mostrar?.destacarFileira ?? mostrar?.piscarFileira ?? null)
              : (fase === "revelando" && acertou && spec.cheias >= 5 ? 1 : null),
            // JD3, acerto: as casas que faltavam se preenchem sozinhas.
            preencherFaltantes: (fase === "revelando" && acertou && spec.modo === "faltam")
              || (emAula && mostrar?.preencherFaltantes !== undefined),
            // JD3, erro: as vazias piscam EM BLOCO, nunca uma a uma.
            piscarVazias: fase === "revelando" && !acertou && spec.modo === "faltam",
          }}
        />
      )}

      {/* As alternativas. O palco desenha as suas — como a fileira do relance —
          porque o diagnóstico e a evidência da §9 dependem do que a CENA
          mostrava, e isso não cabe no valor de uma alternativa da barra. */}
      <div role="group" aria-label="Números" className="flex flex-wrap justify-center gap-3" style={{ minHeight: 64 }}>
        {(fase === "perguntando" || fase === "revelando") && spec.alternativas.map(v => {
          const certa = v === spec.resposta;
          const marcada = escolha === v;
          return (
            <motion.button
              key={v}
              type="button"
              disabled={disabled || escolha !== null}
              onClick={() => escolher(v)}
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-black"
              style={{
                backgroundColor: escolha === null ? "#F8FAFC"
                  : certa ? "#D1FAE5" : marcada ? "#FEF3C7" : "#F8FAFC",
                border: `2px solid ${escolha !== null && certa ? "#16A34A" : "#C7D7F0"}`,
                color: "#22315C",
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, scale: marcada && certa ? 1.12 : 1 }}
            >
              {v}
            </motion.button>
          );
        })}
      </div>
    </div>
    </PalcoEscalado>
  );
}

/**
 * A área depois do sumiço.
 *
 * §6.6 — retângulo vazio lê como bug: *"uma pessoa que conhece o projeto leu
 * como defeito, logo uma criança lê também"*. E o que ocupa o lugar não pode ser
 * **contável**, numa tela cuja pergunta é uma quantidade. Uma marca só, a mesma
 * do relance da JD1.
 */
function AreaSumida() {
  return (
    <div className="flex h-[136px] flex-col items-center justify-center gap-1">
      <span className="text-5xl" aria-hidden>🙈</span>
      <span className="text-sm font-bold" style={{ color: "#64748B" }}>Sumiu!</span>
    </div>
  );
}

/** §4: "três pulsos suaves: 3... 2... 1 (só visual, sem número escrito)". */
function Regressiva() {
  return (
    <div role="presentation" className="flex h-[136px] items-center justify-center gap-4">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          aria-hidden
          className="block rounded-full bg-indigo-300"
          style={{ width: 14, height: 14 }}
          animate={{ scale: [0.7, 1.25, 0.7] }}
          transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}

/**
 * §4 da JD5: *"a voz conta em voz alta: 'um, dois, três, quatro, cinco.
 * Cinco!' — a contagem em voz alta ancora o total"*.
 *
 * A ficha marca isto como **obrigatório**: *"sem ela, a criança não constrói o
 * total na memória e o exercício vira adivinhação"*.
 */
function contagemDoTotal(total: number): string {
  const nomes = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez"];
  const ate = Array.from({ length: total }, (_, i) => nomes[i + 1]).join(", ");
  const ultimo = nomes[total] ?? String(total);
  return `${ate}. ${ultimo.charAt(0).toUpperCase()}${ultimo.slice(1)}!`;
}
