import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

/**
 * A varredura que o portão e o gerador de baseline compartilham.
 *
 * Existe como módulo único porque duas implementações da mesma regra é a forma
 * mais rápida de um portão passar a mentir: basta o gerador contar de um jeito
 * e o teste de outro, e a baseline vira ficção. O projeto já pagou por isso no
 * ledger órfão da W21 — arquivo que parecia fonte da verdade e não era.
 */

/** A raiz varrida. Relativa à raiz do repositório. */
export const RAIZ_VARREDURA = "src";

/**
 * `tokens.ts` é o único lugar onde uma cor literal É a resposta certa: ali ela
 * é o valor de emergência de um token nomeado, não uma cor solta.
 */
const ISENTOS = new Set(["src/styles/tokens.ts"]);

const ehFonte = (nome: string) => /\.(tsx|ts)$/.test(nome) && !/\.test\.tsx?$/.test(nome);

/** `#rrggbb`. Três dígitos e oito dígitos ficam de fora de propósito: são raros
 * aqui e alargar o padrão agora só tornaria a baseline instável. */
const HEX = /#[0-9a-fA-F]{6}\b/g;

const normalizar = (caminho: string) => caminho.split(sep).join("/");

function arquivosDe(dir: string, achados: string[] = []): string[] {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const caminho = join(dir, entrada.name);
    if (entrada.isDirectory()) arquivosDe(caminho, achados);
    else if (ehFonte(entrada.name)) achados.push(caminho);
  }
  return achados;
}

/**
 * Conta cores literais por arquivo, a partir da raiz do repositório.
 *
 * Devolve só quem tem pelo menos uma: arquivo limpo não entra na baseline, de
 * modo que a lista encolhe de verdade conforme a migração avança.
 */
export function varrerCoresLiterais(raizRepo: string): Record<string, number> {
  const resultado: Record<string, number> = {};

  for (const caminho of arquivosDe(join(raizRepo, RAIZ_VARREDURA))) {
    const relativo = normalizar(relative(raizRepo, caminho));
    if (ISENTOS.has(relativo)) continue;

    const quantas = (readFileSync(caminho, "utf8").match(HEX) ?? []).length;
    if (quantas > 0) resultado[relativo] = quantas;
  }

  return resultado;
}
