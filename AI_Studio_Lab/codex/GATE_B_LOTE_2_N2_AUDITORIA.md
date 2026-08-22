# GATE B — LOTE 2 · Mega-auditoria de microprogressão N2

**Data:** 2026-08-19  
**Modo:** AUDIT-ONLY  
**Escopo:** somente domínio `N2` (`N2.01`–`N2.07`)  
**Autoridade:** Issue #47 §3 + Issue #48  
**Estado do Gate B:** ABERTO, **não fechado**  
**Regra:** nenhuma candidata deste documento é dívida confirmada ou autorização de correção.

## 0. Âncora, método e via de resolução

A auditoria foi aberta a partir do HEAD remoto `ad1b239457371a1f411001fd8521984eeadb94fe`, com PR #35 open + draft + unmerged, sem reviews/threads, e `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`.

Foram revalidadas no HEAD, conforme a autoridade específica de cada fonte:

- `curriculum/N2.yaml`;
- `src/curriculum/grafo_saga.ts`;
- fichas TS vivas `N2.01`, `N2.02`, `N2.03`, `N2.06`, `N2.07`;
- `src/curriculum/motores/curriculum.ts`, `composerCanary.ts` e `composerCanaryIds.ts`;
- contratos especializados de N2.01, N2.02, N2.03, N2.06 e N2.07;
- `MaterialDouradoStage`, `Quadrado100Stage` e `ComparacaoSimbolicaStage` quando a semântica de tela precisava ser distinguida da declaração;
- fichas canônicas F37/F38 em `FICHAS_F2_COMPLETAS.md` e F65/F66 em `FICHAS_F3_COMPLETAS.md` para os dois nós ainda servidos pelo legado;
- `src/utils/generatorsF2.ts`, fonte executável atual de N2.04 e N2.05;
- arestas consumidoras relevantes do DAG, inclusive AL.03, GM.05 e N4.11;
- Issue #47 §0.2/§3 e Issue #48.

Documentos históricos foram usados apenas para contexto. Onde uma fonte histórica divergiu do HEAD vivo, ela não foi promovida a verdade atual. Exemplo concreto: o Markdown antigo de F61 dizia exigir N2.04, mas a ficha TS viva GM.05 e o DAG atual exigem `GM.12 + N2.02` e não fazem a antiga conversão cm↔m; portanto isso **não virou gap** neste lote.

### 0.1 Estado e classe dos achados

Todo achado novo deste lote nasce como:

- **Estado na Issue #48:** `CANDIDATA`;
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`.

Mesmo quando a fonte executável torna o fato motivador inequívoco, a decisão “isto deve ser corrigido” permanece separada. O lote audita e classifica; não implementa.

### 0.2 VIA DE RESOLUÇÃO

Além da classe §0.2, cada candidata recebe uma via obrigatória de encerramento:

- **`CODIGO`** — fecha por inspeção/prova de fonte executável, cânone, DAG, geração e mastery. Não exige criança nem Gate G.
- **`SIMULACAO`** — só fecha por campanha do Aprendiz Simulado no Gate G. A via registrada **não autoriza iniciar Gate G** agora.
- **`CRIANCA`** — só fecha por observação de criança real no Gate J. A via registrada **não autoriza iniciar Gate J** agora.

A via indica a evidência mínima de fechamento, não prioridade nem autorização de trabalho.

## 1. Resultado executivo

- competências N2 auditadas: **7/7**;
- candidatas novas: **10** — `GAP-012` a `GAP-021`;
- `HIPÓTESE-A-PROVAR`: **10**;
- demais classes §0.2 como achado novo: **0**;
- via `CODIGO`: **9**;
- via `SIMULACAO`: **1**;
- via `CRIANCA`: **0**;
- correções executadas: **0**.

Proveniência observada, sem reclassificá-la como novo gap:

- N2.01, N2.02, N2.03, N2.06 e N2.07 estão ativos via Composer;
- N2.04 e N2.05 continuam servidos pelo **legado**, parte do resíduo global já classificado como `CONFIRMADO-ATUAL` no fechamento 90/90.

A condição “legado” é fato atual; as **lacunas semânticas** abaixo continuam candidatas até a investigação/decisão correspondente.

## 2. Auditoria competência por competência

### N2.01 — Dezena e unidades

- **Conceito/faixa:** dez unidades formam uma unidade de ordem superior; `F1`.
- **Pré-requisitos:** `N1.09 + N1.11`; a sequência numérica e a estrutura de 10 estão explicitamente ancestrais.
- **CPA/representação:** L1–L3 material dourado manipulável; L4 numeral→material; L5 numeral→D/U sem material.
- **L1–L5 / salto:** 10–19 com moldura → 20–39 com moldura → 10–99 sem moldura → montar do numeral → decompor mentalmente. O palco confirma que L5 realmente retira o material.
- **Diversidade:** geração aleatória nos intervalos de cada degrau; L4/L5 mudam a direção da representação.
- **Transferência:** sustenta N2.02, N2.04, N3.07, N3.09, AL.03 e outras competências de valor posicional.
- **Misconceptions:** `IGNORA_VALOR`, `INVERTE_ORDENS`, `NAO_AGRUPA`.
- **Mastery:** 3/3 × 2 sessões; L4 exige `MONTOU_DO_NUMERAL`, garantindo pelo menos uma evidência bidirecional.
- **Revisão:** responsabilidade do motor global; nenhum conflito N2-específico observado.
- **Dependência motora:** agrupamento por toque/arrasto; o palco aceita clique e a ação conceitual é o próprio agrupamento, não precisão fina.
- **Onboarding/resolução:** tutorial explícito na estreia da troca; palco materializa 10 cubos→barra.
- **Dojo/Jardim:** sem trilha Jardim própria; RT L5 é observacional, não mastery.
- **Resultado:** nenhuma CANDIDATA nova neste lote.

### N2.02 — Números até 100

- **Conceito/faixa:** contrato YAML vivo declara **ler, escrever, ordenar e localizar** números até 100; `F1`.
- **Pré-requisito:** N2.01.
- **CPA/representação viva:** Quadrado100 especializado.
- **L1–L5:** +1 horizontal → +10 vertical → +5 → vizinhos ±1/±10 → cinco lacunas espalhadas.
- **Diversidade:** L1/L2/L3 randomizam início; L4 randomiza entre quatro direções válidas; L5 randomiza cinco casas 12–89 e muda a ordem de busca.
- **Transferência:** N2.03, N2.04, GM.05 e PE.02; também compartilha linguagem de saltos com AL.03.
- **Misconceptions:** direção, padrão de dezena, insistência em contar um a um.
- **Mastery:** 3/3 × 2; L2 exige percurso vertical, mas L4 não exige amostragem das quatro direções.
- **Motor/onboarding/resolução:** Quadrado100 estreia com tutorial explícito; Stage verbaliza o alvo atual das lacunas e separa erro de percurso do toque válido.
- **Dojo/Jardim:** sem trilha própria.
- **Resultado:** **GAP-012, GAP-013 e GAP-014**.

### N2.03 — Comparação simbólica (> < =)

- **Conceito/faixa:** quantidade → numeral → símbolo relacional; `F1`.
- **Pré-requisitos:** `N2.02 + N1.05`.
- **CPA/representação:** L1 grupo↔grupo; L2 grupo↔numeral; L3 numeral até 20; L4 numeral até 100; L5 expressões com parcela compartilhada.
- **L1–L5 / salto:** o andaime do jacaré é retirado progressivamente; L5 foi deliberadamente construído para não virar teste oculto de adição.
- **Diversidade:** o builder sorteia relação `>`, `<` ou `=` por item.
- **Transferência:** N3.03, AL.05 e N2.06.
- **Misconceptions:** `INVERTE_SIMBOLO`, `IGNORA_DIFERENCA`, `NAO_COMPARA_SIMBOLO`.
- **Mastery:** 3/3 × 2; L3–L5 exigem evidência simbólica sem objetos, mas nenhuma regra exige que as três relações apareçam na janela que concede mastery.
- **Onboarding/resolução:** embora não exista `tutorial` declarativo, o `audioPrompt` ensina explicitamente “boca aberta para o maior”, o palco apresenta o jacaré e os botões têm rótulo acessível. Não foi aberta hipótese de microtutorial sem evidência de insuficiência.
- **Relação com Lote 1:** a ausência de igualdade concreta em N1.05 já está estacionada em **GAP-003**; não duplicar o mesmo problema como novo gap N2.
- **Resultado:** **GAP-015**.

### N2.04 — Centena e números até 1000

- **Conceito/faixa:** dez dezenas viram uma centena; `F2`.
- **Pré-requisitos:** `N2.02 + N2.01`.
- **Fonte autoral:** F37 descreve MaterialDourado + Quadrado100 e uma escada 199 → 500 → 999 → numeral→material → decomposição mental.
- **Proveniência viva:** **legado** `gN2_04`; não existe ficha TS N2.04 registrada/ativa no Composer.
- **Runtime legado:** L1/L2 perguntam somente quantas unidades há em `c` centenas; L3/L4/L5 usam a mesma família `c centenas + d dezenas + u unidades → numeral`.
- **CPA/representação viva:** `plain` com `big: "base10"`; a troca física “10 dezenas → 1 centena” não é executada.
- **Diversidade:** nos casos C/D/U, `c`, `d` e `u` são sorteados de 1 a 9; dezenas/unidades internas iguais a zero nunca aparecem nessa família.
- **Transferência:** N2.05, N4.08, N4.12, N6.01 e GM.10 dependem de N2.04.
- **Misconceptions canônicas:** valor posicional, inversão de ordens, não agrupar dezenas; o legado não materializa a cadeia causal descrita pela ficha.
- **Mastery:** o gerador legado não expressa as exigências semânticas distintas dos cinco degraus canônicos.
- **Resultado:** **GAP-016 e GAP-017**.

### N2.05 — Números grandes e arredondamento

- **Conceito/faixa:** ler números grandes e arredondar com critério; `F3`.
- **Pré-requisito:** N2.04.
- **Contrato YAML:** `objective` está vazio; os kinds declaram `plain`, `order`, `build-number`, `numberline`.
- **Fonte autoral F65:** L1 dezena → L2 centena → L3 milhar → L4 escolher precisão → L5 estimar operação; NumberLine torna distância explícita.
- **Proveniência viva:** **legado** `gN2_05`; não existe ficha TS N2.05 registrada/ativa no Composer.
- **Runtime legado:** o parâmetro `lvl` não altera a tarefa. Todos os níveis arredondam apenas números de duas casas para a dezena mais próxima, aproximadamente 11–99, em `plain`.
- **CPA/representação viva:** a reta numérica e a distância até marcas vizinhas não aparecem; também não há centena, milhar, escolha de precisão ou estimativa de operação.
- **Mastery/progressão:** a escada L1–L5 canônica não é observável na fonte executável atual.
- **Transferência:** é nó terminal do strand N2 no DAG atual; seu valor de transferência é senso numérico/estimativa transversal, não uma aresta N2 posterior.
- **Resultado:** **GAP-018**.

### N2.06 — Pares e ímpares

- **Conceito/faixa:** paridade como formação de duplas e sobra; `F2`.
- **Pré-requisito:** N2.03; N1.01 está no ancestral transitivo via N2.01/N1.09/N1.04, portanto não foi inventada uma aresta faltante para pareamento.
- **CPA/representação:** duplas concretas → decisão visual → regra do último algarismo → paridade de soma.
- **L1–L5 declarados:** até 10 → até 20 → visual → último algarismo → soma.
- **Runtime especializado:** os cinco specs são **determinísticos**: L1=8, L2=15, L3=0, L4=47, L5=`8+6`.
- **Diversidade:** inexistente dentro do nível. L3 “decidir visual” só observa zero; L5 só observa par+par→par, sem ímpar+ímpar ou par+ímpar.
- **Misconceptions:** tamanho, zero ímpar, decorar sem entender.
- **Mastery:** 3/3 × 2 sessões pode repetir exatamente o mesmo estímulo em todas as tentativas do nível.
- **Onboarding/resolução:** tutorial explícito no L1; resolução declarativa reconstrói duplas/sobra e explica zero.
- **Transferência:** alimenta N2.07.
- **Resultado:** **GAP-019**.

### N2.07 — Fatores / Fábrica de Retângulos

- **Conceito:** fatores como todas as formações retangulares completas de um total.
- **Faixa:** **divergência atual**: grafo + F66 Markdown = `F3`; ficha TS N2.07 = `F2`.
- **Pré-requisitos:** `N4.02 + N2.06`; arranjo retangular e paridade estão explícitos.
- **CPA/representação:** ArrayGrid; pares com dica → todos os pares → lista → primo → maior fator comum.
- **Runtime especializado:** specs **determinísticos**: L1=12, L2=24, L3=18, L4=13, L5=MDC(18,24).
- **Diversidade:** inexistente dentro do nível; mastery pode memorizar o mesmo conjunto de fatores/mesma resposta.
- **Misconceptions:** esquecer 1/n, parar cedo, confundir fator/múltiplo.
- **Mastery:** 3/3 × 2 sessões, sem variação de total por nível.
- **Onboarding/resolução:** tutorial em L1/L2; resolução mostra tentativa com sobra, varredura completa, triviais, primo e comuns.
- **Transferência/redundância:** F66 introduz primo como consequência do único retângulo; N4.11 depois formaliza múltiplos/divisores/primos e Crivo. Há sobreposição, mas as fontes atuais mostram aprofundamento distinto; não foi classificada como gap de redundância neste lote.
- **Resultado:** **GAP-020 e GAP-021**.

## 3. Registro das candidatas N2

### GAP-012 — N2.02 não exige produção/escrita de numeral prometida pelo contrato do nó

- **Estado:** `CANDIDATA`
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`
- **Via de resolução:** `CODIGO`
- **Tipos:** `MICRONÍVEL-AUSENTE`, `REPRESENTAÇÃO-AUSENTE`
- **Fato observado:** `curriculum/N2.yaml` declara “ler, escrever, ordenar e localizar números até 100”. A ficha/runtime F36 navega, continua padrões, encontra vizinhos e localiza lacunas no Quadrado100, mas não há micro que exija a criança **produzir/escrever** o numeral.
- **Como fechar:** mapear “escrever” para uma evidência executável atual ou registrar autoridade que redistribua/remova essa obrigação. Se não houver, provar a ausência por inventário de builders/renderers.
- **Não fazer agora:** criar teclado, escrita ou micro nova.

### GAP-013 — N2.02 L4 pode conceder mastery sem cobrir as quatro direções de vizinhança

- **Estado:** `CANDIDATA`
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`
- **Via:** `CODIGO`
- **Tipo:** `VARIEDADE-DE-MASTERY`
- **Fato:** L4 promete `+1, -1, +10, -10`, mas `specVizinho` sorteia um vizinho válido por item e a regra é 3/3 × 2 sem evidência por direção.
- **Como fechar:** enumerar a janela real de mastery e provar requisito mínimo por família/direção, ou provar por contrato que amostragem probabilística é deliberadamente suficiente.

### GAP-014 — N2.02 introduz contagem de 5 em 5 em paralelo a AL.03, sem relação explícita entre os nós

- **Estado:** `CANDIDATA`
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`
- **Via:** `SIMULACAO`
- **Tipos:** `PRÉ-REQUISITO-IMPLÍCITO`, `TRANSFERÊNCIA-AUSENTE`, `REDUNDÂNCIA`
- **Fato estrutural:** N2.02 L3 cobra sequência `+5`; AL.03 é a competência canônica “Contagem por saltos (2,5,10)”. Ambos podem abrir a partir de ancestrais próximos sem uma aresta AL.03↔N2.02.
- **Por que não fecha só lendo código:** a fonte prova a sobreposição e a possibilidade de ordem, mas não decide se o Quadrado100 funciona como **introdução contextual deliberada** ou se uma trajetória real/sintética fica presa porque o salto foi cobrado antes de instalado.
- **Como fechar:** Gate G deve simular trajetórias em que N2.02 chega antes/depois de AL.03 e verificar progressão, retries, rescue e mastery; então aceitar a costura ou propor aresta/redistribuição.
- **Governança:** isto **não inicia Gate G** neste lote.

### GAP-015 — N2.03 pode dominar comparação simbólica sem amostrar `>`, `<` e `=`

- **Estado:** `CANDIDATA`
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`
- **Via:** `CODIGO`
- **Tipo:** `VARIEDADE-DE-MASTERY`
- **Fato:** `parComRelacao()` sorteia uma das três relações por questão. O mastery 3/3 × 2 e a evidência “sem objetos” não exigem presença de cada relação. Igualdade é semanticamente distinta e pode ficar ausente da janela.
- **Como fechar:** provar cobertura mínima por relação na janela real de mastery ou registrar uma regra de amostragem/evidência que a garanta.
- **Relação com N1:** GAP-003 continua separado, pois pergunta se igualdade quantitativa foi instalada concretamente; GAP-015 pergunta se o próprio nó simbólico amostra as três relações antes de dominar.

### GAP-016 — N2.04 legado colapsa a escada canônica e não realiza “10 dezenas → 1 centena”

- **Estado:** `CANDIDATA`
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`
- **Via:** `CODIGO`
- **Tipos:** `CONCEITO-AUSENTE`, `MICRONÍVEL-AUSENTE`, `REPRESENTAÇÃO-AUSENTE`, `PONTE-CPA-AUSENTE`
- **Fato:** F37 prevê MaterialDourado/Quadrado100 e cinco degraus distintos. `gN2_04` serve L1/L2 como conversão verbal de centenas para unidades e L3–L5 como a mesma composição C/D/U→numeral; não executa a troca de dez dezenas por uma centena nem distingue L4/L5.
- **Como fechar:** inventário executável completo do legado e da ficha canônica; decidir se existe outra rota viva que realize cada degrau ou se a divergência é real.
- **Não fazer agora:** migrar N2.04 para Composer.

### GAP-017 — N2.04 legado exclui zero interno nos casos C/D/U

- **Estado:** `CANDIDATA`
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`
- **Via:** `CODIGO`
- **Tipo:** `VARIEDADE-DE-MASTERY`
- **Fato:** em `gN2_04`, `c`, `d` e `u` são sorteados de 1 a 9 nos itens de três ordens. Casos como 304, 570 ou 901 não entram nessa família, embora zero posicional seja um caso diagnóstico central de valor de lugar.
- **Como fechar:** enumerar o suporte do gerador e qualquer outra rota que pratique zeros internos antes do domínio; não inferir cobertura de outro nó sem prova.

### GAP-018 — N2.05 ignora `lvl` e serve somente arredondamento à dezena em números de duas casas

- **Estado:** `CANDIDATA`
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`
- **Via:** `CODIGO`
- **Tipos:** `CONCEITO-AUSENTE`, `MICRONÍVEL-AUSENTE`, `REPRESENTAÇÃO-AUSENTE`, `VARIEDADE-DE-MASTERY`
- **Fato:** F65 define dezena → centena → milhar → escolha de precisão → estimativa de operação em NumberLine. O `gN2_05(lvl)` atual não usa `lvl` para variar a tarefa e sempre arredonda aproximadamente 11–99 para a dezena mais próxima em `plain`. O `objective` de N2.05 no YAML também está vazio.
- **Como fechar:** provar por fonte se alguma outra rota executável cobre os degraus F65 antes do domínio; caso contrário, registrar a divergência como provada em lote de resolução.
- **Não fazer agora:** substituir o legado.

### GAP-019 — N2.06 mastery repete um único caso fixo por nível

- **Estado:** `CANDIDATA`
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`
- **Via:** `CODIGO`
- **Tipo:** `VARIEDADE-DE-MASTERY`
- **Fato:** specs atuais são L1=8, L2=15, L3=0, L4=47, L5=`8+6`. A regra 3/3 × 2 pode mostrar o mesmo estímulo em todas as tentativas; L3 não testa paridade visual de nenhum não-zero e L5 só testa par+par.
- **Como fechar:** provar variação em outra camada anterior à pergunta ou, se não existir, provar o suporte efetivo do gerador e a janela de mastery.

### GAP-020 — N2.07 mastery repete um único total/problema por nível

- **Estado:** `CANDIDATA`
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`
- **Via:** `CODIGO`
- **Tipo:** `VARIEDADE-DE-MASTERY`
- **Fato:** F66 usa sempre 12, 24, 18, 13 e o par 18/24 nos L1–L5. A criança pode satisfazer 3/3 × 2 repetindo as mesmas listas/decisões.
- **Como fechar:** inventariar qualquer randomização externa ou confirmar que o builder é o suporte completo; verificar se mastery exige generalização para outro total.

### GAP-021 — faixa de N2.07 diverge entre ficha TS e autoridades de grafo/ficha canônica

- **Estado:** `CANDIDATA`
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`
- **Via:** `CODIGO`
- **Tipos:** `IDADE/LINGUAGEM`, `OUTRO` — divergência de autoridade de faixa
- **Fato:** `src/curriculum/fichas/jornada/N2.07.ts` declara `faixa: "F2"`; `src/curriculum/grafo_saga.ts` declara N2.07 `F3`; F66 está no bloco F3 e se identifica como F3. O runtime constrói módulos pela faixa do grafo, portanto a divergência da ficha não deve ser “corrigida por intuição”.
- **Como fechar:** localizar todos os consumidores de `ficha.faixa` versus `grafo.faixa`, declarar a autoridade e reconciliar somente em lote de resolução.

## 4. Os 13 padrões de falha da Issue #47 §3 — resultado no lote N2

1. **Conceito intermediário ausente:** candidato em N2.04/N2.05 por divergência legado↔escada autoral.
2. **Salto grande entre níveis:** materializado principalmente como colapso de níveis em N2.04/N2.05, não como salto de uma ficha Composer coerente.
3. **Subconjunto relevante nunca praticado:** N2.04 zeros internos; N2.06 famílias; N2.07 totais; N2.03 relações não garantidas.
4. **Representação entra tarde/sem ponte:** N2.04/N2.05 legado deixam de realizar representações canônicas.
5. **Pré-requisito implícito ausente do DAG:** hipótese longitudinal N2.02↔AL.03, estacionada para SIMULACAO.
6. **Transferência entre competências nunca exercitada:** mesma costura N2.02↔AL.03 precisa campanha; N2.03 recebe risco já registrado em GAP-003.
7. **Mastery com variedade insuficiente:** GAP-013, 015, 017, 019, 020 e o colapso de N2.05.
8. **Conteúdo explicado mas nunca exigido:** nenhuma nova candidata separada além das divergências legado já capturadas.
9. **Conteúdo deveria ser micro e não ficha:** nenhum caso novo demonstrado.
10. **Redundância mascara buraco:** sobreposição F66↔F70 foi revisada e não classificada; N2.02↔AL.03 segue hipótese longitudinal.
11. **Dificuldade motora desnecessária:** nenhuma nova candidata; N2.01/N2.02 têm interações coerentes e N2.06/N2.07 possuem resolução/alternativas compatíveis.
12. **Nova ferramenta sem microtutorial:** nenhuma candidata nova; MaterialDourado, Quadrado100, duplas e retângulos têm onboarding; N2.03 possui regra falada/andaime suficiente para não presumir falha sem evidência.
13. **Ficha↔runtime legitimada só por história:** GAP-016/GAP-018 registram divergências atuais dos legados; nenhuma foi aceita por história.

## 5. Achados deliberadamente NÃO abertos

### GM.05 não exige mais N2.04 no HEAD vivo

O Markdown F61 antigo diz que medir até 100/converter cm↔m exige centena. A ficha TS atual GM.05 e o DAG exigem `GM.12 + N2.02`; a ficha viva mede em régua e estima, sem aquela conversão. Tratar o texto antigo como estado atual seria violar §0.2. **Sem gap.**

### N2.03 não ganhou uma candidata de “jacaré sem tutorial”

Não existe `tutorial` declarativo na micro, mas o contrato fala a regra em áudio, o `howto` a repete e o palco oferece andaime do jacaré + rótulos acessíveis dos símbolos. Só a ausência da chave `tutorial` não prova falta de onboarding. **Sem gap.**

### F66 ↔ N4.11 não foi chamado de redundância nociva

F66 deriva fatores por retângulos e usa primo como caso-limite; N4.11 adiciona múltiplos, distinção divisor↔múltiplo e Crivo. Existe sobreposição, mas também aprofundamento observável. Sem prova de que a repetição mascara buraco, **não abrir candidata**.

## 6. Relação com o Lote 1

Os 10 gaps N1 permanecem `CANDIDATA` + `HIPÓTESE-A-PROVAR` no SHA `ad1b239…`.

A classificação retroativa de via foi registrada na Issue #48 sem alterar esse SHA ou os estados:

- `CODIGO`: GAP-002, 003, 004, 007, 008, 010, 011 — **7**;
- `CRIANCA`: GAP-005, 006, 009 — **3**;
- `SIMULACAO`: **0**.

Nenhuma dessas investigações foi iniciada no Lote 2.

## 7. Contagem consolidada do Lote 2

### Por classe §0.2

| Classe | Achados novos N2 |
|---|---:|
| `HIPÓTESE-A-PROVAR` | **10** |
| `CONFIRMADO-ATUAL` | 0 |
| `DÍVIDA-REGISTRADA` | 0 |
| `HISTÓRICO-A-REVALIDAR` | 0 |
| `FECHADO-COM-RECIBO` | 0 |
| `FORA-DE-ESCOPO` | 0 |

### Por via de resolução

| Via | Achados N2 | IDs |
|---|---:|---|
| `CODIGO` | **9** | GAP-012, 013, 015, 016, 017, 018, 019, 020, 021 |
| `SIMULACAO` | **1** | GAP-014 |
| `CRIANCA` | **0** | — |

## 8. Governança e parada

Este lote não alterou nem autorizou alteração em:

- runtime;
- Coverage Matrix/ledger;
- canário;
- DAG/grafo;
- fichas curriculares;
- builders/procedimentos;
- motores adaptativos;
- Gates C–J;
- Creature Engine/Tamagotchi.

Após materializar este documento, atualizar somente a porta/índice documental do Gate B e registrar as candidatas na Issue #48, o **mesmo SHA** precisa obter:

1. CI `completed/success`;
2. Certificação transversal `completed/success`, 9/9.

Depois: conferir PR #35 + `main`, reportar por classe/via, propor **Gate B · Lote 3 — N3**, **não iniciar N3** e parar.
