# Briefing operacional — continue daqui

> **VIGENTE em 8/ago/2026 após P17 v2 e revalidação de N1.10/N1.11.**
>
> Leia primeiro [`HANDOFF_CONTINUIDADE_IA.md`](./HANDOFF_CONTINUIDADE_IA.md). Este briefing é a versão executiva: regras, sequência e definição de pronto.

## 0. Estado que não deve ser redescoberto

- Repo: `dyegorodrigues/SAGA`.
- Trabalho: **`codex/integrar-bloco-f0`**.
- `main`: `68fad4c575e28959b2ca4776e9a541d6828b63f3` — **não tocar**.
- PR #29: draft, base `main`, somente comparação/CI, nunca auto-merge.
- Creature Engine: fora deste fluxo.
- Remoto limpo: main + cumulativa + duas branches do Creature Engine.

## 1. P17 está fechada

Documento: `DECISAO_P17_N110.md`.

### N1.10

`JD5 → retirada real de andaime → NumberBond`

O L4 alterna moldura e objetos realmente soltos. `SEM_MOLDURA` é gate obrigatório antes de L5. `TOTAL_ALEM_DE_CINCO` continua evidência independente de domínio.

Revalidação: `37595c73795b45c9e16075749bae51690c5d77ac` — CI normal verde.

### N1.11

`JD3 → F28 NumberBond → n + □ = 10`

Revalidação sobre N1.10 ativa: `ab5b3b613a3226076b1d967a48cc99ba6c8b50c9` — CI normal verde.

### Regra estrutural

Não criar nós por representação. JD3/JD5 completas vivem no Jardim como treino de automaticidade e não entram no DAG.

## 2. Canários F0 ativos/revalidados nesta retomada

- `AL.01`
- `N1.06`
- `N1.13`
- `GE.01`
- `GE.02`
- `GM.01`
- `N1.10`
- `N1.11`

Ativação declarativa: `src/curriculum/motores/composerCanaryIds.ts`.

**Promoção futura = um id por commit.**

## 3. GM.12 continua desligada

F50/GM.12 está implementada, visualmente revisada e registrada, mas continua fora dos canários por decisão deliberada de observação.

Não promover no embalo.

## 4. Próxima frente obrigatória — P8 / Jardim do Dojo

### O bug estrutural atual

`DojoTab.tsx` chama um modo de **Dojo Garden**, porém esse modo não usa `JARDIM`. Ele lista `ALL_MATH_TRACKS` com estrelas como revisão CRA genérica.

As trilhas reais já existem:

- JD1 → N1.03;
- JD2 → N1.08;
- JD3 → N1.11;
- JD5 → N1.10;
- todas destravam no nível 3 da mãe.

JD4 continua fora: não inventar nessa tarefa.

### Não conectar JD* diretamente ao GameLoop

O GameLoop atual sempre usa `applyJourneyAnswer`, que é uma escada de **compreensão conceitual**. Jardim mede **automaticidade**.

Além disso, bônus de velocidade hoje só existe para `rapid-fire` ou ids iniciados por `dojo`.

Portanto a ordem correta é:

1. especificar o estado e o motor do Jardim;
2. derivar unlock da mãe sem criar nó no grafo;
3. progressão baseada em precisão + fluência/RT, não na coroa da Jornada;
4. salvar estado separado da competência-mãe;
5. manter Radar/telemetria sem chamar lentidão de misconception;
6. criar adapter `Track`/sessão somente depois;
7. substituir o Garden genérico da UI;
8. QA em 320/390/900 e teste de save/unlock.

## 5. QA visual — não confundir instrumento com produto

ZIP de sonda pode conter:

- `rollback` = versão legada intencional;
- fases intermediárias da coreografia;
- representação nova.

Sonda/layout aprovado **não significa** UI/arte final aprovada. O shell visual antigo e manipulativos básicos continuam dívida de produto, separada da validade pedagógica.

## 6. Portões

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

Tela:

```bash
npm run sonda -- "<ID>"
PRINTS_LARGURA=320 PRINTS_WAIT_MS=... node scripts/prints.mjs "<ID>"
```

## 7. Regras que não se negociam

- não tocar na `main`;
- não tocar nas branches do Creature Engine;
- ficha inteira é contrato (§3–§9);
- resposta errada não emite evidência;
- não editar teste para esconder defeito de código;
- não criar currículo paralelo;
- representação nova não apaga representação anterior necessária;
- troca de linguagem exige ponte observável;
- não bypassar `SEM_MOLDURA`;
- não conectar JD* ao motor da Jornada sem P8;
- não deixar workflow temporário órfão;
- não tratar sonda como direção visual final.

## 8. Definição de pronto de um lote

- [ ] commit na cumulativa;
- [ ] `main` imóvel;
- [ ] nenhuma branch extra;
- [ ] nenhum workflow temporário órfão;
- [ ] auditorias/grafo/TypeScript/testes/build verdes;
- [ ] sonda/prints se há tela;
- [ ] handoff atualizado se o estado mudou;
- [ ] PR #29 continua draft/não mesclada;
- [ ] nova conversa consegue retomar sem reler esta conversa.

**Existir não é estar certo. Divergência pode ser corrigida; divergência silenciosa não.**
