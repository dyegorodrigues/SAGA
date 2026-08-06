import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { PareamentoSpec } from "../../curriculum/procedimentos/pareamentoContract";
import { AcaoDePareamento, Desfecho } from "../../curriculum/procedimentos/pareamentoProcedure";

/**
 * A tela de N1.01 — ficha F07, "Um pra cada".
 *
 * ---
 *
 * ### Por que não reusei o `DragGroup`
 *
 * Ele foi feito para **divisão**: distribui em caixas e aceita mais de um por
 * caixa. Aqui a regra é o oposto — *um e só um* —, e falta tudo o que a F07
 * pede: sobra e falta, a pergunta final, os três arranjos, a Mão Fantasma.
 *
 * Ele também carrega um texto fixo por dentro (*"Dê uma comidinha para cada
 * bichinho!"*) que deveria vir da ficha. Reusar o componente teria arrastado
 * essa violação para uma competência nova.
 *
 * ### ⚠️ Nenhum numeral, em lugar nenhum
 *
 * Nem na tela, nem nos rótulos de acessibilidade. A criança que ainda não
 * entende cardinalidade lê "4" como símbolo sem sentido — e, pior, aprende que
 * a resposta se acha contando, que é o contrário do que a ficha ensina.
 *
 * ### A pergunta é o coração
 *
 * Não é *"quantos?"* — é *"sobrou?"*. E no nível 5 ela vem **antes** de
 * distribuir: prever se dá para todos é o começo do raciocínio comparativo.
 */

interface Props {
  spec: PareamentoSpec;
  /** Recebe o desfecho escolhido e o que a ação revelou. */
  onAnswer?: (valor: Desfecho, acao: AcaoDePareamento) => void;
  disabled?: boolean;
  /** O passo atual da micro-aula, vindo do `tutShow` do GameLoop. */
  mostrar?: {
    destacarFileira?: "receptores" | "itens";
    maoFantasma?: boolean;
    pulsar?: boolean;
  } | null;
}

/** Onde cada peça fica, por arranjo. Semente fixa: a cena não pula a cada render. */
function posicoes(quantas: number, arranjo: PareamentoSpec["arranjo"]): { x: number; y: number }[] {
  if (arranjo === "fila") {
    return Array.from({ length: quantas }, () => ({ x: 0, y: 0 }));
  }
  // Espalhado e cena usam deslocamentos pequenos e DETERMINÍSTICOS: a criança
  // precisa achar as peças, não persegui-las. Aleatório a cada render faria a
  // tela tremer entre um toque e outro.
  return Array.from({ length: quantas }, (_, i) => ({
    x: arranjo === "cena" ? ((i * 37) % 40) - 20 : ((i * 23) % 24) - 12,
    y: arranjo === "cena" ? ((i * 53) % 32) - 16 : ((i * 17) % 14) - 7,
  }));
}

export function PareamentoStage({ spec, onAnswer, disabled, mostrar }: Props) {
  const reduzido = Boolean(useReducedMotion());
  const [porReceptor, setPorReceptor] = React.useState<number[]>(
    () => Array(spec.receptores.quantidade).fill(0),
  );
  const [respondido, setRespondido] = React.useState(false);

  React.useEffect(() => {
    setPorReceptor(Array(spec.receptores.quantidade).fill(0));
    setRespondido(false);
  }, [spec]);

  const colocados = porReceptor.reduce((s, n) => s + n, 0);
  const naBandeja = spec.itens.quantidade - colocados;
  const acao: AcaoDePareamento = { porReceptor, naBandeja };

  /** Acabou de distribuir: ou a bandeja esvaziou, ou todos já receberam. */
  const distribuiuTudo = naBandeja === 0 || porReceptor.every(n => n > 0);
  const perguntaAgora = spec.pergunta !== null
    && !respondido
    && (spec.momentoDaPergunta === "antes" || distribuiuTudo);
  /** No nível 5 a criança prevê antes: até responder, não se mexe nas peças. */
  const travado = Boolean(disabled) || (spec.momentoDaPergunta === "antes" && !respondido);

  const posDosReceptores = React.useMemo(
    () => posicoes(spec.receptores.quantidade, spec.arranjo),
    [spec.receptores.quantidade, spec.arranjo],
  );
  const posDosItens = React.useMemo(
    () => posicoes(spec.itens.quantidade, spec.arranjo === "cena" ? "espalhado" : spec.arranjo),
    [spec.itens.quantidade, spec.arranjo],
  );

  function tocarReceptor(i: number) {
    if (travado) return;
    setPorReceptor(atual => {
      const novo = [...atual];
      // Um e só um: tocar um receptor cheio devolve a peça em vez de empilhar.
      if (novo[i] > 0) novo[i] -= 1;
      else if (naBandeja > 0) novo[i] += 1;
      return novo;
    });
  }

  function responder(d: Desfecho) {
    if (respondido || disabled) return;
    setRespondido(true);
    onAnswer?.(d, { ...acao, respostaDaPergunta: d });
  }

  const realce = (qual: "receptores" | "itens") =>
    !mostrar?.destacarFileira || mostrar.destacarFileira === qual ? 1 : 0.35;

  return (
    <div className="flex w-full flex-col items-center gap-4 select-none">
      {/* O enunciado não sai aqui: o app já o desenha acima do palco. Ver a
          nota igual em `TouchCount` e o teste `palcoUnico`. */}

      {/* Quem recebe. Fica em cima, como manda a F07 §3. */}
      <div
        role="group"
        aria-label={`Esperando: ${spec.receptores.nome}`}
        className="flex min-h-[76px] w-full flex-wrap items-end justify-center gap-3 transition-opacity"
        style={{ opacity: realce("receptores") }}
      >
        {porReceptor.map((tem, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => tocarReceptor(i)}
            disabled={travado}
            // Sem número no rótulo: "este ainda está sem" / "este já tem".
            aria-label={tem > 0 ? "Este já tem" : "Este ainda está sem"}
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-3xl"
            style={{
              borderColor: tem > 0 ? "#16A34A" : "#CBD5E1",
              borderStyle: tem > 0 ? "solid" : "dashed",
              background: tem > 0 ? "#F0FDF4" : "#F8FAFC",
              transform: `translate(${posDosReceptores[i]?.x ?? 0}px, ${posDosReceptores[i]?.y ?? 0}px)`,
            }}
            animate={mostrar?.maoFantasma && i === 0 && !reduzido ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={{ duration: 0.7, repeat: mostrar?.maoFantasma ? Infinity : 0, repeatDelay: 0.6 }}
          >
            <span aria-hidden="true">{spec.receptores.emoji}</span>
            {tem > 0 && (
              <span aria-hidden="true" className="absolute -top-3 text-2xl">
                {spec.itens.emoji}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* A bandeja: o que ainda não foi entregue. */}
      <div
        role="group"
        aria-label={naBandeja > 0 ? `Ainda na bandeja: ${spec.itens.nome}` : "A bandeja está vazia"}
        className="flex min-h-[60px] w-full flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-3 transition-opacity"
        style={{ opacity: realce("itens") }}
      >
        {Array.from({ length: Math.max(naBandeja, 0) }, (_, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="text-3xl"
            style={{ transform: `translate(${posDosItens[i]?.x ?? 0}px, ${posDosItens[i]?.y ?? 0}px)` }}
            animate={mostrar?.pulsar && i === 0 && !reduzido ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.8, repeat: mostrar?.pulsar ? Infinity : 0 }}
          >
            {spec.itens.emoji}
          </motion.span>
        ))}
        {naBandeja <= 0 && (
          // Moldura vazia lê como bug (§6.6): a bandeja vazia se explica.
          <span className="text-sm font-bold text-slate-500">Acabou!</span>
        )}
      </div>

      {perguntaAgora && (
        <div className="flex w-full flex-col items-center gap-2">
          <p className="text-center text-lg font-black text-slate-700">{spec.pergunta}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {spec.respostas.map(r => (
              <button
                key={r.desfecho}
                type="button"
                onClick={() => responder(r.desfecho)}
                className="min-h-[48px] rounded-2xl border-2 border-indigo-300 bg-indigo-50 px-4 py-2 text-base font-black text-indigo-800"
              >
                {r.rotulo}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
