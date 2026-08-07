import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { tokens } from '../../styles/tokens';
import { speak } from '../Mascot';

/**
 * `AudioChoice` — a primitiva da ficha F05 (N1.06).
 *
 * ---
 *
 * ### A §3, que é curta e manda em tudo
 *
 * > *"A tela é deliberadamente **vazia**. Nada de cenário, nada de mascote,
 * > nada de objeto. Só o botão de som e os numerais. Qualquer elemento extra
 * > compete com a única coisa que importa: o som."*
 *
 * É a única tela do bloco onde o vazio **não** é o defeito §6.6 — aqui o vazio
 * é o conteúdo, e o que preenche a tela é o áudio.
 *
 * ### O botão é AZUL, e isso não é gosto
 *
 * A §7 escreve o howto: *"Aperte o **botão azul**."* Cor é como uma criança de
 * 4 anos que ainda não lê encontra o alvo.
 *
 * ### O que a primitiva NÃO sabe
 *
 * Ela desenha e reporta. Quem conta repetições, decide acerto e roda a
 * coreografia é o `AudioChoiceStage` — a primitiva não conhece nível, ficha nem
 * diagnóstico.
 */

export interface AudioChoiceProps {
  /** A palavra que a voz diz: "três". Nunca aparece escrita. */
  audioPrompt: string;
  options: (number | string)[];
  onSelect: (option: number | string) => void;
  /** Desliga a primitiva inteira — inclusive o botão de som. */
  disabled?: boolean;
  /**
   * Desliga só as alternativas, sem calar o botão de som.
   *
   * A §4 exige exatamente isto durante o erro suave: o numeral volta enquanto
   * o botão continua pulsando, convidando a ouvir de novo.
   */
  optionsDisabled?: boolean;
  /** Multiplicador da velocidade da fala. Nível 5 acelera a voz (§5). */
  velocidade?: number;
  /** Avisa que a criança pediu para ouvir de novo. */
  onRepetir?: () => void;
  /**
   * A primeira execução automática terminou. É o relógio canônico que autoriza
   * as opções a subir da base — antes disso, a §4 manda haver só o botão.
   */
  onPrimeiraAudicao?: () => void;
  /**
   * A execução automática da §4. Durante a micro-aula fica falsa: a
   * coreografia §8 narra a demonstração e não pode disputar voz com autoplay.
   */
  autoPlay?: boolean;
  /** §4: o numeral escolhido cresce e brilha, ou desliza de volta. */
  realceDaOpcao?: (opcao: number | string) => 'acerto' | 'erro' | null;
  /** §8: o botão de som pulsa — "pode apertar de novo". */
  pulsarBotao?: boolean;
  /** §8: as opções pulsam — "agora ache o três". */
  pulsarOpcoes?: boolean;
  /** §8: o beat falado mostra ondas mesmo sem disparar outro TTS interno. */
  ondasAtivas?: boolean;
  /** As opções já subiram da base? §4: entram DEPOIS da primeira audição. */
  mostrarOpcoes?: boolean;
}

/** §3: "mínimo 120px". O botão é o elemento dominante da tela. */
const BOTAO = 160;
const DURACAO_DA_AUDICAO = 1200;

const AZUL = '#2563EB';
const AZUL_ESCURO = '#1D4ED8';

export function AudioChoice({
  audioPrompt,
  options,
  onSelect,
  disabled,
  optionsDisabled,
  velocidade = 1,
  onRepetir,
  onPrimeiraAudicao,
  autoPlay = true,
  realceDaOpcao,
  pulsarBotao,
  pulsarOpcoes,
  ondasAtivas,
  mostrarOpcoes = true,
}: AudioChoiceProps) {
  const [tocando, setTocando] = useState(false);
  const fimDaFala = useRef<number | null>(null);
  const primeiraAudicaoRef = useRef(onPrimeiraAudicao);

  useEffect(() => { primeiraAudicaoRef.current = onPrimeiraAudicao; }, [onPrimeiraAudicao]);

  /**
   * A referência das `options` faz parte da identidade da questão. Duas
   * questões consecutivas podem pedir a MESMA palavra; depender só de
   * `audioPrompt` faria a segunda nascer sem a execução automática.
   */
  useEffect(() => {
    if (!autoPlay) return;
    tocar(true);
    return () => {
      if (fimDaFala.current !== null) window.clearTimeout(fimDaFala.current);
    };
    // `tocar` é intencionalmente local; a cena muda por palavra OU por novo
    // conjunto de opções, que é a identidade observável da questão.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioPrompt, options, autoPlay]);

  useEffect(() => () => {
    if (fimDaFala.current !== null) window.clearTimeout(fimDaFala.current);
  }, []);

  function tocar(automatico = false) {
    if (fimDaFala.current !== null) window.clearTimeout(fimDaFala.current);
    setTocando(true);
    speak(audioPrompt, { rate: velocidade } as never);
    if (!automatico) onRepetir?.();

    fimDaFala.current = window.setTimeout(() => {
      fimDaFala.current = null;
      setTocando(false);
      if (automatico) primeiraAudicaoRef.current?.();
    }, DURACAO_DA_AUDICAO);
  }

  const somDesligado = Boolean(disabled) || tocando;
  const opcoesDesligadas = Boolean(disabled) || Boolean(optionsDisabled);
  const mostrarOndas = tocando || ondasAtivas;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 py-4">
      <motion.button
        type="button"
        whileTap={somDesligado ? {} : { scale: 0.95 }}
        onClick={() => !somDesligado && tocar()}
        disabled={somDesligado}
        aria-label="Escutar o número"
        className="relative flex items-center justify-center rounded-full shadow-lg"
        style={{
          width: BOTAO,
          height: BOTAO,
          backgroundColor: AZUL,
          border: `4px solid ${AZUL_ESCURO}`,
          color: tokens.cor.texto.inverso,
        }}
        // §4 abertura: scale 0 → 1; depois, quando as opções já subiram, o
        // pulso lento comunica "pode apertar de novo".
        initial={{ scale: 0 }}
        animate={pulsarBotao ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={{ duration: 1.2, repeat: pulsarBotao ? Infinity : 0 }}
      >
        <span aria-hidden className="text-6xl">{mostrarOndas ? '🔊' : '🔈'}</span>
        {mostrarOndas && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ border: `4px solid ${AZUL}` }}
            initial={{ scale: 1, opacity: 0.55 }}
            animate={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </motion.button>

      {mostrarOpcoes && (
        <div role="group" aria-label="Números" className="flex flex-wrap justify-center gap-4">
          {options.map((opt, i) => {
            const realce = realceDaOpcao?.(opt) ?? null;
            return (
              <motion.button
                key={i}
                type="button"
                whileTap={opcoesDesligadas ? {} : { scale: 0.95 }}
                onClick={() => !opcoesDesligadas && onSelect(opt)}
                disabled={opcoesDesligadas}
                className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-black shadow-md"
                style={{
                  backgroundColor: realce === 'acerto' ? '#D1FAE5'
                    : realce === 'erro' ? '#FEF3C7'
                      : tokens.cor.superficie.fundo,
                  color: tokens.cor.texto.principal,
                  border: `2px solid ${realce === 'acerto' ? '#16A34A' : tokens.cor.elementos.borda}`,
                }}
                // §4: o escolhido "cresce e brilha"; o errado "desliza de volta".
                initial={{ opacity: 0, y: 16 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: realce === 'acerto' ? 1.18 : (pulsarOpcoes ? [1, 1.08, 1] : 1),
                  x: realce === 'erro' ? [0, -8, 8, 0] : 0,
                }}
                transition={{
                  delay: realce ? 0 : i * 0.1,
                  duration: realce === 'erro' ? 0.4 : 0.5,
                  repeat: pulsarOpcoes && !realce ? Infinity : 0,
                  repeatDelay: 0.6,
                }}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
