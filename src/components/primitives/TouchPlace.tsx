import React from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import {
  ALTURA_DA_CENA,
  ALVO_MINIMO,
  LADO_DO_OBJETO,
  LARGURA_DA_CENA,
  Ponto,
  TemaDaProducao,
} from "../../curriculum/procedimentos/producaoContract";
import { Vagas } from "../../curriculum/procedimentos/producaoProcedure";

export interface TouchPlaceProps {
  tema: TemaDaProducao;
  ancoras: Ponto[];
  vagas: Vagas;
  ocupadas: number[];
  naBandeja: number;
  capacidade: number;
  naMao: boolean;
  onPegar: () => void;
  /** Cancela um arrasto solto fora da cena sem consumir objeto. */
  onCancelar?: () => void;
  onColocar: (toque: Ponto) => void;
  disabled?: boolean;
  balanco?: number;
  fechando?: boolean;
  pulsarVagas?: boolean;
  maoFantasma?: boolean;
}

const ANEL = 52;
const ALTURA_DA_BANDEJA = 84;
const ALTURA_DO_CHAO = 26;
const RAIO_DO_HALO = 70;
const LIMIAR_DE_ARRASTO = 8;

const CENARIOS: Record<TemaDaProducao["cenario"], { emoji: string | null; pontos: Ponto[] }> = {
  estrelas: {
    emoji: null,
    pontos: [
      { x: 26, y: 22 }, { x: 120, y: 14 }, { x: 210, y: 26 }, { x: 300, y: 18 },
      { x: 68, y: 158 }, { x: 264, y: 152 }, { x: 172, y: 166 }, { x: 44, y: 96 },
      { x: 308, y: 104 },
    ],
  },
  vale: { emoji: "🌿", pontos: [{ x: 18, y: 160 }, { x: 118, y: 166 }, { x: 232, y: 162 }, { x: 310, y: 156 }] },
  cidade: { emoji: "🏠", pontos: [{ x: 26, y: 156 }, { x: 150, y: 162 }, { x: 292, y: 154 }] },
};

interface Arrasto {
  pointerId: number;
  inicioX: number;
  inicioY: number;
  x: number;
  y: number;
  ativo: boolean;
}

function pontoLogico(campo: DOMRect, clientX: number, clientY: number): Ponto {
  return {
    x: ((clientX - campo.left) / campo.width) * LARGURA_DA_CENA,
    y: ((clientY - campo.top) / campo.height) * ALTURA_DA_CENA,
  };
}

function ancoraEmHalo(ancoras: Ponto[], ocupadas: number[], ponto: Ponto): number {
  let indice = -1;
  let distancia = Infinity;
  ancoras.forEach((a, i) => {
    if (ocupadas.includes(i)) return;
    const d = Math.hypot(a.x - ponto.x, a.y - ponto.y);
    if (d < distancia) {
      distancia = d;
      indice = i;
    }
  });
  return distancia <= RAIO_DO_HALO ? indice : -1;
}

/**
 * F04 §4 + adendo §8.3-bis:
 *
 * - arrastar é o gesto canônico: o objeto segue o dedo;
 * - a vaga próxima acende num raio de 70px;
 * - o drop dentro da cena sempre encontra um destino livre (snap generoso);
 * - tocar bandeja → tocar vaga/cena continua disponível como alternativa.
 *
 * O arrasto só começa depois de 8px. Um simples toque na bandeja não é roubado
 * pelo detector de drag e continua armando o objeto para a alternativa por toque.
 */
export function TouchPlace({
  tema,
  ancoras,
  vagas,
  ocupadas,
  naBandeja,
  capacidade,
  naMao,
  onPegar,
  onCancelar,
  onColocar,
  disabled,
  balanco = 0,
  fechando,
  pulsarVagas,
  maoFantasma,
}: TouchPlaceProps) {
  const campo = React.useRef<HTMLDivElement>(null);
  const bandeja = React.useRef<HTMLButtonElement>(null);
  const [arrasto, setArrasto] = React.useState<Arrasto | null>(null);
  const [halo, setHalo] = React.useState(-1);
  const suprimirClick = React.useRef(false);
  const comAndaime = vagas !== "nenhuma";

  const porLinha = capacidade > 8 ? Math.ceil(capacidade / 2) : Math.max(1, capacidade);
  const linhasDaBandeja = Math.ceil(capacidade / porLinha);
  const objetoNaBandeja = Math.max(18, Math.min(
    LADO_DO_OBJETO,
    (LARGURA_DA_CENA - 24) / porLinha - 6,
    (ALTURA_DA_BANDEJA - 12) / linhasDaBandeja - 4,
  ));

  function tocarNaCena(e: React.MouseEvent | React.TouchEvent) {
    if (disabled) return;
    const r = campo.current?.getBoundingClientRect();
    const p = "touches" in e ? e.changedTouches[0] : e as React.MouseEvent;
    if (!r || !r.width || !r.height || !p) {
      onColocar({ x: LARGURA_DA_CENA / 2, y: ALTURA_DA_CENA / 2 });
      return;
    }
    onColocar(pontoLogico(r, p.clientX, p.clientY));
  }

  function iniciarPossivelArrasto(e: React.PointerEvent<HTMLButtonElement>) {
    if (disabled || naBandeja <= 0) return;
    setArrasto({
      pointerId: e.pointerId,
      inicioX: e.clientX,
      inicioY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      ativo: false,
    });
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* browser sem capture */ }
  }

  function moverArrasto(e: React.PointerEvent<HTMLButtonElement>) {
    const atual = arrasto;
    if (!atual || atual.pointerId !== e.pointerId) return;

    const distancia = Math.hypot(e.clientX - atual.inicioX, e.clientY - atual.inicioY);
    const virouArrasto = atual.ativo || distancia >= LIMIAR_DE_ARRASTO;

    // Efeitos no Stage ficam FORA do updater de estado deste componente. Chamar
    // onPegar() dentro de setArrasto(prev => ...) fazia React atualizar o pai
    // enquanto TouchPlace ainda calculava o próprio estado.
    if (virouArrasto && !atual.ativo) {
      onPegar();
      suprimirClick.current = true;
    }

    const r = campo.current?.getBoundingClientRect();
    if (virouArrasto && r && r.width && r.height) {
      const p = pontoLogico(r, e.clientX, e.clientY);
      setHalo(ancoraEmHalo(ancoras, ocupadas, p));
    } else {
      setHalo(-1);
    }
    setArrasto({ ...atual, x: e.clientX, y: e.clientY, ativo: virouArrasto });
  }

  function terminarArrasto(e: React.PointerEvent<HTMLButtonElement>) {
    const atual = arrasto;
    setArrasto(null);
    setHalo(-1);
    if (!atual || atual.pointerId !== e.pointerId || !atual.ativo) return;

    suprimirClick.current = true;
    const r = campo.current?.getBoundingClientRect();
    if (!r || !r.width || !r.height) {
      onCancelar?.();
      return;
    }

    // Margem externa pequena: dedo pode soltar alguns pixels fora da borda sem
    // o gesto “sumir”. Fora dessa faixa, o objeto volta para a bandeja.
    const margem = 24;
    const dentro = e.clientX >= r.left - margem && e.clientX <= r.right + margem
      && e.clientY >= r.top - margem && e.clientY <= r.bottom + margem;
    if (!dentro) {
      onCancelar?.();
      return;
    }

    const x = Math.min(r.right, Math.max(r.left, e.clientX));
    const y = Math.min(r.bottom, Math.max(r.top, e.clientY));
    onColocar(pontoLogico(r, x, y));
  }

  function cliqueNaBandeja() {
    if (suprimirClick.current) {
      suprimirClick.current = false;
      return;
    }
    if (!disabled && naBandeja > 0) onPegar();
  }

  const destinoFantasma = ancoras[0];
  // O centro aproximado do primeiro slot da bandeja na composição fixa.
  const origemFantasma = { x: 24, y: ALTURA_DA_CENA + 3 + 12 + ALTURA_DA_BANDEJA / 2 };

  return (
    <div className="relative flex w-full flex-col items-center gap-3 select-none">
      <motion.div
        ref={campo}
        role={comAndaime ? undefined : "button"}
        aria-label={comAndaime ? undefined : `Colocar ${tema.genero === "f" ? "uma" : "um"} ${tema.singular} ${tema.onde}`}
        onClick={comAndaime ? undefined : tocarNaCena}
        className="relative overflow-hidden rounded-3xl"
        style={{
          width: LARGURA_DA_CENA,
          height: ALTURA_DA_CENA,
          backgroundColor: tema.fundo,
          border: `3px solid ${tema.borda}`,
          cursor: comAndaime || disabled ? "default" : "pointer",
        }}
        animate={{
          x: balanco ? [0, -7, 7, -4, 0] : 0,
          filter: fechando ? "brightness(1.18)" : "brightness(1)",
          boxShadow: arrasto?.ativo && !comAndaime
            ? `0 0 0 5px ${tema.vaga}55`
            : "0 0 0 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: balanco ? 0.45 : 0.5 }}
      >
        {tema.chao && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0"
            style={{ height: ALTURA_DO_CHAO, backgroundColor: tema.chao, opacity: 0.85 }}
          />
        )}

        {CENARIOS[tema.cenario].pontos.map((p, i) => (
          <span
            key={`cen-${i}`}
            aria-hidden
            className={CENARIOS[tema.cenario].emoji ? "pointer-events-none absolute" : "pointer-events-none absolute rounded-full"}
            style={CENARIOS[tema.cenario].emoji
              ? { left: p.x, top: p.y, fontSize: 17, opacity: 0.75, transform: "translate(-50%, -50%)" }
              : { left: p.x - 3, top: p.y - 3, width: 6, height: 6, opacity: 0.55, backgroundColor: "#E2E8F0" }}
          >
            {CENARIOS[tema.cenario].emoji}
          </span>
        ))}

        {comAndaime && ancoras.map((a, i) => {
          if (ocupadas.includes(i)) return null;
          const iluminada = halo === i;
          return (
            <motion.button
              key={`vaga-${i}`}
              type="button"
              aria-label="Vaga vazia"
              disabled={disabled}
              onClick={() => !disabled && onColocar(a)}
              className="absolute flex items-center justify-center rounded-full"
              style={{
                left: a.x - ALVO_MINIMO / 2,
                top: a.y - ALVO_MINIMO / 2,
                width: ALVO_MINIMO,
                height: ALVO_MINIMO,
                background: iluminada ? `${tema.vaga}22` : "transparent",
                border: "none",
                padding: 0,
                boxShadow: iluminada ? `0 0 0 5px ${tema.vaga}44` : "none",
              }}
              animate={{
                scale: iluminada ? 1.08 : (vagas === "pulsando" || pulsarVagas) ? [1, 1.08, 1] : 1,
              }}
              transition={{
                duration: iluminada ? 0.15 : 1.1,
                repeat: !iluminada && (vagas === "pulsando" || pulsarVagas) ? Infinity : 0,
                delay: iluminada ? 0 : i * 0.15,
              }}
            >
              <span
                aria-hidden
                className="rounded-full"
                style={{
                  width: ANEL,
                  height: ANEL,
                  border: `${vagas === "contorno" ? 2 : 3}px dashed ${tema.vaga}`,
                  opacity: vagas === "contorno" ? 0.55 : 0.9,
                  backgroundColor: vagas === "contorno" ? "transparent" : "rgba(255,255,255,0.10)",
                }}
              />
            </motion.button>
          );
        })}

        {ocupadas.map((indice, ordem) => {
          const a = ancoras[indice];
          if (!a) return null;
          return (
            <motion.span
              key={`posto-${indice}`}
              aria-label={`${tema.singular} ${ordem + 1}`}
              className="pointer-events-none absolute flex items-center justify-center"
              style={{
                left: a.x - LADO_DO_OBJETO / 2,
                top: a.y - LADO_DO_OBJETO / 2,
                width: LADO_DO_OBJETO,
                height: LADO_DO_OBJETO,
                fontSize: LADO_DO_OBJETO - 6,
                lineHeight: 1,
              }}
              initial={{ scale: 0.2, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1, filter: fechando ? "drop-shadow(0 0 8px #FDE68A)" : "none" }}
              transition={{ type: "spring", stiffness: 420, damping: 16 }}
            >
              {tema.emoji}
            </motion.span>
          );
        })}
      </motion.div>

      <button
        ref={bandeja}
        type="button"
        disabled={disabled || naBandeja === 0}
        onClick={cliqueNaBandeja}
        onPointerDown={iniciarPossivelArrasto}
        onPointerMove={moverArrasto}
        onPointerUp={terminarArrasto}
        onPointerCancel={() => {
          setArrasto(null);
          setHalo(-1);
          onCancelar?.();
        }}
        aria-label={`Pegar ${tema.genero === "f" ? "uma" : "um"} ${tema.singular} da bandeja`}
        data-touchplace-tray
        className="grid place-items-center rounded-2xl touch-none"
        style={{
          width: LARGURA_DA_CENA,
          height: ALTURA_DA_BANDEJA,
          backgroundColor: "#F8FAFC",
          border: `3px solid ${naMao || arrasto?.ativo ? "#2563EB" : "#C7D7F0"}`,
          cursor: disabled || naBandeja === 0 ? "default" : "grab",
          padding: "6px 10px",
          gridTemplateColumns: `repeat(${porLinha}, 1fr)`,
          gridTemplateRows: `repeat(${linhasDaBandeja}, 1fr)`,
        }}
      >
        {Array.from({ length: naBandeja }).map((_, i) => (
          <motion.span
            key={`bandeja-${i}`}
            aria-hidden
            style={{ fontSize: objetoNaBandeja, lineHeight: 1 }}
            animate={(naMao || arrasto?.ativo) && i === 0 ? { y: -14, scale: 1.15, opacity: arrasto?.ativo ? 0.25 : 1 } : { y: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            {tema.emoji}
          </motion.span>
        ))}
        {naBandeja === 0 && (
          <span
            aria-hidden
            style={{ gridColumn: "1 / -1", gridRow: "1 / -1", color: "#64748B", fontSize: 15, fontWeight: 700 }}
          >
            bandeja vazia
          </span>
        )}
      </button>

      {/* O PalcoEscalado usa transform. `position: fixed` dentro de um ancestral
          transformado deixa de ser relativo à viewport e desloca o sprite do dedo.
          O portal tira o ghost dessa árvore transformada sem alterar a geometria
          lógica do palco: clientX/clientY continuam coordenadas da viewport. */}
      {arrasto?.ativo && typeof document !== "undefined" && createPortal(
        <span
          aria-hidden
          data-touchplace-drag-ghost
          className="pointer-events-none fixed z-50 flex items-center justify-center"
          style={{
            left: arrasto.x - LADO_DO_OBJETO / 2,
            top: arrasto.y - LADO_DO_OBJETO / 2,
            width: LADO_DO_OBJETO,
            height: LADO_DO_OBJETO,
            fontSize: LADO_DO_OBJETO - 2,
            filter: "drop-shadow(0 5px 5px rgba(0,0,0,.25))",
          }}
        >
          {tema.emoji}
        </span>,
        document.body,
      )}

      {/* §8/§7.1-bis: demonstra bandeja0 → vaga0 com OBJETO + mão. Não altera
          a resposta; ao fim a tela volta intacta para a criança praticar. */}
      {maoFantasma && destinoFantasma && (
        <>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute z-40"
            style={{ fontSize: 32, left: 0, top: 0 }}
            initial={{ x: origemFantasma.x, y: origemFantasma.y, opacity: 0 }}
            animate={{
              x: [origemFantasma.x, origemFantasma.x, destinoFantasma.x, destinoFantasma.x],
              y: [origemFantasma.y, origemFantasma.y, destinoFantasma.y, destinoFantasma.y],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 2.4, times: [0, 0.18, 0.72, 1], ease: "easeInOut" }}
          >
            {tema.emoji}
          </motion.span>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute z-50"
            style={{ fontSize: 30, left: 8, top: 12 }}
            initial={{ x: origemFantasma.x, y: origemFantasma.y + 18, opacity: 0 }}
            animate={{
              x: [origemFantasma.x, origemFantasma.x, destinoFantasma.x, destinoFantasma.x],
              y: [origemFantasma.y + 18, origemFantasma.y + 18, destinoFantasma.y + 18, destinoFantasma.y + 18],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 2.4, times: [0, 0.18, 0.72, 1], ease: "easeInOut" }}
          >
            👆
          </motion.span>
        </>
      )}
    </div>
  );
}
