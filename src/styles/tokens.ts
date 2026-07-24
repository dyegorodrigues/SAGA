export type UIState = 'ocioso' | 'ativo' | 'erro-suave' | 'acerto' | 'desabilitado' | 'demo';

export const tokens = {
  cor: {
    acao: {
      primaria: 'var(--cor-acao-primaria, #3b82f6)',
      secundaria: 'var(--cor-acao-secundaria, #a855f7)',
    },
    feedback: {
      acerto: 'var(--cor-feedback-acerto, #22c55e)',
      erro_suave: 'var(--cor-feedback-erro-suave, #f97316)',
    },
    superficie: {
      fundo: 'var(--cor-superficie-fundo, #f8fafc)',
      cartao: 'var(--cor-superficie-cartao, #ffffff)',
      destaque: 'var(--cor-superficie-destaque, #fefce8)',
    },
    texto: {
      principal: 'var(--cor-texto-principal, #1e293b)',
      secundario: 'var(--cor-texto-secundario, #64748b)',
      inverso: 'var(--cor-texto-inverso, #ffffff)',
    },
    elementos: {
      borda: 'var(--cor-elementos-borda, #cbd5e1)',
      preenchimento: 'var(--cor-elementos-preenchimento, #f1f5f9)',
      base_A: 'var(--cor-base-a, #0ea5e9)',
      base_B: 'var(--cor-base-b, #f43f5e)',
      marcador: 'var(--cor-marcador, #fbbf24)',
    }
  },
  estado: {
    ocioso: 'opacity-100 scale-100 transition-all duration-300',
    ativo: 'opacity-100 scale-105 shadow-md ring-2 ring-blue-400 transition-all duration-300',
    'erro-suave': 'opacity-90 scale-95 ring-2 ring-orange-400 animate-[pulse_0.5s_ease-in-out_infinite] transition-all duration-300',
    acerto: 'opacity-100 scale-110 ring-4 ring-green-400 bg-green-100 transition-all duration-300',
    desabilitado: 'opacity-50 cursor-not-allowed grayscale transition-all duration-300',
    demo: 'opacity-80 ring-2 ring-purple-400 border-dashed animate-pulse transition-all duration-300'
  },
  tamanho: {
    base: 'var(--tamanho-base, 40px)',
    pequeno: 'var(--tamanho-pequeno, 30px)',
    grande: 'var(--tamanho-grande, 60px)',
    alvo: 'var(--tamanho-alvo, 80px)',
    raio: 'var(--tamanho-raio, 8px)',
  },
  animacao: {
    rapida: 'transition-all duration-150',
    padrao: 'transition-all duration-300',
    lenta: 'transition-all duration-500',
  }
};
