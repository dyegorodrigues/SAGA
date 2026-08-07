import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { tokens } from '../../styles/tokens';
import { speak } from '../Mascot';

/**
 * `AudioChoice` — a primitiva da ficha F05 (N1.06), Ouvir e Escolher.
 *
 * A tela é deliberadamente econômica: botão de som + numerais. A primitiva
 * desenha e reporta; nível, diagnóstico e coreografia pertencem ao palco/ficha.
 */
export interface AudioChoiceProps {
  /** A palavra que a voz diz: "três". Nunca aparece escrita. */
  audioPrompt: string;
  options: (number | string)[];
  onSelect: (option: number | string) => void;
  /** Desliga a primitiva inteira — inclusive o botão de som. */
  disabled?: boolean;
  /** Desliga só as alternativas, mantendo o replay disponível no erro suave. */
  optionsDisabled?: boolean;
  /** Multiplicador da velocidade da fala. Nível 5 acelera a voz (§5). */
  velocidade?: number;
  /** Avisa que a criança pediu para ouvir de novo. */
  onRepetir?: () => void;
  /** A primeira execução automática terminou e as opções já podem subir. */
  onPrimeiraAudicao?: () => void;
  /** Na micro-aula fica falsa: a coreografia §8 é dona da narração. */
  autoPlay?: boolean;
  /** §4: o numeral escolhido cresce/brilha ou desliza de volta. */
  realceDaOpcao?: (opcao: number | string) => 'acerto' | 'erro' | null;
  /** §8: o botão pulsa para convidar ao replay. */
  pulsarBotao?: boolean;
  /** §8: as opções pulsam no beat "agora ache". */
  pulsarOpcoes?: boolean;
  /** §8: ondas no beat falado, sem disparar TTS interno concorrente. */
  ondasAtivas?: boolean;
  /** As opções já subiram da base? */
  mostrarOpcoes?: boolean;
}

/** §3: mínimo 120px; 160 mantém o áudio como elemento dominante. */
const BOTAO = 160;
const DURACAO_DA_AUDICAO = 1200;
const AZUL = '#2563EB';
const AZUL_ESCURO = '#1D4ED8';
const LADO_DA_OPCAO = 80;

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
   * A referência das opções faz parte da identidade observável da questão.
   * Duas questões consecutivas podem pedir a MESMA palavra; depender só de
   * `audioPrompt` faria a segunda nascer sem a execução automática.
   */
  useEffect(() => {
    if (!autoPlay) return;
    tocar(true);
    return () => {
      if (fimDaFala.current !== null) window.clearTimeout(fimDaFala.current);
    };
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

  /**
   * Layout sem pista posicional:
   * - 2 opções: 1×2
   * - 3 opções: 1×3
   * - 4 opções: 2×2
   *
   * O flex anterior virava 3+1 no cartão real de 390px. A quarta alternativa
   * ficava sozinha no centro e ganhava saliência visual, exatamente o tipo de
   * atalho que pode contaminar uma tarefa de reconhecimento som→símbolo.
   */
  const colunasDeOpcoes = options.length === 4 ? 2 : Math.max(1, options.length);

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
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </motion.button>

      {mostrarOpcoes && (
        <div
          role="group"
          aria-label="Números"
          data-colunas={colunasDeOpcoes}
          className="grid justify-center gap-4"
          style={{ gridTemplateColumns: `repeat(${colunasDeOpcoes}, ${LADO_DA_OPCAO}px)` }}
        >
          {options.map((opt, i) => {
            const realce = realceDaOpcao?.(opt) ?? null;
            return (
              <motion.button
                key={String(opt)}
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
