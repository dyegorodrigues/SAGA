/**
 * Esta fala, no pacote, diz o que devia dizer? — clipe por clipe, pelo nome.
 *
 *     node scripts/conferir-falas.mjs "o círculo" "Comece pela moeda."
 *
 * ## Por que existe, ao lado do `conferir-vozes.ts`
 *
 * O `conferir-vozes.ts` AMOSTRA o corpus — espalha N clipes pelas 1890 falas e
 * dá uma taxa. É a régua certa para "o pacote inteiro está bom?" e a errada
 * para "a fala que eu acabei de gerar está boa?": a chance de a amostra cair
 * justamente nela é ínfima, e foi assim que eu gerei áudio sem conferir mais
 * de uma vez.
 *
 * Aqui se pede pelo texto. Ele acha o clipe pelo mesmo `chaveDaFala` do app,
 * transcreve com o Whisper e compara.
 *
 * ## ⚠️ O reconhecedor erra, e precisa de controle
 *
 * Medido: `"Você colocou uma. Eu pedi cinco."` volta como `"Você colocou uma
 * EUP-G5."` — e o clipe está bom. A prova é o CONTROLE: os clipes irmãos que
 * estão no pacote desde o começo (`"Você colocou um. Eu pedi cinco."`) voltam
 * errados do mesmo jeito (`"um LPG 5"`). O "Eu pedi" seguido de número vira
 * sigla no ouvido do Whisper, sempre.
 *
 * Então **divergência aqui não é veredito**: antes de regravar, peça também um
 * clipe irmão antigo e veja se ele diverge igual. Fala de uma ou duas palavras
 * diverge por nada (`"o círculo"` volta `"ou círculo"`) — é por isso que o
 * `conferir-vozes.ts` pula as de uma palavra.
 *
 * Precisa do `@huggingface/transformers` (vem com o `kokoro-js`, que o
 * `npm run vozes` usa e não está nas dependências do app).
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
const exigir = createRequire(import.meta.url);
const { pipeline } = exigir(resolve("node_modules/@huggingface/transformers/dist/transformers.node.cjs"));
function tf(t) { return t.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu, "").replace(/\s+/g, " ").trim(); }
function ch(t) { const l = tf(t); let a = 0x811c9dc5, b = 0x01000193; for (let i = 0; i < l.length; i++) { const c = l.charCodeAt(i); a = Math.imul(a ^ c, 0x01000193) >>> 0; b = Math.imul(b ^ (c + i), 0x85ebca6b) >>> 0; } return a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0"); }
function lerClipe(arq) {
  const wav = execFileSync("ffmpeg", ["-v", "quiet", "-i", arq, "-f", "f32le", "-ac", "1", "-ar", "16000", "pipe:1"], { maxBuffer: 1 << 28 });
  return new Float32Array(wav.buffer, wav.byteOffset, wav.byteLength / 4);
}
const alvos = process.argv.slice(2);
const asr = await pipeline("automatic-speech-recognition", "onnx-community/whisper-small", { dtype: "q8" });
for (const t of alvos) {
  const arq = resolve("public/vozes", `${ch(t)}.mp3`);
  if (!existsSync(arq)) { console.log(`SEM ARQUIVO  ${t}`); continue; }
  const r = await asr(lerClipe(arq), { language: "portuguese", task: "transcribe" });
  const ouvido = String(r.text ?? "").trim();
  const bate = ouvido.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, "").trim() === tf(t).toLowerCase().replace(/[^\p{L}\p{N} ]/gu, "").trim();
  console.log(`${bate ? "bate  " : "DIVERGE"}  escrito: ${JSON.stringify(t)}  ouvido: ${JSON.stringify(ouvido)}`);
}
