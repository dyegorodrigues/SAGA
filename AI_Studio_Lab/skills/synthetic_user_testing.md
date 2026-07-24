# 🛠️ Skill: Synthetic User Testing (Simulação Estocástica)

## 📌 Objetivo da Skill
Garantir que **nenhuma competência, currículo ou mecânica de adaptação do SAGA seja lançada sem prova matemática de que funciona**, bem como **auditar e revisar todos os sistemas e currículos já existentes**. 
O Motor de Adaptação de um ITS (Intelligent Tutoring System) é complexo. Para evitar "loops infinitos", becos sem saída ou frustração prolongada, utilizamos **Agent-Based Modeling (ABM)** combinado com **Simulação de Monte Carlo**.

## 🧠 A Base Científica (O que você precisa saber)
1. **Agent-Based Modeling (ABM):** Não testamos componentes isolados. Instanciamos "Agentes" (Synthetic Users) com perfis cognitivos específicos (ex: precisão de 80%, mas com uma lacuna severa em X). 
2. **Estocasticidade:** Crianças erram por acaso. O simulador não é determinístico; ele usa probabilidade (Roleta) para simular erros de atenção.
3. **Orquestração Completa:** A simulação roda a máquina inteira: Motor de Geração, Radar de Lacunas, Oficina (Resgate) e Composer de Sessão em paralelo.
4. **Monte Carlo:** Como há fator sorte, **uma rodada não vale nada**. Rodamos a vida do aluno em lotes (ex: 30 vezes) para extrair a **Mediana** e a **Faixa (Range)** estatística.

## ⚙️ Quando usar esta Skill?
- **Ao criar uma nova trilha ou Mundo (ex: Multiplicação, Frações).**
- **Ao auditar ou revisar exercícios, trilhas e currículos JÁ EXISTENTES.**
- **Ao alterar as regras do `unlockEngine` ou do Radar de Lacunas.**
- **Ao balancear a dificuldade (Física da Oficina ou Academia).**

## 📝 O Protocolo (Passo a Passo da Simulação)
[... O restante do protocolo original permanece o mesmo ...]
