# CHECKPOINT — Fábrica Curricular W45 · N6.04/F88 FECHADA · 2026-08-17

> Recibo humano da onda W45. As autoridades continuam sendo GitHub remoto, canário, DAG, Coverage Matrix, runtime map e workflows do SHA exato.

## 1. Âncora da onda

- Repo: `dyegorodrigues/SAGA`
- PR: `#35` — preservado `open + draft + unmerged`
- Branch: `codex/fechamento-curricular`
- `main` protegida: `106dfe0d796babebe40ebc36e5a84d4a80b9a858`
- W44 reconhecida como fechada; não foi reaberta.
- Regression-first W45 preexistente e preservado: `3bb4b71316725da0f9d81ef41e86f8ecdb68c3d3`.

## 2. Regression-first W45 — não reexecutado

Contrato: `src/curriculum/razaoProporcaoW45.test.ts`.

Recibos do SHA `3bb4b71316725da0f9d81ef41e86f8ecdb68c3d3`:

- Certificação transversal `32063475999` — `completed/success`, 9/9 sondas verdes;
- CI `32063476029` — `completed/failure` nominal;
- único vermelho: `src/curriculum/razaoProporcaoW45.test.ts` em `JOURNEY_FICHAS.find(item => item.id === "N6.04")` retornando `undefined`;
- demais gates, TypeScript, Sensei, higiene e binários verdes.

Conclusão: o vermelho provava exclusivamente que N6.04/F88 ainda não havia sido materializada.

## 3. Materialização inativa F88

Primeiro SHA técnico publicado:

`27c3f8409213c10bfe2baf588e3498b08ff3d5df` — `feat: materializar W45 N6.04 F88 inativa`.

Escopo técnico:

- ficha Journey `N6.04`;
- contrato/builder especializado F88;
- kind `razao-proporcao-f88`;
- `RazaoProporcaoStage`;
- extensão aditiva de `SingaporeBars` por `SingaporeLinkedScaleBars` — **sem primitiva paralela**;
- renderer/wiring;
- Radar/misconceptions;
- answer policy;
- runtime map;
- testes físicos/nominais.

A realização física impõe uma única relação de escala: o mesmo fator deriva simultaneamente as duas barras e não existe controle independente por lado. O par escalado não é pré-renderizado antes da decisão.

Esse SHA encontrou uma falha real P13 nos Testes: a evidência `escala-nao-inteira-f88` era emitida no palco, mas ainda não pertencia ao catálogo central de evidências nem a um emissor puro auditável. Não foi promovido.

## 4. Reparo P13 e portão inativo vinculante

SHA final inativo:

`fd93358b42d3b8cb791a4048c11f7b5a5479f4e5` — `fix: integrar evidência canônica F88`.

O reparo foi aditivo:

- adicionou `Evidencia.ESCALA_NAO_INTEIRA_F88` ao catálogo central;
- criou emissor puro `razaoProporcaoEvidence.ts`;
- fez o palco consumir o mesmo emissor auditado;
- integrou F88 ao gate P13, inclusive provando que resposta errada não emite evidência de domínio.

Recibos vinculantes do **mesmo SHA**:

- CI `32074518557` — `completed/success`;
- Certificação transversal `32074518604` — `completed/success`, 9/9;
- catálogo, fichas, conformidade, DAG, TypeScript, suíte, build, Sensei, higiene e binários verdes.

Nesse SHA N6.04 continuava inativa: sem canário, sem ledger W45, sem antecipação de baseline.

## 5. Promoção atômica W45

SHA final:

`b6f9ecc24f5d1d08dc25df35b737fcbd71a5123b` — `feat: promover W45 N6.04 F88`.

Parent exato: `fd93358b42d3b8cb791a4048c11f7b5a5479f4e5`.

O compare remoto provou **um commit e exatamente três arquivos**:

1. `src/curriculum/motores/composerCanaryIds.ts` — ativa `N6.04`;
2. `AI_Studio_Lab/tools/coverage_matrix_core.ts` — adiciona somente `W45-N6.04`, preservando todo o ledger anterior;
3. `src/curriculum/coverageMatrix.test.ts` — reconcilia sequência, última migração e baseline derivado.

Nenhuma materialização técnica ou documentação foi misturada à promoção.

## 6. Matrix REAL pós-W45

A Coverage Matrix executável observou no Gates do SHA de promoção:

- **70 Composer**
- **15 legado**
- **5 fallback**
- **85 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ausente: `Moedas`

O delta real coincidiu com o teórico, mas não foi forçado: a Matrix executável foi a autoridade.

## 7. Certificação final W45

Recibos do **mesmo SHA final** `b6f9ecc24f5d1d08dc25df35b737fcbd71a5123b`:

- CI `32075578757` — `completed/success`;
- Certificação transversal `32075578696` — `completed/success`, 9/9.

No CI:

- Gates/Matrix verdes;
- Sonda real Sensei verde, incluindo prescritas + F19/F61/F29/F36/F13/F15/F14/F30/F97;
- build verde;
- higiene verde;
- binários verdes.

**W45 está FECHADA. Não reabrir N6.04/F88 sem causa nova observável.**

## 8. Contrato pedagógico F88 preservado

- prereqs `N6.03 + N4.06`;
- primitiva `SingaporeBars`;
- níveis: dobrar → triplicar → escala geral → razão como fração → regra de três;
- relação proporcional fisicamente vinculada por um único fator;
- escala não-inteira real como evidência P13;
- misconceptions: `soma-em-vez-de-escalar`, `escala-um-lado`, `inverte-razao`;
- mastery `3/3` em 2 sessões;
- resolução ensina fator/relação causal e não reduz regra de três a multiplicação cruzada decorada;
- resposta não é revelada antes da decisão;
- correção após misconception é desqualificada de mastery independente;
- alvos de toque generosos e erro motor separado de misconception;
- RT fora da autoridade conceitual.

## 9. Recalculo pós-W45 e seleção W46

Fallbacks reais pós-W45:

`AL.08, GM.11, N5.05, N6.02, PE.04`.

Todos têm prereqs servidos:

- `AL.08` ← `AL.07 + N7.02`;
- `N6.02` ← `N6.01 + N3.11 + N3.12`;
- `GM.11` ← `GM.09 + N4.02`;
- `PE.04` ← `PE.03 + N6.03`;
- `N5.05` ← `N5.04 + N6.04`.

Critério vivo: prereqs servidos → maior ganho imediato de desbloqueio → menor `causalWave` → maior downstream → ID / menor delta estrutural.

Nenhum dos cinco destrava outro fallback restante imediatamente. `AL.08` e `N6.02` empatam na menor onda causal observada; ambos são terminais no DAG relevante. O desempate residual favorece `AL.08`, e F90 ainda reutiliza a primitiva existente `Balanca`/linguagem visual de F46.

**W46 = `AL.08 / F90 — Equações`.**

## 10. Contrato canônico F90 para o próximo regression-first

Fonte autoral: `AI_Studio_Lab/pedagogia/fichas/FICHAS_F4_COMPLETAS.md`.

- primitiva: `Balanca`;
- prereqs: `AL.07 + N7.02`;
- fundamento: equação é equilíbrio; toda operação aplicada a um lado deve ser aplicada ao outro;
- níveis:
  1. `x + 3 = 8` — remover igualmente dos dois lados;
  2. `x - 2 = 5` — operação inversa;
  3. `2x = 10` — dividir ambos os lados;
  4. `2x + 1 = 9` — dois passos;
  5. `x + 5 = 2x + 1` — incógnita nos dois lados;
- misconceptions canônicas: `QUEBRA_EQUILIBRIO`, `OPERACAO_INVERSA_ERRADA`, `NAO_APLICA_AOS_DOIS`, `RESPONDE_O_TODO`;
- domínio: `{ acertos: 4, de: 4, sessoes: 3 }`, incluindo ao menos um caso de L3 ou acima;
- resolução: identificar a operação envolvendo x → escolher a inversa → aplicar aos dois lados → isolar x → concluir a aritmética;
- linguagem visual herdada de F46; sem necessidade de nova primitiva;
- acessibilidade: ações por toque com alvos amplos; arrasto não obrigatório.

## 11. Próxima cadência

O próximo commit deve fechar documentalmente W45 e abrir o regression-first W46 sem materializar F90. O vermelho nominal esperado será somente `JOURNEY_FICHAS.find(item => item.id === "AL.08")` retornando `undefined`.

Depois de classificar esse regression-first:

1. não relaxar o teste;
2. materializar AL.08/F90 completa e inativa;
3. manter AL.08 fora do canário e W46 fora do ledger enquanto inativa;
4. exigir CI + transversal verdes no mesmo SHA inativo;
5. só então promover atomicamente canário + ledger + contrato Matrix;
6. recertificar e recalcular W47 pelo estado real.
