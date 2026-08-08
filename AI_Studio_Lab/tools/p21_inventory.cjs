const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');
const { FICHA_RUNTIME_MAP } = require('./ficha_runtime_map.cjs');

const ROOT = path.resolve(__dirname, '../..');
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const uniq = xs => [...new Set(xs)];
const idRx = /((?:N[1-7]|AL|GE|GM|PE)\.\d{2})/g;

const graphYaml = YAML.parse(read('curriculum/grafo_saga.yaml'));
const graphJson = JSON.parse(read('src/data/grafo_saga.json'));
const yamlIds = (graphYaml.nodes || []).map(n => n.id);
const jsonIds = (graphJson.nodes || []).map(n => n.id);
const graphIds = uniq(yamlIds);

// Cânone Markdown: mesma identidade usada pelo auditor, sem contagem hardcoded.
const fichaDir = path.join(ROOT, 'AI_Studio_Lab/pedagogia/fichas');
const mdFiles = fs.readdirSync(fichaDir).filter(f => f.endsWith('.md')).sort();
const mdFichas = [];
for (const file of mdFiles) {
  const source = fs.readFileSync(path.join(fichaDir, file), 'utf8');
  const headings = [...source.matchAll(/^# FICHA\s+(\S+)\s+—\s+(.+)$/gm)];
  headings.forEach((h, i) => {
    const end = headings[i + 1]?.index ?? source.length;
    const body = source.slice(h.index, end);
    const identity = body.match(/^\*\*Competência:\*\*\s+((?:N[1-7]|AL|GE|GM|PE)\.\d{2})\b/m);
    mdFichas.push({ file, fichaId: h[1], competenceId: identity?.[1] || null });
  });
}
const mdCompetenceIds = uniq(mdFichas.map(f => f.competenceId).filter(Boolean));

// Fichas TS reais da Jornada.
const jornadaDir = path.join(ROOT, 'src/curriculum/fichas/jornada');
const jornadaFiles = fs.readdirSync(jornadaDir).filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts')).sort();
const tsIds = [];
for (const file of jornadaFiles) {
  const src = fs.readFileSync(path.join(jornadaDir, file), 'utf8');
  const m = src.match(/\bid:\s*["']((?:N[1-7]|AL|GE|GM|PE)\.\d{2})["']/);
  if (m) tsIds.push(m[1]);
}
const journeyTsIds = uniq(tsIds);

// Registro Composer e lista ativa.
const composer = read('src/curriculum/motores/composerCanary.ts');
const registryBlock = composer.slice(composer.indexOf('const COMPOSER_FICHAS'), composer.indexOf('/**\n * Nós efetivamente servidos'));
const registeredIds = uniq([...registryBlock.matchAll(/["']((?:N[1-7]|AL|GE|GM|PE)\.\d{2})["']\s*:/g)].map(m => m[1]));
const canarySource = read('src/curriculum/motores/composerCanaryIds.ts');
const activeIds = uniq([...canarySource.matchAll(/["']((?:N[1-7]|AL|GE|GM|PE)\.\d{2})["']/g)].map(m => m[1]));

function status(entry) {
  const component = entry.builtin || (entry.componentFiles || []).length > 0;
  const builder = (entry.builderKinds || []).length > 0;
  const renderer = (entry.rendererKinds || []).length > 0;
  if (builder && renderer) return 'executável';
  if (component && renderer) return 'renderer-sem-builder';
  if (component) return 'componente-isolado';
  return 'ausente';
}
const primitiveRows = FICHA_RUNTIME_MAP.map(e => ({ primitive: e.primitive, status: status(e), kinds: e.kinds || [] }));
const primitiveCounts = Object.fromEntries(['executável','renderer-sem-builder','componente-isolado','ausente'].map(s => [s, primitiveRows.filter(r => r.status === s).length]));

// Auditores hardcoded: tornar a própria dívida visível.
const catalogAuditor = read('AI_Studio_Lab/tools/ficha_catalog_auditor.cjs');
const expectedCompetencies = Number(catalogAuditor.match(/EXPECTED_COMPETENCIES\s*=\s*(\d+)/)?.[1] || NaN);
const expectedFichas = Number(catalogAuditor.match(/EXPECTED_FICHAS\s*=\s*(\d+)/)?.[1] || NaN);
const checksMissingCoverage = /check\s*\([^)]*missingCompetenceFichas/s.test(catalogAuditor);

const diff = (a, b) => a.filter(x => !new Set(b).has(x));
const report = [];
report.push('# Auditoria P21 — fontes de verdade derivadas do runtime');
report.push('');
report.push(`**Data:** 8/ago/2026  `);
report.push(`**Branch:** \`codex/integrar-bloco-f0\`  `);
report.push('**Modo:** audit-only; nenhum currículo/runtime foi alterado por este inventário.');
report.push('');
report.push('## 1. Grafo');
report.push('');
report.push(`- YAML: **${yamlIds.length}** nós, **${graphIds.length}** IDs únicos;`);
report.push(`- JSON derivado: **${jsonIds.length}** nós, **${uniq(jsonIds).length}** IDs únicos;`);
report.push(`- YAML ausente no JSON: ${diff(graphIds, jsonIds).join(', ') || 'nenhum'};`);
report.push(`- JSON ausente no YAML: ${diff(uniq(jsonIds), graphIds).join(', ') || 'nenhum'}.`);
report.push('');
report.push('## 2. Cânone Markdown');
report.push('');
report.push(`- blocos Markdown: **${mdFiles.length}**;`);
report.push(`- fichas: **${mdFichas.length}**;`);
report.push(`- competências únicas declaradas pelas fichas: **${mdCompetenceIds.length}/${graphIds.length}**;`);
report.push(`- nós do grafo sem ficha Markdown identificada: **${diff(graphIds, mdCompetenceIds).length}** — ${diff(graphIds, mdCompetenceIds).join(', ') || 'nenhum'};`);
report.push(`- fichas apontando para ID fora do grafo: ${diff(mdCompetenceIds, graphIds).join(', ') || 'nenhuma'}.`);
report.push('');
report.push('## 3. Runtime autoral TS / Composer');
report.push('');
report.push(`- competências com ficha TS de Jornada: **${journeyTsIds.length}**;`);
report.push(`- registradas em COMPOSER_FICHAS: **${registeredIds.length}**;`);
report.push(`- canários ativos: **${activeIds.length}**;`);
report.push(`- registradas e inativas: ${diff(registeredIds, activeIds).join(', ') || 'nenhuma'};`);
report.push(`- ativas sem registro: ${diff(activeIds, registeredIds).join(', ') || 'nenhuma'};`);
report.push(`- fichas TS de Jornada ainda não registradas: ${diff(journeyTsIds, registeredIds).join(', ') || 'nenhuma'};`);
report.push('');
report.push('### Canários ativos');
report.push('');
report.push(activeIds.map(id => `\`${id}\``).join(', '));
report.push('');
report.push('## 4. Primitivas — mapa runtime');
report.push('');
report.push(`- entradas: **${primitiveRows.length}**;`);
for (const [s, n] of Object.entries(primitiveCounts)) report.push(`- ${s}: **${n}**;`);
report.push('');
report.push('### Não plenamente executáveis');
report.push('');
for (const r of primitiveRows.filter(r => r.status !== 'executável')) report.push(`- \`${r.primitive}\`: **${r.status}** (kinds: ${r.kinds.join(' + ') || '—'});`);
if (!primitiveRows.some(r => r.status !== 'executável')) report.push('- nenhuma.');
report.push('');
report.push('## 5. Auditor hardcoded — dívida detectada');
report.push('');
report.push(`- \`EXPECTED_FICHAS\`: **${expectedFichas}**;`);
report.push(`- \`EXPECTED_COMPETENCIES\`: **${expectedCompetencies}**;`);
report.push(`- grafo atual derivado: **${graphIds.length}**;`);
report.push(`- o auditor transforma \`missingCompetenceFichas\` em falha explícita: **${checksMissingCoverage ? 'sim' : 'não'}**.`);
if (expectedCompetencies !== graphIds.length || !checksMissingCoverage) {
  report.push('');
  report.push('> **P21 confirmado:** o fiscal autoral contém expectativa histórica e/ou não fecha a cobertura do grafo por derivação. Corrigir o fiscal em lote separado depois deste inventário.');
}
report.push('');
report.push('## 6. Classificação inicial do backlog');
report.push('');
report.push('### Confirmado pelo runtime');
report.push('');
report.push(`- registradas mas inativas: ${diff(registeredIds, activeIds).join(', ') || 'nenhuma'};`);
report.push(`- primitivas incompletas: ${primitiveRows.filter(r => r.status !== 'executável').map(r => r.primitive).join(', ') || 'nenhuma'};`);
report.push(`- cobertura Markdown ausente no grafo: ${diff(graphIds, mdCompetenceIds).join(', ') || 'nenhuma'};`);
report.push('');
report.push('### Precisa de auditoria semântica, não só contagem');
report.push('');
report.push('- dívida antiga de coreografia;');
report.push('- relação JD4 ↔ N1.07;');
report.push('- adequação de N4.09/GM.12 antes de promoção;');
report.push('- qualidade longitudinal dos motores adaptativos;');
report.push('- mega auditoria pedagógica por grafo/ficha/primitiva/trajetória.');
report.push('');
report.push('## 7. Regra pós-P21');
report.push('');
report.push('Contagens futuras devem ser derivadas das fontes reais. Constantes históricas podem existir como assert apenas quando o número é uma regra de produto deliberada; nesse caso precisam falhar quando o grafo muda, e não mascarar a mudança.');

fs.writeFileSync(path.join(ROOT, 'AI_Studio_Lab/codex/AUDITORIA_P21_FONTES_DE_VERDADE.md'), report.join('\n') + '\n');
console.log(report.join('\n'));
