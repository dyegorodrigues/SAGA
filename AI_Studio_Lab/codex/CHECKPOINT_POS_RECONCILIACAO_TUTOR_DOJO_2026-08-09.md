# CHECKPOINT PÓS-RECONCILIAÇÃO + TUTOR ↔ DOJO — SAGA

**Data:** 9/ago/2026  
**Repo:** `dyegorodrigues/SAGA`  
**Branch única deste fluxo:** `codex/integrar-bloco-f0`  
**PR:** #29 — open + draft + NÃO MESCLAR  
**Main protegida:** `68fad4c575e28959b2ca4776e9a541d6828b63f3`  
**Creature Engine:** fora deste fluxo; não tocar.

> Este checkpoint é posterior a `CHECKPOINT_FINAL_NOVA_CONVERSA_2026-08-09.md`. As seções daquele documento que descrevem a reconciliação canônica e o bug `manual | prescribed` como tarefas pendentes passam a ser **histórico da auditoria que motivou este lote**, não estado atual.

---

## 0. REGRAS QUE CONTINUAM INALTERADAS

1. Não tocar em `main`.
2. Não tocar no Creature Engine.
3. Não criar branch auxiliar.
4. PR #29 permanece **draft e não mesclada**.
5. Código/runtime é fonte de verdade para estado implementado; cânone vigente governa a semântica pedagógica.
6. Não reconstruir motores que já existem quando o problema é um contrato de integração.
7. Preservar documentação rica e histórico; reconciliação canônica é cirúrgica.
8. Tela alterada exige sonda real; teste jsdom não deve ser registrado como substituto de Chromium.

---

## 1. RECONCILIAÇÃO CANÔNICA — FECHADA NO RUNTIME E NOS GATES

O lote anterior já havia reconciliado a camada normativa principal:

- grafo/runtime: **90 competências**;
- fichas Markdown: **94**;
- Manual: **90/90** com `GM.12`;
- Método: contagens/ontologia atualizadas sem reduzir o documento;
- Bíblia v3.4: Sensei prescritivo, Jornada como mapa, Dojo em estado separado e RT fora da coroa conceitual;
- auditor de catálogo fortalecido contra retorno das contagens/semânticas antigas.

Durante a retomada foi encontrado um último conflito objetivo: o início do `MANUAL_DIDATICO_SAGA.md` ainda dizia **“3 acertos sobe, 2 erros desce”**, enquanto `progressEngine.ts` executa `bad >= 3` e a Bíblia v3.4 já determina 3 erros.

Correção aplicada de forma cirúrgica:

- Manual: `3 acertos sobe, 3 erros desce`;
- comparação antes/depois confirmou **saldo líquido de uma única linha** no Manual;
- um ponto final removido acidentalmente durante a atualização do blob foi detectado imediatamente e restaurado, preservando o resto do documento;
- novo `AI_Studio_Lab/tools/canonical_doc_guard.cjs` faz o gate falhar se Manual e runtime divergirem novamente nessa regra;
- `npm run auditar` agora executa `catalog_auditor.cjs` **e** `canonical_doc_guard.cjs`.

### Higiene de diff

O antigo `git diff --check` integral produzia falso vermelho por tratar os dois espaços finais usados como **hard break semântico de Markdown** como sujeira. O job `Higiene do diff` continua usando `git diff --check` para código/config/dados, mas exclui `*.md`. A coerência documental permanece coberta pelos auditores canônicos específicos.

---

## 2. TUTOR ↔ DOJO — BUG BLOQUEANTE CORRIGIDO SEM RECONSTRUIR O MOTOR

O pipeline existente foi preservado:

`Question → answerPolicy → progressEngine → marcador transitório → carimbar() → materializeSenseiDojoProgress → dojoTracks`.

O motor de round, `FactStrength`, `ProcStrength`, elegibilidade conceitual e avanço/recuo não foi refeito.

### 2.1 Origem explícita da sessão

Contrato novo:

```ts
type SenseiDojoSessionSource = "manual" | "prescribed";
```

A origem nasce na borda da sessão, acompanha os metadados da questão e chega até a materialização em `dojoTracks`.

Regras agora executáveis:

- `manual` → `adaptive=false` **sempre**, inclusive se `servedStep === currentStep`;
- `prescribed` → `adaptive=true`;
- prática manual continua atualizando força de fatos/procedimentos, precisão, RT, volume e rounds;
- prática manual não altera `currentStep`, `highestStep`, `goodRounds` ou `weakRounds` por autoridade do Tutor;
- Dojo continua sem conceder `dom` ou `masteryEvidence` conceitual.

### 2.2 Round parcial não mistura autoridade

O buffer parcial agora é separado por:

- faixa servida;
- origem da sessão.

Portanto 5 questões manuais + 5 prescritas não formam um round adaptativo híbrido. Um buffer legado sem `source` também não herda autoridade: a próxima questão inicia um novo round compatível.

### 2.3 Prescrição realmente prescrita

`senseiDojoPrescription.ts` já escolhia deterministicamente:

1. `weak-items`;
2. `fluency-gap`;
3. `newly-unlocked`;
4. `refresh`.

Agora todas essas prescrições materializam um `Track` com `source="prescribed"`. O gerador cru/default dos templos permanece `source="manual"`.

---

## 3. SENSEI → MISSÃO DO DOJO — INTEGRAÇÃO IMPLEMENTADA SEM MISTURAR A AULA

A decisão de UX/orquestração é explícita:

- **Aula do Dia** continua sendo a missão conceitual dominante, ou a Oficina causal quando necessário;
- uma necessidade de automaticidade pode aparecer como **missão separada do Dojo prescrita pelo Sensei**;
- o treino livre/manual continua disponível e não ganha autoridade adaptativa por estar na mesma faixa;
- Desafio Misto continua opcional.

Fluxo implementado:

1. `KidHomeScreen` calcula `prescribeSenseiDojo(progress, dojoTracks, localDay())`;
2. `SenseiTab` mostra, quando existe, um card separado **“Prescrição do Sensei”** com templo, faixa e razão;
3. o clique inicia `onTrackLvl(track, step, "prescribed")`;
4. `App` carrega `dojoSource` na rota;
5. antes do `GameLoop`, somente `dojoSource === "prescribed"` autoriza `senseiDojoTrack(temple, "prescribed")`;
6. todas as chamadas existentes sem terceiro argumento permanecem manuais.

Não há inferência por ID, faixa, igualdade com `currentStep`, série ou posição da UI.

---

## 4. `utils/dojoMode.ts` — REBAIXADO, NÃO DESTRUÍDO

`src/utils/dojoMode.ts` foi marcado como `@deprecated` e documentado como rota genérica de free-play/compatibilidade para links/telas antigas que ainda usem `track="dojo"`.

Ele:

- não é autoridade curricular;
- não implementa a prescrição do Sensei;
- não governa os templos adaptativos;
- não substitui `senseiDojoPrescription + senseiDojoSession`.

O comportamento legado foi preservado para não criar regressão lateral desnecessária neste lote.

---

## 5. REGRESSÕES ADICIONADAS

A suíte agora protege, entre outros:

- questão crua/default do templo é `manual`;
- missão do Sensei é `prescribed`;
- 20 respostas prescritas boas podem avançar o ponteiro;
- 20 respostas manuais boas na própria `currentStep` **não** avançam o ponteiro, embora fortaleçam itens e estatísticas;
- round parcial manual não mistura com prescrito;
- retry/acerto após erro não vira fluência de primeira tentativa;
- save legado não recupera coroa conceitual;
- faixa acima do teto conceitual não recebe crédito;
- UI mostra a missão prescrita separada da Aula do Dia;
- clique no card prescrito aciona somente a rota prescrita;
- ausência de prescrição não inventa missão adaptativa.

---

## 6. GATE COMPLETO CONFIRMADO

Head validado antes deste checkpoint:

`0dab0ff5a5e5c547db389c339db5c62b505f008c`

GitHub Actions:

- **CI #647**
- run id: **`31306042539`**
- `Gates do SAGA`: **SUCCESS**
- `Higiene do diff`: **SUCCESS**
- `Guarda de binários`: **SUCCESS**

Dentro de `Gates do SAGA`, passaram:

- `npm ci`;
- `npm run auditar` — incluindo o novo guard canônico;
- `npm run fichas:auditar`;
- `npm run fichas:conferir`;
- `npm run grafo:check`;
- `npx tsc --noEmit`;
- `npm test -- --run`;
- `npm run build`;
- `npm run pr:check`.

---

## 7. SONDA REAL — ÚNICO PORTÃO VISUAL AINDA NÃO DECLARADO FECHADO

A alteração inclui tela (`SenseiTab`), portanto a regra do projeto exige sonda real.

Foi adicionada regressão jsdom para o contrato visual/roteamento, mas **isso não será falsamente registrado como sonda real**.

Neste ambiente de conector GitHub não há checkout executável + Chromium/deployment da branch disponível para rodar `scripts/sonda-layout.mjs` contra a cabeça atual. O script existente foi localizado e preservado; não foi criado workflow temporário para contornar a limitação.

Assim:

- **lote funcional/canônico: verde**;
- **contrato de UI por teste: verde**;
- **sonda real de navegador do novo card: pendente de execução em ambiente com app + Chromium**.

Não avançar afirmando “QA visual fechado” até essa evidência existir.

---

## 8. PRÓXIMA AÇÃO EXATA

1. executar a sonda real do Sensei/Dojo prescrito na cabeça atual da branch e guardar a evidência;
2. se visualmente correta, registrar fechamento visual e rodar o gate final da nova cabeça documental;
3. depois retomar a fila pedagógica sem reabrir Tutor↔Dojo sem falha objetiva:
   - Jardim causal;
   - banco de erros composto;
   - identidade de telemetria/Leitner;
   - `LENTO_DEDOS`;
   - timezone/`lastDay`;
   - recomendador paralelo legado por estrelas;
   - Misto por repertório elegível;
   - Matrícula;
   - cloud reconciliation;
   - simulação longitudinal;
   - gamificação/economia;
   - Coverage Matrix;
   - fábrica curricular;
   - mega auditoria;
   - hardening.

> **Invariante final deste lote:** a criança pode escolher treinar; quando segue uma missão prescrita do Sensei, somente a origem explícita `prescribed` pode governar o ponteiro adaptativo do Dojo.
