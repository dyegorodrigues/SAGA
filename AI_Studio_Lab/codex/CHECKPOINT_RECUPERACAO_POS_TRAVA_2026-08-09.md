# CHECKPOINT DE RECUPERAÇÃO PÓS-TRAVA — SAGA

**Data:** 9/ago/2026  
**Repo:** `dyegorodrigues/SAGA`  
**Branch única:** `codex/integrar-bloco-f0`  
**PR:** #29 — open + draft + **NÃO MESCLAR**  
**Main protegida:** `68fad4c575e28959b2ca4776e9a541d6828b63f3`  
**Creature Engine:** fora deste fluxo.

> **FONTE OPERACIONAL VIGENTE APÓS AS TRAVAS DO CHAT.** Este checkpoint deve prevalecer sobre filas antigas. Reancore PR/head/CI no GitHub remoto antes de editar.

## 1. Estado remoto fechado

Último head funcional deste checkpoint:

`fc6227f14be69fcf95cd173a973a24a800479800`

Evidência:

- CI #720 / run `31310675620`: **SUCCESS integral**;
- auditorias curriculares/fichas: sucesso;
- grafo: sucesso;
- TypeScript: sucesso;
- suíte completa: sucesso;
- build: sucesso;
- `pr:check`: sucesso;
- higiene do diff: sucesso;
- guarda de binários: sucesso;
- Chrome real `Sonda real Sensei`: sucesso.

PR #29 permanece open + draft + unmerged. Nada depende de estado local perdido do chat.

## 2. Regras de ouro

1. Trabalhar somente em `codex/integrar-bloco-f0`.
2. Não tocar, mergear, rebasear, marcar ready ou habilitar auto-merge na `main`/PR.
3. Não tocar no Creature Engine.
4. Não criar branch auxiliar.
5. Não reabrir bloco fechado sem falha objetiva.
6. Bug exige cadeia `emissor → estado → persistência → consumidor → efeito` e regressão.
7. Alteração visual exige Chrome real.
8. Não iniciar fábrica curricular em massa antes da Coverage Matrix.
9. Preservar documentação rica e histórico; checkpoints anteriores continuam como ata.

## 3. Arquitetura pedagógica vigente

- Sensei = autoridade prescritiva, uma meta dominante;
- Jornada = mapa do conhecimento;
- Dojo = automaticidade separada, prescrito + livre/manual;
- Jardim = automaticidade perceptual, prescritível apenas por causa provada;
- Oficina = recuperação conceitual causal curta;
- Misto = opcional/interleaving apenas sobre repertório seguro;
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
- Chrome real em telefone 390×844 e tablet 768×1024;
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

Evidência: CI #682 / run `31308424789`.

### Telemetria / Leitner da Aula composta

- telemetria v2: `trackId` = competência-fonte real;
- source efêmero é limpo entre questões;
- Leitner materializa `reviewForce/lastDay` no source real;
- `progress.aula` não persiste.

Evidência: CI #691 / run `31308774424`.

### `LENTO_DEDOS` / autoridade da velocidade

- Radar conceitual aceita somente tags do catálogo canônico;
- `LENTO_DEDOS` legado não abre Oficina, inclusive em save antigo;
- `streak` conceitual não pode ser injetado por bônus de RT/UI;
- resposta correta rápida ou lenta tem a mesma autoridade curricular;
- Dojo/RT/estrelas seguem separados da escada conceitual.

Evidência: head `d3ffd4f5ca7981b32ffc4b2c90cc963e69231c5a`; CI #702 / run `31309761131`.

Observação: `GameLoop.tsx` ainda contém fisicamente tentativas legadas de `LENTO_DEDOS`/`p.streak=3`, mas os boundaries canônicos neutralizam a autoridade. Remoção física futura só com patch seguro do arquivo grande.

### Timezone / identidade civil do dia

**Fechado.**

Problema provado: App/economia já usavam dia local, enquanto Jornada/Leitner/Matrícula/Jardim/Dojo ainda recebiam/escreviam `toISOString().slice(0,10)`, criando split-brain UTC × calendário local perto da meia-noite.

Solução:

- novo `src/utils/calendarDay.ts` como autoridade de calendário civil;
- `localDay()` no fuso do dispositivo;
- regressão pura por offset (`UTC−3`, offset positivo);
- `calendarDayDistance()` conta dias civis, não blocos de 24h — resistente a DST;
- `migrator.ts` reexporta `localDay` para compatibilidade e usa distância civil no mascote;
- Leitner grava dia local e vence por distância civil;
- Matrícula semeia `lastDay` local;
- Jardim/Dojo normalizam `practiceDay` legado;
- Journey/mastery normalizam `practiceDay` e retenção usa dias civis;
- boundary de `lastDay` intercepta writer UTC legado do GameLoop sem precisar regravar o componente gigante.

Falha encontrada durante QA: a primeira versão tornava `lastDay: undefined` uma chave enumerável e quebrava round-trip de save. O teste antigo capturou. Correção: antes da primeira data, o interceptor é não-enumerável; na primeira gravação real torna-se enumerável/serializável já normalizado. O teste não foi afrouxado.

Regressões: `calendarDay.test.ts`, `timezoneDayRouting.test.ts` e suíte preexistente de round-trip.

Evidência final: head `a9e2a382698be7979f2f5b0e3ce012dab64b5fc6`; CI #717 / run `31310499361` = **SUCCESS integral**, inclusive Chrome.

### Recomendador paralelo por estrelas

**Fechado.**

Problema provado:

- `KidHomeScreen.tsx` calculava uma segunda recomendação curricular;
- banco de erros tinha prioridade; sem banco escolhia a trilha acessível com menos `stars`;
- `SenseiTab` exibia isso dentro de `Missões do Dojô` como `Treino Livre Sugerido`;
- não movia o progresso sozinho, mas fazia estrelas/heurística competirem visualmente com a prescrição do Sensei.

Correção:

- cálculo `rec` por estrelas/banco removido do `KidHomeScreen`;
- contrato e card `Treino Livre Sugerido` removidos do `SenseiTab`;
- revisão por banco continua no Composer/Radar/Oficina;
- exploração livre continua nas portas próprias Jornada/Dojo;
- regressão `SenseiTab.test.tsx` exige ausência da recomendação paralela.

Evidência final: head `fc6227f14be69fcf95cd173a973a24a800479800`; CI #720 / run `31310675620` = **SUCCESS integral**, inclusive Chrome real.

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

## 6. Próxima tarefa exata — Misto por repertório elegível

Pré-auditoria já provou duas fontes de risco.

### Runtime atual

`App.tsx` constrói o Misto assim:

- escolhe `SUBJECTS[mat].tracks[kid.grade]`;
- passa esse recorte para `buildMixedTrack()`.

`mixedChallenge.ts` então:

- pode puxar banco de qualquer track recebido;
- escolhe a pior precisão entre tracks recebidos;
- completa com tracks aleatórias recebidas;
- **não verifica explicitamente domínio/segurança/elegibilidade conceitual**.

Isso conflita com dois princípios vigentes:

1. série/idade não pode decidir o universo curricular;
2. Misto é interleaving de repertório já conquistado, não exposição aleatória a conteúdo não seguro.

### Cadeia obrigatória

`DAG + Progress → repertório elegível → pool do Misto → banco/pior/aleatória → Question source → GameLoop → persistência`.

### Método

1. definir função pura de repertório elegível usando o universo matemático canônico + evidência de progresso real;
2. não usar `kid.grade` como filtro do conteúdo do Misto;
3. excluir nós nunca praticados/sem segurança conceitual;
4. decidir critério mínimo com base no estado existente (`dom`, `maxLvl/lvl`, prerequisites), sem criar uma nova árvore paralela;
5. banco só pode contribuir se seu source pertence ao repertório elegível;
6. pior precisão só dentro do repertório elegível;
7. aleatórias só dentro do repertório elegível;
8. se repertório insuficiente, Misto deve ficar indisponível ou reduzir composição de forma explícita — nunca gerar conteúdo arbitrário;
9. preservar Misto como opcional, sem autoridade de unlock/mastery;
10. regressões com trilha dominada, trilha apenas desbloqueada, trilha nunca praticada e trilha fora da antiga grade;
11. gates completos + Chrome se CTA/disponibilidade mudar;
12. checkpoint.

## 7. Fila depois do Misto

1. Matrícula sem grade rígida;
2. cloud reconciliation;
3. simulação longitudinal;
4. gamificação/economia/mascote;
5. Coverage Matrix executável;
6. fábrica curricular por ondas — 25 legados + 39 vazios + paridade + primitivas;
7. mega auditoria pedagógica;
8. hardening/performance/release.

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

CI também roda higiene do diff e guarda de binários.

## 9. Prompt de retomada para novo chat/agente

> Continue o SAGA usando como fonte principal `AI_Studio_Lab/codex/CHECKPOINT_RECUPERACAO_POS_TRAVA_2026-08-09.md`. Reancore primeiro PR #29 e o head remoto de `codex/integrar-bloco-f0`; mantenha PR draft/unmerged e não toque na main nem no Creature Engine. Tudo até timezone e remoção do recomendador paralelo por estrelas está fechado no head funcional `fc6227f14be69fcf95cd173a973a24a800479800`, CI #720/run `31310675620` integralmente verde, inclusive Chrome real. Não reabra blocos fechados sem falha objetiva. Comece pelo §6, Misto por repertório elegível: prove a cadeia DAG/Progress→pool→questões, elimine `kid.grade` como filtro curricular, não permita conteúdo nunca praticado/sem segurança, filtre banco/pior/aleatórias pelo mesmo repertório e trate pool insuficiente explicitamente. Rode todos os gates e atualize este checkpoint. Não iniciar ainda a fábrica dos 39 fallbacks; ela permanece inventariada para depois da Coverage Matrix.

**A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**
