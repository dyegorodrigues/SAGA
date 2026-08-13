# Checkpoint — W12 N4.01 / F97 — FECHADA

**Data:** 13/08/2026 (America/Sao_Paulo)  
**Repo:** `dyegorodrigues/SAGA`  
**PR:** #35 — manter `open + draft + unmerged`  
**Branch:** `codex/fechamento-curricular`  
**Regra:** GitHub remoto + gates executáveis do mesmo SHA vencem memória e texto histórico.

## 1. Recibo da W12

A W12 começou regression-first no HEAD de referência `281ce120aa1bdc7e0c887e5700211952df4fb671`. O vermelho desse estado era deliberado: os dois testes W12 exigiam que `N4.01` fosse registrada no Composer e a competência ainda era servida por `gN4_01`.

A ficha canônica F97 foi conferida antes da implementação. O contrato executável estava correto e não foi relaxado:

- competência `N4.01`;
- pré-requisitos `N3.03 + AL.03`;
- primitiva `Grupo`;
- leitura verbal `N grupos de M`;
- escada `3×3 → 5×3 → 5×5 (ponte) → 10×5 → 10×10`;
- `total = grupos × porGrupo`;
- domínio `3/3 em 2 sessões`;
- `resolucao()` declarativa tipada sob R0-A.

A implementação registrada e **INATIVA** fechou no SHA `3c80162716c40117e1faf5583fb33fe7ec23013b`. O CI #1256 / run `31701736784` terminou **6/6 SUCCESS no mesmo SHA**, incluindo F97 em Chrome real e o portão transversal `390 px × 8 sementes`.

Só então `N4.01` foi promovida em `0452b2ed16c67ac32cc30e25ee59bfec46356264`.

## 2. Matrix observada após promoção

A promoção produziu exatamente o delta esperado:

`37 Composer / 15 legado / 38 fallback / 52 servidas / 11 divergências / 12 swaps / 44 estreias`.

O Gates pós-promoção ficou vermelho apenas porque o ledger ainda esperava `36/16/38/52/12`; esse vermelho foi o portão intencional de reconciliação da Matrix, não um defeito ocultado.

Ledger W12:

`W12-N4.01 = { composer:+1, legacy:-1, fallback:0, served:0, divergences:-1 }`.

O snapshot histórico P21.1 permanece imutável.

## 3. Por que a W12 legado→Composer continuou no caminho crítico

Apesar do novo critério fallback-first, `N4.01` foi mantida porque seu desbloqueio tem impacto real no vazio curricular. No estado pós-promoção há **23 descendentes de N4.01 que ainda estão em fallback**, calculadas do DAG contra a Matrix viva. Portanto a W12 não foi uma migração estética de legado: ela removeu um pré-requisito estrutural da cadeia que alimenta multiplicação, divisão, frações e dependentes posteriores.

A partir da W13 a regra muda definitivamente: **fallback primeiro**. Legado só passa à frente se bloquear fallback ou se não existir fallback elegível.

## 4. As 38 competências em fallback, ordenadas por quantas outras fallbacks destravam no DAG

Contagem abaixo considera somente descendentes que também estão em fallback no estado pós-W12:

1. `N5.01` — 12
2. `N5.02` — 11
3. `N6.01` — 7
4. `N5.03` — 5
5. `N4.10` — 4
6. `AL.05` — 3
7. `GE.03` — 3
8. `GM.07` — 3
9. `N6.03` — 3
10. `AL.04` — 2
11. `AL.06` — 2
12. `GE.06` — 2
13. `GM.08` — 2
14. `N7.01` — 2
15. `PE.02` — 2
16. `AL.07` — 1
17. `GE.04` — 1
18. `GE.05` — 1
19. `GM.09` — 1
20. `N2.06` — 1
21. `N5.04` — 1
22. `N6.04` — 1
23. `N7.02` — 1
24. `PE.03` — 1
25. `AL.08` — 0
26. `GE.07` — 0
27. `GE.08` — 0
28. `GE.09` — 0
29. `GE.10` — 0
30. `GM.06` — 0
31. `GM.10` — 0
32. `GM.11` — 0
33. `N2.07` — 0
34. `N4.11` — 0
35. `N4.12` — 0
36. `N5.05` — 0
37. `N6.02` — 0
38. `PE.04` — 0

## 5. Fallbacks bloqueadas hoje por alguma das 15 legado

Bloqueio direto por prerequisito legado:

- `AL.05 ← N3.05`
- `GM.06 ← GM.04`
- `GM.07 ← N3.11`
- `GM.08 ← N4.02`
- `GM.10 ← N2.04`
- `GM.11 ← N4.02`
- `N2.07 ← N4.02`
- `N4.10 ← N4.05 + N3.12`
- `N4.12 ← N2.04`
- `N5.01 ← N4.05`
- `N5.02 ← N4.05`
- `N6.01 ← N2.04`
- `N6.02 ← N3.11 + N3.12`
- `N7.01 ← N3.04`
- `N7.02 ← N3.13`
- `PE.02 ← PE.01`

As fallbacks imediatamente elegíveis após W12, por impacto entre fallbacks, são:

`GE.03 (3)`, `AL.04 (2)`, `GE.04 (1)`, `GE.05 (1)`, `N2.06 (1)`.

Logo **W13 = GE.03**.

## 6. Ordem operacional que drena fallback respeitando o DAG

A sequência abaixo é **greedy e executável**, não uma alegação de ótimo global provado: enquanto existir fallback elegível, escolhe a de maior impacto restante; somente quando a cadeia exigir, migra o legado bloqueante de maior efeito.

`W13 GE.03` → `W14 AL.04` → `W15 GE.06` → `W16 GE.04` → `W17 GE.05` → `W18 N2.06` → `W19 GE.07` → `W20 GE.08` → `W21 N4.05 (legado bloqueante)` → `W22 N5.01` → `W23 N5.02` → `W24 N5.03` → `W25 N5.04` → `W26 N3.07 (legado bloqueante)` → `W27 N3.11 (legado bloqueante)` → `W28 GM.07` → `W29 N3.04 (legado bloqueante)` → `W30 N7.01` → `W31 N2.04 (legado bloqueante)` → `W32 N6.01` → `W33 N6.03` → `W34 GM.09` → `W35 N6.04` → `W36 GM.10` → `W37 N5.05` → `W38 N3.08 (legado bloqueante)` → `W39 N3.12 (legado bloqueante)` → `W40 N4.10` → `W41 N4.11` → `W42 N4.12` → `W43 N6.02` → `W44 N4.02 (legado bloqueante)` → `W45 GM.08` → `W46 GE.09` → `W47 GE.10` → `W48 GM.11` → `W49 N2.07` → `W50 N3.05 (legado bloqueante)` → `W51 AL.05` → `W52 AL.06` → `W53 AL.07` → `W54 PE.01 (legado bloqueante)` → `W55 PE.02` → `W56 PE.03` → `W57 PE.04` → `W58 N3.13 (legado bloqueante)` → `W59 N7.02` → `W60 AL.08` → `W61 GM.04 (legado bloqueante)` → `W62 GM.06`.

Depois de fallback chegar a zero, `GM.03`, `N2.05` e `N3.06` continuam como dívida legado não crítica segundo `DEFINICAO_DE_PRONTO.md`.

A fila deve ser recalculada da Matrix/DAG após cada onda; esta lista é plano derivado do estado W12, nunca autoridade contra o remoto.

## 7. Horas por onda — histórico real, não estimativa

Métrica: **tempo decorrido de relógio** entre o commit regression-first da onda e seu commit final de reconciliação/checkpoint observado no histórico Git. Não é “hora-homem”; pausas e esperas de CI entram no número. Portanto serve para medir o workflow real e não para fingir precisão de esforço ativo.

### Migrações legado → Composer

- W2 `N1.05`: `00:16:09` = **0,27 h**
- W3 `N2.01`: `07:11:21` = **7,19 h**
- W4 `N1.12`: `03:17:33` = **3,29 h**
- W6 `N2.03`: `00:39:40` = **0,66 h**
- W7 `N2.02`: `01:13:55` = **1,23 h**
- W8 `N3.01`: `07:15:21` = **7,26 h**
- W9 `N3.02`: `07:33:34` = **7,56 h**
- W10 `N3.03`: `02:46:39` = **2,78 h**
- W11 `AL.03`: `01:09:32` = **1,16 h**

**n=9; média observada = 3,49 h/onda; mediana = 2,78 h/onda.**

### Construção fallback → Composer

- W5 `GM.05`: `02:50:40` = **2,84 h**

**n=1; média/mediana observada = 2,84 h/onda.**

Conclusão metodológica: hoje existe evidência real de que uma estreia fallback foi fechada em 2,84 h, mas **n=1 não sustenta uma estimativa de prazo confiável**. A nova política vai aumentar rapidamente essa amostra; estimativa só deve ser recalculada com várias ondas fallback fechadas pelo mesmo protocolo.

## 8. Definição de pronto da fábrica

`AI_Studio_Lab/codex/DEFINICAO_DE_PRONTO.md` é a autoridade de término.

Critério aceito: legado conta como **servido**. Migração legado→Composer que não desbloqueia fallback é dívida separada e não pertence ao caminho crítico. O alvo da fábrica é cobertura curricular servida com **fallback = 0** e os gates definidos naquele documento, não “migrar todo legado”.

Player da resolução, Oficina, conta armada e mascote permanecem explicitamente fora desta definição de pronto.

## 9. Regra dura de handoff

A partir desta onda, fechamento exige três artefatos coordenados:

1. ledger reconciliado;
2. checkpoint da onda;
3. `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md` atualizado.

**Onda sem PROMPT_DE_RETOMADA atualizado não está fechada.**

O prompt é autossuficiente e deve sempre mandar reancorar no GitHub remoto antes de confiar em SHAs textuais, eliminando o problema de auto-referência do próprio commit documental.

## 10. Próxima onda

**W13 = GE.03**, primeira fallback elegível de maior impacto no estado pós-W12.

O critério histórico de sequência por blocos em `ROTEIRO_ATE_O_FIM.md` não tem precedência sobre a regra nova. A partir da W13 a seleção operacional é a Matrix/DAG viva, fallback-first.

Restrições continuam: não tocar na `main`, não fazer merge/ready/auto-merge, não tocar no Creature Engine, não ativar Thinking Engine runtime, não reabrir W7–W11 e não enfraquecer gates.
