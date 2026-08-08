# Handoff de continuidade — branch cumulativa SAGA

> **ATUALIZADO EM 8/AGO/2026. Este é o estado operacional vigente.**
>
> A `RETOMADA.md` continua importante como histórico técnico e pedagógico, mas
> contém seções antigas preservadas por contexto. Para decidir **branch, head,
> estado da F50 e próximo passo**, use este handoff e confirme o Git remoto.

## 1. Regra de ouro

- Repositório: `dyegorodrigues/SAGA`.
- `main` **não deve ser alterada nem mesclada** durante esta linha de trabalho.
- Base imutável observada nesta retomada: `main = 68fad4c575e28959b2ca4776e9a541d6828b63f3`.
- Branch cumulativa de continuidade: **`codex/integrar-bloco-f0`**.
- PR de comparação/CI: **#29**, aberta como **draft**, base `main`, sem merge e sem auto-merge.
- As branches do Creature Engine estão fora deste fluxo e não devem ser tocadas:
  - `agent/creature-engine-tamagotchi`
  - `codex/criar-branch-para-creature-engine-tamagotchi`

Nunca escolha a branch pelo nome que parece mais recente. Compare genealogia,
PRs e conteúdo antes de mexer.

## 2. Reconciliação das branches da Tarefa 2 — AL.01

A conversa anterior deixou várias branches auxiliares. Depois de provar a absorção
do conteúdo, os quatro refs históricos foram **apagados do remoto em 8/ago/2026**;
os PRs/commits continuam preservando a genealogia e as decisões.

- `codex/ativar-al01` — ref remoto **removido**; checkpoint preservado pelo histórico/PR.
- `codex/corrigir-n106` — ref remoto **removido** após reconciliação semântica F05/F04 (PR #32).
- `codex/corrigir-n113` — ref remoto **removido**; conteúdo já ancestral da cumulativa.
- `codex/reconciliar-f05-f04` — ref remoto **removido**; PR #32 já mesclada na cumulativa.
- `codex/integrar-bloco-f0` — **única linha atual de continuidade deste bloco**.

Não cherry-pickar mecanicamente commits dessas branches antigas: isso pode
reintroduzir versões anteriores de arquivos já reconciliados.

## 3. O que aconteceu quando a conversa travou

Não houve perda substantiva de código já publicado. O travamento aconteceu no
meio da retificação P15/F50 e deixou um **estado de higiene/CI incompleto**:

1. a retificação curricular F50→GM.12 já estava salva;
2. o grafo já estava em 90 nós;
3. `Recipientes` já havia sido declarada no inventário;
4. dois fiscais ainda esperavam o estado anterior (25 primitivas e ausência de
   `Recipientes` na dívida explícita);
5. sobrou uma bancada temporária que tentou reaplicar um reparo já aplicado.

A retomada removeu as bancadas órfãs, confirmou os guardas corretos e restaurou
um checkpoint limpo. Antes de continuar a F50, a CI original ficou verde no
commit `859966703c616ae79e5f25ad35762d8364404430`.

## 4. F50 / GM.12 — IMPLEMENTADA, NÃO ATIVADA

Commit de implementação:

`62879473aa55a55d7b92c2b8441136eb20a3b724`

Mensagem: `GM.12 pela F50: massa e capacidade sem deixar a aparência responder`.

### Matriz curricular vigente

`GM.01 comparação direta visível` → **`GM.12 massa e capacidade: comparação e conservação`** → `GM.05 medidas padronizadas`

- grafo: **90 nós únicos**;
- `GM.12`: F0, pré-requisito `[GM.01]`;
- `GM.05`: depende de `[GM.12, N2.02]`;
- `GM.02` continua sendo **Tempo cotidiano**;
- F50 pertence a `GM.12`;
- F50 trabalha **sem unidades padronizadas**; cm/m, g/kg, L pertencem depois a GM.05.

### Runtime construído

- `medidasProcedure.ts` — procedimento puro, diagnóstico e evidência;
- `medidasContract.ts` — escada L1–L5 e casos contraintuitivos;
- `Recipientes.tsx` — comparação/conservação de capacidade com despejo para
  recipientes de referência iguais;
- `MedidasStage.tsx` — compõe `Balanca` e `Recipientes`, retry/feedback autoral e
  seriação;
- `GM.12.ts` — ficha runtime da F50;
- Composer/renderers/Radar/evidência/mapa runtime/sonda ligados ao novo kind
  `medidas`;
- a sonda deixou de congelar um caminho antigo de Chromium e agora usa
  `chromium.executablePath()` da versão instalada de `playwright-core`.

### Escada pedagógica

1. peso óbvio — pena × pedra;
2. capacidade com recipientes de mesmo formato;
3. conservação com formatos diferentes — alto/fino pode parecer mais cheio e
   conter menos;
4. peso contraintuitivo — objeto pequeno pode ser mais pesado;
5. seriação de três por peso ou capacidade.

Diagnósticos: `JULGA_PELO_TAMANHO`, `CONFUNDE_PESO_VOLUME`, `IGNORA_FORMATO`.
Domínio exige 3/3 em duas sessões e pelo menos um acerto no caso
`CASO_CONTRAINTUITIVO`. Resposta errada não emite essa evidência.

## 5. Regra de ativação preservada

`GM.12` está em `COMPOSER_FICHAS`, mas **não** está em `COMPOSER_CANARIES`.
Portanto a implementação está disponível para teste e inspeção sem chegar à
criança em produção.

O mesmo princípio vale para as correções ainda em observação da linha cumulativa
(AL.01, N1.06, N1.13, GE.01, GE.02, GM.01 etc.): implementação e promoção são
etapas distintas.

## 6. Evidência de qualidade do lote F50

A bancada transacional só publicou o commit depois de passar:

- `npm run auditar`;
- `npm run fichas:auditar`;
- `npm run fichas:conferir`;
- `npm run grafo:check`;
- `npx tsc --noEmit`;
- testes focalizados da F50 e do fiscal de evidência;
- suíte completa: **1971/1971 testes**;
- `npm run sonda -- "GM.12"` em Chromium real, com as cinco cenas e as larguras
  da sonda;
- `npm run build`.

Depois da publicação, a **CI normal da PR #29** foi disparada novamente no head
`62879473...` e passou integralmente no run **31253027123**:

- guarda de binários ✅
- auditoria do catálogo ✅
- auditoria das fichas ✅
- grafo ✅
- TypeScript ✅
- testes ✅
- build ✅

## 7. Dívida explícita atual

Com `Recipientes` implementada, `PRIMITIVAS_PENDENTES` não deve mais listá-la.
As primitivas ainda ausentes nesse fiscal são **`Moedas` e `Regua`**.

Não confundir dívida declarada com autorização para usar fallback genérico.
Quando uma ficha depender dessas primitivas, construir a primitiva antes de
promover a competência.

## 8. Próximo passo seguro

Antes de qualquer novo código:

```bash
git fetch origin
git checkout codex/integrar-bloco-f0
git pull --ff-only origin codex/integrar-bloco-f0
git rev-parse HEAD
git rev-parse origin/main
```

O head técnico esperado antes deste handoff documental é `62879473...`; se o
head for posterior, leia os commits posteriores antes de agir.

Próxima linha de trabalho:

1. inspecionar visualmente/por prints a F50 quando houver artefatos de captura
   disponíveis, além da sonda já verde;
2. continuar os saneamentos comprovados do bloco sem ativar telas no mesmo lote;
3. tratar promoções/canários **separadamente, um nó por vez**, somente após o
   intervalo de observação e revisão;
4. manter a PR #29 como janela de comparação/CI, **não como pedido de merge na
   `main`**.

## 9. Portões mínimos antes de publicar qualquer lote

```bash
npm run auditar
npm run fichas:auditar
npm run grafo:check
npm run lint
npm test -- --run
npm run build
npm run pr:check
git diff --check
```

Para mudança perceptível pela criança, adicionar sonda/prints da cena afetada.

**Existir não é estar certo. Divergência pode ser corrigida; divergência
silenciosa não.**
