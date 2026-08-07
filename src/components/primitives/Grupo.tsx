import React from 'react';
import { motion } from 'motion/react';
import { tokens } from '../../styles/tokens';

export interface GrupoProps {
  items: React.ReactNode[];
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  /**
   * ⚠️ Modo COMPARAÇÃO (ficha F49) — a base alinhada.
   *
   * A §2 da F49 chama isto de *"a regra pedagógica que quase todo material
   * erra"*:
   *
   * > *"As **bases precisam estar alinhadas na mesma linha horizontal**.
   * > Comparar altura com objetos flutuando em posições diferentes ensina
   * > errado — é o equivalente visual de comparar quantidade pelo espaço
   * > ocupado."*
   *
   * O modo padrão deste componente usa `items-center`: cada objeto flutua no
   * meio da própria caixa. Era exatamente a tela que a ficha existe para não
   * produzir — e a primitiva não estava ligada a lugar nenhum, então ninguém
   * tinha visto.
   *
   * Com `chao`, os itens assentam numa linha desenhada, à mesma altura nas
   * duas caixas, porque a posição vem do contrato e não de cada caixa.
   */
  chao?: {
    /** Distância do topo da caixa até a linha, em pixels. */
    linha: number;
    largura: number;
    altura: number;
    /** §4/§8: a linha de chão pisca durante a micro-aula. */
    destacada?: boolean;
  };
  rotulo?: string;
}

export function Grupo({ items, onClick, selected, disabled, chao, rotulo }: GrupoProps) {
  if (chao) {
    return (
      <motion.button
        whileTap={disabled ? {} : { scale: 0.98 }}
        onClick={onClick}
        disabled={disabled}
        aria-label={rotulo}
        className={`relative flex items-end justify-center overflow-hidden rounded-3xl ${selected ? 'ring-4 ring-blue-500' : ''}`}
        style={{
          width: chao.largura,
          height: chao.altura,
          backgroundColor: tokens.cor.superficie.fundo,
          border: `3px solid ${tokens.cor.elementos.borda}`,
          // O padding de baixo posiciona a base dos itens EXATAMENTE na linha.
          // Sem isto o objeto assentaria no fundo da caixa e a linha viraria
          // enfeite — desenhada, e não usada.
          paddingBottom: chao.altura - chao.linha,
          cursor: disabled ? 'default' : 'pointer',
        }}
      >
        {items}
        {/* O CHÃO. Mesma distância do topo nas duas caixas, porque o valor vem
            do contrato — se cada caixa o calculasse, elas poderiam divergir e a
            comparação inteira ficaria falsa.

            ⚠️ É uma faixa, não um fio. Desenhado como linha fina na cor da
            borda, ele lia como parte da moldura do cartão — e o print mostrou
            duas caixas com uma listra, não dois objetos no chão. Numa ficha
            cuja regra dura é "as bases na mesma linha horizontal", o chão
            precisa ser inconfundível: é ele o instrumento da comparação. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            top: chao.linha,
            backgroundColor: '#E7D3B3',
            borderTop: `${chao.destacada ? 5 : 4}px solid ${chao.destacada ? '#2563EB' : '#B45309'}`,
          }}
        />
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative flex flex-wrap items-center justify-center p-6 min-h-[160px] min-w-[160px] rounded-3xl transition-colors ${selected ? 'ring-4 ring-offset-4 ring-blue-500' : ''}`}
      style={{
        backgroundColor: tokens.cor.elementos.preenchimento,
        border: `2px solid ${tokens.cor.elementos.borda}`,
        cursor: disabled ? 'default' : 'pointer'
      }}
    >
      {items.map((item, i) => (
        <div key={i} className="m-2">
          {item}
        </div>
      ))}
    </motion.button>
  );
}
