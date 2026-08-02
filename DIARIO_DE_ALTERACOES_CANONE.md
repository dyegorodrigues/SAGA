# 📓 DIÁRIO DE ALTERAÇÕES DO CÂNONE — v3.1 e v3.2
**1º de agosto de 2026 · o que mudou, onde, por quê, e o que o código tem de fazer a respeito**

> **Para o Codex.** Este documento é o registro completo da edição do cânone feita antes desta
> retomada. Ele existe para que nenhuma alteração seja descoberta por acidente no meio de uma
> implementação. Leia junto com o `PACOTE_DE_RECONCILIACAO_SAGA.md`, que explica a **decisão**;
> este aqui explica a **execução**.
>
> Regra de leitura: onde este diário e um documento canônico divergirem, **o documento canônico
> vence** — este é registro, não fonte.

---

# 0. RESUMO EM 10 LINHAS

| | Antes | Depois |
|---|---|---|
| Competências no grafo | 88 (mas os documentos diziam 84 e 95) | **88**, declarado igual em todos |
| Trilhas de fluência | 13 | 13 *(inalterado)* |
| Fichas | 90 | **92** (JD2 e JD3 escritas) |
| Bíblia | v3.0, com a §13 sem cabeçalho | **v3.1**, 15 seções íntegras |
| Grafo | v1.0, dizia "84" e "95" | **v1.2**, diz 88, com registro das rejeições |
| Dojo | v1.2 | **v1.3** |
| Manual | v2.1 | **v2.3** |
| Método, Arquitetura Cognitiva | 88 comp. / 90 fichas | 88 comp. / **92 fichas** |
| Blocos de fichas | sem adendo | **adendo normativo v3.1** em todos os 5 |

**Nenhuma competência foi criada. Nenhuma competência foi removida do cânone. Nenhuma ficha foi
apagada.** O grafo canônico já era 88; o que mudou foi a prosa que o descrevia errado, mais duas
fichas que faltavam e cinco correções pedagógicas.

---

# 1. A CORREÇÃO DE CONTAGEM — 84 / 95 → **88**

## 1.1 O que estava errado

O grafo executável sempre teve 88 nós. Mas:

| Documento | Dizia | Onde |
|---|---|---|
| `BIBLIA_SAGA.md` | "84 competências" | §4, §10.11 (catálogo), §12.7, §12.8, §13.1 — **5 lugares** |
| `BIBLIA_SAGA.md` | "ampliado de 84 para 95" | changelog v2.7 |
| `GRAFO_DE_CONHECIMENTO_SAGA.md` | "Total: 84 competências" | mapa, linha 56 |
| `GRAFO_DE_CONHECIMENTO_SAGA.md` | "passa de 84 para 95 nós" | changelog v1.1, linha 694 |
| `MANUAL_DIDATICO_SAGA.md` | "nenhuma das 84 competências" | fecho, linha 883 |
| `METODO_SAGA.md` | 88 ✅ | — |
| `ARQUITETURA_COGNITIVA_SAGA.md` | 88 ✅ | — |

Três números diferentes para a mesma coisa. Uma IA de autoria que lesse a Bíblia (84) e o Grafo (95)
não tinha como saber qual era a verdade — e o repositório acabou implementando 95.

## 1.2 A causa-raiz

O changelog da v2.7 anunciou **11 competências novas**. Auditando o grafo canônico uma por uma:

**Absorvidas (4) — existem no cânone:**
`N2.06` Pares e ímpares · `N2.07` Fatores · `GM.10` Conversão de unidades · `GM.11` Volume de prismas

**Rejeitadas (7) — não existem no cânone, e não devem existir:**

| Rejeitada | Duplicava | Evidência |
|---|---|---|
| `N2.08` Múltiplos | `N4.11` múltiplos, divisores e primos | a ficha F70 já cobre múltiplos, divisores e o crivo de Eratóstenes |
| `N5.06` Somar frações (mesmo denom.) | `N5.04` adição e subtração de frações | mesmo pré-requisito, cobre **menos** |
| `N5.07` Frações equivalentes | `N5.03` equivalência e comparação de frações | mesmo pré-requisito (`N5.02`), mesmo conceito |
| `N5.08` Comparar frações | `N5.03` | o nome de N5.03 já contém "comparação" |
| `N7.03` Razão e proporção | `N6.04` razão e proporcionalidade | duplicata literal |
| `N7.04` Porcentagem | `N6.03` porcentagem | **nome idêntico**, e tinha `N6.03` como pré-requisito — o grafo dizia que Porcentagem exige Porcentagem |
| `PE.05` Probabilidade e chance | `PE.03` + `PE.04` | sobreposição total |

**84 + 4 = 88.** A rejeição aconteceu, mas nunca foi registrada em lugar nenhum — por isso o número
"95" continuou circulando e virou código.

## 1.3 O que foi feito

- Os 5 "84" da Bíblia → **88**
- O changelog v2.7 da Bíblia ganhou anotação explícita da rejeição *(o changelog histórico v1.0 foi
  mantido intacto — registro histórico não se reescreve)*
- Grafo linhas 56 e 694 corrigidas, com tabela das 7 rejeitadas e o nó que já cobria cada uma
- Manual linha 883 corrigida
- Nova **§15.8 da Bíblia** com o registro permanente e o teste executável

## 1.4 ⚠️ Convenção nova que o auditor PRECISA respeitar

Escrever a nota de retificação criou um problema circular: a nota **cita os 7 IDs rejeitados**, e um
parser ingênuo voltava a contar 95 no `GRAFO_DE_CONHECIMENTO_SAGA.md`. Eu bati nisso na primeira
tentativa e corrigi.

**A convenção, agora canônica (§15.8):**

```html
<!-- IDS_REJEITADOS_INICIO · NÃO SÃO NÓS DESTE GRAFO · excluir da contagem automática (§15.8) -->
... tabela com ~~N5.07~~ etc ...
<!-- IDS_REJEITADOS_FIM -->
```

Todo ID citado fora de uma linha de declaração de nó fica **dentro do marcador** ou escrito com
tachado (`~~N5.07~~`). O `catalog_auditor.cjs` tem de aplicar as duas exclusões antes de contar.

**Verificação executada:** com a convenção aplicada, `GRAFO.md` = 88 IDs = `grafo_saga.txt` = 88 IDs,
diferença zero nos dois sentidos.

---

# 2. A §13 RECUPERADA

**Sintoma:** a Bíblia v3.0 pulava de `## §12` para `## §14`. As subseções `### 13.1` e `### 13.2`
existiam soltas, e dois trechos do texto (§7 sobre a Mão Fantasma, §10 sobre a auditoria da home)
referenciavam "§13" apontando para o vazio.

**Causa:** o cabeçalho `## §13. DIAGNÓSTICO DO ESTADO ATUAL E PLANO DE MIGRAÇÃO` foi perdido na
edição de v2.7 para v3.0. Confirmei comparando com a v2.7 que está no repositório
(`Upload_docs/BIBLIA_SAGA.md`), onde o cabeçalho existe.

**Correção:** cabeçalho restaurado com o texto exato da v2.7. A Bíblia v3.1 tem **as 15 seções, §1 a
§15, nenhuma faltando** — verificado por parser.

---

# 3. AS CINCO CORREÇÕES PEDAGÓGICAS

Vieram das auditorias externas de agosto. Foram as **únicas** que eu endossei — a justificativa de
cada recusa está no §6 deste documento e no `PACOTE_DE_RECONCILIACAO_SAGA.md`.

## 3.1 §5.1-bis — O relógio é silencioso na Jornada

**Problema:** a Bíblia §5 dizia que domínio exige "rt dentro da meta", e a ficha F14 exigia
literalmente *"tempo de resposta abaixo de 8 segundos"*. Isso contradiz o `DOJO_SAGA` ("sem
cronômetro visível antes dos 7 anos") e o princípio §11.5 ("idade nunca trava"). Uma criança pode
usar counting on corretamente e ser lenta por ansiedade, processamento, escuta do áudio ou
temperamento reflexivo — nada disso é falta de compreensão.

**Regra nova:** o `rt` é medido em **toda** resposta, mas na Jornada alimenta **apenas a dimensão
*fluência*** do domínio multidimensional. Nunca bloqueia subida de nível, nunca bloqueia abertura de
competência, nunca vira cronômetro visível, nunca conta como erro.

| Onde | Relógio | Cronômetro visível |
|---|---|---|
| Jornada (Academia) | silencioso, só alimenta fluência | nunca |
| Oficina | silencioso, ignorado na alta | nunca |
| Dojo < 7 anos | silencioso | nunca |
| Dojo 7+ | medido | opcional |

**➡️ O que o código faz:** o `rt_alvo` da ficha continua alimentando o `rt_max_s` da trilha FD — isso
já está implementado e está certo. O que muda: nenhum caminho de código pode usar `rt` como condição
de `levelUp` ou de `unlock` na Jornada. A dimensão *fluência* do domínio multidimensional é o único
consumidor legítimo.

## 3.2 §7.1-bis — A Mão Fantasma é exemplo esmaecido

**Problema:** a §7 dizia que a Mão Fantasma *"faz o exercício inteiro, narrado, com a tela travada"*.
Criança de 4 a 5 anos tem foco contínuo de 4 a 6 minutos e urgência motora. Tela travada por 40
segundos produz toque-spam — que o motor lê como desistência. O andaime vira obstáculo.

**Regra nova:** a mão demonstra **o primeiro item**, em até 10s, e devolve a tela imediatamente,
piscando o próximo alvo. Se a criança errar o segundo, a mão demonstra **aquele item**, não o
exercício. Nível 2-3: só a pedido ou após 12s de inatividade. Nível 4-5: não existe.

**Contrato duro:** enquanto a mão estiver ativa, todo toque é **absorvido sem penalidade** (nunca
erro, nunca `skip`), e um toque na área ativa **encurta** a demonstração em vez de ser ignorado.

**➡️ O que o código faz:** a `<GhostHand/>` **ainda não foi construída**. Esta é a especificação
antes do código — o momento barato. Construir já com o contrato de esmaecimento.

## 3.3 §8.3-bis — Filtro motor: erro de dedo não é erro de cabeça

**Problema:** F07, a criança tenta pôr o capacete no bombeiro certo e solta perto. O sistema
registra `DISTRIBUICAO_DESIGUAL`. Isso contamina o Radar, dispara Oficina injusta e ensina a criança
que ela é ruim naquilo.

**Regra nova:** nenhuma tag é aplicada a partir de evento isolado de manipulação. O motor separa:

| Padrão | Assinatura | Consequência |
|---|---|---|
| **Erro motor** | mira certo e solta perto (dentro de 1,5× a área de snap) · solta fora de alvo válido · corrige sozinha · arrasto abortado antes de 200ms | não pontua, não vira tag, não alimenta Radar, não aparece no painel dos pais |
| **Erro conceitual** | gesto preciso, destino errado · repete o mesmo destino · ignora alvos vazios | pontua e recebe tag |

**Na dúvida, classifica como motor.** Falso negativo custa uma questão; falso positivo contamina o
diagnóstico.

**Contrato de UI verificável:** todo arrasto tem alternativa por toque (origem → destino), snap com
tolerância generosa, área ≥ 80px, e nenhum critério de tempo. Ficha que exija precisão fina para
demonstrar compreensão **reprova na Definição de Pronto** (§12.7).

**➡️ O que o código faz:** o `radarEngine` precisa receber da UI o **tipo** do evento de erro, não só
o valor. Hoje o `commitProgress` não recebe a resposta errada com metadado de gesto. É um campo novo
no contrato de resposta.

## 3.4 §11.4-bis — O Radar é probabilístico

**Problema:** uma tag aplicada em erro único trata descuido como misconception.

**Regra nova:** tag é hipótese com peso.

| Evidência | Peso |
|---|---:|
| erro isolado | 0.2 |
| mesmo erro em duas fichas diferentes | 0.5 |
| erro com `rt` muito curto (chute, ou automatismo errado) | 0.7 |
| erro com padrão consistente na mesma sessão | 0.9 |
| erro que persiste **depois da dica** | 1.0 |

| Soma | Ação |
|---|---|
| < 0.5 | registra e segue |
| 0.5 – 1.5 | Oficina **invisível** (questões ficam mais concretas, sem anúncio) |
| ≥ 1.5 | **Missão de Resgate** visível, com o anti-loop de 3 do `rescuePlanner` |

**Decaimento:** acerto limpo na mesma competência subtrai 0.3. Sete dias sem reincidência zeram.

**Linguagem obrigatória:** *"há indício de que a criança está somando os denominadores"* — nunca *"a
criança tem SOMA_DENOMINADOR"*. Vale para o sistema, o log e o painel dos pais.

**➡️ O que o código faz:** o `radarEngine` deixa de ser gatilho por contagem e passa a acumular peso
por tag, com decaimento temporal. O `rescuePlanner` já existe e continua sendo o executor — só muda
quem o chama e quando.

## 3.5 §12.3-bis — Divulgação progressiva

**Problema:** F39 empilha material dourado + conta armada + coluna ativa + cubinhos + barras +
vai-um + teclado + fala + animação de fusão + animação de subida. Para uma criança de 7 anos isso é
excelente para *ensinar* e péssimo para *avaliar*: a memória de trabalho vai toda para decodificar a
tela.

**Regra nova:** na primeira exposição, a tela revela em degraus — material → transformação →
material+conta → conta com material de apoio → só conta. **A escada de revelação é independente da
escada de níveis** (dois eixos, como NÍVEL × FAIXA no §12.2-bis). Criança no nível 4 que volta pela
Oficina reentra no degrau de revelação apropriado sem perder o nível.

**Fichas obrigadas a declarar `revelacaoProgressiva: true`:** F35, F39, F40, F68, F69, F76.

**➡️ O que o código faz:** campo novo na `FichaCompetencia`, e o auditor falha se uma ficha marcada
não declarar os degraus, ou se o nível 1 dela renderizar mais de duas representações simultâneas.

---

# 4. §12.5-ter — CASCA VISUAL POR IDADE *(direção futura, não bloqueia nada)*

**Problema previsível:** o grafo é governado por proficiência, nunca por idade. Logo, existirá uma
criança de 10 anos em F1. Se ela vir dinossauro, balão e mascote de voz fina, ela abandona — não por
dificuldade, por vergonha.

**Solução registrada:** desacoplar trilha de proficiência da casca estética.

| Casca | Idade estética | Características |
|---|---|---|
| Kids | 4-6 | cores fortes, mascote presente, voz cantada |
| Explorer | 7-9 | aventura, mapas, missões, mascote discreto |
| Lab | 10+ | minimalista, "enigma"/"laboratório", sem mascote, estatísticas pessoais |

A casca é escolhida pela **idade real**, nunca pela faixa da competência. Marcada como direção
futura documentada, igual ao modo caneta (§12.11-bis). Como a skin já é cosmética e por sessão
(§12.5), a casca entra como mais uma dimensão do mesmo mecanismo.

**➡️ O que o código faz:** nada agora. A consequência imediata é normativa: **nenhuma ficha pode
assumir vocabulário infantil como obrigatório.**

---

# 5. §15.8 — O TESTE QUE TERIA PEGADO OS 7

Seção nova, escrita a partir do incidente real. O auditor **deve quebrar o build** se:

1. `count(yaml.nodes)` ≠ `count(GRAFO.md)` ≠ `count(.json)` ≠ `count(.ts)` — respeitando a convenção
   de marcador do §1.4 deste diário
2. o número declarado no corpo da Bíblia, do Manual, do Método ou da Arquitetura Cognitiva divergir
   da contagem real
3. dois nós tiverem **sobreposição semântica no nome** *e* **o mesmo conjunto de pré-requisitos**
4. um nó tiver como pré-requisito outro cujo nome está contido no seu (`N7.04 Porcentagem` ←
   `N6.03 Porcentagem`) — ciclo semântico que o detector de ciclos do DAG **não pega**
5. existir nó sem ficha ou ficha sem nó

Mais: **toda candidata a competência entra numa lista de espera com o teste de duplicação por
escrito, e a rejeição vai para o changelog com o nó que já a cobria.** Foi a ausência dessa linha
que deixou 7 duplicatas atravessarem YAML, JSON, TypeScript e grafo.

A §15.8 também guarda a **lista de espera** atual, com as candidatas levantadas pelas auditorias que
**não** viraram competência: moda/mediana/amplitude · 4 quadrantes · desigualdades · transformações
geométricas · funções entrada-saída · problemas de múltiplas etapas. E registra as duas que já
estavam cobertas e não devem ser recriadas: ×÷ de decimais (`N6.02`) e ×÷ de negativos (`N7.02`).

---

# 6. AS FICHAS — O QUE MUDOU, UMA A UMA

## 6.1 Duas fichas novas *(90 → 92)*

`JD2` e `JD3` existiam apenas como duas linhas de especificação no `DOJO_SAGA.md`. Eram as **duas
únicas ausências reais do cânone**. Foram escritas no formato completo de 9 seções.

| Ficha | Competência | O marco | Por que importa |
|---|---|---|---|
| **JD2 · A Mão Relâmpago** | `N1.08` subitização conceitual | a âncora do 5 virando reflexo | é o degrau que faltava entre JD1 (Olhômetro, até 5 dispersos) e F02 (Moldura de Dez). A mão é o primeiro material estruturado que toda criança já tem: ensina a sub-base 5 sem ninguém explicar sub-base 5. |
| **JD3 · Moldura Relâmpago** | `N1.11` amigos do 10 | ver **o vazio** como quantidade | é a porta de entrada da trilha **FD1**. Os amigos do 10 nascem aqui como **percepção**, antes de nascerem como conta em F28. Quem *vê* que faltam três nunca mais precisa calcular que faltam três. |

Ambas com `excecaoCPA: "perceptual"` (sobem por automaticidade, não por abstração), domínio
`{ acertos: 4, de: 5, sessoes: 2 }` — critério frouxo de propósito, igual a JD1 — e **sem critério
de tempo**, em conformidade com o §5.1-bis.

Tag nova e importante em JD3: **`RESPONDE_O_CHEIO`** — a criança responde a quantidade preenchida em
vez da vazia. Não é descuido: é o olho fazendo exatamente o que foi treinado a fazer. É o erro mais
comum e o mais informativo da ficha.

**Jardim do Dojo agora completo: JD1, JD2, JD3, JD4, JD5.**

## 6.2 Correções pontuais

| Ficha | O que estava | O que ficou | Por quê |
|---|---|---|---|
| **F14** domínio | *"os acertos precisam ter tempo de resposta abaixo de 8 segundos"* | critério **estratégico**: o acerto só conta se o marcador partir do número maior | violava §5.1-bis. E o critério estratégico mede melhor: a mecânica registra **de onde ela partiu**, que é a competência real. |
| **F14** howto | *"Guarde o oito na cabeça"* | *"O oito já está pronto. Não precisa contar de novo."* | "guardar na cabeça" é abstrato demais para 5-6 anos |
| **F67** roteiro | *"O algarismo na conta **desliza** para a coluna à esquerda"* | *"cada quantidade ficou dez vezes maior — por isso mudou de casa"* | trocava uma misconception por outra: dígitos que se movem fisicamente. Quebra em decimais (0,5 × 10 não é "0,50"). A causa tem de vir antes da consequência. **Proibido:** "o número anda", "o algarismo desliza", "é só acrescentar um zero". |
| **F85** howto | *"Somar anda para a direita. Subtrair anda para a esquerda. **Sempre**."* | contexto de dívida: *"subtrair um negativo é cancelar uma dívida"* | a regra quebra em `5 − (−3)` — e a ficha diagnostica `SUBTRAIR_NEGATIVO` como o caso mais confuso. **A própria fala era a provável fonte da misconception que a ficha combate.** |
| **F83** níveis | médias quaisquer | níveis 1-3 só com **média inteira**; meio bloco a partir do nível 4 | a metáfora de nivelar torres é fisicamente honesta só com média inteira. Se der 4,5, os blocos não nivelam e a criança percebe que a frase não fecha — e ela está certa. |

## 6.3 Adendo normativo em todos os 5 blocos

Cada `FICHAS_Fx_COMPLETAS.md` recebeu, antes da primeira ficha, um **ADENDO NORMATIVO v3.1** com as
seis regras globais (filtro motor, Radar probabilístico, relógio silencioso, Mão Fantasma esmaecida,
divulgação progressiva, casca visual) e a lista nominal das fichas do bloco afetadas por cada uma.

**Onde a ficha divergir do adendo, o adendo prevalece.** Isso evita ter de reescrever 92 fichas para
propagar uma regra que é global.

**Fichas com exposição motora alta** (exigem toque alternativo + snap, por bloco):
F0 → F07, F04, F19, F51 · F1 → F15, F21, F53 · F2 → F45, F46, F61, F59 · F3 → F71, F78, F80 ·
F4 → F92, F95.

Cada bloco ganhou também um **changelog próprio** no rodapé.

---

# 7. O QUE FOI RECUSADO DAS AUDITORIAS — E POR QUÊ

Registrar a recusa é parte da §15.8. Sem isto, a recomendação volta no próximo ciclo.

| Recomendação | Veredito | Motivo |
|---|---|---|
| Renomear IDs das fichas: `N5.03`→`N5.07`, `N5.04`→`N5.06`, `N6.03`→`N7.04`, `N6.04`→`N7.03` | ❌ **recusada** | Medido: `N5.03`, `N5.04`, `N6.03` e `N6.04` **existem** no cânone com esses nomes; `N5.06`, `N5.07`, `N7.03`, `N7.04` **não existem**. Executar isso quebraria 4 fichas boas apontando para nós inexistentes. **Não executar em hipótese alguma.** |
| Adotar "95 competências" | ❌ **recusada** | 7 das 11 são duplicatas. Ver §1.2. |
| Domínio afrouxado para "3/3" e "4 acertos assistidos" | ⚠️ **parcial** | Aceita a **regra anti-frustração** (duas sessões ruins → baixa dificuldade, traz ficha dominada como aquecimento, depois reintroduz). Recusado coroar criança que só acerta com ajuda: o **domínio multidimensional já implementado** resolve melhor, medindo *independência* como dimensão separada. |
| 8 lacunas de cobertura matemática | 🅿️ **estacionadas** | Medido: ×÷ de decimais já está em `N6.02`; ×÷ de negativos já está em `N7.02`. As outras 6 são conteúdo de F4 e nenhuma passou pelo teste de duplicação da §15.3. Entraram na **lista de espera da §15.8**, não no grafo. |
| Casca visual por idade | ✅ **aceita como direção futura** | Vira §12.5-ter. Não bloqueia nada agora. |

---

# 8. VERIFICAÇÃO EXECUTADA

Rodei um verificador sobre o cânone editado. Resultado, item a item:

```
[1] GRAFO
  ✅ 88 nós no executável (88)
  ✅ 13 trilhas de fluência (13)
  ✅ .md e .txt com os mesmos IDs (88 vs 88, diferença zero nos dois sentidos)
  ✅ nenhum dos 7 nós rejeitados presente

[2] BÍBLIA
  ✅ cabeçalho = changelog (3.1)
  ✅ 15 seções, §1 a §15, nenhuma faltando
  ✅ §5.1-bis · §7.1-bis · §8.3-bis · §11.4-bis · §12.3-bis · §12.5-ter · §15.8 presentes
  ✅ nenhum "84 competências" fora do changelog histórico v1.0

[3] FICHAS
  ✅ 92 fichas no total
  ✅ 88/88 competências cobertas
  ✅ nenhuma ficha cita nó inexistente
  ✅ Jardim do Dojo completo: JD1, JD2, JD3, JD4, JD5
  ✅ JD2 e JD3 com as 9 seções obrigatórias
  ✅ adendo v3.1 e changelog nos 5 blocos

[4] CONSISTÊNCIA NUMÉRICA CRUZADA (§15.8)
  ✅ nenhum documento declara 84 ou 95 como número atual
  ✅ 5 documentos declaram 88 competências
  ✅ 3 documentos declaram 92 fichas
```

**Uma falha encontrada e corrigida durante o processo:** a primeira versão da nota de retificação no
Grafo citava os 7 IDs em texto corrido, e o parser voltava a contar 95. Daí nasceu a convenção de
marcador do §1.4. Registro isto porque é exatamente o tipo de armadilha que a §15.8 existe para
pegar — e ela pegou.

---

# 9. O QUE O CÓDIGO PRECISA FAZER

Em ordem de dependência. Nada aqui é opcional para ficar em conformidade com a v3.1.

| # | Tarefa | Onde | Depende de |
|---|---|---|---|
| 1 | Remover os 7 nós rejeitados do `curriculum/grafo_saga.yaml` e dos YAMLs por strand | `curriculum/` | — |
| 2 | `npm run grafo:gerar` e conferir 88 em `.md`, `.json`, `.ts` | `scripts/` | 1 |
| 3 | Implementar os 5 testes da §15.8 no `catalog_auditor.cjs`, com a convenção de marcador | `AI_Studio_Lab/tools/` | 2 |
| 4 | Ligar `npm run auditar` à CI, em todo PR | CI | 3 |
| 5 | Campo de metadado de gesto no contrato de resposta, para o filtro motor (§8.3-bis) | `fichaQuestionContract.ts` | — |
| 6 | `radarEngine` passa a acumular **peso por tag** com decaimento (§11.4-bis) | `motores/radarEngine.ts` | 5 |
| 7 | Garantir que nenhum caminho use `rt` como condição de `levelUp`/`unlock` na Jornada (§5.1-bis) | `progressEngine` / `applyJourneyAnswer` | — |
| 8 | Campo `revelacaoProgressiva` na `FichaCompetencia` + teste de contrato (§12.3-bis) | `schema.ts`, `Composer.ts` | — |
| 9 | Construir `<GhostHand/>` já com o contrato de esmaecimento (§7.1-bis) | `components/primitives/` | — |
| 10 | Importar JD2 e JD3 quando as fichas de F0 forem para código | `fichas/jornada/` | — |

**Regra da evidência (§14.1) vale para tudo acima:** nenhum item é aceito sem saída bruta de
terminal. Relatório em prosa não conta.

---

# 10. ARQUIVOS ENTREGUES

| Arquivo | Versão | Estado |
|---|---|---|
| `BIBLIA_SAGA.md` | **v3.1** | editado — 7 subseções novas, §13 recuperada, varredura numérica |
| `GRAFO_DE_CONHECIMENTO_SAGA.md` | **v1.2** | editado — contagem retificada, tabela de rejeições |
| `MANUAL_DIDATICO_SAGA.md` | **v2.3** | editado — só a contagem; nenhuma alteração didática |
| `DOJO_SAGA.md` | **v1.3** | editado — JD2/JD3 marcadas como escritas, alinhamento com §5.1-bis |
| `METODO_SAGA.md` | — | editado — 90 → 92 fichas |
| `ARQUITETURA_COGNITIVA_SAGA.md` | — | editado — 90 → 92 fichas |
| `FICHAS_F0_COMPLETAS.md` | **v3.1** | **JD2 e JD3 novas** + adendo + índice + changelog |
| `FICHAS_F1_COMPLETAS.md` | **v3.1** | F14 (domínio e howto) + adendo + changelog |
| `FICHAS_F2_COMPLETAS.md` | **v3.1** | adendo + changelog |
| `FICHAS_F3_COMPLETAS.md` | **v3.1** | F67, F83 + adendo + changelog |
| `FICHAS_F4_COMPLETAS.md` | **v3.1** | F85 + adendo + changelog |
| `grafo_saga.txt` | — | **inalterado** — já estava correto com 88 nós e 13 trilhas |
| `PACOTE_DE_RECONCILIACAO_SAGA.md` | — | a decisão e a evidência |
| `DIARIO_DE_ALTERACOES_CANONE_v3.1.md` | — | este documento |

---

*Produzido em 1º de agosto de 2026. Toda afirmação numérica é reproduzível por parser sobre os
arquivos entregues.*

---

# 11. SEGUNDA RODADA — v3.2 · O DOJO GANHA CORPO

*Acrescentado no mesmo dia, depois de auditar o Dojo a pedido do proprietário.*

## 11.1 O que estava faltando de verdade

O `DOJO_SAGA.md` especificava o **comportamento** do Dojo com rigor (força por fato, recuo sem
cerimônia, socorro visual, degrau zero, comutatividade, faixas, ritual). Mas **só 2 das 13 trilhas
tinham os degraus escritos**: FD3 e PD-D. FD1, FD2, FD4, FD5, FD6, FD7 e FD8 tinham nome e meta de
tempo, e nada mais. O documento dizia *"as demais seguem o mesmo desenho"* e apontava para o
Apêndice A do Grafo — que traz uma linha-resumo para a família PD e **nada** para a família FD.

**Consequência já materializada:** o repositório preencheu o vazio inventando. O `dojo_add.ts` tem
10 níveis próprios, que misturam fato e procedimento armado e não seguem a progressão canônica do
FD3. Não foi erro do Codex — foi o cânone deixando o espaço em branco.

## 11.2 O que foi feito

**Documento novo no cânone: `DOJO_TRILHAS_COMPLETAS.md`.**

| Seção | O que traz |
|---|---|
| §1 | o que muda e o que **não** muda: as 4 trilhas que já rodavam foram **preservadas inteiras** |
| §2 | os três lugares (Jardim · Dojo Sensei · trilhas canônicas) e como se ligam |
| §2.3 | **a janelinha de faixas** — o painel que abre ao tocar na trilha, com exemplo real de cada faixa |
| §3 | **as 5 trilhas × 10 faixas**, com exemplos e mapeamento para FD/PD |
| §4 | o que aparece na tela · **áudio praticamente nenhum** · modo de resposta · **distratores tagueados** |
| §5 | subir/descer/socorrer · resolução da contradição comutativa · **inventário de fatos gerado** · telemetria |
| §6 | a **Prancheta** dentro do Dojo |
| §7 | **como mexer sem bagunçar** — 4 tipos de mudança, a regra de faixa nunca mudar de número, checklist |
| §8 | o que este documento **não** cobre |

**A 5ª trilha — Frações e Decimais — é nova.** Era o "até frações" que faltava.

## 11.3 Três achados que viraram correção

**a) Contradição do registro comutativo.** O §3-A do Dojo diz que comutativos compartilham o mesmo
`FactStrength`. O §4-bis.2 diz que o sistema mede se `5+3` é tão rápido quanto `3+5`. **As duas não
podiam ser verdade** — com um registro só, não há dois tempos para comparar. Resolvido: força
compartilhada, mas `rt_direto` e `rt_invertido` separados. O sinal de que a comutatividade pegou é a
diferença entre eles cair abaixo de 40%.

**b) O inventário de fatos não existia.** O Dojo diz que a trilha sobe quando "~90% dos fatos do
degrau estão em força ≥ 4". Sem a lista de quais fatos compõem o degrau, isso não é computável.
Agora o inventário é **gerado por fórmula** (§5.3) e o script entra no auditor.

**c) O erro do Dojo era jogado fora.** Errar no Dojo só custava `−1 força`. Uma criança que responde
`8+7=16` três vezes mostra um padrão diagnóstico que o sistema descartava. Criado o
**`DojoErrorEvent`** com distratores tagueados: o erro do Dojo passa a alimentar o Radar com o peso
probabilístico do §11.4-bis.

## 11.4 Duas primitivas novas na Bíblia

**§9.3 — A PRANCHETA.** Camada transparente de rascunho por cima do exercício, com lápis em 3 cores,
borracha, limpar e desfazer. Dedo, caneta e mouse se comportam igual. **Usar a prancheta nunca conta
como ajuda** e não afeta a dimensão *independência* do domínio — rascunhar é fazer conta, não pedir
socorro. Base de implementação: o `TraceCanvas` que já existe no repositório.

**§12.11-ter — MODO DE RESPOSTA.** Alternativas (padrão hoje), teclado estruturado, e escrita à mão
como direção documentada. Regras duras do modo escrita quando for construído: é opção por perfil
ligável em **qualquer nível, inclusive o 1**; na dúvida o sistema **pergunta** em vez de reprovar;
erro de reconhecimento **nunca** vira tag nem alimenta o Radar; desligar nunca perde progresso; e ela
**não substitui a Prancheta** — a Prancheta é onde a criança calcula, o modo escrita é onde ela
responde.

## 11.5 O inventário de primitivas — `PRIMITIVAS_SAGA.md`

Documento novo, medido direto do repositório. O resultado desmente o que as auditorias vinham
dizendo:

| | Quantos |
|---|---:|
| Kinds no catálogo §9 | 47 |
| Componentes de primitiva **já escritos** | **24** |
| Kinds **ligados** ao Composer | 11 |

**`InteractiveVertical` (a conta armada), `TraceCanvas` (traçado) e `RapidFire` (o Dojo) já
existem** — só não estão ligados. As auditorias listavam `vertical` como "buraco crítico P1"; o
componente estava no disco o tempo todo.

**São 13 componentes prontos esperando um `case` no Composer.** Ligar os 4 primeiros
(`InteractiveVertical`, `ArrayGrid`, `Quadrado100`, `SingaporeBars`) destrava F2 quase inteiro e é o
maior retorno por hora do projeto. Só depois vale construir do zero — e as 4 primeiras a construir
são `money`, `measure`, `picto` e `pattern`, que fecham F1 e boa parte de F2.

## 11.6 Bug corrigido na spec

Conta de dois algarismos aparecendo na faixa 1 do Dojo. **A faixa 1 é um algarismo com um
algarismo, soma até 5.** A tabela do §3 do `DOJO_TRILHAS_COMPLETAS.md` é a fonte da verdade; se o
gerador produzir fora do intervalo declarado, é bug do gerador, não ambiguidade da spec.

## 11.7 Uma pendência declarada, não escondida

**O Sensei hoje é reativo, não preditivo.** Ele apresenta a missão que o Motor montou agora (§3.1).
Não existe especificação de **horizonte** — "esta semana o plano é", "em 3 dias você abre X". O
`review_planner` tem os intervalos 2-4-7-12-21-45, mas isso é agendamento de revisão, não previsão
de trilha. Fica registrado como `PLANO_DE_HORIZONTE`, documento a escrever. **Não bloqueia nada do
que está entregue** — o Dojo e a Jornada funcionam sem ele.

## 11.8 Tarefas de código que a v3.2 acrescenta

| # | Tarefa | Onde |
|---|---|---|
| 11 | Ligar `InteractiveVertical`, `ArrayGrid`, `Quadrado100`, `SingaporeBars` ao Composer | `Composer.ts` |
| 12 | Gerar os 4 geradores de trilha do Dojo conforme as tabelas do §3, **preservando o desenho atual** | `fichas/dojo/` |
| 13 | Criar a 5ª trilha (Frações e Decimais) | `fichas/dojo/` |
| 14 | Implementar a janelinha de faixas com exemplo real gerado na hora | `components/` |
| 15 | `DojoErrorEvent` + distratores tagueados no Dojo | `dojoEngine.ts` |
| 16 | `FactStrength` com `rt_direto` e `rt_invertido` separados | `dojoEngine.ts` |
| 17 | Script gerador do inventário de fatos, ligado ao auditor | `AI_Studio_Lab/tools/` |
| 18 | Construir a **Prancheta** sobre o `TraceCanvas` | `components/primitives/` |
| 19 | Construir `money`, `measure`, `picto`, `pattern` | `components/primitives/` |

---

*Segunda rodada encerrada em 1º de agosto de 2026. Bíblia **v3.2** · Dojo **v1.4** · dois documentos
novos no cânone.*
