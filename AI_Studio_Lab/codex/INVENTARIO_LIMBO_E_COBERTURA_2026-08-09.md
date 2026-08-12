# Inventário autoritativo de limbo e cobertura — SAGA

**Data:** 9/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Base protegida:** `main` em `68fad4c575e28959b2ca4776e9a541d6828b63f3`  
**PR:** #29 — open + draft + não mesclar  
**Fonte de evidência principal:** CI #671 / run `31307946962` no head funcional `15f73542ddb1f005fd228ac02461c5a71ea8adec`.

> Este arquivo existe para impedir que dívidas reais voltem ao “limbo” entre conversas. Ele separa **fechado**, **dívida deliberada**, **bloqueante seguinte** e **histórico desatualizado**. Não é roadmap aspiracional; os números abaixo vieram dos auditores/gates da própria branch.

---

## 1. FECHADO — NÃO REABRIR SEM FALHA OBJETIVA

### Cânone

- grafo/runtime/Markdown/YAML/JSON/TS: **90 competências**;
- fichas autorais documentadas: **94**;
- cobertura autoral: **90/90**;
- Manual: **90/90 + GM.12**;
- Bíblia v3.4 e Método reconciliados;
- domínio conceitual separado de RT/fluência;
- escada conceitual runtime/Manual: **3 acertos sobe / 3 erros desce**;
- `canonical_doc_guard.cjs` faz parte de `npm run auditar`.

### Tutor ↔ Dojo

- origem explícita `manual | prescribed`;
- manual nunca move ponteiro adaptativo, inclusive na própria `currentStep`;
- manual continua atualizando força, RT, precisão, volume e rounds;
- prescribed pode mover o ponteiro segundo o motor existente;
- round parcial não mistura origens;
- Dojo não concede domínio conceitual;
- prescrição do Sensei chega até `GameLoop` com autoridade explícita;
- missão prescrita é separada da Aula do Dia;
- treino livre/manual permanece disponível;
- `utils/dojoMode.ts` é legado/free-play, não inteligência do Tutor.

### Jardim causal

Fechado no mesmo padrão de prova ponta a ponta:

- não existe segunda árvore `tag → nó`;
- a relação causal usa o DAG canônico;
- pré-requisito conceitual imaturo tem prioridade sobre Jardim;
- Jardim só é prescrito se houver misconception ativa + mãe JD no caminho causal + mãe conceitualmente elegível + fraqueza já observada no próprio estado JD;
- ausência de treino, idade, estrela ou um erro isolado não bastam;
- evidência JD atual: `weakRounds > 0`, recuo `currentStep < highestStep`, ou precisão histórica <80% após pelo menos 6 tentativas;
- entre bases elegíveis, vence a mais próxima pelo DAG;
- UI explicita `Aula do Dia · Base Perceptual` e mantém Dojo/Misto separados;
- Chromium real validou telefone + tablet e entrada no relance JD1.

### QA real

CI #671 / run `31307946962` = **SUCCESS integral**.

Passaram:

- `npm ci`;
- auditoria do catálogo + guard canônico;
- auditoria das fichas;
- conformidade das fichas;
- sincronia do grafo;
- TypeScript;
- **142 arquivos de teste / 2.278 testes**;
- build;
- `pr:check`;
- higiene do diff;
- guarda de binários;
- Chrome real.

Artefato real: `9036527545`.

A sonda captura, em 390×844 e 768×1024:

- home do Sensei com Dojo prescrito;
- round Dojo prescrito;
- home com Jardim causal;
- round/relance do Jardim causal;
- sem overflow horizontal;
- sem falha HTTP real não classificada;
- sem `pageerror`.

---

## 2. COBERTURA EXECUTÁVEL — DÍVIDA REAL, NÃO PERDA DE TRABALHO

### Estado agregado

- geradores legados explícitos: **42/90**;
- Composer registrado: **26/90**;
- Composer ativo: **26/90**;
- Composer registrado e inativo: **0/90**;
- servido sem placeholder (`legado ∪ Composer ativo`): **51/90**;
- fallback real sem conteúdo servido: **39/90**;
- Journey no disco/registry/AllFichas: **31/90**;
- fichas Sensei Dojo: **4/4**;
- geradores órfãos: **0**;
- deriva de nomenclatura: **0**.

### 26 competências padrão-ouro / Composer ativo

`AL.01, AL.02, GE.01, GE.02, GM.01, GM.02, GM.12, N1.01, N1.02, N1.03, N1.04, N1.06, N1.07, N1.08, N1.09, N1.10, N1.11, N1.13, N3.09, N3.10, N4.03, N4.04, N4.06, N4.07, N4.08, N4.09`.

### 25 fichas prontas ainda servidas por legado

`N1.05, N1.12, N2.01, N2.02, N2.03, N3.01, N3.02, N3.03, N3.04, N3.05, N3.06, N3.07, N3.08, AL.03, GM.03, GM.04, PE.01, N2.04, N3.11, N3.12, N3.13, N4.01, N4.02, N4.05, N2.05`.

### 39 fichas prontas ainda sem conteúdo servido

`N5.01, AL.04, AL.05, GE.03, GE.04, GE.05, GM.05, GM.06, GM.07, PE.02, N2.06, N4.10, N4.11, N4.12, N5.02, N5.03, N5.04, N6.01, N6.02, AL.06, GE.06, GE.07, GE.08, GM.08, GM.09, PE.03, N2.07, N6.03, N6.04, N5.05, N7.01, N7.02, AL.07, AL.08, GE.09, GE.10, PE.04, GM.10, GM.11`.

> Estes 39 não foram “esquecidos”. A fábrica curricular foi deliberadamente colocada depois da estabilização dos motores/estado e da Coverage Matrix. Construí-los em massa agora esconderia defeitos de identidade/progressão embaixo de mais conteúdo.

---

## 3. PRIMITIVAS — DÍVIDA CONFIRMADA PELO AUDITOR

Cobertura do mapa de runtime:

- **20 executáveis**;
- **4 renderer-sem-builder**;
- **1 componente isolado**;
- **1 ausente**.

### Renderer sem builder

- `LinkingCubes`;
- `Moedas`;
- `SingaporeBars`;
- `VisualAddition`.

### Componente isolado

- `Quadrado100`.

### Ausente

- `Regua`.

Bloqueios explícitos do auditor:

- `Moedas` bloqueia conformidade de **GM.03**;
- `Regua` bloqueia conformidade de **GM.05**.

---

## 4. FICHA ↔ TELA — DIVERGÊNCIAS AINDA VISÍVEIS

O teste de conformidade é hoje **observacional**: imprime o quadro e passa. Portanto `CI verde` não significa paridade visual completa.

### 21 competências em que a tela amostrada diverge da ficha

1. `N1.04` — ficha: TouchCount + EmojiRow + ScatteredItems → entrega TouchCount;
2. `N1.05` — Grupo → DragGroup;
3. `N1.12` — InteractiveNumberLine → NumberLine;
4. `N2.01` — MaterialDourado + TenFrame → Quadrado100;
5. `N2.03` — Grupo → nada além de pergunta/alternativas;
6. `N3.02` — EmojiRow#riscar → EmojiRow;
7. `N3.03` — LinkingCubes + NumberLine → nada além de pergunta/alternativas;
8. `N3.04` — InteractiveNumberLine → EmojiRow;
9. `N3.05` — NumberBond#triângulo → NumberBond;
10. `N3.06` — ArrayGrid + TenFrame → DragGroup;
11. `N3.08` — TenFrame + NumberLine → InteractiveNumberLine;
12. `AL.03` — InteractiveNumberLine + Quadrado100 → nada além de pergunta/alternativas;
13. `GM.03` — Moedas + NumberLine → nada além de pergunta/alternativas;
14. `PE.01` — SingaporeBars#ícones → SingaporeBars;
15. `N2.04` — MaterialDourado + Quadrado100 → nada além de pergunta/alternativas;
16. `N3.13` — NumberLine → nada além de pergunta/alternativas;
17. `N4.01` — Grupo → DragGroup;
18. `N4.03` — ArrayGrid + Quadrado100 → ArrayGrid;
19. `N4.06` — NumberBond#triângulo multiplicativo → NumberBond;
20. `N4.07` — ArrayGrid + Quadrado100 → ArrayGrid;
21. `N2.05` — NumberLine + Quadrado100 → nada além de pergunta/alternativas.

### 12 trocas de linguagem visual sem aviso

- `N1.08` EmojiRow → flash / skin mão;
- `N1.11` TenFrame → flash;
- `N3.02` EmojiRow → riscar;
- `GE.04` ShapeCanvas → 3D;
- `GE.05` ShapeCanvas → grade;
- `PE.02` SingaporeBars → vertical;
- `N2.06` DragGroup → duplas;
- `N4.09` ArrayGrid → área;
- `GE.06` ShapeCanvas → ângulo;
- `N5.05` ArrayGrid → área;
- `GE.10` ArrayGrid → 3D;
- `GM.11` ArrayGrid → 3D.

### Ferramenta nova sem precedente

O auditor reporta **44 estreias**. Nem toda estreia é bug — algumas são o próprio conteúdo —, mas a Coverage Matrix deve classificar cada uma como:

- legítima/autoinstrutiva;
- requer microtutorial;
- requer ponte visual;
- divergência real da ficha.

### Duas fichas, uma voz

- `N1.04`: fichas `F01 + F03`, micros ainda sem fonte autoral declarada separadamente.

---

## 5. DÍVIDAS DE ENGENHARIA / RELEASE OBSERVADAS

### Bundle

Build atual passa, porém Vite alerta chunk grande:

- JS principal ≈ **2,26 MB** minificado;
- ≈ **642 kB gzip**;
- alguns assets de mascote >500 kB.

Não bloqueia correção pedagógica atual. Entra em hardening/performance antes de release.

### Ambiente de teste

Algumas suítes jsdom imprimem `HTMLCanvasElement.getContext() not implemented` e continuam verdes. A cobertura visual crítica já possui sonda em Chrome real, mas esta dívida pode ser reduzida no hardening de testes.

---

## 6. PR / GOVERNANÇA

- review threads abertos na PR #29: **0**;
- comentários antigos da PR são checkpoints históricos e não devem ser apagados;
- nenhuma branch auxiliar foi criada por este fluxo;
- o workflow isolado temporário da sonda foi removido; a sonda real está incorporada ao CI existente;
- `main` e Creature Engine permanecem fora deste fluxo.

---

## 7. BLOQUEANTE SEGUINTE — IDENTIDADE DO BANCO DE ERROS COMPOSTO

Pré-auditoria já feita em `aulaProgressContext.ts` + `composer.ts`.

### O que já está correto

- questões da Aula composta carregam `sourceTrackId/sourceGraphId/sourceLevel`;
- o progresso do envelope `aula` é materializado de volta no `sourceTrackId` real;
- questões antigas de banco são re-carimbadas com a trilha que as armazenou.

### Suspeita forte a provar antes de corrigir

O Composer cria **um `bankQs` global**, embaralhando itens de todos os tracks. Depois cria uma closure por `plan.resgates`; quando o motivo é `error-bank`, a closure faz apenas:

`bankQs.pop()`.

Consequência possível:

> um resgate planejado nominalmente para o track A pode servir uma questão de banco do track B.

O `sourceTrackId` da questão ainda pode persistir corretamente em B, mas a **identidade do resgate/agenda** pode ficar incoerente com o motivo que trouxe A para a sessão.

### Cadeia obrigatória da próxima auditoria

`planAula(error-bank source) → bankQs/rescueQueue → questão composta source → GameLoop/review → progressEngine/materialize → mutação do bank → próximo planAula`.

Primeiro escrever regressão que prova ou refuta a mistura. Só depois corrigir.

---

## 8. ORDEM DE EXECUÇÃO VIGENTE APÓS O BANCO

1. identidade do banco de erros composto;
2. identidade de telemetria/Leitner na Aula composta;
3. `LENTO_DEDOS` canônico;
4. timezone/`lastDay`;
5. retirar recomendador paralelo por estrelas da posição de autoridade;
6. Misto por repertório elegível;
7. Matrícula sem grade rígida;
8. cloud reconciliation;
9. simulação longitudinal;
10. auditoria sistêmica de gamificação/economia/mascote;
11. Coverage Matrix executável;
12. fábrica curricular por ondas pedagógicas — incluindo os 25 legados, 39 vazios, paridade ficha↔tela e primitivas;
13. mega auditoria pedagógica;
14. hardening/performance/release.

**Não pular para a fábrica curricular antes de fechar identidade/estado dos motores. Não reabrir P21/P22/Sensei↔Dojo/Jardim causal sem falha objetiva.**
