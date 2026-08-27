import { afterEach, describe, expect, it } from "vitest";
import { construirVolumeVistasSpec } from "./volumeVistasContract";

/**
 * CLASS-003, segunda dimensão — GE.10/F92.
 *
 * A construção era uma só por nível, e o rótulo certo era pior que fixo: era
 * autodeclarado. "Vista A" acertava L1 porque a vista frontal era sempre a
 * primeira desenhada; "Construção que reproduz as três vistas" e "As três
 * vistas desenhadas corretamente" acertavam L3 e L5 porque DIZEM que estão
 * certas, ao lado de "Construção girada" e "Repete a mesma vista três vezes",
 * que dizem que estão erradas. Ler português vencia a competência.
 *
 * O degrau continua: uma vista, três vistas, reconstruir, contar os ocultos,
 * desenhar. O que muda é a construção — e a letra de cada vista, que passa a
 * ser sorteada em vez de seguir a ordem em que o palco desenha.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x1f4ac83) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirVolumeVistasSpec(nivel));
}
const rotuloCerto = (spec: ReturnType<typeof construirVolumeVistasSpec>) =>
  spec.opcoes.find(o => o.value === spec.resposta)!.label;

describe("CLASS-003 — GE.10/F92: a construção muda, a escada não", () => {
  it("nenhum nível constrói sempre a mesma pilha nem responde sempre o mesmo rótulo", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const specs = amostrar(nivel);
      expect(new Set(specs.map(s => JSON.stringify(s.alturas))).size, `L${nivel} constrói sempre a mesma pilha`).toBeGreaterThan(1);
      expect(new Set(specs.map(rotuloCerto)).size, `L${nivel} responde sempre "${rotuloCerto(specs[0])}"`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo e as vistas saem da construção", () => {
    const modos = ["vista-frontal", "tres-vistas", "reconstruir-vistas", "cubos-ocultos", "desenhar-vistas"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.modo).toBe(modos[nivel - 1]);
        expect(spec.alturas.length, `L${nivel} sem construção`).toBeGreaterThan(0);
        // A vista de cima marca exatamente as posições ocupadas do chão.
        const ocupadas = spec.alturas.flat().filter(altura => altura > 0).length;
        expect(spec.vistas.cima.activeCells, `L${nivel}: a vista de cima não bate com o chão`).toHaveLength(ocupadas);
        expect(ocupadas, `L${nivel} com o chão vazio`).toBeGreaterThan(1);
        for (const altura of spec.alturas.flat()) expect(altura).toBeLessThanOrEqual(3);
      }
    }
  });

  it("onde a criança escolhe entre vistas, elas são distinguíveis e a letra é sorteada", () => {
    for (const nivel of [1, 2]) {
      const letras = new Set<string>();
      for (const spec of amostrar(nivel)) {
        const ordem = spec.vistasEmbaralhadas!;
        expect(ordem, `L${nivel} precisa da ordem em que as vistas aparecem`).toHaveLength(3);
        expect(new Set(ordem).size, "cada vista aparece uma vez").toBe(3);
        // Duas vistas com a mesma silhueta dariam duas respostas certas em L1 e
        // tornariam a ordem de L2 indistinguível.
        const silhuetas = (["frente", "lado", "cima"] as const).map(v => `${spec.vistas[v].rows}x${spec.vistas[v].cols}:${spec.vistas[v].activeCells.join(".")}`);
        expect(new Set(silhuetas).size, `L${nivel}: duas vistas idênticas`).toBe(3);
        letras.add(rotuloCerto(spec));
      }
      expect(letras.size, `L${nivel}: a letra certa precisa mudar`).toBeGreaterThan(1);
    }
  });

  it("contar cubos ocultos exige mesmo contar o que não se vê", () => {
    for (const spec of amostrar(4)) {
      const total = spec.alturas.flat().reduce((soma, altura) => soma + altura, 0);
      const aparentes = spec.alturas.flat().filter(altura => altura > 0).length;
      expect(spec.resposta).toBe(String(total));
      // Se o total igualasse o número de posições ocupadas, não haveria cubo
      // escondido: o distrator IGNORA_OCULTOS acertaria, e o nível inteiro
      // perderia o que ensina.
      expect(total, "L4 precisa de pelo menos um cubo escondido").toBeGreaterThan(aparentes);
      expect(total - 1, "o distrator de fora-por-um não pode virar o de ocultos").not.toBe(aparentes);
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => o.value);
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(new Set(spec.opcoes.map(o => o.label)).size, `L${nivel} repetiu rótulo`).toBe(valores.length);
        expect(valores.filter(v => v === spec.resposta).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes.filter(o => !o.misconception).length, `L${nivel} sem alternativa certa única`).toBe(1);
        expect(spec.opcoes, `L${nivel} perdeu alternativa`).toHaveLength(3);
      }
    }
  });

  it("nenhum rótulo diz se está certo ou errado", () => {
    // Era o defeito mais grosseiro da ficha: as alternativas de L3 e L5 se
    // apresentavam como "a correta", "a girada" e "a sem rotação mental". Não
    // era preciso olhar a construção — bastava ler.
    const autodeclarados = /corret|correta|errad|girada|sem rota|iguais|repete/i;
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const certo = rotuloCerto(spec);
        expect(autodeclarados.test(certo), `L${nivel}: o rótulo "${certo}" declara o próprio veredito`).toBe(false);
      }
    }
  });
});
