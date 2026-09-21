import { describe, expect, it } from "vitest";
import { construirReguaSpec } from "./reguaContract";
import { construirSolidosGeometricosF59Spec } from "./solidosGeometricosContract";

/**
 * Concordância nas falas que nomeiam objeto.
 *
 * O enunciado do SAGA é FALADO: a Jornada começa no 1º ano e a criança de seis
 * anos não lê. Ela está aprendendo a língua ao mesmo tempo que a matemática —
 * e o que ela ouve, ela imita.
 *
 * Duas fichas montavam a frase com artigo masculino fixo e sorteavam um nome
 * feminino dentro dela:
 *
 * - F61/GM.05: "Quantas bolas iguais medem **o fita de treino**?", "Alinhe o
 *   zero da régua com a ponta **do fita de treino**. Depois leia a marca
 *   inteira onde **ele** termina."
 * - F59/GE.04: "o que acontece com **o esfera** na rampa?"
 *
 * O portão sorteia muitas vezes porque o objeto é sorteado: uma rodada só
 * poderia nunca cair na palavra feminina e passar calada.
 */

const FEMININOS = ["fita de treino", "esfera", "pirâmide"];
const ARTIGO_ERRADO = FEMININOS.map(n => new RegExp(`\\b(o|do|no|ao|pelo)\\s+${n}\\b`, "i"));

function acusar(frases: string[]): string[] {
  return frases.filter(f => ARTIGO_ERRADO.some(re => re.test(f)));
}

describe("as falas concordam com o nome que sorteiam", () => {
  it("a régua (F61) nomeia a fita de treino no feminino", () => {
    const frases: string[] = [];
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let i = 0; i < 80; i += 1) {
        const spec = construirReguaSpec(nivel);
        frases.push(spec.enunciado, spec.falado);
      }
    }
    // Prova de vida: sem a fita entre os sorteios, o portão não mediria nada.
    expect(frases.some(f => f.includes("fita de treino"))).toBe(true);
    expect(acusar(frases), `artigo masculino em nome feminino:\n${acusar(frases).join("\n")}`).toEqual([]);
  });

  it("os sólidos (F59) nomeiam a esfera e a pirâmide no feminino", () => {
    const frases: string[] = [];
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let i = 0; i < 80; i += 1) {
        const spec = construirSolidosGeometricosF59Spec(nivel) as unknown as Record<string, unknown>;
        // O spec da F59 carrega texto em campos diferentes conforme o modo;
        // varrer todos os campos de texto evita perder a frase que interessa.
        for (const valor of Object.values(spec)) if (typeof valor === "string") frases.push(valor);
      }
    }
    expect(frases.some(f => f.includes("esfera"))).toBe(true);
    expect(acusar(frases), `artigo masculino em nome feminino:\n${acusar(frases).join("\n")}`).toEqual([]);
  });
});
