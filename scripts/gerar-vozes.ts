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
 * - **ffmpeg** encolhe para MP3 mono.
 *
 * ## Por que MP3, e não AAC (que foi a primeira escolha, e estava errada)
 *
 * O pacote nasceu em AAC dentro de `.m4a`, escolhido por "toca em todo
 * navegador". Não toca: **o Chromium de código aberto é compilado sem codecs
 * proprietários** e recusa AAC. Medido no navegador, com o pacote no ar:
 *
 *     new Audio("/vozes/<clipe>.m4a").play()
 *     → NotSupportedError: Failed to load because no supported source was found
 *
 * O arquivo chegava com 206, o app pedia certo, e nada tocava. A primeira
 * sonda deu "A VOZ SAI" porque olhava o TRÁFEGO — bytes servidos — e não a
 * reprodução. Instrumento que mede a coisa errada dá verde em app mudo.
 *
 * MP3 é o único formato que nenhum navegador recusa: Chromium livre, Chrome,
 * Firefox, Safari de qualquer idade, Android, iOS. Opus rende mais por
 * kilobyte, mas o Safari só o toca a partir do 17 — e não se sabe que iPhone
 * a criança tem na mão.
 *
 * ## Por que 48 kbps, e não 24
 *
 * O pai ouviu a primeira versão e disse: "a voz tá meio robótica ainda, como
 * se fosse de um microfone vagabundo". Era a taxa. 24 kbps num sinal de 24 kHz
 * é qualidade de telefone; 48 kbps dobra o orçamento de bits para o mesmo
 * áudio de origem e tira a chiadeira metálica. O pacote passa de ~16 MB para
 * ~38 MB, que continua servindo sob demanda — a criança baixa o clipe quando
 * ele toca, nunca o pacote inteiro.
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
 *
 * ## Regravar o pacote inteiro sem esperar duas horas
 *
 * A síntese é de um clipe por vez e mil e seiscentos clipes levam horas. Uma
 * variável quebra o trabalho em processos paralelos:
 *
 *     FATIA=0/4 npx tsx scripts/gerar-vozes.ts &   # e 1/4, 2/4, 3/4
 *     npx tsx scripts/gerar-vozes.ts               # no fim, reconstrói o índice
 *
 * Cada fatia grava só os clipes que lhe cabem e **não toca no índice** — dois
 * processos escrevendo o mesmo JSON se apagariam. A passada final não gera
 * nada (tudo já existe) e escreve o índice a partir do que está em disco.
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
/** Ver o cabeçalho: MP3 é o único formato que nenhum navegador recusa. */
const EXTENSAO = "mp3";
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

  /**
   * A fatia deste processo, no formato `i/N`. Sem ela, faz tudo.
   * Quem tem fatia não escreve o índice: só grava os arquivos.
   */
  const [fatia, fatias] = (process.env.FATIA ?? "0/1").split("/").map(Number);
  const escreveIndice = fatias === 1;

  const indice: string[] = existsSync(INDICE) ? JSON.parse(readFileSync(INDICE, "utf8")) : [];
  const jaTem = new Set(indice);
  const colisoes = new Map<string, string>();
  let gravadas = 0;
  let puladas = 0;

  for (const [i, bruto] of corpus.entries()) {
    if (i % fatias !== fatia) continue;
    const texto = textoFalado(bruto);
    if (!texto) continue;
    const chave = chaveDaFala(texto);

    const anterior = colisoes.get(chave);
    if (anterior !== undefined && anterior !== texto) {
      throw new Error(`Colisão de chave ${chave}:\n  ${JSON.stringify(anterior)}\n  ${JSON.stringify(texto)}`);
    }
    colisoes.set(chave, texto);

    const destino = resolve(DESTINO, `${chave}.${EXTENSAO}`);
    if (jaTem.has(chave) && existsSync(destino)) { puladas += 1; continue; }

    const ipa = fonemizar(texto);
    const { input_ids } = tts.tokenizer(ipa, { truncation: true });
    const audio = await tts.generate_from_ids(input_ids, { voice: VOZ, speed: VELOCIDADE });
    const wav = resolve(TEMP, `${chave}.wav`);
    await audio.save(wav);
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-c:a", "libmp3lame", "-b:a", "48k", "-ac", "1", "-ar", "24000", destino]);
    rmSync(wav);

    jaTem.add(chave);
    gravadas += 1;
    if (gravadas % 25 === 0) {
      if (escreveIndice) writeFileSync(INDICE, JSON.stringify([...jaTem].sort()) + "\n");
      console.log(`${i + 1}/${corpus.length} — ${gravadas} gravadas, ${puladas} já existiam`);
    }
  }

  if (!escreveIndice) {
    console.log(`fatia ${fatia}/${fatias}: ${gravadas} gravadas, ${puladas} já existiam`);
    rmSync(TEMP, { recursive: true, force: true });
    return;
  }

  // O índice anuncia o que EXISTE em disco, e não o que este processo gravou:
  // é a única forma de as fatias paralelas convergirem num índice só.
  const emDisco = [...colisoes.keys()].filter(c => existsSync(resolve(DESTINO, `${c}.${EXTENSAO}`))).sort();
  writeFileSync(INDICE, JSON.stringify(emDisco) + "\n");
  rmSync(TEMP, { recursive: true, force: true });

  const bytes = emDisco.reduce((soma, c) => {
    const f = resolve(DESTINO, `${c}.${EXTENSAO}`);
    return soma + (existsSync(f) ? statSync(f).size : 0);
  }, 0);
  console.log(`pronto: ${emDisco.length} falas, ${(bytes / 1048576).toFixed(1)} MB`);
}

main().catch(e => { console.error(e); process.exit(1); });
