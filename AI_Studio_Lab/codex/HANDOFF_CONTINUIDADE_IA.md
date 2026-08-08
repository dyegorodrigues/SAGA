# Handoff de continuidade — SAGA / branch cumulativa

> **VIGENTE — 8/ago/2026, após a promoção de GM.01.**
>
> Este é o ponto de entrada operacional de qualquer nova sessão. O repositório é
> a fonte de verdade; `RETOMADA.md` preserva método e história, mas contém trechos
> antigos. Antes de editar, confirme o remoto e leia commits posteriores ao
> checkpoint funcional abaixo.

## 1. Regra de ouro

- Repositório: `dyegorodrigues/SAGA`.
- **Não mover, mesclar ou trabalhar na `main`.**
- `main` verificada: `68fad4c575e28959b2ca4776e9a541d6828b63f3`.
- Linha de trabalho: **`codex/integrar-bloco-f0`**.
- PR #29: **draft**, base `main`, apenas comparação/CI; não mesclar e não ativar auto-merge.
- Checkpoint funcional desta sessão: **`cb868e77facfc02bf4ea412971393fdc1fbcb8e1`** — promoção GM.01.
- A branch estava nesse checkpoint **190 commits à frente e 0 atrás da `main`**.
- Commits posteriores ao checkpoint funcional podem ser apenas documentação/handoff; leia-os antes de agir.

### Branches remotas — estado limpo

Há exatamente quatro:

1. `main`
2. `codex/integrar-bloco-f0`
3. `agent/creature-engine-tamagotchi`
4. `codex/criar-branch-para-creature-engine-tamagotchi`

As duas últimas pertencem ao Creature Engine e **não podem ser tocadas neste fluxo**.

Os refs históricos criados nesta linha (`ativar-al01`, `corrigir-n106`, `corrigir-n113`, `reconciliar-f05-f04`) foram removidos do remoto depois de provar absorção/reconciliação. PRs e commits preservam o histórico.

---

## 2. O que foi fechado nesta retomada

### 2.1 F50 / GM.12 — IMPLEMENTADA E FECHADA, MAS NÃO PROMOVIDA

Matriz vigente:

`GM.01 comparação direta visível` → **`GM.12 massa/capacidade: comparação e conservação`** → `GM.05 medidas padronizadas`

- grafo: 90 nós;
- `GM.02` continua sendo Tempo cotidiano;
- `GM.12` está registrada em `COMPOSER_FICHAS` e **fora** da lista de canários;
- `Recipientes` é executável; dívida de primitivas ficou em `Moedas` e `Regua`;
- F50 trabalha sem unidades; g/kg, L/mL e cm/m pertencem depois a GM.05.

Correções visuais/pedagógicas feitas após olhar screenshots reais:

- capacidade passou a perguntar **quanto cabe**, com recipientes-fonte cheios até a borda;
- L2: mesma forma, tamanhos diferentes;
- L3: formatos diferentes, ambos cheios — altura externa vira armadilha;
- verificação despeja em recipientes-padrão iguais, preservando marcas de origem;
- L5 peso usa o **mesmo objeto-referência** para todos, em vez de mini-balanças abstratas;
- tutorial/falas separados para peso e capacidade;
- estados inicial e pós-despejo inspecionados em Chromium em 320/390/900.

Commits-chave:

- `62879473...` implementação inicial;
- `91abcf85...` capacidade cheia + referência comum de peso;
- `3ddb3ed5...` tutorial, falas e cânone sincronizados.

**Não promover GM.12 no embalo.** Ela acabou de sofrer correções profundas e fica em observação até nova revisão deliberada.

### 2.2 QA visual virou instrumento reutilizável

`scripts/prints.mjs` agora:

- usa `chromium.executablePath()`;
- aceita `PRINTS_LARGURA`;
- aceita `PRINTS_WAIT_MS` para fotografar depois de abertura/autoplay;
- aceita `PRINTS_CLICK`, `PRINTS_CLICK_WAIT_MS` e `PRINTS_SUFFIX` para estados pós-interação.

Isto fechou um ponto cego importante: sonda mede layout, mas não julga pedagogia nem garante que o screenshot foi feito no estado certo.

### 2.3 P18 — FECHADA

Arquivo de decisão: `DECISAO_P18_KINDTYPE.md`.
Auditoria: `AUDITORIA_P18_KINDS.md`.

Nove nomes estavam em `KindType` sem builder. Auditoria AST provou que **0/9** eram declarados por fichas TypeScript autorais atuais.

Tratamento:

- futuros canônicos: `linking-cubes`, `singaporebars`, `visual-addition` — voltam ao tipo somente junto de contrato+builder+renderer+teste;
- legado: `multiple_choice`, `sequence`, `subvis`, `take-apart` — continuam válidos como `Question.kind` string;
- órfãos: `missing-addend-frame`, `sentencebuilder` — não reservam API autoral.

Novo invariante: **todo `KindType` tem builder; zero exceções.**

### 2.4 AL.01 / F51 — §9 corrigida e PROMOVIDA

Defeito encontrado antes da promoção: a ficha exigia "uma peça corretamente deixada fora", mas o runtime não exigia nem colhia essa prova.

Correção:

- `Evidencia.NAO_PERTENCE`;
- `classificacaoProcedure.evidenciasDe`;
- domínio exige a evidência;
- `answerPolicy` coleta;
- fiscal global prova emissão e prova negativa.

Promoção:
`72483db7759bfe69a45ff47c4ae95906cb777b49`

Rollback: `legadoAL_01` — intruso de múltipla escolha.

### 2.5 N1.06 / F05 — prompt corrigido e PROMOVIDA

Defeito visual/semântico encontrado: depois do autoplay, a tela ainda dizia "Aperte e escute".

Agora:

- micro-aula ensina a apertar/repetir;
- questão normal pós-autoplay pergunta apenas **"Que número você ouviu?"**;
- screenshot pós-audição revisado.

Correção: `58fa73f840ee0470ebf0accd34b1f1d00b8d993e`.
Promoção: `d3c2b7d46d6e1f5bc748ae555b66e840d2e45167`.
Rollback: `gN1_06`, que continua escrevendo o número por extenso.

### 2.6 N1.13 / F04 — PROMOVIDA

Promoção: `6a6dc16f0177a72bb8af463f7018a66abcfda2e9`.

É estreia verdadeira: sem canário volta ao fallback, porque o nó foi criado para separar "produzir quantidade" de N1.09 "contar até 20".

QA visual já havia confirmado níveis com e sem vaga fantasma; contrato de canário provou rollback para fallback, saves, Radar e cinco níveis.

### 2.7 GE.01 / F47 — PROMOVIDA

Promoção: `a9f9205f624b24134c51c6602f387dfcccf81649`.

Substitui o legado que fazia geometria virar leitura em palavras. QA estável em Chromium confirmou a cena depois da abertura temporal.
Rollback: `gGE_01`.

### 2.8 GE.02 / F48 — PROMOVIDA

Promoção: `3f8e10cdc7c927ec7be2a328c0ec38c5d1058421`.

- fronteira 2D→3D corrigida: sólidos permanecem em GE.04;
- L5 é transferência entre representações 2D;
- domínio exige `FORMA_GIRADA`;
- QA visual revisado.

Rollback: `gGE_02`.

### 2.9 GM.01 / F49 — PROMOVIDA

Promoção/checkpoint funcional: `cb868e77facfc02bf4ea412971393fdc1fbcb8e1`.

Era estreia: não havia gerador próprio e o nó caía no fallback.

QA estável confirmou:

- altura sob base comum;
- comprimento no eixo horizontal, partindo do mesmo marco;
- diferença pequena;
- objetos diferentes;
- seriação.

Domínio já exige `DIFERENCA_PEQUENA`. Rollback volta ao fallback genérico.

---

## 3. Arquitetura de promoção simplificada

Foi criado:

`src/curriculum/motores/composerCanaryIds.ts`

Ele é a **única lista declarativa de ids ativos**. `composerCanary.ts` mantém mecanismo, fichas registradas e rollback; promoção agora deve ser um diff de uma linha no arquivo de ids.

Isso reduz o risco de misturar alteração estrutural com promoção.

Canários adicionados nesta retomada, em ordem:

1. `AL.01`
2. `N1.06`
3. `N1.13`
4. `GE.01`
5. `GE.02`
6. `GM.01`

Cada SHA atravessou CI normal com auditorias, grafo, TypeScript, suíte completa, build e guarda de binários.

---

## 4. Próxima fila — ordem deliberada

### A. NÃO promover GM.12 ainda

Manter em observação. Só promover em lote futuro depois de nova leitura do checkpoint e, de preferência, nova inspeção visual/uso real.

### B. N1.10 e N1.11 — AUDITAR antes de qualquer promoção

Não adicionar ao arquivo de ids ainda.

- `N1.10`: foi reescrita do `bond` simbólico para JD5 (operação mental antes do símbolo). O rollback `gN1_10` existe; falta confirmar ficha inteira, estados visuais e o que fica faltando na forma simbólica F1 após a troca.
- `N1.11`: há duas fichas no cânone (F28 simbólica e JD3 perceptual); a entrada runtime atual representa JD3. Confirmar fronteira entre as duas antes de promover.

### C. P8 — motor do Jardim do Dojo

Depois de resolver N1.10/N1.11, auditar e construir o consumidor real das trilhas JD1–JD5. As trilhas existem; o problema sistêmico é apresentá-las à criança sem criar um segundo currículo paralelo.

### D. Moedas e Régua

São as duas primitivas homônimas ainda ausentes no mapa runtime. Construir quando suas fichas virarem gargalo da próxima faixa; não antecipar API sem consumidor.

---

## 5. Portões de qualquer lote

Antes de publicar código:

```bash
npm run auditar
npm run fichas:auditar
npm run fichas:conferir
npm run grafo:check
npx tsc --noEmit
npm test -- --run
npm run build
npm run pr:check
git diff --check
```

Tela afetada:

```bash
npm run sonda -- "<ID>"
PRINTS_WAIT_MS=<estado> node scripts/prints.mjs "<ID>"
```

Promoção:

- ficha já registrada;
- QA visual concluído;
- §9 realmente executável;
- fallback/legado conhecido;
- **um id por commit** em `composerCanaryIds.ts`;
- `canaryContract.test.ts` precisa passar inteiro.

---

## 6. O que NÃO fazer

- não mexer na `main`;
- não recriar as branches históricas apagadas;
- não tocar nas duas branches do Creature Engine;
- não promover GM.12 agora;
- não promover N1.10/N1.11 antes da auditoria específica;
- não reintroduzir os nove kinds P18 no `KindType` sem runtime autoral completo;
- não confiar em teste verde como substituto de olhar a tela;
- não deixar workflow temporário como mecanismo permanente quando a CI normal resolve o mesmo problema.

**Existir não é estar certo. Divergência pode ser corrigida; divergência silenciosa não.**
