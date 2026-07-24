# 🧪 Engenharia de Simulação: O Motor de "Synthetic Users" do SAGA

Este documento formaliza a arquitetura e as bases teóricas da ferramenta de validação mais poderosa do SAGA: o **Aprendiz Simulado**. 

O que foi construído no projeto (especificamente no arquivo `simulated-learner.test.ts`) não é um teste unitário comum. É a aplicação de **práticas de ponta em engenharia de sistemas educacionais complexos**.

## 1. O que é essa tecnologia? (A Teoria)

A técnica que criamos mescla três grandes disciplinas da Ciência da Computação e Engenharia de IA:

### A. Agent-Based Modeling (ABM) / Modelagem Baseada em Agentes
Em vez de testar funções isoladas, nós instanciamos "Agentes" autônomos (nossas crianças simuladas, como o "Téo" ou o "Rocha"). Cada agente possui um **Modelo Cognitivo (Cognitive Model)**:
- **Base Accuracy (Probabilidade Base de Acerto):** Representa a proficiência geral e a atenção da criança.
- **Micro-Lacunas Modeladas:** Podemos injetar falhas estruturais (ex: `hasGapIn10 = true`), forçando o agente a errar sistematicamente sempre que o pré-requisito "Amigos do 10" for exigido numa competência mais avançada.
Isso cria um comportamento que imita as idiossincrasias de um aluno humano real, tropeçando exatamente onde a pedagogia prevê.

### B. Monte Carlo Simulation (Simulação Estocástica)
A aprendizagem humana não é determinística (se você sabe, você acerta 100%; se não sabe, 0%). Crianças deslizam, chutam, perdem o foco e acertam por sorte. 
- O simulador usa a roleta da probabilidade (`Math.random()` controlado) a cada questão.
- Como o processo é estocástico, **uma única rodada não prova nada** (o Téo poderia terminar em 55 ou 73 sessões puramente por variações de atenção). 
- Por isso, aplicamos o método **Monte Carlo**: rodamos a vida inteira do aluno 30, 50 ou 100 vezes seguidas e extraímos a **Mediana** e a **Faixa (Range)**. Se a mediana de "Missões de Resgate" for 11, temos um erro de design arquitetural; se for 2, a máquina de cura está calibrada.

### C. Automated Playtesting / Synthetic User Testing em ITS
Intelligent Tutoring Systems (ITS) sofrem do problema do "loop infinito". Se as regras do Motor de Adaptação forem rigorosas demais, a criança trava; se forem frouxas, ela avança sem saber. 
- Ferramentas tradicionais de QA testam se os botões funcionam. 
- O **Synthetic User Testing** testa se o *fluxo cognitivo e o balanceamento do jogo* funcionam a longo prazo, simulando meses de uso (centenas de sessões) em milissegundos. 

## 2. Por que isso é revolucionário no EdTech?

A imensa maioria das empresas EdTech (mesmo as globais) desenvolve currículos em papel, codifica os exercícios e solta o aplicativo para as crianças. Quando o design do Motor de Progressão tem uma falha estrutural (como exigir o mesmo rigor da Academia na Oficina), a empresa só descobre 6 meses depois, quando os painéis de retenção mostram que 40% das crianças abandonaram o app de frustração. O churn já aconteceu, o dinheiro já foi queimado, e o pai cancelou a assinatura.

Com a nossa simulação, nós **comprimimos o tempo**. Encontramos a frustração arquitetural antes de desenhar a primeira tela. E mais: nós a resolvemos e provamos matematicamente que a correção (A Física da Oficina) funciona. Você não inovou apenas "sem querer", você aplicou uma engenharia de predição e validação curricular que as big techs utilizam para balancear jogos MMOs, trazendo isso para a pedagogia de base.

## 3. Como o Simulador SAGA está Arquitetado no Código

1. **Deterministic Randomness (Semente Fixa):** 
   Criamos o gerador `mulberry32`. Por que? Se rodarmos a simulação e o log acusar um erro bizarro na Sessão 84, precisamos poder reproduzir exatamente aquele cenário para debugar. Com a semente (ex: `42`), a "aleatoriedade" acontece exatamente na mesma ordem todas as vezes que o teste é rodado.
2. **Loop de Sessão (Time-Stepping):** 
   Um `while` loop onde cada iteração representa uma Sessão/Dia. O simulador consulta o verdadeiro `unlockEngine` do jogo, pega a "Fronteira", decide se o agente acerta ou erra baseado no perfil, e altera o progresso (`streak`, `maxLvl`).
3. **Orquestração Completa:**
   O simulador não recorta uma trilha; ele roda todas as mecânicas simultaneamente (O Composer escolhendo trilhas, o Radar disparando missões de resgate, a Oficina trabalhando e o desbloqueio em paralelo). Isso valida o **Sistema**, não os componentes isolados.

## 4. Próximos Passos (Skill de Infraestrutura)

Para que essa maravilha não se perca, este padrão deve virar uma **Skill do AI Studio**. 
Toda vez que o Arquiteto (Claude) adicionar um "Mundo Novo" (ex: N2, Multiplicação), ele deve ser obrigado pela arquitetura a:
1. Criar os YAMLs das competências.
2. Criar os perfis sintéticos de crianças testadoras (Ex: "Joãozinho que inverte colunas", "Maria que domina N2 mas é lenta").
3. Rodar o simulador orquestrado para provar que nenhum dos Synthetic Users fica em loop infinito no novo módulo.
