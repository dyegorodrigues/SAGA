# Handoff de continuidade — SAGA / branch cumulativa

> **VIGENTE — 8/ago/2026, após P17 v2 e revalidação de N1.10/N1.11.**
>
> Este é o ponto de entrada operacional de qualquer nova sessão. O repositório é a fonte de verdade. Leia este arquivo, `BRIEFING_CODEX.md`, a PR #29 e os commits posteriores antes de editar.

## 1. Regra de ouro

- Repositório: `dyegorodrigues/SAGA`.
- **Não mover, mesclar nem trabalhar na `main`.**
- `main` protegida/verificada: `68fad4c575e28959b2ca4776e9a541d6828b63f3`.
- Linha cumulativa: **`codex/integrar-bloco-f0`**.
- PR #29: **draft**, base `main`, somente comparação/CI; nunca mesclar nem ativar auto-merge.
- Creature Engine continua fora deste fluxo.

### Branches remotas preservadas

O estado limpo estabelecido nesta sessão é:

1. `main`
2. `codex/integrar-bloco-f0`
3. `agent/creature-engine-tamagotchi`
4. `codex/criar-branch-para-creature-engine-tamagotchi`

As duas últimas pertencem ao Creature Engine e **não devem ser tocadas aqui**. Os refs auxiliares antigos desta linha foram removidos depois de provar absorção/reconciliação.

---

## 2. P17 — RESOLVIDA, endurecida e revalidada

Documento de decisão vigente:

`AI_Studio_Lab/codex/DECISAO_P17_N110.md`

### 2.1 Decisão curricular

Não criar nós paralelos para representações da mesma estrutura matemática.

- `N1.10` continua sendo **uma competência parte-todo**;
- `N1.11` continua sendo **uma competência amigos do 10**;
- Jornada faz a transição representacional;
- Jardim preserva a trilha perceptual completa para automaticidade;
- `JD*` não entra no DAG.

### 2.2 N1.10

Progressão vigente:

`JD5 perceptual → retirada real da moldura → NumberBond`

- L1: esconde 1 com total ancorado;
- L2: esconde 1–2;
- L3: sem contagem em voz alta;
- L4: alterna JD5 com moldura e objetos realmente soltos;
- L5: `bond` formaliza todo = parte + parte.

P17 v2 fechou a micro-lacuna da primeira versão: antes era possível provar escala >5 e ainda assim chegar ao `bond` sem provar independência da geometria da moldura.

Agora existem:

- `Evidencia.SEM_MOLDURA`;
- `dominio.gateAntesDeAvancar`;
- `Question.gateEvidenceBeforeAdvance`;
- bloqueio genérico de `level-up` no `progressEngine` enquanto a evidência-gate não existir;
- `source_level/source_level_alt` para fade explícito de andaime;
- objetos realmente soltos no palco/`TenFrame`.

`TOTAL_ALEM_DE_CINCO` e `SEM_MOLDURA` são provas diferentes; uma não substitui a outra.

### 2.3 N1.11

Progressão vigente:

`JD3 perceptual → F28 NumberBond → F28 sentença n + □ = 10`

- L1–L2: percepção do vazio/complemento;
- L3: 10 como todo no `bond`;
- L4–L5: sentença simbólica.

A JD3 completa continua no Jardim para automaticidade perceptual.

### 2.4 Domínio por ficha virou executável

P17 encontrou outra lacuna sistêmica: o Markdown/TypeScript podia declarar `4/4 em 3 sessões`, mas o motor usava regra fixa.

Agora `MasteryRule` viaja na questão e o motor respeita:

- `acertos`;
- `de`;
- `sessoes`;
- janelas por sessão;
- sessões posteriores maduras como a primeira;
- espaçamento de retenção.

`rt_alvo` permanece telemetria/fluência e **não reprova compreensão na Jornada**.

### 2.5 Commits P17 relevantes

- composição inicial + domínio por sessão: `fe23a96a5a665544bec508a30a1edd667473933b`;
- QA/interação/sonda: `824ea75bcff292c930b442dfbb7bdc4533e38b3e`;
- P17 v2 / gate sem moldura: `6e4cd11e0dc3fdf57dfb675b98645b16a3e82de8`;
- revalidação N1.10 com gate real: `37595c73795b45c9e16075749bae51690c5d77ac` — CI normal verde;
- revalidação N1.11 sobre N1.10 ativa: `ab5b3b613a3226076b1d967a48cc99ba6c8b50c9` — CI normal verde;
- decisão P17 consolidada: `65093c0ed3e442ce9e499df5990b04699a6b1948`.

N1.10 e N1.11 estão novamente em `composerCanaryIds.ts`, cada reativação em commit próprio.

---

## 3. Canários F0 ativos desta retomada

Além dos canários históricos, esta sessão promoveu/revalidou:

1. `AL.01` — F51 classificação; §9 exige `NAO_PERTENCE`;
2. `N1.06` — F05 ouvir→símbolo; prompt pós-autoplay corrigido;
3. `N1.13` — F04 produzir quantidade; estreia;
4. `GE.01` — F47 posição espacial;
5. `GE.02` — F48 formas planas/transferência 2D;
6. `GM.01` — F49 grandezas visíveis;
7. `N1.10` — parte-todo composto, revalidado após P17 v2;
8. `N1.11` — JD3 + F28, revalidado após N1.10.

A única lista declarativa de ativação é:

`src/curriculum/motores/composerCanaryIds.ts`

**Promoção futura = um id por commit.** Não reescrever `composerCanary.ts` para ativar nó.

---

## 4. F50 / GM.12 — implementada e QA fechado, ainda em observação

Matriz vigente:

`GM.01 comparação direta visível` → **`GM.12 massa/capacidade: comparação e conservação`** → `GM.05 medidas padronizadas`

- grafo: 90 nós;
- GM.02 continua Tempo cotidiano;
- GM.12 está registrada em `COMPOSER_FICHAS` e **fora** dos canários;
- `Recipientes` é executável;
- primitivas homônimas pendentes: `Moedas`, `Regua`;
- F50 é pré-unidade: sem g/kg, L/mL, cm/m.

QA visual corrigiu capacidade, conservação, referência comum de peso, tutorial/falas e estados pós-despejo.

**Não promover GM.12 no embalo.** Reavaliar deliberadamente depois do intervalo de observação.

---

## 5. P18 — fechada

Documentos:

- `AUDITORIA_P18_KINDS.md`
- `DECISAO_P18_KINDTYPE.md`

Invariante atual:

> **todo `KindType` autoral tem builder no Composer; zero exceções.**

Legado continua possível em `Question.kind` string. Não reintroduzir nomes no `KindType` sem contrato+builder+renderer+teste.

---

## 6. QA visual — interpretação correta

`scripts/prints.mjs` suporta largura, espera de estado e pós-interação.

A sonda mede estados reais em Chromium, mas **um ZIP de sonda não é mockup final do produto**.

Ele pode conter:

- `rollback` = versão legada intencional;
- `mostrando`, `vazio`, `tampando`, `perguntando` = quadros da coreografia;
- componente autoral = representação nova.

Portanto:

- QA pedagógico/layout aprovado **não significa** direção visual premium aprovada;
- shell antigo, discos azuis, moldura básica e `NumberBond` simples continuam dívida de design de produto, não evidência de currículo errado;
- nunca avaliar screenshot isolado sem ler o nome da cena e a fase.

---

## 7. Próxima frente: P8 — Jardim do Dojo

### Achado inicial já confirmado

`src/components/home/DojoTab.tsx` possui um modo chamado **Dojo Garden**, mas ele **não consome `JARDIM`**. Hoje ele lista genericamente `ALL_MATH_TRACKS` com estrelas e chama isso de revisão CRA.

Enquanto isso, `src/curriculum/fichas/dojo/jardim/index.ts` já define:

- JD1 → mãe N1.03;
- JD2 → mãe N1.08;
- JD3 → mãe N1.11;
- JD5 → mãe N1.10;
- todas destravam quando a mãe chega ao nível 3;
- JD4 continua dívida separada.

### Risco que precisa ser resolvido antes de conectar UI

Não passar uma ficha `JD*` diretamente ao GameLoop sem arquitetura deliberada.

O GameLoop atual:

- sempre chama `applyJourneyAnswer`, cuja progressão é conceitual (3 acertos → level-up; 3 erros → level-down);
- dá bônus de velocidade apenas a `rapid-fire` ou ids que começam com `dojo`;
- as fichas JD declaram que no Jardim **automaticidade/tempo** é o instrumento de progressão.

Conectar JD1/JD2/JD3/JD5 cruamente criaria uma trilha visual correta sobre um motor semântico errado.

### Próximo passo seguro de P8

Projetar primeiro um adaptador/motor do Jardim que:

1. derive desbloqueio do progresso da competência-mãe (`maxLvl >= destravaNoNivel` ou domínio);
2. mantenha estado de treino separado do nó da Jornada;
3. use precisão + fluência/tempo para progressão de Jardim;
4. nunca escreva `JD*` no DAG nem desbloqueie currículo por conta própria;
5. reutilize os mesmos geradores autorais das fichas JD;
6. preserve Radar/telemetria sem transformar lentidão em erro conceitual;
7. tenha migração/compatibilidade de save antes de entrar na UI;
8. só depois substitua o “Garden” genérico atual no `DojoTab`.

Não inventar JD4 dentro desta tarefa; resolver apenas o consumidor das trilhas já implementadas.

---

## 8. Portões de qualquer lote

Código:

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
PRINTS_LARGURA=320 PRINTS_WAIT_MS=<estado> node scripts/prints.mjs "<ID>"
```

Promoção:

- ficha registrada;
- QA visual concluído;
- §9 executável;
- fallback/legado conhecido;
- um id por commit;
- CI normal verde no SHA.

---

## 9. O que NÃO fazer

- não tocar na `main`;
- não recriar branches históricas removidas;
- não tocar nas branches do Creature Engine;
- não promover GM.12 por conveniência;
- não voltar a separar N1.10/N1.11 em nós por representação;
- não bypassar o gate `SEM_MOLDURA`;
- não conectar JD* ao GameLoop como se fossem Jornada sem resolver P8;
- não confiar em teste verde como substituto de inspeção visual;
- não tratar ZIP de sonda como design final;
- não deixar workflow temporário órfão.

**Existir não é estar certo. Divergência pode ser corrigida; divergência silenciosa não.**
