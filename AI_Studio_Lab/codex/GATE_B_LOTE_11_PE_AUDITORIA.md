# Gate B — Lote 11 — PE — auditoria Child-Ready

Data: 2026-08-20  
Modo: **AUDIT-ONLY**  
Âncora de entrada: `41d4233d7b5e06639b0e626684f695708d581966`  
Escopo: `PE.01–PE.04`

## 0. Veredito

**PE AUDITADO: 4/4 competências. Proveniência atual: 3 Composer / 1 legado / 0 fallback. Quatro candidatas individuais CODIGO novas (`GAP-058–GAP-061`), três ampliações de CLASS-003, nenhuma nova classe estrutural e nenhuma correção.**

## 1. Resultado por competência

| ID | Resultado |
|---|---|
| PE.01 | `GAP-058` — escala 1:2 e construção de pictograma ausentes na escada legado |
| PE.02 | `GAP-059` + membro CLASS-003 |
| PE.03 | `GAP-060` + membro CLASS-003 |
| PE.04 | `GAP-061` + membro CLASS-003 |

## 2. CLASS-003 — ampliação PE

Os contratos especializados usam um caso canônico determinístico por nível sob mastery repetida. Entram na classe já existente, sem GAP duplicado apenas por essa causa:

- PE.02/F64;
- PE.03/F83;
- PE.04/F95.

## 3. Candidatas individuais PE

Todas ficam `HIPÓTESE-A-PROVAR`, via `CODIGO`, sem correção no Gate B.

### GAP-058 — PE.01/F56 — escala 1:2 e produção de pictograma ausentes

Tipos: `MICRONÍVEL-AUSENTE` / `PRODUÇÃO-TROCADA-POR-RECONHECIMENTO` / `TRANSFERÊNCIA-INSUFICIENTE`.

O cânone F56 define L4 como o degrau em que **1 ícone representa 2 unidades** e L5 como **construir o pictograma a partir de dados soltos**. O domínio exige ao menos um caso com legenda de escala. O gerador legado `gPE_01` trabalha sempre com contagem literal de ícones: L1/L2 leitura, L3 maior linha, L4 diferença entre linhas e L5 total. Não existe multiplicador da legenda nem modo de construção.

Provar/refutar no Gate B′: introduzir a legenda como informação operacional real e provar produção do pictograma sem transformar arrasto preciso em requisito conceitual.

### GAP-059 — PE.02/F64 — construção de gráfico vira reconhecimento e L3 contradiz a própria tabela

Tipos: `PRODUÇÃO-TROCADA-POR-RECONHECIMENTO` / `INTERAÇÃO-AUSENTE` / `RESOLUÇÃO-DIVERGENTE`.

F64 declara completar uma barra por construção e, no L4, construir o gráfico inteiro a partir da tabela; o domínio inclui construção. `JornalTurmaStage` renderiza o gráfico pronto e oferece alternativas. No L4 a barra de Jogos já está desenhada na própria altura que a pergunta pede. No L3 há ainda uma contradição executável: `valores` contém Jogos = 0 enquanto o prompt afirma que a tabela diz 7 para Jogos e pergunta até onde a barra deve chegar.

Provar/refutar: alinhar tabela, prompt e estado; a altura produzida pela criança precisa ser a evidência, não uma escolha sobre um gráfico que já mostra a resposta.

### GAP-060 — PE.03/F83 — média por nivelamento não é executável e a média é antecipada

Tipos: `INTERAÇÃO-AUSENTE` / `PRODUÇÃO-TROCADA-POR-RECONHECIMENTO` / `VAZAMENTO-DE-RESPOSTA`.

O fundamento canônico é explícito: média deve ser compreendida **movendo blocos** das torres altas para as baixas, preservando o total. O palco atual desenha torres estáticas, uma linha da média e um selo textual `média {valor}` antes da resposta; não há controle para redistribuir blocos. A resposta é escolhida por alternativas.

Provar/refutar: permitir nivelamento conceitual executável com alternativa motora acessível e só revelar a linha/valor conclusivo depois da ação apropriada.

### GAP-061 — PE.04/F95 — experimento de frequência/independência não existe no runtime

Tipos: `INTERAÇÃO-AUSENTE` / `CONTEÚDO-SÓ-EXPLICADO` / `VAZAMENTO-DE-RESPOSTA`.

F95 declara como experiência central repetir sorteios/giros muitas vezes e observar o gráfico de frequência se construir em tempo real, justamente para quebrar a falácia do apostador. O palco atual mostra um histórico estático. Em L4 o texto já informa antes da resposta que o histórico “não altera uma moeda justa na próxima jogada”. Não há roleta, repetição executável nem gráfico acumulativo vivo.

Provar/refutar: materializar a experiência repetida e a evolução da frequência, preservando a independência como conclusão observável da atividade e não apenas como frase antecipada.

## 4. Medição do lote

- competências auditadas: **4/4**;
- proveniência: **3 Composer / 1 legado / 0 fallback**;
- candidatas novas ativas: **4 CODIGO**;
- ampliações CLASS-003: **3**;
- nova classe estrutural no lote: **0**;
- correções: **0**.

Com o fechamento deste lote, o Gate B alcança **90/90 competências auditadas**. O balanço global vive em `GATE_B_FECHAMENTO_90_90.md`.
