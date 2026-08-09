# FICHA P22-N1.09 — Contagem flexível até 20
**Competência:** N1.09 · **Primitiva:** `ScatteredItems` + `plain` · **Faixa:** F0

## 1. Objetivo observável
A criança conta conjuntos de 10 a 20 elementos, continua uma sequência iniciada em um número interno e realiza uma regressiva simples sem precisar reiniciar a contagem no 1.

A ficha mede três componentes que precisam coexistir para N1.09 estar realmente dominada: cardinalidade em conjuntos maiores, flexibilidade para iniciar a sequência em N e reversibilidade inicial da sequência numérica.

## 2. Pré-requisitos
- **N1.04 — contagem por toque/correspondência um-a-um:** sustenta a contagem de conjuntos sem perder nem recontar objetos.
- **N1.02 — sequência oral estável:** fornece a ordem verbal necessária para continuar e inverter pequenos trechos da sequência.

`N1.13` não é pré-requisito nem substituto. Produzir uma quantidade pedida e continuar uma sequência iniciada em outro ponto são habilidades distintas. `JD4` também não substitui N1.09: JD4 automatiza vizinhos de N1.07 depois da compreensão conceitual.

## 3. Escada de cinco níveis
1. **Contar 10–15 objetos:** conjunto disperso, escopo ainda reduzido.
2. **Contar 10–20 objetos:** amplia a cardinalidade sem mudar a mecânica.
3. **Partir de N:** recebe um número interno entre 4 e 17 e precisa escolher os três termos seguintes, sem voltar ao 1.
4. **Regressiva:** recebe um início entre 3 e 10 e escolhe os três termos anteriores; os casos incluem chegada ao zero.
5. **Recuperação mista:** alterna contagem de objetos, continuação a partir de N e regressiva sem anunciar previamente qual família será usada.

O nível 5 declara `rt_alvo = 20 s` **somente como metadado de fluência/Dojo**. Ele não reprova a criança, não reduz `mast` e não participa do critério de domínio conceitual da Jornada; o limite é deliberadamente folgado porque uma questão mista pode exigir contar até 20 objetos.

## 4. Cena e roteiro
Nos níveis 1–2, a tela apresenta objetos grandes, separados e visualmente contáveis. A voz diz: **“Conte os objetos. Quantos há?”** O numeral é escolhido depois da contagem; texto é apoio, não requisito de leitura.

No nível 3, a cena mostra apenas o ponto de partida, por exemplo `7 → …`, e alternativas de três passos. A voz diz: **“Comece no sete. Qual trilha continua a contagem certinho?”** Exigir três termos evita confundir a competência com um simples teste de sucessor.

No nível 4, a direção é explicitamente invertida: **“Comece no seis e conte para trás. Qual trilha está certa?”** O nível 5 mistura as três famílias para observar flexibilidade, não memorização do formato da tela.

## 5. Exemplos e não-exemplos
**Exemplos:**
- 13 objetos → `13`;
- começar em 7 → `8 · 9 · 10`;
- começar em 6 e voltar → `5 · 4 · 3`;
- começar em 3 e voltar → `2 · 1 · 0`.

**Não-exemplos diagnósticos:**
- 7 → `1 · 2 · 3`: dependência de reiniciar no 1;
- 7 → `7 · 8 · 9`: deslocamento de uma posição;
- 7 → `8 · 10 · 9`: sequência quebrada, sem hipótese causal forte suficiente para diagnóstico automático;
- regressiva 6 → `7 · 8 · 9`: direção invertida;
- em conjuntos, escolher 14 quando há 15: erro de cardinalidade próximo ao alvo, tratado inicialmente como `OFF_BY_ONE`.

## 6. Erros e feedback
- **`NAO_CONTA_A_PARTIR_DE`:** quando a alternativa reinicia em `1 · 2 · 3`, o feedback retoma oralmente a sequência a partir do número dado, sem pedir que a criança volte ao começo.
- **`DIRECAO_ERRADA`:** em regressiva feita para frente, a intervenção contrasta “para frente” e “para trás” com uma pequena trilha numérica.
- **`OFF_BY_ONE`:** em contagem ou sequência deslocada uma posição, a criança reconfere o ponto de partida ou faz correspondência um-a-um.
- **ordem quebrada sem hipótese segura:** registra o erro da tentativa, mas não fabrica uma misconception no Radar. Diagnóstico forte exige evidência repetida, não uma alternativa isolada.

## 7. Linguagem pré-leitora e acessibilidade
Áudio carrega toda instrução essencial. Numerais, objetos e direção da sequência são a linguagem primária; frases visíveis são suporte ao responsável e a crianças que já leem.

Objetos não podem se sobrepor nem ficar pequenos demais para contagem em 320 px. Alternativas precisam manter touch targets inteiros em 320/390/900 px. Nenhuma resposta deve depender de distinguir cor sutil, ler texto longo ou executar gesto de precisão fina.

## 8. Evidência de domínio
Domínio exige evidência em mais de uma sessão e nas três famílias: contar conjuntos 10–20, continuar a partir de N e fazer regressiva simples. Acertar apenas “qual número vem depois?” não é evidência suficiente.

A recuperação mista do nível 5 funciona como contraprova de formato: a criança precisa reconhecer a demanda da situação e não apenas repetir a estratégia da questão anterior. `rt_alvo` pode informar fluência, mas não substitui precisão, retenção e cobertura das três famílias e não governa a coroa conceitual.

## 9. Rollback e contraprovas
O legado `gVis_Sequence` permanece disponível como **rollback operacional**, não como cânone pedagógico. Ele cobre continuação de sequência de forma parcial e não prova contagem de conjuntos 10–20 nem regressiva.

Contraprova obrigatória: uma criança que responde corretamente ao sucessor imediato, mas não consegue contar 17 objetos ou continuar `6 → 5 → 4 → 3`, **não domina N1.09**. Da mesma forma, produção de quantidade de N1.13 e automaticidade de JD4 não podem conceder domínio por procuração.