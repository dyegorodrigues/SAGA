# CHECKPOINT FINAL DE CONTINUIDADE — SAGA

**Data:** 9/ago/2026  
**Repo:** `dyegorodrigues/SAGA`  
**Branch única deste fluxo:** `codex/integrar-bloco-f0`  
**PR:** #29 — **open + draft + NÃO MESCLAR**  
**Main protegida:** `68fad4c575e28959b2ca4776e9a541d6828b63f3`  
**Creature Engine:** fora deste fluxo; não tocar.

> **ESTE É O CHECKPOINT OPERACIONAL MAIS NOVO.** Qualquer seção “próxima tarefa” de checkpoints anteriores é histórica quando conflitar com este arquivo.

---

## 0. REGRAS DE OURO PARA QUALQUER NOVA CONVERSA

1. Reancorar primeiro a PR #29 e o head remoto. Não confiar em SHA narrado sem conferir no GitHub.
2. Trabalhar somente em `codex/integrar-bloco-f0`.
3. Não tocar, mergear, rebasear ou tornar ready a `main`.
4. Não tocar no Creature Engine.
5. Não criar branch auxiliar.
6. Não reescrever documentação rica para atualizar números; fazer reconciliação cirúrgica ou apêndice autoritativo.
7. Código/runtime decide o que está implementado; decisões canônicas vigentes decidem a semântica pedagógica.
8. Bug só é fechado com cadeia `emissor → estado → persistência → consumidor → efeito` + regressão.
9. Tela alterada exige navegador real; jsdom sozinho não fecha QA visual.
10. Não construir conteúdo em massa antes de estabilizar identidade/estado dos motores e Coverage Matrix.
11. Todo bloco termina com gates, checkpoint e estado remoto verificado.

---

## 1. ESTADO FUNCIONAL PROVADO

Head funcional que fechou Tutor↔Dojo + Jardim causal:

`15f73542ddb1f005fd228ac02461c5a71ea8adec`

CI **#671 / run `31307946962` = SUCCESS integral**.

Passaram no mesmo run:

- `npm ci`;
- catálogo + guard canônico;
- fichas;
- conformidade das fichas;
- grafo;
- TypeScript;
- **142 arquivos / 2.278 testes**;
- build;
- `pr:check`;
- higiene do diff;
- guarda de binários;
- sonda real Chrome.

Artefato de QA real: **`9036527545`**.

A sonda validou telefone 390×844 e tablet 768×1024, com screenshots de:

- Sensei + Dojo prescrito;
- round Dojo prescrito;
- Sensei + Jardim causal;
- round/relance Jardim causal.

Sem overflow horizontal e sem falha HTTP real/pageerror.

---

## 2. ONTOLOGIA PEDAGÓGICA VIGENTE

- **Sensei:** autoridade prescritiva da experiência; uma meta dominante.
- **Jornada:** mapa de conhecimento, não sequenciador do dia.
- **Dojo:** automaticidade em estado separado, prescrito ou livre/manual.
- **Jardim:** automaticidade perceptual/pré-simbólica; pode ser prescrito causalmente quando há evidência real de fraqueza.
- **Oficina:** recuperação conceitual causal curta e com saída.
- **Misto:** desafio opcional/interleaving; nunca autoridade curricular.
- **idade/série:** contexto de apresentação, nunca catraca curricular.
- **gamificação/economia:** nunca compra unlock/mastery.
- **RT/fluência:** não concede nem reprova domínio conceitual.

---

## 3. FECHADOS — NÃO REABRIR SEM FALHA OBJETIVA

Além de P17/P8/P18/P19/P20/P21/P22 e das auditorias longitudinais anteriores, estão fechados:

### Reconciliação canônica

- grafo 90;
- fichas autorais 94;
- cobertura 90/90;
- Manual 90/90 + GM.12;
- Bíblia v3.4;
- Método reconciliado;
- coroa conceitual separada de RT/fluência;
- regra 3/3 alinhada entre Manual e `progressEngine`;
- `canonical_doc_guard.cjs` no gate.

### Tutor ↔ Dojo

- `SenseiDojoSessionSource = "manual" | "prescribed"`;
- manual = `adaptive=false` sempre;
- prescribed = `adaptive=true`;
- manual atualiza força/RT/precisão/volume sem governar ponteiro do Tutor;
- rounds parciais não misturam origem;
- Dojo não concede mastery conceitual;
- prescrição do Sensei chega explícita até o GameLoop;
- Dojo prescrito é missão separada da Aula;
- porta livre/manual preservada;
- `utils/dojoMode.ts` é legado/free-play.

### Jardim causal

Planner novo: `src/curriculum/motores/jardimCausalPrescription.ts`.

Regra:

1. `prerequisite-gap` conceitual ganha sempre;
2. precisa existir misconception ativa;
3. mãe do JD precisa ser o próprio nó observado ou ancestral no DAG;
4. mãe precisa tornar o Jardim elegível;
5. estado JD precisa conter fraqueza observada (`weakRounds`, recuo ou precisão histórica <80% com amostra mínima);
6. ausência de treino, idade, estrelas ou erro isolado não bastam;
7. múltiplos candidatos → menor distância causal no DAG.

Prioridade da porta do Tutor:

`pré-requisito conceitual → Jardim causal provado → misconception conceitual/Oficina → Aula normal`.

UI e Chromium real provaram a rota `Aula do Dia · Base Perceptual → Começar Jardim Guiado → JD1 relance`.

---

## 4. INCIDENTES DE QA DESTA FASE — REGISTRAR, NÃO APAGAR

Ao transformar a sonda em gate real foram encontrados e corrigidos problemas de infraestrutura que explicam por que um “QA armado” ainda não era QA executável:

- faltava `npm run sonda:sensei-dojo`;
- fixture usava storage key e schema errados;
- workflow isolado novo não aparecia de forma confiável no próprio PR;
- foi incorporado como job do CI existente;
- assert pós-clique dependia de texto que GameLoop não promete;
- screenshots eram tiradas durante transição Framer Motion;
- 404 genérico era capturado sem URL;
- package edit transitório alterou `remark-gfm`; o lock provou que a versão correta era `^4.0.1`, restaurada.

O estado final está corrigido. Não reescrever histórico para esconder essas detecções: elas são precedentes para QA reproduzível e para comparar `package.json` com lock antes de “restaurar” dependência por memória.

---

## 5. O QUE NÃO FOI PERDIDO: EXERCÍCIOS / FICHAS / EXPERIÊNCIA

O trabalho anterior de fabricação e correção de exercícios continua quantificado. Ele **não foi cancelado**; foi colocado depois da estabilização dos motores.

Fonte detalhada: `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`.

Resumo atual:

- padrão-ouro/Composer ativo: **26/90**;
- ficha pronta ainda servida por legado: **25**;
- ficha pronta sem conteúdo servido / fallback real: **39**;
- servido sem placeholder: **51/90**;
- divergência ficha↔tela observada: **21/90**;
- troca de linguagem visual sem aviso: **12**;
- ferramenta nova sem precedente: **44 ocorrências a classificar**;
- `N1.04`: duas fichas/uma voz — micros sem fonte separada;
- primitivas: **20 executáveis / 4 renderer-sem-builder / 1 isolada / 1 ausente**.

Primitivas de dívida:

- `LinkingCubes` — renderer sem builder;
- `Moedas` — renderer sem builder; bloqueia GM.03;
- `SingaporeBars` — renderer sem builder;
- `VisualAddition` — renderer sem builder;
- `Quadrado100` — componente isolado;
- `Regua` — ausente; bloqueia GM.05.

**Não começar agora uma onda cega de 39 competências.** Coverage Matrix/fábrica vão usar estas listas depois que a identidade dos motores estiver fechada.

---

## 6. PRÓXIMA TAREFA EXATA — BANCO DE ERROS COMPOSTO

### Pré-auditoria já feita

Arquivos lidos:

- `src/curriculum/motores/aulaProgressContext.ts`;
- `src/curriculum/motores/composer.ts`.

Já está correto:

- questão composta recebe `sourceTrackId/sourceGraphId/sourceLevel`;
- progress do envelope `aula` volta ao source real antes de persistir;
- banco legado é re-carimbado com o track que o armazena.

### Suspeita específica a PROVAR

`composeAula()` monta um `bankQs` **global** com bancos de todos os tracks e embaralha tudo. Depois cria uma closure por `plan.resgates`; para `error-bank`, a closure usa simplesmente `bankQs.pop()`.

Hipótese:

> um `RescuePlanItem` de `error-bank` nominalmente ligado ao track A pode consumir questão originalmente armazenada no banco do track B.

A persistência da questão pode continuar correta em B por causa de `sourceTrackId`, mas a agenda/resgate que justificou sua presença na sessão fica semanticamente incoerente.

### Cadeia obrigatória

`planAula(error-bank source) → bankQs/rescueQueue → questão servida/source → GameLoop/review → progressEngine/materialize → bank mutation → próximo planAula`.

### Método

1. escrever regressão determinística que construa pelo menos dois bancos-fonte;
2. provar/refutar a mistura sem alterar código produtivo;
3. se provada, indexar o banco por source/rescue em vez de `pop()` global;
4. garantir que retry/review remove/atualiza o item do source correto;
5. testar missão composta com fontes diferentes;
6. gates completos;
7. checkpoint.

Não misturar ainda com a etapa seguinte de telemetria/Leitner: fechar uma identidade por vez.

---

## 7. FILA VIGENTE DEPOIS DO BANCO

1. identidade de telemetria/Leitner na Aula composta;
2. `LENTO_DEDOS` canônico;
3. timezone/`lastDay`;
4. recomendador paralelo por estrelas — retirar autoridade concorrente;
5. Misto por repertório elegível;
6. Matrícula sem grade rígida;
7. cloud reconciliation;
8. simulação longitudinal;
9. gamificação/economia/mascote — auditoria sistêmica;
10. Coverage Matrix executável;
11. fábrica curricular por ondas pedagógicas — 25 legados + 39 vazios + paridade + primitivas;
12. mega auditoria pedagógica;
13. hardening/performance/release.

---

## 8. DÍVIDAS NÃO BLOQUEANTES DE RELEASE

- Vite alerta JS principal ≈2,26 MB minificado / ≈642 kB gzip;
- alguns assets de mascote >500 kB;
- jsdom imprime warnings de canvas em algumas suítes, embora os testes passem;
- QA visual crítico já possui Chrome real.

Não desviar o próximo bloco pedagógico para otimização prematura; manter na fila de hardening.

---

## 9. PRIMEIRA LEITURA DO PRÓXIMO CHAT

1. **este arquivo**;
2. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`;
3. `RETOMADA.md`;
4. `AUDITORIA_MOTORES_ADAPTATIVOS.md`;
5. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`;
6. `BIBLIA_DO_SAGA.md`, `MANUAL_DIDATICO_SAGA.md`, `METODO_SAGA.md` somente se a próxima mudança tocar semântica pedagógica.

Checkpoints anteriores permanecem históricos; não usá-los como fila vigente.

---

## 10. GATES

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

No PR, o CI também roda higiene do diff e guarda de binários.

---

## 11. PROMPT CURTO PARA RETOMADA

> Continue o SAGA pela fonte operacional `AI_Studio_Lab/codex/CHECKPOINT_FINAL_CONTINUIDADE_2026-08-09.md`. Reancore primeiro a PR #29 e o head remoto da branch `codex/integrar-bloco-f0`; não toque na main nem no Creature Engine. Não reabra cânone, Tutor↔Dojo ou Jardim causal sem falha objetiva. Comece pela auditoria da **identidade do banco de erros composto** descrita no §6: trace `planAula → bankQs/rescueQueue → sourceTrackId → GameLoop → progressEngine/materialize → bank → próximo plan`, escreva primeiro uma regressão determinística com dois bancos-fonte e só corrija se a mistura for provada. Depois rode todos os gates, registre o checkpoint e preserve a fila vigente. Não inicie ainda a fábrica dos 39 fallbacks; a dívida curricular está inventariada em `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md` e entra depois da Coverage Matrix.

**A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**
