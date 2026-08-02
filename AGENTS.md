# SAGA — Instruções para Agentes de Engenharia

## 1. Escopo deste arquivo

Este arquivo define as regras operacionais para agentes que trabalham no SAGA.
Ele não substitui os documentos pedagógicos e curriculares.

Hierarquia das fontes:

1. `AGENTS.md`: processo operacional e segurança de engenharia.
2. `AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md`: autoridade pedagógica.
3. `AI_Studio_Lab/pedagogia/GRAFO_DE_CONHECIMENTO_SAGA.md` e artefatos
   canônicos do grafo: competências, pré-requisitos e progressão.
4. `AI_Studio_Lab/pedagogia/MANUAL_DIDATICO_SAGA.md`,
   `DOJO_SAGA.md` e `PRIMITIVAS_SAGA.md`: contratos especializados.
5. `AI_Studio_Lab/pedagogia/PLANO_MESTRE_SAGA.md`: ordem estratégica.
6. `AI_Studio_Lab/codex/HANDOFF_CONTINUIDADE_IA.md`: estado operacional atual.
7. `AI_Studio_Lab/DIARIO_DE_BORDO.md`: histórico e evidências recentes.

Em caso de conflito, não invente uma conciliação silenciosa. Identifique o
conflito, determine qual fonte possui autoridade sobre o tema e registre a decisão.

## 2. Princípios invariantes do SAGA

- Público: crianças de 4 a 12 anos.
- Idioma: PT-BR.
- Experiência áudio-first e acessível para criança não leitora.
- Feedback positivo e nunca punitivo.
- Método CRA.
- Progressão por grafo DAG e proficiência.
- Uma tela, uma pergunta e uma ação dominante.
- Geração determinística e funcional sem IA em tempo de aula.
- Erro é evidência diagnóstica, não punição.
- Preservar privacidade infantil e minimizar reads/writes do Firestore.

Alterações que afetem pedagogia, progressão, conteúdo, diagnóstico, áudio
instrucional ou comportamento infantil exigem consulta aos documentos canônicos
correspondentes.

## 3. Loop adaptativo de engenharia

Aplique o processo com profundidade proporcional ao risco:

1. **Classificar**
   - pergunta, investigação, planejamento, edição, depuração ou publicação.

2. **Definir conclusão**
   - declarar quais evidências demonstram que a tarefa terminou.

3. **Investigar**
   - ler somente os arquivos e documentos relevantes;
   - verificar Git e dependências;
   - não presumir estado com base apenas na conversa.

4. **Mapear impacto**
   - considerar contratos, runtime, persistência, telemetria, acessibilidade,
     áudio, pedagogia e compatibilidade;
   - para mudanças pequenas, manter o mapa proporcional ao risco.

5. **Decidir**
   - escolher a menor intervenção que resolve a causa;
   - considerar alternativas quando houver trade-off relevante;
   - registrar premissas e riscos, não raciocínio interno irrestrito.

6. **Implementar**
   - editar cirurgicamente;
   - preservar mudanças existentes;
   - não adicionar placeholders;
   - não misturar trabalho não relacionado.

7. **Verificar**
   - executar primeiro testes focalizados;
   - depois executar os gates compatíveis com o impacto;
   - para mudanças visuais, validar a experiência infantil;
   - nunca declarar sucesso sem evidência real.

8. **Revisar**
   - inspecionar o diff;
   - procurar regressões, duplicação, vazamento de escopo e complexidade acidental;
   - ajustar a solução quando a evidência contrariar a hipótese inicial.

9. **Reportar**
   - informar fatos, comandos, resultados, limitações, riscos e ponto de continuidade.

## 4. Adaptação e estratégia de fallback

Se a mesma abordagem falhar repetidamente:

- não repita o mesmo comando ou patch mecanicamente;
- preserve alterações do usuário e de outros agentes;
- diagnostique se a causa é lógica, ambiente, dependência, teste ou requisito;
- mude de estratégia;
- reduza o problema;
- documente o bloqueio quando não houver progresso seguro.

Nunca execute reset destrutivo, descarte alterações ou reverta trabalho de terceiros
sem autorização explícita.

## 5. Arquitetura e qualidade

- Favoreça módulos coesos e testáveis.
- Arquivos frontend acima de aproximadamente 350–400 linhas são sinal de revisão,
  não motivo automático para fragmentação.
- Extraia componentes quando houver responsabilidades distintas, estado isolável,
  reutilização real ou dificuldade de teste.
- Não crie abstração para um único caso sem benefício comprovado.
- Não coloque decisões visuais em geradores.
- Não coloque decisões pedagógicas em renderers.
- Procedimentos matemáticos devem preferencialmente ser funções puras.
- Evite lógica especial crescente dentro de `GameLoop`.
- Não envolva imports em try/catch.

## 6. Experiência infantil

Para qualquer mudança perceptível pela criança, verificar:

- compreensão sem leitura;
- áudio reproduzível;
- uma ação dominante;
- alvos de toque adequados;
- foco e teclado;
- contraste;
- ausência de rolagem na viewport-alvo;
- erro gentil;
- transições que não aceitem toque acidental;
- `prefers-reduced-motion`;
- desempenho em dispositivo modesto;
- animação pedagógica separada de animação decorativa.

Mudanças visuais perceptíveis exigem inspeção visual ou screenshot quando o
ambiente permitir.

## 7. Git e publicação

- Verifique a árvore antes de editar.
- Não sobrescreva alterações não identificadas.
- Use branch inédita criada da `origin/main` atualizada para cada lote.
- Não reutilize branch de PR mesclado.
- Não use “Update branch” nem editor web para conflitos pedagógicos.
- Não adicione binários a PRs textuais.
- Separe implementação, canário, promoção e redesign em mudanças distintas.
- Faça commit, push ou PR somente quando a tarefa ou o operador solicitar.
- Antes de publicar, revise o diff, prove a base e execute os gates do projeto.

## 8. Pesquisa e decisões atuais

Pesquise fontes externas quando:

- o usuário pedir;
- a informação puder ter mudado;
- houver dúvida técnica relevante;
- segurança, licença, preço ou compatibilidade dependerem de informação atual.

Prefira documentação oficial e fontes primárias. Registre quando uma conclusão
for inferência. Não pesquise por ritual quando o repositório já possuir evidência
suficiente.

## 9. Comunicação

- Não peça confirmação para decisões locais reversíveis dentro do escopo.
- Peça esclarecimento apenas quando houver ambiguidade que possa causar alteração
  pedagógica, perda de dados, mudança de escopo ou custo significativo.
- Não exponha cadeia de pensamento privada.
- Forneça decisões, alternativas, evidências, riscos e resultados verificáveis.
- Diferencie claramente:
  - fato observado;
  - inferência;
  - recomendação;
  - limitação do ambiente.
