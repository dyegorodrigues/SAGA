# Conteúdo, design e áudio — o que já está pronto para mudar e o que ainda não

**Registrado em 3/ago/2026**, a partir de três perguntas do proprietário: como
trocar o design da **aplicação inteira** sem quebrar nada, onde editar objetos e
nomes dos exercícios, e como será a arquitetura dos áudios gerados.

O escopo é o sistema todo — telas, fichas, exercícios, primitivas e painéis —,
não apenas o cartão de um exercício.

As respostas abaixo são medidas no repositório, não estimadas.

---

## 1. Trocar o design sem quebrar o exercício

### O que já está protegido

`src/styles/tokens.ts` expõe **20 variáveis CSS com fallback**, no formato
`var(--cor-acao-primaria, #3b82f6)`. Isso significa que **cor, tamanho base,
alvo de toque e raio já são trocáveis sem tocar em componente algum**: basta
redefinir as variáveis em um tema.

A regra canônica está cumprida onde importa: o gerador não desenha, e as
primitivas recebem dados puros. Trocar de paleta, de escala ou de estilo visual
não altera pedagogia.

### O que ainda não está

As primitivas do Lote D usam classes cruas do Tailwind para **espaçamento,
tipografia e raio** — `py-2`, `px-3`, `gap-2`, `text-base`, `rounded-2xl`,
`min-h-[64px]`. Essas decisões não passam pelos tokens, então um redesign amplo
precisaria editar componente por componente.

Pior: `tokens.estado` embute **cor fixa do Tailwind** nos estados de interação —
`ring-blue-400`, `bg-green-100`, `ring-orange-400`, `ring-green-400`,
`ring-purple-400`. Um tema novo mudaria a paleta e os estados continuariam azuis
e verdes do tema antigo.

### O quadro do sistema inteiro, não só do exercício

Medido em 3/ago/2026 sobre os **96 componentes** do projeto, separando arte de
interface — cor cravada num SVG de mascote é legítima, num botão não é:

| | Total | Com tokens | Com cor cravada |
|---|---:|---:|---:|
| Componentes de interface | **75** | **23** (31%) | **33** (44%) |
| Arte (mascotes e skins) | 21 | — | esperado |

**Nenhuma das dez telas grandes usa tokens:**

| Tela | Linhas | Tokens | Hex cravado |
|---|---:|---:|---:|
| `GameLoop.tsx` | 1060 | 0 | 2 |
| `ParentDashboard.tsx` | 964 | 0 | 1 |
| `Mascot.tsx` | 777 | 0 | 45 |
| `MascotEvolution.tsx` | 755 | 0 | 40 |
| `GameLoopExerciseRenderer.tsx` | 621 | 0 | 5 |
| `AdminGodPanel.tsx` | 610 | 0 | 0 |
| `PickScreen.tsx` | 575 | 0 | 0 |
| `PedagogicalEditor.tsx` | 575 | 0 | 0 |
| `SetupScreen.tsx` | 371 | 0 | 2 |
| `AdminDashboardScreen.tsx` | 358 | 0 | 1 |

A leitura honesta: **as primitivas novas estão tokenizadas, o corpo da aplicação
não**. Trocar o design hoje mudaria os exercícios do Lote D e deixaria Jornada,
Dojo, Home, painéis e telas de administração no visual antigo — resultado pior
que não mudar nada.

Isso **não é um defeito do Lote D**, e sim dívida herdada que ficou visível
quando a primeira camada tokenizada apareceu ao lado do resto.

### O que falta, na ordem

1. Estender `tokens` com espaçamento, tipografia, raio, sombra, duração e easing,
   como o roteiro por andares já previa.
2. Converter `tokens.estado` para variáveis CSS, eliminando a cor fixa.
3. Trocar as classes cruas das primitivas pelos tokens.
4. Migrar as telas grandes **uma por vez**, começando pelas que a criança vê —
   `GameLoop`, `GameLoopExerciseRenderer`, `PickScreen` — e deixando painéis
   adultos por último.

O passo 4 é o caro, e é justamente onde o Plano Mestre manda **não misturar
redesign com mudança pedagógica**. Cada tela migrada é um PR próprio, com
captura antes e depois.

Enquanto isso não acontece, **trocar cor e tamanho é seguro nas primitivas novas;
trocar o sistema visual inteiro exige percorrer as telas herdadas**.

---

## 2. Editar nomes, objetos e variações dos exercícios

### Onde está hoje

Em `src/curriculum/procedimentos/additiveNarrative.ts`, dois arrays no topo:

```ts
const NOMES = ["Lia", "Caio", "Nina", "Téo", "Bia", "Davi", "Mel", "Rui"];

const OBJETOS = [
  { plural: "estrelas", singular: "estrela", emoji: "⭐", feminino: true },
  …
];
```

Acrescentar um objeto é adicionar uma linha. **Três campos são obrigatórios e
nenhum é decorativo:**

- `singular` e `plural` sustentam a concordância de número — sem eles volta o
  "1 estrelas";
- `feminino` sustenta a concordância de gênero — sem ele volta o
  "Quantas peixes";
- `emoji` é a ilustração.

Os testes de concordância cobrem os dois casos, então um objeto mal cadastrado
falha a suíte em vez de chegar à criança.

### O limite dessa solução

Conteúdo dentro de código serve enquanto quem edita é quem programa. Quando o
áudio entrar, **o pool de objetos e o manifesto de falas passam a precisar da
mesma fonte**: gerar áudio para uma palavra que não existe, ou usar uma palavra
sem áudio, é bug garantido.

O passo correto, quando o áudio começar, é mover `NOMES` e `OBJETOS` para um
arquivo de conteúdo — YAML ou JSON — que alimente **ao mesmo tempo** o runtime e
o gerador de áudio. Antes disso, não vale a pena: seria abstração sem uso.

---

## 3. Áudio: a conta que decide a arquitetura

### O problema real

A história é gerada, não escrita: nome, objeto, números, estrutura e posição da
incógnita variam a cada questão. Não existe "gravar as falas" — existe decidir
**em que granularidade** o áudio é produzido.

### As duas estratégias, medidas para N3.10

| Estratégia | Clipes | Tamanho | Observação |
|---|---:|---:|---|
| Frase inteira, força bruta | **5.034** | **~65 MB** | 3,1 h de áudio; inviável offline |
| Por fragmento, composicional | **58** | **~0,4 MB** | 87× menos arquivos |

O cálculo da força bruta considera 8 nomes, 6 objetos e números até 18, aplicados
aos 12 moldes de fala das quatro estruturas mais 8 variantes de pergunta. A
comparação `"Lia tem 3 a mais que Caio"` sozinha custa 2.160 clipes, porque
cruza dois nomes.

E isso é **uma única competência**. Multiplicado por 88, a força bruta não fecha.

### Por que o fragmento não é um mal necessário aqui

A objeção clássica ao áudio composicional é a prosódia robotizada. **Neste
projeto ela não se aplica**, e a razão está na própria ficha canônica F20:

> *"A frase é **narrada palavra por palavra**, e cada palavra **acende** no texto
> conforme é falada."*

A ficha **já exige** segmentação no nível da palavra, para o destaque
sincronizado. Fala contínua com prosódia natural seria, na verdade, **mais
difícil** de sincronizar — é exatamente o problema que o roteiro por andares
descreve quando diz que o TTS do navegador não informa de forma confiável o
instante de cada palavra.

Ou seja: o formato mais barato é também o pedagogicamente correto. Isso raramente
acontece e deve ser aproveitado.

### O inventário de 58 clipes

```
 8  nomes próprios
12  objetos (singular e plural)
18  numerais de 1 a 18
12  frases-carregadoras ("tinha", "então chegaram mais", "foram embora", …)
 8  perguntas
```

Números e nomes são reaproveitados por **todas** as competências. O custo marginal
de cada nova ficha passa a ser apenas suas frases-carregadoras e perguntas.

### Formato e organização

Confirmando o que o roteiro por andares já definiu:

- **Opus** ou OGG para tamanho, MP3 apenas como fallback de compatibilidade;
- WAV somente como fonte de edição, nunca em produção;
- JSON apenas com metadados e caminhos — **nunca base64 embutido**;
- `checksum` por entrada, para regerar só o que mudou;
- `marks` temporais por palavra, que é o que sincroniza o destaque.

O manifesto vive em `content/audio/speech-manifest.pt-BR.json` e os arquivos em
`public/audio/pt-BR/`, com cache offline e TTS do navegador apenas como último
recurso quando um arquivo faltar.

### A regra que evita o bug de encaixe

Cada fragmento precisa ser gravado **na entonação da posição que ocupa**. Um
numeral no fim de frase cai; no meio, sustenta. Gravar "3" uma vez só e usá-lo
nas duas posições é o que produz a fala robotizada que se quer evitar.

Portanto o manifesto deve declarar a **posição** de cada fragmento, não apenas seu
texto. É a diferença entre 58 clipes que soam bem e 58 clipes que soam mal.

---

## 4. Ordem recomendada

O áudio **não deve começar agora**. A dependência é dura: cada ficha nova cria
falas novas, e gerar áudio antes do catálogo estabilizar significa regerar a cada
lote. O roteiro por andares já coloca a mídia no Marco 4, depois do núcleo
pedagógico e do conteúdo mínimo — e a conta acima confirma que a ordem está certa.

O que **vale fazer antes**, porque é barato e evita retrabalho:

1. manter `singular`, `plural` e `feminino` obrigatórios em todo objeto novo;
2. não deixar texto solto nos componentes — toda fala nasce da camada narrativa;
3. quando a segunda ficha narrativa aparecer, mover `NOMES` e `OBJETOS` para
   arquivo de conteúdo compartilhado com o futuro manifesto.
