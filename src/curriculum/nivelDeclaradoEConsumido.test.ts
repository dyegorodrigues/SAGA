import { afterEach, describe, expect, it } from "vitest";
import { JOURNEY_FICHAS } from "./fichas";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "./motores/composerCanary";
import type { Question } from "../types";

/**
 * CLASS-001 — o gerador declara um nível e não o consome.
 *
 * A ficha declara cinco degraus, cada um com o seu alvo. Se o gerador produz a
 * MESMA questão em dois deles, um dos degraus existe só no papel: a criança
 * sobe e a tela não muda, e o nível que ela "venceu" não mediu o que ele
 * prometia medir.
 *
 * ### A medição
 *
 * Mesma semente, dois níveis, mesma digital? Fixar a semente é o que torna a
 * comparação possível: dois níveis com espaços de questão diferentes podem, por
 * acaso, sortear itens parecidos; o que não pode acontecer é os dois lerem o
 * mesmo estado do gerador e chegarem ao mesmo lugar.
 *
 * A digital inclui o que a criança vê e o que o motor recebe — enunciado, cena,
 * alternativas, regra de domínio e alvo de tempo. Um nível que só muda o
 * `andaime` continua distinto: o andaime muda a tela, e a tela está na digital.
 *
 * Gate por descoberta, sem registro: nenhuma ficha pode ter dois níveis iguais.
 */
const SEMENTES = [0x2f6e2b1, 0x5bd1e99, 0x1a2b3c4];
const original = Math.random;
afterEach(() => { Math.random = original; });

function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}

function digital(q: Question): string {
  return JSON.stringify({
    kind: q.kind,
    prompt: q.prompt,
    uiProps: q.uiProps,
    answer: q.answer,
    options: (q.options ?? []).map(option => [option.value, option.label, option.misconception]),
    masteryRule: q.masteryRule,
    rt: q.rt_max_s,
    exige: q.exigeEvidencia,
  });
}

describe("CLASS-001 — todo nível declarado é um nível consumido", () => {
  it("nenhuma ficha produz a mesma questão em dois níveis diferentes", { timeout: 300000 }, () => {
    const iguais: string[] = [];
    let comparados = 0;

    for (const ficha of JOURNEY_FICHAS.filter(item => hasComposerFicha(item.id))) {
      const repetidos = new Map<string, number>();
      for (const semente of SEMENTES) {
        // `b` começa em `a` de propósito: o par consigo mesmo é o controle da
        // medição. Se ele deixar de dar igual, quem quebrou foi a semente — e
        // sem semente fixa a comparação entre níveis não quer dizer nada,
        // porque dois sorteios diferentes quase nunca coincidem por acaso.
        for (let a = 1; a <= 5; a += 1) {
          for (let b = a; b <= 5; b += 1) {
            semear(semente);
            const daPrimeira = digital(generateRegisteredFichaQuestion(ficha.id, a) as Question);
            semear(semente);
            const daSegunda = digital(generateRegisteredFichaQuestion(ficha.id, b) as Question);
            comparados += 1;
            if (a === b) {
              expect(daSegunda, `${ficha.id} L${a}: a mesma semente deu duas questões diferentes`).toBe(daPrimeira);
              continue;
            }
            if (daPrimeira === daSegunda) repetidos.set(`L${a}=L${b}`, (repetidos.get(`L${a}=L${b}`) ?? 0) + 1);
          }
        }
      }
      Math.random = original;
      // Só conta o par que se repete em TODA semente. Coincidência numa
      // semente é coincidência; nas três é o gerador ignorando o nível.
      for (const [par, vezes] of repetidos) {
        if (vezes === SEMENTES.length) iguais.push(`${ficha.id} ${par}`);
      }
    }

    expect(iguais, `níveis declarados que o gerador não consome:\n${iguais.join("\n")}`).toEqual([]);

    // Prova de vida: 75 fichas × 10 pares × 3 sementes. Se este número desabar,
    // quem parou foi a varredura.
    expect(comparados, "a varredura parou de comparar níveis").toBeGreaterThan(3000);
  });
});
