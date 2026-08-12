# CHECKPOINT — GAMIFICAÇÃO / ECONOMIA / META-JOGO FECHADA

Data: 2026-08-09

Branch única: `codex/integrar-bloco-f0`

PR de comparação/CI: #29 — **NÃO MESCLAR NA MAIN**

Base protegida: `main@68fad4c575e28959b2ca4776e9a541d6828b63f3`

Creature Engine: **não modificado** nesta frente.

> **Nota de auditoria de recibos (9/ago/2026).** Um fechamento anterior gravou neste documento SHAs/runs intermediários que não eram resolvíveis no GitHub remoto. Eles foram removidos. O recibo abaixo é o que foi revalidado diretamente no GitHub remoto antes deste saneamento documental. Próximas sessões devem sempre reancorar o **head atual da PR** e seu CI, sem confiar em SHA narrado por conversa.

## 1. Estado terminal funcional verificável

**Head remoto de implementação/documentação da frente revalidado:**

`98fb324ae20b20542120cea5edbd6982658bf6d2`

Commit: `docs: fechar checkpoint de gamificação economia e meta-jogo`.

**CI verificável:** #812 / run `31325218446` — **SUCCESS integral**.

Evidências extraídas do próprio run #812:

- `npm run auditar`: verde;
- `npm run fichas:auditar`: verde;
- `npm run fichas:conferir`: verde;
- `npm run grafo:check`: verde;
- TypeScript: verde;
- **159 arquivos / 2.377 testes Vitest verdes**;
- build Vite/server: verde;
- `npm run pr:check`: verde;
- higiene do diff: verde;
- guarda de binários: verde;
- sonda real Sensei: verde;
- artefato da sonda real: id `9041334019`, nome `sonda-sensei-98fb324ae20b20542120cea5edbd6982658bf6d2`.

A auditoria do mesmo run confirmou:

- Curriculum Graph/YAML/JSON/TypeScript: **90 competências**;
- fichas autorais: **94**;
- Composer registrado/ativo: **26/90**;
- servido sem placeholder: **51/90**;
- fallback real: **39/90**;
- padrão-ouro: **26**;
- legado: **25**;
- divergências ficha↔tela: **21/90**;
- trocas de linguagem visual sem aviso: **12**;
- estreias de ferramenta sem precedente: **44**;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

Comparação remota feita durante o saneamento documental contra o último checkpoint anterior `f2ce7119...` mostrou **0 commits atrás** e nenhum arquivo `engine/mascot-v2`/Creature Engine na frente de gamificação. Não congelar aqui a contagem de commits à frente: ela muda quando documentos de handoff são saneados; o próximo agente deve recalculá-la.

## 2. Falha objetiva que abriu a frente

A frente começou em regression-first no commit `029fa39d6f4f9bda462e5ab8ab3afdee9ed9d58e`.

A regressão provou que XP vitalício do Dojo podia desaparecer ao materializar `progress.dojo_*` para `dojoTracks`:

- antes da materialização: 35 XP;
- depois: 10 XP;
- causa: `Progress.stars` estava sendo usado como memória de meta-progressão em uma representação que o Dojo corretamente remove do learner state conceitual.

A correção não foi tratada como remendo local; a frente redesenhou a separação entre verdade pedagógica, identidade do jogador e economia.

## 3. Três progressões diferentes — contrato permanente

### A. Progressão do aprendiz

Pergunta: **o que a criança sabe fazer?**

Fonte de verdade:

- Curriculum Graph;
- `Progress` conceitual;
- `masteryEvidence`;
- domínio/níveis pedagógicos;
- Radar/misconceptions;
- Dojo/Jardim como automaticidade;
- Oficina como recuperação causal.

Somente esta camada tem autoridade para mastery, unlock curricular, prescrição e domínio.

### B. Progressão do jogador/perfil

Pergunta: **quanto a criança já viveu/construiu no SAGA?**

- **Nível SAGA 1–100 pertence à criança/perfil, não ao mascote**;
- não é nota, série, QI nem nível matemático;
- trocar personagem/skin/companheiro não altera o nível da criança;
- XP é vitalício e não é gasto;
- XP não compra mastery, unlock, Oficina, Jardim, Matrícula ou autoridade do Sensei.

### C. Progressão do companheiro

Pergunta: **como o companheiro cresce e reage à jornada?**

É uma camada de fantasia/vínculo separada. Hoje ainda existem estados cosméticos/estágios legados; a evolução futura exige estado próprio de vínculo, emoção, necessidades suaves, inventário e capacidades de jogo. Ela nunca vira learner state.

Visão permanente registrada em:

`AI_Studio_Lab/codex/VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md`.

## 4. Fonte de verdade do XP vitalício

`src/lib/gamificationProgress.ts` centraliza a leitura:

- Jornada/conceito: `progress.*.stars`;
- Dojo/Jardim/fluência: `dojoTracks.*.xpStars`;
- total: `getKidLifetimeXp(kidId, state)`.

O campo de XP em fluência é meta-progressão opaca; não concede autoridade pedagógica.

### Dojo

`senseiDojoProgressContext.ts` preserva XP de saves legados e dos markers reais ao materializar para `dojoTracks`, sem migrar `dom/masteryEvidence` para o Dojo.

### Jardim

`jardimEngine.ts` acumula `xpStars` no estado JD sem usar a competência-mãe conceitual como carteira.

### Persistência

`gamificationPersistence.test.ts` cobre:

- `JSON → migrate` preserva XP conceitual + fluência;
- legacy Dojo → materialização → JSON → migrate preserva total;
- reload/materialização repetida não duplica XP.

## 5. Política econômica central

`src/lib/rewardPolicy.ts` é a política V1.

### XP

- resposta terminal correta e elegível: **+1 XP**;
- erro: 0;
- missão perfeita: **+5 XP**;
- velocidade não multiplica XP;
- Misto não multiplica XP;
- fallback: 0;
- retry intermediário/double tap não chega ao boundary premiável;
- replay deliberado é prática nova e pode render base, sem repetir o bônus único da primeira missão.

### Moedas

- acerto real: **+1 moeda**;
- conclusão: +3;
- primeira missão do dia: +5 adicionais +1 ração;
- Misto: moeda 2×, XP normal;
- fallback: 0;
- gasto inválido/saldo insuficiente é rejeitado.

## 6. Velocidade fica no lugar pedagógico correto

A regra antiga do Dojo pagava 15/5/2 XP conforme RT e continha um atalho que podia acelerar `streak` por rapidez.

Isso foi removido.

RT continua útil para automaticidade/fluência no Dojo, mas:

- criança lenta e correta recebe o mesmo XP de perfil;
- velocidade não compra mastery;
- velocidade não acelera nível conceitual;
- `LENTO_DEDOS` continua sendo sinal de fluência/automaticidade, não reprovação de compreensão.

`gamificationWiring.test.ts` protege esses contratos.

## 7. Curva Nível SAGA 1–100

Curva inicial configurável:

`threshold(level) = round(10*n + 0.35*n²)`, com `n = level - 1`.

Marcos:

- L1: 0 XP;
- L2: 10 XP;
- L10: 118 XP;
- L100: **4.420 XP**.

Missão padrão perfeita de 8 itens: **13 XP**.

Simulação:

- 1 missão perfeita/dia → L100 em ~340 dias;
- 2/dia → ~170 dias;
- 3/dia → ~114 dias.

É primeira calibração, não constante sagrada. Pode ser recalibrada por telemetria sem mexer em mastery.

## 8. Economia longitudinal V1

Missão comum perfeita de 8 itens:

- primeira do dia: **16 moedas**;
- seguintes: **11 moedas**.

Referências de escala:

- 1 missão/dia = 16/dia;
- 2/dia = 27/dia;
- 3/dia = 38/dia;
- 30 dias a 1/dia = 480;
- 90 dias a 1/dia = 1.440.

O álbum atual permanece **bancada provisória de consumo**, não fundamento do motor econômico.

## 9. Transações econômicas atômicas

`src/lib/economyTransactions.ts` fecha o boundary:

- `applyKidPurchase`: mutação + débito ou nada;
- `purchaseAlbumItem`: duplicata não cobra;
- `spendCoins`: saldo insuficiente/valor inválido rejeita;
- nenhum clamp silencioso autoriza compra sem saldo.

`economyTransactions.test.ts` e `economyWiring.test.ts` guardam o contrato.

## 10. Atlas de Habilidades / insígnias

`src/lib/skillAtlas.ts` projeta o **Curriculum Graph real** para uma leitura infantil.

Estados:

- `not-started`;
- `learning`;
- `consolidating`;
- `mastered`;
- `coming-soon` para fallback.

Regras:

- XP/moedas são ignorados;
- `lvl=5` sem domínio maduro não vira insígnia máxima;
- somente `dom=true` gera `mastered`;
- fallback não conta como competência real servida.

Isso permite um futuro mapa visual/ilhas/skill tree sem criar uma segunda verdade pedagógica.

## 11. Perfil infantil

O Perfil passou a mostrar:

- Nível SAGA 1–100;
- XP vitalício e progresso ao próximo nível;
- Atlas de Habilidades;
- habilidades dominadas e progresso por domínio;
- dias de jornada e desafios respondidos;
- companheiro;
- álbum/coleção.

O megamapa visual definitivo fica depois da Coverage Matrix/fábrica curricular.

## 12. Mascote — correção limitada, sem Creature Engine

`MascotEvolution.tsx` usa XP vitalício unificado.

Bug corrigido: existiam 8 estágios, mas a UI de próxima evolução parava no estágio 5. Agora percorre os 8 estágios.

Nenhum arquivo do Creature Engine foi alterado.

## 13. Consistência UI ↔ persistência

Fechado:

- Misto mostra a mesma moeda 2× que persiste;
- fallback não anuncia prêmio inexistente;
- primeira missão do dia é congelada no início da sessão para o recibo visual não mudar depois do commit;
- replay não repete bônus único de primeira missão;
- rótulos não fingem `+5` quando o multiplicador econômico altera o total.

## 14. Idempotência — escopo correto

Protegido:

- double tap síncrono;
- retries intermediários;
- materialização Dojo repetida;
- reload;
- compra duplicada do álbum;
- replay sem duplicar bônus único;
- retry de cloud reenvia snapshot reconciliado, não reaplica evento econômico separado.

Não foi criado event ledger global porque não houve falha objetiva que exigisse essa complexidade. Reavaliar se o produto evoluir para servidor autoritativo, compras pagas ou concorrência aditiva real entre dispositivos.

## 15. Visão futura registrada — não executar agora

`VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md` registra, como direção refinável:

- companheiro/NPC meta-inteligente persistente;
- emoções/retratos;
- alimentação, banho, carinho, sono, estudo, corrida e treino/artes marciais como necessidades suaves;
- widget futuro no celular;
- sem morte/doença/perda de evolução/culpa por ausência;
- personagens autorais animais humanoides em HD pixel art;
- fighting game 1×1 com combos/especiais;
- beat ’em up 2.5D/belt-scroll com profundidade;
- contrato de animação reutilizável;
- `Laboratório de Raciocínio / Thinking Lab` para lógica, resolução de problemas, padrões, abstração, algoritmos, modelagem, dados, debugging, pensamento causal/sistêmico, metacognição e ponte futura com programação/engenharia/robótica/IA.

Tudo pode ser aperfeiçoado. Nada disso autoriza tocar no Creature Engine nesta fila.

## 16. Contratos permanentes desta frente

Não reabrir sem falha objetiva:

1. learner state é soberano para mastery/unlock;
2. Nível SAGA é do perfil, não do mascote;
3. XP é vitalício e não gastável;
4. moedas são gastáveis;
5. velocidade não multiplica XP nem streak conceitual;
6. criança lenta e correta não recebe menos XP;
7. Misto 2× afeta moedas, não XP/mastery;
8. fallback não fornece evidência nem prêmio real;
9. insígnias curriculares derivam do learner state;
10. compra é atômica e não admite saldo negativo;
11. UI e persistência usam a mesma política;
12. ausência não causa perda de nível, morte ou punição do companheiro;
13. Creature Engine permanece desacoplado da pedagogia/economia.

## 17. Dívida curricular preservada

A auditoria real do CI #812 confirma:

- 90 competências;
- 94 fichas autorais;
- Composer 26/90;
- servido sem placeholder 51/90;
- 25 legado;
- 39 fallback;
- 21 divergências ficha↔tela;
- 12 trocas de linguagem visual;
- 44 estreias de ferramenta;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

**Não iniciar fábrica antes da Coverage Matrix.**

## 18. Próxima tarefa única

**Coverage Matrix.**

Objetivo:

`Curriculum Graph → ficha canônica → implementação real → screen/primitiva → Composer/Sensei → testes/auditoria → status → dívida/bloqueio → ação → ordem causal`.

Depois:

`Coverage Matrix → fábrica curricular → mega auditoria integrada → hardening/performance → release`.

Arte definitiva, Creature Engine, widget e jogo ficam em trilha futura separada até o núcleo matemático estar fechado.

---

**Regra de ouro:** a criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor. O meta-jogo celebra o caminho; ele nunca decide o que a criança sabe.
