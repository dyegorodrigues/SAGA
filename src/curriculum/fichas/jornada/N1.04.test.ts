import { describe, expect, it } from "vitest";
import { Composer } from "../../Composer";
import { N1_04 } from "./N1.04";

const F01 = {
  howto: "Toque um de cada vez. Quando tocar, fale o número comigo.",
  explain: "Toque devagar, um por um. Os que já brilharam, você já contou.",
};

const F03 = {
  howto: "Comece por um canto e vá seguindo. Toque em cada um para marcar.",
  explain: "Escolha um para começar e vá tocando de um lado para o outro, sem pular nenhum.",
};

const EXPECTATIVA = [
  { nivel: 1, micro: "fila_com_mao", fonte: "F01", ...F01 },
  { nivel: 2, micro: "fila_sozinha", fonte: "F01", ...F01 },
  { nivel: 3, micro: "grade", fonte: "F03", ...F03 },
  { nivel: 4, micro: "disperso", fonte: "F03", ...F03 },
  {
    nivel: 5,
    micro: "sem_marcacao",
    fonte: "F03",
    howto: "Comece por um canto e siga um caminho mental. Toque uma vez em cada um, sem voltar.",
    explain: F03.explain,
  },
] as const;

describe("N1.04 — F01 + F03 sem misturar a voz das fichas", () => {
  it("declara a proveniência de cada degrau da competência composta", () => {
    for (const esperado of EXPECTATIVA) {
      const microId = N1_04.niveis?.[esperado.nivel]?.micro;
      expect(microId, `nível ${esperado.nivel} deve apontar para ${esperado.micro}`).toBe(esperado.micro);
      const micro = N1_04.micros.find(item => item.id === microId);
      expect(micro?.fonte, `${esperado.micro} deve declarar a ficha de origem`).toBe(esperado.fonte);
    }
  });

  it("mantém TouchCount em toda a escada e troca a instrução quando F03 assume", () => {
    for (const esperado of EXPECTATIVA) {
      const questao = Composer.generate(N1_04, esperado.nivel);
      expect(questao.kind, `N1.04 nível ${esperado.nivel}`).toBe("touchcount");
      expect(questao.howto, `howto ${esperado.micro}`).toBe(esperado.howto);
      expect(questao.explain, `explain ${esperado.micro}`).toBe(esperado.explain);
    }
  });
});
