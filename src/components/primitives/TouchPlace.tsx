import React from "react";
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

/**
 * `TouchPlace` — a primitiva da ficha F04 (N1.09), *Produzir Quantidade*.
 *
 * ---
 *
 * ### O que a versão anterior não fazia
 *
 * A primitiva existia e **não estava ligada em lugar nenhum** — nem caso no
 * Composer, nem caso no renderizador. O nó N1.09 era servido por
 * `gVis_Sequence`, que pergunta *"conte a partir do 47 — quais números vêm
 * depois?"* com alternativas de texto e números até 119, numa competência da
 * faixa F0 cuja criança tem quatro anos e ainda não lê. Nada da F04 chegava à
 * tela.
 *
 * E o que existia da primitiva divergia da ficha em cinco pontos:
 *
 * 1. **Sem escada de níveis.** Vaga fantasma sempre visível, sempre igual. Os
 *    degraus da §5 — pulsando → parada → só contorno → **nenhuma** — não
 *    existiam, e é o quarto que a ficha chama de *"o salto"*.
 * 2. **Excesso impossível e não registrado.** Passar do pedido só falava *"já
 *    colocamos todos"* e não guardava nada; `NAO_MONITORA_ALVO`, uma das quatro
 *    tags da §6, não tinha como nascer.
 * 3. **Alvo de dedo de 48px**, contra os ≥ 80px que o adendo §8.3-bis exige
 *    desta ficha por nome.
 * 4. **A voz falava dígitos** — `speak("3")` —, não a contagem com concordância
 *    que a §4 e a §8 escrevem: *"uma... duas... três!"*.
 * 5. **Vagas em fila que quebra linha**, não *"espalhadas"* dentro de uma cena
 *    com fundo, como a §3 desenha.
 *
 * ### O que ela sabe e o que não sabe
 *
 * Ela desenha e avisa. Quem conta, decide acerto, recusa excedente e monta o
 * diagnóstico é o `TouchPlaceStage` — a primitiva não conhece nível, ficha nem
 * alvo.
 */

export interface TouchPlaceProps {
  tema: TemaDaProducao;
  /** Onde os objetos assentam. Com andaime, são as vagas fantasma. */
  ancoras: Ponto[];
  vagas: Vagas;
  /** Índices de âncoras ocupadas, na ordem de colocação. */
  ocupadas: number[];
  /** Quantos objetos ainda restam na bandeja. */
  naBandeja: number;
  /** Quantos ela tinha no começo — decide a grade, que não pode reflow. */
  capacidade: number;
  /** Já pegou um e ainda não soltou. */
  naMao: boolean;
  onPegar: () => void;
  /** O toque na cena, em pixels relativos ao campo. */
  onColocar: (toque: Ponto) => void;
  disabled?: boolean;
  /** §4, excesso: *"a cena dá um leve balanço"*. Muda de valor a cada recusa. */
  balanco?: number;
  /** §4, fecho: *"os objetos brilham juntos e a cena se ilumina"*. */
  fechando?: boolean;
  /** §8: as vagas pulsam junto com a fala da micro-aula. */
  pulsarVagas?: boolean;
  /** §8/§7.1-bis: a Mão Fantasma demonstra **o primeiro** e devolve a tela. */
  maoFantasma?: boolean;
}

/** O anel da vaga fantasma: menor que a área de toque, e é essa a ideia. */
const ANEL = 52;

/** A faixa da bandeja. 84 > 80: o alvo do dedo é a faixa inteira (§8.3-bis). */
const ALTURA_DA_BANDEJA = 84;

/** A altura da faixa de chão, quando o tema tem chão. */
const ALTURA_DO_CHAO = 26;

/**
 * Enfeites do fundo, fixos por tema. Cosmético — e propositalmente **pequeno**:
 * enfeite do tamanho do objeto viraria coisa contável, e nesta ficha a única
 * coisa contável na cena tem de ser o que a criança colocou (§6.34).
 *
 * O céu usa pontinhos, não `⭐`: a estrela é o objeto que ela produz, e um céu
 * salpicado de estrelas idênticas às da bandeja seria a tela contando junto.
 */
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

export function TouchPlace({
  tema,
  ancoras,
  vagas,
  ocupadas,
  naBandeja,
  capacidade,
  naMao,
  onPegar,
  onColocar,
  disabled,
  balanco = 0,
  fechando,
  pulsarVagas,
  maoFantasma,
}: TouchPlaceProps) {
  const campo = React.useRef<HTMLDivElement>(null);
  const comAndaime = vagas !== "nenhuma";

  /**
   * O toque na cena livre (§5, níveis 4 e 5).
   *
   * O ponto vira posição dentro do campo, e o palco encaixa na âncora livre mais
   * próxima. Sem raio de corte: qualquer toque assenta. Toque que não faz nada
   * porque errou por 20px é precisão de dedo virando requisito (§8.3-bis).
   */
  function tocarNaCena(e: React.MouseEvent | React.TouchEvent) {
    if (disabled) return;
    const r = campo.current?.getBoundingClientRect();
    const p = "touches" in e ? e.changedTouches[0] : (e as React.MouseEvent);
    // Sem retângulo medido não há como converter o ponto — e um toque que não
    // faz nada porque o layout ainda não existe seria a criança levar a culpa
    // por um quadro de renderização. Cai no centro, que sempre assenta.
    if (!r || !r.width || !r.height || !p) {
      onColocar({ x: LARGURA_DA_CENA / 2, y: ALTURA_DA_CENA / 2 });
      return;
    }
    onColocar({
      x: ((p.clientX - r.left) / r.width) * LARGURA_DA_CENA,
      y: ((p.clientY - r.top) / r.height) * ALTURA_DA_CENA,
    });
  }

  /**
   * A grade da bandeja é fixa em `capacidade`, não no que resta.
   *
   * Doze objetos numa linha só saem com 19px cada — o print mostrou uma tarja
   * vermelha em vez de doze caminhões, e a §3 pede que a criança **veja** que
   * sobra objeto (é o que torna `IGNORA_QUANTIDADE` observável). Em duas linhas
   * eles voltam a 32px. E a grade é fixa para a bandeja esvaziar **no lugar**:
   * recalculada a cada objeto, ela reflui e a tela salta debaixo do dedo.
   */
  const porLinha = capacidade > 8 ? Math.ceil(capacidade / 2) : Math.max(1, capacidade);
  const linhasDaBandeja = Math.ceil(capacidade / porLinha);
  const objetoNaBandeja = Math.max(18, Math.min(
    LADO_DO_OBJETO,
    (LARGURA_DA_CENA - 24) / porLinha - 6,
    (ALTURA_DA_BANDEJA - 12) / linhasDaBandeja - 4,
  ));

  return (
    <div className="flex w-full flex-col items-center gap-3 select-none">
      {/* §3: a cena é um retângulo grande com ilustração de fundo. Ela tem
          tamanho fixo em pixels porque as âncoras vêm em pixels: percentual
          sobre campo não-quadrado foi o que estragou o disperso da F01. */}
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
        // §4, excesso: "a cena dá um leve balanço". E §4, fecho: "a cena se
        // ilumina". Nenhum dos dois passa de 1x de escala — animação que cresce
        // sobre uma tela de 390 vaza (o pulso da micro-aula da AL.01 vazou por
        // 6px assim).
        animate={{ x: balanco ? [0, -7, 7, -4, 0] : 0, filter: fechando ? "brightness(1.18)" : "brightness(1)" }}
        transition={{ duration: balanco ? 0.45 : 0.5 }}
      >
        {/* A faixa de chão. Nos níveis 4 e 5 não há vaga nenhuma, e um retângulo
            liso de 326×176 lê como tela quebrada (§6.6). O chão diz "é aqui que
            as coisas ficam" sem pôr na tela nada que se possa contar — que é o
            que uma vaga faria, e a vaga é o que este nível tira. */}
        {tema.chao && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0"
            style={{ height: ALTURA_DO_CHAO, backgroundColor: tema.chao, opacity: 0.85 }}
          />
        )}

        {/* Cenário: decorativo. Pontinho de céu é desenhado como círculo, não
            como caractere — "·" numa fonte de emoji sai como um quadradinho de
            2px, e o print mostrou um céu que parecia sujeira na tela. */}
        {CENARIOS[tema.cenario].pontos.map((p, i) => (
          <span
            key={`cen-${i}`}
            aria-hidden
            className={CENARIOS[tema.cenario].emoji ? "pointer-events-none absolute" : "pointer-events-none absolute rounded-full"}
            style={CENARIOS[tema.cenario].emoji
              ? {
                left: p.x,
                top: p.y,
                fontSize: 17,
                opacity: 0.75,
                transform: "translate(-50%, -50%)",
              }
              : {
                left: p.x - 3,
                top: p.y - 3,
                width: 6,
                height: 6,
                opacity: 0.55,
                backgroundColor: "#E2E8F0",
              }}
          >
            {CENARIOS[tema.cenario].emoji}
          </span>
        ))}

        {/* As vagas fantasma. §3: "contornos pontilhados, vazios, espalhados". */}
        {comAndaime && ancoras.map((a, i) => {
          if (ocupadas.includes(i)) return null;
          return (
            <motion.button
              key={`vaga-${i}`}
              type="button"
              aria-label="Vaga vazia"
              disabled={disabled}
              onClick={() => !disabled && onColocar(a)}
              className="absolute flex items-center justify-center rounded-full"
              style={{
                // A ÁREA é ALVO_MINIMO; o desenho é o anel, menor. Alvo grande
                // com desenho pequeno é o jeito de o dedo errar pouco sem a
                // tela ficar coberta de círculos gigantes (§8.3-bis).
                left: a.x - ALVO_MINIMO / 2,
                top: a.y - ALVO_MINIMO / 2,
                width: ALVO_MINIMO,
                height: ALVO_MINIMO,
                background: "transparent",
                border: "none",
                padding: 0,
              }}
              // §5: nível 1 pulsa ("aqui falta algo"); do 2 em diante, parada.
              // Na micro-aula, pulsa em qualquer nível — é a fala apontando.
              animate={{ scale: (vagas === "pulsando" || pulsarVagas) ? [1, 1.08, 1] : 1 }}
              transition={{ duration: 1.1, repeat: (vagas === "pulsando" || pulsarVagas) ? Infinity : 0, delay: i * 0.15 }}
            >
              <span
                aria-hidden
                className="rounded-full"
                style={{
                  width: ANEL,
                  height: ANEL,
                  // §5, nível 3: "só contorno". Mais discreto, mesma função.
                  border: `${vagas === "contorno" ? 2 : 3}px dashed ${tema.vaga}`,
                  opacity: vagas === "contorno" ? 0.55 : 0.9,
                  backgroundColor: vagas === "contorno" ? "transparent" : "rgba(255,255,255,0.10)",
                }}
              />
            </motion.button>
          );
        })}

        {/* Os objetos colocados. Entram com bounce, como manda o encaixe da §4. */}
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
              animate={{
                scale: 1,
                y: 0,
                opacity: 1,
                // §4, fecho: "os objetos brilham juntos".
                filter: fechando ? "drop-shadow(0 0 8px #FDE68A)" : "none",
              }}
              transition={{ type: "spring", stiffness: 420, damping: 16 }}
            >
              {tema.emoji}
            </motion.span>
          );
        })}

        {/* §7.1-bis: a Mão Fantasma mostra o PRIMEIRO e devolve a tela. */}
        {maoFantasma && ancoras[0] && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute"
            style={{ fontSize: 30, left: ancoras[0].x, top: ancoras[0].y }}
            initial={{ opacity: 0, x: -40, y: 90 }}
            animate={{ opacity: [0, 1, 1, 0], x: [-40, -8, -8, -8], y: [90, 6, 6, 6] }}
            transition={{ duration: 2.2, times: [0, 0.4, 0.8, 1] }}
          >
            👆
          </motion.span>
        )}
      </motion.div>

      {/* §3: a bandeja. Faixa inteira como alvo — a criança pega "da bandeja",
          não de um objeto específico: são idênticos, e escolher qual deles
          pegar não é decisão nenhuma, só exigência de mira. */}
      <button
        type="button"
        disabled={disabled || naBandeja === 0}
        onClick={() => !disabled && naBandeja > 0 && onPegar()}
        aria-label={`Pegar ${tema.genero === "f" ? "uma" : "um"} ${tema.singular} da bandeja`}
        className="grid place-items-center rounded-2xl"
        style={{
          width: LARGURA_DA_CENA,
          height: ALTURA_DA_BANDEJA,
          backgroundColor: "#F8FAFC",
          border: `3px solid ${naMao ? "#2563EB" : "#C7D7F0"}`,
          cursor: disabled || naBandeja === 0 ? "default" : "pointer",
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
            // O que está "na mão" é o primeiro da bandeja, levantado. Sem isso
            // o toque na bandeja não devolve resposta nenhuma para o olho.
            animate={naMao && i === 0 ? { y: -14, scale: 1.15 } : { y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            {tema.emoji}
          </motion.span>
        ))}
        {/* A bandeja vazia só acontece nos níveis sem vaga, e é uma informação:
            ela despejou tudo. O texto atravessa a grade inteira — numa célula de
            1/6 da largura ele quebraria em três linhas. */}
        {naBandeja === 0 && (
          <span
            aria-hidden
            style={{ gridColumn: "1 / -1", gridRow: "1 / -1", color: "#64748B", fontSize: 15, fontWeight: 700 }}
          >
            bandeja vazia
          </span>
        )}
      </button>
    </div>
  );
}
