import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const self = path.join(root, "src/motor_audit_publish.test.ts");
const reportPath = path.join(root, "AI_Studio_Lab/codex/AUDITORIA_MOTORES_ADAPTATIVOS.md");
const existed = fs.existsSync(reportPath);
const previous = existed ? fs.readFileSync(reportPath, "utf8") : "";

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", "dist", ".git"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx|js|cjs)$/.test(entry.name)) out.push(full);
  }
  return out;
}
function rel(file: string) { return path.relative(root, file).replaceAll("\\", "/"); }
function linesFor(file: string, re: RegExp) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  const hits: string[] = [];
  lines.forEach((line, i) => { if (re.test(line)) hits.push(`${rel(file)}:${i + 1} — ${line.trim().slice(0, 180)}`); re.lastIndex = 0; });
  return hits;
}
function section(title: string, items: string[], note?: string) {
  return `\n## ${title}\n\n${note ? `${note}\n\n` : ""}${items.length ? items.map(x => `- ${x}`).join("\n") : "- Nenhuma ocorrência encontrada."}\n`;
}

function generateReport() {
  const srcFiles = walk(path.join(root, "src"));
  const prodFiles = srcFiles.filter(f => !/\.(test|spec)\.[tj]sx?$/.test(f));
  const motorDir = path.join(root, "src/curriculum/motores");
  const motorFiles = fs.existsSync(motorDir)
    ? fs.readdirSync(motorDir).filter(n => /\.(ts|tsx)$/.test(n)).sort().map(n => `src/curriculum/motores/${n}`)
    : [];

  const exported: string[] = [];
  for (const file of motorFiles.map(p => path.join(root, p))) {
    const text = fs.readFileSync(file, "utf8");
    for (const m of text.matchAll(/export\s+(?:async\s+)?(?:function|const|class|interface|type)\s+([A-Za-z0-9_]+)/g)) {
      exported.push(`${rel(file)} — ${m[1]}`);
    }
  }

  const directProgressWrites = prodFiles.flatMap(f => linesFor(f, /(?:\.mast\s*=|\.lvl\s*=|\.streak\s*=|\.maxLvl\s*=|\bprogress\.(?:mast|lvl|streak|maxLvl)\s*=)/g))
    .filter(x => !x.startsWith("src/curriculum/motores/progressEngine.ts:"));
  const progressEntryPoints = prodFiles.flatMap(f => linesFor(f, /\bapplyJourneyAnswer\b|\bprogressEngine\b/g));
  const radarEntryPoints = prodFiles.flatMap(f => linesFor(f, /\btrackMisconception\b|\bradarEngine\b|\bmisconceptionForAnswer\b/g));
  const dojoRefs = prodFiles.flatMap(f => linesFor(f, /\bdojoTracks\b|\bJARDIM\b|\bJD[1-9]\b/g));
  const timingRefs = prodFiles.flatMap(f => linesFor(f, /\brt_alvo\b|responseTime|reactionTime|tempo.*resposta/gi));
  const retentionRefs = prodFiles.flatMap(f => linesFor(f, /leitner|reten[cç][aã]o|spaced|spacing|reviewQueue|revis[aã]o/gi));
  const unlockRefs = prodFiles.flatMap(f => linesFor(f, /unlock|desbloq|isUnlocked|prereq|prerequisite/gi));
  const recommendationRefs = prodFiles.flatMap(f => linesFor(f, /recommend|recomend|Minha Aula|mixed challenge|mixedChallenge|oficina/gi));
  const evidenceRefs = prodFiles.flatMap(f => linesFor(f, /evidence|evid[eê]ncia|mastery|dom[ií]nio|\bmast\b/gi));
  const persistenceRefs = prodFiles.flatMap(f => linesFor(f, /firebase|save|persist|sync|localStorage|cloud/gi));

  const rtInMastery = prodFiles.flatMap(f => linesFor(f, /rt_alvo|responseTime|reactionTime/gi))
    .filter(x => /progressEngine|master|dom[ií]nio|mast|unlock/i.test(x));
  const dojoJourneyCoupling = dojoRefs.filter(x => /progressEngine|applyJourneyAnswer|journey|unlock/i.test(x));
  const TODOs = prodFiles.flatMap(f => linesFor(f, /TODO|FIXME|HACK|XXX/g));

  const flags = [
    directProgressWrites.length
      ? `⚠️ **Mutações de progresso fora de progressEngine:** ${directProgressWrites.length} ocorrência(s). Precisam de revisão manual para distinguir escrita legítima de duplicação de regra.`
      : "✅ **Dono de progresso:** não foram detectadas atribuições diretas a mast/lvl/streak/maxLvl fora de progressEngine.",
    rtInMastery.length
      ? `⚠️ **Tempo acoplado a domínio/unlock:** ${rtInMastery.length} ocorrência(s) candidatas. Confirmar se tempo é apenas diagnóstico/fluência ou se está coroando domínio.`
      : "✅ **Tempo vs domínio:** busca estática não encontrou rt_alvo/responseTime diretamente acoplado a mastery/unlock.",
    dojoJourneyCoupling.length
      ? `⚠️ **Acoplamento Jardim↔Jornada:** ${dojoJourneyCoupling.length} referência(s) candidatas. Confirmar se dojoTracks permanece estado separado e não promove domínio da Jornada.`
      : "✅ **Jardim vs Jornada:** busca estática não encontrou acoplamento óbvio de JD/dojoTracks a progressEngine/unlock.",
    retentionRefs.length
      ? `ℹ️ **Revisão/retenção:** ${retentionRefs.length} referência(s) encontradas; auditar política, fonte de evidência e prioridade longitudinal.`
      : "⚠️ **Revisão/retenção:** nenhuma referência clara a Leitner/spaced/review foi encontrada pela busca estática; verificar se o mecanismo usa outro nome ou está ausente.",
  ];

  const report = `# Auditoria longitudinal dos motores adaptativos — inventário read-only\n\n**Data:** 8/ago/2026  \n**Branch auditada:** \`codex/integrar-bloco-f0\`  \n**Escopo:** reconstruir o fluxo questão → resposta → evidência → domínio → revisão → recomendação/unlock antes de qualquer correção algorítmica.\n\n> Este documento é gerado do código atual. Ocorrência textual é pista, não sentença: cada flag precisa ser confirmada pela leitura do fluxo e por teste de comportamento.\n\n## Resumo executivo automático\n\n${flags.map(x => `- ${x}`).join("\n")}\n\n## Arquivos de motores\n\n${motorFiles.map(x => `- \`${x}\``).join("\n") || "- Nenhum."}\n${section("Exports públicos dos motores", exported)}\n${section("Entradas do Progress Engine", progressEntryPoints, "Chamadas/imports que podem participar da atualização longitudinal de Jornada.")}\n${section("Mutações diretas de progresso fora do Progress Engine", directProgressWrites, "Qualquer item aqui é candidato a duplicação de regra ou bypass de invariantes; testes e arquivos de teste foram excluídos.")}\n${section("Radar e telemetria de misconception", radarEntryPoints)}\n${section("Jardim / Dojo / dojoTracks", dojoRefs.slice(0, 160), `Total de referências encontradas: ${dojoRefs.length}.`)}\n${section("Metas/medidas de tempo de resposta", timingRefs.slice(0, 160), `Total de referências encontradas: ${timingRefs.length}.`)}\n${section("Retenção / revisão espaçada / Leitner", retentionRefs.slice(0, 160), `Total de referências encontradas: ${retentionRefs.length}.`)}\n${section("Unlock e pré-requisitos", unlockRefs.slice(0, 180), `Total de referências encontradas: ${unlockRefs.length}.`)}\n${section("Recomendação / Minha Aula / mixed challenge / Oficina", recommendationRefs.slice(0, 180), `Total de referências encontradas: ${recommendationRefs.length}.`)}\n${section("Evidência, domínio e mastery", evidenceRefs.slice(0, 220), `Total de referências encontradas: ${evidenceRefs.length}.`)}\n${section("Persistência / sync / save", persistenceRefs.slice(0, 180), `Total de referências encontradas: ${persistenceRefs.length}.`)}\n${section("Candidatos: tempo influenciando mastery/unlock", rtInMastery)}\n${section("Candidatos: Jardim acoplado a Journey/unlock", dojoJourneyCoupling)}\n${section("TODO/FIXME/HACK em produção", TODOs)}\n\n## Próxima passagem obrigatória\n\n1. Desenhar a máquina de estados longitudinal da criança, com proprietários de cada campo de progresso.\n2. Traçar um acerto e um erro desde o GameLoop até persistência, Radar e próxima seleção.\n3. Provar como mastery/evidence/unlock são calculados e se há caminhos paralelos.\n4. Provar que \`dojoTracks\`/JD e metas de tempo não concedem domínio conceitual da Jornada.\n5. Provar política real de retenção/revisão e como ela compete com conteúdo novo.\n6. Provar como Minha Aula/Composer/Oficina/mixed challenge consomem Radar, pré-requisitos e histórico.\n7. Só depois abrir correções, uma invariável por lote, com testes de propriedade e cenários longitudinais.\n`;
  return report;
}

describe("auditoria read-only dos motores", () => {
  it("gera inventário longitudinal sem alterar runtime", () => {
    try {
      const report = generateReport();
      fs.writeFileSync(reportPath, report);
      expect(report).toContain("Arquivos de motores");
      expect(report).toContain("Progress Engine");
      expect(report).toContain("Radar");
      expect(report).toContain("Jardim");
      fs.rmSync(self, { force: true });
    } catch (error) {
      if (existed) fs.writeFileSync(reportPath, previous); else fs.rmSync(reportPath, { force: true });
      fs.rmSync(self, { force: true });
      throw error;
    }
  });
});
