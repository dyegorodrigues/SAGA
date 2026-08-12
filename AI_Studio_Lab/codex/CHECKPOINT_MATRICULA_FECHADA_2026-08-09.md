# Checkpoint — Matrícula adaptativa fechada

> **VIGENTE em 9/ago/2026.** Este checkpoint substitui `CHECKPOINT_MISTO_FECHADO_2026-08-09.md` como fonte operacional mais nova. Não reabrir blocos anteriores sem falha objetiva.

## 1. Âncora Git verificada

- repositório: `dyegorodrigues/SAGA`;
- branch única de trabalho: `codex/integrar-bloco-f0`;
- PR: #29, **open + draft + unmerged**;
- base: `main` em `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- Creature Engine fora deste fluxo;
- nenhuma branch auxiliar criada.

## 2. Incidente de recuperação desta sessão

Uma trava de chat deixou a Matrícula em estado parcialmente publicado. A verificação remota encontrou, antes de encerrar:

1. `matricula.ts` adaptativo estava no GitHub;
2. `answerPolicy` armava a identidade da sonda;
3. o resultado terminal ainda não chegava à sessão adaptativa;
4. `matricula.test.ts` ainda validava o contrato estático antigo;
5. a sonda Chrome específica da primeira Matrícula não havia sido salva;
6. este checkpoint e a pré-auditoria cloud ainda não existiam, apesar de terem sido descritos no chat.

Nada foi mascarado. As pontas foram reconstruídas no remoto e o CI passou na cabeça funcional resultante.

## 3. Matrícula — contrato fechado

A Matrícula agora é placement adaptativo, sem série/idade como teto curricular.

Cadeia real:

`primeira visita → Sessão de Boas-Vindas → N1.04 gentil → resultado terminal → sessão de placement → próxima âncora → early stop/continuação → seed conservador → Sensei`.

Regras:

- universo possível = currículo matemático canônico, mesmo se um caller legado passar apenas `tracks[kid.grade]`;
- só entram tracks com conteúdo real; fallback não é usado como sonda;
- início gentil em `N1.04`, nível 2;
- cada âncora recebe um par de sondas;
- evidência forte sobe para âncoras mais altas;
- fraqueza mantém a sondagem em bases seguras;
- após pelo menos 3 pares, dois pares fracos consecutivos encerram cedo;
- teto de 8 pares / 16 questões para evitar fadiga;
- uma criança avançada pode alcançar âncoras além da antiga série;
- placement **não concede `dom`**;
- seed usa somente pares realmente respondidos;
- retry intermediário não conta como novo resultado de placement.

## 4. Boundary terminal recuperado

`answerPolicy.ts` chama `prepareMatriculaForAnswer(q)` em toda tentativa real. O resultado só é consumido no terminal, por meio do boundary que `progressEngine` já atravessa em `consumeSenseiDojoTerminal(...)`.

A chamada `consumeMatriculaTerminal(terminalRight)` ocorre antes da interceptação específica do Dojo. Assim:

- retries não duplicam evidência;
- a sessão recebe o resultado antes de `GameLoop` gerar a questão seguinte;
- `track.totalQ` pode reduzir dinamicamente para early stop antes de `isLast` ser calculado;
- Dojo mantém sua semântica separada.

Regressão de integração: `src/utils/matriculaBoundary.test.ts` prova `answerPolicy → progressEngine → terminal → próxima sonda`.

## 5. QA funcional e visual

Cabeça funcional validada: `f4ed86fcd70241e6324392b40bd457d44279ba61`.

CI **#744**, run **`31314596574`**, integralmente verde:

- auditoria do catálogo;
- auditoria das fichas;
- conformidade das fichas;
- sincronia do grafo;
- TypeScript;
- **149 arquivos / 2.309 testes**;
- build de produção;
- `pr:check`;
- higiene do diff;
- guarda de binários;
- Chrome real.

Artefato Chrome: **`9038385938`**.

A sonda permanente agora roda Dojo + Jardim + Matrícula. Para a Matrícula, em telefone `390×844` e tablet `768×1024`, ela prova:

- perfil sem progresso mostra `Sessão de Boas-Vindas`;
- `Começar Sondagem` abre o GameLoop;
- a primeira rota chega ao palco `TouchCount` real correspondente à âncora canônica `N1.04`, nível 2;
- não aparece `Em construção!`;
- não há overflow horizontal;
- não há HTTP failure, `pageerror` ou console error fatal.

O artefato contém:

- `phone-matricula-home.png`;
- `phone-matricula-primeira-sonda.png`;
- `tablet-matricula-home.png`;
- `tablet-matricula-primeira-sonda.png`;
- `matricula-summary.json`;
- além das evidências permanentes de Dojo/Jardim.

## 6. Blocos fechados — não reabrir sem falha objetiva

- P17–P22 e cânone;
- 90 competências / 94 fichas / cobertura autoral 90/90;
- Radar/source/persist/DAG/Oficina causal;
- Tutor↔Dojo `manual | prescribed`;
- QA Chrome real permanente;
- Jardim causal;
- banco composto por source + `review/sig` — CI #682;
- telemetria v2 + Leitner — CI #691;
- `LENTO_DEDOS` sem autoridade conceitual — CI #702;
- timezone/dia civil — CI #717;
- recomendador paralelo por estrelas removido — CI #720;
- Misto por repertório dominado/elegível — CI #733;
- **Matrícula adaptativa — CI #744**.

## 7. Dívida curricular continua explícita

- Composer ativo: 26/90;
- servido sem placeholder: 51/90;
- 25 fichas prontas ainda servidas por legado;
- 39 fichas prontas ainda em fallback;
- 21 divergências ficha↔tela;
- 12 trocas de linguagem visual;
- 44 estreias de ferramenta a classificar;
- primitivas incompletas: `LinkingCubes`, `Moedas`, `SingaporeBars`, `VisualAddition`, `Quadrado100`, `Regua`;
- `Moedas` bloqueia GM.03; `Regua` bloqueia GM.05.

Não iniciar fábrica curricular em massa antes da Coverage Matrix.

## 8. Próxima tarefa única — cloud reconciliation

Leia junto:

`PREAUDITORIA_CLOUD_RECONCILIATION_2026-08-09.md`.

Próxima cadeia:

`auth/UID → local save → cloud save → reconcile → migrate/materialize → React state → writers → troca de conta → anonymous→Google → offline/reconexão → concorrência`.

**Não é necessário pedir ao autor para abrir o Firebase Console, gerar token ou configurar projeto para iniciar esta fase.** O trabalho começa em código puro, contratos, mocks e testes existentes. Se uma etapa futura exigir uma operação exclusiva do Console/deploy, ela deve ser isolada como item de implantação e não bloquear a auditoria lógica.

## 9. Fila depois da nuvem

simulação longitudinal → gamificação/economia/mascote → Coverage Matrix → fábrica curricular → mega auditoria → hardening/performance/release.

> **A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**
