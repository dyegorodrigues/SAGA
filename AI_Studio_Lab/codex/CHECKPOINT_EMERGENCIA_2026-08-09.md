# CHECKPOINT DE EMERGÊNCIA — SAGA

**Data:** 9/ago/2026  
**Branch de trabalho:** `codex/integrar-bloco-f0`  
**PR:** #29 — aberto, draft, NÃO MESCLAR  
**Main protegida:** `68fad4c575e28959b2ca4776e9a541d6828b63f3`  
**Creature Engine:** fora deste fluxo; não tocar.

> Este arquivo existe para permitir retomada segura em uma nova conversa mesmo que o histórico do chat seja perdido. Leia junto com `RETOMADA.md`, `AUDITORIA_MOTORES_ADAPTATIVOS.md` e `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`.

---

## 1. ESTADO COMPROVADO ATÉ AQUI

### P21 + P22 fechadas

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

Dívidas de primitiva continuam visíveis: `LinkingCubes`, `Moedas`, `SingaporeBars`, `VisualAddition`, `Quadrado100`, `Regua`.

### Gates principais já verdes

- P22.4 N1.09: semântico `31286476155`; sonda real `31286955931`; clean `31287106974`.
- P22.5 GM.02: semântico `31287744035`; sonda corrigida `31288014568`; clean `31288136803`.
- Radar tag→nó: `31288516415`.
- Aula composta → progresso por competência-fonte: `31290512422` (CI 585).
- Sensei sem `grade` como trilho curricular: `31290796584` (CI 589).
- Resgate causal pela mesma porta da Aula do Dia: `31290937246` (CI 593).
- Head observado antes deste checkpoint: `df0905ad2939c5b0e43c66bcd89b766d62c7d941`, CI `31292061849` (run 616) = success.

---

## 2. DEFINIÇÃO ARQUITETURAL DO PRODUTO — NÃO PERDER

### 2.1 Sensei / Tutor é a rota principal

A **Aula do Dia não é uma mistureba** e não é um sorteio de questões.

O Sensei funciona como um professor particular metainteligente: lê o Learner Model e prescreve o que a criança deve fazer agora. A criança não escolhe o currículo dentro dessa rota.

Cada missão tem **uma meta conceitual dominante**. Aquecimento, revisão, Oficina ou fluência podem aparecer, mas existem para servir a meta — não para montar um buffet aleatório.

A sequência do aluno não é uma grade fixa de aulas. Depois de cada missão o motor recalcula o estado e decide o próximo passo.

### 2.2 Progressão por domínio, não por idade/série

Idade e série são contexto de UX, linguagem, duração confortável e relatórios. Não são autoridade curricular.

A progressão depende de:

- compreensão conceitual;
- pré-requisitos do DAG;
- evidência específica da ficha;
- independência/andaime;
- retenção;
- misconceptions;
- precisão recente;
- estabilidade;
- representação concreto → pictórico → abstrato;
- histórico de intervenção;
- fluência, em trilho separado.

Criança avançada pode acelerar. Criança com dificuldade pode recuar em representação/base sem ser artificialmente retida por idade.

### 2.3 Jornada

É **mapa do conhecimento**, não o sequenciador principal. Mostra conquistado, fronteira, dependências e caminho.

Acesso manual pode existir sem transformar a Jornada em “escolha seu currículo”.

### 2.4 Dojo

É automaticidade/prática deliberada. Tem duas portas:

1. **prescrita pelo Sensei** — Tutor escolhe família, faixa, dose e momento;
2. **livre/manual** — criança pode repetir/faixa segura por vontade própria.

Regra absoluta: **Dojo não concede mastery conceitual**.

Tempo/RT governa fluência, nunca compreensão.

### 2.5 Jardim do Dojo

Pré-simbólico/perceptual: subitização, estruturas de cinco/dez, vizinhança numérica, parte-todo etc.

Pode ser prescrito causalmente quando um erro simbólico revela uma base perceptual fraca. Não é punição nem “voltar para exercício de bebê”.

### 2.6 Oficina

Recuperação causal, curta, segura, concreta quando necessário e com critério de saída. Não é depósito de erros.

A lacuna causal pode converter a própria porta **Aula do Dia** em uma missão de resgate. A criança continua vendo uma rota simples.

### 2.7 Desafio Misto

Interleaving/retrieval/desafio opcional. Nunca decide progressão e nunca substitui o Sensei. Deve usar apenas repertório elegível.

### 2.8 Gamificação / mascote / economia

Precisam aumentar vínculo, satisfação, retenção e senso de progresso sem manipular a pedagogia.

Moedas, estrelas, mascote, evolução, colecionáveis e recompensas **não compram unlock, não pulam pré-requisitos e não concedem mastery**.

A arquitetura futura deve associar recompensas a comportamentos pedagogicamente desejáveis: concluir missão prescrita, voltar depois de intervalo, superar uma dificuldade, automatizar fato, manter consistência etc., sem premiar volume cego ou velocidade conceitual.

---

## 3. O QUE JÁ FOI CORRIGIDO NA AUDITORIA LONGITUDINAL

### 3.1 Radar

O roteamento paralelo `TAG_TO_NODE` era incorreto. Agora o Radar mantém o nó onde o padrão foi observado e o `rescuePlanner` usa o DAG para decidir descida causal.

### 3.2 Aula composta → sourceTrackId

Problema provado: a missão sintética `aula` continha questões de múltiplas competências e podia gravar `mastery/Radar/Leitner/bank/lvl` em `progress.aula`.

Correção fechada: cada questão carrega `sourceTrackId/sourceGraphId/sourceLevel`; progresso e persistência materializam no nó-fonte e `progress.aula` não vira evidência curricular.

### 3.3 Sensei não usa grade como currículo

A Aula do Dia usa universo matemático canônico completo. `grade` deixou de filtrar a progressão.

Dose adaptativa V1 existente: aproximadamente 8/10/12 conforme fricção/estado, sem usar série como sequência curricular.

### 3.4 Oficina causal pela mesma porta

`chooseSenseiEntry` prioriza lacuna causal (`prerequisite-gap`, `misconception`) sobre aula normal. Revisão espaçada e banco de erros não sequestram automaticamente a meta principal.

---

## 4. TUTOR ↔ DOJO — PONTO EXATO DA RETOMADA

### 4.1 Dívida antiga identificada

`src/utils/dojoMode.ts` ainda é heurística legada:

- pega `FLUENCY_IDS`;
- sorteia uma track;
- força nível >=4;
- converte expressão para `rapid-fire`;
- fixa `rt_max_s = 5`.

Isso NÃO é o motor longitudinal final.

### 4.2 Estrutura nova já existente no branch

#### Templos aritméticos

- `dojo_add`
- `dojo_sub`
- `dojo_mul`
- `dojo_div`

Cada templo possui **10 níveis/faixas**.

Exemplo da Adição:

1. até 5;
2. até 10;
3. amigos do 10;
4. passando de 10;
5. dezena + unidade;
6. 2D + 1D sem reagrupamento;
7. 2D + 1D com reagrupamento;
8. dezenas exatas;
9. 2D + 2D sem reagrupamento;
10. 2D + 2D com reagrupamento.

Sub/mul/div têm políticas análogas próprias.

#### `senseiDojoPolicy.ts`

Já existe política explícita por templo/faixa ligando cada nível aos conceitos que precisam estar compreendidos no currículo. O teto de treino é derivado do progresso conceitual.

Isto impede que automaticidade corra à frente da compreensão.

#### `senseiDojoEngine.ts`

Já existe motor separado de automaticidade:

- round = 10 itens;
- alvo de precisão = 80%;
- recuo se precisão <60% por 2 rounds;
- avanço só com precisão **e** fluência;
- `FactStrength` para fatos;
- `ProcStrength` para procedimentos;
- `currentStep`, `highestStep`, `goodRounds`, `weakRounds`;
- prática manual (`adaptive=false`) atualiza força/estatística, mas não move o ponteiro adaptativo;
- nunca toca mastery conceitual.

#### `senseiDojoSession.ts`

Já existe:

- catálogo dos quatro templos;
- resolução do teto conceitualmente elegível;
- projeção de `Progress` apenas para a casca visual;
- transformação de tentativa terminal em `SenseiDojoAttempt`;
- metadado por questão/fato/procedimento.

#### `senseiDojoPrescription.ts`

Já existe prescrição determinística do Tutor, sem sorteio.

Prioridade atual:

1. `weak-items` — fatos/procedimentos fracos;
2. `fluency-gap` — conceito está à frente da automaticidade;
3. `newly-unlocked` — treino recém-liberado;
4. `refresh` — refresco espaçado (atualmente a partir de 4 dias).

Não prescreve duas vezes no mesmo dia.

Há regressões para:

- não abrir operação sem pré-requisito;
- priorizar item fraco;
- respeitar refresh;
- escolher templo pelo estado, não por sorteio.

Commit observado: `df0905ad2939c5b0e43c66bcd89b766d62c7d941` — “Trava prioridades da prescrição automática do Dojo”.

### 4.3 UI já parcialmente adaptada

`DojoTab.tsx` já mostra:

- Jardim JD1–JD5;
- Templos da Adição/Subtração/Multiplicação/Divisão;
- estado de faixa atual/melhor faixa;
- faixas bloqueadas por teto conceitual;
- prática livre de faixa segura.

`LevelPickerModal.tsx` já entende os templos e bloqueia níveis acima do teto conceitual.

### 4.4 LACUNA BLOQUEANTE ATUAL

A casca `GameLoop` ainda conhece explicitamente apenas:

- `journey`;
- `garden`.

Falta fechar a rota **sensei-dojo** ponta a ponta:

`prescrição → missão de 10 itens → tentativas terminais → applySenseiDojoRound → dojoTracks[kid][temple] → persist → próxima prescrição`.

Não permitir que essa rota grave `progress.dojo_add/sub/mul/div` como domínio conceitual.

Não usar warm-up/review conceitual do `GameLoop` por acidente.

Não voltar ao `utils/dojoMode.ts` como inteligência principal.

### 4.5 Próxima implementação recomendada

Adicionar um progression mode explícito para Dojo na casca, análogo ao Jardim, ou uma ponte igualmente clara:

- `progressionMode: "journey" | "garden" | "sensei-dojo"`;
- estado Dojo entra por `dojoTracks`, nunca por `progress` curricular;
- coletar exatamente 10 tentativas terminais;
- cada tentativa usa `senseiDojoMeta(question)`;
- erro após retry conta corretamente como não fluente/errado;
- `durationMs` cognitivo não inclui animação/feedback;
- no final: `applySenseiDojoRound(...)`;
- callback próprio `onSenseiDojoRound`;
- persistência em `state.dojoTracks[kid][templeId]`;
- modo prescrito: `adaptive=true`;
- modo manual: `adaptive=false`;
- nenhuma atualização de `dom`, `mast`, `lvl` curricular;
- regressão longitudinal provando que dois rounds podem avançar o Dojo e deixam o nó conceitual byte-a-byte semanticamente inalterado.

Depois substituir gradualmente `buildDojoTrack()` legado pelos templos/prescrição real.

---

## 5. PEDAGOGIA DO DOJO — REGRAS PARA REVISAR, NÃO CONGELAR CEGAMENTE

O desenho atual é uma V1 operacional e deve ser auditado pedagogicamente antes de ser tratado como definitivo.

Questões a estudar/decidir:

1. 10 níveis por operação são a melhor decomposição?
2. As faixas estão ordenadas por complexidade/transferência corretamente?
3. Quais fatos devem ter identidade individual e quais procedimentos devem agregar por família?
4. Como selecionar **itens fracos dentro do round**, não apenas escolher o templo?
5. Qual mistura ótima entre fracos, consolidados e novos?
6. Como usar retrieval spacing por fato/procedimento?
7. Quando precisão alta + RT lento pede mais treino sem aumentar dificuldade?
8. Quando baixa precisão pede recuo de faixa vs representação concreta/Jardim/Oficina?
9. Quando multiplicação/divisão devem abrir e em que relação com fatos inversos?
10. Como adicionar frações depois sem transformar o Dojo em um catálogo incoerente?
11. Qual dose por round/sessão por fricção e idade como limite de UX, não currículo?
12. Como impedir treino excessivo/compulsivo e preservar prazer/autonomia?

Princípio central: **o Sensei escolhe o treino adaptativo; a criança pode escolher treinar livremente dentro do que já é seguro**.

---

## 6. VISÃO DO MÉTODO SAGA A PRESERVAR

O objetivo não é copiar Kumon. A inspiração de prática sistemática é aproveitada, mas os pontos fracos devem ser eliminados.

O método completo deve combinar:

- ensino explícito e representações adequadas;
- CPA/concreto→pictórico→abstrato como ferramenta adaptativa;
- mastery learning com tempo variável;
- treino deliberado de fluência;
- spaced retrieval;
- interleaving no momento certo;
- diagnóstico causal de misconceptions;
- resgate de pré-requisito;
- learner model longitudinal;
- progressão por domínio;
- tutor prescritivo;
- liberdade de treino complementar;
- gamificação coerente;
- interface em que a criança sabe intuitivamente “o que fazer agora”.

A experiência desejada é simples por cima e sofisticada por baixo:

> abrir o app → ver missão clara → tocar → aprender/treinar → receber feedback → Sensei adapta o próximo passo.

A criança não precisa administrar o próprio currículo.

---

## 7. FILA APÓS TUTOR ↔ DOJO

Manter esta ordem aproximada, replanejando apenas diante de evidência do runtime:

1. fechar Tutor ↔ Dojo ponta a ponta;
2. integrar Jardim como intervenção perceptual causal quando necessário;
3. banco de erros composto;
4. identidade observacional de telemetria/Leitner em missões compostas;
5. `LENTO_DEDOS` e catálogo canônico de tags;
6. `lastDay` / timezone / calendário local;
7. eliminar recomendador paralelo por estrelas;
8. Desafio Misto por repertório elegível;
9. matrícula/placement sem grade rígida;
10. cloud reconciliation e conflitos multi-dispositivo;
11. simulações longitudinais sintéticas;
12. engenharia completa de gamificação/economia/mascote;
13. Coverage Matrix executável;
14. fábrica curricular em ondas;
15. mega auditoria pedagógica longitudinal;
16. QA visual/áudio/acessibilidade/performance;
17. release hardening.

Perfis obrigatórios na simulação longitudinal:

- zero absoluto;
- ritmo típico;
- alta facilidade/superdotação;
- compreensão correta porém lenta;
- chute rápido;
- misconception persistente;
- lacuna de pré-requisito;
- dificuldade perceptual;
- esquecimento após intervalo;
- retorno depois de dias/semanas;
- prática livre intensa no Dojo;
- mudança de dispositivo/offline→online.

---

## 8. COVERAGE MATRIX FUTURA

Não confundir “arquivo/ficha existe” com “experiência pronta”.

Cada competência deve ter status separado para, no mínimo:

`grafo | ficha autoral | TS | runtime | cena/primitiva | 5 níveis | coreografia/tutorial | diagnóstico | evidência/mastery | TTS | QA visual | simulação longitudinal | produção`.

Objetivo: tornar dívida visível e impedir falsa sensação de conclusão.

---

## 9. PORTÕES OBRIGATÓRIOS

Antes de fechar qualquer lote:

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

Tela afetada exige sonda real.

Workflow/script temporário deve sair no próprio lote.

---

## 10. COMANDO PARA UMA NOVA CONVERSA

Use algo como:

> Continue o SAGA pela branch `codex/integrar-bloco-f0`. Não toque na main nem no Creature Engine. Leia primeiro `AI_Studio_Lab/codex/RETOMADA.md`, `AI_Studio_Lab/codex/CHECKPOINT_EMERGENCIA_2026-08-09.md`, `AI_Studio_Lab/codex/DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md` e `AI_Studio_Lab/codex/AUDITORIA_MOTORES_ADAPTATIVOS.md`. Retome pelo lote Tutor ↔ Dojo, fechando a rota `prescrição → GameLoop → SenseiDojoAttempt → applySenseiDojoRound → dojoTracks → persist → próxima prescrição`. Preserve Dojo como automaticidade separada de mastery conceitual e mantenha prática manual com `adaptive=false`. Rode todos os gates e atualize os checkpoints antes de avançar.

---

> **Invariante de produto:** a criança pode escolher brincar/treinar; quando segue o Sensei, quem escolhe o currículo é o Tutor. A inteligência deve ficar no sistema, não na carga cognitiva da criança.
