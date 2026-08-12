# Mapa mestre pós-P20 — SAGA

> **Fonte operacional vigente a partir de 8/ago/2026.**
>
> Este arquivo existe para impedir que roadmaps históricos de 5/ago sejam lidos como fila atual. Eles continuam valiosos como registro de raciocínio, mas números, estados de canário e “próximo passo” devem ser recalculados no runtime antes de qualquer execução.

## 0. Regras de trabalho

- Repo: `dyegorodrigues/SAGA`.
- Branch cumulativa: `codex/integrar-bloco-f0`.
- `main` protegida: `68fad4c575e28959b2ca4776e9a541d6828b63f3`.
- Não mergear PR #29; manter draft/no-merge.
- Não tocar nas branches do Creature Engine.
- Uma promoção de canário = um id / um commit / rollback claro.
- Workflows/scripts temporários precisam se apagar no mesmo lote.
- Existir não é estar certo; documento antigo não vence runtime/teste/cânone atual.

## 1. Estado fechado

### P17 — representação e parte-todo

- N1.10 ativa: JD5 perceptual → retirada real de moldura → NumberBond.
- `SEM_MOLDURA` é gate antes da formalização.
- N1.11 ativa: JD3 perceptual → F28 NumberBond → `n + □ = 10`.
- tempo não coroa compreensão da Jornada.

### P8 — Jardim do Dojo

- JD1 → N1.03
- JD2 → N1.08
- JD3 → N1.11
- JD5 → N1.10
- estado em `dojoTracks`;
- automaticidade separada da compreensão;
- UI Garden real;
- QA visual permanente.

**JD4 permanece dívida confirmada.**

### P18 — KindType

Todo kind autoral declarado tem builder no Composer. Legado continua permissivo em `Question.kind`.

### P19 — estado/dependências

- migrador único em `src/utils/migrator.ts`;
- audit npm completo e produção = 0 após remediação mínima do lockfile.

### P20 — identidade do save

- local por Firebase UID;
- legado com reivindicação controlada;
- bootstrap único;
- migração antes da reconciliação;
- debounce carrega UID de origem;
- anonymous→Google preserva UID por link;
- logout faz flush antes de sair.

Documento: `DECISAO_P20_IDENTIDADE_SAVE.md`.

## 2. Canários e fichas registradas — estado atual conhecido

Ativos em `composerCanaryIds.ts`:

- N3.09, N3.10;
- N4.03, N4.04, N4.06, N4.07, N4.08;
- N1.07;
- N1.01, N1.02, N1.03, N1.04, N1.06, N1.08, N1.10, N1.11, N1.13;
- AL.01, AL.02;
- GE.01, GE.02;
- GM.01.

Registradas mas deliberadamente fora da lista ativa:

- `N4.09`;
- `GM.12`.

Essa lista precisa ser recalculada pelo código sempre que o mapa for revisado.

## 3. Próxima fase imediata — P21: reconciliação das fontes de verdade

Antes de construir outro conteúdo, limpar a **fila**, não o histórico.

### Objetivo

Produzir um inventário atual, calculado, de:

- quantidade real de nós do grafo;
- quais nós têm ficha autoral;
- quais estão ativos/registrados/fallback/legado;
- quais primitivas existem e quais são runtime executável;
- quais fichas divergem do runtime;
- quais dívidas antigas foram fechadas;
- quais continuam reais.

### Documentos a reconciliar

- `RETOMADA.md` — deve ser curto e atual;
- `ROTEIRO_ATE_O_FIM.md` — manter como histórico/estratégia, mas marcar números e fila antigas como superadas;
- `PLANO_DO_BLOCO_F0.md` — preservar análise histórica; atualizar estados que ainda são usados como referência operacional;
- `HANDOFF_CONTINUIDADE_IA.md`;
- `BRIEFING_CODEX.md`;
- PR #29.

Não reescrever decisões históricas para parecer que nunca houve divergência. Marcar como **SUPERADO** e apontar para este mapa.

## 4. Backlog técnico/pedagógico confirmado ou a revalidar

### 4.1 N4.09 — registrada, não promovida

Não ativar só porque está pronta no Composer. Reabrir ficha + runtime + prints + nível 4 carregado + rollback e só então decidir promoção isolada.

### 4.2 GM.12 — registrada, em observação

F50 foi implementada e corrigida visual/pedagogicamente. Continua fora dos canários por decisão deliberada. Reavaliar em lote próprio.

### 4.3 JD4 — dívida confirmada do Jardim

O catálogo `JARDIM` contém JD1/JD2/JD3/JD5 e documenta explicitamente a ausência de JD4. Antes de implementar:

- reler cânone JD4;
- comparar com N1.07 atual;
- decidir relação mãe/trilha;
- provar que não duplica competência da Jornada;
- definir `rt_alvo`, níveis, erros e transição para símbolo.

### 4.4 Primitivas futuras

`Moedas` e `Regua` continuam nomes pendentes conhecidos. Só implementar quando a ficha/gargalo real exigir. Não criar infraestrutura sem cliente comprovado.

### 4.5 Dívida de coreografia antiga — REVALIDAR

Roadmap histórico nomeia:

- N3.10;
- N4.03;
- N4.04;
- N4.06;
- N4.07;
- N4.08 níveis 3–5.

Arquivos atuais ainda exibem fichas com `howto/explain`, mas isso não prova momento de ensino/coreografia executável. Auditar cada uma contra §4/§8 da ficha antes de declarar dívida fechada ou aberta.

### 4.6 P4 / teste intermitente antigo — REVALIDAR, não carregar como verdade

O registro de 5/ago dizia que uma suíte falhou uma vez e não reproduziu em sete. Consultar CI/testes atuais; se não houver assinatura identificável, manter como histórico, não como tarefa infinita.

## 5. Auditoria dos motores adaptativos — antes da auditoria pedagógica final

O SAGA só vira tutor inteligente se as decisões longitudinais estiverem corretas. Fazer uma auditoria própria dos motores, com testes de trajetória, não apenas unit tests locais.

### Motores/fluxos

- `progressEngine`;
- Composer / Minha Aula;
- Radar / misconceptions;
- Oficina / resgate;
- Jardim;
- Dojo de fatos (FD/Sensei);
- Dojo de procedimentos (PD);
- matrícula/placement;
- desafio misto;
- revisão espaçada/Leitner/retenção;
- domínio/coroa/evidências;
- unlock pelo grafo;
- telemetria usada para decisão.

### Perfis sintéticos obrigatórios

Simular pelo menos:

1. entende, mas responde devagar;
2. responde rápido chutando;
3. repete a mesma misconception;
4. alterna erros sem padrão;
5. aprende hoje e esquece depois;
6. forte no visual, fraco no simbólico;
7. dependente de andaime;
8. retorna após dias/semanas;
9. erra primeiro e recupera com dica;
10. domina conceito-mãe, mas ainda não automatizou;
11. acelera sem compreensão;
12. criança muito acima da faixa inicial.

### Perguntas de aceitação

- escolhe a próxima tarefa certa?
- sabe voltar ao pré-requisito certo?
- diferencia erro conceitual de lentidão/motor?
- sabe retirar andaime sem salto representacional?
- mantém conquista sem esconder regressão de treino?
- revisão chega antes de esquecimento severo, sem saturar?
- não transforma telemetria ruidosa em diagnóstico forte?
- não fica preso em loops de remediação?

Transformar achados sistêmicos em invariantes/property tests.

## 6. Mega auditoria de engenharia pedagógica

Esta deve ser uma fase grande, deliberada, com pesquisa externa atualizada e leitura longitudinal do app inteiro.

### Lente A — currículo/grafo

Para cada nó e aresta:

- necessidade do nó;
- pré-requisitos suficientes e necessários;
- ausência de saltos conceituais;
- redundâncias/nós que são só outra representação;
- ordem das faixas;
- transferência entre N1/N2/N3/N4/N5/N6/N7, GE, GM, AL, PE;
- primeira introdução de cada linguagem visual;
- progressão concreto→pictórico→abstrato quando cabível;
- exceções perceptuais explícitas.

### Lente B — ficha/atividade

Para cada ficha:

- objetivo observável;
- 5 níveis realmente monotônicos;
- uma variável nova por degrau quando possível;
- exemplos e não-exemplos;
- variação sem vazamento de pista;
- distratores diagnósticos plausíveis;
- erro → intervenção específica;
- falas para pré-leitor;
- micro-aula/coreografia;
- domínio/evidência;
- contraprovas e casos-limite;
- transição de manipulativo para símbolo;
- generalização/transferência.

### Lente C — design pedagógico das primitivas

- affordance de toque/arraste;
- o desenho mede a grandeza pretendida e não outra;
- tamanho/alinhamento/cor não entregam a resposta;
- identidade de objetos preservada quando comparação exige correspondência;
- linguagem visual alfabetizada antes de ser usada;
- ajuda aparece no primeiro contato e é retirada progressivamente;
- áudio, texto e objeto dizem a mesma coisa;
- carga cognitiva e decoração;
- 320/390/900 + tablet/landscape;
- acessibilidade, contraste, touch target, reduced motion.

### Lente D — história completa da criança

Executar trajetórias do zero ao avançado e perguntar em cada transição:

> “O que esta criança já viu, já entendeu e já automatizou antes desta tela?”

Não validar uma ficha isolada se sua compreensibilidade depende de linguagem visual/estrutura que não apareceu antes.

### Pesquisa externa

Quando esta fase começar, confrontar o SAGA com fontes autoritativas e atuais, não com uma única metodologia: NCETM, NCTM, EEF, IES/WWC, currículos de alto desempenho/CPA-Singapura e literatura de ciência cognitiva sobre worked examples, retrieval, spacing, interleaving, variation e feedback.

Saída desejada:

- matriz por competência/ficha;
- `OK`, `micro-lacuna`, `lacuna estrutural`, `precisa observação empírica`;
- evidência/fonte;
- correção proposta;
- risco de alterar o grafo;
- ordem de execução.

## 7. Auditoria específica do Dojo completo

P8 fechou o Jardim, não o Dojo inteiro.

Auditar como três camadas separadas:

1. **Jardim/JD:** automaticidade pré-simbólica;
2. **FD/Sensei:** recuperação de fatos;
3. **PD:** fluência de procedimentos/algoritmos.

Verificar:

- unlock pela compreensão-mãe;
- passagem olho→fato→procedimento;
- metas de velocidade realistas e não punitivas;
- strength por fato/procedimento;
- avanço/recuo sem perda de conquista;
- revisão espaçada;
- mistura/interleaving;
- quando parar de treinar um fato já automatizado;
- quando voltar para compreensão em vez de insistir em velocidade.

JD4 entra aqui se a auditoria confirmar seu lugar.

## 8. Fechamento técnico/release hardening

Depois das auditorias/correções:

- todos os auditores;
- TypeScript;
- suíte completa;
- build;
- `npm audit` completo/produção;
- sonda completa;
- screenshots representativos e inspeção humana;
- navegador/mobile/tablet;
- auth Google/anônimo/link/logout;
- offline→online;
- migração de saves antigos;
- troca de conta no mesmo dispositivo;
- performance/bundle;
- acessibilidade;
- política de dados infantis/telemetria/retenção;
- documentação sem contradições;
- inventário de branches;
- nenhum workflow/script temporário;
- `main` ainda imóvel.

Só depois disso faz sentido o autor decidir se e como a cumulativa será integrada.

## 9. Ordem recomendada a partir daqui

1. **P21 — reconciliar fontes de verdade e recalcular backlog.**
2. Revalidar/decidir **N4.09, GM.12, JD4 e coreografias**.
3. **Auditoria dos motores adaptativos/metaalgoritmos.**
4. Corrigir os motores conforme evidência.
5. **Mega auditoria de engenharia pedagógica** longitudinal e por ficha.
6. Corrigir currículo/fichas/primitivas em lotes pequenos e auditáveis.
7. **Auditoria do Dojo completo** integrada ao resultado pedagógico.
8. Release hardening / auditoria final do sistema.

A ordem 3→5 é intencional: uma ficha excelente ainda pode ser servida na hora errada por um motor ruim; e um motor inteligente ainda pode escolher entre fichas pedagogicamente fracas. Os dois precisam ser auditados separadamente e depois juntos.
