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
 * A §7 escreve o howto: *"Aperte o **botão azul**."* O botão estava **âmbar**,
 * pintado com `tokens.cor.elementos.marcador`. A voz mandava apertar um botão
 * que não existia na tela — é o §6.27, quantificador em texto é promessa que o
 * desenho tem de cumprir, e aqui a promessa é uma cor. Uma criança de 4 anos
 * que ainda não lê depende da cor para achar o alvo.
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
  disabled?: boolean;
  /**
   * Multiplicador da velocidade da fala.
   *
   * §5, nível 5: *"a voz fala mais rápido — reconhecimento automático"*. É o
   * mesmo instrumento da exposição caindo na JD1: o degrau final aumenta a
   * automaticidade, não o número.
   */
  velocidade?: number;
  /**
   * Avisa que a criança pediu para ouvir de novo.
   *
   * §4: *"sem limite de repetições, sem penalidade"*. O número não pune — ele
   * informa: a §9 exige pelo menos um acerto **na primeira audição**, e sem
   * contar as repetições esse critério não teria como existir.
   */
  onRepetir?: () => void;
  /** §4: o numeral escolhido cresce e brilha, ou desliza de volta. */
  realceDaOpcao?: (opcao: number | string) => 'acerto' | 'erro' | null;
  /** §8: o botão de som pulsa — "pode apertar de novo". */
  pulsarBotao?: boolean;
  /** §8: as opções pulsam — "agora ache o três". */
  pulsarOpcoes?: boolean;
  /** As opções já subiram da base? §4: elas entram DEPOIS da primeira audição. */
  mostrarOpcoes?: boolean;
}

/** §3: "mínimo 120px". O botão é o elemento dominante da tela. */
const BOTAO = 160;

/**
 * O azul da §7.
 *
 * `tokens.cor.acao.primaria` é um **valor CSS**, não uma classe — usá-lo em
 * `className` não pinta nada (§6.30). Entra por `style`, como manda a regra.
 */
const AZUL = '#2563EB';
const AZUL_ESCURO = '#1D4ED8';

export function AudioChoice({
  audioPrompt,
  options,
  onSelect,
  disabled,
  velocidade = 1,
  onRepetir,
  realceDaOpcao,
  pulsarBotao,
  pulsarOpcoes,
  mostrarOpcoes = true,
}: AudioChoiceProps) {
  const [tocando, setTocando] = useState(false);
  /** A primeira execução é automática (§4) e NÃO conta como repetição. */
  const jaTocouSozinho = useRef(false);

  useEffect(() => {
    jaTocouSozinho.current = false;
    tocar(true);
    // A cena muda quando a palavra muda; é essa a dependência.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioPrompt]);

  function tocar(automatico = false) {
    setTocando(true);
    speak(audioPrompt, { rate: velocidade } as never);
    if (automatico) {
      jaTocouSozinho.current = true;
    } else {
      onRepetir?.();
    }
    // A fala não expõe evento de fim aqui; 1,2s é o tempo da §4.
    window.setTimeout(() => setTocando(false), 1200);
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 py-4">
      <motion.button
        type="button"
        whileTap={disabled ? {} : { scale: 0.95 }}
        onClick={() => !disabled && tocar()}
        disabled={disabled}
        aria-label="Escutar o número"
        className="relative flex items-center justify-center rounded-full shadow-lg"
        style={{
          width: BOTAO,
          height: BOTAO,
          backgroundColor: AZUL,
          border: `4px solid ${AZUL_ESCURO}`,
          color: tokens.cor.texto.inverso,
        }}
        // §4: o botão fica com "um pulso lento e contínuo, dizendo 'pode
        // apertar de novo'". Escala aqui não vaza: ele tem 160px numa tela de
        // 390 e é centrado.
        animate={pulsarBotao ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={{ duration: 1.2, repeat: pulsarBotao ? Infinity : 0 }}
      >
        <span aria-hidden className="text-6xl">{tocando ? '🔊' : '🔈'}</span>
        {/* §4: "ondas sonoras pulsam saindo do botão".
            O `animate-ping` do Tailwind escala para **2x**: sobre um botão de
            160px isso são 320px, e o print mostrou a onda cobrindo o enunciado
            em cima e as alternativas embaixo. Onda que tapa a resposta não é
            onda, é ruído — e a §3 manda a tela ser vazia justamente para nada
            competir com o som.
            Um anel próprio, até 1,3x, sai do botão sem alcançar nada. */}
        {tocando && (
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
                whileTap={disabled ? {} : { scale: 0.95 }}
                onClick={() => !disabled && onSelect(opt)}
                disabled={disabled}
                className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-black shadow-md"
                style={{
                  backgroundColor: realce === 'acerto' ? '#D1FAE5'
                    : realce === 'erro' ? '#FEF3C7'
                      : tokens.cor.superficie.fundo,
                  color: tokens.cor.texto.principal,
                  border: `2px solid ${realce === 'acerto' ? '#16A34A' : tokens.cor.elementos.borda}`,
                }}
                // §4: o escolhido "cresce e brilha"; o errado "desliza de volta
                // para a posição". As opções sobem escalonadas a cada 100ms.
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
