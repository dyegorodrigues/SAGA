import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { tokens } from "../../styles/tokens";
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

/** O arrasto só começa depois de 8px — o mesmo limiar do `TouchPlace`. */
const LIMIAR_DE_ARRASTO = 8;
/** Folga em volta de quem espera: dedo de criança não acerta o pixel. */
const RAIO_DE_ENTREGA = 28;

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

  /**
   * Errar não mata a questão.
   *
   * `respondido` existe para um toque não disparar `onAnswer` duas vezes. Ele
   * NÃO é o fim da questão — quem decide isso é o app, pelo `disabled`.
   *
   * Enquanto `disabled` for falso, o app ainda espera resposta: é o estado do
   * erro suave, em que ele diz "Olha de novo!" e devolve a vez. Sem esta
   * reabertura, a pergunta e os três botões sumiam da tela nesse instante e a
   * criança ficava sem nenhum jeito de responder — travada no primeiro
   * exercício da Jornada, com o × de sair como única saída.
   *
   * Numa resposta certa (ou no terceiro erro) o app marca o desfecho, o
   * `disabled` vira verdadeiro e a pergunta fica fechada, como deve.
   */
  React.useEffect(() => {
    if (!disabled && respondido) setRespondido(false);
  }, [disabled, respondido]);

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

  /**
   * O trajeto da mão fantasma: de onde a peça sai até onde ela chega.
   *
   * A coreografia da ficha diz "Assim, ó." e mandava `maoFantasma: true`. O
   * que isso fazia era PULSAR o primeiro receptor — e só. A peça nunca saía do
   * lugar. O pai abriu o primeiro exercício da Jornada e descreveu exatamente
   * o buraco: "não aparece indo a banana pro macaco".
   *
   * Uma demonstração que não demonstra o gesto é pior que nenhuma: ela ocupa
   * os dez segundos em que a criança estava prestando atenção e não ensina o
   * que fazer. Agora a peça VIAJA, e o trajeto é medido na tela (e não chutado
   * em pixels), porque a posição depende do arranjo, da quantidade e da
   * largura do aparelho.
   */
  const refDoPrimeiroReceptor = React.useRef<HTMLButtonElement | null>(null);
  const refDoPrimeiroItem = React.useRef<HTMLButtonElement | null>(null);
  const [trajeto, setTrajeto] = React.useState<{ dx: number; dy: number } | null>(null);

  React.useEffect(() => {
    if (!mostrar?.maoFantasma) { setTrajeto(null); return; }
    const alvo = refDoPrimeiroReceptor.current;
    const origem = refDoPrimeiroItem.current;
    if (!alvo || !origem) return;
    const a = alvo.getBoundingClientRect();
    const o = origem.getBoundingClientRect();
    // Sem layout (jsdom, ou tela ainda não medida) todas as caixas são zero:
    // animar por zero seria uma peça parada fingindo que anda.
    if (a.width === 0 || o.width === 0) return;
    setTrajeto({
      dx: (a.left + a.width / 2) - (o.left + o.width / 2),
      dy: (a.top + a.height / 2) - (o.top + o.height / 2),
    });
  }, [mostrar?.maoFantasma, spec, naBandeja]);

  const posDosReceptores = React.useMemo(
    () => posicoes(spec.receptores.quantidade, spec.arranjo),
    [spec.receptores.quantidade, spec.arranjo],
  );
  const posDosItens = React.useMemo(
    () => posicoes(spec.itens.quantidade, spec.arranjo === "cena" ? "espalhado" : spec.arranjo),
    [spec.itens.quantidade, spec.arranjo],
  );

  /**
   * ⚠️ O gesto que a aula ensina tem de funcionar.
   *
   * A demonstração desta ficha mostra a peça VIAJANDO da bandeja até quem
   * espera — fui eu que a fiz viajar, ao consertar a mão fantasma parada. Só
   * que a bandeja era feita de `<span aria-hidden>`: não recebia dedo nenhum.
   * A aula ensinava arrastar e o palco só aceitava tocar no destino. O pai
   * fez exatamente o que viu e nada aconteceu:
   *
   * > *"ele não arrasta, eu tenho que clicar no bichinho lá pra frutinha ir
   * > pra ele. Então esse drag and drop não tá funcionando."*
   *
   * Demonstração que ensina um gesto recusado é pior que nenhuma: a criança
   * faz o que viu, não acontece nada, e conclui que errou.
   *
   * As DUAS portas ficam abertas. A §8.3-bis proíbe exigir precisão de dedo,
   * então tocar em quem espera continua entregando; arrastar passa a ser o
   * gesto natural para quem já tentou arrastar. Mesmo limiar de 8px do
   * `TouchPlace`, para um toque simples não ser roubado pelo detector.
   */
  const refsDosReceptores = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [arrasto, setArrasto] = React.useState<{ id: number; x: number; y: number; ativo: boolean; x0: number; y0: number } | null>(null);
  const [receptorSobODedo, setReceptorSobODedo] = React.useState(-1);

  /** Qual receptor está sob este ponto da tela. Geometria, não `elementFromPoint`. */
  function receptorEm(x: number, y: number): number {
    let melhor = -1;
    let menorDistancia = Infinity;
    refsDosReceptores.current.forEach((el, i) => {
      if (!el || porReceptor[i] > 0) return;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dentro = x >= r.left - RAIO_DE_ENTREGA && x <= r.right + RAIO_DE_ENTREGA
        && y >= r.top - RAIO_DE_ENTREGA && y <= r.bottom + RAIO_DE_ENTREGA;
      if (!dentro) return;
      const d = Math.hypot(x - cx, y - cy);
      if (d < menorDistancia) { menorDistancia = d; melhor = i; }
    });
    return melhor;
  }

  function comecarArrasto(e: React.PointerEvent<HTMLButtonElement>) {
    if (travado || naBandeja <= 0) return;
    setArrasto({ id: e.pointerId, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, ativo: false });
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* sem capture */ }
  }

  function moverArrasto(e: React.PointerEvent<HTMLButtonElement>) {
    const atual = arrasto;
    if (!atual || atual.id !== e.pointerId) return;
    const virou = atual.ativo
      || Math.hypot(e.clientX - atual.x0, e.clientY - atual.y0) >= LIMIAR_DE_ARRASTO;
    setArrasto({ ...atual, x: e.clientX, y: e.clientY, ativo: virou });
    setReceptorSobODedo(virou ? receptorEm(e.clientX, e.clientY) : -1);
  }

  function soltarArrasto(e: React.PointerEvent<HTMLButtonElement>) {
    const atual = arrasto;
    setArrasto(null);
    setReceptorSobODedo(-1);
    if (!atual || atual.id !== e.pointerId) return;
    if (!atual.ativo) {
      // Toque simples na peça: entrega no primeiro que ainda está sem. É a
      // mesma entrega do toque no receptor, começada pelo outro lado.
      const vazio = porReceptor.findIndex(n => n === 0);
      if (vazio >= 0) tocarReceptor(vazio);
      return;
    }
    const alvo = receptorEm(e.clientX, e.clientY);
    // Soltar fora não pune: a peça volta para a bandeja, calada.
    if (alvo >= 0) tocarReceptor(alvo);
  }

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

  /**
   * O holofote da aulinha: destaca sem apagar.
   *
   * Era 0,35 — e 35% de opacidade é o desenho universal de "desligado". Nos
   * passos da demonstração as duas fileiras se revezavam nesse estado, e o que
   * a criança via era a tela piscando entre acesa e apagada. O pai chamou de
   * "muda, pisca, muda", e é exatamente isso.
   *
   * Holofote é diferença, não apagão: 0,7 destaca e mantém a fileira legível.
   */
  const realce = (qual: "receptores" | "itens") =>
    !mostrar?.destacarFileira || mostrar.destacarFileira === qual ? 1 : 0.7;

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
            ref={el => {
              refsDosReceptores.current[i] = el;
              if (i === 0) refDoPrimeiroReceptor.current = el;
            }}
            type="button"
            onClick={() => tocarReceptor(i)}
            disabled={travado}
            // Sem número no rótulo: "este ainda está sem" / "este já tem".
            aria-label={tem > 0 ? "Este já tem" : "Este ainda está sem"}
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-3xl"
            style={{
              // Sob o dedo, quem espera ACENDE: é o único jeito de a criança
              // saber que soltar ali vale, antes de soltar.
              borderColor: receptorSobODedo === i
                ? tokens.cor.acao.secundaria
                : tem > 0 ? "#16A34A" : "#CBD5E1",
              borderStyle: tem > 0 || receptorSobODedo === i ? "solid" : "dashed",
              background: receptorSobODedo === i
                ? `color-mix(in srgb, ${tokens.cor.acao.secundaria} 14%, transparent)`
                : tem > 0 ? "#F0FDF4" : "#F8FAFC",
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
        className="relative flex min-h-[60px] w-full flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-3 transition-opacity"
        style={{ opacity: realce("itens") }}
      >
        {Array.from({ length: Math.max(naBandeja, 0) }, (_, i) => (
          <motion.button
            key={i}
            ref={i === 0 ? refDoPrimeiroItem : undefined}
            type="button"
            disabled={travado}
            onPointerDown={comecarArrasto}
            onPointerMove={moverArrasto}
            onPointerUp={soltarArrasto}
            onPointerCancel={() => { setArrasto(null); setReceptorSobODedo(-1); }}
            // Sem numeral, como a ficha exige — e sem "arraste", porque a
            // criança desta faixa não lê. Quem ensina o gesto é a aula.
            aria-label={`Dar para quem espera: ${spec.itens.nome}`}
            className="flex h-11 w-11 items-center justify-center text-3xl"
            style={{
              transform: `translate(${posDosItens[i]?.x ?? 0}px, ${posDosItens[i]?.y ?? 0}px)`,
              touchAction: "none",
              opacity: arrasto?.ativo && i === 0 ? 0.35 : 1,
            }}
            animate={mostrar?.pulsar && i === 0 && !reduzido ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.8, repeat: mostrar?.pulsar ? Infinity : 0 }}
          >
            <span aria-hidden="true">{spec.itens.emoji}</span>
          </motion.button>
        ))}
        {naBandeja <= 0 && (
          // Moldura vazia lê como bug (§6.6): a bandeja vazia se explica.
          <span className="text-sm font-bold text-slate-500">Acabou!</span>
        )}

        {/* A peça que VIAJA: é ela que ensina o gesto. Sai da bandeja, chega em
            quem espera, e recomeça — em laço, porque a criança de quatro anos
            costuma olhar para a tela no meio, e não no começo. */}
        {trajeto && !reduzido && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute text-3xl"
            style={{ left: "50%", top: "50%", zIndex: 30 }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.9 }}
            animate={{
              x: [0, trajeto.dx, trajeto.dx],
              y: [0, trajeto.dy, trajeto.dy],
              opacity: [0, 1, 1, 0],
              scale: [0.9, 1.15, 1],
            }}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.5, times: [0, 0.65, 0.85, 1] }}
          >
            {spec.itens.emoji}
          </motion.span>
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
