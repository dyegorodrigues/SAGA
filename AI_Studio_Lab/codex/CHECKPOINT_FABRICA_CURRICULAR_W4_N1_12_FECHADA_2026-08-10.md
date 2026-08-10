# CHECKPOINT — FÁBRICA CURRICULAR W4 / N1.12 FECHADA — 2026-08-10

> Fonte de retomada da fábrica curricular depois da W4. Este documento registra o estado remoto efetivamente comprovado por CI + Chrome real e substitui qualquer indicação anterior de que N1.12/F19 ainda era apenas candidato.

## 1. Estado remoto e regras de continuidade

- repositório: `dyegorodrigues/SAGA`;
- branch única: `codex/integrar-bloco-f0`;
- PR #29: comparação/CI somente, **open + draft + unmerged**;
- base protegida: `main@68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- Creature Engine continua fora desta fila;
- nenhuma branch auxiliar;
- sem merge, rebase, ready ou auto-merge.

Regra reforçada pela própria W4:

> nenhuma resposta de chat fecha uma onda. O fechamento só existe quando o HEAD remoto, a Matrix, os gates e — quando a geometria da interface importa — uma sonda em navegador real concordam.

## 2. Recuperação após interrupção do chat

A conversa longa interrompeu uma escrita no meio da W4. A reancoragem pelo GitHub revelou exatamente o que havia e o que não havia chegado ao remoto:

- HEAD encontrado: `f2d64b1098404345d0ae3d52221b366af54a8d18`;
- CI #943 / run `31391574154` estava vermelho por duas regressões controladas;
- a última tentativa de alteração de `Reta20Stage.tsx` não tinha sido persistida no GitHub e foi refeita a partir do estado remoto, sem assumir memória como verdade.

As duas falhas iniciais eram objetivas:

1. soltura muito fora da reta podia ser clampada para o alvo correto e virar acerto;
2. o teste de `OFF_BY_ONE` era probabilístico porque o vizinho errado podia coincidir com a origem e então corretamente virar `CONTA_MARCAS`.

Ambas foram corrigidas antes de qualquer promoção. O primeiro baseline inativo recuperado ficou integralmente verde em `8e3c075adda5cf4bf688c7e5c4192aff4e4f3148` / CI #945.

## 3. F19 / N1.12 — ideia pedagógica materializada

**Competência:** N1.12 — reta numérica até 20.

**Primitiva canônica:** `InteractiveNumberLine`.

A reta deixa de ser mero desenho/alternativa e vira uma representação produtiva de **posição + deslocamento**.

### Progressão runtime fechada

- **L1:** posicionar em 0–10;
- **L2:** saltos positivos de 2 com arcos unitários como andaime;
- **L3:** saltos para trás de 1–3, sem arcos;
- **L4:** posicionar em 0–20 com rótulos de referência mais esparsos;
- **L5:** deslocamentos mistos de ±1–±4 em 0–20, sem arcos.

No phone, a geometria continua com todas as marcas 0–20. Para evitar colisão tipográfica em 320/390 px, rótulos ímpares 11/13/15/17/19 são ocultados visualmente; 0–10 e 12/14/16/18/20 permanecem rotulados. Em largura maior, L5 mostra 0–20 integralmente. Nenhuma marca, posição, snap ou resposta é removida.

## 4. Experiência autoral real

### Tap e drag

A mesma `InteractiveNumberLineSurface` serve wrapper legado e F19, evitando duas retas concorrentes.

- tap físico é resolvido pelo **plano da reta** e sua geometria;
- botões de tick permanecem como camada semântica/teclado, mas não interceptam pointer físico;
- drag pode começar exatamente sobre o foguete/marca;
- existe limiar explícito entre tap curto e drag real;
- `pointercancel` aborta o gesto e não publica resposta matemática;
- um drag que cruza vários ticks entre eventos emite todos os ticks realmente atravessados.

### Filtro motor

Geometria é resolvida antes do julgamento matemático.

`resolverSolturaReta` mantém duas tolerâncias diferentes:

- margem externa da reta para dedo escapando um pouco;
- raio de snap conceitual perto do alvo correto.

Uma soltura declaradamente fora da reta nunca pode virar acerto por clamp. Imprecisão motora não alimenta Radar como misconception.

### Movimento + áudio

O audit da ficha detectou que falar toda a sequência depois de chegar não ensinava pelo percurso.

A solução final separa dois canais:

- `sfx.tick()` em cada casa realmente atravessada/pisada;
- uma única frase TTS de chegada, por exemplo `4, 5. Chegou no 5.`.

Isso evita o bug estrutural do helper global de TTS, que cancela a fala anterior a cada novo `speak()`.

No tap correto em modo de salto:

1. o foguete anima casa a casa, 380 ms por passo;
2. cada pouso produz o SFX curto no mesmo instante;
3. a linha de percurso cresce junto;
4. o GameLoop só recebe o acerto no último passo;
5. só então entra a frase única de contagem/chegada.

No drag, os bipes acompanham as marcas cruzadas e a decisão só é publicada na soltura.

## 5. Diagnóstico, evidência e retry

A W4 preserva ação observável em vez de inferir intenção psicológica só pelo endpoint.

- vizinho errado preciso → `OFF_BY_ONE`;
- tocar a própria origem antes de concluir um salto pode produzir `CONTA_MARCAS`;
- o bit `contouMarcaInicial` é resetado **por tentativa**, portanto retry não contamina a próxima tentativa;
- salto espelhado pode produzir `INVERTE_DIRECAO`;
- erro espacial amplo no nível aplicável pode produzir `SEM_SENSO_ESPACIAL`;
- acerto para trás emite evidência `SALTO_PARA_TRAS`;
- erro conceitual mantém o personagem na origem e produz feedback autoral;
- gesto fora da reta volta à origem sem shake/diagnóstico conceitual.

## 6. O navegador real encontrou bugs que jsdom não via

A W4 criou uma sonda dedicada porque geometria de touch/pointer não pode ser provada apenas por jsdom.

Arquivos:

- `sonda/reta20.html`;
- `sonda/reta20.tsx`;
- `scripts/sonda-reta20.mjs`;
- script `npm run sonda:reta20`;
- CI: executado dentro do job histórico `Sonda real Sensei` sem renomear o check existente.

### Bugs reais encontrados pela sonda

1. **reta colapsada em uma coluna** — `PalcoEscalado` era adequado a desenho fixo, não a uma superfície percentual responsiva; todos os ticks/hitboxes ficavam sobrepostos;
2. **tick 10 roubava clique do tick 5** — consequência do colapso/hitboxes invisíveis;
3. depois da correção estrutural, **rótulos 8/9/10 e depois 9/10/11 ainda colidiam em 320 px**;
4. o gate foi endurecido para medir as caixas reais dos rótulos visíveis e falhar em qualquer sobreposição.

A solução não foi “forçar o Playwright” nem usar fonte microscópica. F19 saiu de `PalcoEscalado`, ganhou largura responsiva real, pointer físico pelo plano da reta e densidade responsiva de rótulos no phone.

## 7. Sonda F19 permanente

A sonda Chrome verifica:

- 320, 390 e 900 px;
- níveis 1–5;
- ausência de overflow;
- palco e superfície com largura real;
- ticks estritamente ordenados e distribuídos;
- rótulos visíveis sem sobreposição;
- arcos somente no L2;
- tap real;
- drag real iniciado sobre a origem/foguete;
- publicação da resposta somente após a coreografia correta.

Ela deve continuar no CI. Para primitivas infantis responsivas em que gesto/geometria importam, o padrão futuro é: **unit/jsdom + sonda Chrome real**, não um ou outro.

## 8. Promotion gate e Coverage Matrix

N1.12 só entrou no canário depois de o estado inativo ficar integralmente verde.

Ao ativar N1.12, a Coverage Matrix ficou vermelha de modo esperado. O delta observado foi isolado:

- Composer: `28 → 29`;
- legado: `23 → 22`;
- fallback: `39 → 39`;
- servidas: `51 → 51`;
- divergências ficha↔screen: `18 → 17`;
- swaps: `12 → 12`;
- estreias: `44 → 44`;
- blockers: `Moedas`, `Regua` — inalterados.

Só depois entrou `W4-N1.12` no `COVERAGE_MIGRATIONS`.

O canário ativo também foi obrigado a entrar em `canaryContract.test.ts`. Uma promoção intermediária ficou em 2479/2480 porque N1.12 ainda não estava no `REGISTRO`; a correção foi adicionar a ficha ao contrato explícito, não relaxar teste.

## 9. Coverage Matrix vigente

Snapshot P21.1 continua histórico e imutável:

- 26 Composer;
- 25 legado;
- 39 fallback;
- 51 servidas;
- 21 divergências;
- 12 swaps;
- 44 estreias;
- blockers `Moedas`, `Regua`.

Migrações fechadas:

- `W1-N1.04`: divergências −1;
- `W2-N1.05`: Composer +1, legado −1, divergências −1;
- `W3-N2.01`: Composer +1, legado −1, divergências −1;
- `W4-N1.12`: Composer +1, legado −1, divergências −1.

Baseline vigente:

- **29 Composer**;
- **22 legado**;
- **39 fallback**;
- **51 servidas**;
- **17 divergências**;
- **12 trocas visuais**;
- **44 estreias de ferramenta**;
- blockers `Moedas` e `Regua`.

## 10. Recibo funcional terminal W4

HEAD funcional promovido:

`841a4a3691662829b9d1432ff070191522fd9a6e`

CI:

- **#975 / run `31404572801` — success integral**;
- TypeScript verde;
- **169 arquivos de teste / 2.480 testes passando**;
- `canaryContract.test.ts`: 378 testes verdes;
- `Reta20Stage.test.tsx`: 11 testes verdes, incluindo WCAG nos cinco níveis;
- `reta20Boundary.test.tsx`: 3 verdes;
- `N1.12.test.ts`: 7 verdes;
- build verde;
- `pr:check` verde;
- higiene do diff verde;
- guarda de binários verde;
- sonda Sensei + Matrícula verde;
- sonda F19 Chrome verde.

### Artefato F19

- nome: `sonda-f19-841a4a3691662829b9d1432ff070191522fd9a6e`;
- ID: `9069082798`;
- 67.111 bytes;
- SHA-256: `65a1d3ab456f4320709547dcc98f87958f8ed083fb978b8a80322059e03629f3`;
- Chrome: 150.0.7871.128;
- screenshots L2/L4 em 320 e 900 px + `receipt.json`.

Recibos reais de interação:

- tap: alvo 5, salto 2, fala `4, 5. Chegou no 5.`;
- drag: origem 3 → alvo 5, mesma fala de chegada;
- 320/390: phone aplica densidade responsiva dos rótulos 11–20;
- 900: L5 mantém 0–20 integralmente rotulado.

### Artefato Sensei

- nome: `sonda-sensei-841a4a3691662829b9d1432ff070191522fd9a6e`;
- ID: `9069071435`;
- 1.004.938 bytes;
- SHA-256: `d8b4060ee5bc98feb64a0bc56f7d4b7c0fc5c8ca85f8416730657a83976cf38b`.

## 11. Dívida real preservada — não esconder

A W4 não “zerou o currículo”. O estado objetivo restante é:

### 22 legados

`N2.02, N2.03, N3.01, N3.02, N3.03, N3.04, N3.05, N3.06, N3.07, N3.08, AL.03, GM.03, GM.04, PE.01, N2.04, N3.11, N3.12, N3.13, N4.01, N4.02, N4.05, N2.05`.

### 39 fallback

`N5.01, AL.04, AL.05, GE.03, GE.04, GE.05, GM.05, GM.06, GM.07, PE.02, N2.06, N4.10, N4.11, N4.12, N5.02, N5.03, N5.04, N6.01, N6.02, AL.06, GE.06, GE.07, GE.08, GM.08, GM.09, PE.03, N2.07, N6.03, N6.04, N5.05, N7.01, N7.02, AL.07, AL.08, GE.09, GE.10, PE.04, GM.10, GM.11`.

### 17 divergências ficha↔screen

1. N2.03 — `Grupo` → nada visual;
2. N3.02 — `EmojiRow#riscar` → `EmojiRow`;
3. N3.03 — `LinkingCubes + NumberLine` → nada visual;
4. N3.04 — `InteractiveNumberLine` → `EmojiRow`;
5. N3.05 — `NumberBond#triângulo` → `NumberBond`;
6. N3.06 — `ArrayGrid + TenFrame` → `DragGroup`;
7. N3.08 — `TenFrame + NumberLine` → `InteractiveNumberLine`;
8. AL.03 — `InteractiveNumberLine + Quadrado100` → nada visual;
9. GM.03 — `Moedas + NumberLine` → nada visual;
10. PE.01 — `SingaporeBars#ícones` → `SingaporeBars`;
11. N2.04 — `MaterialDourado + Quadrado100` → nada visual;
12. N3.13 — `NumberLine` → nada visual;
13. N4.01 — `Grupo` → `DragGroup`;
14. N4.03 — `ArrayGrid + Quadrado100` → `ArrayGrid`;
15. N4.06 — `NumberBond#triângulo multiplicativo` → `NumberBond`;
16. N4.07 — `ArrayGrid + Quadrado100` → `ArrayGrid`;
17. N2.05 — `NumberLine + Quadrado100` → nada visual.

### Primitivas/runtime

- `Moedas`: renderer sem builder; bloqueia GM.03;
- `Regua`: ausente; bloqueia GM.05;
- `Quadrado100`: componente isolado;
- `LinkingCubes`, `SingaporeBars`, `VisualAddition`: renderer sem builder.

### Hardening não bloqueador da W4

- bundle principal >500 kB após minificação;
- warnings jsdom de `HTMLCanvasElement.getContext()` sem pacote `canvas`.

Não transformar esses avisos em “W4 quebrada”, mas também não apagá-los do backlog de hardening.

## 12. Próxima tarefa única — escolher W5 pela Matrix viva

**Não hardcode W5 neste checkpoint.**

Na nova sessão:

1. reancorar PR #29, HEAD e CI remoto;
2. ler este checkpoint + `RETOMADA.md` + `BRIEFING_CODEX.md` + `HANDOFF_CONTINUIDADE_IA.md`;
3. rodar/inspecionar `npm run coverage:matrix:markdown` (ou a projeção JSON);
4. ranquear candidatos por profundidade/impacto causal, legado/fallback, divergência, blocker de primitive, onboarding/motor/a11y e risco pedagógico;
5. escolher **uma competência**;
6. ler a ficha integral + runtime integral;
7. regression-first;
8. implementar inativo;
9. testes/CI/sonda apropriada;
10. promover canário;
11. Matrix observa o delta;
12. ledger só depois do delta real;
13. checkpoint.

Blockers `Moedas`/GM.03 e `Regua`/GM.05 merecem peso alto, mas a ordem final precisa sair da Matrix/DAG, não de preferência textual deste documento.

## 13. Thinking Lab / arquitetura paralela

A conclusão paralela permanece:

- SAGA não precisa ser reconstruído em Neo4j/Kafka/LLM soberano para ficar “moderno”;
- Curriculum Graph canônico deve continuar versionado/governado;
- learner state é a camada dinâmica por criança;
- telemetria observa e abre investigação, não reescreve grafo automaticamente;
- IA pode propor conteúdo/testes/patches, mas passa por contracts, CI e revisão;
- property-based testing, simulador de learner, observabilidade tipada e QA visual/áudio são extensões compatíveis e incrementais.

Loop seguro:

`Curriculum Graph → ficha/contratos → runtime → learner state → telemetria → análise → proposta → testes/CI/revisão → cânone`.

## 14. Regra de continuidade

**A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**

Não reabrir frente fechada sem falha objetiva. Não ajustar baseline para ficar verde. Não confiar em estado local do chat quando o GitHub remoto pode reancorar o trabalho.