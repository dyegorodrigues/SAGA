# CHECKPOINT DE RECUPERAÇÃO PÓS-TRAVA — SAGA

**Data:** 9/ago/2026  
**Repo:** `dyegorodrigues/SAGA`  
**Branch única:** `codex/integrar-bloco-f0`  
**PR:** #29 — open + draft + **NÃO MESCLAR**  
**Main protegida:** `68fad4c575e28959b2ca4776e9a541d6828b63f3`  
**Creature Engine:** fora deste fluxo.

> **FONTE OPERACIONAL VIGENTE APÓS A TRAVA DO CHAT.** O estado abaixo foi reconstruído e confirmado pelo GitHub remoto, não pela memória da conversa. Reancore PR/head/CI antes de qualquer edição futura.

## 1. Estado remoto confirmado

- head funcional fechado: `d3ffd4f5ca7981b32ffc4b2c90cc963e69231c5a`;
- PR #29: open, draft, unmerged;
- base: `main` em `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- CI #702 / run `31309761131`: **SUCCESS integral**;
- passaram: auditoria curricular, auditoria/conformidade das fichas, grafo, TypeScript, suíte completa, build, guarda textual, higiene do diff, guarda de binários e Chrome real;
- suíte: **2.287 testes**;
- sonda Chrome real: SUCCESS em telefone/tablet para Sensei→Dojo e Sensei→Jardim.

Nada deste bloco depende de estado local perdido do chat.

## 2. Regras de ouro

1. Trabalhar somente em `codex/integrar-bloco-f0`.
2. Não tocar, mergear, rebasear, marcar ready ou habilitar auto-merge na `main`/PR.
3. Não tocar no Creature Engine.
4. Não criar branch auxiliar.
5. Não reabrir bloco fechado sem falha objetiva.
6. Bug exige cadeia `emissor → estado → persistência → consumidor → efeito` e regressão.
7. Alteração visual exige Chrome real.
8. Não iniciar fábrica curricular em massa antes da Coverage Matrix.
9. Preservar documentação rica e histórico; checkpoints antigos continuam como ata do raciocínio.

## 3. Arquitetura pedagógica vigente

- Sensei = autoridade prescritiva, uma meta dominante;
- Jornada = mapa do conhecimento;
- Dojo = automaticidade separada, prescrito + livre/manual;
- Jardim = automaticidade perceptual, prescritível apenas por causa provada;
- Oficina = recuperação conceitual causal curta;
- Misto = opcional/interleaving;
- idade/série = contexto, nunca autoridade curricular;
- gamificação não compra unlock/mastery;
- **RT/fluência não concede nem reprova domínio conceitual**.

## 4. Fechado — não reabrir sem falha objetiva

### Cânone / currículo / P17–P22

- 90 competências;
- 94 fichas autorais;
- cobertura autoral 90/90;
- Manual + Bíblia v3.4 + Método reconciliados;
- regra conceitual: 3 acertos sobe / 3 erros desce;
- guard canônico no CI.

### Auditoria longitudinal inicial

- Radar mantém identidade no nó observado e usa o DAG para causa;
- Aula composta persiste no `sourceTrackId` real;
- Sensei usa DAG completo, não série como trilho;
- lacuna conceitual causal vira Oficina pela mesma porta do Tutor.

### Tutor ↔ Dojo

- origem explícita `manual | prescribed`;
- manual nunca move ponteiro adaptativo;
- prescribed pode mover;
- manual continua registrando força/RT/precisão/volume;
- rounds parciais não misturam origem;
- Dojo não concede domínio conceitual;
- missão prescrita é separada da Aula;
- treino livre/manual permanece.

### QA real

- job permanente `Sonda real Sensei` no CI;
- Chrome real;
- telefone 390×844 e tablet 768×1024;
- Sensei/Dojo prescrito home + round;
- Sensei/Jardim causal home + relance JD1;
- screenshots, overflow, HTTP/page errors.

### Jardim causal

- misconception ativa + relação no DAG + mãe conceitualmente elegível + fraqueza JD observada;
- `prerequisite-gap` conceitual tem prioridade;
- ausência de treino, idade, estrela ou erro isolado não bastam.

### Banco de erros composto

- pool por `track.id`;
- `error-bank` só consome o próprio source;
- `review=true` e `sig` original sobrevivem ao Composer;
- resgate A não serve banco B.

Evidência: CI #682 / run `31308424789` = SUCCESS integral.

### Telemetria / Leitner da Aula composta

- telemetria v2: `trackId` significa a competência-fonte real da questão;
- source efêmero é limpo entre questões;
- Leitner materializa `reviewForce/lastDay` no source real;
- `progress.aula` não persiste.

Evidência: CI #691 / run `31308774424` = SUCCESS integral.

### `LENTO_DEDOS` / autoridade da velocidade

**Fechado no CI #702.**

Problemas encontrados:

1. rapid-fire correto lento chamava `trackMisconception(p, "LENTO_DEDOS")`, podendo transformar lentidão em Oficina conceitual;
2. rapid-fire correto rápido tentava `p.streak = 3`, podendo dar autoridade curricular ao RT.

Correção defensiva:

- `radarEngine.ts` aceita no Radar conceitual somente tags do catálogo `MisconceptionTag`;
- saves legados com `LENTO_DEDOS` também são ignorados por `getRescueItems()`;
- `progressEngine.ts` protege o `streak` calculado pelo motor contra mutação imperativa externa pós-engine;
- rapidez/lentidão correta têm a mesma autoridade conceitual;
- tags conceituais canônicas continuam sendo registradas/resgatadas;
- Dojo/RT/estrelas continuam separados da escada conceitual;
- fixtures antigos do Composer foram corrigidos para usar `MisconceptionTag.RECONTOU`, em vez da string inventada `contagem-dupla`.

Regressão: `velocityConceptualAuthority.test.ts`.

Evidência final: head `d3ffd4f5ca7981b32ffc4b2c90cc963e69231c5a`; CI #702 / run `31309761131` = **SUCCESS integral**.

Observação de hardening: `GameLoop.tsx` ainda contém as duas tentativas legadas (`LENTO_DEDOS` e `p.streak=3`), mas elas não possuem mais autoridade nos boundaries canônicos. Remoção física futura deve ser feita apenas com patch seguro do arquivo grande e regressões mantidas; não reabrir a semântica já fechada.

## 5. Dívida curricular inventariada — NÃO PERDIDA

Fonte detalhada: `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`.

- Composer/padrão-ouro: 26/90;
- servido sem placeholder: 51/90;
- 25 fichas prontas ainda em legado;
- 39 fichas prontas sem conteúdo servido;
- 21 divergências ficha↔tela;
- 12 trocas de linguagem visual sem aviso;
- 44 estreias de ferramenta a classificar;
- primitivas: 20 executáveis / 4 renderer-sem-builder / 1 isolada / 1 ausente;
- incompletas: `LinkingCubes`, `Moedas`, `SingaporeBars`, `VisualAddition`, `Quadrado100`, `Regua`;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

**Não iniciar a fábrica dos 39 antes da Coverage Matrix.**

## 6. Próxima tarefa exata — timezone / identidade do dia (`lastDay`)

Pré-auditoria já encontrou múltiplos escritores de dia usando UTC:

- `GameLoop.tsx`: `practiceDay`, `p.lastDay` e rounds usam `new Date().toISOString().slice(0, 10)`;
- `radarEngine.ts`: Leitner grava `lastDay` com o mesmo padrão;
- `matricula.ts` também contém geração de data por ISO UTC;
- consumidores de `lastDay` incluem Radar/Leitner, Composer e fluxos de sessão/recompensa.

Risco: `toISOString()` troca o dia em UTC, não no calendário local da criança. Em fusos negativos, uma prática noturna pode ser registrada como o dia seguinte; em fusos positivos ocorre o inverso perto da meia-noite. Isso pode afetar revisão espaçada, identidade de sessão, retenção e bônus diário.

### Cadeia obrigatória antes de editar

`relógio local → day key → GameLoop/Jardim/Dojo/Leitner → Progress.lastDay/masteryEvidence/log → getDueReviews/Composer/bônus → save/cloud`.

### Método

1. inventariar todos os escritores e consumidores de `YYYY-MM-DD`;
2. criar helper puro único para chave de dia local, sem hardcode de timezone do desenvolvedor;
3. criar helper puro de distância entre dias de calendário, evitando aritmética de horário/DST;
4. regressões em virada UTC/local (incluindo UTC−3 e UTC+offset);
5. migrar writers relevantes para a mesma função;
6. garantir que revisão espaçada, mastery session day, first-mission/log e Dojo/Jardim concordem sobre “hoje”;
7. não alterar semântica de intervalos Leitner além da correção de identidade do dia;
8. gates completos + Chrome se o fluxo de UI/persistência for tocado;
9. checkpoint.

## 7. Fila depois de timezone

1. recomendador paralelo por estrelas — retirar autoridade concorrente;
2. Misto por repertório elegível;
3. Matrícula sem grade rígida;
4. cloud reconciliation;
5. simulação longitudinal;
6. gamificação/economia/mascote;
7. Coverage Matrix executável;
8. fábrica curricular por ondas — 25 legados + 39 vazios + paridade + primitivas;
9. mega auditoria pedagógica;
10. hardening/performance/release.

## 8. Gates

```bash
npm run auditar
npm run fichas:auditar
npm run fichas:conferir
npm run grafo:check
npx tsc --noEmit
npm test -- --run
npm run build
npm run pr:check
npm run sonda:sensei-dojo
```

O CI também roda higiene do diff e guarda de binários.

## 9. Prompt de retomada para novo chat/agente

> Continue o SAGA usando como fonte principal `AI_Studio_Lab/codex/CHECKPOINT_RECUPERACAO_POS_TRAVA_2026-08-09.md`. Reancore primeiro a PR #29 e o head remoto de `codex/integrar-bloco-f0`; mantenha a PR draft/unmerged e não toque na main nem no Creature Engine. Tudo até `LENTO_DEDOS` está fechado no head `d3ffd4f5ca7981b32ffc4b2c90cc963e69231c5a`, CI #702/run `31309761131` integralmente verde, inclusive Chrome real. Não reabra esses blocos sem falha objetiva. Comece pela auditoria `timezone/lastDay` do §6: prove todos os escritores/consumidores de day key, centralize o conceito de dia local em helper puro, teste viradas UTC/local e DST, preserve intervalos Leitner e alinhe GameLoop/Jardim/Dojo/mastery/log/recompensa. Rode todos os gates e atualize este checkpoint. Não iniciar ainda a fábrica dos 39 fallbacks; ela permanece inventariada para depois da Coverage Matrix.

**A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**
