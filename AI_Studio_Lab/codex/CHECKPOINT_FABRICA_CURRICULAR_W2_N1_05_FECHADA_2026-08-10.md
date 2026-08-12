# CHECKPOINT — Fábrica Curricular W2 / N1.05 FECHADA — 10/08/2026

## Fonte de verdade

Este checkpoint substitui qualquer afirmação anterior de que W2/N1.05 já estava fechada. A promoção funcional só é considerada fechada a partir do head **`3af6dc6554d4938adeca4f86bdaf9fe57f6089a9`**, validado pelo **CI #868 / run `31356943271`**.

Repo: `dyegorodrigues/SAGA`  
Branch única: `codex/integrar-bloco-f0`  
PR #29: somente comparação/CI; deve permanecer **open + draft + unmerged**.  
Main protegida: `68fad4c575e28959b2ca4776e9a541d6828b63f3`.  
Creature Engine permanece fora desta fila.

## O que W2 corrigiu

N1.05 / F06 — **Comparação de quantidades** estava servida por um legado que começava com grupos concretos e, nos níveis superiores, degradava a experiência para comparação abstrata de numerais. Isso contrariava a ficha: a dificuldade deve crescer por **conservação perceptual**, sem retirar o concreto.

A cadeia autoral vigente é:

`N1.05 → specialized builder → kind grandeza / modo quantidade → GrandezaStage → ComparacaoQuantidadeStage → Grupo`

O `Grupo` real foi preservado. Não foi criada uma segunda ontologia/primitiva concorrente.

### Progressão fechada

- L1: 2 × 6, diferença óbvia;
- L2: 3 × 5, pareamento disponível sob demanda;
- L3: 4 × 5;
- L4: grupo menor recebe itens visualmente maiores — `CONFUNDE_TAMANHO_QUANTIDADE`;
- L5: grupo menor ocupa mais espaço aparente — `CONSERVACAO_ESPACO`.

Os dois contêineres são semanticamente equivalentes e o gabarito deriva sempre da quantidade real.

## Defeitos encontrados DURANTE o fechamento

A primeira declaração documental de W2 foi prematura. O workflow regression-first encontrou, em sequência:

1. **CI #856** — N1.05 não declarava `rt_alvo` positivo no nível 5. Corrigido para `8000 ms`. É relógio silencioso de fluência/telemetria; não concede mastery.
2. O specialized builder não propagava integralmente `tutorial`, `masteryRule` e `rt_max_s`. Corrigido: specialized builder continua sujeito ao contrato universal da ficha.
3. O tutorial/estágio inicial podia revelar a sobra inteira antes de a criança responder. Corrigido: demonstra apenas o primeiro par e devolve a tela limpa.
4. Depois de erro, o pareamento completo podia permanecer colado no retry. O palco já limpava estado; o teste foi corrigido para flush React real com `act`, preservando a exigência de retry limpo.
5. As tags F06 estavam como strings privadas. Foram centralizadas em `MisconceptionTag`:
   - `CONFUNDE_TAMANHO_QUANTIDADE`;
   - `CONSERVACAO_ESPACO`;
   - `COMPARA_SEM_CONTAR`.
6. O runtime da ficha trazia pré-requisito extra `N1.03`; reconciliado com o Curriculum Graph: N1.05 depende de `N1.04`.
7. O nível 4 usava `andaime: "baixo"`, valor fora do schema. Corrigido semanticamente para `"minimo"`.
8. **CI #863/#865** expôs que a documentação dizia W2, mas o ledger executável da Coverage Matrix ainda só tinha W1. O snapshot P21.1 foi preservado e W2 entrou como migração nomeada.
9. **CI #866** expôs que N1.05 estava ativa sem constar no contrato explícito de canários e os novos testes precisavam de flush/timeout adequado. Corrigido sem retirar o canário nem afrouxar cobertura.

Essas falhas não foram ocultadas nem acomodadas por baseline cosmético; cada uma foi tratada na fonte correspondente.

## Coverage Matrix — histórico preservado + W2 governada

Snapshot imutável P21.1:

- 90 competências / 94 fichas autorais;
- Composer 26;
- legado 25;
- fallback 39;
- servidas 51;
- divergências 21;
- swaps 12;
- estreias 44;
- blockers `Moedas`, `Regua`.

Ledger:

- `W1-N1.04`: `divergences -1`;
- `W2-N1.05`: `composer +1`, `legacy -1`, `divergences -1`.

Baseline vigente após W2:

- **Composer 27**;
- **legado 24**;
- **fallback 39**;
- **servidas 51**;
- **divergências 19**;
- **swaps 12**;
- **estreias 44**;
- blockers continuam `Moedas` e `Regua`.

## Recibo verde final

Head funcional fechado: **`3af6dc6554d4938adeca4f86bdaf9fe57f6089a9`**  
CI: **#868 / run `31356943271` — success**.

Gates confirmados:

- auditoria curricular: 90 nós, 94 fichas;
- Composer registrado/ativo: 27;
- servido sem placeholder: 51;
- fallback: 39;
- Journey fichas: 32/32 com `rt_alvo` no nível 5;
- Coverage Matrix: 27 Composer / 24 legado / 39 fallback / 51 servido / 19 divergências / 12 swaps / 44 estreias / `Moedas`,`Regua`;
- ficha catalog: 94 fichas / 90 competências;
- grafo sincronizado;
- TypeScript: success;
- suíte completa: **163 arquivos / 2406 testes, todos passando**;
- build: success;
- `pr:check`: 254 arquivos no diff integral, nenhum binário;
- sonda real Sensei: success.

Artefato da sonda:

- nome: `sonda-sensei-3af6dc6554d4938adeca4f86bdaf9fe57f6089a9`;
- ID: `9050977700`;
- tamanho: `1004344` bytes;
- SHA-256: `bbd554433de3d7e92890327692c720a291bb5f8bd2f6700c5230073641bff58f`.

Avisos `jsdom canvas` e bundle >500 kB continuam hardening conhecido; não bloquearam W2 e não devem ser usados para reabrir este front sem falha objetiva.

## Próxima tarefa única — W3

Escolher o próximo nó pela Coverage Matrix vigente. A auditoria causal feita durante W2 aponta **N2.01 / F21 — Dezena e unidades** como candidato principal, porque:

- é legado + divergente;
- seus pré-requisitos (`N1.09`, `N1.11`) já estão autorais/ativos;
- instala a dezena como unidade e alimenta grande parte do DAG de N2/N3/AL/GM;
- seu legado atual entrega `Quadrado100`, enquanto a ficha exige `MaterialDourado + TenFrame`;
- o `MaterialDourado` existente é visual e estático; F21 exige ação real de `10 unidades → 1 dezena`, além da inversão no L4.

**Não promover N2.01 apenas trocando a tela.** Fluxo obrigatório:

`ler F21 inteira → regressão primeiro → contrato procedimental de troca → palco autoral sobre MaterialDourado existente → diagnóstico/telemetria → canário → Matrix observa → ledger governa → gates → checkpoint`.

Se a auditoria objetiva de W3 contradizer essa prioridade, reordenar pela Matrix; não por conveniência.

## Contratos permanentes

- learner state é autoridade de mastery/unlock/prescrição;
- velocidade/RT nunca compra mastery/XP conceitual;
- fallback não fornece evidência/recompensa real;
- Coverage Matrix é projeção derivada, não segunda ontologia;
- snapshot fechado nunca é reescrito; evolução entra por migração nomeada;
- telemetria observa/abre investigação; não reescreve automaticamente o Curriculum Graph;
- main/Creature Engine permanecem intocados nesta fila.

**A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**
