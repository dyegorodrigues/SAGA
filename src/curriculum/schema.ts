// schema.ts
// Definindo o contrato estrito para o Motor de Fichas (Substituindo os generators.ts hardcoded)

export type KindType = "tenframe" | "bond" | "numberline" | "vertical" | "draggroup" | "arraygrid" | "singaporebars" | "balanca" | "relogio" | "quadrado100" | "shapecanvas" | "emojirow" | "tens" | "plain" | "subvis" | "visual-addition" | "scattered" | "linking-cubes" | "missing-addend-frame" | "take-apart" | "sequence" | "multiple_choice" | "sentencebuilder" | "storypanel" | "audiochoice" | "intruso_math";

export interface FichaParams {
  [key: string]: unknown;
}

export interface FichaDominio {
  acertos: number;
  de: number;
  sessoes: number;
}

export interface FichaMicro {
  id: string; // Ex: 'a', 'b'
  alvo: string; // O que está sendo treinado especificamente
  kinds: KindType[]; // Array das mecânicas UI autorizadas
  params: FichaParams; // Parâmetros numéricos para o gerador
  dominio: FichaDominio; // Regras de domínio específicas desta micro
}

export interface FichaErroTipico {
  id: string;
  descricao: string;
}

export interface FichaNivel {
  primitiva: KindType;
  andaime?: "mao_fantasma" | "alto" | "medio" | "minimo" | "nenhum";
  rt_alvo?: number;
}

export interface FichaDistrator {
  regra: string;
  tag: string;
}

export interface FichaCompetencia {
  id: string; // Ex: 'N1.01', 'N3.07'
  nome: string;
  strand: string; // Ex: 'N1', 'N3'
  faixa: string; // Ex: 'F0', 'F1'
  prereqs: string[]; // IDs de outras competências
  bncc?: string;
  excecaoCPA?: "perceptual" | "espacial"; // Quando a competência foge da regra CPA (ex: pareamento)
  
  // Contrato Universal
  niveis?: Record<number, FichaNivel>;
  howto?: string;
  explain?: string;
  distratores?: FichaDistrator[];

  micros: FichaMicro[];
  erros_tipicos: FichaErroTipico[];
}

export class CurriculumValidator {
  static validate(ficha: FichaCompetencia): string[] {
    const errors: string[] = [];
    if (!ficha.id || !ficha.id.includes(".")) errors.push("ID inválido");
    if (!ficha.nome) errors.push("Nome faltando");
    if (!ficha.strand) errors.push("Strand faltando");
    if (!ficha.faixa) errors.push("Faixa faltando");
    if (!Array.isArray(ficha.prereqs)) errors.push("Pré-requisitos devem ser um array");
    
    // Validações do Contrato Universal
    if (!ficha.howto) errors.push(`Contrato Universal: 'howto' faltando em ${ficha.id}`);
    if (!ficha.explain) errors.push(`Contrato Universal: 'explain' faltando em ${ficha.id}`);
    if (!ficha.distratores) errors.push(`Contrato Universal: 'distratores' faltando em ${ficha.id}`);
    if (!ficha.niveis) errors.push(`Contrato Universal: 'niveis' faltando em ${ficha.id}`);
    else {
      if (!ficha.excecaoCPA) {
        for (let i = 1; i <= 5; i++) {
          if (!ficha.niveis[i]) {
            errors.push(`Contrato Universal: Nível ${i} não declarado em ${ficha.id}`);
          }
        }
      }
    }
        
    if (!ficha.micros || ficha.micros.length === 0) {
      errors.push("Deve ter pelo menos uma microcompetência");
    } else {
      ficha.micros.forEach((micro, idx) => {
        if (!micro.id) errors.push(`Micro [${idx}] sem ID`);
        if (!micro.alvo) errors.push(`Micro [${idx}] sem alvo`);
        if (!micro.kinds || micro.kinds.length === 0) errors.push(`Micro [${micro.id}] sem kinds (mecânica ausente = falsa interação)`);
        if (!micro.params) errors.push(`Micro [${micro.id}] sem params numéricos definidos`);
        if (!micro.dominio) errors.push(`Micro [${micro.id}] sem critério de 'dominio' definido (falso domínio)`);
      });
    }
    return errors;
  }
}
