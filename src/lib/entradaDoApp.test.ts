import { describe, expect, it } from "vitest";
import { mostrandoCarregamento, precisaDeEstado, telaDeEntrada, modoVisitante } from "./entradaDoApp";

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

describe("modoVisitante — a escolha de quem entrou sem conta sobrevive ao boot", () => {
  it("com sessão, quem decide é a sessão", () => {
    expect(modoVisitante({ anonimo: true, escolhaLocal: false, e2e: false })).toBe(true);
    expect(modoVisitante({ anonimo: false, escolhaLocal: true, e2e: false })).toBe(false);
  });

  it("sem sessão, a escolha gravada no aparelho manda", () => {
    // Este é o caso da criança que tocou em "Começar sem Conta" e voltou no dia
    // seguinte. Sem esta linha ela cai no login e perde o caminho de casa.
    expect(modoVisitante({ anonimo: null, escolhaLocal: true, e2e: false })).toBe(true);
  });

  it("sem sessão e sem escolha gravada, é login", () => {
    // Depois de sair, `logoutUser()` apaga a marca — e o app precisa voltar a
    // pedir identidade. Sem esta metade, bastaria ter sido visitante uma vez
    // para nunca mais conseguir chegar na tela de login.
    expect(modoVisitante({ anonimo: null, escolhaLocal: false, e2e: false })).toBe(false);
  });

  it("o gancho de teste não depende de gravação nenhuma", () => {
    expect(modoVisitante({ anonimo: null, escolhaLocal: false, e2e: true })).toBe(true);
  });
});
