/**
 * Gera o pacote de vozes nativo do SAGA.
 *
 * ## Por que existe
 *
 * O app falava só pelo `speechSynthesis` do aparelho. Em celular sem voz pt-BR
 * instalada não sai som — e o app não tem como perceber. Para a criança de
 * quatro a sete anos, que não lê, isso não é "sem áudio": é o exercício
 * inteiro perdido, porque o enunciado só existia em voz.
 *
 * Então a voz vai junto: gerada aqui, versionada no repositório, tocada como
 * arquivo. Nenhuma chamada de rede, nenhuma chave de API, nenhuma dependência
 * do que o aparelho da criança tem instalado.
 *
 * ## Como
 *
 * - **Kokoro-82M** (Apache-2.0, 82 milhões de parâmetros) gera a fala. É o
 *   modelo pequeno que roda em CPU sem GPU e sem serviço pago.
 * - **espeak-ng** com a voz `pt-br` converte texto em IPA, porque o
 *   `kokoro-js` só traz fonemizador de inglês. As correções em `CORRECOES`
 *   abaixo são medidas, não palpite: cada uma nasceu de uma frase que voltou
 *   errada na conferência por reconhecimento de fala.
 * - **pf_dora** é a voz feminina pt-BR do Kokoro. O pacote npm já traz o
 *   tensor dela; só a lista de vozes do `kokoro-js` é que não a anuncia, e por
 *   isso este script chama `generate_from_ids` em vez de `generate`.
 * - **ffmpeg** encolhe para AAC mono, que toca em todo navegador — inclusive
 *   Safari antigo, onde Opus não toca.
 *
 * ## Como rodar
 *
 * Precisa de três coisas que NÃO são dependências do app (ninguém instala
 * 300 MB de runtime de IA para rodar os testes):
 *
 *     apt-get install -y espeak-ng ffmpeg
 *     npm i --no-save kokoro-js
 *     npx tsx scripts/gerar-vozes.ts
 *
 * O pacote gerado entra no repositório; quem não vai regravar nada não precisa
 * de nada disso.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chaveDaFala, textoFalado } from "../src/audio/chaveDaFala";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
const CORPUS = resolve(RAIZ, "src/audio/corpus-da-voz.json");
const DESTINO = resolve(RAIZ, "public/vozes");
const INDICE = resolve(DESTINO, "indice.json");
const TEMP = resolve(RAIZ, ".vozes-temp");

/** A voz. Feminina, pt-BR, do próprio Kokoro. */
const VOZ = "pf_dora";
/**
 * Um pouco mais devagar que o normal.
 *
 * A Jornada começa aos quatro anos. A voz do aparelho corria a 1,05 e as
 * falas de contagem ("um... dois... três") saíam atropeladas.
 */
const VELOCIDADE = 0.95;

/**
 * O que o espeak-ng 1.51 escreve diferente do que o Kokoro entende.
 *
 * Nada aqui é estético. Cada linha corrige uma palavra que voltou errada na
 * conferência por reconhecimento de fala:
 *
 * - `y`: o espeak usa "y" para o /i/ final átono. O Kokoro lê como o "y" do
 *   inglês e "sete" virava "satu".
 * - `æ`: idem para o /a/ final átono — "casa" saía com vogal de inglês.
 * Houve uma terceira, `lj` → `ʎ`, e ela foi RETIRADA — fica registrada porque
 * o erro vale mais que a correção. Ela nasceu de uma amostra só: "olha"
 * voltava "óleo". Medida depois em oito frases com "lh", perdeu em duas
 * ("Olhe a linha" virou "Pode alinhar"; "pilha" virou "pídia") e não ganhou em
 * nenhuma. O "óleo" da amostra original era do `æ` final, não do `lj`: com
 * `æ` → `ɐ` no lugar, o `lj` do espeak já sai certo.
 *
 * A lição, que é a regra da casa: uma amostra não é medição.
 */
const CORRECOES: [RegExp, string][] = [
  [/y/g, "i"],
  [/æ/g, "ɐ"],
];

function fonemizar(texto: string): string {
  const bruto = execFileSync("espeak-ng", ["-v", "pt-br", "-q", "--ipa", "--", texto], { encoding: "utf8" });
  let ipa = bruto.split("\n").map(l => l.trim()).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  for (const [de, para] of CORRECOES) ipa = ipa.replace(de, para);
  return ipa;
}

async function main() {
  const dirKokoro = process.env.KOKORO_DIR ?? resolve(RAIZ, "node_modules");
  const { KokoroTTS } = await import(resolve(dirKokoro, "kokoro-js/dist/kokoro.js"));

  const corpus: string[] = JSON.parse(readFileSync(CORPUS, "utf8"));
  mkdirSync(DESTINO, { recursive: true });
  mkdirSync(TEMP, { recursive: true });

  const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "q8", device: "cpu" });

  const indice: string[] = existsSync(INDICE) ? JSON.parse(readFileSync(INDICE, "utf8")) : [];
  const jaTem = new Set(indice);
  const colisoes = new Map<string, string>();
  let gravadas = 0;
  let puladas = 0;

  for (const [i, bruto] of corpus.entries()) {
    const texto = textoFalado(bruto);
    if (!texto) continue;
    const chave = chaveDaFala(texto);

    const anterior = colisoes.get(chave);
    if (anterior !== undefined && anterior !== texto) {
      throw new Error(`Colisão de chave ${chave}:\n  ${JSON.stringify(anterior)}\n  ${JSON.stringify(texto)}`);
    }
    colisoes.set(chave, texto);

    const destino = resolve(DESTINO, `${chave}.m4a`);
    if (jaTem.has(chave) && existsSync(destino)) { puladas += 1; continue; }

    const ipa = fonemizar(texto);
    const { input_ids } = tts.tokenizer(ipa, { truncation: true });
    const audio = await tts.generate_from_ids(input_ids, { voice: VOZ, speed: VELOCIDADE });
    const wav = resolve(TEMP, `${chave}.wav`);
    await audio.save(wav);
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-c:a", "aac", "-b:a", "24k", "-ac", "1", "-ar", "24000", destino]);
    rmSync(wav);

    jaTem.add(chave);
    gravadas += 1;
    if (gravadas % 25 === 0) {
      writeFileSync(INDICE, JSON.stringify([...jaTem].sort()) + "\n");
      console.log(`${i + 1}/${corpus.length} — ${gravadas} gravadas, ${puladas} já existiam`);
    }
  }

  writeFileSync(INDICE, JSON.stringify([...jaTem].sort()) + "\n");
  rmSync(TEMP, { recursive: true, force: true });

  const bytes = [...jaTem].reduce((soma, c) => {
    const f = resolve(DESTINO, `${c}.m4a`);
    return soma + (existsSync(f) ? statSync(f).size : 0);
  }, 0);
  console.log(`pronto: ${jaTem.size} falas, ${(bytes / 1048576).toFixed(1)} MB`);
}

main().catch(e => { console.error(e); process.exit(1); });
