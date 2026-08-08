# Decisão P22 — dívidas curriculares deliberadas

**Data:** 8/ago/2026
**Branch:** `codex/integrar-bloco-f0`
**Pré-requisito:** P21 fechada e governança de fontes de verdade estabilizada.

## Estado da auditoria

A P22 foi aberta com inventário read-only dos cinco itens delimitados em `RETOMADA.md`.

Gate de inventário: run `31276442048` = success.
Bancada temporária auto-removida em `f14089d9239f6fbe536fce4dd8bac354febdc04c`.

O inventário executou matriz de proveniência, busca de testes, sonda real de N4.09/GM.12 e os auditores canônicos. Nenhuma decisão abaixo altera a `main`, o Creature Engine ou o grafo por contagem.

## 1. N1.09 — manter o nó e construir a competência que falta

### Cânone

`N1.09` é **Contagem até 20 e a partir de qualquer número**.

Pré-requisitos: `N1.04` e `N1.02`.

Micros canônicos:

1. contar objetos entre 10 e 15;
2. contar objetos entre 10 e 20;
3. continuar uma sequência a partir de um ponto interno;
4. contagem regressiva 10→0.

A decisão histórica P12 já provou que esse significado não pode ser sequestrado por “produzir quantidade”: N1.12, N2.01, N3.03 e AL.03 dependem de N1.09 como contagem além do dez. F04 foi corretamente separado em N1.13.

### Runtime atual

- gerador legado: sim;
- ficha Markdown própria: não;
- ficha TS: não;
- Composer: não registrado/inativo.

O legado `gVis_Sequence` cobre apenas continuação de sequência. Não prova contagem de conjuntos 10–20 nem regressiva.

### Decisão

**N1.09 permanece no grafo e precisa ficha autoral própria + implementação TS completa.**

Não reutilizar N1.13. Reaproveitar gramáticas já ensinadas sempre que adequado e evitar primitiva nova sem necessidade.

## 2. GM.02 — manter Tempo cotidiano e substituir o legado insuficiente

### Cânone

`GM.02` é **Tempo cotidiano**:

- partes do dia;
- ontem/hoje/amanhã;
- dias da semana;
- ordenação de eventos.

GM.04 depende dessa linguagem temporal. A P15 já separou corretamente massa/capacidade em GM.12.

### Runtime atual

- gerador legado: sim;
- ficha Markdown própria: não;
- ficha TS: não;
- Composer: não registrado/inativo.

O legado atual reduz o nó a “Manhã ou Noite?” com resposta fixa `morning`. Não representa o cânone.

### Decisão

**GM.02 permanece Tempo cotidiano e precisa ficha autoral própria + implementação TS completa.**

A experiência deve ser pré-leitora: áudio, cenas, ordenação e iconografia carregam a linguagem; texto é apoio, não requisito escondido.

## 3. N1.07 ↔ JD4 — primeiro compreensão completa, depois automaticidade

### Cânone de N1.07

`N1.07` é **Ordem, sucessor e antecessor até 10**.

O grafo exige sucessor, antecessor e ordenação de numerais.

### Runtime atual

N1.07 está registrado e ativo no Composer, com rollback legado. A ficha TS corrente cobre essencialmente +1/“qual vem depois?”, sem equivalência completa para antecessor e ordenação.

Há também deriva estrutural: o grafo usa `N1.02 + N1.06` como pré-requisitos, enquanto a ficha TS declara `N1.04 + N1.06`.

### Cânone de JD4

JD4 é **Próximo Passo**, trilha de automaticidade ligada a N1.07, não um nó novo.

Progressão autoral:

- L1: sucessor 1–5 com reta;
- L2: sucessor 1–10;
- L3: sucessor 1–20, reta após erro;
- L4: antecessor 2–10;
- L5: alternância sucessor/antecessor 1–20, áudio, meta ~3 s.

### Decisão

**Não adicionar JD4 ao Jardim antes de fechar a Jornada N1.07.**

Sequência:

1. reconciliar pré-requisitos;
2. completar N1.07 com sucessor + antecessor + ordenação;
3. validar compreensão na Jornada;
4. registrar JD4 como automaticidade da competência-mãe.

O Jardim não pode substituir ensino conceitual ausente.

## 4. N4.09 — promoção autorizada em lote próprio

### Cânone/runtime

F68/N4.09 ensina multiplicação de dois dígitos pelo modelo de área. A ficha TS está completa, registrada no Composer, inativa e sem legado explícito; desligada, cai em placeholder.

O contrato atual resolveu o antigo risco de sobrecarga no nível 4: o algoritmo existe para microaula, mas fica oculto durante a resposta (`algoritmoSoNaAula`).

### Evidência atual

Sonda P22:

- 390 px: 40/40;
- 320 px: 5/5;
- 900 px: 5/5;
- zero vazamento, colisão ou texto coberto.

`areaContract.test.ts` protege resposta, regiões, parcelas, segunda linha ×10 e retirada gradual de apoio.

### Decisão

**Promover N4.09 em lote mínimo e reversível.**

A promoção deve adicionar o ID à lista declarativa, incluir N4.09 no contrato genérico de canário e provar rollback para placeholder, testes de área, sonda e gates completos.

## 5. GM.12 — promoção autorizada em lote próprio

### Cânone/runtime

F50/GM.12 ensina comparação e conservação de massa/capacidade antes de unidades. Pré-requisito: GM.01.

A ficha TS está completa, registrada no Composer e no contrato genérico de canário, e não possui legado explícito. `MedidasStage` implementa balança, recipientes, verificação, seriação, diagnósticos e evidências.

`GM.12.test.ts` protege a introdução da linguagem da balança/capacidade e evita herança de fala inadequada entre cenas.

### Evidência atual

Sonda P22:

- 390 px: 40/40;
- 320 px: 5/5;
- 900 px: 5/5;
- zero vazamento, colisão ou texto coberto.

### Decisão

**Promover GM.12 em lote mínimo e reversível.**

A mudança funcional esperada é somente adicionar `GM.12` a `DEFAULT_COMPOSER_CANARY_IDS`, seguida de contrato, proveniência, sonda e gates completos.

## 6. Ordem de execução

1. P22.1 — GM.12;
2. P22.2 — N4.09;
3. P22.3 — N1.07/JD4;
4. P22.4 — N1.09;
5. P22.5 — GM.02.

Cada lote deve ter commit funcional próprio, gate transacional e checkpoint.

## 7. Estado provisório P22.1

`GM.12` já foi adicionado à lista declarativa na branch.

Primeiro gate P22.1: run `31276688133`.

Passou:

- teste específico GM.12;
- contrato genérico de canário;
- proveniência exata: 23 ativos, 50 servidos sem placeholder, 40 fallbacks;
- sonda promovida em 390/320/900 px;
- auditores e conformidade 9/9;
- TypeScript;
- suíte completa: 125 arquivos / 2.145 testes;
- build e `pr:check`.

Falhou somente no `git diff --check` por whitespace final em documentos de checkpoint. A promoção ainda não é considerada fechada até o rerun integral ficar verde.

## 8. Regra de fechamento P22

P22 só termina quando:

- N1.09 e GM.02 deixarem de ser lacunas autorais sem reduzir o cânone;
- N1.07 ensinar o conceito inteiro e JD4 estiver separado como automaticidade;
- N4.09 e GM.12 estiverem promovidas com gate verde, ou explicitamente mantidas inativas se surgir bloqueio novo e comprovado;
- todos os auditores, testes, sondas afetadas, TypeScript, build e guards estiverem verdes.

> **Promoção não é prêmio por existir código. É consequência de uma cadeia de evidência completa e reversível.**
