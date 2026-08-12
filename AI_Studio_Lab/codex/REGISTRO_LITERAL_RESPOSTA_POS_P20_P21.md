# Registro literal — resposta pós-P20/P21

> Registro textual da resposta dada ao autor em 8/ago/2026. Este arquivo existe para preservar **literalmente** o raciocínio, a ordem das fases e os critérios descritos na conversa, sem depender de memória de chat.

Sim. E nesta própria rodada eu já avancei bastante além de simplesmente “deixar anotado”.

A **P20 foi concluída de verdade**. O commit funcional é `f45509ca73739d93fe32986c9cf7bcc5aaf6337a`: save local por Firebase UID, bootstrap local×nuvem único, proteção contra troca de conta durante sync, upgrade anônimo→Google preservando identidade e testes permanentes para impedir regressão. O workflow que realmente executou testes focais, auditorias, suíte completa e build passou verde. A `main` continua exatamente em `68fad4c...`, intocada.

E eu já iniciei a etapa seguinte, **P21**, em vez de só planejar. O inventário real encontrou **90 nós no grafo**, 92 fichas documentadas cobrindo 88 dessas 90 competências, 29 fichas de Jornada em TypeScript, 24 registradas no Composer e 22 canários ativos. A branch está agora **289 commits à frente e 0 atrás da `main`**. A bancada temporária da P21 já se autoapagou.

### O que descobri que ainda falta

A P21 achou coisas que eu não consideraria “acabamento”. São pequenas, mas importantes.

**Primeiro, governança das fontes de verdade — P21.1.** O registro administrativo `JOURNEY_FICHAS/AllFichas` enxerga só 19 das 29 fichas TS existentes. Isso inclusive afeta o Sandbox administrativo, então determinadas fichas que existem e algumas que já estão ativas podem não aparecer ali como autoria. Além disso, um dos auditores ainda está programado para esperar **88 competências**, embora o grafo tenha 90, e ele consegue ficar verde mesmo existindo competências sem ficha. Isso precisa ser corrigido antes de confiar cegamente nos fiscais.

Também há dois buracos canônicos concretos: **N1.09 e GM.02 estão no grafo, mas não têm ficha autoral Markdown própria**. Eu não vou inventar fichas só para fazer uma tabela ficar verde; precisamos estudar pedagogicamente o que cada uma representa e se realmente merece ficha própria, incorporação em outra ficha ou uma retificação do grafo.

A P21 ainda mostrou que o mapa de primitivas registra 26 primitivas, 18 como plenamente executáveis e oito com algum tipo de lacuna. Mas parte dessas oito pode ser **documentação atrasada**, não código inexistente. Por exemplo, o runtime de N3.10 já tem construção autoral para história aditiva, enquanto o mapa ainda classifica `StoryPanel` de maneira antiga. Portanto a **P21.2** será provar, primitiva por primitiva, o caminho:

**ficha → builder → kind realmente emitido → Stage/renderer → interação → evidência**.

Só depois disso eu vou dizer “esta precisa ser construída”.

### Depois da P21: P22

Aqui entram as lacunas curriculares deliberadas, uma por uma:

- **N1.09** — falta de ficha autoral;
- **GM.02** — falta de ficha autoral;
- **JD4** — é a única trilha do Jardim que continua explicitamente ausente;
- **N4.09** — já registrada, mas ainda não promovida;
- **GM.12/F50** — implementada e visualmente testada, mas mantida desligada de propósito.

Há um detalhe interessante para a futura JD4: **N1.07 já existe e está ativa**, trabalhando sucessor/antecessor e saltos na reta. Então antes de implementar JD4 precisamos responder se ela automatiza N1.07, se é outra camada perceptual da mesma competência ou se o cânone antigo estava misturando coisas. Isso é justamente o tipo de microduplicação curricular que não quero introduzir.

Também continuam `Moedas` e `Regua` como primitivas conhecidas que podem precisar ser fechadas, mas não vou construí-las até provar qual ficha realmente necessita delas.

### A parte dos “motores inteligentes” que você descreveu

Aqui concordo fortemente com a tua preocupação: isso merece uma **auditoria própria**, e eu não trataria como detalhe técnico.

Hoje já existem vários componentes dessa inteligência — grafo, progressão, Radar, evidências, misconceptions, Jardim, revisão, resgate, Minha Aula etc. Mas o fato de cada função isolada ter bons testes **não prova que o tutor longitudinal seja inteligente**.

Então, depois de limpar P21/P22, eu faria uma etapa especificamente de **engenharia dos motores adaptativos/meta-algoritmos**. A pergunta não será “o código funciona?”, mas:

> Dado tudo que o sistema sabe sobre esta criança até agora, esta é realmente a melhor próxima experiência pedagógica?

Eu quero submeter o sistema a crianças sintéticas muito diferentes: uma que entende mas é lenta; outra rápida que chuta; uma que repete sempre o mesmo erro conceitual; outra que aprende hoje e esquece na semana seguinte; uma excelente com manipulativos mas fraca quando aparece o símbolo; outra dependente de ajuda; uma que recupera depois da dica; uma muito avançada para a idade etc.

Aí auditaremos conjuntamente:

**Matrícula → Grafo → Progress Engine → Composer/Minha Aula → Radar → Oficina/Resgate → revisão espaçada → domínio/evidências → Jardim → FD → PD → telemetria → próxima decisão.**

O sistema deveria conseguir coisas como:

- distinguir **“não sabe”** de **“sabe, mas ainda é lento”**;
- distinguir lentidão de erro conceitual;
- saber quando repetir e quando variar;
- saber **qual pré-requisito** atacar, e não simplesmente voltar um nível;
- não prender a criança numa remediação infinita;
- retirar andaime no momento correto;
- perceber transferência visual→simbólica;
- preservar conquistas sem fingir que uma habilidade frágil continua forte;
- trazer uma habilidade de volta antes de ela deteriorar demais;
- acelerar quem já domina, em vez de obrigá-lo a cumprir exercícios desnecessários;
- reconhecer que uma dica fez a criança chegar à resposta, mas isso não equivale ao mesmo nível de independência de um acerto espontâneo.

Isso vai produzir **invariantes testáveis**, não apenas uma opinião minha dizendo que o algoritmo parece inteligente.

## E aí entra a mega auditoria pedagógica que você imaginou

Eu acho que ela deve existir e ser uma das últimas grandes fases — **mas antes do release hardening**, não depois de tudo estar congelado.

E eu faria maior do que uma simples revisão das fichas.

### 1. Arquitetura curricular inteira

Imaginar literalmente a criança que chega sem saber nada.

Ela ainda não reconhece numeral. Não sabe que “cinco” é quantidade independente da forma como os objetos estão arrumados. Talvez nem consiga contar sem contar duas vezes o mesmo objeto.

A partir daí seguimos **cada aresta do grafo** e perguntamos:

- ela possui todos os conhecimentos necessários para essa próxima competência?
- algum pré-requisito está faltando?
- existe uma microcompetência intermediária escondida?
- dois nós são na verdade a mesma competência apresentada em representações diferentes?
- alguma coisa aparece cedo demais?
- alguma coisa aparece tarde demais?
- a dificuldade aumenta na dimensão certa?

Isso vai da alfabetização numérica à multiplicação, divisão, frações, medidas, geometria, álgebra, probabilidade etc.

### 2. Engenharia de cada ficha

Para cada ficha, não basta verificar “tem cinco níveis”.

Precisamos ver se os cinco níveis formam **uma progressão cognitivamente coerente**.

Às vezes aumentar o número torna a atividade mais difícil. Em outras, isso não ensina nada novo. O salto certo pode ser:

**mais apoio → menos apoio → nova disposição espacial → representação parcial → símbolo → transferência para contexto diferente.**

Vamos verificar exemplos, contraexemplos, variações, distratores, misconceptions, linguagem oral, feedback, microaula, evidência de domínio e generalização.

E também perguntar:

> “O que exatamente muda do L2 para o L3?”

Se a resposta for “só números maiores”, mas a competência exigiria uma transformação de raciocínio, temos uma micro-lacuna de design pedagógico.

### 3. Auditoria das primitivas como linguagem pedagógica

Essa parte que você mencionou de cards, objetos, barras, molduras, recipientes, balanças, mãos etc. é essencial.

Uma primitiva não é apenas um componente gráfico. Ela é **uma representação matemática**.

Precisamos verificar se:

- a criança já aprendeu a “ler” aquela representação antes de depender dela;
- o tamanho visual não entrega acidentalmente a resposta;
- posição, cor ou alinhamento não criam falsas pistas;
- arrastar/tocar corresponde cognitivamente à ação matemática;
- a microaula ensina o gesto no primeiro contato;
- depois o gesto deixa de ser necessário;
- a representação desaparece progressivamente;
- o símbolo chega depois que existe significado;
- áudio, texto e objeto estão dizendo exatamente a mesma coisa.

É aí que entra o **design pedagógico**, não apenas UI.

### 4. A criança completa, não a tela isolada

Essa talvez seja a auditoria mais importante.

Em cada ficha perguntaremos:

> “Até chegar aqui, o que esta criança já viu?”

Porque uma atividade pode ser excelente isoladamente e ser péssima no SAGA se ela usa uma representação que nunca foi apresentada.

E vamos executar trajetórias completas: criança começando no zero, avançando, errando, voltando, esquecendo, recuperando, automatizando e transferindo.

## Onde o Dojo entra nisso

Também precisa de uma auditoria final própria, porque agora já ficou mais claro que há **três naturezas diferentes de treino**:

**Jardim/JD → percepção e automaticidade pré-simbólica**  
**FD/Sensei → recuperação fluente de fatos**  
**PD → procedimentos/algoritmos**

Não quero que o sistema confunda essas três coisas.

Uma criança pode compreender multiplicação muito bem e ainda não recuperar `7×8` automaticamente. Isso pede Dojo, não “voltar a ensinar multiplicação”.

Da mesma forma, uma criança pode responder rápido porque memorizou respostas e não compreender a estrutura. Isso não deveria permitir que velocidade mascarasse falta de conceito.

É nessa auditoria que estudaremos as faixas, thresholds, strength de fatos, progressão, regressão do treino, revisão espaçada, interleaving e passagem **olho → fato → algoritmo**.

## Então, é o final?

Estamos nos aproximando do fim da **primeira grande engenharia estrutural**, mas eu não chamaria o SAGA de pedagogicamente terminado ainda.

Hoje eu organizaria o restante assim:

1. **P21.1 — corrigir registries e auditores que ficaram para trás.**
2. **P21.2 — reconciliar o mapa real das primitivas.**
3. **P22 — resolver deliberadamente N1.09, GM.02, JD4, N4.09 e GM.12.**
4. **Auditoria dos motores adaptativos/meta-algoritmos**, com trajetórias de alunos simulados.
5. **Mega auditoria de engenharia pedagógica**, com pesquisa externa atualizada, grafo + 92 fichas + níveis + exemplos + primitivas + trajetória longitudinal.
6. **Auditoria integrada do Dojo JD/FD/PD.**
7. **Correções encontradas**, sempre em lotes pequenos com testes/QA.
8. **Release hardening final**: mobile/tablet, visual, acessibilidade, auth, offline, saves antigos, performance, privacidade/telemetria infantil, documentação e auditoria final de branches.

Depois disso, sim, chegamos num ponto em que a pergunta deixa de ser “o que ainda está estruturalmente errado?” e passa a ser principalmente **observação empírica com crianças reais, refinamento e evolução do produto**.

E tem uma coisa importante: eu **não vou partir para a mega auditoria pedagógica supondo que o que existe está errado**. Muita coisa que revisei está conceitualmente muito boa. A auditoria serve exatamente para separar quatro classes:

**OK comprovado · micro-lacuna · lacuna estrutural · precisa de observação empírica.**

Isso evita tanto destruir coisa boa quanto deixar passar uma falha pequena que se propaga por vinte competências.

### Para abrir outra conversa

Pode abrir sem medo. Já deixei isso preparado no próprio repositório.

A nova conversa só precisa receber algo como:

> **“Continue o SAGA pelo checkpoint atual da branch `codex/integrar-bloco-f0`. Leia `AI_Studio_Lab/codex/RETOMADA.md` e siga o workflow. Não toque na main nem no Creature Engine.”**

Ela vai cair diretamente em **P21.1**. Não precisa você me reexplicar P17, P8, P19, P20, o Jardim, os canários, nem esta conversa inteira.

Neste momento o checkpoint remoto está com a cumulativa **289 commits à frente e 0 atrás**, enquanto a `main` continua exatamente no mesmo SHA. PR #29 continua **draft e não mesclada**. A auditoria P21 está salva em `AUDITORIA_P21_FONTES_DE_VERDADE.md`, a decisão em `DECISAO_P21_FONTES_DE_VERDADE.md`, e `RETOMADA.md` já diz literalmente para começar pela **P21.1**.
