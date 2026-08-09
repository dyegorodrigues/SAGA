# CHECKPOINT FINAL PARA NOVA CONVERSA — SAGA

**Data:** 9/ago/2026  
**Repo:** `dyegorodrigues/SAGA`  
**Branch única deste fluxo:** `codex/integrar-bloco-f0`  
**PR:** #29 — open + draft + NÃO MESCLAR  
**Main protegida:** `68fad4c575e28959b2ca4776e9a541d6828b63f3`  
**Creature Engine:** fora deste fluxo; não tocar.

> Este documento é a primeira leitura de qualquer conversa nova. Ele corrige pontos que ficaram desatualizados no `CHECKPOINT_EMERGENCIA_2026-08-09.md` após a auditoria final do próprio runtime.

---

## 0. REGRAS DE RETOMADA

1. Código/runtime é fonte de verdade sobre o que realmente está implementado.
2. Não reabrir bloco fechado sem falha objetiva.
3. Não tocar em `main`.
4. Não tocar no Creature Engine.
5. Não criar branch auxiliar.
6. PR #29 permanece draft/unmerged.
7. Nada de workflow/publicador temporário para editar o repo.
8. Mudança pedagógica material exige reconciliação do cânone, preservando conteúdo histórico e didático.
9. Não “corrigir” teste para espelhar o código; decidir pelo cânone/runtime comprovado e registrar a razão.
10. Todo lote termina com gates e checkpoint atualizado.

---

## 1. O FLUXO ANTERIOR AO DEBATE DO DOJO ESTÁ PRESERVADO

### P21/P22 concluídos

- grafo: **90/90**;
- fichas Markdown: **94**;
- cobertura autoral: **90/90**;
- exceções autorais: **0**;
- Journey: **31/31**;
- Composer: **26 registrados / 26 ativos / 0 inativos**;
- servido sem placeholder: **51/90**;
- fallback real: **39/90**;
- Jardim: **JD1–JD5**;
- primitivas: **20 executáveis / 4 renderer-sem-builder / 1 isolada / 1 ausente**.

Fechados: P17, P8, P18, P19, P20, P21.1, P21.2, P22.1, P22.2, P22.3A, P22.3B, P22.4 e P22.5.

Evidências principais:

- N1.09: `31286476155`; sonda real `31286955931`; clean `31287106974`;
- GM.02: `31287744035`; sonda corrigida `31288014568`; clean `31288136803`.

### Auditoria longitudinal já fechada antes de Tutor↔Dojo

1. **Radar tag→nó corrigido** — o nó observado permanece fonte; `rescuePlanner` decide descida pelo DAG. Gate `31288516415`.
2. **Aula composta persiste no source real** — `sourceTrackId/sourceGraphId/sourceLevel`; `progress.aula` não vira evidência. Gate `31290512422` (CI 585).
3. **Sensei não usa série como trilho curricular** — universo canônico completo; dose adaptativa V1 por estado. Gate `31290796584` (CI 589).
4. **Uma porta do Tutor** — lacuna causal pode transformar a Aula do Dia em Oficina prescrita. Gate `31290937246` (CI 593).

Isto é o fluxo que estava em andamento ANTES da longa explicação sobre Dojo/Sensei. Ele não foi perdido nem substituído.

---

## 2. ONTOLOGIA PEDAGÓGICA VIGENTE

### Sensei / Tutor

É a autoridade prescritiva do percurso. A criança entra e recebe uma missão clara. Ela não monta o próprio currículo.

A Aula do Dia:

- tem **uma meta conceitual dominante**;
- é recalculada a partir do Learner Model;
- pode aquecer, revisar, resgatar ou prescrever fluência apenas com função explícita;
- não é “mistureba” nem sorteio;
- adapta representação, andaime, dose e próximo passo;
- usa domínio/evidência/pré-requisitos, nunca idade/série como catraca.

### Jornada

É o mapa do conhecimento: mostra competências, dependências, fronteira e conquistas. Não é a inteligência que sequencia o dia.

### Dojo

Automaticidade/prática deliberada em estado separado do domínio conceitual.

Duas portas:

- **prescrita pelo Sensei**;
- **livre/manual**, dentro do repertório conceitualmente seguro.

Dojo nunca concede `dom` conceitual.

### Jardim

Bases perceptuais/pré-simbólicas (JD1–JD5). Pode ser prescrito causalmente quando uma dificuldade simbólica aponta para base perceptual insuficiente.

### Oficina

Recuperação causal, curta, encorajadora e com critério de saída. Não é punição nem depósito de erros.

### Desafio Misto

Retrieval/interleaving/desafio opcional. Nunca é autoridade curricular.

### Gamificação / mascote / economia

Devem gerar vínculo, prazer e retenção sem comprar unlock, mastery ou atalhos pedagógicos. A auditoria sistêmica de economia/gamificação continua na fila posterior.

---

## 3. TUTOR ↔ DOJO — ESTADO REAL DO RUNTIME (CORRIGE O CHECKPOINT ANTERIOR)

### 3.1 O que já existe

#### Templos de 10 faixas

- `dojo_add`
- `dojo_sub`
- `dojo_mul`
- `dojo_div`

Cada templo possui 10 faixas e geradores reais.

#### Política de elegibilidade

`senseiDojoPolicy.ts` liga cada faixa a conceitos do grafo e classifica item como `fact` ou `procedure`.

`maxEligibleSenseiDojoStepById()` impede o Dojo de correr à frente da compreensão.

#### Motor longitudinal

`senseiDojoEngine.ts` já implementa:

- round de 10 itens;
- avanço com precisão + fluência;
- dois bons rounds para subir;
- dois rounds <60% para recuar treino;
- `FactStrength`;
- `ProcStrength`;
- `currentStep/highestStep`;
- `goodRounds/weakRounds`;
- prática `adaptive=false` que deveria atualizar força sem mover ponteiro;
- nenhuma concessão de mastery conceitual.

#### Sessão/política

`senseiDojoSession.ts` resolve teto, projeção visual e tentativa terminal.

`senseiDojoPrescription.ts` escolhe deterministicamente, sem sorteio:

1. `weak-items`;
2. `fluency-gap`;
3. `newly-unlocked`;
4. `refresh`.

#### Pipeline de persistência — JÁ IMPLEMENTADO

O checkpoint anterior dizia que ainda faltava construir tudo isto. Isso ficou desatualizado.

`src/curriculum/motores/senseiDojoProgressContext.ts` já conecta:

`Question fluency meta → recordSenseiDojoAttempt → consumeSenseiDojoTerminal → progress transitório → carimbar() → materializeSenseiDojoProgress → dojoTracks`.

A integração está ligada em:

- `answerPolicy.ts` — conta tentativas reais, inclusive retries;
- `progressEngine.ts` — intercepta Dojo antes da progressão Journey;
- `reconciliacaoDeSaves.ts` — materializa antes de React/local/cloud.

Regressões em `senseiDojoProgressContext.test.ts` provam:

- uma resposta entra em round parcial de `dojoTracks`, não em domínio curricular;
- 10 respostas fecham um round;
- 20 respostas boas podem avançar faixa;
- o `Progress` conceitual permanece inalterado;
- acerto após erro/retry não conta como fluência de primeira tentativa;
- save legado `progress.dojo_*` perde coroa conceitual na migração;
- faixa acima do teto conceitual não recebe crédito.

### 3.2 BUG BLOQUEANTE REAL DESCOBERTO NA AUDITORIA FINAL

O pipeline ainda **não carrega explicitamente a origem da sessão** (`prescribed` vs `manual`).

Hoje `materializeSenseiDojoProgress` decide:

`adaptive = servedStep === currentStep`.

Consequência:

> se a criança escolher MANUALMENTE justamente a faixa que também é `currentStep`, o motor pode tratá-la como treino adaptativo e mover o ponteiro do Tutor.

Isso viola o invariante:

- prescrito pelo Sensei → `adaptive=true`;
- livre/manual → `adaptive=false`.

**Primeiro bug de código do próximo lote:** tornar a origem explícita de ponta a ponta e adicionar regressão que prova que treino manual no próprio `currentStep` não altera `currentStep/goodRounds/weakRounds`, embora atualize FactStrength/ProcStrength/estatísticas.

### 3.3 Integração ainda faltante com o Sensei

`senseiDojoPrescription.ts` existe, mas a prescrição ainda não é autoridade da experiência do Tutor:

- `senseiOrchestrator.ts` hoje decide apenas `lesson | rescue`;
- `KidHomeScreen` não consome `prescribeSenseiDojo` como parte da Aula do Dia;
- o botão automático do `LevelPickerModal` só aparece se receber `onTrack`, e o `KidHomeScreen` atual não o fornece;
- `App.tsx` mantém `screen.track === "dojo"` ligado ao `utils/dojoMode.ts` legado;
- `utils/dojoMode.ts` ainda sorteia `FLUENCY_IDS`, força nível >=4 e RT=5s.

Portanto, **o próximo objetivo não é construir o motor do zero**. É:

1. corrigir origem manual/prescrita;
2. conectar `prescribeSenseiDojo` ao Sensei/Aula do Dia de forma coerente com a meta dominante;
3. manter prática livre manual segura;
4. aposentar `utils/dojoMode.ts` como autoridade;
5. provar UI + persistência + próxima prescrição.

---

## 4. AUDITORIA DO CÂNONE — DÍVIDA REAL DESCOBERTA ANTES DA TROCA DE CHAT

O grafo executável está em **90 competências** e passa os gates. Porém partes da prosa canônica ainda carregam estados históricos.

### 4.1 `GRAFO_DE_CONHECIMENTO_SAGA.md` / YAML / JSON / TS

Contagem 90 está coerente no runtime/auditor. **Não alterar topologia por causa do debate Sensei↔Dojo**: a mudança é de motor/orquestração, não de competência.

### 4.2 `MANUAL_DIDATICO_SAGA.md` — deriva confirmada

O fecho ainda diz:

- “nenhuma das **89 competências**...”;
- “**89 de 89**”;
- changelog final para em N1.13/89;
- a didática de GM.12 ainda precisa ser reconciliada explicitamente.

O conteúdo didático rico deve ser PRESERVADO. Não reescrever/encurtar o arquivo para corrigir dois números.

### 4.3 `METODO_SAGA.md` — deriva confirmada

Ainda contém formulações históricas:

- “grafo de 89 competências”;
- “92 fichas cobrindo 89”;
- tabela final 89/90;
- Jornada “leva 1→3” e Dojo “leva 3→5” como se compartilhassem a mesma proficiência;
- `counting on` com RT <8s como critério conceitual.

Uma tentativa de 9/ago de substituir o arquivo por versão resumida foi **imediatamente rejeitada por governança**, porque removeria riqueza didática. O blob original foi restaurado integralmente no commit `14ebaab8f30b0b4dee31c8acba7526820ee17b41`; o `content_sha` voltou exatamente a `c172abe642f3f455e2f297d710d3d692523df1a3`.

A reconciliação futura deve ser **cirúrgica**, preservando o texto completo.

### 4.4 `BIBLIA_DO_SAGA.md` — deriva normativa interna confirmada

A v3.3 já adiciona GM.12 e fecha em 90 no changelog, e §5.1-bis diz corretamente que RT não bloqueia compreensão.

Mas trechos anteriores ainda contradizem isso:

- §5 chama nível 5 de “Fluência / Dojo” e inclui RT na coroa;
- §6 mantém uma receita/dose por faixa etária;
- §11.9 volta a misturar fluência/RT com coroa conceitual;
- §12.2-bis e §12.3 ainda descrevem Jornada 1→3 e Dojo 3→5 como uma escada compartilhada;
- há referências numéricas históricas que precisam permanecer apenas quando claramente marcadas como história.

Não apagar história; corrigir a camada normativa e bump de versão de forma explícita.

### 4.5 O auditor de catálogo possui um falso verde documental

`AI_Studio_Lab/tools/catalog_auditor.cjs` usa `EXPECTED_COMPETENCIES = 90`, mas o contrato de prosa ainda procura:

- Manual: `/89 de 89/`;
- Método: `/grafo de 89 competências/`.

Logo um CI verde atual **não prova que Manual/Método estão atualizados**; pelo contrário, hoje ele exige as frases antigas.

**Primeiro lote documental da próxima conversa:** reconciliar Bíblia + Manual + Método sem perder conteúdo e mudar o auditor para exigir 90/90 e a ontologia pós-P22.

Somente depois considerar o cânone “verde” novamente.

---

## 5. INCIDENTE TRANSITÓRIO DESTA AUDITORIA — JÁ REVERTIDO

Foi criado o commit `b30815148a621eea6819f195623b53c1346fd5e9` com uma versão conceitualmente atualizada, porém excessivamente resumida, do Método. O CI 619 também ficou vermelho porque o auditor exigia a frase antiga de 89.

A alteração foi **revertida pelo conteúdo**, não escondida:

- commit de restauração: `14ebaab8f30b0b4dee31c8acba7526820ee17b41`;
- `METODO_SAGA.md` voltou ao blob original `c172abe642f3f455e2f297d710d3d692523df1a3`.

Não reescrever o histórico da branch para esconder um ensaio falho. A árvore final deve ficar correta e o incidente serve de precedente: **reconciliação canônica não pode reduzir documentação rica**.

---

## 6. HIGIENE DE GIT CONFIRMADA

Branches observadas no repo:

- `main`;
- `codex/integrar-bloco-f0`;
- `agent/creature-engine-tamagotchi`;
- `codex/criar-branch-para-creature-engine-tamagotchi`.

Nenhuma branch auxiliar nova foi criada por este fluxo.

O inventário do PR #29 não mostrou workflow/publicador temporário residual.

PR #29 permanece:

- open;
- draft;
- base `main`;
- não mesclado.

A main continua protegida no SHA informado acima.

---

## 7. ORDEM EXATA DA PRÓXIMA CONVERSA

### Lote A — reconciliação canônica cirúrgica

1. Bíblia: reconciliar normas de mastery/RT, Sensei, dose adaptativa e Dojo separado; bump de versão/changelog.
2. Manual: 90/90 + GM.12, preservando toda didática existente.
3. Método: 90/94 + Sensei/Jornada/Dojo/Oficina atuais, preservando exemplos e fundamentação.
4. `catalog_auditor.cjs`: parar de exigir 89 e falhar se a prosa canônica voltar a divergir.
5. Rodar gates e registrar CI limpo.

### Lote B — Tutor ↔ Dojo

1. tornar `prescribed | manual` explícito no metadado/sessão/persistência;
2. regressão: manual no próprio `currentStep` não move ponteiro adaptativo;
3. integrar `prescribeSenseiDojo` ao Sensei sem transformar Aula do Dia em mistura;
4. definir dose/posição do bloco de fluência em função do learner state;
5. prática livre continua disponível e segura;
6. retirar `utils/dojoMode.ts` da posição de inteligência principal;
7. sonda real da UX afetada;
8. gates e checkpoint.

### Depois

1. Jardim como intervenção perceptual causal;
2. banco de erros composto;
3. identidade observacional de telemetria/Leitner em Aula composta;
4. `LENTO_DEDOS` no catálogo canônico;
5. `lastDay`/timezone;
6. eliminar recomendador paralelo por estrelas;
7. Desafio Misto por repertório elegível;
8. Matrícula/placement sem grade rígida;
9. cloud reconciliation;
10. simulação longitudinal com perfis sintéticos;
11. gamificação/economia/mascote;
12. Coverage Matrix;
13. fábrica curricular;
14. mega auditoria pedagógica;
15. release hardening.

---

## 8. PERFIS OBRIGATÓRIOS DA SIMULAÇÃO LONGITUDINAL FUTURA

- zero absoluto;
- ritmo típico;
- alta facilidade/superdotação;
- entende mas é lento;
- rápido porém chutando;
- misconception persistente;
- erros alternantes/ruído;
- lacuna de pré-requisito;
- forte visual / fraco simbólico;
- dependência de andaime;
- aprende hoje e esquece depois;
- retorno após dias/semanas;
- erro inicial + recuperação com dica;
- conceito dominado mas não automatizado;
- prática manual intensa no Dojo;
- mudança de dispositivo / offline→online.

---

## 9. COVERAGE MATRIX FUTURA

Nunca confundir “ficha existe” com “experiência pronta”.

Por competência, rastrear ao menos:

`grafo | ficha | Journey TS | runtime | cena/primitiva | níveis | coreografia/tutorial | diagnóstico | evidência/mastery | áudio/TTS | sonda | simulação longitudinal | produção`.

---

## 10. PORTÕES

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

Tela alterada exige sonda real.

---

> **Invariante final:** a criança pode escolher explorar e treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor. A complexidade vive no sistema; a experiência da criança deve ser simples, clara e fluida.
