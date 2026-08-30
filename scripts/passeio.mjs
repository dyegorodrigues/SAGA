/**
 * `npm run passeio` — o app inteiro, percorrido como uma criança o percorreria.
 *
 * ## Por que este arquivo existe
 *
 * O currículo foi auditado até o osso: noventa competências, catorze gates por
 * descoberta, quase quatro mil testes. **O app, como produto, nunca foi.** Não
 * havia um só teste que abrisse a porta da frente, criasse um perfil, jogasse
 * uma missão, fechasse o app e voltasse para ver se o progresso continuava lá.
 *
 * Toda a suíte roda em jsdom, sobre componentes isolados. Isto aqui roda no
 * Chromium, sobre o build de produção, pela porta da frente. É a diferença
 * entre "as peças estão certas" e "a coisa funciona".
 *
 * ## O que ele mede, em ordem de gravidade
 *
 * 1. **O progresso sobrevive?** Uma criança joga, fecha o app e volta. Se o que
 *    ela conquistou sumiu, nada mais importa — é a única falha que destrói a
 *    confiança de vez.
 * 2. **Existe sempre um próximo passo?** Tela sem ação possível é beco.
 * 3. **Alguma coisa quebra?** Erro de página, requisição falhando, tela vazia.
 *
 * ## Como ler a saída
 *
 * `[FALHA]` é defeito. `[ATENÇÃO]` merece olho humano mas pode ser decisão de
 * projeto. `[OK]` é o que foi verificado e passou — está aí para provar que o
 * passeio realmente andou, em vez de falhar cedo e passar calado.
 */
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.SAGA_URL ?? "http://localhost:3000";
const FOTOS = process.env.SAGA_FOTOS ?? "/tmp/saga-passeio";
const CHROMIUM = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";

const falhas = [];
const atencoes = [];
const oks = [];

const falha = (t) => { falhas.push(t); console.log(`[FALHA]    ${t}`); };
const atencao = (t) => { atencoes.push(t); console.log(`[ATENÇÃO]  ${t}`); };
const ok = (t) => { oks.push(t); console.log(`[OK]       ${t}`); };
const passo = (t) => console.log(`\n— ${t}`);

/** Espera o texto da tela satisfazer uma condição, em vez de dormir um tempo fixo. */
async function esperar(page, condicao, ms = 25000) {
  const limite = Date.now() + ms;
  while (Date.now() < limite) {
    const texto = (await page.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ");
    if (condicao(texto)) return texto;
    await page.waitForTimeout(400);
  }
  return null;
}

const texto = async (page) => (await page.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ");

/** Clica um botão pelo nome acessível e espera a tela reagir. */
async function clicar(page, nome, { esperaTexto } = {}) {
  const alvo = page.getByRole("button", { name: nome }).first();
  if (!(await alvo.count())) return false;
  const antes = await texto(page);
  await alvo.click({ timeout: 15000 }).catch(() => {});
  if (esperaTexto) return Boolean(await esperar(page, (t) => esperaTexto.test(t)));
  await esperar(page, (t) => t.slice(0, 150) !== antes.slice(0, 150), 12000);
  return true;
}

async function foto(page, nome) {
  await page.screenshot({ path: `${FOTOS}/${nome}.png`, fullPage: true }).catch(() => {});
}

/** O estado que a criança conquistou, lido de onde o app realmente o guarda. */
async function estadoSalvo(page) {
  return page.evaluate(() => {
    const achado = {};
    for (const chave of Object.keys(localStorage)) {
      const valor = localStorage.getItem(chave) ?? "";
      achado[chave] = valor.length;
    }
    return achado;
  });
}

/**
 * Uma tela sem nenhuma ação possível é um beco: a criança não tem como sair.
 *
 * Conta só botões habilitados e visíveis, que é o que uma criança consegue
 * tocar. Links e campos entram porque também são saída.
 */
async function acoesDisponiveis(page) {
  return page.evaluate(() => {
    const visivel = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && s.opacity !== "0";
    };
    const alvos = [...document.querySelectorAll("button, a[href], input, [role='button']")];
    return alvos.filter((el) => visivel(el) && !el.disabled).length;
  });
}

async function main() {
  mkdirSync(FOTOS, { recursive: true });
  console.log(`SAGA — PASSEIO PELA PORTA DA FRENTE\n- alvo: ${BASE}\n- fotos: ${FOTOS}`);

  const browser = await chromium.launch({ executablePath: CHROMIUM });
  // Um único contexto do início ao fim: é assim que uma criança usa o app, e é
  // a única forma de o recarregamento testar persistência de verdade.
  const contexto = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  const page = await contexto.newPage();

  const errosDePagina = [];
  const requisicoesFalhas = [];
  page.on("pageerror", (e) => errosDePagina.push(String(e).slice(0, 200)));
  page.on("requestfailed", (r) => requisicoesFalhas.push(`${r.url().slice(0, 90)} — ${r.failure()?.errorText ?? "?"}`));
  page.on("response", (r) => { if (r.status() >= 500) requisicoesFalhas.push(`${r.status()} ${r.url().slice(0, 90)}`); });

  // ---------------------------------------------------------------- entrada
  passo("Porta da frente");
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  const login = await esperar(page, (t) => /Começar sem Conta|Entrar com Conta/i.test(t), 30000);
  if (!login) { falha("a tela de entrada não carregou em 30s"); await encerrar(browser, page); return; }
  ok("tela de entrada carrega");
  await foto(page, "01-entrada");

  passo("Entrar sem conta");
  if (!(await clicar(page, /Começar sem Conta/i, { esperaTexto: /Monte seus Perfis/i }))) {
    falha("o modo visitante não abriu a tela de perfis");
    await encerrar(browser, page); return;
  }
  ok("modo visitante abre a tela de perfis");

  // ---------------------------------------------------------------- perfil
  passo("Criar a criança");
  await clicar(page, /Criar Primeiro Perfil|Criar Perfil|Novo Perfil/i, { esperaTexto: /Configurar Perfil/i });
  const campo = page.locator('input[type="text"]').first();
  if (!(await campo.count())) { falha("o formulário de perfil não tem campo de nome"); await encerrar(browser, page); return; }
  await campo.fill("Teo");
  await clicar(page, /1º Ano EF/i);
  if (!(await clicar(page, /Começar Aventura/i, { esperaTexto: /Quem vai brincar|JOGAR/i }))) {
    falha("'Começar Aventura' não levou à seleção de criança");
    await encerrar(browser, page); return;
  }
  ok("perfil criado e o app entra na seleção de criança");
  await foto(page, "02-perfil-criado");

  passo("Entrar como a criança");
  await clicar(page, /JOGAR/i, { esperaTexto: /Sensei|Aventura|Missão|Sondagem/i });
  const casa = await texto(page);
  if (!/Oi, Teo|Teo/i.test(casa)) atencao("a tela inicial da criança não a cumprimenta pelo nome");
  ok("a criança entra na própria casa");
  await foto(page, "03-casa");

  // ------------------------------------------------------- jogar de verdade
  passo("Jogar uma missão inteira");
  const abriu = await clicar(page, /Começar Sondagem|Começar|Jogar|Missão/i, { esperaTexto: /Toque|Conte|Quantos|Qual|Dê /i });
  if (!abriu) { falha("não foi possível abrir uma missão a partir da casa da criança"); await encerrar(browser, page); return; }
  ok("a missão abre e mostra uma pergunta");
  await foto(page, "04-missao");

  let rodadas = 0;
  const enunciados = new Set();
  for (let i = 0; i < 24; i += 1) {
    const t = await texto(page);
    if (/Ver Resultado|acertos!|Parabéns|Missão concluída/i.test(t) && rodadas > 0) break;
    const acoes = await acoesDisponiveis(page);
    if (acoes === 0) { falha(`tela sem nenhuma ação possível na rodada ${rodadas + 1} — a criança fica presa`); break; }
    const enunciado = (t.match(/[A-ZÁÉÍÓÚÂÊÔÃÕÇ][^.!?]{10,80}[.!?]/) || [])[0];
    if (enunciado) enunciados.add(enunciado.trim());

    // Responde tocando no palco: é o que a criança faz. Não tenta acertar —
    // o que se mede aqui é se o percurso anda, não se o gerador está certo.
    const alvos = page.locator("button:visible");
    const n = Math.min(await alvos.count(), 12);
    for (let k = 0; k < n; k += 1) await alvos.nth(k).click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(1200);
    await clicar(page, /Avançar|Continuar|Próxim|Ver Resultado/i);
    await page.waitForTimeout(900);
    rodadas += 1;
  }
  if (rodadas >= 3) ok(`a missão avança (${rodadas} rodadas, ${enunciados.size} enunciados distintos)`);
  else falha(`a missão travou depois de ${rodadas} rodada(s)`);
  await foto(page, "05-fim-da-missao");

  // ------------------------------------------------- A PERGUNTA QUE IMPORTA
  passo("Fechar o app e voltar — a criança continua existindo?");
  // A medida certa não é "alguma chave sobreviveu": a marca de visitante
  // sobrevive sozinha e daria verde numa tela onde a criança sumiu. O que se
  // mede é a criança — o nome dela de volta na tela, depois do recarregamento.
  const antes = await estadoSalvo(page);
  await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
  await esperar(page, (t) => t.length > 40, 30000);
  const voltou = (await esperar(page, (t) => /Teo|Começar sem Conta|Nenhum perfil/i.test(t), 20000)) ?? (await texto(page));
  const depois = await estadoSalvo(page);

  if (/Começar sem Conta|Entrar com Conta/i.test(voltou)) {
    falha("depois de reabrir, o app volta para o login — a criança perde o caminho de casa");
  } else if (/Nenhum perfil criado/i.test(voltou)) {
    falha("depois de reabrir, o perfil da criança sumiu — o progresso não está sendo gravado");
  } else if (/Teo/i.test(voltou)) {
    ok("depois de reabrir, a criança continua lá, com o perfil dela");
  } else {
    atencao(`depois de reabrir, a tela não mostra nem a criança nem o login: "${voltou.slice(0, 90)}"`);
  }

  const cresceu = Object.keys(depois).some((k) => (depois[k] ?? 0) > 100);
  if (!cresceu) atencao("nenhuma chave grande no armazenamento — conferir onde o estado é gravado");
  else ok("o estado da criança está gravado no aparelho");
  await foto(page, "06-depois-do-reload");

  // ------------------------------------------------------------- as telas
  passo("Percorrer as telas que a criança e o responsável alcançam");
  const telas = [
    { nome: "Área dos Pais", botao: /Área dos Pais|Painel/i },
    { nome: "Perfil da criança", botao: /Ver Meu Perfil|Perfil/i },
    { nome: "Dojo", botao: /Dojo|Treinar/i },
    { nome: "Mapa", botao: /Mapa|Jornada/i },
  ];
  for (const tela of telas) {
    const antesTexto = await texto(page);
    const abriu2 = await clicar(page, tela.botao);
    if (!abriu2) { atencao(`não achei como chegar em "${tela.nome}" a partir daqui`); continue; }
    const acoes = await acoesDisponiveis(page);
    const agora = await texto(page);
    if (acoes === 0) falha(`"${tela.nome}" não oferece nenhuma ação — a criança fica presa`);
    else if (agora.trim().length < 20) falha(`"${tela.nome}" abriu praticamente vazia`);
    else ok(`"${tela.nome}" abre com ${acoes} ação(ões) possíveis`);
    await foto(page, `07-${tela.nome.replace(/\s+/g, "-").toLowerCase()}`);
    if (agora.slice(0, 80) !== antesTexto.slice(0, 80)) {
      await clicar(page, /Voltar|Fechar|✕|←|Sair/i);
      await page.waitForTimeout(800);
    }
  }

  // --------------------------------------------------------------- higiene
  passo("Erros técnicos durante todo o passeio");
  if (errosDePagina.length) for (const e of [...new Set(errosDePagina)].slice(0, 8)) falha(`erro de página: ${e}`);
  else ok("nenhum erro de página em todo o percurso");
  const reaisFalhas = [...new Set(requisicoesFalhas)].filter((r) => !/favicon/i.test(r));
  if (reaisFalhas.length) for (const r of reaisFalhas.slice(0, 8)) atencao(`requisição falhou: ${r}`);
  else ok("nenhuma requisição falhou");

  await encerrar(browser, page);
}

async function encerrar(browser, page) {
  await foto(page, "99-final").catch(() => {});
  await browser.close().catch(() => {});

  console.log("\n" + "─".repeat(64));
  console.log(`RESUMO — ${oks.length} verificações passaram, ${atencoes.length} atenções, ${falhas.length} falhas`);
  if (falhas.length) { console.log("\nFALHAS:"); for (const f of falhas) console.log(`  • ${f}`); }
  if (atencoes.length) { console.log("\nATENÇÕES:"); for (const a of atencoes) console.log(`  • ${a}`); }
  console.log(`\nFotos em ${FOTOS}`);

  writeFileSync(`${FOTOS}/relatorio.json`, JSON.stringify({ oks, atencoes, falhas }, null, 2));
  process.exit(falhas.length ? 1 : 0);
}

main().catch((e) => { console.error("o passeio quebrou:", e); process.exit(2); });
