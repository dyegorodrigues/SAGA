# Decisão P21 — fontes de verdade e backlog derivado

**Data:** 8/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Relatório:** `AUDITORIA_P21_FONTES_DE_VERDADE.md`

## Estado

A fase **P21.A — inventário read-only** está concluída.

Workflow `P21 - fontes de verdade`, run `31274280464`: inventário, captura dos fiscais, TypeScript, publicação e limpeza = **success**.

Nenhum currículo/runtime foi alterado por essa varredura.

A próxima execução é **P21.1 — corrigir governança/registries/auditores**, sem inventar conteúdo pedagógico ainda.

## 1. Números derivados atuais

### Grafo

- 90 nós no YAML;
- 90 nós no JSON;
- zero divergência YAML↔JSON.

### Cânone Markdown

- 92 fichas em 5 blocos;
- 88 competências únicas cobertas em 90;
- lacunas canônicas explícitas: **N1.09 e GM.02**.

Essas duas não devem ser “consertadas por contagem”. Exigem decisão pedagógica/ficha própria ou decisão documentada de por que não devem ter ficha.

### Jornada TS / Composer

- 29 fichas TS de Jornada no disco;
- 24 registradas em `COMPOSER_FICHAS`;
- 22 canários ativos;
- registradas e inativas: **N4.09, GM.12**;
- fichas TS ainda fora do registro Composer: **AL.05, GM.04, N2.01, N3.11, N4.02**.

Estar fora do Composer não significa automaticamente bug: várias podem continuar servidas pelo legado. A P21.1 deve classificar intenção e não promover nada por tabela.

## 2. Divergência `AllFichas/JOURNEY_FICHAS`

O auditor atual encontrou 29 fichas TS de Jornada, mas `JOURNEY_FICHAS` registra 19.

Fichas no disco fora de `AllFichas` segundo o auditor atual:

- GE.01;
- GE.02;
- GM.01;
- N1.11;
- N4.03;
- N4.04;
- N4.06;
- N4.07;
- N4.08;
- N4.09.

Isso é dívida real de governança porque `SandboxModal` usa `JOURNEY_FICHAS.find(...)` para localizar a ficha autoral. Logo, um registro atrasado pode tornar a bancada administrativa cega para autoria que já existe.

### Decisão P21.1

- completar o registro de fichas existentes;
- criar teste disco↔registry para impedir nova deriva;
- **não** usar isso como ativação em produção: registro de catálogo e canário continuam conceitos distintos.

## 3. Auditor autoral hardcoded

`ficha_catalog_auditor.cjs` ainda declara:

- `EXPECTED_FICHAS = 92`;
- `EXPECTED_COMPETENCIES = 88`.

O grafo atual tem 90 nós e o auditor calcula os dois ausentes, mas não transforma a cobertura faltante em falha. Por isso termina verde dizendo “88 competências cobertas”.

### Decisão P21.1

Trocar a lógica de “88 é o mundo” por:

1. contagem derivada do grafo;
2. lacunas canônicas precisam estar em lista explícita e justificada enquanto existirem;
3. qualquer novo nó sem ficha e sem exceção explícita quebra o fiscal;
4. quando N1.09/GM.02 forem resolvidas, a exceção deve ser removida no mesmo lote.

## 4. Auditor agregado também mistura conceitos

O `catalog_auditor.cjs` atual informa 42/90 “geradores explícitos” e lista 48 fallbacks. Porém a lista inclui IDs que hoje estão ativos pelo Composer, como N1.13 e GM.01.

Isso indica que a métrica está olhando uma fonte histórica/estática diferente da proveniência efetiva do `composerCanary`.

### Decisão P21.1

Separar no relatório:

- gerador legado explícito;
- ficha Composer registrada;
- canário Composer ativo;
- fallback real sem conteúdo;
- ficha existente fora do catálogo administrativo.

Um único rótulo “explícito/fallback” não pode esconder essas quatro situações.

## 5. Primitivas — inventário inicial

Mapa atual: 26 entradas.

- 18 classificadas executáveis;
- 4 renderer-sem-builder;
- 3 componente-isolado;
- 1 ausente.

Marcadas como não plenamente executáveis no mapa atual:

- Grupo;
- LinkingCubes;
- Moedas;
- Quadrado100;
- Regua;
- SingaporeBars;
- StoryPanel;
- VisualAddition.

**Cuidado:** P21 encontrou que alguns rótulos do mapa podem estar atrasados em relação ao runtime real. Exemplo: N3.10 está ativo no Composer e possui builder `storypanel`, enquanto o mapa ainda classifica `StoryPanel` como componente-isolado. Portanto a lista acima é backlog de **reconciliação**, não oito componentes que devem ser construídos cegamente.

### Decisão P21.1/P21.2

Para cada primitiva:

1. provar builder real;
2. provar kind final emitido;
3. provar renderer/Stage real;
4. provar ficha consumidora;
5. só então corrigir mapa ou implementar peça ausente.

`Regua` continua a lacuna ausente mais inequívoca. `Moedas` possui renderização existente, mas contrato/builder ainda precisa ser classificado. Não construir por impulso.

## 6. Dívidas pedagógicas confirmadas versus revalidar

### Confirmadas

- N1.09 sem ficha Markdown;
- GM.02 sem ficha Markdown;
- JD4 ausente do catálogo `JARDIM`;
- N4.09 registrada e não ativa;
- GM.12 registrada e não ativa por observação deliberada.

### Revalidar antes de chamar de dívida

- antiga lista de coreografia N3.10/N4.03/N4.04/N4.06/N4.07/N4.08;
- status real de Grupo/StoryPanel/SingaporeBars etc.;
- antigo P4 flaky;
- qualquer número histórico de “legado/vazio”.

## 7. Próxima sequência exata

### P21.1 — governança

1. sincronizar `AllFichas/JOURNEY_FICHAS` com as 29 fichas de Jornada existentes;
2. adicionar teste de completude do registry;
3. tornar o auditor de ficha derivado do grafo com exceções explícitas para N1.09/GM.02;
4. separar proveniência legacy/composer-active/composer-registered/fallback no auditor agregado;
5. corrigir comentários antigos de N1.10/N1.11 no `composerCanary.ts`.

### P21.2 — mapa de primitivas

Auditar aliases/Stages/builders e corrigir somente falsos negativos/positivos do `FICHA_RUNTIME_MAP`.

### P22 — lacunas curriculares deliberadas

Só depois da governança limpa, decidir pedagogicamente:

- N1.09;
- GM.02;
- JD4;
- N4.09;
- GM.12.

P22 deve ser audit-first, não “preencher buraco porque a tabela ficou vermelha”.

## 8. Depois de P22

Seguir `MAPA_MESTRE_POS_P20.md`:

1. auditoria dos motores adaptativos/meta-algoritmos;
2. correções dos motores;
3. mega auditoria de engenharia pedagógica;
4. auditoria integrada do Dojo;
5. release hardening.

**P21 muda a regra de governança: ausência explícita é aceitável temporariamente; ausência silenciosa não é.**
