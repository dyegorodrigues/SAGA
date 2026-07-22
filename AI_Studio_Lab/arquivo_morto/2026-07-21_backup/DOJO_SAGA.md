# 🥋 DOJO SAGA — A Academia de Fluência

**Este documento é a especificação completa do Dojo — a semente original do projeto.** A ideia nasceu assim: um "Kumon digital" para treinar aritmética até o domínio absoluto. O projeto cresceu ao redor (o Grafo ensina, o Manual explica), mas o Dojo continua sendo o coração do treino: **o lugar onde o que foi COMPREENDIDO nas aulas vira REFLEXO**. Compreensão sem fluência trava a criança nos problemas grandes (a memória de trabalho lota calculando o básico); fluência sem compreensão é a decoreba que quebra. O SAGA exige as duas — em lugares diferentes: a aula ensina, o Dojo automatiza.

---

## §1. O KUMON DISSECADO — o que copiamos, o que corrigimos

O método Kumon acertou coisas que quase ninguém acerta. E errou coisas que só um sistema vivo consegue corrigir. O Dojo é a resposta ponto a ponto:

**Forças do Kumon (absorvidas):**
1. **Prática diária curta** — melhor 5 minutos todo dia que 1 hora no sábado. → Dojo: 1 bloco por sessão, 3-5 min.
2. **Incrementos minúsculos** — do 1+1 ao cálculo avançado em milhares de degraus quase imperceptíveis. → Dojo: as trilhas FD decompostas em micro-degraus (§4).
3. **Maestria antes de avançar** — só sobe quem domina. → Dojo: força por fato ≥ alvo antes do próximo degrau.
4. **Voltar ao fácil de propósito** — quando trava, recua para reconstruir confiança. → Dojo: rounds de aquecimento sempre abaixo do nível atual + recuo automático sem cerimônia.
5. **Autonomia e ritmo próprio** — cada criança na sua folha. → Dojo: nada de turma, nada de comparação.

**Fraquezas do Kumon (corrigidas):**
1. **Repetição cega e tediosa** — a folha não sabe QUAIS fatos você erra; repete tudo. → Dojo: rastreio POR FATO (§3): treina o que está fraco, não o que está forte. É a vantagem estrutural que papel nunca terá.
2. **Zero ensino conceitual** — Kumon treina, não explica; a criança automatiza sem entender. → Dojo: **nenhuma trilha FD abre antes da competência-mãe estar em nível ≥ 4 nas aulas** (a compreensão SEMPRE vem primeiro — regra de desbloqueio do Grafo, Apêndice A).
3. **Sequência fixa e igual pra todos** — ignora o padrão individual de erro. → Dojo: o Treino do Mestre monta cada sessão do estado real da criança (§5).
4. **Feedback binário e tardio** — certo/errado corrigido depois, sem estratégia. → Dojo: erro dispara a estratégia do fato na hora (o "quebra o bloco" do 7×6, a "ponte" do 8+5 — as MESMAS estratégias do Manual, agora em velocidade).
5. **Volume que esmaga** — folhas longas geram choro e desistência. → Dojo: rounds de 10-20 itens, término SEMPRE em vitória, sem lição de casa.
6. **Inútil para quem não lê nem conta** — Kumon começa onde a criança já opera símbolos. → Dojo: o Jardim do Dojo (§7) treina fluência PRÉ-simbólica (subitização flash, molduras) desde os 4 anos.

---

## §2. OS DOIS MODOS

**🥋 Treino do Mestre (padrão).** O algoritmo monta o treino do dia (§5). É o modo da sessão normal: 1 bloco de Dojo dentro da aula (Bíblia §6) ou treino avulso quando a criança abre o Dojo direto. A criança não escolhe nada — senta e treina, como no tatame.

**🎯 Treino Livre.** A criança escolhe QUAL trilha destravada quer treinar ("hoje quero tabuada do 7"). Autonomia real: dá senso de controle, deixa treinar para o "teste de amanhã", e o algoritmo aproveita — dentro da trilha escolhida, ele ainda decide os itens (os fatos fracos dela naquela trilha). Escolha do quê; ciência do como.

Em ambos: sem nota, sem ranking entre crianças, sem punição. O adversário é o próprio tempo de ontem.

---

## §3. O CORAÇÃO: FORÇA POR FATO

A unidade do Dojo não é "a tabuada do 7" — é **cada fato individual** (7×6 é um registro; 7×8 é outro). Cada fato tem:

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

**Um fato "vale faixa"** quando força = 5. Uma trilha avança de degrau quando ~90% dos fatos do degrau estão em força ≥ 4.

---

## §4. OS DEGRAUS — as trilhas FD decompostas (o espírito Kumon, granulado)

Cada trilha FD do Grafo se abre em micro-degraus. A progressão canônica (exemplo completo da FD3, +/− até 20; as demais seguem o mesmo desenho):

```
FD3.1  +1/+2 e −1/−2 (vizinhos da reta)        FD3.6  −e depois do 10 (voltar pelo 10)
FD3.2  +0/−0 e o próprio número (n−n=0)        FD3.7  mistos ± até 20, lote equilibrado
FD3.3  dobros até 20                           FD3.8  o buraco: 8+__=15, 14−__=6
FD3.4  quase-dobros                            FD3.9  três parcelas rápidas (2+5+3)
FD3.5  +atravessando o 10 (ponte)              FD3.10 faixa-preta: tudo misturado, rt no alvo
```

**Receita de cada round (10-20 itens):** ~60% do degrau atual · ~20% revisão dos degraus anteriores (intercalada — interleaving, que consolida mais que bloco puro) · ~10% fatos da fila quente (errados recentes) · ~10% UM degrau acima, como amostra grátis (se acerta, acelera a promoção). Sempre: **os 3 últimos itens são fáceis** — toda sessão termina em vitória.

**Recuo sem cerimônia:** 2 rounds seguidos com precisão < 60% no degrau → o próximo treino começa um degrau abaixo, sem aviso, sem "você caiu". A criança só sente que "hoje fluiu". (Kumon fazia isso com folhas; aqui é invisível e instantâneo.)

---

## §5. O TREINO DO MESTRE — o algoritmo da sessão

Ao montar um treino, o Mestre decide em ordem:

1. **Qual trilha?** A mais "necessitada" entre as destravadas, por prioridade: (a) trilha com fila quente não zerada → ela; (b) senão, a mais enferrujada (maior tempo sem treino × mais fatos decaídos); (c) senão, a mais avançada ativa (progresso). Alterna para nunca abandonar trilha velha: no máximo 3 treinos seguidos na mesma.
2. **Quais fatos?** A receita do §4, escolhendo dentro de cada fatia os fatos de MENOR força (o oposto exato do papel: o Kumon repete o que você já sabe; o Mestre caça o que você não sabe).
3. **Que formato?** Rotação de formatos para o mesmo fato (7×6 direto · 42÷7 · 7×__=42 · o array relâmpago) — a fluência de verdade é reconhecer o fato de qualquer ângulo, não decorar uma pergunta.
4. **Que ritmo?** rt-alvo do degrau; sem cronômetro VISÍVEL antes dos 7 anos (a pressa visual gera pânico motor — o tempo é medido em silêncio). 7+ anos: o cronômetro é opcional e a criança escolhe ligá-lo (muitos ADORAM — mas é escolha).

**Quando um fato erra 2× na mesma sessão:** o Dojo pausa a velocidade e injeta a ESTRATÉGIA daquele fato (15s): o 7×6 abre no quebra-bloco 5×6+2×6; o 8+5 abre na ponte do 10; o 13−6 abre no voltar-pelo-10. **A estratégia é o paraquedas — a mesma do Manual, encurtada.** Depois, o fato volta em velocidade. Se a estratégia-mãe também falhar, o problema não é de fluência: o Mestre encerra o treino da trilha e sinaliza a competência-mãe como frágil (vira resgate na próxima aula — Bíblia §11). O Dojo NUNCA vira aula à força; ele devolve pra aula.

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

A resposta ao "e o meu filho de 4?": fluência pré-simbólica existe, e é a MAIS importante — é o alicerce perceptual de todo cálculo mental futuro (a linhagem do soroban/anzan: primeiro o olho, depois a imagem mental, por último o símbolo). Trilhas do Jardim (destravam pelas competências N1, como as FD):

- **JD1 · Olhômetro Relâmpago** (mãe: N1.03): bolinhas piscam 1,5s → some → toca a quantidade (respostas como conjuntos de bolinhas, depois numerais quando N1.06 ≥ 3). Progressão: 1-3 → 1-5 → arranjos de dado → arranjos irregulares → **flash de 0,8s** (o olho ficando anzan).
- **JD2 · A Mão Relâmpago** (mãe: N1.08): mãos/dedos piscam → quanto? (a sub-base 5 virando reflexo: 4 é "mão sem polegar" SEM contar).
- **JD3 · Moldura Relâmpago** (mãe: N1.11): a moldura de 10 pisca com 7 → *"quantos FALTAM pra encher?"* — os amigos do 10 nascendo como percepção de vazio, não como conta.
- **JD4 · O Passo Seguinte** (mãe: N1.07/N1.09): "cinco!" (áudio) → toca o que vem depois, cada vez mais rápido; depois contar de 2 em 2 no ritmo do tambor (semente de AL.03 e das tabuadas).
- **JD5 · Ver e Imaginar** (mãe: N1.08, o degrau anzan): mostra 3 bolinhas, esconde, *"chegaram mais 2"* (só áudio + som de plim-plim) → quanto tem AGORA atrás da cortina? A criança opera sobre a IMAGEM MENTAL — o começo do cálculo de cabeça de verdade, aos 5 anos, sem um símbolo na tela.

Regras do Jardim: tudo áudio-first, rounds de 6-10 itens, 2-3 min, zero cronômetro visível, o flash é o único relógio. Erro → a cena reaparece parada para contar com o dedo (o concreto sempre disponível como rede).

---

## §8. NA TELA E NOS DADOS

**UI:** o Dojo é um LUGAR no mapa (o templo no topo da montanha), com o Mestre-mascote próprio. Dentro: o pergaminho de faixas por trilha, o botão único "Treinar" (Mestre) e a estante de trilhas (Livre). Métricas visíveis para a criança: faixa, chama, recorde. Métricas do painel dos pais: força média por trilha, fatos mais fracos (os "7×8 da vida" dela, nominalmente), minutos treinados, gráfico de rt caindo — a prova visual da fluência chegando.

**Contratos de dados (novos, a implementar):**
```
FactStrength     (§3 — por fato)
DojoTrackState   { fd_id, degrau_atual, faixa, ultima_prova }
DojoSession      { fd_id, itens[], acertos, rt_medio, fila_quente_restante }
```
O composer da aula (Bíblia §6) pede ao Dojo 1 bloco pronto; o Dojo devolve o round montado pelo Mestre. O Dojo lê o Grafo (unlocks das FD/JD) e escreve telemetria que o motor adaptativo consome (§11 da Bíblia) — fatos cronicamente fracos são sinal de competência-mãe frágil.

**O que o Dojo NUNCA faz:** não abre trilha sem a mãe dominada nas aulas · não mostra cronômetro antes dos 7 · não compara crianças · não tira faixa · não passa de 5 min por bloco · não substitui a aula (devolve pra ela quando o problema é conceito).

*Changelog: v1.0 (jul/2026) — especificação inaugural: análise Kumon, força por fato, degraus FD, Treino do Mestre, faixas, Jardim do Dojo (JD1-JD5), contratos de dados.*
