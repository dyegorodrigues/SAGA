/**
 * `npm run simular` — o aprendiz sintético, em lotes de Monte Carlo.
 *
 * ## Por que este arquivo existe
 *
 * A §12.8 da Bíblia manda simular antes de lançar, e o `package.json` declarava
 * `npm run simular` apontando para um `simulated-learner-real.ts` que **nunca
 * existiu no repositório** — nem no histórico do git. A Bíblia também diz, no
 * capítulo de evidência, que relatório narrado por quem executou não vale nada
 * e que toda ferramenta de auditoria precisa de um comando que o dono rode por
 * conta própria e veja a mesma saída. O comando estava prometido e não existia:
 * a promessa era a única coisa reproduzível ali.
 *
 * ## A pergunta que ele responde
 *
 * Uma criança que ENTENDE a competência chega à coroa? Cada peça pode estar
 * certa e o percurso não fechar — é o "loop infinito" que a §12.8 manda caçar,
 * e é o tipo de defeito que teste unitário não vê, porque nenhuma unidade está
 * errada.
 *
 * ## Por que ele imita a missão, e não uma fila de tentativas
 *
 * A coroa não olha tentativas soltas: ela olha SESSÕES. O motor zera a janela
 * de compreensão toda vez que o dia muda, e só conta um dia como aprovado se
 * ele estiver a dois dias ou mais do anterior. Um simulador que sorteasse
 * tentativas sem missão e sem calendário mediria uma máquina que não existe.
 *
 * Então o laço aqui é o laço do `GameLoop`: uma missão de `TOTAL_Q` questões
 * num mesmo `practiceDay`, as duas primeiras de aquecimento e um degrau abaixo,
 * o nível da questão seguindo `progresso.lvl`. Os dois números não são
 * copiados: vêm de `tamanhoDaMissao.ts`, o mesmo módulo que o `GameLoop`
 * importa, para que o simulador acompanhe o app em vez de medir um app antigo.
 *
 * ## A licença para emitir a evidência exigida
 *
 * 89 níveis declaram `exigeEvidencia`: uma condição que a criança precisa ter
 * demonstrado para a coroa sair. Ela nasce do palco (o que a criança fez), e
 * aqui não há palco. Emiti-la junto do acerto não é conveniência: o gate
 * `evidenciaExigidaNaoSeCompra.test.tsx` MEDIU, varrendo as fichas que a
 * declaram, que ela acompanha TODA resposta certa daquele nível — é
 * propriedade do item, não prêmio de um gesto. Enquanto aquele gate estiver
 * verde, esta emissão é o comportamento real; quando deixar de ser, ele fica
 * vermelho antes deste.
 *
 * ## A prova que nasce no palco, e não na questão
 *
 * Algumas fichas exigem VARIEDADE de evidência — dois saltos diferentes, dois
 * equilíbrios diferentes — e essa evidência não viaja na questão: ela nasce do
 * que a criança faz no palco. Este simulador não tem palco, e fingir que tem
 * seria inventar o dado mais importante.
 *
 * Então ele descobre, medindo, quais exigências nenhuma evidência de questão
 * alcança, e separa esses casos dos becos de verdade: eles não reprovam aqui,
 * porque quem os prova é o gate `diversidadeAutoralNasceNoPalco.test.tsx`, que
 * dirige o palco de verdade e cobra que a variedade exista. Dois instrumentos,
 * uma pergunta cada — e nenhum dos dois calado sobre o que não mediu.
 *
 * ## As duas cadências, e por que as duas importam
 *
 * A janela de compreensão cabe dentro de uma missão em quase toda a Jornada,
 * mas houve um tempo em que não cabia: três competências pediam `8 de 10` numa
 * missão de oito questões, e quem jogasse uma vez por dia nunca fechava a
 * janela. Foi este simulador que mediu, e a `DECISAO-002` resolveu na ficha —
 * era o critério do Dojo instalado como coroa da Jornada. As duas cadências
 * continuam rodando: é o instrumento que prova que hoje não há mais nenhuma.
 */
import { describe, expect, it } from "vitest";
import { evidenciasDaResposta } from "../src/components/gameloop/answerPolicy";
import { TOTAL_Q, WARMUP_QUESTIONS } from "../src/components/gameloop/tamanhoDaMissao";
import { JOURNEY_FICHAS } from "../src/curriculum/fichas";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "../src/curriculum/motores/composerCanary";
import { applyJourneyAnswer, faltaParaCoroa } from "../src/curriculum/motores/progressEngine";
import type { Progress, Question } from "../src/types";

/**
 * O tamanho da missão vem do runtime, não de uma cópia.
 *
 * Estes dois números definem se a janela de compreensão cabe numa sessão.
 * Copiá-los aqui criaria um simulador que continua verde depois de o app mudar
 * — exatamente o relatório sem lastro que a Bíblia recusa. Eles moram em
 * `tamanhoDaMissao.ts`, importável sem arrastar a árvore de componentes.
 */
const QUESTOES_POR_MISSAO = TOTAL_Q;
const AQUECIMENTO = WARMUP_QUESTIONS;

/** Perfil cognitivo do agente. */
interface Agente {
  nome: string;
  /** Chance de acertar quando o conceito está dominado. */
  precisao: number;
  /** Competência em que este agente tem lacuna severa, se houver. */
  lacuna?: string;
  /** Precisão dentro da lacuna. */
  precisaoNaLacuna: number;
}

const AGENTES: Agente[] = [
  { nome: "atenta", precisao: 0.95, precisaoNaLacuna: 0.95 },
  { nome: "média", precisao: 0.8, precisaoNaLacuna: 0.8 },
  { nome: "distraída", precisao: 0.65, precisaoNaLacuna: 0.65 },
  { nome: "com lacuna em N3.07", precisao: 0.9, lacuna: "N3.07", precisaoNaLacuna: 0.25 },
];

/** Um agente cujo fracasso acusa o percurso, e não a criança. */
const exigente = (agente: Agente, fichaId: string) => agente.precisao >= 0.9 && agente.lacuna !== fichaId;

const LOTE = Number(process.env.SAGA_SIMULAR_LOTE ?? 8);
/** Teto de missões antes de declarar beco sem saída. */
const TETO_DE_MISSOES = 90;

const DIA_ZERO = Date.UTC(2026, 0, 1);
const dia = (n: number) => new Date(DIA_ZERO + n * 86_400_000).toISOString().slice(0, 10);

function progressoInicial(): Progress {
  return { lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0 };
}

/**
 * O que a resposta certa carrega para o motor.
 *
 * `evidenciasDaResposta` é a função da produção, chamada com o mesmo argumento
 * que ela recebe quando não há metadado de palco. A exigida e a do portão
 * entram por cima pela razão explicada no cabeçalho.
 */
function evidenciasDoAcerto(questao: Question): string[] {
  const achadas = new Set(evidenciasDaResposta(undefined, questao));
  if (questao.exigeEvidencia) achadas.add(questao.exigeEvidencia);
  if (questao.gateEvidenceBeforeAdvance) achadas.add(questao.gateEvidenceBeforeAdvance);
  return [...achadas];
}

interface ExigenciaDePalco {
  prefixo: string;
  minimo: number;
  descricao?: string;
}

/** Amostras por nível ao decidir de onde nasce cada exigência. */
const AMOSTRAS_DE_ORIGEM = 8;

/**
 * Exigências de diversidade que a coroa nunca vai ler.
 *
 * O motor decide a coroa com a regra da questão que está na tela, e só olha
 * para ela quando o progresso já está no nível cinco. Uma exigência declarada
 * apenas num nível anterior é escrita que ninguém lê: a ficha promete cobrar
 * variedade e não cobra.
 *
 * Por descoberta: compara os níveis que declaram com o nível que a coroa
 * consulta. Nada de nomes — ficha nova que cometer o mesmo aparece aqui
 * sozinha.
 */
function exigenciasInertes(fichaId: string): string[] {
  const declaram: number[] = [];
  let noNivelDaCoroa = false;
  for (let nivel = 1; nivel <= 5; nivel += 1) {
    const exigida = generateRegisteredFichaQuestion(fichaId, nivel).masteryRule?.evidenciasDistintas;
    if (!exigida) continue;
    declaram.push(nivel);
    if (nivel === 5) noNivelDaCoroa = true;
  }
  if (!declaram.length || noNivelDaCoroa) return [];
  return [`${fichaId}: exige diversidade no${declaram.length > 1 ? "s níveis" : " nível"} ${declaram.join(", ")} e não no 5 — a coroa lê a regra do 5, então a exigência nunca é cobrada`];
}

/**
 * As exigências de diversidade que NENHUMA evidência de questão alcança.
 *
 * Por descoberta, não por lista: sorteia os cinco níveis, junta tudo que a
 * questão emite num acerto, e devolve as exigências cujo prefixo não aparece
 * ali. O que sobra é prova de palco — e o simulador diz isso em vez de chamar
 * de beco o que ele apenas não consegue ver.
 */
function exigenciasDePalco(fichaId: string): ExigenciaDePalco[] {
  const pedidas = new Map<string, ExigenciaDePalco>();
  const naQuestao = new Set<string>();

  for (let nivel = 1; nivel <= 5; nivel += 1) {
    for (let amostra = 0; amostra < AMOSTRAS_DE_ORIGEM; amostra += 1) {
      const questao = generateRegisteredFichaQuestion(fichaId, nivel) as Question;
      const exigida = questao.masteryRule?.evidenciasDistintas;
      if (exigida) pedidas.set(exigida.prefixo, exigida);
      for (const evidencia of evidenciasDoAcerto(questao)) naQuestao.add(evidencia);
    }
  }

  return [...pedidas.values()].filter(
    exigida => ![...naQuestao].some(evidencia => evidencia.startsWith(exigida.prefixo)),
  );
}

interface ResultadoDaJornada {
  missoes: number;
  coroou: boolean;
  /** Onde parou, quando não coroou. */
  nivelFinal: number;
  /** O que o motor ainda pedia, na própria voz dele. */
  falta?: string | null;
  erro?: string;
}

/**
 * Uma criança percorrendo a competência inteira, do nível um até a coroa.
 *
 * `missoesPorDia` é a cadência: quantas missões ela faz antes de o calendário
 * virar. Não é detalhe de conforto — a janela de compreensão zera na virada do
 * dia, então a cadência decide quais regras de domínio são alcançáveis.
 */
function simularJornada(
  agente: Agente,
  fichaId: string,
  missoesPorDia: number,
  ignorando: ExigenciaDePalco[] = [],
): ResultadoDaJornada {
  let progresso = progressoInicial();
  const precisao = agente.lacuna === fichaId ? agente.precisaoNaLacuna : agente.precisao;

  /**
   * A regra como o motor a receberia, menos as exigências que este simulador
   * não consegue cumprir.
   *
   * Serve ao contrafactual: rodar a mesma jornada sem a exigência de palco
   * responde se ela era o ÚNICO obstáculo. Fora do contrafactual, `ignorando`
   * vem vazio e a regra chega inteira.
   */
  const regraDe = (questao: Question) => {
    const regra = questao.masteryRule;
    const exigida = regra?.evidenciasDistintas;
    if (!regra || !exigida || !ignorando.some(item => item.prefixo === exigida.prefixo)) return regra;
    const { evidenciasDistintas: _removida, ...resto } = regra;
    return resto;
  };

  for (let missao = 1; missao <= TETO_DE_MISSOES; missao += 1) {
    const practiceDay = dia(Math.floor((missao - 1) / missoesPorDia));

    for (let idx = 0; idx < QUESTOES_POR_MISSAO; idx += 1) {
      const nivelDaQuestao = idx < AQUECIMENTO ? Math.max(1, (progresso.lvl || 1) - 1) : progresso.lvl || 1;
      let questao: Question;
      try {
        questao = generateRegisteredFichaQuestion(fichaId, nivelDaQuestao) as Question;
      } catch (erro) {
        return { missoes: missao, coroou: false, nivelFinal: progresso.lvl, erro: `L${nivelDaQuestao}: ${(erro as Error).message}` };
      }

      const acertou = Math.random() < precisao;
      progresso = applyJourneyAnswer(progresso, acertou, idx < AQUECIMENTO, {
        durationMs: 4000,
        targetRtMs: questao.rt_max_s !== undefined ? questao.rt_max_s * 1000 : undefined,
        helpUsed: false,
        isReview: false,
        practiceDay,
        previousPracticeDay: progresso.lastDay,
        evidencias: acertou ? evidenciasDoAcerto(questao) : undefined,
        exigeEvidencia: questao.exigeEvidencia,
        gateEvidenceBeforeAdvance: questao.gateEvidenceBeforeAdvance,
        masteryRule: regraDe(questao),
      }).progress;

      if (progresso.dom === true) return { missoes: missao, coroou: true, nivelFinal: progresso.lvl };
    }
  }

  return {
    missoes: TETO_DE_MISSOES,
    coroou: false,
    nivelFinal: progresso.lvl,
    falta: faltaParaCoroa(progresso.masteryEvidence),
  };
}

const mediana = (valores: number[]): number => {
  const ordenados = [...valores].sort((a, b) => a - b);
  const meio = Math.floor(ordenados.length / 2);
  return ordenados.length % 2 ? ordenados[meio] : Math.round((ordenados[meio - 1] + ordenados[meio]) / 2);
};

/**
 * Os prefixos que hoje estão fora do alcance deste simulador, e por quê.
 *
 * Catraca de dois sentidos: prefixo novo aqui reprova, e prefixo que deixou de
 * estar fora de alcance também. Não é lista de permissão — a descoberta
 * continua achando os casos sozinha; esta lista só recusa que o conjunto mude
 * calado.
 *
 * O motivo de a catraca existir: "nenhuma evidência de questão alcança este
 * prefixo" é indistinguível, daqui, de "este prefixo está errado e ninguém
 * nunca vai alcançá-lo". Uma exigência impossível é uma coroa que nunca chega,
 * e passaria por exigência de palco sem esta trava. Medido: com o prefixo de
 * família corrompido de propósito, catorze competências viravam "fora de
 * alcance" e o simulador seguia verde.
 *
 * Para tirar um daqui é preciso que a evidência passe a viajar na questão —
 * momento em que a descoberta para de listá-lo e este teste cobra a remoção.
 */
const PREFIXOS_FORA_DE_ALCANCE = [
  // AL.03 — o tamanho do salto nasce do que a criança percorre no palco.
  "contagem-saltos-passo-",
  // AL.05 — o caso do equilíbrio nasce do palco da balança. Entrou nesta lista
  // depois de a exigência passar a ser lida pela coroa: antes ela morava só no
  // L4, e a coroa lê a regra do L5, então não travava ninguém.
  "igualdade-equilibrio-l4-",
  // AL.04 — o desafio (decrescente, lacuna no meio) nasce do palco de digitar.
  "regra-sequencia-desafio:",
];

interface Achados {
  /** Nunca coroou, em nenhuma das duas cadências: percurso quebrado. */
  becos: string[];
  /** Só coroa com mais de uma missão no mesmo dia. */
  dependemDeDuasMissoes: string[];
  /** Parou numa exigência que nasce no palco — fora do alcance daqui. */
  provasDePalco: string[];
  /** Os prefixos que a descoberta classificou como de palco, nesta execução. */
  prefixosDePalco: string[];
  /** Exigências declaradas num nível que a coroa nunca consulta. */
  exigenciasInertes: string[];
  errosDeGeracao: string[];
}

/** Varre gerador por gerador antes de simular: erro de geração não é beco. */
function varrerGeracao(fichas: Array<{ id: string }>): string[] {
  const erros: string[] = [];
  for (const ficha of fichas) {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let i = 0; i < 12; i += 1) {
        try {
          generateRegisteredFichaQuestion(ficha.id, nivel);
        } catch (erro) {
          erros.push(`${ficha.id} L${nivel}: ${(erro as Error).message}`);
          i = 12;
        }
      }
    }
  }
  return erros;
}

function simular(): Achados {
  const fichas = JOURNEY_FICHAS.filter(ficha => hasComposerFicha(ficha.id));
  const linhas: string[] = [];
  const diz = (texto: string) => { linhas.push(texto); console.log(texto); };

  diz("SAGA — SIMULAÇÃO ESTOCÁSTICA DO APRENDIZ SINTÉTICO");
  diz(`- ${fichas.length} competências servidas pelo Composer`);
  diz(`- missão de ${QUESTOES_POR_MISSAO} questões (${AQUECIMENTO} de aquecimento), do mesmo módulo que o GameLoop usa`);
  diz(`- ${AGENTES.length} perfis cognitivos, ${LOTE} jornadas por cadência (Monte Carlo)`);
  diz(`- cadências: 1 e 2 missões por dia; teto de ${TETO_DE_MISSOES} missões\n`);

  const achados: Achados = { becos: [], dependemDeDuasMissoes: [], provasDePalco: [], prefixosDePalco: [], exigenciasInertes: [], errosDeGeracao: varrerGeracao(fichas) };
  const esforcos: number[] = [];
  const prefixosVistos = new Set<string>();

  for (const ficha of fichas) {
    const doPalco = exigenciasDePalco(ficha.id);
    for (const exigida of doPalco) prefixosVistos.add(exigida.prefixo);
    achados.exigenciasInertes.push(...exigenciasInertes(ficha.id));

    for (const agente of AGENTES) {
      if (!exigente(agente, ficha.id)) continue;

      const porCadencia = new Map<number, ResultadoDaJornada[]>();
      for (const missoesPorDia of [1, 2]) {
        const rodadas: ResultadoDaJornada[] = [];
        for (let i = 0; i < LOTE; i += 1) rodadas.push(simularJornada(agente, ficha.id, missoesPorDia));
        porCadencia.set(missoesPorDia, rodadas);
      }

      const coroouCom = (n: number) => porCadencia.get(n)!.filter(r => r.coroou);
      const uma = coroouCom(1);
      const duas = coroouCom(2);
      const travada = porCadencia.get(1)!.find(r => !r.coroou);

      if (!uma.length && !duas.length) {
        // Contrafactual: a MESMA jornada, sem a exigência que nasce no palco.
        //
        // Perguntar ao motor qual condição falta não serve aqui: ele responde a
        // primeira que encontra, e qual é ela depende de onde a última missão
        // parou — a mesma ficha acusa a janela numa execução e a diversidade na
        // seguinte. O contrafactual não depende de sorte: se sem a exigência de
        // palco a coroa sai, ela era o único obstáculo, e o que travou foi o
        // limite deste instrumento. Se não sai, o beco é de verdade e continua
        // reprovando — nenhuma exigência de palco esconde um percurso quebrado.
        // O contrafactual roda na cadência ESTRITA (uma missão por dia). Rodá-lo
        // na folgada deixaria uma competência que também depende de cadência
        // passar por "prova de palco" — dois problemas somados, um deles
        // escondido atrás do outro. Na estrita, só é absolvida a competência
        // cujo ÚNICO obstáculo é a exigência que este instrumento não vê.
        const semPalco = doPalco.length
          ? Array.from({ length: LOTE }, () => simularJornada(agente, ficha.id, 1, doPalco)).filter(r => r.coroou)
          : [];

        if (semPalco.length) {
          achados.provasDePalco.push(
            `${ficha.id}: "${agente.nome}" só não coroou por ${doPalco.map(x => `\`${x.prefixo}*\` (mínimo ${x.minimo})`).join(" e ")} — sem essa exigência, coroou ${semPalco.length}/${LOTE}. É prova que nasce no palco, não na questão`,
          );
        } else {
          achados.becos.push(
            `${ficha.id}: "${agente.nome}" acertou quase tudo em ${LOTE} jornadas nas duas cadências e não coroou — parou no nível ${travada?.nivelFinal}, o motor ainda pedia: ${travada?.falta ?? "(nada — a coroa não saiu mesmo assim)"}`,
          );
        }
      } else if (!uma.length) {
        achados.dependemDeDuasMissoes.push(
          `${ficha.id}: com UMA missão por dia "${agente.nome}" não coroou nenhuma vez; com duas, coroou ${duas.length}/${LOTE}. O motor pedia: ${travada?.falta ?? "—"}`,
        );
      }

      for (const conjunto of [uma, duas]) if (conjunto.length) esforcos.push(mediana(conjunto.map(r => r.missoes)));
    }
  }

  achados.prefixosDePalco = [...prefixosVistos].sort();

  if (esforcos.length) {
    const ordenado = [...esforcos].sort((a, b) => a - b);
    diz(`Esforço mediano para coroar uma competência: ${mediana(esforcos)} missões (faixa ${ordenado[0]} a ${ordenado[ordenado.length - 1]})\n`);
  }

  if (achados.errosDeGeracao.length) {
    diz(`[FALHA] ${achados.errosDeGeracao.length} níveis não geraram questão:`);
    for (const linha of achados.errosDeGeracao) diz(`  - ${linha}`);
  }
  if (achados.exigenciasInertes.length) {
    diz(`[ATENÇÃO] ${achados.exigenciasInertes.length} exigências de diversidade declaradas fora do nível que a coroa consulta:`);
    for (const linha of achados.exigenciasInertes) diz(`  - ${linha}`);
  }
  if (achados.provasDePalco.length) {
    diz(`[FORA DE ALCANCE] ${achados.provasDePalco.length} paradas em exigência que nasce no palco — quem as prova é \`src/curriculum/diversidadeAutoralNasceNoPalco.test.tsx\`, que dirige o palco de verdade:`);
    for (const linha of achados.provasDePalco) diz(`  - ${linha}`);
  }
  if (achados.dependemDeDuasMissoes.length) {
    diz(`[ATENÇÃO] ${achados.dependemDeDuasMissoes.length} competências só coroam com mais de uma missão no mesmo dia:`);
    for (const linha of achados.dependemDeDuasMissoes) diz(`  - ${linha}`);
  }
  if (achados.becos.length) {
    diz(`[FALHA] ${achados.becos.length} becos sem saída:`);
    for (const linha of achados.becos) diz(`  - ${linha}`);
  }
  if (!achados.errosDeGeracao.length && !achados.becos.length) {
    diz("[RESULTADO] Nenhum beco sem saída e nenhuma falha de geração: quem entende a competência chega à coroa.");
  }
  return achados;
}

describe("simulação estocástica do aprendiz sintético", () => {
  it("toda competência gera questão e leva quem entende até a coroa", { timeout: 3_600_000 }, () => {
    const achados = simular();

    expect(achados.errosDeGeracao, `níveis que não geraram questão:\n${achados.errosDeGeracao.join("\n")}`).toEqual([]);
    expect(achados.becos, `becos sem saída — a criança entende e não coroa:\n${achados.becos.join("\n")}`).toEqual([]);

    // A catraca das exigências fora de alcance. Ver `PREFIXOS_FORA_DE_ALCANCE`:
    // sem ela, uma exigência IMPOSSÍVEL entraria aqui disfarçada de prova de
    // palco e o simulador absolveria a competência em silêncio.
    expect(
      achados.prefixosDePalco,
      "o conjunto de exigências fora do alcance da simulação mudou — confira se apareceu uma exigência que ninguém consegue cumprir antes de mexer na lista",
    ).toEqual(PREFIXOS_FORA_DE_ALCANCE);

    // Prova de vida: um simulador que não observa nada passa calado. A Jornada
    // tem 90 competências; se a varredura encolher, o verde aqui não vale.
    const servidas = JOURNEY_FICHAS.filter(ficha => hasComposerFicha(ficha.id)).length;
    expect(servidas, "a simulação precisa continuar varrendo a Jornada inteira").toBeGreaterThanOrEqual(90);
  });
});
