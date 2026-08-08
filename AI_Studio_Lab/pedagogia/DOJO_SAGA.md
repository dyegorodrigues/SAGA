# 🥋 DOJO SAGA — A Academia de Fluência
**Versão 1.5 · Agosto 2026 · Especificação completa do pilar de fluência**
> *O número acima acompanha SEMPRE a última entrada do changelog no fim do arquivo. Cabeçalho e changelog divergentes = documento inválido (Bíblia §1).*
*v1.5 (ago/2026) — reconciliação P17/P8 do Jardim. JD5 deixa a definição antiga de “chegaram mais 2” e passa a refletir a ficha canônica completa: mãe `N1.10`, relação parte-todo com uma parte escondida e treino da imagem mental; o conteúdo antigo de soma mental não é apagado conceitualmente, mas deixa de ocupar o id JD5 e só pode voltar com destino curricular próprio. O unlock do Jardim fica explicitamente em NÍVEL 3 da mãe e não herda por engano a regra histórica de FD; a promoção de um round JD exige precisão E fluência no `rt_alvo`, mantendo acerto lento como compreensão preservada. `DojoTrackState`/`DojoSession` passam a admitir família `JD`, estado de degrau e rounds. O motor P8 mantém JD fora do DAG e salva automaticidade em `dojoTracks`, enquanto erros conceituais reais alimentam o Radar da competência-mãe.*
*v1.4 (ago/2026) — documento-irmão criado: `DOJO_TRILHAS_COMPLETAS.md`, com as 5 trilhas de operação × 10 faixas, a janelinha de faixas, os distratores tagueados, o `DojoErrorEvent` que liga o Dojo ao Radar, o inventário de fatos gerado e o protocolo de alteração de faixa. Resolvida a contradição do §3-A × §4-bis.2 sobre o registro comutativo: o `FactStrength` é compartilhado, mas guarda `rt_direto` e `rt_invertido` separados — sem isso não havia como medir se a comutatividade pegou. Regra de áudio do Dojo Sensei explicitada: praticamente nenhum (só tick de acerto, tom de erro e jingle de faixa); o áudio obrigatório é do Jardim, que é outro lugar.*
*v1.3 (ago/2026) — Jardim do Dojo COMPLETO: JD2 (A Mão Relâmpago, mãe N1.08) e JD3 (Moldura Relâmpago, mãe N1.11) ganharam ficha completa de 9 seções em `FICHAS_F0_COMPLETAS.md` — antes existiam só como duas linhas de especificação aqui, e eram as duas únicas ausências reais do cânone. Alinhamento com a Bíblia v3.1: o cronômetro visível continua proibido antes dos 7 anos, e agora a regra é simétrica na Jornada — §5.1-bis, o relógio é silencioso e nenhuma ficha usa tempo como critério de domínio conceitual; o `rt_alvo` da ficha alimenta o `rt_max_s` da trilha FD, nunca reprova na Academia.*

*v1.2 — §4-bis: DEGRAU ZERO (FD3.0, granularidade fina só no primeiro contato), COMUTATIVIDADE como degrau explícito (FD3.4-bis, medida por tempo de resposta do par invertido) e EIXO Y (socorro visual após 2 erros — o concreto volta sem sair do degrau; sai sozinho após 2 acertos). §3-bis: vocabulário oficial FAIXA (Dojo, 1-10) × NÍVEL (Jornada, 1-5), sincronizado com BIBLIA_SAGA §12.2-bis.*

**Este documento é a especificação completa do Dojo — a semente original do projeto.** A ideia nasceu assim: um "Kumon digital" para treinar aritmética até o domínio absoluto. O projeto cresceu ao redor (o Grafo ensina, o Manual explica), mas o Dojo continua sendo o coração do treino: **o lugar onde o que foi COMPREENDIDO nas aulas vira REFLEXO**. Compreensão sem fluência trava a criança nos problemas grandes (a memória de trabalho lota calculando o básico); fluência sem compreensão é a decoreba que quebra. O SAGA exige as duas — em lugares diferentes: a aula ensina, o Dojo automatiza.

**O Dojo é um PILAR autônomo, não um apêndice da aula.** A criança entra nele direto (o templo no mapa) e treina o quanto quiser — como quem senta com o caderno do Kumon e "mete ficha". Ele TAMBÉM cede 1 bloco diário para a aula (Bíblia §6), mas isso é secundário: o principal é ser o ginásio onde se treina à vontade, no ritmo próprio.

**Fluência tem duas formas — e o Dojo treina as duas** (esta é a correção-chave sobre o Kumon, que fazia ambas nas folhas):
- **Fluência de FATO** — recordar `7×8` na hora, sem calcular (§3, trilhas FD).
- **Fluência de PROCEDIMENTO** — executar a conta armada de vários dígitos lisa, rápida e sem erro (§3-B, trilhas PD). É a espinha das folhas do Kumon: 2 algarismos, depois 3, depois 4, multiplicação e divisão longas.

E abaixo das duas, para os pequenos que ainda não leem numerais, o **Jardim do Dojo** (§7) treina a fluência pré-simbólica (o olhômetro, a mão, a moldura). Três camadas, uma escada natural: primeiro o olho (Jardim) → depois o fato (FD) → depois o procedimento (PD).

---

## §1. O KUMON DISSECADO — o que copiamos, o que corrigimos

O método Kumon acertou coisas que quase ninguém acerta. E errou coisas que só um sistema vivo consegue corrigir. O Dojo é a resposta ponto a ponto:

**Forças do Kumon (absorvidas):**
1. **Prática diária curta** — melhor 5 minutos todo dia que 1 hora no sábado. → Dojo: 1 bloco por sessão, 3-5 min.
2. **Incrementos minúsculos, do fato ao procedimento** — do 1+1 à divisão longa, em milhares de degraus quase imperceptíveis; as folhas treinavam tanto o fato solto quanto o algoritmo armado de vários dígitos. → Dojo: trilhas FD (fato) E trilhas PD (procedimento), ambas decompostas em micro-degraus (§4).
3. **Maestria antes de avançar** — só sobe quem domina. → Dojo: força por fato ≥ alvo antes do próximo degrau.
4. **Voltar ao fácil de propósito** — quando trava, recua para reconstruir confiança. → Dojo: rounds de aquecimento sempre abaixo do nível atual + recuo automático sem cerimônia.
5. **Autonomia e ritmo próprio** — cada criança na sua folha. → Dojo: nada de turma, nada de comparação.

**Fraquezas do Kumon (corrigidas):**
1. **Repetição cega e tediosa** — a folha não sabe QUAIS fatos você erra; repete tudo. → Dojo: rastreio POR FATO (§3): treina o que está fraco, não o que está forte. É a vantagem estrutural que papel nunca terá.
2. **Zero ensino conceitual** — Kumon treina, não explica; a criança automatiza sem entender. → Dojo: **nenhuma trilha abre antes do limiar conceitual da sua competência-mãe**. Para o Jardim, o contrato canônico é NÍVEL 3 (§3-bis e §7); FD/PD obedecem aos pré-requisitos/limiares de suas trilhas canônicas e nunca sobrepõem a compreensão. A regra antiga “FD só em nível ≥4” não deve ser aplicada ao Jardim.
3. **Sequência fixa e igual pra todos** — ignora o padrão individual de erro. → Dojo: o Treino do Mestre monta cada sessão do estado real da criança (§5).
4. **Feedback binário e tardio** — certo/errado corrigido depois, sem estratégia. → Dojo: erro dispara a estratégia do fato na hora (o "quebra o bloco" do 7×6, a "ponte" do 8+5 — as MESMAS estratégias do Manual, agora em velocidade).
5. **Volume que esmaga** — folhas longas geram choro e desistência. → Dojo: rounds de 10-20 itens, término SEMPRE em vitória, sem lição de casa.
6. **Inútil para quem não lê nem conta** — Kumon começa onde a criança já opera símbolos. → Dojo: o Jardim do Dojo (§7) treina fluência PRÉ-simbólica (subitização flash, molduras) desde os 4 anos.

---

## §2. OS MODOS DO DOJO

O Dojo tem **quatro modos**. Nos dois primeiros o algoritmo decide tudo; nos dois últimos a criança tem controle. Todos valem para as duas famílias (FD fatos e PD procedimentos).

**🥋 Jornada (o treino diário padrão).** O Treino do Mestre monta o bloco do dia (§5) — equilibrado: um pouco de fronteira, revisão intercalada, fila quente. É o que entra na sessão da Academia (Bíblia §6) e o que a criança faz ao abrir o Dojo sem pedir nada. Senta e treina, como no tatame.

**🎯 Reforço (só os pontos fracos).** O algoritmo puxa APENAS as trilhas/itens de menor força — se a subtração está em 42%, vem subtração. É o modo para afiar o que está frágil, sem diluir com o que já está forte. Pode ser sugerido pelo Motor ou escolhido pela criança.

**⚡ Livre (a criança escolhe).** Ela pega qualquer trilha destravada, de qualquer família ("hoje quero tabuada do 7" ou "quero treinar divisão armada"). Autonomia real: dá senso de controle e serve para treinar para o "teste de amanhã". Dentro da trilha escolhida, o algoritmo ainda escolhe os itens (os fracos dela). Escolha do quê; ciência do como.

**🔥 Mestre (o desafio).** O algoritmo pega tudo o que ela já domina, mistura, aperta a dificuldade e cronometra — como uma prova de faixa ou um treino de atleta. Para a criança mais velha ou motivada que quer se testar. Fecha com recorde pessoal, nunca com comparação entre crianças.

Em todos: sem nota, sem ranking entre crianças, sem punição. O adversário é o próprio tempo de ontem.

---

## §3. O CORAÇÃO: DUAS UNIDADES DE FLUÊNCIA

O Dojo rastreia fluência em duas granularidades diferentes, porque treinar `7×8` e treinar `4.037 ÷ 23` são coisas distintas.

### 3-A. Força por FATO (trilhas FD)
A unidade não é "a tabuada do 7" — é **cada fato individual** (7×6 é um registro; 7×8 é outro). Cada fato tem:

```
FactStrength {
  fact_id        // ex: "mul:7x6" (comutativos compartilham: 6x7 → mesmo registro)
  forca: 0-5     // 0 = nunca visto · 5 = reflexo consolidado
  rt_medio       // média móvel (70% histórico / 30% última)
  ultima_vez     // para o decaimento
  erros_seguidos
}
```

**Como a força se move:**
- Acerto DENTRO do rt-alvo da trilha → +1 (máx 5).
- Acerto LENTO (acima do alvo) → mantém (contou, mas ainda não é reflexo).
- Erro → −1 (mín 0) e o fato entra na fila quente da sessão (reaparece 2-3 itens depois, e de novo no fim).
- **Decaimento:** força 4-5 sem treino por 14+ dias decai 1 ao reaparecer errado — a ferrugem existe e o sistema respeita (é o mesmo espírito da revisão espaçada da Bíblia §11, na escala do fato).

**rt-alvo por trilha** (do Grafo, Apêndice A): FD1-FD2 3s · FD3-FD4 4s · FD5-FD6 5s · FD7-FD8 6s. Nos primeiros degraus de cada trilha o alvo é 2× mais folgado e aperta gradualmente — a velocidade é conquistada, nunca exigida de partida.

**Um fato "vale faixa"** quando força = 5. Uma trilha FD avança de degrau quando ~90% dos fatos do degrau estão em força ≥ 4.

### 3-B. Força por PROCEDIMENTO (trilhas PD)
Um algoritmo armado não é "um fato" — é uma sequência de passos aplicada. Não se mede por recordação instantânea (ninguém faz `4.037÷23` em 3s), e sim por **precisão + fluidez**: a conta sai certa, e sai sem travar em cada passo. A unidade é o **tipo de procedimento** (ex.: `sub:3dig:zeros`, `mul:x2dig`):

```
ProcStrength {
  proc_id        // ex: "div:1dig:resto", "mul:x2dig"
  precisao       // média móvel da taxa de acerto do RESULTADO final (70/30)
  passo_fraco    // qual passo mais falha (opcional): "reserva", "quociente_zero", "alinhar_virgula"
  tempo_medio    // relativo ao alvo do degrau (folgado no início, aperta)
  forca: 0-5     // derivada de precisão sustentada dentro do tempo-alvo
  ultima_vez
}
```

**Como a força se move:**
- Resultado certo dentro do tempo-alvo → +1 (máx 5).
- Certo mas lento → mantém (executa, ainda não flui).
- Erro → −1 e o procedimento volta à fila quente. **Onde o passo falhou é registrado** (`passo_fraco`) — é o que permite a intervenção cirúrgica (§5), não "refaz tudo".
- **Decaimento** igual ao dos fatos (a mão enferruja como a memória).

**tempo-alvo** cresce com o número de passos, não é fixo (uma divisão longa pode ter alvo de 40-60s e ainda ser "fluente"). O que importa é a curva caindo, não um número mágico.

**Um procedimento "vale faixa"** quando força = 5 (precisão ~95%+ no tempo-alvo). Uma trilha PD avança de degrau quando o degrau atual está em força ≥ 4.

**A diferença que importa:** no fato, o inimigo é a lentidão da recordação; no procedimento, o inimigo é o erro num passo específico (esquecer a reserva, engolir o zero do quociente, desalinhar a vírgula). Por isso o `passo_fraco` existe — ele conecta direto à estratégia CPA daquele passo no Manual.

---

## §3-bis. VOCABULÁRIO OFICIAL: FAIXA (Dojo) × NÍVEL (Jornada)

Os "degraus" deste documento (FD3.1...FD3.10, PD-D.1...PD-D.10) são chamados oficialmente de **FAIXA** — 1 a 10, uma por família de trilha. Isso não é o mesmo que o **NÍVEL** de proficiência da Jornada (1 a 5, em `BIBLIA_SAGA.md` §12.2-bis). Ficam claras as diferenças, porque os dois nomes já foram confundidos:

| | **NÍVEL** (Jornada, 1-5) | **FAIXA** (Dojo, 1-10) |
|---|---|---|
| Mede | proficiência — o quanto entende | dificuldade — o tamanho/tipo do número |
| Eixo | Y, abstração (concreto→abstrato) | X, magnitude (2+3 → 27+35 → ÷2díg com ajuste) |
| Muda o quê | a REPRESENTAÇÃO na tela | os PARÂMETROS numéricos |
| Sobe quando | domínio da ficha (regra `acertos/de/sessoes`) | regra própria da família de treino |
| Desce quando | nunca (maxLvl não regride) | treino pode recuar sem retirar conquista/faixa |

**O Jardim abre quando a competência-mãe atinge NÍVEL 3 na Jornada** (ou já está dominada). A partir daí, seu treino de automaticidade progride em estado próprio e não cria nó `JD*` no Grafo. FD/PD continuam obedecendo aos limiares e pré-requisitos de suas trilhas canônicas; não inferir regra de uma família para outra.

---

## §4. OS DEGRAUS — as trilhas decompostas (o espírito Kumon, granulado)

> ⚠️ **A lista literal do que aparece em cada faixa está em `DOJO_TRILHAS_COMPLETAS.md`** — as 5 trilhas de operação (adição, subtração, multiplicação, divisão, frações e decimais) × 10 faixas, com exemplos reais e o mapeamento faixa → trilha canônica FD/PD. Esta seção dá o **desenho** dos degraus; aquele documento dá o **conteúdo**. Onde divergirem, `DOJO_TRILHAS_COMPLETAS.md` vence para conteúdo de faixa, e este documento vence para comportamento do motor.

### Trilhas de FATO (FD)
Cada trilha FD do Grafo se abre em micro-degraus. A progressão canônica (exemplo completo da FD3, +/− até 20; as demais seguem o mesmo desenho):

```
FD3.1  +1/+2 e −1/−2 (vizinhos da reta)        FD3.6  −e depois do 10 (voltar pelo 10)
FD3.2  +0/−0 e o próprio número (n−n=0)        FD3.7  mistos ± até 20, lote equilibrado
FD3.3  dobros até 20                           FD3.8  o buraco: 8+__=15, 14−__=6
FD3.4  quase-dobros                            FD3.9  três parcelas rápidas (2+5+3)
FD3.5  +atravessando o 10 (ponte)              FD3.10 faixa-preta: tudo misturado, rt no alvo
```

**Receita de cada round FD (10-20 itens):** ~60% do degrau atual · ~20% revisão dos degraus anteriores (intercalada — interleaving, que consolida mais que bloco puro) · ~10% fatos da fila quente (errados recentes) · ~10% UM degrau acima, como amostra grátis (se acerta, acelera a promoção). Sempre: **os 3 últimos itens são fáceis** — toda sessão termina em vitória.

### Trilhas de PROCEDIMENTO (PD)
Mesma filosofia de micro-degraus, agora sobre o algoritmo armado. Exemplo completo da **PD-D (divisão armada)** — a espinha exata do Kumon, do exato ao decimal:

```
PD-D.1  ÷1díg exata, quociente 1 díg (48÷4)         PD-D.6  ÷1díg com zero no quociente (816÷4=204)
PD-D.2  ÷1díg exata, quociente 2 díg (96÷3)          PD-D.7  ÷2díg por estimativa, sem ajuste (96÷23)
PD-D.3  ÷1díg com resto (58÷5)                       PD-D.8  ÷2díg com ajuste do chute (a mais/a menos)
PD-D.4  ÷1díg, dividendo 3 díg (738÷6)               PD-D.9  quociente decimal (75÷4 = 18,75)
PD-D.5  interpretar/checar (q×d+r)                   PD-D.10 faixa-preta: dividendos grandes, tempo-alvo
```

*(PD-A, PD-S, PD-M seguem o mesmo padrão — a coluna "Progressão interna" do Apêndice A do Grafo lista os degraus de cada uma.)*

**Receita de cada round PD (5-10 itens — procedimento cansa mais que fato):** ~60% do degrau atual · ~20% revisão dos anteriores · ~10-20% da fila quente (procedimentos com passo errado recente), **entrando pelo passo fraco** (se o erro é sempre a reserva, os itens de revisão são escolhidos para exercitar a reserva). Último item sempre mais leve — fecha em vitória.

**Recuo sem cerimônia (ambas as famílias):** 2 rounds seguidos com precisão < 60% no degrau → o próximo treino começa um degrau abaixo, sem aviso, sem "você caiu". A criança só sente que "hoje fluiu". (Kumon fazia isso com folhas; aqui é invisível e instantâneo.)

---

## §4-bis. O DEGRAU ZERO, A COMUTATIVIDADE E O EIXO Y

Três acréscimos que a progressão original não cobria.

### 4-bis.1 — O DEGRAU ZERO (FD3.0): granularidade Kumon para o primeiro contato

Os degraus do §4 começam em "+1/+2 e −1/−2". Para uma criança de 5-6 anos que **acabou de aprender a somar**, isso já é largo demais: `+1` e `+2` são dois fatos diferentes, e ela precisa de um por vez.

Antes do FD3.1 entra o **degrau zero**, com a granularidade fina do Kumon clássico:

```
FD3.0a   +0 e o próprio número      0+1, 0+2, 0+3, 1+0, 5+0
FD3.0b   +1 exclusivo               1+1, 2+1, 3+1 ... 9+1
FD3.0c   +2 exclusivo               1+2, 2+2, 3+2 ... 8+2
FD3.0d   +1 e +2 misturados         (só depois de cada um firme)
```

**Por que a granularidade fina só aqui:** treinar fato a fato é lento e trata cada soma como independente — é exatamente o que a progressão por estratégia (§4) evita. Mas no **primeiro contato**, a criança ainda não tem estratégia nenhuma para aplicar; ela precisa de repetição em dose pequena, com um alvo por vez.

**Quando abandonar:** assim que FD3.0d fecha, a criança entra em FD3.1 e a progressão por estratégia assume. **A granularidade fina é andaime de entrada, não o modelo do Dojo.**

### 4-bis.2 — A COMUTATIVIDADE COMO DEGRAU EXPLÍCITO

A criança que sabe `3+5=8` frequentemente **não sabe** `5+3=8` — ela trata como dois fatos a decorar. Isso dobra a carga de memória sem necessidade.

**Novo degrau, entre FD3.4 e FD3.5: FD3.4-bis — pares invertidos.**

O round apresenta o fato e, **na sequência imediata**, o seu inverso:
```
3+5 = ?   →   5+3 = ?
7+2 = ?   →   2+7 = ?
```

Na primeira aparição, quando ela acerta o segundo, a voz nomeia: *"olha! É o mesmo, só trocou de lugar."* Depois disso, os pares aparecem **separados** dentro do round — e o sistema mede se o segundo é tão rápido quanto o primeiro.

**O sinal de que funcionou:** o tempo de resposta de `5+3` se aproxima do de `3+5`. Se continuar muito mais lento, ela ainda está calculando em vez de recuperar.

**Vale igual para multiplicação** (FD-M): `4×7` e `7×4`. E aqui a economia é enorme — a comutatividade corta a tabuada praticamente pela metade.

### 4-bis.3 — O EIXO Y NO DOJO: o concreto volta quando ela erra

O Dojo move o **eixo X** (magnitude: números maiores). Mas quando a criança erra repetidamente num degrau, aumentar ou diminuir o número **não resolve** — o problema não é o tamanho, é que a representação abstrata não está sustentando.

**A regra do socorro visual:**

> Dois erros consecutivos no mesmo degrau → o item seguinte aparece **com apoio concreto**, sem sair do degrau.

| Trilha | Apoio que retorna |
|---|---|
| FD adição/subtração | moldura de dez com os objetos |
| FD multiplicação | arranjo retangular |
| PD armadas | material dourado ao lado da conta |
| Jardim | a estrutura visual (moldura, dado) |

**Como sai:** dois acertos com apoio → o apoio **desaparece sozinho**, sem aviso. A criança volta ao abstrato no mesmo degrau.

**Por que isso é diferente de "descer de faixa":** descer muda o **conteúdo** (números menores). O socorro visual muda a **representação** (mesmo conteúdo, mais apoio). São os dois eixos agindo de forma independente — exatamente o que a §12.2-bis da Bíblia define.

**Ordem de tentativa quando a criança trava:**
1. **socorro visual** no mesmo degrau (eixo Y)
2. se persistir, **recuo de degrau** (eixo X, §4)
3. se persistir, **Missão de Resgate** na Oficina (§8.4 da Bíblia)

---

## §5. O TREINO DO MESTRE — o algoritmo da sessão

Ao montar um treino, o Mestre decide em ordem:

1. **Qual família e qual trilha?** Primeiro a família com maior necessidade (uma trilha FD ou PD com fila quente não zerada tem prioridade), depois a trilha mais "necessitada" dentro dela, por prioridade: (a) fila quente não zerada → ela; (b) senão, a mais enferrujada (maior tempo sem treino × mais itens decaídos); (c) senão, a mais avançada ativa (progresso). Alterna para nunca abandonar trilha velha (máx 3 treinos seguidos na mesma) e equilibra as famílias ao longo da semana (não deixa PD parada enquanto só treina FD). No Treino Livre, a criança escolhe a trilha; o Mestre ainda escolhe os itens dentro dela.
2. **Quais itens?** A receita do §4 (FD ou PD conforme a trilha), escolhendo dentro de cada fatia os de MENOR força (o oposto exato do papel: o Kumon repete o que você já sabe; o Mestre caça o que você não sabe). Em PD, a fila quente entra **pelo passo fraco** registrado.
3. **Que formato?** Em FD, rotação de formatos para o mesmo fato (7×6 direto · 42÷7 · 7×__=42 · o array relâmpago) — fluência é reconhecer o fato de qualquer ângulo. Em PD, a conta armada no formato canônico, ocasionalmente com um passo pré-preenchido para isolar o passo que falhou.
4. **Que ritmo?** rt/tempo-alvo do degrau; sem cronômetro VISÍVEL antes dos 7 anos (a pressa visual gera pânico motor — o tempo é medido em silêncio). 7+ anos: o cronômetro é opcional e a criança escolhe ligá-lo (muitos ADORAM — mas é escolha).

**O erro isolado é toque leve** (o mesmo modelo de duas camadas da Bíblia §8, na velocidade do Dojo): um item errado apenas volta pra fila quente e reaparece adiante — sem parar o round, sem aula. Só o PADRÃO merece intervenção. **Quando um item erra 2× na mesma sessão:** o Dojo pausa a velocidade e injeta a ESTRATÉGIA daquele item (10-15s) — **a mesma do Manual, encurtada**. Em FD: o 7×6 abre no quebra-bloco 5×6+2×6; o 8+5 abre na ponte do 10. Em PD: abre no PASSO exato que falhou (a subtração trava na troca → a barra de dezena explode em 10 cubinhos; a divisão engole o zero do quociente → a Chave Viva mostra a casa vazia). Depois, o item volta em velocidade. Se a estratégia-mãe também falhar, o problema não é de fluência: o Mestre encerra o treino da trilha e sinaliza a competência-mãe como frágil (vira resgate na próxima aula — Bíblia §11). O Dojo NUNCA vira aula à força; ele devolve pra aula.

---

## §6. FAIXAS, RITUAL E MOTIVAÇÃO (a metáfora completa)

O Dojo usa a metáfora até o fim — treino é identidade, não obrigação:

- **Faixas por trilha:** branca → amarela → laranja → verde → azul → roxa → marrom → **preta** (os degraus da trilha mapeados nas faixas; faixa-preta = degrau final no rt-alvo). A faixa NUNCA regride — recuo de degrau é treino, não rebaixamento.
- **O ritual:** todo treino abre com a reverência (1 respiração animada, 2s — foco, e um truque real de autorregulação) e fecha com o carimbo no pergaminho do dia.
- **Sequência de dias (streak):** a chama do dragão cresce por dia treinado. Se apagar — *"o dragão dormiu, vamos acordá-lo"* — SEM perder faixa, sem culpa (a chama celebra presença; a ausência não é punida, é reconvidada).
- **Recordes pessoais:** "seu melhor round de FD4: 14 acertos!" — o único adversário é o eu de ontem. Zero comparação entre irmãos/usuários (regra dura).
- **A Prova de Faixa:** ao completar um degrau, um round-cerimônia de 12 itens com música própria. Passou (≥90% no alvo) → cerimônia da faixa. Não passou → *"quase! o Mestre diz que faltam 2 golpes"* — e treina os 2 fatos exatos que faltaram.

---

## §7. O JARDIM DO DOJO — fluência para quem não lê nem conta (4-6 anos)

A resposta ao "e o meu filho de 4?": fluência pré-simbólica existe, e é a MAIS importante — é o alicerce perceptual de todo cálculo mental futuro (a linhagem do soroban/anzan: primeiro o olho, depois a imagem mental, por último o símbolo). Trilhas do Jardim (destravam quando a competência-mãe chega ao NÍVEL 3 ou já está dominada):

- **JD1 · Olhômetro Relâmpago** (mãe: N1.03): bolinhas piscam 1,5s → some → toca a quantidade (respostas como conjuntos de bolinhas, depois numerais quando N1.06 ≥ 3). Progressão: 1-3 → 1-5 → arranjos de dado → arranjos irregulares → **flash de 0,8s** (o olho ficando anzan).
- **JD2 · A Mão Relâmpago** (mãe: N1.08): mãos/dedos piscam → quanto? (a sub-base 5 virando reflexo: 4 é "mão sem polegar" SEM contar). **Ficha completa de 9 seções em `FICHAS_F0_COMPLETAS.md`.**
- **JD3 · Moldura Relâmpago** (mãe: N1.11): a moldura de 10 pisca com 7 → *"quantos FALTAM pra encher?"* — os amigos do 10 como percepção de vazio, não como conta. **Ficha completa de 9 seções em `FICHAS_F0_COMPLETAS.md`.** É ponte perceptual da F28.
- **JD4 · O Passo Seguinte** (mãe: N1.07/N1.09): "cinco!" (áudio) → toca o que vem depois, cada vez mais rápido; depois contar de 2 em 2 no ritmo do tambor (semente de AL.03 e das tabuadas). **Ainda não entra no runtime P8; permanece dívida curricular separada.**
- **JD5 · Ver e Imaginar** (mãe: **N1.10 Parte-todo**): a criança vê um total, uma parte é escondida e ela infere **quantos ficaram ocultos**, mantendo todo e parte na imagem mental. A escada vai de total pequeno com contagem falada até objetos soltos/sem moldura. A Jornada N1.10 instala essa estrutura e faz a ponte para o `NumberBond`; o Jardim preserva os cinco degraus perceptuais para automaticidade. **Ficha canônica completa em `FICHAS_F0_COMPLETAS.md`; decisão arquitetural em `DECISAO_P17_N110.md`.**

> **Retificação v1.5 — conteúdo antigo de JD5.** A versão inaugural descrevia “mostra 3, esconde, chegaram mais 2 → quanto tem agora”, que é soma mental sobre uma imagem oculta. É uma ideia pedagogicamente aproveitável, mas **não é a mesma competência** que a JD5 parte-todo consolidada nas fichas F0/P17. Ela não é apagada da história: simplesmente deixa de usar o id JD5. Se voltar ao produto, precisa receber destino no grafo/ficha própria antes de virar runtime.

**Regras do Jardim:** tudo áudio-first · rounds de **6-10 itens** (o runtime P8 usa 8) · 2-3 min · zero cronômetro visível · o flash/`rt_alvo` é relógio silencioso. Acerto dentro do alvo fortalece automaticidade; acerto lento **mantém** (compreensão preservada, reflexo ainda não); erro enfraquece e pode alimentar o Radar da competência-mãe se houver hipótese cognitiva. Para subir um degrau de treino: **2 rounds consecutivos com ≥80% de precisão E ≥80% de respostas corretas dentro do `rt_alvo`**. Dois rounds <60% recuam o próximo treino um degrau, sem retirar a maior conquista/faixa já alcançada. Lentidão nunca vira `misconception`.

**Separação Jornada × Jardim:** `JD*` não é nó do DAG e não escreve `state.progress[JD*]`. O estado de automaticidade vive em `state.dojoTracks`; o desbloqueio é recalculado a partir da competência-mãe. Erros conceituais reais do Jardim são atribuídos à mãe no Radar. A primeira resposta cognitiva mede a precisão do round: errar, receber dica e depois recuperar rende feedback/recompensa gentil, mas não transforma o item em acerto de automaticidade.

---

## §8. NA TELA E NOS DADOS

**UI:** o Dojo é um LUGAR no mapa (o templo no topo da montanha) que a criança **entra direto e treina o quanto quiser** — não depende de estar numa aula. Dentro: Jardim pré-simbólico quando aplicável, alas de Fatos e Procedimentos, pergaminho de faixas por trilha, botão "Treinar" e estante de trilhas. Métricas visíveis para a criança: conquista/faixa, chama, recorde; nunca precisão clínica ou cronômetro obrigatório. Métricas do painel dos pais: força/automaticidade por trilha, itens/padrões frágeis, minutos treinados e curva de rt/tempo.

**Contratos de dados:**
```
FactStrength     (§3-A — por fato: fact_id, forca, rt_medio, ultima_vez, erros_seguidos)
ProcStrength     (§3-B — por procedimento: proc_id, precisao, passo_fraco, tempo_medio, forca, ultima_vez)
DojoTrackState   { familia: "JD"|"FD"|"PD", unlocked, mastered,
                   currentStep?, highestStep?, goodRounds?, weakRounds?, rounds?,
                   attempts?, correct?, avgCorrectRtMs?, lastDay?, facts?, procs? }
DojoSession      { track_id, familia, itens[], acertos_medidos, acertos_recuperados,
                   rt_ou_tempo_medio, resultado_do_round }
```

Para `JD`, `unlocked` salvo é apenas cache/apresentação: a autoridade é sempre a competência-mãe. `currentStep` pode recuar; `highestStep`/conquista nunca regride. O round é a unidade atômica de progressão: abandonar um round no meio não promove faixa. O composer da aula (Bíblia §6) pode pedir ao Dojo um bloco pronto; o treino avulso no templo continua sendo o uso principal. O Dojo lê o Grafo para unlocks e escreve telemetria que o motor adaptativo consome (§11 da Bíblia).

**O que o Dojo NUNCA faz:** não abre treino antes do limiar da mãe · não cria nós `JD*` no Grafo · não chama lentidão de erro conceitual · não mostra cronômetro obrigatório antes dos 7 · não compara crianças · não tira a maior faixa/conquista · não substitui a aula (devolve para ela quando o problema é conceito).

*Changelog: v1.0 (jul/2026) — especificação inaugural: análise Kumon, força por fato, degraus FD, Treino do Mestre, faixas, Jardim do Dojo (JD1-JD5), contratos de dados.*
*v1.1 (jul/2026) — segunda família de fluência: trilhas de PROCEDIMENTO (PD-A/S/M/D/Dec) para os algoritmos armados multi-dígito, com ProcStrength; Dojo reafirmado como pilar autônomo; três camadas explícitas (Jardim → Fato → Procedimento).*
*v1.2 (jul/2026) — QUATRO modos (§2); §4-bis acrescenta degrau zero, comutatividade explícita e eixo Y/socorro visual; vocabulário FAIXA × NÍVEL formalizado.*
*v1.3 (ago/2026) — JD2 e JD3 ganham fichas completas; relógio da Jornada passa a ser silencioso/telemetria e não critério conceitual.*
*v1.4 (ago/2026) — `DOJO_TRILHAS_COMPLETAS.md`, faixas completas, DojoErrorEvent/Radar, inventário de fatos, comutatividade com rt direto/invertido e regra de áudio Sensei × Jardim.*
*v1.5 (ago/2026) — P17/P8: JD5 reconciliada com N1.10 parte-todo; unlock JD no nível 3; progressão JD por precisão + fluência; família JD formalizada nos dados; estado em `dojoTracks`, Radar na mãe, JD fora do DAG. Conteúdo antigo “chegaram mais” fica histórico e exige destino próprio se reaproveitado.*
