# Auditoria longitudinal dos motores adaptativos

**Data:** 8/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Estado de entrada:** P21 + P22 concluídas; 94 fichas; cobertura autoral 90/90; CI limpo P22 `31288136803`.

## 1. Regra desta fase

Não corrigir algoritmo por intuição. Cada afirmação precisa atravessar:

`emissor → mutação de estado → persistência → consumidor → efeito pedagógico`.

Classificação dos achados:

- **PROVADO OK** — caminho completo encontrado e coerente;
- **BUG PROVADO** — produtor e consumidor divergem de forma observável;
- **HIPÓTESE** — suspeita ainda sem cadeia completa;
- **DÍVIDA DECLARADA** — comportamento consciente ainda não implementado.

## 2. Máquina longitudinal atual

### 2.1 Resposta no GameLoop

`GameLoop.record()`:

1. avalia `Question.evaluate`/gabarito;
2. extrai misconception por `misconceptionForAnswer`;
3. chama `trackMisconception` no `Progress` corrente;
4. em questões `review`, chama `evaluateSpacedRepetition`;
5. chama `applyJourneyAnswer`, que também atualiza evidência/mastery;
6. atualiza `lastDay`, banco de erros, RT e telemetria;
7. chama `onCommit(progress)`.

### 2.2 Mastery/progressão

`progressEngine.applyJourneyAnswer` mantém:

- `lvl` 1..5;
- `maxLvl` monotônico;
- streak/bad para avanço/recuo;
- janela de mastery no L5;
- duas sessões maduras para `dom`;
- evidência autoral adicional quando declarada;
- `fluencyStreak` como telemetria, não gate de coroa.

**PROVADO OK:** tempo de resposta não governa domínio conceitual.

### 2.3 Persistência

`App.commitProg(kidId, trackId, p, ...)` escreve:

`state.progress[kidId][trackId] = p`

Depois `persist()`:

- carimba `updatedAt`;
- atualiza React state;
- grava estado local por Firebase UID;
- agenda sync para nuvem;
- força flush no fim de missão.

### 2.4 Radar e resgate

`trackMisconception` armazena janela de até 15 eventos por nó.

`getRescueItems` considera padrão ativo quando a mesma tag aparece pelo menos 2 vezes dentro dos 5 erros recentes e ≤10 min.

`rescuePlanner.prescribeMisconceptionRescue` recebe o **nó-fonte** e usa o DAG para escolher:

- o próprio nó, se prereqs estão maduros;
- o prereq mais fraco, se houver lacuna estrutural;
- nível exigido 3;
- budget 3, ou 2 em sonda escalada.

### 2.5 Revisão espaçada

`evaluateSpacedRepetition` altera exclusivamente:

- `reviewForce` 1..5;
- `lastDay`.

`getDueReviews` calcula vencimento com 1/2/4/9/21 dias.

`planAula` CONSOME `getDueReviews` e injeta o vencido como `spaced-review`, excluindo aquecimento/fronteira e priorizando o `lastDay` mais antigo.

**PROVADO OK:** Leitner não está órfão; revisão vencida entra no compositor diário.

### 2.6 Unlock

`computeUnlockStatus` deriva `locked/frontier/unlocked` do DAG.

Contrato vigente, travado por teste:

- nó raiz = frontier;
- prereq conta como suficiente a partir de `maxLvl >= 3`;
- `dom` também satisfaz;
- `maxLvl` não regride quando `lvl` recua.

Isto é política atual explícita, não bug descoberto nesta auditoria.

## 3. Hipótese refutada — “mapa multi-nó é truncado no App”

A suspeita inicial era que `GameLoop` mutava um `pMap` com vários nós e `App.commitProg` gravava apenas um.

**REFUTADA.**

No caminho normal de uma trilha:

- `GameLoop` possui um único `Progress` local;
- para o Leitner cria `{ [track.id]: p }` apenas para satisfazer a API;
- `evaluateSpacedRepetition` muta o MESMO objeto `p`;
- `onCommit(p)` entrega esse objeto;
- `commitProg(..., track.id, p)` persiste justamente esse nó.

Portanto `reviewForce` e `lastDay` sobrevivem no caminho de trilha simples.

## 4. BUG PROVADO #1 — roteamento paralelo de misconceptions no Radar

### Estado encontrado

O Radar possuía uma tabela histórica `TAG_TO_NODE`:

- `LENTO_DEDOS → N1.03`;
- `OFF_BY_ONE → N1.02`;
- `ERRO_POSICIONAL → N2.01`.

Problemas comprovados:

1. a tag canônica `MisconceptionTag.OFF_BY_ONE` vale **`"off-by-one"`**, então a chave uppercase nunca casava;
2. `LENTO_DEDOS` é emitida pelo `GameLoop` para qualquer `rapid-fire` ou track `dojo*` lento, portanto forçar toda lentidão para N1.03 sequestrava contexto de adição/subtração/multiplicação/divisão;
3. `ERRO_POSICIONAL` não possui emissor canônico encontrado no runtime atual;
4. `rescuePlanner` já possui a autoridade correta para descer pelo DAG a partir do nó onde o erro ocorreu.

### Correção

Removido o roteamento paralelo tag→nó.

`getRescueItems` agora devolve sempre o **nó em que o padrão foi observado**. O `rescuePlanner` decide remediação estrutural pelo grafo.

Regressão permanente: `src/curriculum/motores/radarRouting.test.ts`.

Gate: `31288516415` = **success**.

## 5. BUG PROVADO #2 — “Minha Aula” grava progresso na trilha sintética `aula`

### Cadeia de prova

`App.aulaTrack` usa:

```ts
return buildAulaTrack(base, progOf, kid.grade).track;
```

`buildAulaTrack` compõe perguntas de várias `Track`s e devolve:

```ts
track: {
  id: "aula",
  name: "Minha Aula",
  gen: () => qs[i++ % qs.length],
}
```

As `Question`s produzidas por `composeAula` não carregam hoje `sourceTrackId`/`sourceGraphId`.

Na tela:

```tsx
<GameLoop
  track={active}
  prog0={getProg(kid.id, active.id)}
  onCommit={(p, ...) => commitProg(kid.id, active.id, p, ...)}
/>
```

Quando `active` é a trilha composta:

- `active.id === "aula"`;
- `prog0` vem de `progress[kid]["aula"]`;
- o `GameLoop` mantém UM `Progress` local para a missão inteira;
- cada resposta, mesmo se a questão visualmente veio de N1.04/N3.09/GM.02/etc., passa por `applyJourneyAnswer` nesse progresso sintético;
- `commitProg` persiste em `progress[kid]["aula"]`.

### Impacto

A Academia pode escolher corretamente aquecimento, fronteira, resgate, fluência e revisão, mas as respostas não necessariamente atualizam:

- mastery do nó que gerou a questão;
- `reviewForce/lastDay` desse nó;
- misconception/banco desse nó;
- nível/maxLvl do nó;
- evidência da ficha do nó;
- unlock dependente desse progresso.

Isto quebra o coração da adaptação longitudinal: **seleção e aprendizagem usam fontes diferentes de verdade.**

### Correção necessária — não publicar meia solução

O lote deve garantir, por questão composta:

1. identidade explícita do `sourceTrackId`/`sourceGraphId`;
2. carregar o `Progress` do nó-fonte antes de avaliar a resposta;
3. aplicar mastery/Radar/Leitner nesse `Progress`;
4. persistir pelo `sourceTrackId`;
5. manter contadores/UX da missão `aula` separados do progresso curricular;
6. banco de erro precisa preservar a identidade de origem;
7. warmup/resgate/fluência devem manter nível pedagógico escolhido sem contaminar `lvl` de outro nó;
8. testes precisam provar duas questões consecutivas de fontes diferentes atualizando apenas seus respectivos nós;
9. nenhum `progress[kid]["aula"]` curricular deve ser criado.

**Estado:** BUG PROVADO, correção estrutural é a próxima tarefa bloqueante.

## 6. Ponto de atenção — tag `LENTO_DEDOS`

O roteamento incorreto foi removido, mas a emissão ainda usa string literal `"LENTO_DEDOS"` fora do catálogo `MisconceptionTag`.

Isto viola a regra arquitetural “gerador/componente não inventa tag solta”. Deve ser saneado em lote próprio ou junto da correção da Academia, com compatibilidade para saves históricos se a string canônica mudar.

**Estado:** dívida provada, ainda não corrigida neste lote.

## 7. Próximas verificações depois da Academia

1. `rescueAttempts`: onde incrementa, quando escala e se persiste;
2. banco de erros em missão composta e identidade de origem;
3. prática regular vs `reviewForce` — política de promoção da força;
4. `lastDay` e timezone/local-day no Leitner;
5. reconciliação local/cloud preservando novos campos de progresso;
6. Jardim → mãe: somente misconception deve atravessar, nunca mastery;
7. recomendação diária após múltiplas sessões e dias;
8. simulação longitudinal de criança sintética cobrindo avanço, erro, revisão, esquecimento e resgate.

## 8. Estado desta auditoria

- P22: fechado e limpo;
- Radar tag→nó: corrigido e verde;
- Leitner→plano diário: provado ligado;
- persistência de trilha simples: provada coerente;
- multi-nó truncado no caminho simples: hipótese refutada;
- **Academia composta → progresso-fonte: bug estrutural confirmado e bloqueante.**

> Próximo lote: corrigir a identidade/progresso por questão da `Minha Aula` antes de qualquer ajuste fino de recomendação.