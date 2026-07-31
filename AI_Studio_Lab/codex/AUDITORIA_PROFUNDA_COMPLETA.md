# Auditoria profunda completa do SAGA

**Data-base:** 31 de julho de 2026  
**Escopo:** repositório inteiro, documentação, currículo, motores, React/TypeScript,
Firebase, testes, UI infantil e mascote.  
**Natureza:** registro detalhado dos fatos encontrados, inferências e recomendações.

> **Como ler:** cada achado diferencia **Fato observado**, **Impacto/Inferência** e
> **Recomendação**. Este arquivo preserva a auditoria detalhada que originou o plano
> do projeto. Para o estado de execução mais recente, consulte também
> `DOSSIE_AUDITORIA_E_PLANO.md` e o fim de `DIARIO_DE_BORDO.md`.

---

# 1. Resumo executivo original

- **Nota de saúde estimada:** 5,8/10.
- **Estágio:** MVP técnico avançado / beta interno.
- **Maior ativo:** visão pedagógica forte, explícita, coerente e testável.
- **Maior risco:** documentação, grafos, fichas e geradores aparentarem uma
  integração maior do que a existente no fluxo real da criança.
- **Próxima ação inteligente definida:** provar a cadeia curricular antes de
  migrar conteúdo ou redesenhar a interface.

O SAGA já é um aplicativo executável, possui persistência, motores adaptativos,
primitivas visuais e centenas de testes. Entretanto, uma competência descrita no
Grafo ou na SPEC não é automaticamente uma experiência implementada. Para estar
realmente pronta, cada competência precisa atravessar:

```text
Grafo → ficha/contrato → gerador → Question válida → renderer/primitiva
      → áudio/coreografia → avaliação → misconception → progresso → testes
```

---

# 2. Inventário do repositório

| Área | Local principal | Função | Estado encontrado |
|---|---|---|---|
| Regras | `AGENTS.md` | Público, CRA, DAG, Fable, tamanho | Canônico |
| Bíblia | `AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md` | Constituição | Rica; parte aspiracional |
| Grafo humano | `GRAFO_DE_CONHECIMENTO_SAGA.md` | Nós, ordem, erros | 95 competências |
| Manual | `MANUAL_DIDATICO_SAGA.md` | Como ensinar | Amplo |
| Dojo | `DOJO_SAGA.md` | Fluência FD/PD/Jardim | Parcialmente implementado |
| SPEC | `SPEC_CONSTRUCAO_EXERCICIOS.md` | Catálogo de fichas | Majoritariamente backlog |
| Grafo agregado | `curriculum/grafo_saga.yaml` | Fonte executável | 95 nós |
| Strands | `curriculum/*.yaml` | Metadados ricos por área | Sincronizados para 95 |
| Grafo runtime | `src/curriculum/grafo_saga.ts` | Consumido pelo app | Artefato derivado |
| Grafo JSON | `src/data/grafo_saga.json` | Dados derivados | Artefato derivado |
| Currículo runtime | `src/curriculum/motores/curriculum.ts` | Monta tracks | Geradores legados + fallback |
| Fichas | `src/curriculum/fichas/` | Contrato novo | Cobertura pequena |
| Composer diário | `curriculum/motores/composer.ts` | Monta sessão | Real, parcial |
| Composer de ficha | `curriculum/Composer.ts` | Fabrica questão | Parcial |
| Progressão | `progressEngine.ts` | Nível/streak/domínio | Simplificada |
| Desbloqueio | `unlockEngine.ts` | DAG | Motor real |
| Radar | `radarEngine.ts` | Erros/revisão | Motor real, sensores parciais |
| Dojo | `dojoEngine.ts` e fichas Dojo | Fluência | Parcial |
| App shell | `App.tsx`, `KidHomeScreen.tsx` | Fluxo de telas | Funcional, acoplado |
| Jogo | `GameLoop.tsx` | Áudio/resposta/progresso | Monolítico |
| Primitivas | `components/primitives/` | CRA visual | Ativo valioso |
| Mascote | `Mascot*`, `mascots/`, `mascot-v2/` | Ator e evolução | Duas gerações coexistem |
| Firebase | `lib/firebase.ts`, `firestore.rules` | Persistência/telemetria | Requer correções |
| Testes | `*.test.ts` | Regressão | Bom volume, lacunas E2E |

---

# 3. Fontes da verdade e conflitos encontrados

## 3.1 Hierarquia canônica

**Fato observado:** `AGENTS.md` aponta a Bíblia como fonte pedagógica. A Bíblia,
por sua vez, define um conjunto composto por Bíblia, Grafo, Manual, Dojo e YAML.

**Impacto:** a frase “único arquivo canônico” pode ser interpretada literalmente e
fazer um agente ignorar o conjunto complementar.

**Recomendação:** tratar `AGENTS.md` como constituição operacional e o conjunto da
Bíblia como autoridade pedagógica distribuída por responsabilidade.

## 3.2 Referências 84 × 95

**Fato original:** o grafo cresceu de 84 para 95, mas comentários, Bíblia, Plano e
YAMLs por strand ficaram em estados diferentes.

**Estado posterior:** comentários foram corrigidos, strands completados e auditor
passou a exigir 95 IDs e pré-requisitos equivalentes.

## 3.3 Duas SPECs

**Fato observado:** `SPEC_CONSTRUCAO_EXERCICIOS.md` e
`SPEC_CONSTRUCAO_SAGA.md` eram byte a byte iguais.

**Impacto:** duas cópias editáveis podem divergir no futuro e orientar IAs de forma
contraditória.

**Decisão:** nome editorial canônico `SPEC_CONSTRUCAO_EXERCICIOS.md`; segundo nome
mantido como alias de compatibilidade, protegido pelo auditor.

## 3.4 Bíblia embutida no TypeScript

**Fato observado:** `src/docsText.ts` continha todo o Markdown em uma string.

**Impacto:** editar a Bíblia não atualizava automaticamente a visualização Admin.

**Correção executada:** importação raw do Markdown canônico.

## 3.5 README genérico

**Fato observado:** o README raiz ainda é essencialmente o template do Google AI
Studio e não explica a arquitetura, o currículo ou o ritual de validação.

**Impacto:** onboarding depende de conhecimento tribal e documentos espalhados.

**Recomendação:** README operacional curto apontando às fontes, comandos, remotos
e fluxo seguro de contribuição.

---

# 4. Arquitetura real detalhada

## 4.1 Router e estado global

**Fato observado:** `App.tsx` usa `screen.name` para escolher telas. Também cuida de
autenticação, migração, persistência, economia, tracks especiais e commits de
progresso.

**Impacto:** mudanças em uma responsabilidade podem regredir outra; o arquivo
excede muito o teto arquitetural.

**Recomendação:** extrair, em PRs separados, router, repositório de estado,
construção de sessões e economia, mantendo a árvore visual inicialmente idêntica.

## 4.2 Fluxo real de Matemática

```text
SUBJECTS
  → TRACKS_PRE / TRACKS_ANO1 / TRACKS_ANO2
  → curriculum/motores/curriculum.ts
  → GrafoSaga.nodes
  → GENERATOR_MAP
  → generators.ts / generatorsF1.ts / generatorsF2.ts
  → gFallback quando não existe gerador
```

**Conclusão:** apesar de as fichas novas existirem, elas não são ainda o caminho
dominante da criança.

## 4.3 Dois sistemas de autoria

**Legado:** função geradora por ID, Question flexível e muitos campos opcionais.  
**Novo:** `FichaCompetencia`, micros, níveis, distratores e `Composer.generate`.

**Risco:** corrigir somente fichas pode não alterar o exercício visto pela criança;
corrigir somente legado aumenta a dívida e afasta a migração.

**Estratégia:** migração vertical por competência, mantendo legado acessível até
paridade comprovada.

## 4.4 Montagem da aula

O Composer diário seleciona aquecimento, fronteira, resgate, fluência e fecho. Ele
possui lógica real de precisão, prática anterior, Radar e banco de erros.

Problemas observados:

- números de questões divergiam da dose documentada;
- ordem documentada e ordem do código precisavam de decisão explícita;
- IDs de fluência e fecho estavam hardcoded;
- exceções de geração eram capturadas e convertidas em ausência silenciosa;
- banco serializado pode perder funções de avaliação;
- grade incompleta limita F3/F4.

## 4.5 Avaliação de respostas

`Question` permite `answer: any`, `evaluate?: (ans: any) => boolean` e
`uiProps?: any`.

**Impacto:** TypeScript não impede renderer de receber props incompatíveis nem
garante resposta exatamente uma vez.

**Recomendação:** união discriminada por kind e builders tipados, migrados um kind
por vez.

---

# 5. Registro completo de achados críticos

## C-01 — Fontes curriculares divergentes

- **Fato:** havia 95 nós no agregado e 84 nos strands.
- **Impacto:** autoria e runtime podiam discordar.
- **Correção executada:** strands em 95, gerador YAML→JSON/TS e auditor de paridade.
- **Risco residual:** conteúdo rico de um strand ainda pode divergir semanticamente
  do Manual mesmo com ID/pré-requisito alinhado.

## C-02 — DAG calculado sem garantia de aplicação visual

- **Fato:** `getTracksForKid` calcula `computeUnlockStatus`, porém a lista observada
  deduplica todos os tracks e a devolve como “unlockedTracks”.
- **Impacto:** criança pode selecionar conteúdo cujos pré-requisitos não amadureceram.
- **Recomendação:** extrair `selectVisibleTracks`, aplicar `status.opened`, testar
  raízes, fronteira e conteúdo bloqueado e medir paridade antes/depois.

## C-03 — Kind e dados incompatíveis no Composer de fichas

- **Fato:** o kind retornado pode vir do nível, enquanto o switch de construção usa
  `micro.kinds[0]`.
- **Impacto:** tenframe pode receber dados de emojirow, por exemplo.
- **Recomendação:** builder selecionado pela primitiva efetiva e contratos por kind.

## C-04 — Domínio simplificado

- **Fato:** `dom` é concedido essencialmente por streak no nível 5.
- **Cânone:** exige ajuda zero, tempo-meta, retenção e independência.
- **Impacto:** falso domínio, desbloqueio precoce e relatório enganoso.
- **Recomendação:** `MasteryEvidence`, migração de saves e política de coroas antigas.

## C-05 — Cobertura executável insuficiente

- **Baseline:** 42/95 geradores explícitos; 53 fallbacks “Em construção”.
- **Impacto:** currículo completo no papel, incompleto na experiência.
- **Recomendação:** catálogo de cobertura e migração vertical por prioridade infantil.

## C-06 — Telemetria possivelmente negada

- **Fato:** cliente escreve em `userStates/{id}/Kids/{kid}/TelemetryLogs`.
- **Fato:** regras observadas autorizam o documento `userStates/{id}`, sem regra
  explícita para a subcoleção.
- **Impacto:** eventos podem falhar em produção; Radar analítico perde evidência.
- **Recomendação:** Firebase Emulator, regra específica, minimização e retenção.

## C-07 — Ferramentas declaradas e ausentes

- **Fato:** auditor antigo apontava para arquivo inexistente; foi corrigido.
- **Fato:** `npm run simular` ainda aponta para `simulated-learner-real.ts` ausente.
- **Impacto:** falsa sensação de simulador disponível.
- **Recomendação:** restaurar simulador contra motores reais ou remover script até
  existir, sem publicar números de mock como evidência.

## C-08 — Faixa escolar incompleta

- **Fato:** `Kid.grade` cobre apenas `pre | ano1 | ano2`.
- **Impacto:** escopo 4–12 e F3/F4 não são representados corretamente.
- **Recomendação:** separar idade, série escolar e faixa pedagógica, com migrador.

## C-09 — Coreografia acoplada ao GameLoop

- **Fato:** há lógica especial de aulas para count, sum, subvis e tens.
- **Impacto:** tutorial não é verdadeiramente dado universal; refatorações podem
  apagar sincronias.
- **Recomendação:** player único de timeline e API visual publicada por primitiva.

## C-10 — Misconceptions com poucos sensores

- **Fato:** Radar existe, mas muitos distratores são apenas `alvo ± 1`.
- **Impacto:** o erro informa que a resposta estava errada, não o raciocínio usado.
- **Recomendação:** cada distrator principal ligado a uma tag e estratégia corretiva.

---

# 6. Achados médios de arquitetura e manutenção

## M-01 — Componentes monolíticos

Arquivos medidos acima do teto de 350–400 linhas incluíam:

- `GameLoop.tsx` — aproximadamente 1.049 linhas;
- `ParentDashboard.tsx` — aproximadamente 960;
- `App.tsx` — aproximadamente 906;
- `generators.ts` — aproximadamente 802;
- `Mascot.tsx` — aproximadamente 777;
- `MascotEvolution.tsx` — aproximadamente 755;
- `GameLoopExerciseRenderer.tsx` — aproximadamente 613;
- `AdminGodPanel.tsx` — aproximadamente 610.

**Recomendação:** cortar por responsabilidade, não por quantidade arbitrária.

## M-02 — Tipagem fraca

Uso de `any` em respostas, opções, props, avaliação, passos e tracks customizados.
Isso permite tutorial `{fala}` onde runtime espera `{say}` e incompatibilidades de
primitiva sem erro de compilação.

## M-03 — Dependência invertida

Currículo importa cores do componente Mascot. O domínio deve depender de tokens ou
dados, nunca de componente React.

## M-04 — Erros silenciosos

Composer captura erro de geração e retorna `null`. Em produção, conteúdo some; no
Admin/teste, deveria falhar com contexto de nó, nível e gerador.

## M-05 — Persistência agregada

Salvar todo o estado em um documento aumenta contenção, tamanho e risco de conflito.
Evolução recomendada: snapshot versionado + eventos/telemetria separados.

## M-06 — Revisão baseada apenas em data

`lastDay` usa `YYYY-MM-DD`; viradas de dia e timezone podem antecipar ou atrasar
revisões. Guardar timestamp e timezone pedagógico.

## M-07 — Duas gerações de mascote

Renderers SVG/legado e motor V2 coexistem. Antes de expandir coleção, definir uma
interface única de ator, eventos e atlas.

## M-08 — Bundle grande

Build registrou aproximadamente 1,9 MB de JS minificado e 530 KB gzip, além de
imagens grandes. Admin, Pais, Galeria e testes do mascote devem ser lazy-loaded.

## M-09 — Lint nominal

`npm run lint` executa `tsc --noEmit`, não ESLint. Faltam regras de hooks,
acessibilidade, imports e promessas.

## M-10 — Código e arquivos históricos no alcance visual

`.bak`, backup de repositório e implementações antigas permanecem. Devem ser
preservados como evidência, mas excluídos explicitamente de ferramentas e bundles.

---

# 7. Auditoria pedagógica detalhada

## 7.1 CRA/CPA

**Ideal:** nível muda primeiro a representação e depois a magnitude.  
**Problema:** geradores legados muitas vezes aumentam apenas números; fichas podem
trocar kind sem garantir coerência de props.  
**Ação:** padrão-ouro por competência revisado contra o Manual.

## 7.2 Microcompetência e sessão

**Ideal:** uma decisão cognitiva por sessão.  
**Risco:** tracks históricos podem agrupar habilidades e o Composer mistura blocos
sem contrato explícito de dose por idade.  
**Ação:** uma track = uma competência, uma fronteira principal por sessão.

## 7.3 Áudio-first

**Pontos positivos:** TTS, replay, opções audíveis e fail-safe.  
**Lacunas:** `audioPrompt` não é obrigatório, opções nem sempre têm fala e a
deduplicação pode omitir instrução em questões visualmente diferentes.  
**Ação:** validador de não-leitor para F0/F1 e testes de fluxo sem texto.

## 7.4 Feedback de erro

**Ideal:** autocorreção → dica → mostra/avança; remediação profunda só por padrão.  
**Risco:** GameLoop concentra feedback e Radar; falta contrato por kind e evidência
de que `explain` não ensina a misconception.  
**Ação:** separar feedback imediato de agenda de resgate e validar explicações.

## 7.5 Oficina

Pendente:

- estado invisível para tropeço leve;
- lugar positivo para lacuna persistente;
- dois acertos por degrau de reaprendizagem;
- alvo de destravar, não coroar;
- dose proporcional;
- teto e escalada para pré-requisito anterior;
- visibilidade completa para responsáveis.

## 7.6 Dojo

Separação obrigatória:

- **Nível 1–5:** compreensão/abstração da Jornada;
- **Faixa 1–10:** magnitude/dificuldade do Dojo;
- **Força:** retenção/automaticidade ao longo do tempo.

Pendente: Jardim completo, famílias FD/PD completas, bloqueio de fluência virgem e
integração consistente do estado Dojo com progresso principal.

## 7.7 Domínio multidimensional

Dimensões canônicas:

1. compreensão;
2. fluência;
3. retenção;
4. independência.

A coroa só deveria surgir quando todas possuem evidência suficiente. Avançar no
grafo pode ocorrer em `maxLvl ≥ 3`, enquanto consolidação continua no Dojo.

## 7.8 Cobertura por idade

F0/F1 possuem maior cobertura real. F2–F4 concentram fallbacks, sobretudo em:

- multiplicação/divisão avançadas;
- frações e decimais;
- razão e porcentagem;
- geometria e volume;
- conversão de unidades;
- probabilidade e estatística.

---

# 8. UI/UX infantil e game feel

## Pontos positivos

- navegação por ícones;
- feedback positivo;
- áudio e replay;
- primitivas manipuláveis;
- bloqueio anti-duplo clique;
- mascote como vínculo emocional;
- economia sem retirar XP vitalício.

## Lacunas

1. exercício pode exceder viewport;
2. tamanhos não vêm integralmente de tokens responsivos;
3. falta teste de 768×1024 e 820×1180 por kind;
4. falta auditoria automatizada de contraste/foco/toque;
5. animações não têm política universal de `prefers-reduced-motion`;
6. bundle e assets prejudicam aparelhos modestos;
7. Admin está próximo do bundle infantil;
8. falta teste com criança simulando não-leitor e misclick.

## Regras recomendadas

- uma tela, uma pergunta, uma ação dominante;
- área de exercício nunca rola;
- alvo de toque grande e estável;
- transição curta, sem tela branca;
- erro sem som agressivo;
- celebração maior para F0, mais rápida para crianças maiores;
- movimento pedagógico distinto de movimento decorativo.

---

# 9. Mascote — especificação arquitetural registrada

## Fronteira

```text
Eventos pedagógicos → MascotEngine → estado semântico → renderer/atlas
```

O mascote reage a `ANSWER_CORRECT`, `SESSION_COMPLETED`, `FEED`, `EQUIP` etc., mas
não decide desbloqueio, nível, domínio ou acesso à aula.

## Animações desejadas

- ocioso;
- comendo;
- comemorando;
- dormindo;
- cansado;
- desmaiado;
- meditando;
- estudando;
- pensando;
- encorajando;
- chute;
- soco.

## Contrato futuro de atlas

Cada animação declara frames, FPS, loop, prioridade, interrupção, retorno ao idle,
âncora e fallback estático. T-Rex 1/T-Rex 2 são protótipos. Não expandir coleção
antes da base pedagógica; energia nunca pune ou bloqueia.

---

# 10. Testes e confiabilidade

## Evidência positiva original

- TypeScript aprovado;
- 25 arquivos/834 testes no primeiro baseline;
- após teste de artefatos: 26 arquivos/835 testes;
- build aprovado;
- auditor read-only aprovado;
- DAG sem ciclos e pré-requisitos inexistentes;
- artefatos do grafo determinísticos.

## Cobertura ainda necessária

- regras Firestore no Emulator;
- App e fluxo login→missão;
- DAG aplicado à lista visível;
- compatibilidade kind/props;
- coreografia com `show`;
- domínio multidimensional;
- Oficina e frustração entre sessões;
- acessibilidade;
- responsividade por kind;
- bundle budget;
- imports circulares;
- simulador estocástico com sementes e múltiplas execuções.

---

# 11. Plano completo em fases

## Fase 0 — Baseline e cadeia curricular

**Executado:** 95 nós alinhados, artefatos geráveis, auditor e build guard.  
**Critério:** nenhuma divergência silenciosa Markdown/YAML/JSON/TS/strands.

## Fase 1 — Organização

- README operacional;
- nomes canônicos inequívocos;
- exclusões explícitas de histórico;
- documentação marcada como atual ou histórica;
- registrar mudanças no Diário.

## Fase 2 — DAG e contratos

- aplicar DAG na seleção visível;
- teste de raízes/fronteira/bloqueio;
- tipos discriminados de Question;
- tutorial e distratores tipados;
- série/idade/faixa separadas;
- migrador compatível.

## Fase 3 — Motor de exercícios

- competência padrão-ouro;
- builder por kind efetivo;
- resposta única;
- distratores diagnósticos;
- coreografia universal;
- paridade antes de retirar legado;
- lotes de 2–3 fichas, nunca migração cega.

## Fase 4 — Adaptatividade

- domínio multidimensional;
- Radar recebendo resposta selecionada;
- frustração e troca de strand;
- revisão espaçada;
- Oficina proporcional;
- Dojo nível × faixa × força;
- política de migração do progresso.

## Fase 5 — UI e mascote

- viewport infantil sem rolagem;
- tokens responsivos;
- reduced motion e acessibilidade;
- lazy loading e assets;
- componentização;
- motor independente do mascote.

## Fase 6 — Produção

- E2E;
- Firebase e privacidade;
- telemetria/custos;
- simulador;
- beta fechado;
- observação real;
- métricas de retenção e frustração;
- publicação.

---

# 12. Matriz consolidada de prioridade

| Ordem | Entrega | Por que vem agora | Risco |
|---:|---|---|---|
| 1 | DAG aplicado na UI | impede conteúdo prematuro | médio |
| 2 | `AL.01` registrada | fecha ficha órfã | baixo |
| 3 | competência padrão-ouro | valida arquitetura vertical | médio |
| 4 | contratos por kind | impede telas incompatíveis | alto gradual |
| 5 | domínio correto | evita falso desbloqueio | alto |
| 6 | Radar/Oficina | transforma erro em recuperação | alto |
| 7 | Dojo consolidado | automatiza após compreensão | alto |
| 8 | Firebase/telemetria | evidência confiável e custo | alto |
| 9 | componentização | reduz regressão | médio |
| 10 | responsividade/a11y | criança consegue usar | médio |
| 11 | cobrir fallbacks | transforma currículo em produto | grande |
| 12 | mascote profissional | vínculo sem atrasar base | médio |

---

# 13. Comandos de evidência

```bash
git status --short --branch
npm run auditar
npm run grafo:check
npm run lint
npm test
npm run build
git diff --check
```

Ferramenta ainda ausente:

```bash
npm run simular
# falha enquanto simulated-learner-real.ts não existir
```

---

# 14. Definição de pronto do projeto estabilizado

O objetivo amplo só estará concluído quando houver evidência de que:

1. fonte curricular e derivados não divergem;
2. DAG governa todas as entradas da criança;
3. competência ativa possui contrato válido;
4. progressão preserva saves e segue domínio canônico;
5. Radar e Oficina tratam padrões, não tropeços;
6. Dojo treina apenas compreensão adquirida;
7. telemetria autorizada e sustentável;
8. UI funciona em celular/tablet para não-leitor;
9. componentes críticos respeitam limites arquiteturais;
10. testes cobrem motores, fluxo, Firebase, acessibilidade e regressão visual;
11. fallbacks publicados são claramente controlados ou substituídos;
12. beta com crianças confirma compreensão e ausência de frustração sistêmica.

