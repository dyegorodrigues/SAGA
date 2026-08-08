# Briefing operacional — continue daqui

> **VIGENTE em 8/ago/2026 após GM.01.**
>
> Leia primeiro [`HANDOFF_CONTINUIDADE_IA.md`](./HANDOFF_CONTINUIDADE_IA.md).
> Este briefing é a versão executiva: regras, sequência e definição de pronto.

## 0. Estado que não deve ser redescoberto

- Repo: `dyegorodrigues/SAGA`.
- Trabalho: **`codex/integrar-bloco-f0`**.
- `main`: `68fad4c575e28959b2ca4776e9a541d6828b63f3` — **não tocar**.
- PR #29: draft, base `main`, somente comparação/CI, nunca auto-merge.
- Checkpoint funcional: `cb868e77facfc02bf4ea412971393fdc1fbcb8e1`.
- Nesse checkpoint: branch 190 commits à frente e 0 atrás da main.

### O remoto está limpo

Só existem quatro branches:

- `main`
- `codex/integrar-bloco-f0`
- `agent/creature-engine-tamagotchi`
- `codex/criar-branch-para-creature-engine-tamagotchi`

As duas últimas são outro módulo e não devem ser tocadas neste fluxo.

## 1. Promoções concluídas nesta retomada

Em ordem, cada uma com commit próprio e CI completa:

| nó | ficha | estado anterior | promoção |
|---|---|---|---|
| `AL.01` | F51 classificação | intruso legado | `72483db7...` |
| `N1.06` | F05 ouvir→símbolo | número escrito no legado | `d3c2b7d4...` |
| `N1.13` | F04 produzir quantidade | fallback; nó novo | `6a6dc16f...` |
| `GE.01` | F47 posição espacial | palavras/emoji no legado | `a9f9205f...` |
| `GE.02` | F48 formas planas | pergunta fixa de emojis | `3f8e10cd...` |
| `GM.01` | F49 grandezas visíveis | fallback | `cb868e77...` |

A lista ativa agora vive em:

`src/curriculum/motores/composerCanaryIds.ts`

**Promoção futura = um id por commit.** Não reescrever `composerCanary.ts` só para ativar nó.

## 2. Correções importantes que precederam as promoções

### AL.01

A §9 dizia que domínio exigia uma peça corretamente deixada fora, mas o runtime não colhia essa prova. Agora existe `Evidencia.NAO_PERTENCE`, procedimento emissor, coleta no GameLoop e fiscal global.

### N1.06

Autoplay já tinha acontecido quando o prompt dizia "Aperte e escute". Agora a questão normal pergunta **"Que número você ouviu?"**; a micro-aula continua ensinando replay.

### F50 / GM.12

Implementação e QA fecharam massa/capacidade, inclusive prints pós-despejo. **Não promover ainda.** Ver handoff para detalhes.

### P18

Fechada. `KindType` só contém kinds com builder. Legado continua em `Question.kind` string. Ver `DECISAO_P18_KINDTYPE.md`.

## 3. Próxima sequência obrigatória

### Etapa 1 — auditar N1.10

Antes de qualquer ativação:

1. ler ficha runtime N1.10 e fichas canônicas associadas;
2. comparar JD5 perceptual × `bond` simbólico legado;
3. confirmar §3–§9, especialmente voz/tutorial/domínio;
4. capturar os cinco níveis em 320/390/900 e estados intermediários relevantes;
5. confirmar o que acontece com a forma simbólica F1 quando a JD5 for promovida;
6. só então decidir corrigir, promover ou manter desligada.

### Etapa 2 — auditar N1.11

A competência tem duas fichas conceitualmente diferentes: JD3 perceptual e F28 como conta. Confirmar a fronteira curricular antes de ativar a entrada runtime atual.

### Etapa 3 — GM.12

Reabrir somente depois do intervalo de observação e de releitura do handoff. Não ativar por conveniência só porque já está pronta tecnicamente.

### Etapa 4 — P8 / Jardim do Dojo

Construir o consumidor real das trilhas JD1–JD5 sem criar currículo paralelo ao grafo.

### Etapa 5 — próximas primitivas

`Moedas` e `Regua` quando suas fichas forem gargalo real. Não antecipar API órfã.

## 4. Ritual de qualquer nova sessão

1. conferir branches e SHA da `main`;
2. `compare main..codex/integrar-bloco-f0` — cumulativa não pode estar atrás;
3. ler commits posteriores ao checkpoint do handoff;
4. confirmar PR #29 draft/não mesclada;
5. verificar CI do head antes do primeiro lote funcional.

## 5. Portões

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

Tela:

```bash
npm run sonda -- "<ID>"
PRINTS_LARGURA=320 PRINTS_WAIT_MS=... node scripts/prints.mjs "<ID>"
```

Canário:

- QA visual antes;
- §9 realmente colhida;
- rollback conhecido;
- id já registrado no contrato;
- um id por commit em `composerCanaryIds.ts`;
- CI completa verde no SHA da promoção.

## 6. Regras que não se negociam

- uma tela não introduz conteúdo novo e linguagem visual nova ao mesmo tempo;
- ficha inteira é contrato: §3 a §9;
- resposta errada não emite evidência;
- palco que coleta resposta é dono da interação;
- divergência precisa ser declarada;
- não editar teste para esconder defeito de código;
- não guardar workflow temporário se a CI normal basta;
- não criar branches auxiliares para o bloco atual;
- não tocar nas branches do Creature Engine;
- não mexer na `main`.

## 7. Definição de pronto de um lote

- [ ] commit está na cumulativa;
- [ ] `main` não moveu;
- [ ] nenhuma branch extra ficou no remoto;
- [ ] nenhum workflow temporário ficou órfão;
- [ ] auditorias/grafo/TypeScript/testes/build verdes;
- [ ] sonda/prints quando há tela;
- [ ] handoff atualizado se o estado operacional mudou;
- [ ] PR #29 continua draft e não mesclada;
- [ ] uma nova conversa consegue retomar sem reler a conversa anterior.

**Existir não é estar certo. Divergência pode ser corrigida; divergência silenciosa não.**
