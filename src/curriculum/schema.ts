// schema.ts
// Definindo o contrato estrito para o Motor de Fichas (Substituindo os generators.ts hardcoded)

export type KindType = "tenframe" | "bond" | "numberline" | "vertical" | "draggroup" | "arraygrid" | "balanca" | "relogio" | "quadrado100" | "shapecanvas" | "emojirow" | "tens" | "plain" | "scattered" | "storypanel" | "audiochoice" | "intruso_math" | "tabuada" | "decomposicao" | "ancora" | "familia" | "deslocamento" | "area" | "pareamento" | "touchcount" | "fileira" | "classificacao" | "touchplace" | "grandeza" | "moldura" | "medidas" | "regua" | "visual-addition";

export interface FichaParams {
  [key: string]: unknown;
}

export interface FichaDominio {
  acertos: number;
  de: number;
  sessoes: number;
  /**
   * A regra EXTRA da §9 — a condição sob a qual pelo menos um acerto precisa
   * ter acontecido.
   *
   * ### Por que existe (pendência P13)
   *
   * Seis fichas do bloco F0 escrevem, na §9, uma segunda condição além da
   * contagem de acertos:
   *
   * | ficha | regra extra |
   * |---|---|
   * | F01 (N1.04) | um acerto no arranjo **disperso** |
   * | F05 (N1.06) | um acerto **na primeira audição** |
   * | F04 (N1.13) | um acerto **sem vaga fantasma** |
   * | F48 (GE.02) | um acerto com a forma **girada** |
   * | F49 (GM.01) | um acerto com **diferença pequena** |
   *
   * Todas dizem a mesma coisa: *acertar não basta; é preciso ter acertado uma
   * vez na condição que prova a competência*. Sem este campo a regra ficava
   * escrita na ficha, testada no procedimento e **sem chegar ao motor** — a
   * criança recebia domínio sem nunca ter feito a única questão que o prova.
   *
   * `evidencia` é o nome que o palco emite junto com a resposta; `descricao`
   * existe para o painel dos pais dizer, em português, o que falta.
   */
  exige?: { evidencia: string; descricao: string };
  /**
   * Variedade histórica de processo — OPT-IN por micro/ficha.
   *
   * Ausente = sem efeito: a regra de domínio continua exatamente `acertos/de`,
   * independência, `exige` quando houver e sessões espaçadas. Presente = a
   * sessão só amadurece depois de existirem pelo menos `minimo` evidências
   * históricas distintas cujo nome começa com `prefixo`.
   *
   * A condição nunca é inferida globalmente pelo motor e RT/velocidade jamais
   * contam como diversidade. Isso preserva as competências já fechadas e deixa
   * a autoria da exigência no lugar certo: a própria ficha.
   */
  evidenciasDistintas?: { prefixo: string; minimo: number; descricao?: string };
  /**
   * Ponte representacional: impede subir de nível enquanto uma condição desta
   * micro ainda não foi demonstrada. Útil quando o próximo nível troca de
   * linguagem (concreto/perceptual -> diagrama -> símbolo).
   */
  gateAntesDeAvancar?: { evidencia: string; descricao: string };
}

export interface FichaMicro {
  id: string; // Ex: 'a', 'b'
  alvo: string; // O que está sendo treinado especificamente
  /**
   * De qual ficha do cânone esta micro veio. Ex: `"JD2"`, `"F02"`, `"F52"`.
   *
   * ### Por que existe (pendência P5)
   *
   * `FichaCompetencia` tem **uma** voz — um `howto`, um `explain` —, e isso
   * bastava enquanto cada competência vinha de uma ficha só. Várias vêm de
   * duas: N1.08 de F02 + JD2, N1.04 de F01 + F03, N1.11 de F28 + JD3, N1.10 de
   * JD5. E as §7 delas podem se contradizer: o `explain` da F02 diz *"continue
   * contando os de baixo"* e a JD2 **proíbe em negrito** dizer "conte" na tela
   * dela, porque é o erro que a ficha combate.
   *
   * Sem declarar a origem, a tela da mão herda a fala da moldura e ensina o
   * erro — e nada no código sabe que isso é um problema. Com a origem
   * declarada, o portão de conformidade cobra: micros de fichas diferentes não
   * compartilham voz.
   *
   * A voz própria entra em `params.howto` / `params.explain` / `audio_prompt`.
   */
  fonte?: string;
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
  micro?: string;
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

  /**
   * O conjunto numérico que a competência ensina.
   *
   * Omitir significa `naturais`, e o contrato do canário recusa qualquer
   * gabarito ou alternativa negativa. Essa é a regra certa para quase todo o
   * currículo: numa ficha de contagem ou de subtração, um `-2` na tela é bug
   * de gerador, não conteúdo.
   *
   * `inteiros` vale para quem ensina o sinal como conteúdo (a strand N7).
   *
   * `racionais` vale para quem ensina medida fracionada — conversão de unidades,
   * decimais, frações. Ali `1,5 m` é conteúdo, e o distrator `0,01` é o erro
   * pedagógico de quem inverteu a operação, não defeito de gerador. Mesmo neste
   * conjunto o contrato continua exigindo número **finito**: `NaN` e `Infinity`
   * seguem sendo bug em qualquer ficha da Jornada.
   *
   * A declaração fica na ficha, e não numa lista de exceções dentro do teste,
   * porque o conjunto numérico é propriedade da competência — quem promove um
   * nó com negativos precisa afirmar isso onde o nó é definido.
   */
  dominioNumerico?: "naturais" | "inteiros" | "racionais";


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
    if (ficha.dominioNumerico && !["naturais", "inteiros", "racionais"].includes(ficha.dominioNumerico)) {
      errors.push(`Domínio numérico inválido '${ficha.dominioNumerico}' em ${ficha.id}`);
    }

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
      const microIds = new Set(ficha.micros?.map(micro => micro.id) ?? []);
      for (const [level, config] of Object.entries(ficha.niveis)) {
        if (config.micro && !microIds.has(config.micro)) {
          errors.push(`Nível ${level} referencia micro inexistente '${config.micro}' em ${ficha.id}`);
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
