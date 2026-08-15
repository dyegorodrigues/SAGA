# Design do SAGA — estado medido e decisões pendentes

> **Para que serve.** O design do app foi discutido em conversas que não
> sobrevivem. Este arquivo existe para que a próxima sessão — humana ou agente —
> saiba o que **já foi decidido**, o que **existe e apodreceu**, e o que ainda
> **depende de uma escolha do dono do projeto**. Medido no HEAD `1806c731`.

---

## 1. O que JÁ FOI DECIDIDO e está vivo — não reabrir

### Cor por operação aritmética — `src/styles/coresDeOperacao.ts`

Decidido pelo dono do projeto em 05/08/2026 (`9b256cd`), sobre a medição de
`6247da0`. **Está em produção e protegido por teste.**

| Operação | Cor | Contraste no branco |
|---|---|---|
| adição | `#2563EB` azul | 5,17:1 |
| subtração | `#C2410C` laranja | 5,18:1 |
| multiplicação | `#7E22CE` roxo | 6,98:1 |
| divisão | `#0F766E` verde-petróleo | 5,47:1 |

A regra que sustenta isso: **a cor nunca carrega o significado sozinha** — ela
sempre acompanha o símbolo (`+`, `−`, `×`, `÷`), porque daltonismo em meninos é
cerca de 1 em 12. O símbolo é a informação; a cor é o reforço que chega mais
rápido.

Vermelho ficou de fora de propósito: é cor de erro no SAGA, e uma operação
vermelha ensinaria que subtrair é errado.

`src/styles/coresDeOperacao.test.ts` protege tudo isso: símbolo presente,
símbolos distintos, verbo falado, contraste WCAG, distinção sob daltonismo,
nenhuma operação vermelha, e nenhuma colisão com as cores de feedback.

Usado hoje em `InteractiveVertical`, `TrianguloDeFatos`, `DeslocamentoStage` e
`AreaStage`.

**Este é o padrão de como uma decisão de design deve viver neste projeto:
escolhida por um humano, medida, documentada com o porquê, e travada por teste.**

---

## 2. O que EXISTE e apodreceu — precisa de conserto

### Cor por trilha (ilha) — `ISLAND_INFO` em `src/curriculum/motores/curriculum.ts`

A intenção é boa: cada trilha do mapa tem sua cor, e a criança se orienta por
ela. Mas a paleta foi desenhada para ~6 ilhas e hoje há **11 trilhas**. As que
sobraram foram encaixadas em cores já ocupadas:

| Trilha | Cor | Situação |
|---|---|---|
| N1 números | `C.pink` | |
| N2 dezenas | `C.ocean` | |
| N3 adição/subtração | `C.mint` | |
| N4 multiplicação/divisão | `C.grape` | |
| N5 frações | `C.melon` | |
| N6 decimais | `C.sun` | |
| **N7 inteiros** | `C.pink` | **colide com N1** |
| **AL álgebra** | `C.sun` | **colide com N6** |
| **GE geometria** | `C.melon` | **colide com N5** |
| **GM medidas** | `"#2E8B57"` | **cor solta, fora da paleta `C`** |
| **PE probabilidade** | `C.ocean` | **colide com N2** |

Quatro colisões e uma cor escrita na mão. O mapa promete "cada ilha tem sua
cor" e entrega quatro pares de gêmeas.

**Decisão pendente:** estender a paleta `C` para 11 tons distintos, ou aceitar
que trilhas irmãs compartilhem cor de propósito (N1/N7 são ambas "números na
reta"; N5/GE não têm parentesco). Não é decisão de agente — é do dono.

### O sistema de tokens está instalado e sem fio — `src/styles/tokens.ts`

Bem desenhado: nomeia por função (`acao.primaria`, `feedback.acerto`,
`superficie.cartao`) e usa `var(--token, emergência)`, que permite trocar a
identidade inteira do app editando um arquivo.

Só que **nenhuma variável `--cor-*` é definida em lugar nenhum**. O app roda
100% nos valores de emergência. O interruptor do tema está na parede, sem fio.

Adoção: **22 dos 187 componentes**.

---

## 3. O que foi medido — a conta que motivou o portão

Varredura de 15/08/2026 sobre `src/`:

- **2.028 cores literais** escritas na mão, em **95 arquivos**;
- **250 cores distintas**, que viram **123 grupos** quando se junta o que o
  olho não distingue (distância RGB < 26);
- **54 grupos** cobrem 90% dos usos; **24 grupos** cobrem 70%;
- **o branco tem 36 variantes**; o cinza-azulado de bordas, 18;
- **49 grupos aparecem 3 vezes ou menos** no app inteiro — 4,5% do total.

As 12 cores mais usadas encaixam exatamente nos papéis que o `tokens.ts` já
define. **A paleta real já existe; falta dar nome a ela.**

Maior concentração de cor solta: `components/primitives` — a régua, a reta
numérica, o material dourado, a balança. É onde a criança encosta o dedo.

### Portão instalado

`src/styles/coresLiterais.test.ts` é uma catraca: cada arquivo tem um teto de
cores literais e **o teto só desce**. Impede cor nova, exige registrar melhora
(`npm run cores:baseline`), e foi verificado por mutação nos três sentidos.

O débito parou de crescer. Migrar é mecânico e sem risco pedagógico.

---

## 4. Decisões que esperam o dono do projeto

1. **Dois pretos.** O app usa `#1e293b` (351 usos) e `#111827` (49 usos).
   Escolher um.
2. **Paleta das 11 trilhas** — estender, ou assumir compartilhamento entre
   trilhas irmãs.
3. **Tipografia.** Hoje `Fredoka` (display) e `Nunito` (texto), carregadas do
   Google Fonts **por rede externa** — já derrubou uma sonda de CI e impede o
   app de abrir bonito offline. Hospedar localmente é dívida conhecida.
4. **O ponto ótimo de idade.** Ver §5.

---

## 5. A faixa etária é a restrição de design mais difícil

O SAGA atende **4 a 12 anos** — da pré-escola ao 6º ano. É uma distância
enorme: o que encanta aos 5 humilha aos 11.

O erro comum é resolver isso com "infantil médio", que não serve a ninguém. A
saída melhor, e que este projeto já pratica sem ter nomeado:

- **O que muda com a idade é o conteúdo e a densidade, não a linguagem
  visual.** A mesma régua, a mesma reta numérica, o mesmo material dourado —
  o que muda é o quanto se pede.
- **Alvos de toque generosos são acessibilidade, não infantilidade.** O mínimo
  de 48 px já praticado na F59 serve tanto ao dedo de 5 anos quanto ao de 12.
- **Nada que sinalize "bebê" para quem tem 11.** Sem baby talk, sem
  diminutivo, sem excesso de arco-íris. Cores saturadas e formas claras não
  são infantis — são legíveis.
- **A recompensa cresce com a idade.** Aos 5 a recompensa é a animação; aos 11
  é o progresso visível e o domínio. O mesmo sistema, lido de dois jeitos.
- **Contraste real, não estético.** Criança usa o app em ônibus, no sol, em
  tela barata.

O que **não** fazer, e que é a assinatura visível de interface gerada por
máquina: degradê roxo-azul em tudo, cantos arredondados em cinco raios
diferentes na mesma tela, emoji fazendo papel de ícone, sombra em todo
elemento, e cor demais. Slop não é feiura — é ausência de decisão, e o olho
percebe antes de saber nomear.

---

## 6. Ordem recomendada

1. **Feito.** Catraca de cores literais — o débito parou de crescer.
2. **Mecânico.** Migrar `components/primitives` primeiro: é a maior
   concentração e é onde mora a identidade visual real do SAGA.
3. **Ligar o fio.** Definir as `--cor-*` num arquivo de tema. A partir daí,
   mudar a cara do app é editar um lugar só.
4. **Só então** discutir estética — com a paleta visível e comparável, em vez
   de no escuro.

Nada disso está no caminho crítico da fábrica curricular, e nada disso deve
interromper uma onda em andamento.
