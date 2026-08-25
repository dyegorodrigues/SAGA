# CLASS-009 — a tela declara a resposta que ela mesma pergunta

Data: 2026-08-25  
Fase: **Gate B′** (reparação das saídas CODIGO do Gate B)  
Classe de evidência: `CONFIRMADO-ATUAL`, via **CODIGO**  
Instrumento: `src/curriculum/telaNaoDeclaraResposta.test.tsx`

## 1. Como a classe apareceu

`GAP-054` foi registrado no Gate B como um defeito **individual** de `GM.06/F62`:
o enunciado e o scaffold continham o gabarito. Foi reparado nos commits
`2b26bc2` e `74883c6`.

Ao reparar `N2.07/F66` por outra razão (CLASS-007), a medição da tela mostrou
que `FatoresRetangulosStage` imprimia **todas** as formações retangulares do
total antes de qualquer resposta — em L1–L4 a alternativa correta era legível
dali. Dois defeitos com a mesma forma, em fichas sem relação entre si, não são
dois acidentes: são uma classe. `GAP-054` deixa de ser um caso isolado e passa
a ser a primeira testemunha de CLASS-009.

Aplicando R2 (varrer as 90, não confiar em lista de inclusão), a classe foi
dimensionada por medição, não por leitura.

## 2. O que a varredura faz

Para cada ficha servida pelo Composer, em cada um dos 5 níveis, com 3 sementes
determinísticas de `Math.random`:

1. gera a `Question` real do runtime (`generateRegisteredFichaQuestion`);
2. renderiza pelo front-controller real (`FichaRenderer`);
3. **apaga todos os botões** — sobra o suporte: enunciado visual, régua,
   balança, andaime, legenda;
4. normaliza o texto restante e pergunta se o rótulo da alternativa correta
   ainda está escrito ali.

Se está, a criança **lê** a resposta em vez de resolvê-la.

## 3. Resultado medido

Cobertura: **75 fichas** servidas pelo Composer (as 15 restantes das 90 são
geradores legado, fora do alcance deste instrumento — registrado como limite,
não como aprovação).

Ecoam o rótulo: **21 fichas**. Delas:

### 3.1 Legítimas — 14

O rótulo é o nome de um objeto que a tela precisa nomear para a pergunta
existir. Esconder apagaria a pergunta, não o gabarito.

| Ficha | Por quê |
|---|---|
| AL.02 | a fileira do padrão é o próprio objeto observado |
| AL.03, N7.01, N7.02 | rótulos de marcação da reta numérica |
| GM.02 | os ícones da cena são o objeto da comparação |
| GE.04 | o enunciado nomeia a propriedade testada (rola/empilha) |
| GE.05, GE.08 | o enunciado dita a casa/o par ordenado; a habilidade é localizá-lo |
| GE.10 | as vistas precisam de rótulo A/B/C para poderem ser escolhidas |
| PE.02 | as barras do gráfico precisam de rótulo de categoria |
| PE.04 | os sacos precisam de rótulo A/B |
| N2.06 | "paridade" contém "par" por acaso de substring |
| N4.03 | a contagem saltada é a estratégia ensinada em L1 |
| N4.09 | produtos parciais da decomposição |

### 3.2 Vazamentos confirmados — 7

O suporte **afirma** a resposta que o enunciado pergunta.

| Ficha | Enunciado | O que a tela escreve |
|---|---|---|
| GM.09 / F82 | "2 metros representam quantos centímetros?" | `2 m = 200 cm` |
| GM.10 / F93 | "1 m equivalem a quanto em cm?" | `1 m = 100 cm` e `10 → 100 cm` |
| N4.10 / F69 | "Resolva 84 ÷ 4." | quociente `21` pronto e `21 × 4 + 0 = 84` |
| N5.01 / F45 | "Como chamamos uma destas partes iguais?" | `quarto` |
| N5.02 / F72 | "Qual fração da barra está pintada?" | `1/3` |
| N6.01 / F75 | "Quanto do quadrado inteiro está pintado?" | `4/10 = 0,4` |
| PE.03 / F83 | "Qual fração representa a chance de sair azul?" | `3/5` |

Prevalência dos vazamentos confirmados, entre as servidas pelo Composer:
**7 / 75 = 9,33%**. Somando as testemunhas já reparadas fora deste
instrumento (`GM.06`, `N2.07`), a classe teve **9** membros conhecidos.

## 4. Por que isto importa mais que uma inconveniência

Mastery em SAGA é contada por acerto. Uma tela que escreve a resposta produz
acerto sem aprendizagem, e o motor não tem como distinguir os dois. O efeito
não é "a questão ficou fácil": é que **o dado de domínio passa a ser falso**, e
toda decisão adaptativa construída sobre ele — próximo nível, repetição
espaçada, radar de misconception — decide sobre ficção.

É a mesma razão pela qual CLASS-007 importa: as duas classes atacam a validade
do que o sistema mede sobre a criança.

## 5. Gate, não lista

O instrumento é **fechado por descoberta**. Uma ficha nova que vaze reprova sem
ninguém precisar inscrevê-la — o oposto do padrão que já custou caro três vezes
neste projeto (lista canônica W36, catraca documental de 6 caminhos, allowlist
CLASS-006 de 25). Ver D068.

O registro interno existe só para segurar o estado medido e tem catraca nos
**dois** sentidos:

- ficha que vaza e não está no registro → reprova (regressão nova);
- entrada do registro que parou de vazar → reprova (obrigada a ser removida).

Ou seja: cada reparo desta fila **tem** de encolher o registro. Ele não pode
apodrecer em silêncio.

## 6. Estado

- descoberta: **concluída** para as 75 servidas pelo Composer neste SHA;
- limite conhecido: 15 fichas de gerador legado não são alcançadas pelo
  instrumento — `HIPÓTESE-A-PROVAR`, não aprovação;
- reparadas: `GM.06` (GAP-054), `N2.07`;
- fila aberta: `GM.09`, `GM.10`, `N4.10`, `N5.01`, `N5.02`, `N6.01`, `PE.03`;
- classe reparada **só** quando a fila fechar e o registro contiver apenas
  entradas legítimas.
