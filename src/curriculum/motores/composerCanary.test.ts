import { afterEach, describe, expect, it } from "vitest";
import { gN3_09 } from "../../utils/generatorsF1";
import { gN3_11 } from "../../utils/generatorsF2";
import {
  COMPOSER_CANARIES,
  enableComposerCanary,
  hasComposerFicha,
  rollbackComposerCanary,
  selectGenerator,
} from "./composerCanary";
import { ALL_MATH_TRACKS, geradorLegadoDe, getTrackById } from "./curriculum";

const fallback = () => ({ kind: "multiple_choice", prompt: "fallback", answer: 1 });

describe("ponte de canário do Composer", () => {
  afterEach(() => {
    COMPOSER_CANARIES.clear();
    COMPOSER_CANARIES.add("N3.09");
    COMPOSER_CANARIES.add("N3.10");
  });

  it("serve os canários pelo Composer e mantém os demais no legado", () => {
    // A lista NÃO é fixada aqui: enumerar o conjunto e afirmar sua composição
    // faria este teste quebrar a cada promoção legítima, treinando quem lê a
    // "consertar" o teste sem pensar. Quem trava a composição é o contrato do
    // canário, que exige registro para cada nó promovido.
    expect(COMPOSER_CANARIES.size).toBeGreaterThan(0);
    for (const id of COMPOSER_CANARIES) {
      expect(selectGenerator(id, undefined, fallback).source(), id).toBe("composer");
    }
    // O nó legado também não é escrito à mão. Esta linha fixava "N3.11" como o
    // exemplo de quem fica no legado; quando a N3.11 foi promovida na W52, o
    // teste reprovou por envelhecimento. O que importa afirmar é que a ponte
    // NÃO promove quem não está no conjunto — para qualquer id fora dele.
    // ### Onde este teste foi buscar o objeto dele
    //
    // A metade de baixo media os nós FORA do conjunto, e ela morreu de sucesso:
    // com a Jornada fechada em 90/90, não existe mais nó por promover. A
    // afirmação não ficou falsa — ficou sem sujeito, e um teste sem sujeito
    // passa vazio, que é a cegueira que esta suíte inteira existe para impedir.
    //
    // O sujeito não sumiu do repositório, mudou de lugar: o ramo `legacy` da
    // ponte continua existindo porque o ROLLBACK existe. Tirar um nó do
    // conjunto é o que a operação de rollback faz, e é exatamente ali que a
    // pergunta "quem está fora vem do Composer?" volta a ter o que medir.
    const cobaia = [...COMPOSER_CANARIES].find(id => geradorLegadoDe(id));
    expect(cobaia, "nenhum canário tem gerador legado: o rollback perdeu o objeto").toBeDefined();

    rollbackComposerCanary(cobaia!);
    expect(COMPOSER_CANARIES.has(cobaia!)).toBe(false);
    // O legado vem de `geradorLegadoDe`, não de um gerador emprestado: quem tem
    // legado próprio cai no legado, quem nunca teve cai no fallback.
    expect(selectGenerator(cobaia!, geradorLegadoDe(cobaia!), fallback).source(), `${cobaia} saiu do conjunto e mesmo assim veio do Composer`)
      .toBe("legacy");

    // O outro lado da mesma distinção: quem nunca teve gerador legado cai no
    // fallback, não no legado. Também precisa sair do conjunto primeiro —
    // dentro dele, todo nó vem do Composer, que é o ponto.
    const semLegado = ALL_MATH_TRACKS.map(track => track.id).find(id => !geradorLegadoDe(id));
    if (semLegado) {
      rollbackComposerCanary(semLegado);
      expect(selectGenerator(semLegado, undefined, fallback).source(), `${semLegado} nunca teve legado e não caiu no fallback`)
        .toBe("fallback");
    }
  });

  it("classifica implementação ausente como fallback", () => {
    expect(selectGenerator("desconhecido", undefined, fallback).source()).toBe("fallback");
  });

  // O id do nó sem ficha NÃO é escrito à mão. A primeira versão deste teste
  // fixava "N4.02" como exemplo; no dia em que a N4.02 ganhou ficha e foi
  // promovida, o teste passou a reprovar por envelhecimento — não por defeito.
  // O contrato não fala de um nó, fala de qualquer nó sem ficha: então o teste
  // pergunta ao catálogo quem ainda não tem, e acrescenta um id sintético para
  // continuar observando alguma coisa mesmo no dia em que todas as 90 tiverem
  // ficha registrada.
  it("recusa ativar canário de nó sem ficha autoral registrada", () => {
    const semFicha = ALL_MATH_TRACKS.map(t => t.id).filter(id => !hasComposerFicha(id));
    const alvos = [...semFicha, "nó-que-não-existe"];

    for (const id of alvos) {
      expect(() => enableComposerCanary(id), id).toThrow(/ficha autoral/);
      expect(COMPOSER_CANARIES.has(id), `${id} entrou no conjunto mesmo sem ficha`).toBe(false);
    }
  });

  // Regressão: o rollback precisa valer no caminho de produção, não apenas na
  // função isolada. Antes, CURRICULUM congelava a decisão na carga do módulo e
  // retirar o id do conjunto não surtia efeito algum.
  it("o rollback muda o gerador servido em produção", () => {
    expect(getTrackById("N3.09")?.generatorSource).toBe("composer");

    rollbackComposerCanary("N3.09");

    expect(getTrackById("N3.09")?.generatorSource).toBe("legacy");
    // Os geradores são aleatórios por chamada; a prova é a proveniência somada a
    // uma questão ainda utilizável, não a igualdade entre duas amostras.
    expect(getTrackById("N3.09")?.gen(1).kind).toBe(gN3_09(1).kind);
  });

  // Regressão: promover um novo canário não pode exigir edição do curriculum.
  it("ativar um canário exige apenas ficha registrada, sem lista de ids no curriculum", () => {
    rollbackComposerCanary("N3.09");
    expect(getTrackById("N3.09")?.generatorSource).toBe("legacy");

    enableComposerCanary("N3.09");

    expect(getTrackById("N3.09")?.generatorSource).toBe("composer");
  });

  it("nós fora do conjunto de canários permanecem intactos", () => {
    expect(getTrackById("N3.11")?.generatorSource).toBe("legacy");
    expect(getTrackById("N4.02")?.generatorSource).toBe("legacy");
  });
});
