# 🎯 PLANO MESTRE — SAGA
**Documento de trabalho para o agente de desenvolvimento · 30/jul/2026**
*Substitui os planos anteriores. É a única lista de tarefas válida.*

---

# PARTE 0 — LEIA ANTES DE QUALQUER COISA

## A contradição que precisa ser resolvida primeiro

No relatório da última sessão você afirmou **duas coisas incompatíveis**:

1. *"100% dos anexos inseridos. Todos os arquivos de documentação em AI_Studio_Lab/pedagogia/ foram substituídos integralmente."*
2. *"Fiz uma varredura com comandos de terminal e esses anexos não chegaram ao AI Studio. O meu GrafoSaga ainda lista apenas 84 nós."*

**A segunda está certa** (é a que tem evidência de terminal). A primeira foi otimismo.

**Consequência real:** o Grafo no repositório tem **84 nós**, mas o cânone atual tem **95**. As fichas C22, C24, C31, C40 e outras apontam para competências que não existem no seu ambiente. Qualquer trabalho de conteúdo feito agora nasce quebrado.

## Verificação obrigatória — rode ANTES de tocar em qualquer coisa

```bash
grep -cE "^### (N[1-7]|AL|GE|GM|PE)\.[0-9]{2}" AI_Studio_Lab/pedagogia/GRAFO_DE_CONHECIMENTO_SAGA.md
grep -cE "^  - \{ id:" curriculum/grafo_saga.yaml
grep -oE "Versão [0-9.]+" AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md | head -1
grep -c "12.2-bis" AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md
grep -c "3-bis" AI_Studio_Lab/pedagogia/DOJO_SAGA.md
grep -cE "N2\.06|N5\.07|GM\.10|PE\.05" AI_Studio_Lab/pedagogia/MANUAL_DIDATICO_SAGA.md
```

**Valores corretos:** `95` · `95` · `Versão 2.7` · `2` · `1` · `4 ou mais`

Se qualquer um não bater, **pare e avise**. Não construa conteúdo sobre um Grafo desatualizado.

## Sobre reescrever documentos grandes

Você está certo sobre o limite de tokens — **não tente reescrever os 7 documentos numa resposta**. A regra do cânone (§14.3) proíbe editar documento por script de regex, mas **substituir arquivo inteiro por upload é permitido e é o caminho certo**.

Se o dono não conseguir fazer o upload, você pode escrever **um arquivo por turno**, integralmente, sem regex. Nunca fatiado, nunca remendado.

---

# PARTE 1 — O QUE JÁ ESTÁ FEITO (confirmado)

Estas três correções foram executadas e não precisam ser refeitas:

| Correção | Onde | Efeito |
|---|---|---|
| Unificação dos caminhos do Dojo | `App.tsx`, `KidHomeScreen.tsx` | o card agora passa obrigatoriamente pelo `LevelPickerModal` — o bug do "50+7 na faixa 1" morreu |
| `AULA_TOTAL` escalando por faixa | `composer.ts` | 8 (F0) · 12 (F1) · 16 (F2) · 20 (F3+) |
| `dominio` obrigatório | `schema.ts` | ficha sem regra de domínio reprova no teste de contrato |

Também foram feitos: ajuste da subitização (padrão de dados em vez de dispersão caótica), a sequência do number bond, o conjunto vazio com contorno pontilhado e voz, captura de `rt` no clique, e o auto-avanço de 10 segundos.

---

# PARTE 2 — AS TAREFAS, EM ORDEM

## 🔴 TAREFA 1 — Sincronizar o cânone (bloqueia tudo)

**Problema:** Grafo com 84 nós, cânone com 95.

**Ação:** receber os 6 arquivos atualizados e substituí-los **integralmente**:
- `AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md` → v2.7
- `AI_Studio_Lab/pedagogia/GRAFO_DE_CONHECIMENTO_SAGA.md` → 95 competências
- `AI_Studio_Lab/pedagogia/MANUAL_DIDATICO_SAGA.md` → com a didática das 11 novas
- `AI_Studio_Lab/pedagogia/DOJO_SAGA.md` → v1.1 (§3-bis: FAIXA × NÍVEL)
- `curriculum/grafo_saga.yaml` → 95 nós
- `src/data/grafo_saga.json` → regerado a partir do YAML

**As 11 competências novas:** N2.06 (pares/ímpares) · N2.07 (fatores) · N2.08 (múltiplos) · N5.06 (somar frações) · N5.07 (equivalentes) · N5.08 (comparar frações) · N7.03 (razão) · N7.04 (porcentagem) · GM.10 (conversão) · GM.11 (volume) · PE.05 (probabilidade)

**Prova de conclusão:** os 6 comandos da Parte 0 retornando os valores corretos, colados em bruto.

---

## 🔴 TAREFA 2 — Painel Admin (você está cego sem ele)

**Por que é prioridade tática 1:** sem o painel, não dá para auditar exercício, ver o estado do motor, nem testar ficha sem criar conta e jogar. Todo bug vira caça no escuro. **Consertar o painel multiplica a capacidade de achar os outros problemas.**

**O que ele precisa ter, no mínimo:**

1. **Tabela das 95 competências**, lendo o Grafo, com colunas: `id · nome · faixa · tem ficha? · tem gerador? · nº de micros · primitiva usada · tem coreografia? · tem áudio?`
2. **Preview do exercício rodando**, por nível — os 5 níveis lado a lado, gerando questão de verdade
3. **Inspetor de progresso** da criança selecionada: todas as variáveis (`lvl`, `maxLvl`, `mast`, `streak`, `reviewForce`, força FD/PD por trilha)
4. **Log de decisão do Composer:** o que ele escolheu e **por quê** ("escolheu N1.04 porque é fronteira; o Radar apontou lacuna em N1.02")
5. **Botões de teste:** forçar nível, resetar progresso, simular erro com tag
6. **Pop-ups que fecham** — o bug atual mais irritante

**Prova de conclusão:** print ou descrição da tabela com as 95 linhas preenchidas, e um preview funcionando.

---

## 🔴 TAREFA 3 — Responsividade: a tela do exercício NUNCA rola

**Problema:** no tablet, os elementos estouram e a criança precisa rolar. Uma criança de 4 anos **não descobre** que precisa rolar — ela simplesmente não vê o botão.

**A regra dura:** enunciado + área visual + área de resposta **cabem sempre na viewport**. Se não cabe, o conteúdo diminui — a tela não cresce.

**Ação:**
1. `overflow: hidden` fixo na viewport do `GameLoopExerciseRenderer`
2. Tamanhos vindo de **tokens responsivos** com três perfis: celular pequeno · tablet · tablet grande
3. Nenhum tamanho escrito à mão dentro de primitiva ou kind (§10.11)
4. Alvo de toque mínimo de 80px preservado em todos os perfis

**Prova de conclusão:** teste em viewport de 768×1024 e 820×1180 sem barra de rolagem em nenhum kind.

---

## 🟠 TAREFA 4 — Registro de temas (acaba a maçã e o cachorro)

**Criar `src/curriculum/themes.ts`** como **dicionário puro de dados** — sem lógica, sem regra matemática:

```ts
export const TEMAS = {
  espaco:  { singular: "planeta", plural: "planetas",
             objetos: ["🪐","⭐","🚀","☄️","🛰️","👨‍🚀"], cenario: "fundo_estrelado" },
  selva:   { singular: "animal",  plural: "animais",
             objetos: ["🐯","🦁","🐺","🐘","🦅","🐒","🐍"], cenario: "floresta" },
  dojo:    { singular: "item",    plural: "itens",
             objetos: ["🥋","🗡️","📜","🏮","🐉","⭐"], cenario: "templo" },
  resgate: { singular: "herói",   plural: "heróis",
             objetos: ["🚒","👮","👨‍⚕️","🚑","⛑️","🧯"], cenario: "cidade" },
  esporte: { singular: "item",    plural: "itens",
             objetos: ["⚽","🏀","🏆","🥇","👟","🎽"], cenario: "quadra" },
  dinos:   { singular: "dinossauro", plural: "dinossauros",
             objetos: ["🦕","🦖","🥚","🌋","🦴","🌿"], cenario: "vale" },
  games:   { singular: "item",    plural: "itens",
             objetos: ["🎮","🪙","🍄","⚔️","🧪","🎁"], cenario: "pixel" },
  ciencia: { singular: "item",    plural: "itens",
             objetos: ["🧪","🔬","🧲","🔭","💡","⚗️"], cenario: "laboratorio" },
};
```

**As três regras que fazem funcionar:**
1. **Tema escolhido por SESSÃO**, nunca por questão — trocar a cada item vira caos visual
2. **O tema fornece o vocabulário do áudio** — tema selva faz a voz dizer *"quantos animais?"*, não *"quantos objetos?"*. Hoje isso está chumbado no gerador e é por isso que a fala às vezes não bate com a figura
3. **100% cosmético** — nunca altera lógica, resposta ou dificuldade

**Bônus:** permite **um tema por criança** — um filho escolhe dinossauro, o outro espaço. Custo igual, vínculo muito maior.

---

## 🟠 TAREFA 5 — Camada cinematográfica das fichas

**Problema:** o renderizador reage a estados do React, mas **não existe roteiro temporal**. Não está definido quando a cena abre, quando a Mão Fantasma age, nem como o áudio sincroniza com o movimento.

**Ação:** criar um **sequenciador de coreografia** que lê um roteiro declarado na ficha e executa:

```ts
tutorial: [
  { fala: "Olha a fileira de cima", mostra: { destacarFileira: 1 }, sync: "junto" },
  { fala: "Cheia, já são cinco!",   mostra: { piscarFileira: 1 },   sync: "junto" },
]
```

**A regra técnica do áudio (§7.4):** o TTS não avisa quando uma palavra no meio da frase é dita. Amarrar o visual ao `onPlay` sincroniza com o **início do enunciado**, não com o momento certo. Para `sync: "junto"` ser real: **uma frase curta por batida visual**, ou áudio pré-gravado com marcas de tempo.

**Cada ficha precisa declarar seis momentos:**
| Momento | O que define |
|---|---|
| abertura | como o exercício entra (o mascote apresenta?) |
| coreografia | batida a batida: fala + movimento + sync |
| acerto | o que acontece, quanto dura — **escala com a idade** (F0 comemora, F3+ segue rápido) |
| erro | feedback suave, como a dica aparece |
| transição | como sai um e entra o próximo, sem tela branca |
| fecho | a celebração e o que mostra de progresso |

---

## 🟡 TAREFA 6 — Fábrica de fichas (o volume)

Só começar **depois** das tarefas 1 a 3. Ordem por urgência de uso:

| Lote | Quais | Por quê |
|---|---|---|
| 1 | Jardim do Dojo: **JD1 a JD5** | é onde a criança de 4-5 anos treina — hoje não existe no código |
| 2 | os 7 geradores que ainda repetem sempre: `gN3_01, gN3_03, gGE_02, gGM_02, gN1_02, gN1_09, gN1_11` | a criança vê sempre a mesma questão |
| 3 | F0 completo (13 fichas) com roteiro cinematográfico | o que os filhos usam hoje |
| 4 | F1 (operações básicas) | próximo degrau |
| 5 | as 11 competências novas | fecham o currículo |
| 6 | F2, F3, F4 | volume restante |

**Ritmo sugerido:** 2 a 3 fichas por turno, cada uma passando no teste de contrato antes da próxima. **Nunca em lote grande** — foi assim que nasceram os 48 geradores com 0% de conformidade.

---

# PARTE 3 — REGRAS DE TRABALHO (não negociáveis)

1. **Toda entrega traz o comando exato que a produziu e a saída bruta.** Contagem de teste não é prova; a lista de suítes que rodou é.
2. **Nunca ajuste a asserção do teste para bater com a saída.** Quando teste e código discordam, decide-se pelo cânone.
3. **Nenhum script de regex sobre arquivo de produção ou documento do cânone.**
4. **Não use `/build` para correção cirúrgica.** `/build` reescreve demais e quebra o que funcionava. Use só para construir coisa nova do zero.
5. **Uma tarefa por turno**, terminando em commit.
6. **Se algo bloquear, pare e avise** — não improvise.

---

# PARTE 4 — PERGUNTAS PARA RESPONDER

Responda estas antes de começar a Tarefa 2:

1. **Por que os exercícios não aparecem no Painel Admin?** Diagnóstico técnico, sem consertar ainda.
2. **Liste o código morto:** quais `kind` o renderer trata que nenhum gerador produz, e vice-versa.
3. **Quantas fichas existem hoje** em `src/curriculum/fichas/` e quantas têm `dominio` preenchido?
4. **O simulador de criança** (`simulated-learner`) roda contra os motores reais, ou continua fora da suíte de testes?

---

# PARTE 5 — O QUE ESTÁ FORA DE ESCOPO AGORA

Para evitar dispersão, **não trabalhe nisto ainda**:
- redesenho visual completo / pixel-art
- Tamagotchi e evolução do mascote além de corrigir o enquadramento
- Firebase além do que já existe
- novas primitivas que não estejam na lista das tarefas 4 e 6

**O motivo:** hoje o projeto tem boa infraestrutura e pouco conteúdo chegando na criança. Cada peça nova de infraestrutura aumenta essa distância. **A pergunta antes de cada tarefa: isso muda o que a criança vê amanhã?**
