// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Uma voz de cada vez.
 *
 * ## O que o pai ouve
 *
 * > *"As vozes estão uma bugando em cima da outra ainda."*
 *
 * "Ainda" porque eu já tinha dito três vezes que estava consertado. As três
 * vezes eu reforcei o cancelamento na ENTRADA do `speak`, e as três vezes
 * voltou — porque a sobreposição não nasce na entrada.
 *
 * ## Onde nasce
 *
 * Quase toda narração do app tem a forma `enunciado ... como faz`, e as duas
 * metades vão por vias diferentes: o enunciado tem número, varia com o
 * sorteio, não está no pacote de vozes e cai no sintetizador do aparelho; o
 * "como faz" é fixo, está no pacote, e toca como arquivo.
 *
 * A emenda entre as duas é o `onend` do `speechSynthesis` — que no Chrome
 * chega antes de o sintetizador calar. O arquivo entra com a voz ainda
 * falando, e cada via só desligava a si mesma.
 *
 * Daí a regra que estes testes travam: **antes de abrir a boca, cada via cala
 * a outra**. É mecânica, não depende de evento chegar na hora.
 *
 * ## E a hipótese que eu medi e descartei
 *
 * Antes disto eu tinha concluído que o app pedia duas falas no mesmo tique, e
 * quase atrasei TODA fala do app numa janela de 60 ms para coalescer os
 * pedidos. Medindo: 29 pedidos de fala em cinco competências, zero no mesmo
 * tique — e o 1 ms que me convenceu era artefato da sonda (o Chromium deste
 * ambiente não tem voz nenhuma e falha em 1 ms). O último teste daqui existe
 * para essa conclusão errada não voltar: a fala sai no MESMO tique.
 *
 * ## O que a mutação disse
 *
 * Cada asserção daqui mata a mutação da linha que ela protege — menos uma, e
 * vale dizer qual: "parar o arquivo antes de uma voz nova" é garantido em DOIS
 * lugares (na entrada do `speak` e dentro do `vozDoAparelho`), e tirando só um
 * deles o teste continua verde porque o outro cobre. Tirando os dois, fica
 * vermelho. A redundância é de propósito — a regra é "cada via cala a outra",
 * e meia regra verdadeira foi o que deixou este defeito voltar três vezes —
 * mas quem mexer aqui tem de saber que o teste prova a REGRA, não a linha.
 */

type Evento = { tipo: "sintetizador" | "cancelar" | "arquivo" | "pausa"; texto?: string };
const eventos: Evento[] = [];
let ultimaUtterance: { onend: (() => void) | null; onerror: (() => void) | null } | null = null;
const arquivosCriados: { src: string; pausado: boolean }[] = [];

/** jsdom não toca áudio: um dublê que só registra o que foi pedido. */
class AudioDublê {
  src: string;
  playbackRate = 1;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  private registro: { src: string; pausado: boolean };
  constructor(src: string) {
    this.src = src;
    this.registro = { src, pausado: false };
    arquivosCriados.push(this.registro);
    eventos.push({ tipo: "arquivo", texto: src });
  }
  play() { return Promise.resolve(); }
  pause() { this.registro.pausado = true; eventos.push({ tipo: "pausa", texto: this.src }); }
}

/** Fim da fala do aparelho, como o navegador avisa. */
const fimDaFalaDoAparelho = () => ultimaUtterance?.onend?.();
const erroNaFalaDoAparelho = () => ultimaUtterance?.onerror?.();

beforeEach(() => {
  eventos.length = 0;
  arquivosCriados.length = 0;
  ultimaUtterance = null;
  vi.resetModules();
  /*
   * Metade da narração no pacote, metade fora — que é a situação real de todo
   * `enunciado ... como faz`, e a única em que a emenda entre as duas vias
   * existe. Mock que põe tudo numa via só não consegue ver este defeito, e foi
   * por isso que ele sobreviveu a três consertos.
   */
  vi.doMock("../audio/vozNativa", () => ({
    caminhoDaVoz: (t: string) => `/vozes/${t.slice(0, 12)}.mp3`,
    carregarVozes: () => Promise.resolve(),
    temVozNativa: (t: string) => t.startsWith("Comece"),
    vozesCarregadas: () => 1,
  }));
  (globalThis as unknown as { Audio: unknown }).Audio = AudioDublê;
  (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
    speak: (u: { text: string }) => { eventos.push({ tipo: "sintetizador", texto: u.text }); },
    cancel: () => { eventos.push({ tipo: "cancelar" }); },
    getVoices: () => [],
  };
  (window as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance =
    class {
      text: string; lang = ""; rate = 1; pitch = 1;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(t: string) { this.text = t; ultimaUtterance = this as never; }
    };
});

afterEach(() => { vi.useRealTimers(); vi.doUnmock("../audio/vozNativa"); });

const NARRACAO = "Qual moeda vale 5 centavos? ... Comece pela moeda de maior valor.";

describe("uma voz de cada vez", () => {
  it("⚠️ o arquivo cala o sintetizador na emenda da narração", async () => {
    const { AudioPlayer } = await import("./AudioPlayer");

    AudioPlayer.speak(NARRACAO);
    expect(eventos.filter(e => e.tipo === "sintetizador").map(e => e.texto),
      "o enunciado vai pelo aparelho, que é quem tem o número")
      .toEqual(["Qual moeda vale 5 centavos?"]);

    // O Chrome avisa que terminou — e ainda está falando.
    const antes = eventos.length;
    fimDaFalaDoAparelho();

    const depois = eventos.slice(antes);
    const arquivo = depois.findIndex(e => e.tipo === "arquivo");
    expect(arquivo, "a segunda metade entra pelo pacote").toBeGreaterThanOrEqual(0);
    expect(depois.some(e => e.tipo === "cancelar"),
      "e cala o sintetizador ao entrar: sem isto são duas vozes juntas").toBe(true);
  });

  it("⚠️ a narração não pula pedaço quando o fim é avisado duas vezes", async () => {
    const { AudioPlayer } = await import("./AudioPlayer");

    AudioPlayer.speak("Qual moeda vale 5 centavos? ... Comece pela moeda. ... Comece agora.");
    fimDaFalaDoAparelho();
    erroNaFalaDoAparelho();

    expect(arquivosCriados.length,
      "um aviso de fim = um pedaço adiante; dois avisos pulavam o 'como faz'").toBe(1);
  });

  it("fala nova para o arquivo que estava tocando", async () => {
    const { AudioPlayer } = await import("./AudioPlayer");

    AudioPlayer.speak("Comece pela moeda de maior valor.");
    expect(arquivosCriados).toHaveLength(1);

    AudioPlayer.speak("Qual moeda vale 5 centavos?");
    expect(arquivosCriados[0].pausado, "arquivo em andamento é parado antes da voz nova").toBe(true);
  });

  it("`stop` cala as duas vias", async () => {
    const { AudioPlayer } = await import("./AudioPlayer");

    AudioPlayer.speak("Comece pela moeda de maior valor.");
    AudioPlayer.stop();

    expect(arquivosCriados[0].pausado).toBe(true);
    expect(eventos.some(e => e.tipo === "cancelar")).toBe(true);
  });

  it("⚠️ a fala sai no MESMO tique em que foi pedida", async () => {
    vi.useFakeTimers();
    const { AudioPlayer } = await import("./AudioPlayer");

    AudioPlayer.speak("Qual moeda vale 5 centavos?");

    /*
     * Sem avançar relógio nenhum. Eu quase coalesci todo pedido de fala numa
     * janela de 60 ms para consertar uma sobreposição que a medição mostrou
     * não existir; a janela atrasaria toda narração e, no iOS, o som sai só
     * dentro do gesto do toque — adiada por timer, não sai som.
     */
    expect(eventos.filter(e => e.tipo === "sintetizador"), "nada de atrasar a voz por timer")
      .toHaveLength(1);
  });
});
