import React from 'react';
import { AnswerMeta, Question } from '../types';

// Import primitives
import { EmojiRow } from './primitives/EmojiRow';
import { TenFrame } from './primitives/TenFrame';
import { VisualAddition } from './primitives/VisualAddition';
import { VisualAdditionStage } from './primitives/VisualAdditionStage';
import { EmojiRowRiscarStage } from './primitives/EmojiRowRiscarStage';
import { ScatteredItems } from './primitives/ScatteredItems';
import { LinkingCubes } from './primitives/LinkingCubes';
import { TakeApart } from './primitives/TakeApart';
import { NumberBond } from './primitives/NumberBond';
import { NumberLine } from './primitives/NumberLine';
import { InteractiveNumberLine } from './primitives/InteractiveNumberLine';
import { Reta20Stage } from './primitives/Reta20Stage';
import { ReguaStage } from './primitives/ReguaStage';
import { Quadrado100 } from './primitives/Quadrado100';
import { Quadrado100Stage } from './primitives/Quadrado100Stage';
import { ShapeCanvas } from './primitives/ShapeCanvas';
import { Relogio } from './primitives/Relogio';
import { Balanca } from './primitives/Balanca';
import { MaterialDourado } from './primitives/MaterialDourado';
import { MaterialDouradoStage } from './primitives/MaterialDouradoStage';
import { DragGroup } from './primitives/DragGroup';
import { VerticalPlaceValueStage } from './primitives/VerticalPlaceValueStage';
import { StoryBarsStage } from "./primitives/StoryBarsStage";
import { TabuadaStage } from './primitives/TabuadaStage';
import { DecomposicaoStage } from './primitives/DecomposicaoStage';
import { AncoraStage } from './primitives/AncoraStage';
import { FamiliaStage } from './primitives/FamiliaStage';
import { DeslocamentoStage } from './primitives/DeslocamentoStage';
import { AreaStage } from './primitives/AreaStage';
import { PareamentoStage } from './primitives/PareamentoStage';
import { TouchCount } from './primitives/TouchCount';
import { EmojiRowStage } from './primitives/EmojiRowStage';
import { ClassificacaoStage } from './primitives/ClassificacaoStage';
import { TouchPlaceStage } from './primitives/TouchPlaceStage';
import { CenaDePosicaoStage } from './primitives/CenaDePosicaoStage';
import { FormaStage } from './primitives/FormaStage';
import { GrandezaStage } from './primitives/GrandezaStage';
import { ComparacaoSimbolicaStage } from './primitives/ComparacaoSimbolicaStage';
import { MedidasStage } from './primitives/MedidasStage';
import { MolduraStage } from './primitives/MolduraStage';
import { AudioChoiceStage } from './primitives/AudioChoiceStage';
import { ArrayGrid } from './primitives/ArrayGrid';
import { MaterialDouradoSpec } from '../curriculum/procedimentos/materialDouradoContract';
import {
  diagnosticarMaterialDourado,
  evidenciasMaterialDourado,
} from '../curriculum/procedimentos/materialDouradoProcedure';
import { Reta20Spec } from '../curriculum/procedimentos/reta20Contract';
import { diagnosticarReta20, evidenciasReta20 } from '../curriculum/procedimentos/reta20Procedure';
import { ReguaSpec } from '../curriculum/procedimentos/reguaContract';
import { ComparacaoSimbolicaSpec } from '../curriculum/procedimentos/comparacaoSimbolicaContract';
import { Quadrado100Spec } from '../curriculum/procedimentos/quadrado100Contract';
import {
  AcaoQuadrado100,
  diagnosticarQuadrado100,
  evidenciasQuadrado100,
} from '../curriculum/procedimentos/quadrado100Procedure';
import { VisualAdditionSpec } from '../curriculum/procedimentos/visualAdditionContract';
import { metaVisualAddition } from '../curriculum/procedimentos/visualAdditionProcedure';
import { EmojiRowRiscarSpec } from '../curriculum/procedimentos/emojiRowRiscarContract';
import { metaEmojiRowRiscar } from '../curriculum/procedimentos/emojiRowRiscarProcedure';
import { podeGerarDiagnostico } from '../curriculum/procedimentos/filtroMotor';

interface FichaRendererProps {
  question: Question;
  onAnswer: (answer: any, isCorrect: boolean, meta?: AnswerMeta) => void;
  disabled?: boolean;
  promptDone?: boolean;
  /** Coreografia da micro-aula; só palcos autorais que conhecem o spec a usam. */
  mostrar?: unknown;
  /** Voz do shell para feedback autoral no mesmo instante do gesto. */
  falar?: (texto: string) => void;
}

export function FichaRenderer({ question, onAnswer, disabled, promptDone = true, mostrar, falar }: FichaRendererProps) {
  const { kind, uiProps, evaluate } = question;

  const handleInteract = (val: any, meta?: AnswerMeta) => {
    if (disabled) return;
    const isCorrect = evaluate?.(val) ?? false;
    onAnswer(val, isCorrect, meta);
  };

  switch (kind) {
    case 'emojirow':
      return <div className="flex justify-center"><EmojiRow {...uiProps} onItemTouch={handleInteract} disabled={disabled} promptDone={promptDone} /></div>;

    case 'bond':
      return <div className="flex justify-center"><NumberBond {...uiProps} /></div>;

    case 'numberline':
      return <InteractiveNumberLine {...uiProps} onAnswer={handleInteract} disabled={disabled} />;

    case 'numberline-f19': {
      const spec = uiProps as Reta20Spec;
      return (
        <Reta20Stage
          spec={spec}
          disabled={Boolean(disabled)}
          falar={falar}
          mostrar={mostrar && typeof mostrar === 'object' ? mostrar as never : null}
          onAnswer={(valor, acao, manipulacao) => {
            const misconception = podeGerarDiagnostico(manipulacao)
              ? diagnosticarReta20(acao, spec)
              : undefined;
            const evidencias = evidenciasReta20(acao, spec);
            handleInteract(valor, {
              manipulacao,
              ...(misconception ? { misconception } : {}),
              ...(evidencias.length ? { evidencias } : {}),
            });
          }}
        />
      );
    }

    case 'quadrado100-f36': {
      const spec = uiProps as Quadrado100Spec;
      return (
        <Quadrado100Stage
          spec={spec}
          disabled={Boolean(disabled)}
          falar={falar}
          mostrar={mostrar && typeof mostrar === 'object' ? mostrar as Record<string, unknown> : null}
          onAnswer={(valor, acao) => {
            const manipulacao = acao.completo ? undefined : { precisoEmDestinoErrado: true };
            const misconception = podeGerarDiagnostico(manipulacao)
              ? diagnosticarQuadrado100(acao, spec)
              : undefined;
            const evidencias = evidenciasQuadrado100(acao, spec);
            const meta: AnswerMeta & { quadrado100: AcaoQuadrado100 } = {
              quadrado100: acao,
              ...(manipulacao ? { manipulacao } : {}),
              ...(misconception ? { misconception } : {}),
              ...(evidencias.length ? { evidencias } : {}),
            };
            handleInteract(valor, meta);
          }}
        />
      );
    }

    case 'visual-addition-f13': {
      const spec = uiProps as VisualAdditionSpec;
      return (
        <VisualAdditionStage
          spec={spec}
          disabled={Boolean(disabled)}
          mostrar={mostrar}
          onAnswer={(valor, acao) => handleInteract(valor, metaVisualAddition(acao, spec))}
        />
      );
    }

    case 'emojirow-riscar-f15': {
      const spec = uiProps as EmojiRowRiscarSpec;
      return (
        <EmojiRowRiscarStage
          spec={spec}
          disabled={Boolean(disabled)}
          promptDone={promptDone}
          mostrar={mostrar}
          falar={falar}
          onAnswer={(valor, acao) => handleInteract(valor, metaEmojiRowRiscar(acao, spec))}
        />
      );
    }

    case 'regua':
    case 'regua-f61': {
      const spec = uiProps as ReguaSpec;
      return (
        <ReguaStage
          spec={spec}
          disabled={Boolean(disabled)}
          falar={falar}
          mostrar={mostrar && typeof mostrar === 'object' ? mostrar as never : null}
          onAnswer={(valor, meta) => handleInteract(valor, meta)}
        />
      );
    }

    case 'tens':
      // Contrato estático legado/genérico. F21 usa kind próprio para não esconder
      // a diferença semântica do auditor nem sequestrar usos antigos.
      return <MaterialDourado {...uiProps} />;

    case 'material-dourado': {
      const spec = uiProps as MaterialDouradoSpec;
      return (
        <MaterialDouradoStage
          spec={spec}
          disabled={Boolean(disabled)}
          falar={falar}
          mostrar={mostrar && typeof mostrar === 'object' ? mostrar as never : null}
          onAnswer={(valor, acao) => {
            const misconception = diagnosticarMaterialDourado(acao, spec);
            const evidencias = evidenciasMaterialDourado(acao, spec);
            handleInteract(valor, {
              ...(misconception ? { misconception } : {}),
              ...(evidencias.length ? { evidencias } : {}),
            });
          }}
        />
      );
    }

    case 'relogio':
      return <Relogio {...uiProps} />;

    case 'balanca':
      return <Balanca {...uiProps} />;

    case 'draggroup':
      return <DragGroup {...uiProps} onAnswer={handleInteract} disabled={disabled} />;
    case 'vertical':
      return <VerticalPlaceValueStage question={question} onAnswer={handleInteract} onMistake={handleInteract} disabled={Boolean(disabled)} />;
    case 'story-bars':
      return <StoryBarsStage spec={uiProps as never} />;
    case 'tabuada':
      return <TabuadaStage spec={uiProps as never} />;
    case 'decomposicao':
      return <DecomposicaoStage spec={uiProps as never} />;
    case 'ancora':
      return <AncoraStage spec={uiProps as never} />;
    case 'familia':
      return <FamiliaStage spec={uiProps as never} />;
    case 'deslocamento':
      return <DeslocamentoStage spec={uiProps as never} />;
    case 'area':
      return <AreaStage spec={uiProps as never} />;
    case 'pareamento':
      return <PareamentoStage spec={uiProps as never} onAnswer={valor => handleInteract(valor)} disabled={Boolean(disabled)} />;
    case 'touchcount':
      return <TouchCount spec={uiProps as never} onAnswer={valor => handleInteract(valor)} disabled={Boolean(disabled)} />;
    case 'audiochoice':
      return <AudioChoiceStage spec={uiProps as never} onAnswer={valor => handleInteract(valor)} disabled={Boolean(disabled)} />;
    case 'classificacao':
      return <ClassificacaoStage spec={uiProps as never} onAnswer={valor => handleInteract(valor)} disabled={Boolean(disabled)} />;
    case 'touchplace':
      return <TouchPlaceStage spec={uiProps as never} onAnswer={valor => handleInteract(valor)} disabled={Boolean(disabled)} />;
    // O `ShapeCanvas` estava importado aqui e **sem `case` nenhum**: a
    // primitiva que a F47 e a F48 nomeiam caía no `default`, que desenha
    // "Ficha não implementada". Meio-órfã — importada, nunca alcançável.
    case 'shapecanvas':
      // Duas fichas, dois palcos. O spec da F48 traz `opcoes`; o da F47, não.
      return (uiProps as { opcoes?: unknown }).opcoes
        ? <FormaStage spec={uiProps as never} onAnswer={valor => handleInteract(valor)} disabled={Boolean(disabled)} />
        : <CenaDePosicaoStage spec={uiProps as never} onAnswer={valor => handleInteract(valor)} disabled={Boolean(disabled)} />;
    case 'moldura':
      return <MolduraStage spec={uiProps as never} onAnswer={valor => handleInteract(valor)} disabled={Boolean(disabled)} />;
    case 'grandeza':
      return <GrandezaStage spec={uiProps as never} onAnswer={valor => handleInteract(valor)} disabled={Boolean(disabled)} />;
    case 'comparacao-simbolica':
      return <ComparacaoSimbolicaStage spec={uiProps as ComparacaoSimbolicaSpec} onAnswer={(valor, meta) => handleInteract(valor, meta)} disabled={Boolean(disabled)} />;
    case 'medidas':
      return <MedidasStage spec={uiProps as never} onAnswer={(valor, meta) => onAnswer(valor, evaluate?.(valor) ?? false, meta)} disabled={Boolean(disabled)} />;
    case 'fileira':
      return <EmojiRowStage spec={uiProps as never} onAnswer={valor => handleInteract(valor)} disabled={Boolean(disabled)} />;
    case 'array':
      return <ArrayGrid question={question} onAnswer={handleInteract} disabled={Boolean(disabled)} />;
    case 'tenframe':
      return <div className="flex justify-center"><TenFrame filled={question.n!} {...uiProps} /></div>;
    case 'visual-addition':
      return <VisualAddition a={question.a!} b={question.b!} emojiA={question.emoji} emojiB={question.emoji} {...uiProps} />;
    case 'scattered':
      return <ScatteredItems n={question.n!} emoji={question.emoji!} {...uiProps} />;
    case 'linking-cubes':
      return <LinkingCubes groups={question.groups!} {...uiProps} />;
    case 'take-apart':
      return <TakeApart total={question.n!} knownSplit={{ a: question.a!, b: question.b! }} {...uiProps} />;
    case 'plain':
      return <div className="flex justify-center text-4xl font-black text-slate-800 py-8">{uiProps.text}</div>;

    default:
      return <div className="p-4 border border-rose-300 text-rose-500 rounded text-center font-bold">Ficha não implementada: {kind}</div>;
  }
}
