import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { CURRICULUM } from "./curriculum";
import {
  COMPOSER_CANARIES,
  hasComposerFicha,
  rollbackComposerCanary,
} from "./composerCanary";

/**
 * A porta dos fundos do canário.
 *
 * O mecanismo promete: uma ficha autoral só chega à criança se o id estiver em
 * `COMPOSER_CANARIES`, e o rollback é a retirada do id. Sete nós do bloco F0
 * furavam essa promessa chamando `Composer.generate` de dentro do gerador
 * registrado como *legado* — o que fazia `selectGenerator` anunciá-los como
 * `legacy` enquanto servia ficha, e transformava o rollback num no-op.
 *
 * Um deles (N1.10) estava num **segundo arquivo** e não aparecia na lista que eu
 * vinha carregando de cabeça. Por isso este teste varre o mecanismo, e não uma
 * lista: lista de nós eu esqueço, varredura não.
 *
 * Ver `AI_Studio_Lab/codex/PLANO_DO_BLOCO_F0.md` §1.
 */

/* ------------------------------------------------------------------ *
 *  Parte 1 — a varredura estática: quem pode chamar `Composer.generate`
 * ------------------------------------------------------------------ */

/**
 * As três portas legítimas, e por que cada uma é legítima.
 *
 * Qualquer arquivo fora desta lista que chame `Composer.generate` está servindo
 * ficha autoral por fora do canário — que é exatamente o defeito.
 */
const PORTAS_LEGITIMAS: Record<string, string> = {
  "src/curriculum/Composer.ts":
    "é a própria implementação",
  "src/curriculum/motores/composerCanary.ts":
    "é A ponte: o único caminho de produção da ficha até a tela",
  "src/components/admin/SandboxModal.tsx":
    "é a pré-visualização administrativa, cujo trabalho é justamente mostrar a " +
    "ficha independentemente do canário. Não é caminho de criança.",
  "src/utils/legadoF0.ts":
    "serve a ficha CONGELADA do N1.01 como alvo de rollback — ver a regra " +
    "extra abaixo, que exige que a ficha usada ali seja congelada.",
};

const RAIZ = join(__dirname, "..", "..", "..");

function arquivosDeCodigo(dir: string, fora: string[] = []): string[] {
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) {
      if (nome !== "node_modules") arquivosDeCodigo(caminho, fora);
    } else if (/\.tsx?$/.test(nome) && !/\.test\.tsx?$/.test(nome)) {
      fora.push(caminho);
    }
  }
  return fora;
}

describe("nenhuma ficha chega à criança por fora do canário", () => {
  it("só as portas declaradas chamam Composer.generate", () => {
    const infratores: string[] = [];

    for (const caminho of arquivosDeCodigo(join(RAIZ, "src"))) {
      // Sem os comentários: um arquivo que só *menciona* a chamada ao explicar
      // por que não a faz mais não é infrator. Foi o primeiro falso positivo
      // deste próprio teste.
      const texto = readFileSync(caminho, "utf-8")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(^|[^:])\/\/.*$/gm, "$1");
      if (!texto.includes("Composer.generate")) continue;
      const relativo = caminho.slice(RAIZ.length + 1).replace(/\\/g, "/");
      if (!(relativo in PORTAS_LEGITIMAS)) infratores.push(relativo);
    }

    expect(
      infratores,
      "Estes arquivos servem ficha autoral por fora do canário. O rollback não " +
      "os alcança. Registre a ficha em COMPOSER_FICHAS e deixe selectGenerator " +
      "decidir — ou, se a chamada for legítima, declare-a em PORTAS_LEGITIMAS " +
      "com o motivo.",
    ).toEqual([]);
  });

  it("o legado congelado só compõe fichas congeladas", () => {
    // Se o `legadoF0` compusesse a ficha VIVA, o alvo de rollback mudaria junto
    // com o código novo — e um alvo que muda com o defeito não é alvo nenhum.
    const texto = readFileSync(join(RAIZ, "src/utils/legadoF0.ts"), "utf-8");
    const usadas = [...texto.matchAll(/Composer\.generate\(\s*([A-Za-z0-9_]+)/g)]
      .map(m => m[1]);

    expect(usadas.length, "esperava ao menos a ficha congelada do N1.01").toBeGreaterThan(0);
    for (const nome of usadas) {
      expect(nome, `${nome} não é uma ficha congelada`).toMatch(/_CONGELADA$/);
    }
  });

  it("o congelado não importa nada do código vivo de geradores", () => {
    // Congelar as ajudas é o que impede o alvo de rollback de derivar quando
    // `numOpts` ou `pickEmo` mudarem. Também evita o ciclo de importação.
    const texto = readFileSync(join(RAIZ, "src/utils/legadoF0.ts"), "utf-8");
    const imports = [...texto.matchAll(/from\s+"([^"]+)"/g)].map(m => m[1]);
    expect(imports.filter(i => /generators/.test(i))).toEqual([]);
  });
});

/* ------------------------------------------------------------------ *
 *  Parte 2 — a prova de que o rollback agora devolve alguma coisa
 * ------------------------------------------------------------------ */

/** Os sete nós do F0 que estavam do lado de fora do mecanismo. */
const REGULARIZADOS = ["N1.01", "N1.03", "N1.04", "N1.07", "N1.08", "N1.10", "AL.01"];

/** O N1.02 entra na varredura estática, mas nunca teve porta dos fundos. */

const CANARIOS_ORIGINAIS = [...COMPOSER_CANARIES];

const trilhaDe = (id: string) =>
  CURRICULUM.flatMap(m => m.tracks).find(t => t.id === id)!;

/**
 * A cara da questão, sem o que o sorteio decide.
 *
 * Números e emojis viram `#`: o que resta é a tela — kind, falas, ajuda,
 * explicação, quantidade de alternativas, marcas de misconception.
 *
 * **Por que não só o `prompt`.** Foi a primeira versão deste teste, e ela deu
 * falso negativo no N1.08: a ficha autoral copiou o enunciado do legado letra
 * por letra, então os dois pareciam a mesma tela quando diferem em tutorial,
 * `howto`, `explain` e no número de alternativas. Uma assinatura estreita
 * demais transforma um gate em decoração.
 */
const assinatura = (id: string, lvl: number) =>
  JSON.stringify(trilhaDe(id).gen(lvl))
    .replace(/\d+/g, "#")
    .replace(/\p{Extended_Pictographic}/gu, "#");

describe("o rollback devolve a tela anterior — e é observável", () => {
  afterEach(() => {
    COMPOSER_CANARIES.clear();
    for (const id of CANARIOS_ORIGINAIS) COMPOSER_CANARIES.add(id);
  });

  it("todos os sete têm ficha registrada na ponte", () => {
    for (const id of REGULARIZADOS) {
      expect(hasComposerFicha(id), `${id} sem ficha em COMPOSER_FICHAS`).toBe(true);
    }
  });

  it("desligar o canário muda a tela servida, nó por nó", () => {
    for (const id of REGULARIZADOS) {
      const ligado = new Set([1, 2, 3, 4, 5].map(l => {
        COMPOSER_CANARIES.add(id);
        return assinatura(id, l);
      }));
      const desligado = new Set([1, 2, 3, 4, 5].map(l => {
        rollbackComposerCanary(id);
        return assinatura(id, l);
      }));

      // Se o rollback fosse um no-op — o defeito que este arquivo cobre — os
      // dois conjuntos seriam idênticos.
      expect(
        [...ligado].some(a => !desligado.has(a)),
        `rollback de ${id} não mudou nada: a porta dos fundos voltou`,
      ).toBe(true);
    }
  });

  it("a proveniência conta a verdade nos dois estados", () => {
    for (const id of REGULARIZADOS) {
      COMPOSER_CANARIES.add(id);
      expect(trilhaDe(id).generatorSource, `${id} ativo`).toBe("composer");
      rollbackComposerCanary(id);
      expect(trilhaDe(id).generatorSource, `${id} em rollback`).toBe("legacy");
    }
  });

  it("toda ficha registrada pode ser DESLIGADA e volta ao legado — o intervalo existe", () => {
    // ### O que este teste dizia antes, e por que estava errado
    //
    // Ele fixava uma LISTA — `["N1.01","N1.02","N1.03","N1.04","N1.08"]` — de
    // nós que deviam estar desligados. A lista quebrou no dia em que eles foram
    // ativados, que é o trabalho CERTO acontecendo. É a armadilha do Padrão
    // Ouro §2-bis: *"este teste quebra quando eu faço o trabalho certo?"* — se
    // sim, ele mede inventário e precisa virar regra.
    //
    // Pior: consertar a lista a cada ativação treina a mão a silenciar o teste
    // sem pensar, e no dia em que ele quebrar por um motivo real ela já vai
    // estar automatizada.
    //
    // ### A regra que ele passa a medir
    //
    // A disciplina dos dois PRs não é uma lista de ids: é **existir o
    // intervalo**. Toda ficha registrada tem de poder ser desligada, cair no
    // gerador anterior e voltar — sem rebuild, valendo na próxima questão.
    // Enquanto isso for verdade, qualquer tela nova pode nascer desligada; e um
    // nó que não consegue voltar é um nó sem rollback, que é o defeito §6.7.
    for (const id of REGULARIZADOS) {
      expect(hasComposerFicha(id), `${id} sem ficha registrada`).toBe(true);

      rollbackComposerCanary(id);
      expect(COMPOSER_CANARIES.has(id), `${id} continuou ativo após rollback`).toBe(false);
      expect(trilhaDe(id).generatorSource, `${id} desligado`).toBe("legacy");
      // E o legado precisa ser tela de verdade: uma emergência que cai em
      // placeholder não socorre ninguém.
      expect(trilhaDe(id).contentStatus, `${id} desligado`).not.toBe("fallback");

      COMPOSER_CANARIES.add(id);
      expect(trilhaDe(id).generatorSource, `${id} religado`).toBe("composer");
    }
  });

  it("nenhum nó regularizado cai no fallback genérico", () => {
    // `contentStatus: "fallback"` faria a Oficina prescrever resgate sobre
    // conteúdo que não existe. Ligado ou desligado, estes sete têm tela própria.
    for (const id of REGULARIZADOS) {
      rollbackComposerCanary(id);
      expect(trilhaDe(id).contentStatus, `${id} em rollback`).toBe("explicit");
    }
  });
});
