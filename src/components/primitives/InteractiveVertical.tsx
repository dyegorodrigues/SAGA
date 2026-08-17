import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AnswerMeta, Question } from '../../types';
import { tokens, UIState } from '../../styles/tokens';
import { OPERACAO } from '../../styles/coresDeOperacao';
import { getVerticalColumnStep, inferVerticalMisconception, verticalAnswerFromColumns, verticalDigitChoices } from './verticalProcedure';

const TINTA_DA_CONTA = OPERACAO.adicao.cor;

interface InteractiveVerticalProps {
  q: Question;
  onAnswer: (val: number) => void;
  onMistake?: (digit: number, meta: AnswerMeta) => void;
  onRegroup?: (remainingUnits: number) => void;
  showAlgorithm?: boolean;
  disabled: boolean;
  state?: UIState;
}

export function InteractiveVertical({ q, onAnswer, onMistake, onRegroup, showAlgorithm = true, disabled, state = 'ocioso' }: InteractiveVerticalProps) {
  const top = q.vTop ?? 0;
  const bot = q.vBot ?? 0;
  const op = q.vOp ?? "+";
  const topStr = String(top);
  const botStr = String(bot);
  const maxLen = Math.max(topStr.length, botStr.length);
  const totalCols = maxLen;
  const [colIdx, setColIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(totalCols + 1).fill(''));
  const [carries, setCarries] = useState<string[]>(Array(totalCols + 1).fill(''));
  const [currentInput, setCurrentInput] = useState('');
  const step = getVerticalColumnStep(top, bot, op, colIdx);

  const handleConfirm = (input = currentInput) => {
    if (disabled || input === '') return;
    if (parseInt(input, 10) === step.expectedDigit) {
      const newAnswers = [...answers];
      newAnswers[colIdx] = input;
      setAnswers(newAnswers);
      if (step.carry && op === "+") {
        const newCarries = [...carries];
        newCarries[colIdx + 1] = '1';
        setCarries(newCarries);
        if (colIdx === 0) onRegroup?.(step.expectedDigit);
      } else if (step.borrow && op === "-") {
        const newCarries = [...carries];
        newCarries[colIdx + 1] = '-1';
        setCarries(newCarries);
      }
      setCurrentInput('');
      if (colIdx === totalCols - 1) {
        if (step.carry && op === "+") setColIdx(colIdx + 1);
        else onAnswer(verticalAnswerFromColumns(newAnswers));
      } else if (colIdx === totalCols) onAnswer(verticalAnswerFromColumns(newAnswers));
      else setColIdx(colIdx + 1);
    } else {
      setCurrentInput('');
      const selectedDigit = parseInt(input, 10);
      onMistake?.(selectedDigit, { source: "vertical-column", columnIndex: colIdx, misconception: inferVerticalMisconception(top, bot, op, colIdx, selectedDigit) });
    }
  };

  const digitChoices = verticalDigitChoices(step.expectedDigit, top + bot + colIdx);
  return <div className={`flex flex-col items-center select-none ${tokens.estado[state]}`}>
    {showAlgorithm && <div className="font-mono text-4xl sm:text-5xl font-black tracking-[0.2em] p-3 sm:p-5 rounded-2xl shadow-inner relative" style={{ backgroundColor: tokens.cor.superficie.cartao, color: tokens.cor.texto.principal, borderColor: tokens.cor.elementos.borda, borderWidth: 1 }}>
      <div className="flex absolute -top-4 left-0 right-0 justify-end pr-6">{Array.from({ length: totalCols + 1 }).map((_, i) => { const power = totalCols - i; const c = carries[power]; return <span key={`c${i}`} className="w-12 text-center text-xl" style={{ color: tokens.cor.elementos.base_B }}>{c === '-1' ? '−1' : c === '1' ? '+1' : ''}</span>; })}</div>
      <div className="flex justify-end pr-6">{Array.from({ length: totalCols + 1 }).map((_, i) => { const char = topStr.padStart(totalCols, ' ')[i - 1]; return <span key={`t${i}`} className="w-12 text-center">{char || ' '}</span>; })}</div>
      <div className="flex relative border-b-4 pb-2 mb-2 justify-end pr-6" style={{ borderColor: tokens.cor.texto.principal }}><span className="absolute left-4" style={{ color: TINTA_DA_CONTA }}>{op}</span>{Array.from({ length: totalCols + 1 }).map((_, i) => { const char = botStr.padStart(totalCols, ' ')[i - 1]; return <span key={`b${i}`} className="w-12 text-center">{char || ' '}</span>; })}</div>
      <div className="flex h-14 justify-end pr-6 relative">{Array.from({ length: totalCols + 1 }).map((_, i) => { const power = totalCols - i; const c = answers[power]; const isActiveCol = colIdx === power; return <span key={`a${i}`} className="w-12 text-center relative">{isActiveCol ? <span style={{ color: TINTA_DA_CONTA }}>{currentInput}<span className="animate-pulse">_</span></span> : <span style={{ color: tokens.cor.texto.principal }}>{c}</span>}</span>; })}</div>
    </div>}
    {!disabled && <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3" aria-label="Escolha o algarismo desta coluna">{digitChoices.map(n => <button key={n} onClick={() => handleConfirm(String(n))} className="w-20 h-20 rounded-2xl text-2xl font-bold shadow-sm active:scale-95 transition-transform" style={{ backgroundColor: tokens.cor.superficie.fundo, color: tokens.cor.texto.principal, borderColor: tokens.cor.elementos.borda, borderWidth: 2 }}>{n}</button>)}</div>}
  </div>;
}

interface DivisionSurfaceProps {
  dividendo: number;
  divisor: number;
  quociente: number;
  resto: number;
  destacarZero?: boolean;
}

/** Extensão visual da primitiva InteractiveVertical para a conta de divisão da F69. */
export function InteractiveVerticalDivisionSurface({ dividendo, divisor, quociente, resto, destacarZero = false }: DivisionSurfaceProps) {
  const digits = String(quociente).split('');
  const produto = divisor * quociente;
  return <div data-interactive-vertical-division className="mx-auto max-w-md rounded-3xl border-2 border-slate-200 bg-white p-4 font-mono text-slate-800 shadow-inner" aria-label={`${dividendo} dividido por ${divisor}`}>
    <div className="grid grid-cols-[auto_1fr] items-end gap-x-3 text-3xl font-black">
      <div className="pb-1 text-right text-indigo-700">{divisor}</div>
      <div>
        <div className="flex min-h-10 justify-end border-b-2 border-indigo-500 px-2" aria-label={`Quociente ${quociente}`}>{digits.map((digit, i) => <span key={`${digit}-${i}`} className={destacarZero && digit === '0' ? 'rounded bg-amber-200 px-1 text-amber-900' : 'px-1'}>{digit}</span>)}</div>
        <div className="px-2 pt-1 text-right">{dividendo}</div>
      </div>
    </div>
    <div className="mt-3 space-y-1 text-right text-lg" aria-label="Conferência da divisão">
      <p>− {produto}</p>
      <div className="border-t border-slate-300 pt-1">resto {resto}</div>
      <p className="text-sm font-sans font-bold text-slate-600">{quociente} × {divisor} + {resto} = {dividendo}</p>
    </div>
  </div>;
}

interface DivisionEstimateSurfaceProps {
  dividendo: number;
  divisor: number;
  divisorArredondado: number;
  estimativa: number;
  produtoTeste?: number;
  relacao?: 'passou' | 'cabe-mais' | 'exata';
}

/**
 * F71 reutiliza a primitiva InteractiveVertical sem vazar o quociente correto.
 * A faixa superior mostra somente a estimativa escolhida pela criança; o rascunho
 * aparece depois do toque em "Testar", quando a multiplicação vira evidência causal.
 */
export function InteractiveVerticalDivisionEstimateSurface({ dividendo, divisor, divisorArredondado, estimativa, produtoTeste, relacao }: DivisionEstimateSurfaceProps) {
  return <div data-interactive-vertical-division-estimate className="mx-auto max-w-md rounded-3xl border-2 border-slate-200 bg-white p-4 font-mono text-slate-800 shadow-inner" aria-label={`${dividendo} dividido por ${divisor}, estimativa em teste ${estimativa}`}>
    <div className="mb-3 rounded-2xl bg-slate-50 p-3 text-center font-sans text-sm font-bold text-slate-700" data-f71-rounded-divisor="">
      Para estimar: {divisor} ≈ {divisorArredondado}. O teste usa o divisor real {divisor}.
    </div>
    <div className="grid grid-cols-[auto_1fr] items-end gap-x-3 text-3xl font-black">
      <div className="pb-1 text-right text-indigo-700">{divisor}</div>
      <div>
        <div className="min-h-12 border-b-2 border-indigo-500 px-2 text-right" aria-label={`Estimativa atual ${estimativa}`}><span className="text-indigo-700">~ {estimativa}</span></div>
        <div className="px-2 pt-1 text-right">{dividendo}</div>
      </div>
    </div>
    <div className="mt-4 min-h-24 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3" data-f71-scratch="">
      <p className="font-sans text-xs font-black uppercase tracking-wide text-slate-500">Rascunho — multiplicação de teste</p>
      {produtoTeste === undefined ? <p className="mt-2 font-sans text-sm font-semibold text-slate-600">Toque em Testar para comparar a estimativa com o dividendo.</p> : <>
        <p className="mt-2 text-right text-xl font-black">{estimativa} × {divisor} = {produtoTeste}</p>
        <p className="mt-1 font-sans text-center text-sm font-black" data-f71-test-relation={relacao}>{relacao === 'passou' ? 'Passou do dividendo: tente menos.' : relacao === 'cabe-mais' ? 'Cabe e ainda sobra espaço para outro grupo: tente mais.' : 'Esta quantidade de grupos é a maior que cabe.'}</p>
      </>}
    </div>
  </div>;
}
