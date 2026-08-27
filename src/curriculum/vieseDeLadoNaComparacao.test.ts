import { afterEach, describe, expect, it } from "vitest";
import { JOURNEY_FICHAS } from "./fichas";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "./motores/composerCanary";

/**
 * CLASS-004 — viés posicional em comparação.
 *
 * Quando a pergunta é "qual dos dois?", a resposta não é um número: é um LADO.
 * Se o lado certo é sempre o mesmo, a criança aprende a apontar para lá e o
 * nível deixa de medir a comparação — mesmo com os objetos comparados mudando
 * a cada sorteio.
 *
 * ### Por que este gate não é o da resposta decorável
 *
 * Porque o RÓTULO varia. Em `N6.01` L4 a alternativa se chamava "0,5" ou "0,7",
 * conforme o par; em `N5.03` L3 ela se chamava "3/4 é maior". A varredura de
 * rótulo passava batida nas duas. O que não variava era o VALUE — `esquerda`,
 * `direita` — que é o que diz para onde o dedo vai.
 *
 * A medição é por descoberta: qualquer nível em que o `value` da alternativa
 * certa nunca muda enquanto o rótulo muda é candidato, e só entra na classe se
 * esse `value` nomear uma POSIÇÃO. O vocabulário de posições abaixo é sobre a
 * língua, não sobre quais fichas participam — quem decide participação continua
 * sendo a medição.
 */
const PALAVRAS_DE_POSICAO = new Set([
  "esquerda", "direita", "cima", "baixo", "topo", "fundo",
  "primeiro", "segundo", "terceiro", "ultimo", "último",
  "a", "b", "c", "saco a", "saco b", "vista a", "vista b", "vista c",
]);

const SEMENTES = [0x2f6e2b1, 0x5bd1e99];
const AMOSTRAS = 8;
const original = Math.random;
afterEach(() => { Math.random = original; });

function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}

/**
 * O detector, isolado do corpus para poder ser testado contra casos conhecidos.
 *
 * Recebe o que a criança veria — o `value` que o dedo envia e o rótulo que ela
 * lê — e diz qual posição está presa, se alguma estiver.
 */
function ladoPreso(amostras: Array<{ value: string; label: string }>): string | undefined {
  if (!amostras.length) return undefined;
  const valores = new Set(amostras.map(amostra => amostra.value));
  const rotulos = new Set(amostras.map(amostra => amostra.label));
  if (valores.size !== 1 || rotulos.size < 2) return undefined;
  const unico = [...valores][0];
  return PALAVRAS_DE_POSICAO.has(unico.toLowerCase()) ? unico : undefined;
}

describe("CLASS-004 — o lado certo não pode ser sempre o mesmo", () => {
  it("o detector acusa o lado preso e absolve o lado que alterna", () => {
    // Controle. Sem ele, um gate que parasse de olhar o `value` e passasse a
    // olhar o rótulo ficaria verde para sempre — os rótulos variam, é essa a
    // razão de a classe existir — e ninguém saberia que o detector cegou.
    const preso = [
      { value: "esquerda", label: "0,5" },
      { value: "esquerda", label: "0,7" },
      { value: "esquerda", label: "0,4" },
    ];
    const alterna = [
      { value: "esquerda", label: "0,5" },
      { value: "direita", label: "0,7" },
      { value: "esquerda", label: "0,4" },
    ];
    const semPosicao = [
      { value: "12", label: "12" },
      { value: "12", label: "doze" },
    ];
    // Rótulo preso junto com o lado é a resposta decorável, e ela tem gate
    // próprio. Duas classes acusando o mesmo caso dariam dois reparos para um
    // defeito, e o registro de uma delas nunca esvaziaria.
    const rotuloTambemPreso = [
      { value: "esquerda", label: "0,5" },
      { value: "esquerda", label: "0,5" },
    ];
    expect(ladoPreso(preso)).toBe("esquerda");
    expect(ladoPreso(alterna)).toBeUndefined();
    expect(ladoPreso(semPosicao), "número invariável é outra classe, não esta").toBeUndefined();
    expect(ladoPreso(rotuloTambemPreso), "rótulo preso é a CLASS-003, não a CLASS-004").toBeUndefined();
  });

  it("nenhum nível responde sempre para o mesmo lado", { timeout: 300000 }, () => {
    const enviesados: string[] = [];
    let comparacoesVistas = 0;

    for (const ficha of JOURNEY_FICHAS.filter(item => hasComposerFicha(item.id))) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const amostras: Array<{ value: string; label: string }> = [];
        for (const semente of SEMENTES) {
          semear(semente);
          for (let i = 0; i < AMOSTRAS; i += 1) {
            const q = generateRegisteredFichaQuestion(ficha.id, nivel);
            const opcoes = q.options ?? [];
            if (opcoes.length < 2) continue;
            const certa = opcoes.find(option => q.evaluate?.(option.value)) ?? opcoes.find(option => option.value === q.answer);
            amostras.push({
              value: String(certa?.value ?? q.answer),
              label: String(certa?.label ?? certa?.value ?? q.answer),
            });
          }
        }
        Math.random = original;
        if (!amostras.length) continue;
        if (amostras.some(amostra => PALAVRAS_DE_POSICAO.has(amostra.value.toLowerCase()))) comparacoesVistas += 1;

        // O rótulo variando é o que separa esta classe da resposta decorável:
        // ali o problema é o texto repetido, aqui é o dedo indo sempre ao mesmo
        // lugar enquanto o texto muda.
        const preso = ladoPreso(amostras);
        if (preso) {
          const rotulos = new Set(amostras.map(amostra => amostra.label));
          enviesados.push(`${ficha.id} L${nivel}: responde sempre "${preso}" com ${rotulos.size} rótulos diferentes`);
        }
      }
    }

    expect(enviesados, `níveis que apontam sempre para o mesmo lado:\n${enviesados.join("\n")}`).toEqual([]);

    // Prova de vida: sem comparações por posição no corpus, o verde acima
    // significa "não olhei". A Jornada tem várias — sacos, vistas, lados.
    expect(comparacoesVistas, "a varredura parou de achar comparação por posição").toBeGreaterThan(3);
  });
});
