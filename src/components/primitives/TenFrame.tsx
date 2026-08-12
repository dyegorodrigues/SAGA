import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';

interface TenFrameProps {
  flashDurationMs?: number;
  filled?: number;
  filled2?: number | null;
  destacarFileira?: 1 | 2 | null;
  destacarCelula?: number | null;
  preencherAte?: number | null;
  state?: UIState;
  /** Modo MOLDURA (fichas F02, JD3, JD5) — ver `MolduraProps`. */
  moldura?: MolduraProps;
}

/**
 * O modo **moldura**: o que as três fichas da moldura de dez precisam e o modo
 * legado não dava.
 *
 * ### Cinco coisas que faltavam
 *
 * 1. **Tamanho.** A F02 §3 manda 5 casas nos níveis 1-2 e 10 nos demais. O modo
 *    legado desenha `Array.from({ length: 10 })`, sempre — o primeiro degrau da
 *    ficha não existia.
 * 2. **Ocupação como CONJUNTO.** `filled: number` só sabe dizer "as n
 *    primeiras". O nível 5 da JD3 preenche **disperso**, e ali o vazio perde a
 *    forma de propósito: era impossível de representar.
 * 3. **A fileira acendendo INTEIRA.** F02 §4: *"o momento pedagógico central é
 *    o acerto: a fileira acender inteira de uma vez é o que ensina a ver 5 como
 *    unidade. Se acender célula por célula, ensina contagem — o oposto."*
 * 4. **A moldura vazia sobrevivendo ao flash.** JD3 §4: *"as fichas somem. A
 *    moldura vazia **permanece 300ms** — o vazio é a última coisa que a criança
 *    vê."* O modo legado escondia tudo e punha um 🙈 no lugar.
 * 5. **A tampa.** JD5 cobre parte do grupo e pergunta quantos sumiram.
 */
export interface MolduraProps {
  /** 5 ou 10. */
  casas: number;
  /** Índices das casas com ficha. */
  ocupadas: number[];
  /** JD5: índices que a tampa cobre. */
  tapadas?: number[];
  /**
   * JD5, fecho: os que estavam escondidos, agora à mostra em OUTRA COR.
   *
   * §4: *"o grupo inteiro fica visível com os dois subgrupos separados por
   * cor: os que ficaram e os que sumiram"*. Sem isto, a tampa levantava e a
   * criança via um grupo indistinto — a resposta some junto com a tampa.
   */
  revelados?: number[];
  /**
   * F02, fecho: *"a moldura mostra o numeral grande sobreposto,
   * semitransparente"* (§4).
   */
  numeralDoFecho?: number | null;
  /** §4, acerto: a fileira acende INTEIRA, nunca célula por célula. */
  fileiraAcesa?: 1 | 2 | null;
  /** JD3: mostra a moldura sem ficha nenhuma — o alvo antes do preenchimento. */
  soAMoldura?: boolean;
  /** JD3, acerto: as casas que faltavam se preenchem sozinhas, em outra cor. */
  preencherFaltantes?: boolean;
  /** JD3, erro: as casas vazias piscam EM BLOCO (não uma a uma). */
  piscarVazias?: boolean;
  /** JD5, nível 5: sem moldura — os objetos ficam soltos. */
  semMoldura?: boolean;
  /** O desenho da ficha. Padrão: um disco. */
  emoji?: string;
}

export function TenFrame({ filled = 0, filled2 = null, flashDurationMs, destacarFileira = null, destacarCelula = null, preencherAte = null, state = 'ocioso', moldura }: TenFrameProps) {
  const [isFlashed, setIsFlashed] = useState(false);

  useEffect(() => {
    if (flashDurationMs && flashDurationMs > 0) {
      setIsFlashed(false);
      const timer = setTimeout(() => {
        setIsFlashed(true);
      }, flashDurationMs);
      return () => clearTimeout(timer);
    }
  }, [flashDurationMs, filled, filled2]);
  const Frame = ({ n }: { n: number }) => (
    <div 
      className={`relative grid grid-cols-5 gap-1 p-2 shadow-md select-none ${tokens.estado[state]}`}
      style={{
        backgroundColor: tokens.cor.superficie.cartao,
        borderRadius: tokens.tamanho.raio,
        borderColor: tokens.cor.elementos.borda,
        borderWidth: 4,
      }}
    >
      {destacarFileira === 1 && <div className="absolute top-0 left-0 right-0 h-[48%] border-4 border-amber-400 bg-amber-100/50 rounded-lg animate-pulse pointer-events-none" style={{ borderColor: tokens.cor.elementos.marcador }} />}
      {destacarFileira === 2 && <div className="absolute bottom-0 left-0 right-0 h-[48%] border-4 border-amber-400 bg-amber-100/50 rounded-lg animate-pulse pointer-events-none" style={{ borderColor: tokens.cor.elementos.marcador }} />}
      {Array.from({ length: 10 }).map((_, i) => {
        const isHighlighted = (destacarFileira === 1 && i < 5) || (destacarFileira === 2 && i >= 5);
        return (
          <div 
            key={i} 
            className={`flex items-center justify-center z-10 ${isHighlighted ? 'scale-110 shadow-sm' : ''}`} 
            style={{ 
              width: tokens.tamanho.pequeno, 
              height: tokens.tamanho.pequeno, 
              backgroundColor: i < n ? "transparent" : tokens.cor.elementos.preenchimento, 
              border: `2px solid ${tokens.cor.elementos.borda}`,
              borderRadius: '6px'
            }}
          >
            {i < n && (
              <span 
                className="inline-block rounded-full" 
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: tokens.cor.elementos.base_A, 
                  transition: tokens.animacao.padrao
                }} 
              />
            )}
          </div>
        );
      })}
    </div>
  );

  if (moldura) return <Moldura {...moldura} />;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-2 min-h-[120px]">
      <AnimatePresence mode="popLayout">
        {!isFlashed ? (
          <motion.div key="frame" initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0}} className="flex flex-wrap items-center gap-3">
            <Frame n={Math.min(10, filled)} />
      {filled2 != null && (
        <>
          <span 
            className="text-3xl font-black" 
            style={{ color: tokens.cor.texto.secundario }}
          >
            +
          </span>
          <Frame n={Math.min(10, filled2)} />
        </>
      )}
          </motion.div>
        ) : (
          <motion.div
            key="hidden"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-7xl">🙈</span>
            <span className="text-xl font-bold" style={{ color: tokens.cor.texto.secundario }}>Cadê?</span>
            {state !== 'acerto' && state !== 'erro-suave' && (
              <button
                onClick={() => {
                  setIsFlashed(false);
                  setTimeout(() => setIsFlashed(true), 1200);
                }}
                className="mt-2 select-none cursor-pointer active:translate-y-0.5 transition-all"
                // O âmbar do marcador sobre a lavanda dava 1.45:1 — o botão
                // que permite REVER a quantidade era o texto menos legível da
                // tela, justamente o socorro de quem não conseguiu contar a
                // tempo. A moldura continua âmbar (a identidade fica), a letra
                // escurece para 6,4:1. É a MESMA correção já feita no
                // `EmojiRow` (§6.30): a varredura de então parou no primeiro
                // arquivo, e a sonda só viu esta agora porque o N1.08 passou a
                // ter cena de rollback medida.
                style={{ fontFamily: 'inherit', fontWeight: 800, fontSize: 13, color: "#92400E", background: "#F1EDFF", border: `2px solid ${tokens.cor.elementos.marcador}`, borderRadius: 12, padding: "6px 14px" }}
              >
                👀 Ver de novo
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


/* ------------------------------------------------------------------ *
 *  O modo MOLDURA — fichas F02 (N1.08), JD3 (N1.11) e JD5 (N1.10)
 * ------------------------------------------------------------------ */

/** O lado da casa e o vão. Cinco casas + vãos cabem em 340 com folga. */
const LADO = 56;
const VAO = 8;

function Moldura({
  casas,
  ocupadas,
  tapadas = [],
  revelados = [],
  numeralDoFecho = null,
  fileiraAcesa = null,
  soAMoldura,
  preencherFaltantes,
  piscarVazias,
  semMoldura,
  emoji,
}: MolduraProps) {
  const porLinha = 5;
  const linhas = Math.ceil(casas / porLinha);

  if (semMoldura) {
    return (
      <ConjuntoSolto
        ocupadas={soAMoldura ? [] : ocupadas}
        tapadas={tapadas}
        revelados={revelados}
        emoji={emoji}
      />
    );
  }

  return (
    <div
      role="group"
      aria-label={soAMoldura ? "a moldura vazia" : `moldura com ${ocupadas.length} de ${casas}`}
      className="relative grid"
      style={{
        gridTemplateColumns: `repeat(${Math.min(casas, porLinha)}, ${LADO}px)`,
        gridTemplateRows: `repeat(${linhas}, ${LADO}px)`,
        gap: VAO,
        padding: semMoldura ? 0 : 10,
        borderRadius: 18,
        // §5 da JD5, nível 5: SEM moldura. A moldura é o andaime de memória, e
        // tirá-la é o degrau — não um detalhe de estilo.
        border: semMoldura ? "none" : `4px solid ${tokens.cor.elementos.borda}`,
        backgroundColor: semMoldura ? "transparent" : tokens.cor.superficie.cartao,
      }}
    >
      {Array.from({ length: casas }).map((_, i) => {
        const temFicha = ocupadas.includes(i) && !soAMoldura;
        const tapada = tapadas.includes(i);
        const naFileiraAcesa = fileiraAcesa === 1 ? i < 5 : fileiraAcesa === 2 ? i >= 5 : false;
        const vazia = !temFicha;
        return (
          <motion.div
            key={i}
            aria-hidden
            className="flex items-center justify-center"
            style={{
              width: LADO,
              height: LADO,
              borderRadius: 10,
              // ⚠️ A casa vazia tem CONTORNO VISÍVEL. A JD3 §3: "o vazio precisa
              // ser um objeto, não ausência de objeto" — é dele que a ficha
              // inteira trata.
              border: semMoldura ? "none" : `2px solid ${tokens.cor.elementos.borda}`,
              backgroundColor: semMoldura
                ? "transparent"
                : vazia ? tokens.cor.elementos.preenchimento : "transparent",
            }}
            // §4 da F02: a fileira acende INTEIRA, de uma vez. Acender célula
            // por célula ensinaria contagem — o oposto do que a ficha quer.
            animate={{
              backgroundColor: naFileiraAcesa
                ? "#FDE68A"
                : semMoldura ? "rgba(0,0,0,0)" : vazia
                  ? (piscarVazias ? "#FDE68A" : tokens.cor.elementos.preenchimento)
                  : "rgba(0,0,0,0)",
            }}
            transition={{ duration: 0.35, repeat: piscarVazias && vazia ? Infinity : 0, repeatType: "reverse" }}
          >
            {temFicha && !tapada && (
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 18 }}
                style={emoji
                  ? { fontSize: LADO - 18, lineHeight: 1 }
                  // §4 da JD5, fecho: "os dois subgrupos separados por cor".
                  // Quem estava sob a tampa volta em âmbar; quem ficou à mostra
                  // continua da cor de sempre.
                  : {
                    width: 30, height: 30, borderRadius: "50%", display: "block",
                    backgroundColor: revelados.includes(i) ? "#D97706" : tokens.cor.elementos.base_A,
                  }}
              >
                {emoji}
              </motion.span>
            )}
            {/* JD3, acerto: "as casas que faltavam se preenchem sozinhas, uma
                cor diferente" — é a animação que mostra os dois números juntos
                fechando dez, e é o tratamento de `RESPONDE_O_CHEIO`. */}
            {preencherFaltantes && vazia && (
              <motion.span
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: "#16A34A", display: "block" }}
              />
            )}
          </motion.div>
        );
      })}

      {/* JD5: a tampa. Ela cobre um BLOCO — deslizando, com "swoosh" —, e é a
          §4 que manda o movimento ser "lento o suficiente para a criança ver
          quantos foram cobertos, mas não tão lento que ela conte".

          ⚠️ **Uma tampa por FILEIRA.** Uma tampa só cobria um trecho de uma
          linha, e os níveis 4-5 da JD5 escondem até nove numa moldura de dez:
          metade dos escondidos continuava à vista, e a criança respondia
          contando o que devia estar tapado. */}
      {faixasDaTampa(tapadas, porLinha).map(faixa => (
        <motion.div
          key={`tampa-${faixa.linha}`}
          // `role="img"`: `aria-label` num `div` sem papel é atributo proibido,
          // e o axe acusa. A tampa PRECISA ser anunciada — é ela que faz a
          // pergunta —, então ela ganha papel em vez de perder o nome.
          role="img"
          aria-label="a tampa"
          className="pointer-events-none"
          style={{
            gridColumn: `${faixa.de + 1} / span ${faixa.ate - faixa.de + 1}`,
            gridRow: faixa.linha + 1,
            borderRadius: 10,
            backgroundColor: "#64748B",
            alignSelf: "stretch",
          }}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        />
      ))}

      {/* F02 §4, fecho: "a moldura mostra o numeral grande sobreposto,
          semitransparente, por 800ms". `aria-hidden` porque a voz já disse o
          número, e o leitor de tela não deve lê-lo duas vezes. */}
      {numeralDoFecho !== null && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-black"
          style={{ fontSize: 96, lineHeight: 1, color: "#22315C", opacity: 0.28 }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.28 }}
          transition={{ duration: 0.35 }}
        >
          {numeralDoFecho}
        </motion.span>
      )}
    </div>
  );
}

/**
 * JD5 nível 5 — retirada REAL da moldura.
 *
 * Esconder só a borda e manter os pontos em `grid-cols-5` era um falso fade de
 * andaime: a criança ainda recebia a geometria 5x2. Aqui não há casas vazias nem
 * colunas implícitas; só os objetos que realmente existem, em um percurso
 * irregular estável (estável para a memória, irregular para não virar ten-frame).
 */
const PONTOS_SOLTOS = [
  { x: 24, y: 34 }, { x: 88, y: 12 }, { x: 154, y: 42 }, { x: 222, y: 20 }, { x: 292, y: 46 },
  { x: 304, y: 112 }, { x: 238, y: 132 }, { x: 168, y: 104 }, { x: 98, y: 134 }, { x: 30, y: 110 },
] as const;

function ConjuntoSolto({
  ocupadas,
  tapadas,
  revelados,
  emoji,
}: {
  ocupadas: number[];
  tapadas: number[];
  revelados: number[];
  emoji?: string;
}) {
  const tampas = retangulosDaTampaSolta(tapadas);
  return (
    <div
      role="group"
      aria-label={`conjunto solto com ${ocupadas.length} objetos`}
      className="relative select-none"
      style={{ width: 340, height: 170 }}
    >
      {ocupadas.filter(i => !tapadas.includes(i)).map(i => {
        const ponto = PONTOS_SOLTOS[i];
        return (
          <motion.span
            key={i}
            data-testid="objeto-solto"
            aria-hidden
            className="absolute flex items-center justify-center"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ left: ponto.x, top: ponto.y, width: 34, height: 34 }}
          >
            {emoji ? (
              <span style={{ fontSize: 30, lineHeight: 1 }}>{emoji}</span>
            ) : (
              <span
                className="block rounded-full"
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: revelados.includes(i) ? "#D97706" : tokens.cor.elementos.base_A,
                }}
              />
            )}
          </motion.span>
        );
      })}

      {tampas.map((tampa, i) => (
        <motion.div
          key={i}
          data-testid="tampa-solta"
          role="img"
          aria-label="a tampa"
          className="absolute pointer-events-none"
          style={{
            left: tampa.x,
            top: tampa.y,
            width: tampa.w,
            height: tampa.h,
            borderRadius: 18,
            backgroundColor: "#64748B",
          }}
          initial={{ x: 38, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        />
      ))}
    </div>
  );
}

/**
 * A tampa continua sendo uma superfície, nunca um quadradinho por objeto — se
 * cada escondido ganhasse sua própria tampa, bastaria contar as tampas. Quando o
 * grupo cruza a curva do percurso, usamos no máximo duas faixas amplas.
 */
export function retangulosDaTampaSolta(tapadas: number[]): { x: number; y: number; w: number; h: number }[] {
  const grupos = [tapadas.filter(i => i <= 4), tapadas.filter(i => i >= 5)].filter(g => g.length > 0);
  return grupos.map(grupo => {
    const pontos = grupo.map(i => PONTOS_SOLTOS[i]);
    const minX = Math.min(...pontos.map(p => p.x));
    const maxX = Math.max(...pontos.map(p => p.x));
    const minY = Math.min(...pontos.map(p => p.y));
    const maxY = Math.max(...pontos.map(p => p.y));
    const pad = 12;
    return {
      x: Math.max(0, minX - pad),
      y: Math.max(0, minY - pad),
      w: Math.max(62, maxX - minX + 34 + pad * 2),
      h: Math.max(58, maxY - minY + 34 + pad * 2),
    };
  });
}

/**
 * A tampa da JD5, fatiada por fileira.
 *
 * As casas escondidas são sempre um rabo contíguo do preenchimento, e um rabo
 * de sete numa moldura de dez atravessa as duas fileiras. Uma tampa por faixa é
 * o que cobre o bloco inteiro sem tapar casa vazia à toa.
 */
export function faixasDaTampa(tapadas: number[], porLinha: number): { linha: number; de: number; ate: number }[] {
  const porFileira = new Map<number, number[]>();
  for (const i of tapadas) {
    const linha = Math.floor(i / porLinha);
    porFileira.set(linha, [...(porFileira.get(linha) ?? []), i % porLinha]);
  }
  return [...porFileira.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([linha, colunas]) => ({ linha, de: Math.min(...colunas), ate: Math.max(...colunas) }));
}
