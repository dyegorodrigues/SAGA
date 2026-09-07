/**
 * `node scripts/gerar-arquivo-unico.mjs` — o SAGA inteiro num `.html` só.
 *
 * ## Por que existe
 *
 * Para chegar num tablet, o app normalmente precisa de um servidor: alguém
 * sobe a pasta `dist/` num lugar e serve os arquivos. Nem sempre há esse
 * lugar, e nem sempre quem quer mostrar o app sabe montá-lo — foi exatamente
 * o que travou a primeira tentativa de publicação, esperando um clique numa
 * tela de configuração.
 *
 * Um arquivo único não espera nada. Abre com dois toques, vai por mensagem,
 * roda sem internet, e serve para publicar em qualquer lugar que aceite uma
 * página. Também é a forma mais honesta de mostrar o app a alguém: o que a
 * pessoa abre é exatamente o que foi construído, sem intermediário.
 *
 * ## O que ele costura, e por quê
 *
 * - **O JavaScript**, num pedaço só (por isso o `SAGA_ARQUIVO_UNICO`: pedaços
 *   separados se importam por caminho relativo, e caminho relativo não existe
 *   dentro de um arquivo).
 * - **O CSS**, com as quatro fontes viradas `data:` — sem isso o app cai na
 *   fonte do sistema e perde metade da cara.
 * - **A arte dos ícones**, pelo objeto `__SAGA_ARTE_EMBUTIDA__` que o
 *   `Icone.tsx` consulta antes de pedir arquivo.
 *
 * ## O que ele NÃO resolve
 *
 * Firebase. Sem servidor não há domínio autorizado, então o arquivo único é
 * sempre o caminho do VISITANTE: o progresso fica no navegador que abriu, e
 * não sobe para nuvem nenhuma. É o mesmo caminho que o `npm run passeio`
 * percorre inteiro a cada publicação, então é caminho testado — mas é bom
 * saber o que se está mostrando.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { resolve, extname } from "node:path";

const RAIZ = resolve(import.meta.dirname, "..");
const DIST = resolve(RAIZ, "dist");
const SAIDA = process.argv.find(a => !a.startsWith("--") && a.endsWith(".html")) || resolve(RAIZ, "dist", "saga-arquivo-unico.html");

/**
 * `--fragmento` emite a página SEM `<!doctype>`, `<html>`, `<head>` e `<body>`.
 *
 * Alguns lugares que hospedam uma página — o publicador de artefatos entre
 * eles — montam o esqueleto do documento por fora e esperam receber só o
 * conteúdo. Entregar um documento inteiro ali aninha `<html>` dentro de
 * `<html>`: o navegador até tolera, mas é sorte, não contrato. Sem a bandeira,
 * a saída é um documento completo, que é o que serve para abrir no aparelho.
 */
const FRAGMENTO = process.argv.includes("--fragmento");

const ler = (...p) => readFileSync(resolve(...p), "utf8");
const lerBin = (...p) => readFileSync(resolve(...p));

/**
 * Duas coisas que o bundle carrega e que quebram dentro de um `<script>` no
 * HTML.
 *
 * 1. `</script` dentro de uma string fecharia a tag antes da hora.
 * 2. `\uFFFD` — o caractere "não sei ler isto" — aparece LITERAL dentro de
 *    bibliotecas que decodificam texto, como valor de substituição. É
 *    JavaScript válido, mas publicadores de página recusam o byte cru (não
 *    dá para distinguir de arquivo corrompido). Escrito como escape `\uFFFD`,
 *    o JavaScript produz exatamente o mesmo caractere. Fora de string ele
 *    nem seria código válido, então trocar em todo lugar é seguro.
 */
const escaparScript = (js) =>
  js.replace(/<\/script/gi, "<\\/script").replace(/\uFFFD/g, "\\uFFFD");

console.log("· construindo em pedaço único");
execFileSync("npx", ["vite", "build"], {
  cwd: RAIZ,
  stdio: ["ignore", "ignore", "inherit"],
  env: { ...process.env, SAGA_ARQUIVO_UNICO: "1", SAGA_BASE: "./" },
});

const html = ler(DIST, "index.html");

// ---------------------------------------------------------------- o CSS
const cssArquivo = html.match(/href="([^"]*assets\/[^"]*\.css)"/)?.[1];
if (!cssArquivo) throw new Error("não achei o css no index.html construído");
let css = ler(DIST, cssArquivo.replace(/^\.?\//, ""));

const MIME = { ".woff2": "font/woff2", ".woff": "font/woff", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
let fontes = 0;
// O empacotador reescreve `/fonts/x.woff2` como `../fonts/x.woff2` (relativo à
// pasta `assets/`), então o padrão precisa aceitar os dois jeitos.
css = css.replace(/url\(["']?(?:\.\.?\/)*(fonts\/[^"')]+)["']?\)/g, (_, caminho) => {
  const dados = lerBin(RAIZ, "public", caminho).toString("base64");
  fontes += 1;
  return `url("data:${MIME[extname(caminho)]};base64,${dados}")`;
});
console.log(`· ${fontes} fonte(s) embutida(s)`);

// -------------------------------------------------------------- a arte
const pastaIcones = resolve(RAIZ, "public", "icones");
const arte = {};
for (const nome of readdirSync(pastaIcones).filter(n => n.endsWith(".svg"))) {
  const svg = ler(pastaIcones, nome).replace(/\s+/g, " ").trim();
  arte[nome.replace(/\.svg$/, "")] = `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
console.log(`· ${Object.keys(arte).length} ícone(s) embutido(s)`);

// ------------------------------------------------------------ o script
const jsArquivo = html.match(/src="([^"]*assets\/[^"]*\.js)"/)?.[1];
if (!jsArquivo) throw new Error("não achei o javascript no index.html construído");
const js = ler(DIST, jsArquivo.replace(/^\.?\//, ""));

const restantes = [...html.matchAll(/src="[^"]*assets\/[^"]*\.js"/g)].length;
if (restantes !== 1) throw new Error(`esperava 1 pedaço de javascript e achei ${restantes} — a separação em pedaços não foi desligada`);

// -------------------------------------------------------------- costura
const cabeca = html
  .slice(0, html.indexOf("</head>"))
  .replace(/<link rel="stylesheet"[^>]*>/g, "")
  .replace(/<link rel="manifest"[^>]*>/g, "")
  .replace(/<link rel="icon"[^>]*>/g, "")
  .replace(/<link rel="apple-touch-icon"[^>]*>/g, "")
  .replace(/<script[^>]*type="module"[^>]*><\/script>/g, "");

const miolo = `<style>
/* O chão da página. Sem isto o app fica transparente e pega o fundo de quem o
   hospeda — que pode ser escuro, e o SAGA é claro por decisão. */
html, body { height: 100%; margin: 0; background: #F8FAFC; }
${css}</style>
<div id="root"></div>
<script>globalThis.__SAGA_ARTE_EMBUTIDA__ = ${JSON.stringify(arte)};</script>
<script type="module">${escaparScript(js)}</script>`;

const saida = FRAGMENTO
  ? `<title>SAGA</title>\n<meta name="color-scheme" content="light">\n${miolo}\n`
  : `${cabeca}\n${miolo}\n</body>\n</html>\n`;

writeFileSync(SAIDA, saida);
const mb = (statSync(SAIDA).size / 1024 / 1024).toFixed(2);
console.log(`\n${SAIDA}\n${mb} MB`);
