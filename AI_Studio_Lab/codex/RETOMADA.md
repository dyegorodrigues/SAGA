# Retomada — comece por aqui

> **VIGENTE em 8/ago/2026 — P21/P22 fechadas; auditoria longitudinal em curso. Próxima tarefa exata: Tutor ↔ Dojo.**

## 1. Leia antes de editar

1. [`HANDOFF_CONTINUIDADE_IA.md`](./HANDOFF_CONTINUIDADE_IA.md)
2. [`AUDITORIA_MOTORES_ADAPTATIVOS.md`](./AUDITORIA_MOTORES_ADAPTATIVOS.md)
3. [`DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`](./DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md)
4. [`DECISAO_P22_DIVIDAS_CURRICULARES.md`](./DECISAO_P22_DIVIDAS_CURRICULARES.md)
5. [`DECISAO_P21_FONTES_DE_VERDADE.md`](./DECISAO_P21_FONTES_DE_VERDADE.md)
6. [`PLANO_POS_P22_FABRICA_CURRICULAR.md`](./PLANO_POS_P22_FABRICA_CURRICULAR.md)

Roadmaps antigos são históricos. Não usar fila, contagem ou semântica anterior sem recalcular o runtime.

## 2. Git — regra de ouro

- repo: `dyegorodrigues/SAGA`;
- branch: `codex/integrar-bloco-f0`;
- `main` protegida: `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29: open + draft + **não mesclar**;
- não tocar no Creature Engine;
- não criar branch auxiliar;
- workflow/script temporário deve se apagar no próprio lote.

## 3. Fechado — não reabrir sem falha objetiva

- P17 — N1.10/N1.11 e ponte perceptual→simbólica;
- P8 — Jardim e automaticidade separada da Jornada;
- P18 — `KindType` sem promessa autoral falsa;
- P19 — migrador único e dependências saneadas;
- P20 — save/sync por Firebase UID;
- P21.1 — registries, cobertura e proveniência;
- P21.2 — mapa de primitivas reconciliado com builder→kind→renderer real;
- P22.1 — GM.12 promovida;
- P22.2 — N4.09 promovida e telemetria de área corrigida;
- P22.3A — N1.07 reconciliada;
- P22.3B — JD4 separada como automaticidade;
- P22.4 — N1.09 reconstruída;
- P22.5 — GM.02 reconstruída e promovida;
- auditoria longitudinal: roteamento Radar tag→nó corrigido;
- auditoria longitudinal: Aula composta persiste no `sourceTrackId`;
- auditoria longitudinal: Sensei não usa `grade` como trilho curricular;
- auditoria longitudinal: lacuna causal vira Oficina prescrita pela mesma porta da Aula do Dia.

## 4. Estado final de P22

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

Dívidas de primitiva ainda visíveis:

- `LinkingCubes` — renderer sem builder;
- `Moedas` — renderer sem builder;
- `SingaporeBars` — renderer sem builder;
- `VisualAddition` — renderer sem builder;
- `Quadrado100` — componente isolado;
- `Regua` — ausente.

## 5. Evidência P22

### N1.09

- semântico: `31286476155` = success;
- sonda rota real 390/320/900: `31286955931` = success;
- clean: `31287106974` = success.

### GM.02

- semântico: `31287744035` = success;
- sonda inicial `31287813598` encontrou contraste/colisão compartilhados;
- sonda corrigida: `31288014568` = success;
- clean: `31288136803` = success.

## 6. Auditoria longitudinal — correções já fechadas

### 6.1 Radar

`getRescueItems` devolve o nó onde o padrão ocorreu; `rescuePlanner` decide descida pelo DAG.

Gate: `31288516415` = success.

### 6.2 Aula composta → competência-fonte

Cada questão carrega `sourceTrackId/sourceGraphId/sourceLevel`.

`aulaProgressContext → applyJourneyAnswer → carimbar()` garante:

- mastery no nó-fonte;
- banco no nó-fonte;
- misconception no nó-fonte;
- nível/maxLvl no nó-fonte;
- `progress.aula` removido antes de persistir;
- save sintético antigo não vira evidência.

Gate: `31290512422` (CI 585) = success.

### 6.3 Sensei por domínio, não série

`buildAulaTrack` sempre reconstrói o universo canônico `ALL_MATH_TRACKS`.

Dose adaptativa V1:

- 8 — zero absoluto/resgate/fricção;
- 10 — desenvolvimento normal;
- 12 — fronteira estável, sem banco/resgate.

`grade` continua só como API legada/contexto; não escolhe currículo.

Gate: `31290796584` (CI 589) = success.

### 6.4 Uma porta do Tutor; resgate causal vira a missão

`chooseSenseiEntry` prioriza:

1. `prerequisite-gap`;
2. `misconception`;
3. aula normal.

`spaced-review`/`error-bank` não sequestram a meta principal.

Se há lacuna causal, o mesmo botão **Aula do Dia** abre o rescue standalone já existente:

- `requiredLevel` explícito;
- budget 4/8;
- saída antecipada ao recuperar;
- `rescueAttempts`/escalada preservados.

Gate: `31290937246` (CI 593) = success.

## 7. Arquitetura pedagógica vigente

- **Sensei:** professor/tutor prescritivo; uma meta dominante por missão.
- **Jornada:** mapa do conhecimento, não sequenciador principal.
- **Dojo:** automaticidade; porta prescrita + porta livre/manual.
- **Jardim:** bases pré-simbólicas/perceptuais, podendo ser prescrito causalmente.
- **Oficina:** recuperação causal, curta, encorajadora e com saída.
- **Desafio Misto:** desafio opcional/interleaving; nunca autoridade curricular.
- **idade/série:** contexto de apresentação, não progressão.

## 8. PRÓXIMA TAREFA EXATA — Tutor ↔ Dojo

Achado inicial já comprovado por leitura:

`utils/dojoMode.ts` NÃO é ainda um motor longitudinal de fluência. Ele:

- filtra `FLUENCY_IDS` conceituais;
- escolhe uma track aleatória;
- força nível `>=4`;
- troca `kind` para `rapid-fire` quando encontra expressão;
- fixa RT em 5s.

Ao mesmo tempo, os templos `dojo_add/sub/mul/div` já possuem **10 níveis** e o Jardim possui JD1–JD5 com estado próprio.

Auditar e projetar, nesta ordem:

1. o que cada templo treina e quais conceitos o liberam;
2. onde o estado de fluência realmente persiste hoje;
3. se `FactStrength/ProcStrength` possuem consumidores ou são schema órfão;
4. como o Sensei escolhe família, nível, dose e itens fracos;
5. como manter prática livre sem conceder mastery conceitual;
6. como Jardim pode ser prescrito quando a lacuna é perceptual;
7. como subir/descer dificuldade por precisão + estabilidade + RT sem transformar velocidade em compreensão;
8. regressões longitudinais antes de substituir `dojoMode.ts`.

**Não criar “motor inteligente” por sorteio. Primeiro provar source→state→consumer.**

## 9. Depois do Tutor ↔ Dojo

1. banco de erros composto;
2. identidade observacional de telemetria/Leitner na Aula;
3. `LENTO_DEDOS` no catálogo canônico;
4. `lastDay`/timezone;
5. recomendador paralelo por estrelas;
6. Desafio Misto por repertório elegível;
7. Matrícula sem grade rígida;
8. cloud reconciliation;
9. simulação longitudinal;
10. gamificação/economia;
11. Coverage Matrix e fábrica curricular.

## 10. Portões

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

> **A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**
