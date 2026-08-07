import React from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { ShapeCanvas } from "./ShapeCanvas";
import { PalcoEscalado } from "./PalcoEscalado";
import {
  ALTURA_DA_CENA,
  ALVO_MINIMO,
  LARGURA_DA_CENA,
  Ponto,
  PosicaoSpec,
  posicaoDoPonto,
} from "../../curriculum/procedimentos/posicaoContract";
import { AcaoDePosicao, FALAS, Preposicao } from "../../curriculum/procedimentos/posicaoProcedure";

const DURACAO_ERRO = 2000;
const INICIO_FECHO = 1800;
const LIMIAR_ARRASTO = 8;
const LADO_GHOST = 64;

type Drag = {
  pointerId: number;
  inicioX: number;
  inicioY: number;
  x: number;
  y: number;
  ativo: boolean;
};

interface Props {
  spec: PosicaoSpec;
  onAnswer?: (valor: string, acao: AcaoDePosicao) => void;
  disabled?: boolean;
  falar?: (texto: string) => void;
  mostrar?: {
    destacarReferencial?: boolean;
    destacarObjeto?: number;
  } | null;
}

/**
 * `CenaDePosicaoStage` — GE.01 / F47.
 *
 * Fronteiras da ficha inteira:
 * - reconhecimento: toca o OBJETO, nunca uma palavra;
 * - erro é vocabulário e volta à tentativa, não terceira-tentativa genérica;
 * - acerto: objeto sobe → seta liga ao referencial → fecho rotula as posições;
 * - nível 5: arrasto Pointer Events real, com ghost sob o dedo, mais a alternativa
 *   motora bandeja→toque; nenhuma zona-resposta é desenhada;
 * - nova `spec` limpa todo estado visual/motor e todos os timers.
 */
export function CenaDePosicaoStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const campo = React.useRef<HTMLDivElement>(null);
  const relogios = React.useRef<number[]>([]);
  const specAnterior = React.useRef(spec);
  const suprimirClique = React.useRef(false);
  const dragRef = React.useRef<Drag | null>(null);
  const markerId = React.useId().replace(/:/g, "");

  const [entradaSeq, setEntradaSeq] = React.useState(0);
  const [escolhida, setEscolhida] = React.useState<Preposicao | null>(null);
  const [erroEscolhido, setErroEscolhido] = React.useState<Preposicao | null>(null);
  const [tocouReferencial, setTocouReferencial] = React.useState(false);
  const [respondeu, setRespondeu] = React.useState(false);
  const [feedbackErro, setFeedbackErro] = React.useState(false);
  const [mostrarFecho, setMostrarFecho] = React.useState(false);
  const [naMao, setNaMao] = React.useState(false);
  const [posto, setPosto] = React.useState<Ponto | null>(null);
  const [drag, setDrag] = React.useState<Drag | null>(null);

  function limparRelogios() {
    relogios.current.forEach(window.clearTimeout);
    relogios.current = [];
  }

  function agendar(fn: () => void, ms: number) {
    const id = window.setTimeout(() => {
      relogios.current = relogios.current.filter(x => x !== id);
      fn();
    }, ms);
    relogios.current.push(id);
  }

  React.useEffect(() => {
    limparRelogios();
    if (specAnterior.current !== spec) {
      specAnterior.current = spec;
      setEntradaSeq(n => n + 1);
    }
    setEscolhida(null);
    setErroEscolhido(null);
    setTocouReferencial(false);
    setRespondeu(false);
    setFeedbackErro(false);
    setMostrarFecho(false);
    setNaMao(false);
    setPosto(null);
    setDrag(null);
    dragRef.current = null;
    suprimirClique.current = false;
    return limparRelogios;
  }, [spec]);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const travado = Boolean(disabled) || respondeu || feedbackErro || emAula;

  function acao(onde: Preposicao | null): AcaoDePosicao {
    return { pedida: spec.pedida, escolhida: onde, par: spec.par };
  }

  function confirmarAcerto(onde: Preposicao) {
    setEscolhida(onde);
    setErroEscolhido(null);
    setRespondeu(true);
    falar?.(FALAS.acerto(spec.pedida, spec.referencial.doNome));
    // Publica no instante da decisão. A janela autoral do GameLoop mantém o
    // palco por 3,3s; cinema nunca entra no tempo de reação.
    onAnswer?.(onde, acao(onde));
    agendar(() => setMostrarFecho(true), INICIO_FECHO);
  }

  function erroSuave(onde: Preposicao) {
    setEscolhida(onde);
    setErroEscolhido(onde);
    setFeedbackErro(true);
    falar?.(FALAS.erroSuave(onde, spec.pedida));
    onAnswer?.(onde, acao(onde));
    agendar(() => {
      setFeedbackErro(false);
      setErroEscolhido(null);
      setEscolhida(null);
      // Na produção, o objeto errado volta à bandeja para nova tentativa.
      if (spec.produz) setPosto(null);
    }, DURACAO_ERRO);
  }

  function responder(onde: Preposicao | null) {
    if (travado) return;
    if (onde === null) {
      setTocouReferencial(true);
      setFeedbackErro(true);
      falar?.(FALAS.erroDoReferencial(spec.referencial.nome, spec.pedida));
      onAnswer?.("referencial", acao(null));
      agendar(() => {
        setTocouReferencial(false);
        setFeedbackErro(false);
      }, DURACAO_ERRO);
      return;
    }
    if (onde === spec.pedida) confirmarAcerto(onde);
    else erroSuave(onde);
  }

  function pontoDoClient(clientX: number, clientY: number): Ponto | null {
    const r = campo.current?.getBoundingClientRect();
    if (!r || !r.width || !r.height) return null;
    const dentro = clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
    if (!dentro) return null;
    return {
      x: ((clientX - r.left) / r.width) * LARGURA_DA_CENA,
      y: ((clientY - r.top) / r.height) * ALTURA_DA_CENA,
    };
  }

  function soltarNoPonto(ponto: Ponto | null) {
    setNaMao(false);
    setDrag(null);
    dragRef.current = null;
    if (!ponto || travado || !spec.produz) return;
    setPosto(ponto);
    responder(posicaoDoPonto(spec, ponto));
  }

  /** Alternativa motora: pega com toque e depois toca onde quer colocar. */
  function pegarPorToque() {
    if (suprimirClique.current) {
      suprimirClique.current = false;
      return;
    }
    if (travado || !spec.produz) return;
    setNaMao(true);
  }

  function soltarPorToque(e: React.MouseEvent<HTMLDivElement>) {
    if (travado || !spec.produz || !naMao || dragRef.current?.ativo) return;
    soltarNoPonto(pontoDoClient(e.clientX, e.clientY));
  }

  /** Gesto canônico §5: o objeto realmente acompanha o dedo. */
  function iniciarArrasto(e: React.PointerEvent<HTMLButtonElement>) {
    if (travado || !spec.produz) return;
    const proximo: Drag = {
      pointerId: e.pointerId,
      inicioX: e.clientX,
      inicioY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      ativo: false,
    };
    dragRef.current = proximo;
    setDrag(proximo);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* jsdom/legado */ }
  }

  function moverArrasto(e: React.PointerEvent<HTMLButtonElement>) {
    const atual = dragRef.current;
    if (!atual || atual.pointerId !== e.pointerId || travado) return;
    const distancia = Math.hypot(e.clientX - atual.inicioX, e.clientY - atual.inicioY);
    const proximo = {
      ...atual,
      x: e.clientX,
      y: e.clientY,
      ativo: atual.ativo || distancia >= LIMIAR_ARRASTO,
    };
    dragRef.current = proximo;
    setDrag(proximo);
    if (proximo.ativo) setNaMao(true);
  }

  function terminarArrasto(e: React.PointerEvent<HTMLButtonElement>) {
    const atual = dragRef.current;
    if (!atual || atual.pointerId !== e.pointerId) return;
    if (atual.ativo) {
      suprimirClique.current = true;
      e.preventDefault();
      soltarNoPonto(pontoDoClient(e.clientX, e.clientY));
      // O click sintético vem depois do pointerup; libera só depois dele.
      agendar(() => { suprimirClique.current = false; }, 0);
    } else {
      setDrag(null);
      dragRef.current = null;
    }
  }

  const objetoAtras = spec.objetos.filter(o => o.atras);
  const objetoNaFrente = spec.objetos.filter(o => !o.atras);

  function desenhoDoObjeto(o: typeof spec.objetos[number], i: number) {
    const certo = respondeu && o.posicao === spec.pedida;
    const errado = feedbackErro && o.posicao === erroEscolhido;
    const emFoco = emAula && mostrar?.destacarObjeto === spec.objetos.indexOf(o);
    const ordemEntrada = spec.objetos.indexOf(o);
    return (
      <motion.button
        key={`obj-${entradaSeq}-${i}-${o.emoji}-${o.posicao}`}
        type="button"
        disabled={travado}
        onClick={() => responder(o.posicao)}
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
          zIndex: 4,
        }}
        initial={{ y: -34, opacity: 0 }}
        animate={{
          y: certo ? -10 : 0,
          opacity: 1,
          x: errado ? [0, -6, 6, -4, 4, 0] : 0,
          scale: certo ? 1.15 : (emFoco ? [1, 1.12, 1] : 1),
        }}
        transition={{
          duration: errado ? 0.45 : 0.5,
          delay: errado || certo || emFoco ? 0 : 0.45 + ordemEntrada * 0.18,
          repeat: emFoco ? Infinity : 0,
        }}
      >
        <span aria-hidden>{o.emoji}</span>

        {/* Erro: nomeia SOMENTE onde o objeto escolhido está; não revela o gabarito. */}
        {errado && (
          <span
            data-position-error-label
            className="absolute rounded-lg px-1.5"
            style={{
              top: o.tamanho - 2,
              fontSize: 12,
              fontWeight: 800,
              color: "#B45309",
              backgroundColor: "rgba(255,255,255,0.96)",
              whiteSpace: "nowrap",
            }}
          >
            {o.posicao}
          </span>
        )}

        {/* Fecho §4: só depois dos 1,8s da relação aparecem os dois rótulos. */}
        {mostrarFecho && (
          <span
            data-position-close-label
            className="absolute rounded-lg px-1.5"
            style={{
              top: o.tamanho - 2,
              fontSize: 12,
              fontWeight: 800,
              color: o.posicao === spec.pedida ? "#15803D" : "#475569",
              backgroundColor: "rgba(255,255,255,0.96)",
              whiteSpace: "nowrap",
            }}
          >
            {o.posicao}
          </span>
        )}
      </motion.button>
    );
  }

  const corretoReconhecimento = spec.objetos.find(o => o.posicao === spec.pedida);
  const pontoDaRelacao = respondeu
    ? (spec.produz ? posto : corretoReconhecimento ? { x: corretoReconhecimento.x, y: corretoReconhecimento.y } : null)
    : null;
  const pontoReferencial = { x: spec.referencial.toque.x, y: spec.referencial.toque.y };
  const meioSeta = pontoDaRelacao
    ? { x: (pontoDaRelacao.x + pontoReferencial.x) / 2, y: (pontoDaRelacao.y + pontoReferencial.y) / 2 }
    : null;

  return (
    <PalcoEscalado>
      <div className="flex flex-col items-center gap-3 select-none">
        <motion.div
          key={`campo-${entradaSeq}`}
          ref={campo}
          onClick={spec.produz ? soltarPorToque : undefined}
          style={{ width: LARGURA_DA_CENA, cursor: spec.produz && naMao ? "crosshair" : "default" }}
          initial={{ x: -24, opacity: 0.78 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
        >
          <ShapeCanvas
            cena={{ pecas: spec.referencial.pecas, largura: LARGURA_DA_CENA, altura: ALTURA_DA_CENA }}
            fundo={objetoAtras.map((o, i) => desenhoDoObjeto(o, 100 + i))}
          >
            <button
              type="button"
              disabled={travado}
              onClick={(e) => { e.stopPropagation(); responder(null); }}
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
                zIndex: 3,
              }}
            />

            {objetoNaFrente.map((o, i) => desenhoDoObjeto(o, i))}

            {/* Acerto §4: uma seta explícita liga OBJETO e REFERENCIAL por 1,8s. */}
            {pontoDaRelacao && !mostrarFecho && (
              <>
                <svg
                  data-position-arrow
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  width={LARGURA_DA_CENA}
                  height={ALTURA_DA_CENA}
                  viewBox={`0 0 ${LARGURA_DA_CENA} ${ALTURA_DA_CENA}`}
                  style={{ zIndex: 8 }}
                >
                  <defs>
                    <marker id={markerId} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                      <path d="M0,0 L8,4 L0,8 Z" fill="#16A34A" />
                    </marker>
                  </defs>
                  <motion.line
                    x1={pontoDaRelacao.x}
                    y1={pontoDaRelacao.y}
                    x2={pontoReferencial.x}
                    y2={pontoReferencial.y}
                    stroke="#16A34A"
                    strokeWidth="4"
                    strokeLinecap="round"
                    markerEnd={`url(#${markerId})`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.55 }}
                  />
                </svg>
                {meioSeta && (
                  <motion.span
                    data-position-relation-label
                    className="pointer-events-none absolute rounded-xl px-2 py-1 font-black"
                    style={{
                      left: meioSeta.x,
                      top: meioSeta.y,
                      transform: "translate(-50%, -50%)",
                      zIndex: 9,
                      backgroundColor: "rgba(240,253,244,0.96)",
                      border: "2px solid #86EFAC",
                      color: "#15803D",
                      fontSize: 13,
                      whiteSpace: "nowrap",
                    }}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {spec.pedida}
                  </motion.span>
                )}
              </>
            )}

            {/* Nível 5: posição produzida. Erro permanece 2s e volta à bandeja. */}
            {posto && spec.alvoDaProducao && (
              <motion.span
                aria-label={`Objeto colocado ${posicaoDoPonto(spec, posto)} ${spec.referencial.doNome}`}
                className="absolute flex items-center justify-center"
                style={{
                  left: posto.x - 32,
                  top: posto.y - 32,
                  width: 64,
                  height: 64,
                  fontSize: 44,
                  lineHeight: 1,
                  zIndex: 6,
                }}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{
                  scale: respondeu ? 1.15 : 1,
                  opacity: 1,
                  x: feedbackErro ? [0, -6, 6, -4, 4, 0] : 0,
                  y: respondeu ? -10 : 0,
                }}
              >
                {spec.alvoDaProducao.emoji}
                {feedbackErro && (
                  <span
                    data-position-error-label
                    className="absolute rounded-lg px-1.5"
                    style={{ top: 54, fontSize: 12, fontWeight: 800, color: "#B45309", backgroundColor: "white", whiteSpace: "nowrap" }}
                  >
                    {posicaoDoPonto(spec, posto)}
                  </span>
                )}
                {mostrarFecho && (
                  <span
                    data-position-close-label
                    className="absolute rounded-lg px-1.5"
                    style={{ top: 54, fontSize: 12, fontWeight: 800, color: "#15803D", backgroundColor: "white", whiteSpace: "nowrap" }}
                  >
                    {spec.pedida}
                  </span>
                )}
              </motion.span>
            )}
          </ShapeCanvas>
        </motion.div>

        {/* L5: bandeja. Clique = alternativa por toque; Pointer = arrasto real. */}
        {spec.produz && !posto && spec.alvoDaProducao && (
          <button
            type="button"
            data-position-tray
            disabled={travado}
            onClick={pegarPorToque}
            onPointerDown={iniciarArrasto}
            onPointerMove={moverArrasto}
            onPointerUp={terminarArrasto}
            onPointerCancel={() => { setDrag(null); dragRef.current = null; setNaMao(false); }}
            aria-label="Pegar o objeto"
            className="flex touch-none items-center justify-center rounded-2xl"
            style={{
              width: LARGURA_DA_CENA,
              height: 84,
              backgroundColor: "#F8FAFC",
              border: `3px solid ${naMao ? "#2563EB" : "#C7D7F0"}`,
              touchAction: "none",
            }}
          >
            <motion.span
              aria-hidden
              style={{ fontSize: 44, lineHeight: 1, opacity: drag?.ativo ? 0.25 : 1 }}
              animate={naMao && !drag?.ativo ? { y: -12, scale: 1.15 } : { y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              {spec.alvoDaProducao.emoji}
            </motion.span>
          </button>
        )}

        {tocouReferencial && !respondeu && (
          <p className="text-center text-[15px] font-bold" style={{ color: "#B45309" }} aria-live="polite">
            {FALAS.erroDoReferencial(spec.referencial.nome, spec.pedida)}
          </p>
        )}
      </div>

      {/* Portal: PalcoEscalado usa transform; fixed dentro dele não segue viewport. */}
      {drag?.ativo && spec.alvoDaProducao && typeof document !== "undefined" && createPortal(
        <span
          data-position-drag-ghost
          aria-hidden
          className="pointer-events-none fixed z-50 flex items-center justify-center"
          style={{
            left: drag.x - LADO_GHOST / 2,
            top: drag.y - LADO_GHOST / 2,
            width: LADO_GHOST,
            height: LADO_GHOST,
            fontSize: 46,
            lineHeight: 1,
            filter: "drop-shadow(0 5px 5px rgba(0,0,0,.22))",
          }}
        >
          {spec.alvoDaProducao.emoji}
        </span>,
        document.body,
      )}
    </PalcoEscalado>
  );
}
