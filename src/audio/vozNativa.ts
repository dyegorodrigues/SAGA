/**
 * A voz que vai junto com o app.
 *
 * ## O problema
 *
 * O SAGA falava só pelo `speechSynthesis` do aparelho. Isso significa:
 *
 * - num celular sem voz pt-BR instalada, **não sai som nenhum**;
 * - o app não tem como saber que não saiu — `speechSynthesis.speak` não
 *   reclama;
 * - e quem paga é a criança de quatro a sete anos, que NÃO LÊ. Para ela o
 *   enunciado só existe em voz. Sem voz, o exercício não é difícil: é
 *   impossível, e o app anota como erro de matemática.
 *
 * ## A saída
 *
 * O áudio é gerado antes (`npm run vozes`, Kokoro-82M em pt-BR), versionado no
 * repositório e tocado como arquivo. Nada de rede, nada de chave de API, nada
 * de depender do que o aparelho tem instalado.
 *
 * ## O que acontece quando a fala não está no pacote
 *
 * Cai no `speechSynthesis`, como antes. As falas com número variam com o
 * sorteio e não fecham em conjunto finito; as FIXAS — instrução, elogio, erro
 * suave, aula — estão todas no pacote, e são as que toda criança ouve em toda
 * missão. Ver `corpusDaVoz.test.tsx`.
 */
import { chaveDaFala, textoFalado } from "./chaveDaFala";

/** Onde o pacote é servido. Respeita o `base` do Vite (o app vive num subcaminho). */
export function pastaDasVozes(): string {
  const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/";
  return `${base.endsWith("/") ? base : `${base}/`}vozes/`;
}

/** O arquivo desta fala, exista ele ou não. */
export function caminhoDaVoz(texto: string): string {
  return `${pastaDasVozes()}${chaveDaFala(texto)}.m4a`;
}

let indice: Set<string> | null = null;
let carga: Promise<Set<string>> | null = null;

/**
 * Carrega o índice do pacote — uma vez só, e sem nunca rejeitar.
 *
 * Se o pacote não estiver lá (build de arquivo único, deploy sem os áudios),
 * o índice fica vazio e tudo cai na voz do aparelho. Falhar aqui não pode
 * derrubar a fala: o pior caso do pacote ausente é o comportamento antigo.
 */
export function carregarVozes(): Promise<Set<string>> {
  if (carga) return carga;
  carga = (async () => {
    try {
      const r = await fetch(`${pastaDasVozes()}indice.json`);
      if (!r.ok) throw new Error(String(r.status));
      const lista: unknown = await r.json();
      indice = new Set(Array.isArray(lista) ? lista.map(String) : []);
    } catch {
      indice = new Set();
    }
    return indice;
  })();
  return carga;
}

/** Já dá para saber se esta fala tem áudio gravado? */
export function temVozNativa(texto: string): boolean {
  const limpo = textoFalado(texto);
  if (!limpo || !indice) return false;
  return indice.has(chaveDaFala(limpo));
}

/** Quantas falas o pacote traz. Zero significa pacote ausente ou ainda não carregado. */
export function vozesCarregadas(): number {
  return indice?.size ?? 0;
}

/** Só para teste: esquece o que já foi carregado. */
export function esquecerVozes(): void {
  indice = null;
  carga = null;
}
