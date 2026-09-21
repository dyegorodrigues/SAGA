/**
 * Confere o pacote de vozes OUVINDO.
 *
 * ## Por que existe
 *
 * Ninguém aqui consegue escutar os mil e tantos arquivos. E "o arquivo tem
 * bytes" não prova nada: um clipe pode ter a duração certa, o volume certo, e
 * dizer "satu" onde devia dizer "sete". Foi exatamente o que aconteceu — o
 * espeak-ng escreve o /i/ final átono como `y`, e o Kokoro lia com som de
 * inglês.
 *
 * Então a conferência é por reconhecimento de fala: transcreve o áudio gerado
 * e compara com o texto que o gerou. Não é perfeito (o Whisper escreve "13"
 * onde ouviu "treze", e escreve "Novi" onde a pronúncia carioca está certa),
 * mas é medição de verdade, e foi ela que encontrou as três correções
 * fonéticas que o gerador aplica hoje.
 *
 * ## Como rodar
 *
 *     npm i --no-save @huggingface/transformers
 *     npx tsx scripts/conferir-vozes.ts            # amostra de 120
 *     AMOSTRA=0 npx tsx scripts/conferir-vozes.ts  # o pacote inteiro (lento)
 *
 * Devolve a taxa de acerto e a lista do que não bateu, para leitura humana.
 * Não é portão de CI: baixar um modelo de ASR em toda execução de teste seria
 * absurdo. É o recibo de quem regrava o pacote.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chaveDaFala, textoFalado } from "../src/audio/chaveDaFala";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
const VOZES = resolve(RAIZ, "public/vozes");

/** Números por extenso e em algarismo são a mesma fala; o Whisper escolhe um. */
const NUMEROS: Record<string, string> = {
  zero: "0", um: "1", uma: "1", dois: "2", duas: "2", "três": "3", quatro: "4", cinco: "5",
  seis: "6", sete: "7", oito: "8", nove: "9", dez: "10", onze: "11", doze: "12", treze: "13",
  catorze: "14", quatorze: "14", quinze: "15", dezesseis: "16", dezessete: "17", dezoito: "18",
  dezenove: "19", vinte: "20", trinta: "30", quarenta: "40", cinquenta: "50", sessenta: "60",
  setenta: "70", oitenta: "80", noventa: "90", cem: "100", cento: "100",
};

/**
 * Símbolos que a voz lê por extenso e o Whisper escreve de volta como símbolo,
 * ou o contrário. Não são divergência de áudio: são convenção de escrita.
 */
const SIMBOLOS: [RegExp, string][] = [
  [/÷/g, " dividido por "],
  [/×/g, " vezes "],
  [/−|–/g, " menos "],
  [/\+/g, " mais "],
  [/=/g, " igual a "],
  [/%/g, " por cento "],
];

function comparavel(t: string): string {
  let s = t.toLowerCase();
  for (const [de, para] of SIMBOLOS) s = s.replace(de, para);
  return s
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/).filter(Boolean)
    .map(p => NUMEROS[p] ?? p)
    .join(" ");
}

/**
 * Uma fala de uma palavra só.
 *
 * O reconhecimento de fala erra MUITO nelas — sem contexto, "nove" volta
 * "Novi", "seis" volta "Sais", "oito" volta qualquer coisa. Medido: a MESMA
 * palavra dentro de "É oito." volta certa, e "É três." também. Ou seja, o
 * áudio da palavra está bom e quem falhou foi o ouvinte. Contá-las como
 * divergência afundaria a taxa por defeito do instrumento, então ficam de
 * fora da conta e são relatadas à parte.
 *
 * As que erram mesmo com apoio de frase são os monossílabos nasais — "um",
 * "cem" —, limite conhecido de um modelo de 82 milhões de parâmetros. Está
 * anotado no checkpoint, não escondido aqui.
 */
const umaPalavraSo = (t: string) => t.trim().split(/\s+/).length <= 2 && t.length <= 12;

function lerM4a(caminho: string): Float32Array {
  const dir = mkdtempSync(join(tmpdir(), "voz-"));
  const wav = join(dir, "a.wav");
  try {
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", caminho, "-f", "f32le", "-acodec", "pcm_f32le", "-ac", "1", "-ar", "16000", wav]);
    const b = readFileSync(wav);
    const a = new Float32Array(b.length / 4);
    for (let i = 0; i < a.length; i += 1) a[i] = b.readFloatLE(i * 4);
    return a;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

async function main() {
  // O pacote não declara `module`, e o `main` aponta para a fonte; o build de
  // Node é o `.cjs`. Importar pelo nome só funcionaria se ele estivesse em
  // `node_modules` daqui, e ele é deliberadamente instalado fora (ver acima).
  const dirModulos = process.env.TRANSFORMERS_DIR ?? resolve(RAIZ, "node_modules");
  const { pipeline } = await import(resolve(dirModulos, "@huggingface/transformers/dist/transformers.node.cjs"));

  const corpus: string[] = JSON.parse(readFileSync(resolve(RAIZ, "src/audio/corpus-da-voz.json"), "utf8"));
  const amostra = Number(process.env.AMOSTRA ?? 120);
  // Amostra espalhada pelo corpus inteiro, não as primeiras N (que ficariam
  // todas na mesma letra do alfabeto e na mesma ficha).
  const passo = amostra > 0 ? Math.max(1, Math.floor(corpus.length / amostra)) : 1;
  const alvos = corpus.filter((_, i) => i % passo === 0);

  const asr = await pipeline("automatic-speech-recognition", "onnx-community/whisper-small", { dtype: "q8" });

  let batem = 0;
  let ouvidos = 0;
  let curtas = 0;
  const divergem: string[] = [];
  for (const texto of alvos) {
    const arquivo = resolve(VOZES, `${chaveDaFala(texto)}.m4a`);
    if (!existsSync(arquivo)) { divergem.push(`SEM ARQUIVO  ${JSON.stringify(texto)}`); continue; }
    const falado = textoFalado(texto);
    if (umaPalavraSo(falado)) { curtas += 1; continue; }
    const r = await asr(lerM4a(arquivo), { language: "portuguese", task: "transcribe" });
    const ouvido = String(r.text ?? "").trim();
    ouvidos += 1;
    if (comparavel(ouvido) === comparavel(falado)) batem += 1;
    else divergem.push(`  dito:   ${JSON.stringify(falado)}\n  ouvido: ${JSON.stringify(ouvido)}`);
  }

  console.log(divergem.join("\n"));
  console.log(`\n${batem}/${ouvidos} frases transcrevem de volta idênticas (${((batem / Math.max(1, ouvidos)) * 100).toFixed(1)}%)`);
  console.log(`${curtas} falas de uma palavra ficaram de fora da conta — ver o comentário de \`umaPalavraSo\`.`);
}

main().catch(e => { console.error(e); process.exit(1); });
