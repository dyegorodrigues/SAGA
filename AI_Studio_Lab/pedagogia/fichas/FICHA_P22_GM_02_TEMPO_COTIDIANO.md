# FICHA P22-GM.02 — Tempo cotidiano pré-leitor
**Competência:** GM.02 · **Primitiva:** `plain` · **Faixa:** F0

## 1. Objetivo observável
A criança reconhece partes do dia por pistas de rotina, entende ontem/hoje/amanhã, navega a sequência semanal e ordena acontecimentos cotidianos sem depender de leitura convencional.

A competência não é “saber o nome manhã/noite”. É construir uma primeira linha mental do tempo: antes, agora, depois; ciclos cotidianos; sequência de dias; e ordem temporal de eventos.

## 2. Pré-requisitos
GM.02 é nó de raiz no grafo e mantém `prereqs: []`.

Isso não significa ausência de andaime. A atividade precisa oferecer áudio claro, iconografia familiar e cenas de rotina para que linguagem escrita não vire um pré-requisito escondido.

GM.12 não é pré-requisito nem sucessor desta ficha por semântica: GM.12 trata massa/capacidade. GM.02 permanece dona exclusiva de tempo cotidiano.

## 3. Escada de cinco níveis
1. **Partes do dia:** manhã, tarde e noite a partir de pistas de rotina e iluminação.
2. **Ontem/hoje/amanhã:** três eventos em uma linha temporal simples; a criança identifica o evento pedido.
3. **Dias da semana:** dado um dia, identificar o anterior ou o seguinte; opções são audíveis.
4. **Ordem de eventos:** escolher a sequência plausível de três acontecimentos cotidianos.
5. **Recuperação mista:** alterna aleatoriamente as quatro famílias sem anunciar o formato.

O nível 5 declara `rt_alvo = 12 s` somente como metadado de fluência. Velocidade não reprova compreensão, não reduz mastery e não concede coroa conceitual.

## 4. Cena e roteiro
A instrução essencial vive em `audioPrompt`. Cada alternativa tem `Option.say` e `audibleOptions=true`: a criança pode ouvir as opções, portanto texto visível é apoio e não chave da resposta.

**L1:** uma pista visual como `🌅 🛏️→🪥`, `☀️ 🏫→⚽` ou `🌙 🍽️→🛏️`; a voz descreve a situação e pergunta a parte do dia.

**L2:** três eventos aparecem em ordem, por exemplo `🛝 ← 🏫 → 🏊`; a voz explicita “ontem parque, hoje escola, amanhã natação” e pergunta um dos três relativos.

**L3:** a voz diz o dia de referência e pergunta qual vem antes/depois. O nome escrito existe para quem já lê; o botão de áudio da alternativa fala o dia.

**L4:** três cartões de rotina formam sequências. A criança escolhe a que respeita primeiro → depois → por último.

## 5. Exemplos e não-exemplos
**Exemplos:**
- sol nascendo + acordar → manhã;
- “ontem parque, hoje escola, amanhã natação; o que é amanhã?” → natação;
- hoje terça-feira, dia depois → quarta-feira;
- `🛏️ → 🪥 → 🥣` → ordem plausível de uma manhã.

**Não-exemplos diagnósticos:**
- hoje terça, responder segunda para “depois” → `DIRECAO_ERRADA`;
- hoje terça, responder quinta para “depois” → `OFF_BY_ONE`;
- `🥣 → 🪥 → 🛏️` quando a rotina começa ao acordar → `ORDEM_ERRADA`;
- errar manhã/tarde/noite uma vez não cria automaticamente uma misconception causal.

## 6. Erros e feedback
- **`DIRECAO_ERRADA`:** contraste corporal/visual entre antes e depois; volte ao dia de referência e caminhe uma casa na direção pedida.
- **`OFF_BY_ONE`:** marque o dia atual e dê apenas um passo, evitando “pular um”.
- **`ORDEM_ERRADA`:** reconte a rotina oralmente com “primeiro, depois, por último” e reorganize as três imagens.
- **erro sem hipótese segura:** registre a tentativa sem inventar diagnóstico no Radar. Um erro isolado não prova uma concepção errada.

A resposta correta nunca carrega misconception.

## 7. Linguagem pré-leitora e acessibilidade
A criança não precisa ler “quarta-feira”, “ontem” ou “tarde” para responder. A voz narra a tarefa e cada opção pode ser ouvida individualmente.

Ícones devem ser grandes, familiares e semanticamente diferentes. Botões mantêm touch targets íntegros em 320/390/900 px. A cor nunca é o único sinal. Textos longos não podem ser necessários para decidir a resposta.

## 8. Evidência de domínio
Domínio requer evidência distribuída entre as quatro famílias, em mais de uma sessão. Acertar apenas partes do dia não prova GM.02 inteira.

O nível misto funciona como contraprova de formato: a criança precisa identificar qual relação temporal está sendo perguntada. `rt_alvo` pode alimentar fluência e recomendação, mas não substitui precisão, retenção e cobertura das famílias.

## 9. Rollback e contraprovas
O gerador legado de GM.02 permanece como **rollback operacional**. Ele cobre uma pergunta parcial de parte do dia, mas não prova ontem/hoje/amanhã, semana nem ordenação de eventos.

Contraprova obrigatória: uma criança que sempre acerta “manhã ou noite”, mas não sabe dizer qual evento foi ontem, qual dia vem depois de terça ou qual ação acontece primeiro numa rotina, **não domina GM.02**.

A ficha não pode ser desviada para massa/capacidade: essa semântica pertence a GM.12 e foi separada justamente para impedir que um ID esconda duas competências.