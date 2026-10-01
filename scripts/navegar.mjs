/**
 * Chegar na competência, do zero, sempre.
 *
 * ## Por que isto existe separado
 *
 * Toda sonda que eu construí morria no mesmo lugar: depois de jogar um
 * exercício, ela tentava voltar ao mapa pela interface e não achava o
 * caminho. A varredura das 90 chegou a 45; a do enquadramento, a 3. Eu
 * consertava o conserto e nunca o instrumento, e por isso media sempre os
 * mesmos primeiros exercícios — exatamente os que o pai já tinha relatado.
 *
 * A saída não é achar o botão de voltar: é **recarregar a página**. A chave do
 * modo de teste e o perfil ficam no aparelho, então o app volta sozinho para a
 * casa da criança. Custa alguns segundos por exercício e nunca falha.
 */
export const BASE = process.env.SAGA_URL ?? "http://localhost:3000";

export const T = async p => (await p.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ");

export const esperar = async (p, c, ms = 25000) => {
  const limite = Date.now() + ms;
  while (Date.now() < limite) { const t = await T(p); if (c(t)) return t; await p.waitForTimeout(200); }
  return null;
};

export const clicar = async (p, nome, espera) => {
  const a = p.getByRole("button", { name: nome }).first();
  if (!(await a.count())) return false;
  await a.click({ timeout: 15000 }).catch(() => {});
  if (espera) return Boolean(await esperar(p, t => espera.test(t)));
  await p.waitForTimeout(500);
  return true;
};

/** Cria o perfil, uma vez. Depois disso ele persiste no aparelho. */
export async function primeiroAcesso(page) {
  await page.goto(`${BASE}/?destravado=123`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await esperar(page, t => /Começar sem Conta|JOGAR|Quem vai brincar/i.test(t), 30000);
  if (/Começar sem Conta/i.test(await T(page))) {
    await clicar(page, /Começar sem Conta/i, /Monte seus Perfis/i);
    await clicar(page, /Criar Primeiro Perfil|Criar Perfil|Novo Perfil/i, /Configurar Perfil/i);
    await page.locator('input[type="text"]').first().fill("Teo");
    await clicar(page, /1º Ano EF/i);
    await clicar(page, /Começar Aventura/i, /Quem vai brincar|JOGAR/i);
  }
}

/** Do zero até a Jornada aberta. Recarrega — nunca tenta "voltar". */
export async function irAoMapa(page) {
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await esperar(page, t => /JOGAR|Quem vai brincar|Jornada|Sensei/i.test(t), 30000);
  await clicar(page, /JOGAR/i, /Sensei|Aventura|Missão|Sondagem|Jornada/i);
  await page.waitForTimeout(600);
  for (let i = 0; i < 4; i += 1) {
    const aba = page.locator("button", { hasText: /^Jornada$/i });
    if (await aba.count()) { await aba.first().click().catch(() => {}); await page.waitForTimeout(900); }
    if (await page.getByRole("button", { name: /: dispon[ií]vel$/ }).count()) return true;
  }
  return false;
}

/** Abre a competência no nível pedido. Devolve false se não achou. */
export async function abrir(page, alvo, nivel = 1) {
  if (!(await irAoMapa(page))) return false;
  const cartao = page.getByRole("button", { name: `${alvo}: disponível` }).first();
  if (!(await cartao.count())) return false;
  await cartao.click();
  await page.waitForTimeout(800);
  const bn = page.getByRole("button", { name: new RegExp(`^${nivel} N[ií]vel ${nivel}`) }).first();
  if (await bn.count()) await bn.click();
  return true;
}

/** Os nomes das competências abertas, lidos do mapa. */
export async function competencias(page) {
  if (!(await irAoMapa(page))) return [];
  const todos = await page.getByRole("button", { name: /: dispon[ií]vel$/ }).all();
  const nomes = await Promise.all(todos.map(a => a.getAttribute("aria-label")));
  return nomes.map(n => n.replace(/: disponível$/, ""));
}
