# CHECKPOINT FINAL DE CONTINUIDADE — SAGA

**Data:** 9/ago/2026  
**Repo:** `dyegorodrigues/SAGA`  
**Branch única:** `codex/integrar-bloco-f0`  
**PR:** #29 — open + draft + **NÃO MESCLAR**  
**Main protegida:** `68fad4c575e28959b2ca4776e9a541d6828b63f3`  
**Creature Engine:** fora deste fluxo.

> **FONTE OPERACIONAL MAIS NOVA.** Reancore PR/head remoto antes de editar. Checkpoints anteriores são histórico quando conflitarem com este arquivo.

## 1. Regras de ouro

1. Trabalhar somente em `codex/integrar-bloco-f0`.
2. Não tocar/mergear/rebasear/ready/auto-merge `main`.
3. Não tocar no Creature Engine.
4. Não criar branch auxiliar.
5. Não reabrir bloco fechado sem falha objetiva.
6. Bug exige cadeia `emissor → estado → persistência → consumidor → efeito` + regressão.
7. Tela alterada exige Chrome real.
8. Não iniciar fábrica curricular em massa antes da Coverage Matrix.
9. Preservar documentação rica e histórico; checkpoints operacionais podem ser atualizados cirurgicamente.

## 2. Arquitetura pedagógica vigente

- Sensei = autoridade prescritiva, uma meta dominante;
- Jornada = mapa do conhecimento;
- Dojo = automaticidade separada, prescrito + livre/manual;
- Jardim = automaticidade perceptual, prescritível apenas por causa provada;
- Oficina = recuperação conceitual causal curta;
- Misto = opcional/interleaving;
- idade/série = contexto, nunca autoridade curricular;
- gamificação não compra unlock/mastery;
- **RT/fluência não concede nem reprova domínio conceitual**.

## 3. Fechado — não reabrir sem falha objetiva

### P17/P8/P18/P19/P20/P21/P22 + cânone

- 90 competências;
- 94 fichas autorais;
- cobertura 90/90;
- Manual 90/90 + GM.12;
- Bíblia v3.4 / Método reconciliados;
- regra conceitual 3 acertos sobe / 3 erros desce;
- `canonical_doc_guard.cjs` no CI.

### Auditoria longitudinal inicial

- Radar mantém identidade no nó observado e desce pelo DAG;
- Aula composta persiste no `sourceTrackId` real;
- Sensei usa DAG completo, não série;
- Oficina causal usa a mesma porta principal.

### Tutor ↔ Dojo

- origem explícita `manual | prescribed`;
- manual nunca move ponteiro adaptativo;
- prescribed pode mover;
- manual mantém força/RT/precisão/volume;
- round parcial não mistura origem;
- Dojo não concede domínio conceitual;
- missão prescrita chega até GameLoop/persistência e é separada da Aula;
- treino livre/manual permanece;
- `utils/dojoMode.ts` é legado/free-play.

### Jardim causal

- misconception ativa + relação no DAG + mãe conceitualmente elegível + fraqueza JD observada;
- `prerequisite-gap` conceitual tem prioridade;
- ausência de treino, idade, estrela ou erro isolado não bastam;
- menor distância causal vence;
- UI + Chrome real provaram `Base Perceptual → Jardim Guiado → JD1 relance`.

### Banco de erros composto

**Bug provado e corrigido.**

Antes:

- `planAula` escolhia um `bankTrack`;
- `composeAula` misturava bancos de todos os tracks em um `bankQs` global;
- `error-bank` fazia `bankQs.pop()`;
- `shuffleOpts()` removia `review/sig` e o Composer não os restaurava.

Consequências provadas:

- resgate A podia servir item do banco B;
- questão recuperada podia chegar ao GameLoop como questão normal e quebrar hits/remoção do banco.

Agora:

- banco é indexado por `track.id`;
- resgate consome apenas o source correspondente;
- `review=true` + `sig` original sobrevivem;
- regressão determinística com dois bancos-fonte.

Head de fechamento do banco: `22f691c3a26f44cdc1175e79b97d436e5167cf99`.  
CI #682 / run `31308424789` = SUCCESS integral.

### Telemetria / Leitner da Aula composta

**Fechado.**

- `prepareAulaSourceForAnswer()` publica a identidade-fonte efêmera da questão;
- logger normaliza evento de `trackId="aula"` para a competência real;
- formato de telemetria sobe de **v1 → v2**, porque mudou o significado de `trackId`;
- questão comum limpa source antigo para impedir identidade fantasma;
- regressão prova que o Leitner, embora use chave temporária `aula` no frame local, materializa `reviewForce/lastDay` no source real e não persiste `progress.aula`.

Head funcional deste fechamento: `cf925cc239ce7ddad7d33c48e1810a5990aaecd7`.  
CI #691 / run `31308774424` = **SUCCESS integral**, inclusive `Sonda real Sensei`.

## 4. QA real

O CI existente possui job permanente `Sonda real Sensei`:

- Chrome real;
- telefone 390×844;
- tablet 768×1024;
- Dojo prescrito home/round;
- Jardim causal home/relance;
- screenshots;
- overflow;
- HTTP/page errors.

QA não depende mais só de jsdom.

## 5. Dívida curricular — inventariada, não perdida

Fonte detalhada: `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`.

- Composer/padrão-ouro: 26/90;
- servido sem placeholder: 51/90;
- ficha pronta servida por legado: 25;
- ficha pronta sem conteúdo servido: 39;
- divergências ficha↔tela observadas: 21;
- trocas de linguagem visual sem aviso: 12;
- estreias de ferramenta a classificar: 44;
- primitivas: 20 executáveis / 4 renderer-sem-builder / 1 isolada / 1 ausente;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

**A fábrica dos 39 continua depois da Coverage Matrix.**

## 6. PRÓXIMA TAREFA EXATA — `LENTO_DEDOS` / autoridade indevida da velocidade

A pré-auditoria já provou dois conflitos em `GameLoop.tsx`.

### Bug A — resposta correta lenta vira misconception conceitual

No bloco de estrelas/rapid-fire:

```ts
else {
  starGain = 2;
  trackMisconception(p, "LENTO_DEDOS");
}
```

Como `RadarEngine.getRescueItems()` considera duas tags iguais uma misconception ativa, **duas respostas corretas lentas podem acionar resgate conceitual/Oficina**. Isso viola a regra canônica: RT mede automaticidade, não compreensão.

Além disso `LENTO_DEDOS` não pertence hoje ao catálogo `MisconceptionTag`.

### Bug B — resposta rápida injeta streak conceitual

Ainda em `GameLoop.tsx`:

```ts
if (!gardenMode && right && q.kind === "rapid-fire" && durationMs <= 3000 && p.lvl < 5) {
  if (p.streak < 3) p.streak = 3;
}
```

Esse valor é persistido. Na resposta seguinte `applyJourneyAnswer()` herda `streak=3`, incrementa e pode subir `lvl` imediatamente. Portanto **velocidade pode acelerar a escada conceitual**, também proibido pelo cânone.

### Método obrigatório do próximo bloco

1. escrever regressões que provem os dois efeitos sem alterar produção;
2. definir `LENTO_DEDOS` como sinal de automaticidade/fluência, não misconception conceitual;
3. impedir que acerto lento correto alimente `Progress.misconceptions`/Radar;
4. remover qualquer bônus de RT que altere `streak/lvl/dom/masteryEvidence` conceitual;
5. manter RT/estrelas/Dojo como sinais/recompensas separados;
6. provar que prescribed Dojo continua recebendo RT/strength normalmente;
7. provar que Journey rapid-fire rápido e lento têm a **mesma autoridade conceitual** quando ambos estão corretos;
8. gates completos + Chrome real;
9. checkpoint.

Não usar o antigo `TAG_TO_NODE`; ele foi removido corretamente.

## 7. Fila depois de `LENTO_DEDOS`

1. timezone/`lastDay`;
2. recomendador paralelo por estrelas — retirar autoridade concorrente;
3. Misto por repertório elegível;
4. Matrícula sem grade rígida;
5. cloud reconciliation;
6. simulação longitudinal;
7. gamificação/economia/mascote;
8. Coverage Matrix executável;
9. fábrica curricular por ondas — 25 legados + 39 vazios + paridade + primitivas;
10. mega auditoria pedagógica;
11. hardening/performance/release.

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

O CI da PR também roda higiene do diff e guarda de binários.

## 9. Prompt curto de retomada

> Continue o SAGA pela fonte operacional `AI_Studio_Lab/codex/CHECKPOINT_FINAL_CONTINUIDADE_2026-08-09.md`. Reancore primeiro a PR #29 e o head remoto da `codex/integrar-bloco-f0`; mantenha a PR draft/unmerged e não toque na main nem no Creature Engine. Cânone, Tutor↔Dojo, QA real, Jardim causal, banco composto e identidade de telemetria/Leitner estão fechados; não reabra sem falha objetiva. Comece pelo bloco `LENTO_DEDOS` do §6: escreva primeiro regressões que provem (a) resposta correta lenta entrando em misconception/Radar e (b) rapid-fire rápido injetando `streak` conceitual; depois remova a autoridade curricular da velocidade preservando RT/fluência/Dojo/estrelas. Rode todos os gates e atualize o checkpoint. Não inicie ainda a fábrica dos 39 fallbacks; ela está inventariada e entra depois da Coverage Matrix.

**A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**
