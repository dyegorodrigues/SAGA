# Dados em escala: de 2 crianças para 10.000 sem perder nada

Documento de projeto. Responde a uma pergunta que ainda não é urgente e por isso
mesmo precisa ser respondida agora: **o que decidir hoje para não pintar o
projeto num canto amanhã?**

Nenhuma linha de código deste documento deve ser escrita agora. O que ele
protege são as decisões *baratas hoje e caríssimas depois* — formato do evento,
onde ele é gravado, e o que garante que ele possa mudar de casa.

---

## 1. O medo, e por que ele está parcialmente errado

O medo declarado foi: *"um banco de dados gigantesco de log"*, e junto com ele
*"não perder cada detalhe, cada conexão, cada leitura"*.

Os dois estão certos como preocupação e errados como dilema, porque **não é
preciso escolher**. Medindo o evento real de telemetria do SAGA (474 bytes de
JSON, ~616 B armazenados):

| crianças | eventos/ano | tudo cru no Firestore | condensado | cru arquivado (.gz) |
|---|---|---|---|---|
| 100 | 400 mil | 246 MB | **13 MB** | 30 MB |
| 1.000 | 4 milhões | 2,5 GB | **129 MB** | 296 MB |
| 10.000 | 40 milhões | 24,6 GB | **1,3 GB** | 3,0 GB |

*(20 questões/dia, 200 dias ativos por ano.)*

E o custo, em ordem de grandeza, a 10.000 crianças:

- tudo cru no Firestore: **~4,44 USD/mês**
- condensado: ~0,23 USD/mês
- cru arquivado em armazenamento frio: **~0,01 USD/mês**

> Confira os preços vigentes antes de decidir com base neles — mudam, e a
> ordem de grandeza importa mais que o número.

**Conclusão que muda a pergunta:** guardar tudo nunca foi caro. Quatro dólares
por mês para 10 mil crianças é ruído. **O que fica caro é *perguntar*.** "Qual
concepção errada domina N3.10 entre crianças de 7 anos?" varrendo 40 milhões de
documentos é lento e cobra por documento lido, toda vez que alguém pergunta. É
a leitura que quebra, não a escrita.

Isso reorienta tudo: **condensar não é para economizar espaço. É para o
algoritmo conseguir ler.**

---

## 2. A ideia central: arquivar não é apagar

O erro que produz "bagunça homérica" é acreditar que só existem duas opções —
manter tudo no banco vivo, ou deletar. Existe uma terceira, e é ela que resolve:

```
        QUENTE                    MORNO                      FRIO
   evento cru, completo   →   resumos condensados   +   evento cru arquivado
      0 – 90 dias              90 dias – sempre          para sempre
   "o que aconteceu na       "como esta criança          "prove qualquer
    sessão de ontem?"         evoluiu em 2 anos?"         coisa, um dia"
```

O dado cru **nunca é destruído**. Ele sai do banco operacional e vai para
armazenamento de objetos, comprimido, particionado por data, em formato aberto
(JSONL comprimido ou Parquet). Fica legível por qualquer ferramenta, custa quase
nada e pode ser reprocessado do zero se um dia a condensação se mostrar
insuficiente.

Essa é a resposta direta ao *"nada se perca"*: **nada se perde porque o cru
continua existindo**. O que a condensação faz é criar um atalho para as
perguntas que se repetem — não substituir a fonte.

---

## 3. A técnica que você intuiu: condensar sem perder a forma

Você descreveu bem: *"algum esquema que reduz o tamanho sem perder cada
detalhe"*. Isso existe e tem nome. A propriedade que importa chama-se
**mesclabilidade** (*mergeability*): um resumo de duas semanas pode ser obtido
somando os resumos de cada semana, **sem voltar ao dado cru**.

É isso que permite os "blocos em blocos" que você imaginou:

```
eventos crus  →  resumo SEMANAL  →  resumo MENSAL  →  resumo ANUAL
                      ↑ mescla ────────┘ ↑ mescla ────────┘
                (nunca relê o cru)
```

### O que sobrevive a cada condensação

| Guardar | Em vez de | Por quê |
|---|---|---|
| **Contagens** (tentativas, acertos, erros, ajudas, recuperações) | cada evento | soma é mesclável e não perde nada |
| **Histograma de tempo de reação** em faixas fixas | cada tempo em ms | 8 números preservam a *forma* da distribuição de 3.000 respostas. Média sozinha esconde a criança que ora voa, ora trava |
| **Contagem por tag de concepção errada** | cada ocorrência | é exatamente o que o Radar pergunta |
| **Trajetória de nível** (início, fim, subidas, descidas) | cada transição | responde "andou ou empacou" |
| **Primeira e última ocorrência** | todos os carimbos | delimita a janela sem guardar o meio |

**O que se perde:** o milissegundo exato da questão nº 7 de uma terça-feira.
Depois de 90 dias, ninguém pergunta isso — e se um dia perguntar, o arquivo frio
responde.

Medido, com o resumo semanal por criança/competência: **19× menor**, de 2,46 MB
para 0,13 MB por criança por ano.

### Quando 8 faixas não bastarem

Para percentis exatos (*"o p90 do tempo de reação"*), a ferramenta é um
**esboço** (*sketch*) — `t-digest` ou `KLL`. Guarda percentis com erro
controlado em ~1 KB, **independentemente de quantas amostras entraram**, e é
mesclável igual. É literalmente "uma grande quantidade de informação ficando
bem pequenininha".

Não adotar agora: é dependência a mais para um problema que ainda não existe.
Faixas fixas resolvem até a casa dos milhares de crianças.

---

## 4. Não ficar preso ao Firestore

Você levantou a transmigração de banco, e está certo em levantar. Firestore é
excelente como banco *operacional* (offline no tablet, sincronia, regras) e ruim
como banco *analítico* (não faz `GROUP BY` de 40 milhões de linhas).

O caminho natural, quando a hora chegar, não é trocar de banco — é **parar de
usar um banco só para as duas coisas**:

- **Firestore continua** sendo o que a criança usa: save, progresso, offline.
- **A análise migra** para um armazém analítico (BigQuery, ClickHouse, DuckDB
  sobre os arquivos frios — este último roda até num notebook simples).

Três decisões baratas hoje que tornam isso quase trivial depois:

1. **Um único ponto de escrita.** Toda telemetria passa por
   `logTelemetryToCloud` em `src/lib/firebase.ts`. Uma função. Trocar o destino
   é reescrever uma função, não caçar chamadas pelo código inteiro. **Isso já
   está assim — só não pode ser desfeito.**
2. **Versão no evento.** Todo evento carrega `schemaVersion`
   (`VERSAO_EVENTO_TELEMETRIA`). Sem isso, um arquivo de 2027 lido em 2030 vira
   adivinhação — e como o arquivo é imutável, não dá para consertar depois.
   **Feito**, porque é a única mudança que fica impossível de aplicar
   retroativamente: eventos já gravados sem versão nunca terão versão.
3. **Identidade dentro do registro, não só no caminho.** Hoje `parentUserId` é
   recuperável do caminho do documento (`userStates/{id}/Kids/{kidId}/...`) e por
   isso foi removido de dentro dele — correto, enquanto o dado vive no
   Firestore. **Mas ao exportar para arquivo, o caminho se perde.** O exportador
   *precisa* materializar `parentUserId` e `kidId` como campos. Registrado aqui
   porque é o tipo de detalhe que só dói quando já é tarde.

---

## 5. Vinculação: como nada se desconecta

O medo de *"tudo continua conectado, vinculado com cada conta, cada ID de
criança"* se resolve com uma regra simples: **identificadores nunca mudam e
nunca são reaproveitados.**

- `kidId` é gerado uma vez, na criação do perfil, e nunca é reescrito.
- Apagar um perfil **não** libera o id para reuso.
- Todo resumo condensado carrega `kidId` + `trackId` + janela. A partir daí,
  cru, morno e frio se juntam por chave, em qualquer ferramenta, para sempre.
- O nome da criança **não** entra em telemetria nem em resumo — só o id. Assim o
  arquivo analítico não é um arquivo de dados pessoais, e uma troca de nome não
  reescreve histórico.

---

## 6. O que fazer, e quando

O erro mais caro aqui seria construir tudo isso agora, para duas crianças.

| Momento | O que fazer | Por quê |
|---|---|---|
| **Hoje (2 crianças)** | **Nada de infraestrutura.** `schemaVersion` no evento — já feito | é a única coisa que não dá para aplicar depois: evento gravado sem versão nunca terá versão |
| **~100 crianças** ou primeiro estudo real | Escrever o trabalho de condensação semanal | é quando as perguntas começam a se repetir |
| **~1.000 crianças** | Ligar a exportação para arquivo frio; o TTL vira carga real | é quando o custo de leitura começa a aparecer |
| **~10.000 crianças** | Análise sai do Firestore; ele fica só operacional | é quando `GROUP BY` no banco vivo deixa de ser viável |

**Gatilho honesto para revisar este documento:** quando a primeira análise real
existir. Enquanto ninguém lê a telemetria, todo desenho aqui é hipótese
educada — e hipótese educada envelhece.

---

## 7. Resumo em cinco linhas

1. Guardar tudo nunca foi o problema — ler tudo é.
2. Condensar é para o algoritmo enxergar, não para economizar disco.
3. Arquivar não é apagar: o cru sobrevive em formato aberto, por centavos.
4. Resumos mescláveis empilham sozinhos: semana → mês → ano, sem reler o cru.
5. Três decisões baratas hoje (um ponto de escrita, versão no evento, identidade
   no registro) tornam qualquer migração futura um trabalho de dias, não de meses.
