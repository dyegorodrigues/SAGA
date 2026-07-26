# 🥋 Proposta Arquitetural e Pedagógica: O Novo Dojo Adaptativo (Ginástica Mental)

## 1. O Problema Atual
Atualmente, o Dojo está organizado como uma lista de "Treinos Específicos" (Amigos do 10, Dobros, etc.) agrupados por eixos. Isso é bom para um currículo estruturado, mas falha em um aspecto crucial: **não serve como uma "ginástica" livre, contínua e adaptativa.** 
Se a criança quer simplesmente "treinar adição", ela não quer escolher qual micro-regra (N3.05, N3.06) vai fazer. Ela quer apertar um botão "Treinar Adição" e o sistema deve ser inteligente o suficiente para saber o nível dela, aquecê-la, e puxar o limite.

## 2. A Solução: As "Academias de Operação" (O Tutor Automático)
Em vez de listar dezenas de trilhas, o Dojo principal terá **As Grandes Academias**:
- ➕ Academia da Adição
- ➖ Academia da Subtração
- ✖️ Academia da Multiplicação
- ➗ Academia da Divisão
- 🍕 Academia das Frações

(Essas academias são liberadas conforme o progresso na Jornada. Uma criança de 5 anos verá apenas Adição, e quem sabe, Subtração).

## 3. A Dinâmica Interna (O Algoritmo de "Escada Rolante")
Quando a criança entra na **Academia da Adição**, ela entra num fluxo *infinito* (ou com tempo limite, ex: 3 minutos) regido pelo **Tutor Automático**.

O Tutor monitora o **"Elo" (Nível de Força)** da criança naquela operação e ajusta a dificuldade questão a questão.

### A Escada CRA (Concreto -> Representacional -> Abstrato) Dinâmica:
*   **Fase 1: O Aquecimento Concreto (Somas até 5 ou 10)**
    *   *Visual:* Apenas objetos ou objetos + números pequenos. (Ex: 🍎🍎 + 🍎).
    *   *Objetivo:* Lembrar o cérebro de como a operação funciona fisicamente.
*   **Fase 2: Transição Representacional (Somas até 20)**
    *   *Visual:* Números grandes + Apoio visual menor (ex: Molduras de 10 preenchidas).
*   **Fase 3: Fluência Abstrata (Somas até 20, sem apoio)**
    *   *Visual:* Só os números (Ex: 7 + 8).
    *   *Objetivo:* Velocidade de recuperação da memória (Rapid Fire).
*   **Fase 4: Desafio Mental (Somas maiores que 20)**
    *   *Visual:* Números puros, exigindo cálculo de cabeça ou reagrupamento (Ex: 24 + 15).

### Como o Algoritmo Modula:
- **Acertos Consecutivos (Rapidez):** O sistema sobe o degrau. Tira as imagens, aumenta os números.
- **Hesitação (Demora para responder):** O sistema mantém a dificuldade, mas não sobe.
- **Erro:** O sistema desce um degrau **imediatamente**. Se a criança errou 8 + 5 no Abstrato (Fase 3), a próxima questão será algo como 7 + 4, mas **trazendo as imagens de volta** (Fase 2), para o cérebro "re-ancorar" o conceito.

## 4. Onde isso entra no Código (Arquitetura)
Isso exigirá a criação de um **"AdaptiveComposer"** (ou `GymComposer`). Diferente do `Composer` atual, que obedece estritamente às métricas de uma *Ficha de Competência* (ex: 4 acertos e encerra), o `GymComposer`:
1. Não tem fim pré-determinado (roda por tempo ou por exaustão).
2. Não lê uma `Ficha` estática. Ele lê o `Elo` (nível atual) da criança na `Adição` e gera os parâmetros para os `generators` em tempo real.
3. Altera a prop `crossedOut` ou o `flash_ms` dinamicamente com base na resposta anterior.

## 5. Como o Menu Dojo Vai Ficar Visualmente
1. **Dojo Livre (Desafio do Mestre):** Continua sendo o misturão insano para quem já domina tudo.
2. **Ginásio de Fatos Básicos:** Os botões grandes das 4 operações (➕, ➖, ✖️, ➗). Aqui é onde a mágica adaptativa acontece. O sistema guarda a nota e o nível máximo atingido em cada uma.
3. **Treinos Cirúrgicos:** Escondidos num sanfoninha "Ver Treinos Específicos", caso o pai ou a criança queira treinar *exatamente* "Amigos do 10" (pra não poluir a tela).

## 6. Resumo Pedagógico
Isso cumpre exatamente o que você pediu: um treino de "ginástica" de contas básicas. Começa no concreto (com os desenhos, 1+1, 2+2), progride para o misto (desenhos + números), avança para o abstrato (só números). Aquece o cérebro dos avançados e nivela suavemente os iniciantes. Se tropeçar no mental, os desenhos voltam para resgatar. É a verdadeira inteligência artificial atuando como Tutor.
