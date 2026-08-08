# Handoff de continuidade — SAGA / branch cumulativa

> **VIGENTE — 8/ago/2026, após P17 + P8 Jardim.**
>
> Este é o ponto de entrada operacional de qualquer nova sessão. O repositório é a fonte de verdade. Leia este arquivo, `BRIEFING_CODEX.md`, as decisões P17/P8 e a PR #29 antes de editar.

## 1. Regra de ouro

- Repositório: `dyegorodrigues/SAGA`.
- **Não mover, mesclar nem trabalhar na `main`.**
- `main` protegida: `68fad4c575e28959b2ca4776e9a541d6828b63f3`.
- Linha cumulativa: **`codex/integrar-bloco-f0`**.
- PR #29: **draft**, base `main`, somente comparação/CI; nunca mesclar nem ativar auto-merge.
- Creature Engine continua fora deste fluxo.

### Branches que devem permanecer

1. `main`
2. `codex/integrar-bloco-f0`
3. `agent/creature-engine-tamagotchi`
4. `codex/criar-branch-para-creature-engine-tamagotchi`

As duas últimas pertencem ao Creature Engine e não devem ser tocadas aqui. Os refs auxiliares históricos desta linha já foram removidos depois de provar absorção/reconciliação.

---

## 2. P17 — parte-todo / amigos do 10 RESOLVIDA

Documento: `DECISAO_P17_N110.md`.

### N1.10

`JD5 perceptual → retirada real da moldura → NumberBond`

- L4 alterna moldura e objetos realmente soltos;
- `SEM_MOLDURA` é gate obrigatório antes de L5;
- `TOTAL_ALEM_DE_CINCO` continua evidência independente de domínio;
- N1.10 revalidada com gate real em `37595c73795b45c9e16075749bae51690c5d77ac` — CI normal verde.

### N1.11

`JD3 perceptual → F28 NumberBond → n + □ = 10`

- revalidada sobre N1.10 ativa em `ab5b3b613a3226076b1d967a48cc99ba6c8b50c9` — CI normal verde;
- microtexto corrigido para “mais quanto **dá** dez?” em `e285429745da01478f95269bf683b5a4e6cd675a`.

### Regra estrutural

Representações diferentes da mesma estrutura não viram nós paralelos. A Jornada faz a ponte conceitual; o Jardim preserva a automaticidade perceptual.

`MasteryRule` (`acertos/de/sessoes`) agora é executável pelo motor. `rt_alvo` permanece telemetria/fluência e não reprova compreensão na Jornada.

---

## 3. P8 — Jardim do Dojo RESOLVIDA

Documento de decisão:

`AI_Studio_Lab/codex/DECISAO_P8_JARDIM.md`

### 3.1 O defeito original

A UI chamada “Dojo Garden” não usava `JARDIM`: mostrava genericamente trilhas da Jornada por estrelas, com seletor manual de nível e estatísticas contaminadas por `state.progress`.

### 3.2 Arquitetura final

JD implementadas:

- JD1 → N1.03;
- JD2 → N1.08;
- JD3 → N1.11;
- JD5 → N1.10.

Todas abrem quando a mãe já conquistou nível 3 (`maxLvl >= 3`) ou domínio. JD4 continua dívida separada.

**JD não é nó do DAG.**

- Jornada = compreensão;
- Jardim = automaticidade pré-simbólica;
- estado do Jardim = `state.dojoTracks[kidId][JD*]`;
- nunca criar `state.progress[kidId][JD*]`.

### 3.3 Motor

`jardimEngine.ts`:

- rounds 6–10; runtime atual 8;
- promoção exige precisão ≥80% **e** fluência dentro do `rt_alvo` ≥80%;
- dois rounds bons → avança;
- dois bons no topo → `mastered/reflexo`;
- dois rounds <60% → recua o treino, sem retirar `highestStep`;
- acerto lento mantém compreensão, mas não promove automaticidade;
- lentidão nunca é `misconception`.

Motor puro: `5b22e6d4594db68c3f86414dccd18c40faf49619`.

### 3.4 Sessão / GameLoop / save

`jardimSession.ts` é a ponte explícita JD→Track.

GameLoop ganhou `progressionMode="garden"`:

- compartilha renderer/voz/retry;
- **não chama `applyJourneyAnswer`**;
- congela o degrau durante o round;
- não usa banco/Leitner/coroa da Jornada;
- aplica `applyJardimRound` apenas no final.

O App salva o round atomicamente em `dojoTracks`. Erros cognitivos reais atualizam o Radar da competência-mãe; recuperar uma questão depois de erro real não transforma a primeira resposta em acerto de automaticidade.

O fiscal `portaDosFundos.test.ts` conhece `jardimSession.ts` como porta autoral explícita porque JD não substitui nó/legado do DAG. Qualquer nova porta continua quebrando o fiscal.

### 3.5 Cânone reconciliado

`DOJO_SAGA.md` foi elevado para v1.5 em `3ec25a4007c0e79b89bafcb7887bf270000ca545`:

- JD5 passa a mãe N1.10 e parte-todo;
- definição antiga de “chegaram mais” fica histórica e precisa de destino próprio se reaproveitada;
- família de dados admite JD;
- unlock e regra de rounds ficam explícitos.

### 3.6 UI real e QA

`DojoTab` agora consome `JARDIM` diretamente:

- quatro cartões JD reais;
- lock pela mãe, não por estrelas/cache;
- sem seletor manual de nível;
- treino atual × melhor conquista;
- `Reflexo` pode coexistir com treino recuado;
- estatísticas do Jardim vêm de `dojoTracks`.

Teste permanente: `src/components/home/DojoTab.test.tsx`.

Sonda permanente cobre:

1. tudo bloqueado;
2. JD1/JD2 abertas;
3. progresso avançado/reflexos.

A primeira sonda falhou por contraste; o componente foi corrigido, não o fiscal. Depois passou em 320/390/900. PNGs 320 foram inspecionados manualmente.

QA visual permanente: `21ab21e6c4d7465f66a37136dc15b68970c1f795`.

Caminho CRA antigo/remanescentes mortos removidos em:

`37a03a8bbf9d33221b8a3c75c7f8b847fdffbf97`.

**A informação pedagógica/operacional está validada; a UI atual não é declaração de arte premium final.**

---

## 4. Canários F0 ativos/revalidados nesta retomada

Além dos históricos:

1. `AL.01`
2. `N1.06`
3. `N1.13`
4. `GE.01`
5. `GE.02`
6. `GM.01`
7. `N1.10`
8. `N1.11`

Lista declarativa única:

`src/curriculum/motores/composerCanaryIds.ts`

Promoção futura = **um id por commit**.

---

## 5. F50 / GM.12 — pronta tecnicamente, ainda em observação

Matriz:

`GM.01 comparação direta visível` → **GM.12 massa/capacidade: comparação e conservação** → `GM.05 medidas padronizadas`

- grafo: 90 nós;
- GM.12 registrada em `COMPOSER_FICHAS`, fora dos canários;
- `Recipientes` executável;
- pendências homônimas: `Moedas`, `Regua`;
- F50 é pré-unidade, sem g/kg, L/mL ou cm/m.

**Não promover GM.12 por momentum.** Reavaliar em lote deliberado posterior.

---

## 6. P18 — fechada

`KindType` autoral só contém kinds com builder. Zero exceções. Legado continua em `Question.kind` string.

Documentos:

- `AUDITORIA_P18_KINDS.md`
- `DECISAO_P18_KINDTYPE.md`

---

## 7. QA visual — interpretação

ZIP de sonda não é mockup final. Pode conter rollback, fases intermediárias e componentes novos.

- sonda/layout aprovados ≠ direção artística premium aprovada;
- sempre ler nome/fase da cena antes de interpretar screenshot;
- falha visual objetiva deve corrigir o componente, não afrouxar o fiscal.

---

## 8. Próxima frente deliberada — integridade de estado, migração e dependências

P17/P8 estão fechadas. Não reabrir sem falha objetiva.

### 8.1 Auditoria de migração/estado

Há uma suspeita que precisa ser provada antes de editar:

- `src/App.tsx` possui sua própria função `migrate`;
- `src/utils/migrator.ts` existe como outro migrador;
- busca inicial não encontrou import ativo desse utilitário.

Próximo passo: mapear todos os consumidores e diferenças. Só então decidir consolidar, remover ou testar. **Não apagar migrador por aparência de código morto.**

Itens obrigatórios da auditoria:

- `dojoTracks` em saves antigos/novos;
- add/delete/reset de criança;
- defaults e compatibilidade v1;
- imports/rotas reais do migrador;
- duplicação de regra entre App e utilitário;
- testes de migração existentes/ausentes.

### 8.2 Auditoria de dependências

`npm ci` vem reportando vulnerabilidades (na última observação: 1 low, 3 high).

Executar `npm audit` e identificar:

- pacote exato;
- cadeia direta/transitiva;
- se entra em runtime ou só dev/CI;
- versão corrigida;
- risco de breaking change.

**Não rodar `npm audit fix` cegamente.** Qualquer atualização passa pela suíte/build e, se afetar runtime visual, sonda.

### 8.3 Depois disso

Só então escolher entre:

- correção de integridade/migração/dependência realmente necessária;
- reavaliação deliberada de GM.12;
- próxima faixa/primitiva quando virar gargalo real.

---

## 9. Portões de qualquer lote

```bash
npm run auditar
npm run fichas:auditar
npm run fichas:conferir
npm run grafo:check
npx tsc --noEmit
npm test -- --run
npm run build
npm run pr:check
git diff --check
```

Tela afetada:

```bash
npm run sonda -- "<ID>"
PRINTS_LARGURA=320 PRINTS_WAIT_MS=<estado> node scripts/prints.mjs "<ID>"
```

---

## 10. O que NÃO fazer

- não tocar na `main`;
- não recriar branches históricas;
- não tocar nas branches do Creature Engine;
- não reabrir P17/P8 sem evidência;
- não criar `progress[JD*]`;
- não transformar lentidão em erro conceitual;
- não reintroduzir o Garden CRA genérico;
- não promover GM.12 por conveniência;
- não apagar migrador suspeito sem provar consumidores;
- não aplicar correção de dependência automática sem analisar impacto;
- não tratar sonda como arte final;
- não deixar workflow/script temporário órfão.

**Existir não é estar certo. Divergência pode ser corrigida; divergência silenciosa não.**
