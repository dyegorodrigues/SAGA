import { describe, expect, it } from "vitest";
import { DojoEngine, DojoCandidate } from "../curriculum/motores/dojoEngine";
import { FactStrength, ProcStrength } from "../types";

describe("DojoEngine - Pilar de Fluência (§3 e §4)", () => {
  it("normalizeFactId deve comutar fatos de forma canônica", () => {
    expect(DojoEngine.normalizeFactId("6x7")).toBe("6x7");
    expect(DojoEngine.normalizeFactId("7x6")).toBe("6x7");
    expect(DojoEngine.normalizeFactId("9+4")).toBe("4+9");
  });

  describe("FactStrength - Fatos (FD)", () => {
    it("acerto RÁPIDO (<= rt_target) promove a força", () => {
      const fact: FactStrength = { fact_id: "6x7", forca: 2, rt_medio: 4000, ultima_vez: new Date().toISOString(), erros_seguidos: 0 };
      // FD3 alvo é 4000ms. duration = 3000ms
      const result = DojoEngine.evaluateFact("FD3", fact, true, 3000);
      expect(result.forca).toBe(3);
      expect(result.erros_seguidos).toBe(0);
      expect(result.rt_medio).toBeLessThan(4000); // media movel cai
    });

    it("acerto LENTO (> rt_target) MANTÉM a força", () => {
      const fact: FactStrength = { fact_id: "6x7", forca: 3, rt_medio: 4000, ultima_vez: new Date().toISOString(), erros_seguidos: 0 };
      // FD3 alvo é 4000ms. duration = 5000ms
      const result = DojoEngine.evaluateFact("FD3", fact, true, 5000);
      expect(result.forca).toBe(3); // não mudou
    });

    it("erro rebaixa a força e entra na fila quente", () => {
      const fact: FactStrength = { fact_id: "6x7", forca: 3, rt_medio: 4000, ultima_vez: new Date().toISOString(), erros_seguidos: 0 };
      const result = DojoEngine.evaluateFact("FD3", fact, false, 4000);
      expect(result.forca).toBe(2);
      expect(result.erros_seguidos).toBe(1);
    });

    it("decaimento: força >= 4 sem treino há 14+ dias cai 1 APENAS ao reaparecer errado (sem punição dupla)", () => {
      const oldDate = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();
      const fact: FactStrength = { fact_id: "6x7", forca: 5, rt_medio: 3000, ultima_vez: oldDate, erros_seguidos: 0 };
      
      const result = DojoEngine.evaluateFact("FD3", fact, false, 5000);
      // Cai 1 pelo erro + decaimento de forma EXCLUSIVA, então a queda total é 1.
      expect(result.forca).toBe(4); // Cai de 5 para 4
    });

    it("força >= 4 sem treino há 14+ dias NÃO cai se acertar", () => {
      const oldDate = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();
      const fact: FactStrength = { fact_id: "6x7", forca: 4, rt_medio: 3000, ultima_vez: oldDate, erros_seguidos: 0 };
      
      const result = DojoEngine.evaluateFact("FD3", fact, true, 3000);
      // Promove (ou no maximo mantem) mas nao decai. Como 3000 <= 4000, promove para 5.
      expect(result.forca).toBe(5);
    });

    it("Média móvel e precisão na primeira vez não diluem o valor a 30%", () => {
      const fact: FactStrength = { fact_id: "6x7", forca: 1, rt_medio: 0, ultima_vez: "", erros_seguidos: 0 };
      const result = DojoEngine.evaluateFact("FD1", fact, true, 2000);
      expect(result.rt_medio).toBe(2000); // 100% cru
    });
  });

  describe("ProcStrength - Procedimentos Armados (PD)", () => {
    it("registra passo fraco ao errar e rebaixa", () => {
      const proc: ProcStrength = { proc_id: "sub_borr", precisao: 80, tempo_medio: 10000, forca: 2, ultima_vez: new Date().toISOString(), erros_seguidos: 0 };
      const result = DojoEngine.evaluateProc("PD2", proc, false, 12000, "borrow");
      expect(result.forca).toBe(1);
      expect(result.passo_fraco).toBe("borrow");
      expect(result.precisao).toBeLessThan(80);
      expect(result.erros_seguidos).toBe(1);
    });

    it("acerto na primeira vez é 100% na média, e promove força pois curve = fast", () => {
      const proc: ProcStrength = { proc_id: "sub_borr", precisao: 0, tempo_medio: 0, forca: 1, ultima_vez: "", erros_seguidos: 0 };
      const result = DojoEngine.evaluateProc("PD2", proc, true, 35000);
      expect(result.precisao).toBe(100);
      expect(result.tempo_medio).toBe(35000);
      expect(result.forca).toBe(2);
    });

    it("acerto onde tempo <= media histórica e precisao >= 90 promove a força", () => {
      const proc: ProcStrength = { proc_id: "sub_borr", precisao: 95, tempo_medio: 30000, forca: 3, ultima_vez: new Date().toISOString(), erros_seguidos: 0 };
      const result = DojoEngine.evaluateProc("PD2", proc, true, 25000); // Rápido
      expect(result.forca).toBe(4);
    });

    it("acerto LENTO (tempo > media) MANTÉM a força", () => {
      const proc: ProcStrength = { proc_id: "sub_borr", precisao: 95, tempo_medio: 30000, forca: 3, ultima_vez: new Date().toISOString(), erros_seguidos: 0 };
      const result = DojoEngine.evaluateProc("PD2", proc, true, 40000); // Lento
      expect(result.forca).toBe(3);
    });

    it("decaimento PD: sem treino 14+ dias cai força ao errar", () => {
      const oldDate = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();
      const proc: ProcStrength = { proc_id: "sub_borr", precisao: 95, tempo_medio: 30000, forca: 5, ultima_vez: oldDate, erros_seguidos: 0 };
      const result = DojoEngine.evaluateProc("PD2", proc, false, 45000);
      // Cai apenas 1 pela conjunção decaimento/erro
      expect(result.forca).toBe(4);
    });
  });

  describe("Warmup Recipe (§4)", () => {
    it("distribui as proporções corretas e substitui normalItems corretamente por easyItems", () => {
      const candidates: DojoCandidate[] = [];
      
      // 10 current items (NENHUM easy inicialmente entre os 6 selecionados)
      for (let i = 0; i < 10; i++) candidates.push({ id: `c${i}`, category: "current", isEasy: i >= 6 }); // Só do c6 ao c9 são easy!
      // 5 review items
      for (let i = 0; i < 5; i++) candidates.push({ id: `r${i}`, category: "review", isEasy: false });
      // 3 hot items
      for (let i = 0; i < 3; i++) candidates.push({ id: `h${i}`, category: "hot", isEasy: false });
      // 3 next items
      for (let i = 0; i < 3; i++) candidates.push({ id: `n${i}`, category: "next", isEasy: false });

      // totalSize 10: target 6 current, 2 review, 1 hot, 1 next
      const result = DojoEngine.getDailyWarmup(candidates, 10);
      
      expect(result).toHaveLength(10);
      
      // Deve ter preservado exatamente as proporções 6, 2, 1, 1 (substituindo c normais por c easy)
      const currentCount = result.filter(id => id.startsWith("c")).length;
      const reviewCount = result.filter(id => id.startsWith("r")).length;
      expect(currentCount).toBe(6);
      expect(reviewCount).toBe(2);

      // Os últimos itens DEVEM ser easy (ex: c6, c7, c8)
      const lastThree = result.slice(-3);
      lastThree.forEach(id => {
        const item = candidates.find(c => c.id === id);
        expect(item?.isEasy).toBe(true);
      });
    });

    it("não joga items normais pro fim se não houver fáceis suficientes no universo", () => {
      const candidates: DojoCandidate[] = [];
      // APENAS 1 item easy NO TOTAL
      for (let i = 0; i < 10; i++) candidates.push({ id: `c${i}`, category: "current", isEasy: i === 9 }); 
      for (let i = 0; i < 5; i++) candidates.push({ id: `r${i}`, category: "review", isEasy: false });

      const result = DojoEngine.getDailyWarmup(candidates, 10);
      expect(result).toHaveLength(10);
      
      // Apenas o ÚLTIMO deve ser o c9
      const lastItem = candidates.find(c => c.id === result[result.length - 1]);
      expect(lastItem?.isEasy).toBe(true);
      
      // O penúltimo é normal
      const beforeLast = candidates.find(c => c.id === result[result.length - 2]);
      expect(beforeLast?.isEasy).toBe(false);
    });
  });
});
