# Decisão P15/F50 — massa e capacidade têm nó próprio

**Status:** decisão curricular vigente · agosto/2026  
**Substitui:** a conclusão antiga da P15 que destinava a F50 a `GM.05`.

## Problema encontrado

A F50 (`Cabe mais ou menos?`) ficou presa entre três verdades incompatíveis:

1. a ficha F50 ainda dizia `GM.02 = capacidade e massa`;
2. o grafo vigente reserva `GM.02` para **tempo cotidiano**;
3. a P15 posterior tentou resolver a colisão movendo a F50 para `GM.05`, mas `GM.05` já era, antes dessa decisão, **medidas padronizadas (cm/m, g/kg, mL/L)**.

Portanto, aceitar qualquer um dos dois IDs antigos faria uma competência real desaparecer em silêncio.

## Decisão

Criar o ID estável **`GM.12 — Massa e capacidade: comparação e conservação`**, na faixa F0, com `GM.01` como pré-requisito.

A progressão conceitual passa a ser:

`GM.01 comparação direta visível` → `GM.12 massa/capacidade sem unidades` → `GM.05 medidas padronizadas`

O número `12` não indica posição pedagógica. IDs são estáveis; a ordem da criança vem das arestas do grafo. O precedente já existe em `N1.13`, que fica pedagogicamente no F0 sem renumerar os nós antigos.

`GM.05` passa a depender de `GM.12` e `N2.02`; `GM.01` continua sendo pré-requisito transitivo por meio de `GM.12`.

## Fronteiras cognitivas

- **GM.01:** dimensões diretamente visíveis — alto/baixo, comprido/curto, grande/pequeno — com referência alinhada.
- **GM.12:** atributos que exigem comparação indireta/conservação — pesado/leve e capacidade/volume — sem depender de unidades convencionais.
- **GM.05:** quantificação padronizada — régua, g/kg, mL/L e escolha de unidade.

Isso impede que duas fichas completas de cinco níveis disputem o mesmo estado de maestria e evita a classe já conhecida de erro “duas fichas, uma voz”.

## Primitivas

A F50 deixa de declarar `Balanca + ShapeCanvas` e passa a declarar **`Balanca + Recipientes`**.

`ShapeCanvas` permanece uma família de geometria (F47/F48 e sucessoras), não um canvas genérico para qualquer animação.

`Recipientes` nasce com **dois clientes previstos**, conforme a regra de infraestrutura do projeto:

1. **F50 / GM.12:** comparar e conservar capacidade despejando ambos em um mesmo recipiente de referência, sem escala numérica;
2. **F61 / GM.05:** medir capacidade com recipiente graduado em mL/L quando as unidades padronizadas forem ensinadas.

A `Balanca` visual existente pode ser reaproveitada na física, mas o builder `balanca` atual do Composer resolve equações de equilíbrio. Ele **não** será declarado como F50 pronto até existir contrato/Stage específico de comparação de massa.

## Evidência pedagógica externa

A ordem não foi escolhida para acomodar o código. Currículos oficiais separam a comparação qualitativa inicial do uso posterior de unidades padronizadas:

- UK Department for Education, *National curriculum in England: mathematics programmes of study*: Year 1 compara comprimento, massa e capacidade; Year 2 escolhe e usa unidades padronizadas e instrumentos. https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study
- Australian Curriculum v9, Foundation Mathematics: identifica atributos de massa, capacidade e comprimento e usa estratégias de comparação direta. https://www.australiancurriculum.edu.au/resources/work-samples/mathematics/foundation/ws03-numbers-to-20

Essas fontes confirmam a direção **comparar atributos → conservar/comparar indiretamente → medir com unidade**, sem obrigar o SAGA a copiar a organização escolar de nenhum país.

## Dívida que esta decisão torna visível

Ao retirar a F50 do ID incorreto, `GM.02 — Tempo cotidiano` deixa de parecer coberta. Ele existe no grafo e possui gerador legado, mas **não tem ficha autoral F0 própria**. Essa lacuna deve aparecer nos auditores; não será mascarada com uma ficha falsa.

## Regra de implementação

Este documento corrige primeiro a matriz. O commit curricular pode deixar `GM.12` em fallback/“Em construção”. A implementação da F50 vem em etapa própria e só poderá ser ativada depois de contrato, Radar, microaula, 8 sementes, Chromium e inspeção humana, como nas demais fichas do bloco.
