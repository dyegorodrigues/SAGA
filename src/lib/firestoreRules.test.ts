import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Cobertura das regras do Firestore.
 *
 * Não substitui o emulador — não valida a lógica de `allow`. Faz outra coisa,
 * que o emulador não faz sozinho: compara **os caminhos que o cliente escreve**
 * com **os caminhos que as regras declaram**, e falha quando um caminho novo
 * aparece no código sem regra correspondente.
 *
 * Este teste existe porque exatamente esse defeito estava em produção. O cliente
 * gravava telemetria em `userStates/{u}/Kids/{k}/TelemetryLogs`, mas as regras
 * só declaravam `match /userStates/{userId}` — e no Firestore uma regra de
 * documento **não** alcança as subcoleções dele. Toda a telemetria caía na
 * negação padrão e era rejeitada em silêncio, porque o cliente engole o erro
 * para não interromper a aula da criança.
 */

const raiz = resolve(__dirname, "../..");
const regras = readFileSync(resolve(raiz, "firestore.rules"), "utf8");
const clienteFirebase = readFileSync(resolve(raiz, "src/lib/firebase.ts"), "utf8");

/** Extrai os caminhos de coleção/documento que o cliente monta. */
function caminhosDoCliente(fonte: string): string[] {
  const encontrados = new Set<string>();

  // Template strings: `userStates/${userId}/Kids/${log.kidId}/TelemetryLogs`
  for (const m of fonte.matchAll(/`([A-Za-z][\w-]*(?:\/(?:\$\{[^}]+\}|[\w-]+))+)`/g)) {
    encontrados.add(m[1].replace(/\$\{[^}]+\}/g, "*"));
  }
  // Forma segmentada: doc(db, "userStates", userId)
  for (const m of fonte.matchAll(/\b(?:doc|collection)\(\s*db\s*,\s*"([\w-]+)"/g)) {
    encontrados.add(`${m[1]}/*`);
  }
  return [...encontrados];
}

/** Converte um `match` das regras num padrão comparável ao caminho do cliente. */
function caminhosDasRegras(fonte: string): string[] {
  const blocos: string[] = [];
  // Blocos que não são `match` — como `function` — também abrem chaves, então a
  // pilha precisa acompanhar a profundidade real, e não a contagem de linhas.
  const pilha: Array<{ caminho: string; profundidade: number }> = [];
  let profundidade = 0;

  for (const linha of fonte.split("\n")) {
    const semComentario = linha.replace(/\/\/.*$/, "");
    const abre = semComentario.match(/match\s+(\/.+?)\s*\{\s*$/);

    if (abre) {
      pilha.push({ caminho: abre[1], profundidade });
      blocos.push(pilha.map(p => p.caminho).join(""));
    }

    profundidade += (semComentario.match(/\{/g) ?? []).length;
    profundidade -= (semComentario.match(/\}/g) ?? []).length;

    while (pilha.length && profundidade <= pilha[pilha.length - 1].profundidade) {
      pilha.pop();
    }
  }

  return blocos
    .map(b => b.replace("/databases/{database}/documents", ""))
    .filter(Boolean)
    .map(b => b.replace(/\{[^}]+\}/g, "*").replace(/^\//, ""));
}

/** O caminho do cliente é coberto por alguma regra? */
function coberto(caminho: string, padroes: string[]): boolean {
  const alvo = caminho.split("/").filter(Boolean);
  return padroes.some(padrao => {
    const partes = padrao.split("/").filter(Boolean);
    // O curinga recursivo cobre qualquer profundidade a partir dali.
    if (padrao.includes("**")) return true;
    // A regra pode declarar um segmento a mais que o caminho da coleção, já que
    // `collection(...)` aponta para a coleção e a regra nomeia o documento.
    if (partes.length !== alvo.length && partes.length !== alvo.length + 1) return false;
    return alvo.every((seg, i) => partes[i] === "*" || partes[i] === seg);
  });
}

describe("regras do Firestore cobrem o que o cliente escreve", () => {
  const doCliente = caminhosDoCliente(clienteFirebase);
  const dasRegras = caminhosDasRegras(regras).filter(p => !p.includes("**"));

  it("o cliente realmente toca os caminhos esperados", () => {
    expect(doCliente.length, "nenhum caminho detectado — o extrator quebrou").toBeGreaterThan(0);
    expect(doCliente).toContain("userStates/*/Kids/*/TelemetryLogs");
  });

  it("as regras declaram a subcoleção de telemetria, não só o documento do usuário", () => {
    // Regressão do defeito real: uma regra de documento não alcança subcoleção.
    expect(
      dasRegras.some(p => p.includes("TelemetryLogs")),
      "sem regra para TelemetryLogs, toda a telemetria é negada em silêncio",
    ).toBe(true);
  });

  it("nenhum caminho do cliente fica sem regra correspondente", () => {
    const descobertos = doCliente.filter(c => !coberto(c, dasRegras));
    expect(descobertos, "caminhos gravados pelo cliente e não declarados nas regras").toEqual([]);
  });

  it("mantém a negação padrão como primeira defesa", () => {
    expect(regras).toMatch(/match\s+\/\{document=\*\*\}/);
    expect(regras).toMatch(/allow read, write: if false/);
  });

  it("a telemetria é append-only: sem update nem delete", () => {
    expect(regras).toMatch(/allow update, delete: if false/);
  });

  it("o acesso continua restrito ao dono autenticado", () => {
    expect(regras).toContain("request.auth != null");
    expect(regras).toContain('"usr_cloud_" + request.auth.uid');
  });
});
