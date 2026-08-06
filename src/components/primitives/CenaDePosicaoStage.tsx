import React from "react";
import { motion } from "motion/react";
import { ShapeCanvas } from "./ShapeCanvas";
import {
  ALTURA_DA_CENA,
  ALVO_MINIMO,
  LARGURA_DA_CENA,
  Ponto,
  PosicaoSpec,
  posicaoDoPonto,
} from "../../curriculum/procedimentos/posicaoContract";
import { AcaoDePosicao, FALAS, Preposicao } from "../../curriculum/procedimentos/posicaoProcedure";

/**
 * `CenaDePosicaoStage` — a tela de GE.01, ficha F47.
 *
 * Composta a partir do `ShapeCanvas` **em modo cena**, que é o que a §1 nomeia.
 *
 * ---
 *
 * ### As três coisas que só existem aqui
 *
 * 1. **O referencial é tocável.** Com dois objetos na cena — o que a §3 manda —
 *    todo erro de escolha é, por construção, o objeto oposto: `INVERTE_PAR`
 *    seria a única tag possível e as outras duas da §6 nunca existiriam. Tocar
 *    a mesa quando a pergunta é *"qual objeto está embaixo da mesa"* é
 *    literalmente escolher sem olhar em relação a quê.
 * 2. **O erro descreve onde o objeto está.** §4: *"esse está em cima. Eu pedi
 *    embaixo."* — *"o erro vira aula de vocabulário"*.
 * 3. **O nível 5 não tem zona marcada.** Ela solta onde quiser e a cena lê a
 *    relação. Marcar as duas zonas devolveria a múltipla escolha que o nível 5
 *    existe para tirar.
 */

interface Props {
  spec: PosicaoSpec;
  onAnswer?: (valor: string, acao: AcaoDePosicao) => void;
  disabled?: boolean;
  /** A voz do app. §4: ela descreve a posição no erro e confirma no acerto. */
  falar?: (texto: string) => void;
  /** O passo da micro-aula (§8). */
  mostrar?: {
    /** §8: "Esta é a mesa." */
    destacarReferencial?: boolean;
    /** §8: "Esta bola está em cima." — o índice do objeto. */
    destacarObjeto?: number;
  } | null;
}

export function CenaDePosicaoStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const campo = React.useRef<HTMLDivElement>(null);
  const [escolhida, setEscolhida] = React.useState<Preposicao | null>(null);
  const [tocouReferencial, setTocouReferencial] = React.useState(false);
  const [respondeu, setRespondeu] = React.useState(false);
  const [naMao, setNaMao] = React.useState(false);
  const [posto, setPosto] = React.useState<Ponto | null>(null);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const travado = disabled || respondeu || emAula;

  function responder(onde: Preposicao | null) {
    if (travado) return;
    if (onde === null) {
      // Tocar a referência não encerra a questão: ela recebe a aula e continua.
      // Encerrar aqui puniria uma criança que ainda está entendendo a pergunta,
      // e o §8.3-bis diz que a tela não cobra protocolo, cobra compreensão.
      setTocouReferencial(true);
      falar?.(FALAS.erroDoReferencial(spec.referencial.nome, spec.pedida));
      onAnswer?.("referencial", { pedida: spec.pedida, escolhida: null, par: spec.par });
      return;
    }
    setEscolhida(onde);
    setRespondeu(true);
    falar?.(onde === spec.pedida
      ? FALAS.acerto(spec.pedida, spec.referencial.doNome)
      : FALAS.erroSuave(onde, spec.pedida));
    onAnswer?.(onde, { pedida: spec.pedida, escolhida: onde, par: spec.par });
  }

  /** Nível 5: ela solta onde quiser, e a cena lê a relação (§5). */
  function soltar(e: React.MouseEvent | React.TouchEvent) {
    if (travado || !spec.produz || !naMao) return;
    const r = campo.current?.getBoundingClientRect();
    const p = "touches" in e ? e.changedTouches[0] : (e as React.MouseEvent);
    const ponto: Ponto = (!r || !r.width || !r.height || !p)
      ? { x: LARGURA_DA_CENA / 2, y: ALTURA_DA_CENA / 2 }
      : {
        x: ((p.clientX - r.left) / r.width) * LARGURA_DA_CENA,
        y: ((p.clientY - r.top) / r.height) * ALTURA_DA_CENA,
      };
    setPosto(ponto);
    setNaMao(false);
    responder(posicaoDoPonto(spec, ponto));
  }

  const objetoAtras = spec.objetos.filter(o => o.atras);
  const objetoNaFrente = spec.objetos.filter(o => !o.atras);

  function desenhoDoObjeto(o: typeof spec.objetos[number], i: number) {
    const certo = respondeu && o.posicao === spec.pedida;
    const errado = respondeu && o.posicao === escolhida && escolhida !== spec.pedida;
    const emFoco = emAula && mostrar?.destacarObjeto === spec.objetos.indexOf(o);
    return (
      <motion.button
        key={`obj-${i}`}
        type="button"
        disabled={travado}
        onClick={() => responder(o.posicao)}
        // A área é sempre ≥ 80px, mesmo quando o desenho é menor e mesmo quando
        // o muro tapa metade dele: as peças da cena não capturam toque, então o
        // que está atrás continua alcançável pelo dedo (§8.3-bis).
        aria-label={`Objeto ${o.posicao} ${spec.referencial.doNome}`}
        className="absolute flex items-center justify-center"
        style={{
          left: o.x - ALVO_MINIMO / 2,
          top: o.y - ALVO_MINIMO / 2,
          width: ALVO_MINIMO,
          height: ALVO_MINIMO,
          background: "transparent",
          border: "none",
          padding: 0,
          fontSize: o.tamanho,
          lineHeight: 1,
        }}
        // §4, acerto: "o objeto certo sobe flutuando". Erro: ele balança.
        animate={{
          y: certo ? -10 : 0,
          x: errado ? [0, -6, 6, 0] : 0,
          scale: certo ? 1.15 : (emFoco ? [1, 1.12, 1] : 1),
        }}
        transition={{ duration: errado ? 0.4 : 0.5, repeat: emFoco ? Infinity : 0 }}
      >
        <span aria-hidden>{o.emoji}</span>
        {/* §4, fecho: "os dois objetos rotulados com sua posição". O rótulo só
            entra depois da resposta — antes, ele seria o gabarito escrito. */}
        {respondeu && (
          <span
            aria-hidden
            className="absolute rounded-lg px-1.5"
            style={{
              top: o.tamanho - 2,
              fontSize: 12,
              fontWeight: 800,
              color: certo ? "#15803D" : "#475569",
              backgroundColor: "rgba(255,255,255,0.92)",
              whiteSpace: "nowrap",
            }}
          >
            {o.posicao}
          </span>
        )}
      </motion.button>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-3 select-none">
      <div ref={campo} onClick={spec.produz ? soltar : undefined} style={{ cursor: spec.produz && naMao ? "pointer" : "default" }}>
        <ShapeCanvas
          cena={{ pecas: spec.referencial.pecas, largura: LARGURA_DA_CENA, altura: ALTURA_DA_CENA }}
          // O que está atrás é desenhado ANTES das peças: é assim que "atrás"
          // existe num plano — o objeto sai por baixo do muro.
          fundo={objetoAtras.map((o, i) => desenhoDoObjeto(o, 100 + i))}
        >
          {/* O referencial, como alvo de toque. Vem antes dos objetos para que,
              onde as áreas se cruzam, quem ganhe seja o objeto. */}
          <button
            type="button"
            disabled={travado}
            onClick={() => responder(null)}
            aria-label={`${spec.referencial.nome} (a referência)`}
            className="absolute"
            style={{
              left: spec.referencial.toque.x - spec.referencial.toque.largura / 2,
              top: spec.referencial.toque.y - spec.referencial.toque.altura / 2,
              width: spec.referencial.toque.largura,
              height: spec.referencial.toque.altura,
              background: "transparent",
              border: emAula && mostrar?.destacarReferencial ? "3px dashed #2563EB" : "none",
              borderRadius: 8,
              padding: 0,
            }}
          />

          {objetoNaFrente.map((o, i) => desenhoDoObjeto(o, i))}

          {/* Nível 5: o objeto já colocado, onde ela soltou. */}
          {posto && spec.alvoDaProducao && (
            <motion.span
              aria-label={`Objeto colocado ${posicaoDoPonto(spec, posto)} ${spec.referencial.doNome}`}
              className="absolute flex items-center justify-center"
              style={{ left: posto.x - 26, top: posto.y - 26, width: 52, height: 52, fontSize: 44, lineHeight: 1 }}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              {spec.alvoDaProducao.emoji}
            </motion.span>
          )}
        </ShapeCanvas>
      </div>

      {/* Nível 5: a bandeja. O objeto começa FORA do campo — dentro dele, todo
          ponto já é uma resposta, e metade das vezes seria a certa. */}
      {spec.produz && !posto && spec.alvoDaProducao && (
        <button
          type="button"
          disabled={travado}
          onClick={() => setNaMao(true)}
          aria-label="Pegar o objeto"
          className="flex items-center justify-center rounded-2xl"
          style={{
            width: LARGURA_DA_CENA,
            height: 84,
            backgroundColor: "#F8FAFC",
            border: `3px solid ${naMao ? "#2563EB" : "#C7D7F0"}`,
          }}
        >
          <motion.span
            aria-hidden
            style={{ fontSize: 44, lineHeight: 1 }}
            animate={naMao ? { y: -12, scale: 1.15 } : { y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            {spec.alvoDaProducao.emoji}
          </motion.span>
        </button>
      )}

      {/* A aula de vocabulário do toque no referencial (§6). Ela não encerra a
          questão — a criança lê, entende a pergunta e responde. */}
      {tocouReferencial && !respondeu && (
        <p className="text-center text-[15px] font-bold" style={{ color: "#B45309" }} aria-live="polite">
          {FALAS.erroDoReferencial(spec.referencial.nome, spec.pedida)}
        </p>
      )}
    </div>
  );
}
