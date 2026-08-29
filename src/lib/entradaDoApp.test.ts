import { describe, expect, it } from "vitest";
import { mostrandoCarregamento, precisaDeEstado, telaDeEntrada } from "./entradaDoApp";

/**
 * A porta de entrada do app.
 *
 * O recibo vermelho que originou este arquivo foi visual: com o navegador real,
 * sem sessão do Firebase, o app ficava em "Carregando SAGA..." indefinidamente
 * e a tela de login nunca aparecia. O currículo inteiro — 90 competências, 3665
 * testes verdes — estava atrás de uma porta que não abria.
 */
describe("entrada do app", () => {
  it("sem sessão e sem visitante, a tela é o login", () => {
    expect(telaDeEntrada({ temSessao: false, visitante: false })).toBe("login");
  });

  it("visitante entra sem esperar a nuvem", () => {
    // Uma criança sem conta, sem rede e sem sessão precisa conseguir jogar.
    // Antes isso só acontecia sob `?e2e=1`: fora do teste, "Começar sem Conta"
    // acendia uma flag e não abria nada.
    expect(telaDeEntrada({ temSessao: false, visitante: true })).toBe("local");
  });

  it("com sessão, o estado vem pela reconciliação de saves", () => {
    expect(telaDeEntrada({ temSessao: true, visitante: false })).toBe("sessao");
    expect(telaDeEntrada({ temSessao: true, visitante: true })).toBe("sessao");
  });

  it("o login é desenhável sem estado; as outras telas não", () => {
    expect(precisaDeEstado("login")).toBe(false);
    expect(precisaDeEstado("loading")).toBe(false);
    for (const tela of ["setup", "pick", "home", "game", "album", "gallery", "parent", "admin"] as const) {
      expect(precisaDeEstado(tela), `${tela} depende de estado`).toBe(true);
    }
  });

  it("carregando só enquanto não se sabe, nunca por cima do login", () => {
    expect(mostrandoCarregamento("loading", false)).toBe(true);
    expect(mostrandoCarregamento("loading", true)).toBe(true);
    // O defeito, escrito como teste: login sem estado NÃO é carregamento.
    expect(mostrandoCarregamento("login", false)).toBe(false);
    expect(mostrandoCarregamento("pick", false)).toBe(true);
    expect(mostrandoCarregamento("pick", true)).toBe(false);
  });

  it("tela desconhecida cai no lado seguro: exige estado", () => {
    // `App` guarda o nome da tela como string solta. Uma tela nova nascer
    // podendo aparecer sem estado é exatamente o defeito de origem.
    expect(precisaDeEstado("tela-que-ainda-nao-existe")).toBe(true);
    expect(mostrandoCarregamento("tela-que-ainda-nao-existe", false)).toBe(true);
  });
});
