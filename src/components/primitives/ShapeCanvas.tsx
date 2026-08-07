import React, { useState } from 'react';
import { motion } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';

export type ShapeType = 'circle' | 'square' | 'triangle' | 'rectangle';

export interface ShapeItem {
  id: string;
  type: ShapeType;
  color: string;
  size: number;
  rotation?: number;
  x?: number; // relative 0-100%
  y?: number; // relative 0-100%
  /**
   * O nome da forma para quem não vê a tela.
   *
   * As formas eram `<div>` com `onClick` — sem `role`, sem rótulo, fora do
   * alcance do teclado. Numa ficha cujo enunciado é *"qual é o triângulo?"*
   * (F48), isso é a pergunta inteira invisível para leitor de tela.
   */
  rotulo?: string;
}

/**
 * Uma peça do **modo cena** (ficha F47, `ShapeCanvas (cena)`).
 *
 * Modo próprio, não um `ShapeItem` com campos a mais — do mesmo jeito que o
 * `EmojiRow` ganhou `pontos` para o modo padrão. Aqui as peças são **cenário**
 * (uma mesa, um muro, uma árvore), não formas a identificar: misturar os dois
 * vocabulários faria a F47 ensinar que mesa É retângulo, na mesma linguagem
 * visual que a F48 usa depois para perguntar qual é o retângulo.
 *
 * E as medidas são em **pixels**, não em percentual: nesta ficha a resposta
 * certa É uma relação espacial, e percentual sobre campo não-quadrado distorce
 * o eixo vertical (§6.29).
 */
export interface PecaDaCena {
  forma: 'rectangle' | 'triangle' | 'circle';
  x: number;
  y: number;
  largura: number;
  altura: number;
  cor: string;
  /** Só o contorno: a caixa aberta, que tem "dentro" visível. */
  contorno?: boolean;
}

interface ShapeCanvasProps {
  shapes?: ShapeItem[];
  /** Modo cena: peças de cenário em pixels, num campo de tamanho fixo. */
  cena?: { pecas: PecaDaCena[]; largura: number; altura: number };
  /** Sobreposto à cena, no mesmo sistema de coordenadas: os objetos da F47. */
  children?: React.ReactNode;
  /**
   * Desenhado **antes** das peças, no mesmo sistema de coordenadas.
   *
   * É como "atrás" existe num plano: o objeto sai por baixo do muro. As peças
   * não capturam toque (`pointer-events-none`), então o que está atrás continua
   * clicável — oclusão visual sem oclusão de dedo.
   */
  fundo?: React.ReactNode;
  interactive?: boolean;
  onShapeClick?: (id: string) => void;
  state?: UIState;
}

export function ShapeCanvas({ shapes = [], cena, children, fundo, interactive = false, onShapeClick, state = 'ocioso' }: ShapeCanvasProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleClick = (id: string) => {
    if (!interactive) return;
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    if (onShapeClick) onShapeClick(id);
  };

  const getShapeStyle = (shape: ShapeItem) => {
    const baseStyle: React.CSSProperties = {
      backgroundColor: shape.type !== 'triangle' ? shape.color : 'transparent',
      width: `${shape.size}px`,
      height: shape.type === 'rectangle' ? `${shape.size * 0.6}px` : `${shape.size}px`,
      borderRadius: shape.type === 'circle' ? '50%' : '0',
      transform: `rotate(${shape.rotation || 0}deg)`,
      transition: tokens.animacao.padrao,
      position: (shape.x !== undefined && shape.y !== undefined) ? 'absolute' : 'relative',
      left: shape.x !== undefined ? `${shape.x}%` : 'auto',
      top: shape.y !== undefined ? `${shape.y}%` : 'auto',
      transformOrigin: 'center center'
    };

    if (shape.type === 'triangle') {
      baseStyle.width = '0';
      baseStyle.height = '0';
      baseStyle.borderLeft = `${shape.size / 2}px solid transparent`;
      baseStyle.borderRight = `${shape.size / 2}px solid transparent`;
      baseStyle.borderBottom = `${shape.size}px solid ${shape.color}`;
    }

    return baseStyle;
  };

  // ---- modo cena (F47) -------------------------------------------------
  if (cena) {
    return (
      <div
        className="relative overflow-hidden select-none rounded-2xl"
        style={{
          width: cena.largura,
          height: cena.altura,
          backgroundColor: tokens.cor.superficie.destaque,
          border: `3px solid ${tokens.cor.elementos.borda}`,
        }}
      >
        {fundo}
        {cena.pecas.map((peca, i) => (
          <div
            key={`cena-${i}`}
            aria-hidden
            className="pointer-events-none absolute"
            style={peca.forma === 'triangle'
              ? {
                left: peca.x - peca.largura / 2,
                top: peca.y - peca.altura / 2,
                width: 0,
                height: 0,
                borderLeft: `${peca.largura / 2}px solid transparent`,
                borderRight: `${peca.largura / 2}px solid transparent`,
                borderBottom: `${peca.altura}px solid ${peca.cor}`,
              }
              : {
                left: peca.x - peca.largura / 2,
                top: peca.y - peca.altura / 2,
                width: peca.largura,
                height: peca.altura,
                borderRadius: peca.forma === 'circle' ? '50%' : 6,
                // Contorno em vez de bloco: sem isso a caixa do "dentro/fora"
                // taparia justamente o objeto que está dentro dela.
                backgroundColor: peca.contorno ? 'transparent' : peca.cor,
                border: peca.contorno ? `6px solid ${peca.cor}` : 'none',
              }}
          />
        ))}
        {children}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full min-h-[250px] p-4 flex flex-wrap items-center justify-center gap-6 overflow-hidden select-none rounded-xl ${tokens.estado[state]}`}
      style={{ backgroundColor: tokens.cor.superficie.destaque, border: `2px dashed ${tokens.cor.elementos.borda}` }}
    >
      {shapes.map((shape) => {
        const isSelected = selectedIds.includes(shape.id);
        return (
          <motion.div
            key={shape.id}
            whileHover={interactive ? { scale: 1.05 } : undefined}
            whileTap={interactive ? { scale: 0.95 } : undefined}
            onClick={() => handleClick(shape.id)}
            // Sem isto, a forma é um `div` clicável: nenhum papel, nenhum
            // rótulo, invisível para o teclado e para o leitor de tela.
            {...(interactive
              ? {
                role: 'button',
                tabIndex: 0,
                'aria-label': shape.rotulo ?? shape.type,
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(shape.id); }
                },
              }
              : { 'aria-hidden': true })}
            className={`${interactive ? 'cursor-pointer' : ''} ${isSelected ? 'ring-4 ring-offset-2 ring-blue-500 rounded' : ''}`}
            style={{
              position: (shape.x !== undefined && shape.y !== undefined) ? 'absolute' : 'relative',
              left: shape.x !== undefined ? `${shape.x}%` : 'auto',
              top: shape.y !== undefined ? `${shape.y}%` : 'auto',
              transform: (shape.x !== undefined && shape.y !== undefined) ? 'translate(-50%, -50%)' : 'none'
            }}
          >
            <div style={getShapeStyle(shape)} />
          </motion.div>
        );
      })}
      
      {!shapes.length && (
        <span className="text-slate-400 font-medium">Canvas vazio</span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Modo FIGURAS — ficha F48 (GE.02)
 * ------------------------------------------------------------------ */

/**
 * Uma figura desenhada: forma plana, objeto do mundo real ou sólido.
 *
 * Mora aqui, e não no palco, porque é **desenho de forma** — o assunto desta
 * primitiva. O palco da F48 cuida da coreografia e do diagnóstico; quem sabe
 * como um triângulo é feito é o `ShapeCanvas` (§6.31-bis).
 *
 * ### Por que o giro é aplicado aqui, e é a ficha inteira
 *
 * A §2 da F48: *"a criança que só vê o triângulo 'em pé' não reconhece o mesmo
 * triângulo de cabeça para baixo. Ela memorizou uma imagem, não a propriedade."*
 * O `transform: rotate` sobre a MESMA figura é o que torna isso exercitável — e
 * é exatamente o que o gerador antigo não podia fazer, porque usava emoji:
 * `🔴` girado é `🔴`.
 */
export type FiguraDesenhavel =
  | 'circulo' | 'quadrado' | 'triangulo' | 'retangulo'
  | 'cubo' | 'esfera' | 'cilindro';

export interface FiguraProps {
  figura: FiguraDesenhavel;
  /** Graus. Zero é a orientação padrão. */
  giro?: number;
  /** O lado do desenho — nunca o do contêiner, que é sempre igual (§3). */
  tamanho: number;
  cor: string;
  /** §5, nível 4: a forma aparece dentro de uma coisa do mundo. */
  objeto?: 'roda' | 'janela' | 'chapeu' | 'quadro';
}

export function FiguraDesenhada({ figura, giro = 0, tamanho, cor, objeto }: FiguraProps) {
  const giroCss = giro ? `rotate(${giro}deg)` : undefined;

  // ---- sólidos (§5, nível 5) ----------------------------------------
  // Desenhados em SVG porque não são vocabulário de forma PLANA: um cubo é
  // três faces em perspectiva, e forçá-lo no `div` com borda produziria um
  // quadrado com risquinhos — que é o oposto do que o nível 5 pergunta.
  if (figura === 'cubo' || figura === 'esfera' || figura === 'cilindro') {
    const s = tamanho;
    const claro = cor;
    const medio = `color-mix(in srgb, ${cor} 78%, black)`;
    const escuro = `color-mix(in srgb, ${cor} 58%, black)`;
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden style={{ transform: giroCss }}>
        {figura === 'esfera' && (
          <>
            <circle cx="50" cy="50" r="38" fill={medio} />
            <circle cx="38" cy="38" r="13" fill={claro} opacity="0.85" />
          </>
        )}
        {figura === 'cubo' && (
          <>
            {/* topo, frente e lado: as três faces que fazem um cubo ser lido
                como volume e não como quadrado. */}
            <polygon points="50,12 84,30 50,48 16,30" fill={claro} />
            <polygon points="16,30 50,48 50,86 16,68" fill={medio} />
            <polygon points="84,30 50,48 50,86 84,68" fill={escuro} />
          </>
        )}
        {figura === 'cilindro' && (
          <>
            <rect x="22" y="26" width="56" height="48" fill={medio} />
            <ellipse cx="50" cy="26" rx="28" ry="12" fill={claro} />
            <ellipse cx="50" cy="74" rx="28" ry="12" fill={escuro} />
          </>
        )}
      </svg>
    );
  }

  const base: React.CSSProperties = {
    width: tamanho,
    height: figura === 'retangulo' ? Math.round(tamanho * 0.6) : tamanho,
    backgroundColor: figura === 'triangulo' ? 'transparent' : cor,
    borderRadius: figura === 'circulo' ? '50%' : 6,
    transform: giroCss,
    transformOrigin: 'center center',
  };
  if (figura === 'triangulo') {
    base.width = 0;
    base.height = 0;
    base.borderRadius = 0;
    base.borderLeft = `${tamanho / 2}px solid transparent`;
    base.borderRight = `${tamanho / 2}px solid transparent`;
    base.borderBottom = `${tamanho}px solid ${cor}`;
  }

  // ---- forma pura (níveis 1 a 3) ------------------------------------
  if (!objeto) return <div aria-hidden style={base} />;

  // ---- a forma DENTRO de uma coisa (§5, nível 4) ---------------------
  // Os detalhes são finos e da mesma família de forma da base: um detalhe
  // grande viraria uma segunda figura na tela, e a pergunta ("qual é o
  // círculo?") passaria a ter duas respostas.
  return (
    <div aria-hidden className="relative flex items-center justify-center" style={{ transform: giroCss }}>
      <div style={{ ...base, transform: undefined }} />
      {objeto === 'roda' && (
        <span className="absolute rounded-full" style={{ width: tamanho * 0.3, height: tamanho * 0.3, backgroundColor: '#F8FAFC' }} />
      )}
      {objeto === 'janela' && (
        <>
          <span className="absolute" style={{ width: tamanho, height: 5, backgroundColor: '#F8FAFC' }} />
          <span className="absolute" style={{ width: 5, height: Math.round(tamanho * 0.6), backgroundColor: '#F8FAFC' }} />
        </>
      )}
      {/* ⚠️ A faixa fica DENTRO do triângulo.
          O pompom que estava aqui ficava por cima do vértice e quebrava a
          silhueta — num exercício cujo assunto É a silhueta, um detalhe que
          altera o contorno altera a forma. O print mostrou um triângulo com um
          calombo. Detalhe de objeto do mundo real entra sempre por dentro. */}
      {objeto === 'chapeu' && (
        <span
          className="absolute"
          style={{ width: tamanho * 0.5, height: 6, backgroundColor: '#F8FAFC', marginTop: tamanho * 0.24 }}
        />
      )}
      {objeto === 'quadro' && (
        <span className="absolute" style={{ width: tamanho * 0.62, height: tamanho * 0.62, border: '3px solid #F8FAFC' }} />
      )}
    </div>
  );
}
