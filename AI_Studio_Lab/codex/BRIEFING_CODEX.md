# Briefing operacional — continue daqui

> **VIGENTE em 8/ago/2026.**
>
> Este arquivo existe para uma nova IA retomar o trabalho sem depender da conversa.
> Antes dele havia instruções históricas que mandavam abrir branch nova da `main`
> e colocavam a F50 em um nó curricular incorreto. Elas foram superadas.
>
> Fonte operacional primária: [`HANDOFF_CONTINUIDADE_IA.md`](./HANDOFF_CONTINUIDADE_IA.md).
> Fonte de método/armadilhas: [`RETOMADA.md`](./RETOMADA.md) e
> [`PADRAO_OURO.md`](./PADRAO_OURO.md).

---

## 0. Contexto que não pode ser redescoberto

Repositório: `dyegorodrigues/SAGA`.

### Regra de ouro desta linha

- **não alterar nem mesclar `main`**;
- trabalhar em **`codex/integrar-bloco-f0`**;
- PR #29 é somente janela de comparação/CI, permanece **draft** e sem auto-merge;
- não abrir branches auxiliares para tarefas normais deste bloco;
- commits devem ser pequenos, reversíveis e explicar a razão;
- implementação e promoção continuam logicamente separadas, mesmo quando os
  candidatos são ensaiados nesta branch de integração.

### Branches remotas

| branch | estado | ação |
|---|---|---|
| `main` | base protegida desta linha | **não tocar** |
| `codex/integrar-bloco-f0` | linha cumulativa vigente | **continuar aqui** |
| `codex/ativar-al01` | ref removido em 8/ago | histórico preservado por commits/PR |
| `codex/corrigir-n113` | ref removido em 8/ago | histórico preservado por commits/PR |
| `codex/corrigir-n106` | ref removido em 8/ago | F05 preservada pela reconciliação PR #32 |
| `codex/reconciliar-f05-f04` | ref removido em 8/ago | PR #32 permanece como registro da reconciliação |
| `agent/creature-engine-tamagotchi` | trabalho independente não presente na main | **não apagar / não tocar neste fluxo** |
| `codex/criar-branch-para-creature-engine-tamagotchi` | trabalho independente PMD | **não apagar / não tocar neste fluxo** |

Os PRs auxiliares #26–#28 e #30–#33 já estão fechados; #30 e #32 foram usados
apenas para absorção/reconciliação na cumulativa. **A única PR aberta deste fluxo
é a #29.**

---

## 1. Primeiro ritual de qualquer nova sessão

1. Leia inteiro `HANDOFF_CONTINUIDADE_IA.md`.
2. Confira o remoto; nunca escolha branch apenas pelo nome.
3. Confirme que `main` ainda é ancestral da cumulativa e que a cumulativa não
   está atrás.
4. Leia os commits posteriores ao head citado no handoff antes de editar.
5. Rode os portões do estado atual antes do primeiro lote de código.

Portões mínimos:

```bash
npm run auditar
npm run fichas:auditar
npm run fichas:conferir
npm run grafo:check
npx tsc --noEmit
npm test -- --run
npm run build
npm run pr:check
```

Para tela afetada:

```bash
npm run sonda -- "<ID>"
node scripts/prints.mjs "<ID>"
```

A sonda e `prints.mjs` devem usar o Chromium compatível informado pelo
`playwright-core`; **não reintroduzir caminho `/opt/.../chromium-1194` fixo**.

---

## 2. Estado já fechado — não refazer

### AL.01 / F51

Correção autoral absorvida na cumulativa. Classificação real, reclassificação,
`fica fora`, Mão Fantasma, reset e diagnóstico. Continua fora da produção nesta
linha até promoção deliberada.

### N1.06 / F05

Fluxo áudio→símbolo reconciliado semanticamente com F04/AL. Autoplay temporal,
retry/feedback autoral, evidência e diagnóstico. O checkpoint antigo diverge na
genealogia porque foi reconciliado por squash; isso **não significa trabalho
perdido**.

### N1.13 / F04

Produzir quantidade com drag/toque, ghost, retry e diagnóstico longitudinal.
Absorvido na cumulativa.

### GE.01 / F47

Posição espacial corrigida e validada.

### GE.02 / F48

Formas planas corrigidas; sólidos permanecem em GE.04.

### GM.01 / F49

Comparação direta de grandezas corrigida e validada.

### GM.12 / F50

**Implementada e não promovida.**

Matriz curricular vigente:

`GM.01 comparação direta visível` → **`GM.12 massa e capacidade: comparação e conservação`** → `GM.05 medidas padronizadas`

Não voltar à decisão histórica F50→GM.02 ou F50→GM.05. A P15 foi retificada:
`GM.02` é tempo cotidiano e `GM.05` é a etapa posterior de unidades padronizadas.

A F50 já possui procedimento, contrato, `Recipientes`, `MedidasStage`, integração
Composer/renderer/Radar/evidência e cinco níveis. `Recipientes` deixou de ser
dívida de runtime; `PRIMITIVAS_PENDENTES` ficou em `Moedas` e `Regua`.

---

## 3. Plano executivo atual

### Fase A — higiene e observabilidade

1. Manter somente a PR #29 aberta neste fluxo.
2. Não criar novas branches auxiliares para tarefas ordinárias.
3. Os quatro refs históricos deste fluxo **já foram removidos**. Não recriá-los.
   As duas branches do Creature Engine ficam preservadas.
4. Todo lote relevante atualiza `HANDOFF_CONTINUIDADE_IA.md` antes de terminar.
5. Bancadas de GitHub Actions devem ser **descartáveis**: criar → executar →
   publicar artefato/resultado → apagar o próprio workflow.

### Fase B — fechar QA humano da F50

1. Capturar GM.12 nos níveis 1–5 em 320, 390 e 900 px.
2. Abrir e olhar os prints; sonda verde não substitui julgamento visual.
3. Juntar todos os defeitos antes de corrigir.
4. Se houver correção: manter GM.12 fora dos canários, rodar sonda filtrada e
   depois portão completo.
5. Registrar no handoff a inspeção realmente feita — não declarar print visto
   quando só houve teste automático.

### Fase C — pagar dívida sistêmica P18 sem chegar à criança

O portão `kindComBuilder.test.ts` registra kinds que o schema promete e o
Composer ainda não entrega. Não implementar os nove às cegas.

Ordem de auditoria:

1. **aliases/legado que já têm runtime aproveitável** — verificar se o correto é
   conectar, normalizar ou retirar do `KindType`;
2. **`sentencebuilder`** — componente existe, mas está órfão; primeiro descobrir
   qual ficha realmente precisa dele e qual contrato pedagógico deve alimentá-lo;
3. **`singaporebars`** — confrontar com o caminho vivo `singapore-bars` para não
   criar dois nomes para a mesma semântica;
4. `linking-cubes`, `take-apart`, `visual-addition` — embrulhar legado somente se
   uma ficha autoral real os exigir;
5. `multiple_choice`, `sequence`, `subvis` — candidatos a remoção do tipo se forem
   apenas resíduos legados e nenhuma ficha canônica os nomear;
6. `missing-addend-frame` — construir apenas a partir da ficha que o especifica;
   hoje é dívida de primitiva, não só builder.

Cada decisão deve reduzir a diferença entre **o que o tipo promete** e **o que o
runtime realmente consegue servir**, sem aumentar APIs duplicadas.

### Fase D — candidatos de promoção, um por vez

Só após QA visual correspondente. Ordem inicial sugerida pelo risco/dependência:

1. `AL.01`
2. `N1.06`
3. `N1.13`
4. `GE.01`
5. `GE.02`
6. `GM.01`
7. `GM.12` somente depois do QA visual F50 e intervalo de observação
8. `N1.10` e `N1.11` continuam por último entre os F0 recém-escritos

Para cada candidato:

- print antes;
- confirmar fallback/rollback atual;
- um commit de promoção claramente reversível;
- portões completos;
- nunca misturar promoção com correção estrutural da mesma tela.

A branch cumulativa pode ensaiar o estado integrado, mas nenhuma promoção deve
chegar à `main` por acidente; a PR #29 continua sem merge.

### Fase E — arquitetura maior

Somente depois do bloco acima estabilizado:

- **P8** — motor do Jardim do Dojo e consumo real das trilhas JD1–JD5;
- primitives `Moedas` e `Regua` quando suas fichas forem o próximo gargalo;
- próximas competências/andares conforme `PLANO_DO_BLOCO_F0.md` e Plano Mestre.

P8 é importante, mas atravessa a jornada inteira; não deve ser usado como fuga
para deixar dívidas menores e observáveis abertas.

---

## 4. Regras de implementação

1. **Existir não é estar certo.** Código herdado entra como suspeito.
2. **Honrar a ficha é honrar as nove seções**, não só os cinco níveis.
3. Divergir é permitido; divergência silenciosa não.
4. Uma tela não introduz mais de uma novidade por vez: conteúdo novo usa
   linguagem visual já aprendida; desenho novo usa conteúdo dominado.
5. Palco que coleta resposta é dono da resposta; não duplicar alternativas no
   GameLoop.
6. Resposta errada não coroa evidência.
7. Corrigir código para passar teste; mudar teste somente quando o teste é a
   própria especificação e a especificação mudou conscientemente.
8. Nenhum binário entra no diff textual desta linha.
9. Junte defeitos e rode o portão completo uma vez no fim do lote.
10. Não usar `main` como área de trabalho nem destino automático.

---

## 5. Definição de pronto de qualquer lote

- [ ] mudança está em `codex/integrar-bloco-f0`;
- [ ] nenhum ref do Creature Engine foi tocado;
- [ ] `main` não moveu;
- [ ] testes/TypeScript/auditorias/grafo/build verdes;
- [ ] sonda/prints quando houver tela afetada;
- [ ] nenhum workflow temporário ficou órfão;
- [ ] PR #29 continua draft e sem merge;
- [ ] `HANDOFF_CONTINUIDADE_IA.md` registra o novo head e próximo passo;
- [ ] a próxima sessão consegue descobrir o estado sem ler esta conversa.

**Existir não é estar certo. Divergência pode ser corrigida; divergência silenciosa não.**
