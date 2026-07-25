# 📖 FAQ e Glossário da Arquitetura SAGA

Este documento foi criado para desmistificar os nomes, peças e jargões técnicos usados na construção do SAGA. Ele explica como a pedagogia vira código e como as peças se encaixam.

---

## 1. A Hierarquia do Ensino (O que a criança aprende)

*   **Grafo de Conhecimento:** É o "mapa múndi" do aplicativo. Ele lista todas as habilidades que uma criança precisa aprender, conectadas por setas (pré-requisitos). A criança não pode aprender a somar (N3) sem antes saber contar (N1).
*   **Fundações (F0, F1, F2, F3, F4):** São as "Séries" ou "Ano Escolar". 
    *   `F0` = Pré-escola (contagem básica).
    *   `F1` = 1º Ano.
    *   `F2` = 2º Ano, e assim por diante.
*   **Strand (Eixo):** A categoria da matéria. Ex: `N1` (Números/Contagem), `GM` (Grandezas e Medidas), `AL` (Álgebra).
*   **Competência / Nó (Ex: N1.04):** É um degrau específico de aprendizado dentro de um Strand. Exemplo: "N1.04 - Contagem de objetos com cardinalidade".

---

## 2. A Fábrica de Exercícios (Como construímos a tela)

Aqui é onde costuma haver mais confusão. Pense nisso como a produção de um filme:

*   **Ficha (ou Ficha Declarativa / Contrato):** É o **Roteiro do Filme**. É um arquivo de texto (código) que diz exatamente *o que* deve ser cobrado na tela. Ela dita a regra da BNCC, os limites de números (ex: "só números de 1 a 5"), os erros típicos da criança e o que o áudio vai falar. A Ficha **não** desenha imagens, ela só dita as regras.
*   **Kind (Mecânica):** É o **Gênero da Cena** (ação, drama, comédia). Na programação, diz qual é o *estilo* de interação que a Ficha pede. Exemplo de Kinds: `flash` (piscar rápido na tela), `numberline` (uma linha para dar saltos), `balanca` (pesos de um lado e do outro).
*   **Primitiva (Componente Visual / UI):** São os **Atores e o Cenário**. É o componente real construído em React (como o `<EmojiRow />` ou `<Balanca />`). É a peça gráfica, a "mecânica de toque" que a criança vai arrastar e clicar. 
    *   *Resumo:* A **Ficha** pede um exercício do **Kind** "Balança", e o sistema desenha a **Primitiva** gráfica `<Balanca />` na tela.

---

## 3. Os Motores (Quem toma as decisões)

O aplicativo não é apenas um "leitor de PDF". Ele pensa. Para isso, ele usa "Motores" (Engines):

*   **O Composer (O Professor):** É o cérebro que decide qual exercício vem a seguir. Ele olha o Grafo, vê onde a criança está, pega as Fichas correspondentes e monta a "sessão" do dia (o plano de aula).
*   **O Radar (O Diagnóstico):** Ele fica observando os cliques da criança. Se a criança erra 3 vezes seguidas de um jeito específico, o Radar "apita" dizendo que há uma lacuna.
*   **A Oficina (A UTI):** Quando o Radar apita, a Oficina entra em ação. Ela interrompe o jogo normal e inicia uma "Missão de Resgate" focada exatamente na dificuldade que a criança teve.
*   **O Dojo:** É a academia de treinamento intensivo. Aqui a criança treina velocidade (fluência) no que ela já aprendeu, usando repetição espaçada.
*   **O Game Loop (A Televisão):** É a tela principal onde tudo acontece. Ele pega a ordem do *Composer*, chama as *Primitivas* para desenhar os botões, toca o áudio e envia a resposta de volta para o *Radar*. É ele que, no momento, está com os "fios soltos" no nosso projeto.

---

## 4. Jargões de Engenharia e Arquitetura

*   **Falso Verde:** É o que encontramos na nossa auditoria e estávamos resolvendo. Na programação, quando criamos um teste para validar se o jogo funciona, se o teste passar, ele fica "Verde". Um *Falso Verde* é quando o código diz "Passei no teste!", mas na verdade a tela está toda quebrada, invisível ou o áudio não toca. O computador achou que estava certo, mas para a criança estava injogável.
*   **Escada CPA:** É a teoria central da pedagogia do SAGA.
    *   **C (Concreto):** A criança tem que tocar/arrastar (Primitivas como maçãs, cubinhos).
    *   **P (Pictórico/Representacional):** A criança usa símbolos gráficos (Barras de Singapura, Molduras de 10).
    *   **A (Abstrato):** Apenas os números nus e crus (2 + 2 = 4).
*   **Wiring (Fiação / Adapter):** É o ato de conectar fios desconectados. Nós criamos as Primitivas novinhas (botões bonitos) e as Fichas novas (roteiros perfeitos), mas o *Game Loop* (a TV) ainda está conectado nas funções antigas e feias. Fazer o "Wiring" é plugar a TV na tomada nova!
