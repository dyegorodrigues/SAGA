# Auditoria — Motor de Resolução / Tutor que Desenha

**Data:** 12/08/2026  
**Branch auditada:** `codex/fechamento-curricular`  
**HEAD de produto auditado:** `4dec3ad576d8ae57490f535b58bd9103282758d9`  
**Contexto:** checkpoint pós-W9; W9 fechada antes de qualquer implementação deste motor.  
**Documentos de entrada:** `MOTOR_DE_RESOLUCAO.md`, `MOTOR_DE_RESOLUCAO_PARTE_2_DESIGN.md`, `MENSAGEM_PARA_O_CODEX.md`.

> Este documento responde primeiro VERIFICAÇÃO, CONTESTAÇÃO e O QUE FALTA. O Motor de Resolução **não foi implementado** antes destas respostas. A decisão de Fase A aparece somente depois delas.

## Resumo executivo

A tese central dos documentos está correta: o SAGA já possui boa parte do encanamento — tutorial em passos, voz, `tutShow`, diagnóstico de misconception, escada de erro e vários palcos autorais — e o valor novo deve nascer como **dados de resolução calculados do item**, não como um segundo motor de animação.

Mas o ref usado pelo Claude (`origin/codex/integrar-bloco-f0`) envelheceu em pontos importantes. A conta armada ativa já passou por uma migração que os documentos não enxergaram: o `GameLoopExerciseRenderer` usa `VerticalPlaceValueStage`, e `VerticalAlgorithm.tsx` ficou como arquivo legado sem import ativo encontrado. O problema vertical real hoje não é “trocar dois renderizadores ativos”; é reconciliar a exclusão da UI de tutorial, tipar o estado visual de resolução e harmonizar o player com o palco atual.

A decisão de ordem também muda: não reabrir Material Dourado/Decomposição só para provar o contrato. O ponto barato é **R0-A imediatamente antes da W10**, e a W10/N3.03/F14 vira a primeira adoção de `resolucao()` desde o nascimento.

---

# 1 · VERIFICAÇÃO contra o HEAD atual

## 1.1 `kind === "vertical"` continua excluído da UI genérica de tutorial — CONFERE, com nuance

No HEAD auditado, `GameLoopExerciseRenderer.tsx` ainda condiciona a faixa/botão genérico a:

```tsx
hasTutorial(q) && q.kind !== "vertical" && q.kind !== "audiochoice"
```

Logo, a exclusão visual citada pela Parte II continua real.

A nuance importante é que `GameLoop.tsx` não exclui `vertical` da orquestração do tutorial do mesmo jeito. `playAulinha()` especializa `q.kind === "sum"`; `vertical` cai no `startGuidedTutorial()`, que chama `setTutShow`, `speak()` e autoavança no `onEnd`. Existe, portanto, um estado inconsistente mais sutil: **vertical pode entrar na orquestração genérica enquanto a UI genérica correspondente é ocultada no Renderer**.

Isso precisa ser resolvido quando o player de resolução entrar; não é motivo para contaminar a Fase A de dados.

## 1.2 “Dois renderizadores de conta armada convivem” — DESATUALIZADO como descrição de produção

Os dois arquivos existem:

- `src/components/VerticalAlgorithm.tsx` — legado;
- `src/components/primitives/VerticalPlaceValueStage.tsx` — palco atual.

Porém o Renderer atual entrega `q.kind === "vertical"` via `VerticalPlaceValueStage`. Busca por import de `./VerticalAlgorithm` não encontrou caminho ativo de produção no HEAD auditado.

Portanto:

- **não** há evidência de dois renderizadores ativos concorrendo hoje no GameLoop;
- há um palco ativo (`VerticalPlaceValueStage`) e um arquivo legado provavelmente órfão;
- a futura fase vertical deve confirmar ausência de import dinâmico/indireto e então remover o órfão no próprio escopo, não em faxina oportunista.

Também há outra correção: `PromocaoDeOrdem.tsx` existe, mas não está hoje conectado ao caminho ativo da conta armada. `InteractiveVertical.tsx` mantém `carry/borrow` internamente e desenha o `+1/-1` por conta própria. Reuso de `PromocaoDeOrdem` é possibilidade, não fato arquitetural já integrado.

## 1.3 Tutoriais continuam estáticos/copiados da ficha — CONFERE na arquitetura auditada, mas deve virar gate em vez de slogan universal

O padrão continua presente no Composer genérico e nos specialized builders auditados: `tutorial: normalizeFichaTutorial(micro.params.tutorial)`.

A própria W9/F15 faz isso em `emojiRowRiscarContract.ts`.

Conclusão segura: a premissa que sustenta o Motor de Resolução continua válida — o tutorial é onboarding/explicação do tipo de tela, não solução calculada do item atual.

A formulação “todos os contratos, sem exceção” não deve continuar como afirmação manual eterna. R0-A deve transformar essa fronteira em tipo/gate: `tutorial` e `resolucao` têm papéis diferentes e verificáveis.

## 1.4 O tocador genérico já existe e autoavança por fim da fala — CONFERE

`startGuidedTutorial()`:

- começa em `i = 0`;
- escreve `guidedNarr`;
- entrega `tutShow`;
- com som, chama `speak(st.say, { onEnd: ... })` e avança após o fim da fala;
- aborta avanço se a questão mudou.

Esse mecanismo deve ser **estendido por política/modo**, não duplicado.

## 1.5 Escada de erros e misconception já existem — CONFERE

No fluxo atual:

- `misconceptionForAnswer(...)` é calculado na tentativa;
- primeiro erro: retry simples;
- segundo erro: `q.explain` fixo;
- terceiro erro: erro terminal / Radar / avanço;
- `durationMs` usa tempo decorrido desde `t0`.

Portanto os documentos acertam o lugar de integração e também acertam o risco de poluir RT quando uma explicação longa entrar.

## 1.6 Ajuda não compra independência — CONFERE

`progressEngine.ts` exige acerto de mastery e `!attempt.helpUsed` para manter/ganhar `independenceStreak`. O novo tutor deve reutilizar essa semântica; não criar um segundo conceito concorrente de independência.

## 1.7 Existe dívida de tipo não observada pelos documentos

`src/utils/tutorials.ts` define `TutStep` com `sync`, mas `Question.tutorial` em `src/types.ts` repete a estrutura manualmente e omite `sync`.

Adicionar `PassoDeResolucao` diretamente em um desses dois lugares criaria um terceiro dialeto. Antes do campo novo, R0-A deve consolidar os tipos de tutorial/resolução em módulo sem dependência circular.

---

# 2 · CONTESTAÇÃO

## a) Primeira família: decomposição/material dourado ou conta armada?

**Nem uma nem outra, no estado atual.**

A Parte II acerta ao dizer que conta armada é um primeiro alvo ruim, mas a alternativa “reabrir decomposição/material dourado” conflita com a regra operacional do próprio pacote: não retroagir competências já fechadas.

A solução mais barata é separar “provar o contrato” de “reabrir uma família antiga”:

1. R0-A instala apenas tipos/utilitários/gates puros imediatamente antes da W10;
2. W10/N3.03/F14 é a **primeira família nova** obrigada a emitir `resolucao()` tipada;
3. W11 e W12 já nascem sob a mesma obrigação;
4. W7/W8/W9 permanecem fechadas e com comportamento atual até uma migração futura deliberada.

Isso elimina retrabalho sem misturar a limpeza vertical com a prova do contrato.

## b) `corrige` é necessário ou `parcial` basta?

**`corrige` deve ficar.**

`parcial` e `corrige` respondem perguntas diferentes:

- `parcial`: qual estado/resultado intermediário foi atingido;
- `corrige`: qual falha conceitual/procedural torna este passo um bom ponto de entrada.

Não é possível inferir robustamente o segundo do primeiro:

- misconceptions diferentes podem produzir o mesmo valor parcial;
- algumas famílias não têm `parcial` numérico útil;
- um passo pode corrigir mais de um equívoco;
- o mesmo parcial pode existir antes/depois de ações visualmente distintas.

`corrige` é índice semântico explícito. `parcial` é invariante de consistência e material de teste.

## c) `show: Record<string, any>` aguenta 90 competências?

**Livre como `any`, não. Um vocabulário global fechado agora, também não.**

A solução é **fechado por palco/família, extensível no sistema**:

```ts
TutStep<TShow = unknown>
PassoDeResolucao<TShow = unknown>
```

Cada procedimento/palco declara seu `XResolutionShow` concreto. Na borda heterogênea de `Question`, usar `unknown`/erasure tipada, nunca `any` como contrato semântico.

Assim:

- typo em `destacarColuna` quebra TypeScript dentro da família;
- um palco não recebe payload de outro por acidente;
- não congelamos um mega-enum desenhado a partir de um único exemplo.

Depois de 3–5 famílias, padrões realmente comuns podem subir para um vocabulário compartilhado por evidência, não por antecipação.

## d) Migrar `vertical` é tão grande quanto a Parte II diz?

**Menor do que o documento diz, mas ainda não é uma tarefa pequena o bastante para ser a Fase A.**

Já está resolvido:

- `vertical` é desenhado pelo `VerticalPlaceValueStage` no Renderer atual;
- `InteractiveVertical` já possui modelo de coluna, entrada por coluna, carry/borrow e misconception de coluna.

Ainda falta para resolução vertical:

- remover/reconciliar a exclusão visual do tutorial;
- dar ao palco um estado visual de resolução tipado (`mostrar`/equivalente);
- tornar interação do exercício realmente inerte enquanto o tutor controla a cena;
- escolher como representar transporte de carry/borrow e reduced motion;
- harmonizar a orquestração genérica com a UI vertical;
- provar ausência de duplicação de palco;
- verificar e remover `VerticalAlgorithm.tsx` órfão no escopo correto;
- decidir se `PromocaoDeOrdem` é reutilizado ou se o modelo atual de `InteractiveVertical` é a fonte.

Logo: não há uma “migração de renderizador ativo” inteira pela frente, mas existe uma integração de estado/player/a11y que merece fase própria.

## e) Toque por passo colide com avanço por fim-de-fala?

**Sim. É uma colisão real e deve ser modelada como política, não como `if` solto.**

Hoje `onEnd` da fala avança. Para resolução manual isso seria incorreto: a fala terminaria e mudaria de passo sem o toque da criança.

O player deve ter modos explícitos:

- `onboarding-auto`: mantém comportamento atual;
- `resolution-manual`: fim da fala apenas libera/indica continuação; não avança;
- avanço manual enquanto uma fala ainda toca chama o cancelador existente e invalida qualquer callback `onEnd` obsoleto;
- um token/geração de sessão, além do `qRef`, impede callback atrasado de sessão anterior;
- sound-off no modo manual não pode cair no timer auto-advance atual.

Não criar um segundo player.

---

# 3 · O QUE FALTA / modos de falha adicionais

## 3.1 A tela inteira como alvo de “próximo” pode roubar gestos do exercício

A Parte II recomenda palco+faixa inteiros como alvo. Isso é perigoso porque vários Stages contêm botões, drag, tap e manipulações semânticas.

Regra melhor:

- durante resolução, o exercício fica **realmente inerte**;
- `FaixaDoTutor` oferece um alvo grande e explícito de continuação;
- stage-wide tap só é permitido em palcos comprovadamente sem controles ativos e com propagação controlada.

Não depender só de `pointer-events` superficial.

## 3.2 `opacity + pointer-events:none` não resolve foco de teclado/a11y

Opacidade recua visualmente, mas elemento pode continuar focável por teclado/tecnologia assistiva dependendo da estrutura.

Modo Explicação precisa política real de foco/inércia:

- `disabled`/`inert` onde aplicável;
- foco inicial e foco restaurado na saída;
- foco visível e previsível;
- nunca deixar a grade “apagada” mas navegável por teclado.

## 3.3 `tutorial` já tem type drift

Antes de adicionar `resolucao`, consolidar `TutStep`. Caso contrário o projeto passa a ter três definições semelhantes e diferenças silenciosas (`sync` já é uma hoje).

## 3.4 “Rebobinar aplicando deltas 0..k-1” é mais frágil que o necessário

Melhoria recomendada: **snapshot declarativo de estado do tutor por passo**, não replay imperativo dependente da ordem temporal.

Cada `show` de resolução representa o estado tutor após aquele passo. Para começar em `k`, o player aplica uma vez o snapshot anterior e inicia a fala em `k`.

Vantagens:

- random access;
- idempotência;
- teste simples;
- reduced motion natural;
- nenhum acoplamento a “o passo anterior rodou 800 ms antes”;
- menos vazamento de estado entre sessões.

Uma família só deve usar reducer/delta se snapshots se mostrarem realmente inviáveis.

## 3.5 Segundo erro não deve aplicar `show` que revele resposta

A dica de um passo no segundo erro pode usar `corrige`, mas a implementação deve ter política explícita de **hint não revelador**. A forma mais segura inicialmente: fala do passo sem aplicar escrita/resultado do snapshot, ou um payload `hintShow` separado somente quando necessário.

## 3.6 Pausa de RT precisa contabilizar múltiplas sessões

Não basta resetar `t0`. A criança pode entrar/sair de ajuda mais de uma vez.

Manter duração acumulada de pausa por ajuda e calcular:

`durationMs = agora - t0 - pausedHelpMs`

A pausa começa quando resolução/ajuda controlada entra e fecha em toda saída, troca de questão e unmount.

## 3.7 Telemetria de resolução não é nova tentativa de resposta

Registrar, em canal próprio/AnswerMeta compatível:

- trigger: pediu ajuda / segundo erro / terceiro erro;
- `entryStepId`;
- passos vistos;
- abandonou/concluiu;
- duração de ajuda (se útil operacionalmente).

Não registrar a entrada no tutor como misconception adicional nem duplicar `recordQuestionAttempt`.

## 3.8 Há uma tensão entre “resolução só no 3º erro” e “Como faz? antes do erro”

Não é contradição se a política for explícita:

- escalada automática: 1º retry, 2º hint de um passo, 3º resolução completa;
- ajuda solicitada pela criança: `Como faz?` pode abrir método completo antes do erro, mas marca `helpUsed` e exige posteriormente evidência independente/item espelho.

A criança pedir método é comportamento válido; o sistema só não pode confundir isso com domínio independente.

## 3.9 Limite de 2–3 resoluções por sessão é hipótese de produto, não fato estabelecido

Não hardcode na Fase A. Criar policy hook/configuração somente quando o player existir e calibrar com telemetria/validação pedagógica.

## 3.10 Item espelho é direção pedagógica boa, mas pertence à política de prescrição

A resolução não deve gerar a próxima questão. O item espelho fica para fase posterior no Composer/procedimento/Sensei, mantendo D041 e soberania do learner state.

## 3.11 Reduced motion não pode apagar informação causal

Sem movimento, transporte vira estado antes/depois + marcação de origem/destino. O passo permanece, a fala permanece e o significado permanece.

## 3.12 Vertical tem um órfão provável, mas a limpeza não pertence à R0-A

`VerticalAlgorithm.tsx` deve ser removido somente depois de prova de ausência de consumidores no escopo da integração vertical. Não usar o Motor como desculpa para faxina ampla.

## 3.13 `PromocaoDeOrdem` não está conectado ao vertical atual

Reusar é opção a avaliar por coerência visual/semântica; não construir arquitetura contando com uma integração que não existe.

---

# 4 · DECISÃO — Fase A como R0-A antes da W10

## 4.1 Onde encaixa

**Imediatamente depois do checkpoint da W9 e antes da W10.**

Não esperar a W12, porque W10/W11/W12 ainda não nasceram e podem adotar o contrato sem retroação. Não interromper W9, porque ela já foi fechada antes desta costura.

R0-A é uma **prelude técnica**, não uma onda curricular de Coverage Matrix.

## 4.2 Por que não criar um delta zero no ledger da Matrix

`COVERAGE_MIGRATIONS` mede mudanças observadas de proveniência/cobertura/divergência. Um contrato de dados que não abre competência não deve ganhar migração artificial apenas para aparecer no histórico.

Registrar R0-A neste checkpoint/auditoria e em commits próprios. A Matrix deve permanecer exatamente igual antes/depois.

## 4.3 Arquitetura R0-A

### Tipos sem ciclo

Não fazer `types.ts` importar diretamente de `utils/tutorials.ts`, porque `tutorials.ts` já depende de `Question` e isso cria ciclo.

Extrair um módulo zero-dependency, por exemplo:

`src/types/tutorial.ts`

com:

```ts
export interface TutStep<TShow = unknown> {
  say: string;
  show?: TShow | string | number;
  ms?: number;
  sync?: "junto" | "depois";
}

export interface PassoDeResolucao<TShow = unknown> extends TutStep<TShow> {
  id: string;
  corrige?: MisconceptionTag[];
  parcial?: number | string;
}
```

`src/utils/tutorials.ts` passa a reutilizar/reexportar `TutStep`; `Question.tutorial` usa o mesmo tipo; `Question.resolucao` recebe `PassoDeResolucao`.

### Utilitários puros

`src/utils/resolucao.ts`:

- `pontoDeEntrada(passos, equivoco)`;
- `estadoAntesDoPasso(...)`/equivalente para snapshot anterior;
- validações puras compartilhadas.

Sem React, DOM, `speak`, timers ou estado do GameLoop.

### Portões regression-first

Antes da implementação verde:

1. `pontoDeEntrada` falha se o mapping esperado não existe/fallback mal definido;
2. uma família `resolution-aware` que gera misconception deve mapeá-la a pelo menos um `corrige` ou declarar fallback explícito;
3. último `parcial`/estado final deve ser coerente com a resposta quando aplicável;
4. snapshots precisam ser idempotentes/random-access por contrato;
5. `Question.tutorial` e `TutStep` deixam de divergir;
6. procedimento de resolução não importa React;
7. novo caminho de primitive/Stage não importa `curriculum/` para entender a resolução.

### O que R0-A NÃO faz

- não altera `GameLoop.tsx`;
- não cria `FaixaDoTutor` ainda;
- não muda a escada de erros;
- não pausa RT ainda;
- não cria item espelho;
- não toca conta armada;
- não retroage W7/W8/W9;
- não muda Matrix.

## 4.4 Primeira adoção

A primeira implementação real de `resolucao()` será requisito de aceite da **W10/N3.03/F14**, junto do procedimento novo da própria onda.

Isso mantém uma única fábrica:

`R0-A (contrato) → W10 (primeira adoção) → W11 → W12`

Não criar um registro paralelo de canário para “resoluções”. A promoção da competência continua sendo a promoção normal; o contrato de resolução é uma propriedade adicional exigida dessas ondas novas.

## 4.5 Fases seguintes

### Fase B — player/orquestração

Depois de haver dados reais em mais de uma família:

- modo `resolution-manual` no player existente;
- token de sessão/cancelamento de fala;
- entrada por `corrige`;
- snapshot inicial sem narração;
- `FaixaDoTutor` única;
- inércia/foco/a11y;
- pausa acumulada de RT;
- telemetria de ajuda.

### Fase vertical

Depois de contrato/player provados:

- reconciliar exclusão de `vertical`;
- tipar estado de resolução do `VerticalPlaceValueStage`/`InteractiveVertical`;
- decidir transporte visual/reuso de `PromocaoDeOrdem`;
- reduced motion;
- remover legado órfão se prova confirmar;
- sondas de interação/layout/a11y.

### Fase C — prescrição/Oficina

- item espelho imediato após resolução completa quando política exigir;
- limite adaptativo de ajuda;
- Oficina `eu faço → fazemos → você faz` reutilizando os mesmos dados;
- sinais de resolução para Radar/Thinking Engine futuro sem criar Composer paralelo.

---

# 5 · Fundamentação externa — o que a pesquisa sustenta e o que NÃO sustenta

A pesquisa primária consultada dá suporte direcional à arquitetura, não às constantes específicas do produto:

- What Works Clearinghouse/IES recomenda intercalar exemplos resolvidos com resolução de problemas e combinar gráficos com descrições verbais (`Organizing Instruction and Study to Improve Student Learning`).
- O guia WWC de resolução matemática tem evidência forte para monitoramento/reflexão e uso de representações visuais (`Improving Mathematical Problem Solving in Grades 4 Through 8`).
- O guia de intervenção matemática elementar recomenda instrução sistemática e linguagem matemática clara (`Assisting Students Struggling with Mathematics: Intervention in the Elementary Grades`).
- WCAG 2.2 exige alvo mínimo/spacing para reduzir ativações acidentais e prevê que animação disparada por interação possa ser desabilitada quando não essencial; isto reforça alvo grande explícito, foco previsível e reduced-motion sem perder conteúdo.

Essas fontes **não provam** especificamente:

- “2º erro = hint / 3º erro = resolução completa” como número ótimo;
- “2–3 resoluções por sessão”;
- a cor `#5B3FD9` como escolha pedagógica (ela é decisão visual/contraste do próprio SAGA);
- “tela inteira = próximo”;
- timing exato do item espelho.

Esses pontos permanecem políticas de produto a validar, não ciência que deve ser congelada no contrato.

Referências primárias:

- https://ies.ed.gov/ncee/wwc/PracticeGuide/1
- https://ies.ed.gov/ncee/wwc/PracticeGuide/16
- https://ies.ed.gov/ncee/wwc/PracticeGuide/26
- https://www.w3.org/TR/WCAG22/
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum

---

# 6 · Decisão final de arquitetura

O Motor de Resolução deve nascer como **protocolo de dados puro e tipado**, não como animação, overlay ou segundo tutor.

Ordem aprovada nesta linha:

**W9 fechada → R0-A contrato puro → W10 primeira adoção → W11 → W12 → player/vertical/prescrição em fases próprias.**

Invariantes:

- uma única definição de `TutStep`;
- `tutorial` = onboarding do kind; `resolucao` = caminho deste item;
- `corrige` = semântica diagnóstica; `parcial` = consistência;
- `show` tipado por família/palco;
- preferir snapshots declarativos e random-access;
- um player com modos, nunca dois players;
- Stage desenha; GameLoop orquestra; procedure calcula;
- ajuda não compra independência;
- resolução não gera conteúdo nem decide prescrição;
- nenhum delta de Matrix na R0-A;
- nenhuma retroação nas ondas fechadas apenas para satisfazer o novo contrato.
