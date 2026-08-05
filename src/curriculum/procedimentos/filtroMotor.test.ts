import { describe, expect, it } from "vitest";
import {
  ARRASTO_ABORTADO_MS,
  EventoManipulacao,
  FOLGA_DE_SNAP,
  classificarErro,
  podeGerarDiagnostico,
} from "./filtroMotor";

/**
 * Cobertura do §8.3-bis da Bíblia — "erro de dedo não é erro de cabeça".
 *
 * A tabela do cânone lista assinaturas observáveis de cada padrão. Cada linha
 * dela vira um teste aqui, porque o custo dos dois erros é assimétrico e está
 * escrito: falso negativo custa uma questão; falso positivo contamina o Radar,
 * dispara Oficina injusta e ensina a criança que ela é ruim naquilo.
 */

describe("assinaturas de erro MOTOR (não pontuam, não viram tag)", () => {
  it("mira o alvo certo e solta perto dele — dentro de 1,5× a área de snap", () => {
    expect(classificarErro({ distanciaDoAlvoCorreto: 60, raioDeSnap: 40 })).toBe("motor");
  });

  it("usa exatamente a folga do cânone como limite inclusivo", () => {
    const raioDeSnap = 40;
    const naBorda = raioDeSnap * FOLGA_DE_SNAP;
    expect(classificarErro({ distanciaDoAlvoCorreto: naBorda, raioDeSnap })).toBe("motor");
  });

  it("solta fora de qualquer alvo válido", () => {
    // Não escolheu destino algum, logo não escolheu destino errado.
    expect(classificarErro({ foraDeAlvoValido: true })).toBe("motor");
  });

  it("corrige sozinha na sequência", () => {
    // Corrigir-se é evidência de que a criança sabia — o dedo é que não.
    expect(classificarErro({ corrigiuSozinha: true })).toBe("motor");
  });

  it("arrasto abortado antes de 200ms", () => {
    expect(classificarErro({ duracaoMs: ARRASTO_ABORTADO_MS - 1 })).toBe("motor");
  });

  it("falha de reconhecimento de escrita à mão nunca vira tag", () => {
    expect(classificarErro({ deReconhecimentoDeEscrita: true })).toBe("motor");
  });
});

describe("assinaturas de erro CONCEITUAL (pontuam e recebem tag)", () => {
  it("completa o gesto com precisão e escolhe o destino errado", () => {
    expect(classificarErro({ precisoEmDestinoErrado: true })).toBe("conceitual");
  });

  it("repete o mesmo destino errado", () => {
    expect(classificarErro({ repetiuMesmoDestino: true })).toBe("conceitual");
  });

  it("ignora alvos vazios disponíveis", () => {
    expect(classificarErro({ ignorouAlvosVazios: true })).toBe("conceitual");
  });

  it("gesto longo e preciso em destino errado continua conceitual", () => {
    expect(classificarErro({
      duracaoMs: 900,
      foraDeAlvoValido: false,
      precisoEmDestinoErrado: true,
    })).toBe("conceitual");
  });
});

describe("regra de ouro: na dúvida, motor", () => {
  it("evento sem nenhuma assinatura observada cai em motor", () => {
    expect(classificarErro({})).toBe("motor");
    expect(classificarErro()).toBe("motor");
  });

  it("evento com dados parciais de distância não é promovido a conceitual", () => {
    // Sem o raio de snap não dá para medir a mira; a dúvida resolve pró-criança.
    expect(classificarErro({ distanciaDoAlvoCorreto: 300 })).toBe("motor");
    expect(classificarErro({ raioDeSnap: 40 })).toBe("motor");
  });

  it("assinatura motora vence assinatura conceitual no mesmo evento", () => {
    // O caso ambíguo real: repetiu o destino errado, mas corrigiu-se sozinha.
    const ambiguo: EventoManipulacao = { repetiuMesmoDestino: true, corrigiuSozinha: true };
    expect(classificarErro(ambiguo)).toBe("motor");

    // E o caso da mira boa com gesto preciso: soltou a 1 px do alvo certo.
    expect(classificarErro({
      precisoEmDestinoErrado: true,
      distanciaDoAlvoCorreto: 1,
      raioDeSnap: 40,
    })).toBe("motor");
  });

  it("gesto abortado prevalece mesmo sobre repetição do destino errado", () => {
    expect(classificarErro({ duracaoMs: 40, repetiuMesmoDestino: true })).toBe("motor");
  });
});

describe("portão do Radar", () => {
  it("erro motor não alimenta o Radar", () => {
    expect(podeGerarDiagnostico({ foraDeAlvoValido: true })).toBe(false);
    expect(podeGerarDiagnostico({ corrigiuSozinha: true })).toBe(false);
    expect(podeGerarDiagnostico({ duracaoMs: 10 })).toBe(false);
  });

  it("erro conceitual alimenta o Radar", () => {
    expect(podeGerarDiagnostico({ precisoEmDestinoErrado: true })).toBe(true);
  });

  it("resposta que não é manipulação passa direto", () => {
    // Escolher alternativa não envolve gesto: o filtro não tem o que filtrar.
    expect(podeGerarDiagnostico(undefined)).toBe(true);
  });

  it("evento de manipulação vazio é barrado, e não liberado por omissão", () => {
    // Diferença que importa: `undefined` é ausência de gesto; `{}` é gesto sem
    // assinatura lida. O segundo cai na regra de ouro.
    expect(podeGerarDiagnostico({})).toBe(false);
  });
});

describe("constantes vêm do cânone, não de gosto pessoal", () => {
  it("mantém os números literais do §8.3-bis", () => {
    expect(ARRASTO_ABORTADO_MS).toBe(200);
    expect(FOLGA_DE_SNAP).toBe(1.5);
  });
});
