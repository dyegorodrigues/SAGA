# CHECKPOINT — W43 N4.12/F71 FECHADA — 2026-08-17

## Estado remoto vinculante

- Repositório: `dyegorodrigues/SAGA`
- PR: `#35` — **open + draft + unmerged**
- Branch: `codex/fechamento-curricular`
- `main`: `106dfe0d796babebe40ebc36e5a84d4a80b9a858` — intocada
- Recibo técnico final W43: `83c18fd6902bb3d23a77fca04c051cd417b103b7`
- CI final: `32048810747` — `completed/success`
- Certificação transversal final: `32048810884` — `completed/success`

## Coverage Matrix observada

- 90 competências / 94 fichas autorais
- **68 Composer**
- **15 legado**
- **7 fallback**
- **83 servidas**
- **11 divergências**
- **68 canários ativos**
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

A Matrix executável observou o delta nominal de `N4.12`: `+1 Composer / -1 fallback / +1 servida`, sem delta de divergência. O executável é a autoridade; o baseline não foi usado para fabricar o resultado.

## Cadeia técnica W43

1. **Fechamento W42 + regression-first W43:** `d22784a4bb9c87aa87428ba81cdaa08014c907cc`.
   - Certificação transversal `32041792980` = `completed/success`;
   - CI `32041793014` = `completed/failure` nominal;
   - 232 arquivos / 3.259 testes; 3.258 passam;
   - único vermelho: `src/curriculum/divisaoDoisDigitosW43.test.ts`, pela ausência real de `N4.12/F71`.
2. **Primeira materialização inativa:** `0a89c77b6b556475256e1eace75925b4402e2629` — ficha, contrato, palco, renderer, runtime map, Radar/evidência e testes físicos, ainda sem canário/ledger/Matrix.
3. **Reparo de observabilidade:** `93679c50971cf166fafdf66475601a7595ef0ffd` — corrigiu observabilidade F70/F71 antes do portão, sem antecipar promoção.
4. **Materialização inativa final:** `6c056a8dbf7accdb5e1f1d62bee4f048bd882f35` — liga o emissor da evidência F71 ao gate P13; CI `32044672592` + transversal `32044672629`, ambos `completed/success`.
5. **Promoção atômica final:** `83c18fd6902bb3d23a77fca04c051cd417b103b7` — no mesmo SHA: canário `N4.12` + ledger nominal `W43-N4.12` + contrato/baseline Matrix; CI `32048810747` + transversal `32048810884`, ambos `completed/success`.

## Auditoria pedagógica e física F71

Contrato preservado:

- competência `N4.12`;
- prereqs `N4.10 + N2.04`;
- primitiva canônica `InteractiveVertical`;
- cinco níveis: divisor redondo → próximo de redondo → qualquer divisor → resto → zero no quociente;
- ciclo causal **estimar → testar por multiplicação → ajustar**;
- a estimativa é produzida pela criança; a representação não vaza o quociente correto;
- rascunho registra multiplicações de teste e torna visível `passou` / `cabe mais`;
- resto final precisa ser menor que o divisor;
- zero posicional no quociente é preservado no nível 5;
- domínio `4/4` em `3` sessões, incluindo evidência de ajuste da primeira estimativa;
- exposição motora alta preserva alternativa por toque, tolerância generosa, alvo ≥80px e separação entre erro motor e misconception.

Diagnósticos efetivos no Radar:

- `nao-estima`;
- `nao-ajusta`;
- `resto-maior-ou-igual-divisor` reutilizado semanticamente.

A evidência `ajuste-primeira-estimativa-f71` está ligada ao gate P13. O teste físico cobre, entre outros casos, `399 ÷ 19` a partir de estimativa produzida pela criança, sem vazar `21`, e colhe a evidência somente após ajuste real.

## Regressões preservadas

No SHA final W43 passaram:

- catálogo, fichas, conformidade, grafo, TypeScript, suíte completa e build;
- **233 arquivos de teste / 3.279 testes**, todos verdes;
- Sonda real Sensei e sondas históricas F19/F61/F29/F36/F13/F15/F14/F30/F97;
- guarda de binários e higiene do diff;
- Certificação transversal completa, inclusive larguras responsivas e sementes canônicas.

## Fila residual pós-W43

Restam **7 fallbacks**:

`AL.08, GM.11, N5.04, N5.05, N6.02, N6.04, PE.04`.

Todos os candidatos imediatamente elegíveis têm ganho imediato de desbloqueio zero. No menor `causalWave=14` ficam `AL.08`, `N5.04` e `N6.02`; `N5.04` vence o desempate por impacto downstream, porque é pré-requisito de `N5.05`. Portanto a próxima onda é:

- **W44 — `N5.04 / F74 — Somar Frações`**;
- prereq: `N5.03`;
- primitiva: `SingaporeBars`;
- fundamento: juntar partes de mesmo tamanho não altera o denominador;
- domínio: `3/3` em `2` sessões, com a restrição canônica de não creditar acerto de domínio imediatamente precedido por `SOMA_DENOMINADOR` na mesma sessão.

## Governança pós-90/90

Issues `#47` e `#48` permanecem registradas e não autorizam interromper W44–W50. Só viram portas obrigatórias quando a Matrix chegar a `fallback=0 / 90 servidas` e a última onda estiver certificada.

## Restrições preservadas

- não tocar/mergear `main`;
- PR #35 permanece draft + unmerged;
- não marcar ready;
- não habilitar auto-merge;
- não tocar Creature Engine/Tamagotchi;
- não enfraquecer testes, Matrix, sondas ou auditores;
- não mascarar deriva com baseline;
- não misturar recibos de SHAs diferentes;
- cânone compartilhado permanece aditivo.
