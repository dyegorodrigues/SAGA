# Plano pós-P22 — motores, Coverage Matrix e fábrica curricular

**Data:** 8/ago/2026  
**Branch operacional:** `codex/integrar-bloco-f0`  
**Status:** plano aprovado para execução após o fechamento real da P22.

> Este documento existe para que a ordem de execução não dependa da memória de um chat. Ficha escrita, código registrado e experiência pronta para a criança são estados diferentes.

## 1. Invariante de produto

Uma competência só pode ser chamada de **pronta** quando atravessar uma cadeia verificável:

**Cânone → Grafo → Ficha autoral → Micros → Cena/primitiva → Gerador parametrizado → Coreografia/tutorial → Distratores/Radar → Evidência/mastery → QA visual/áudio → Simulação longitudinal → Produção.**

A existência de Markdown, TS, componente ou gerador isolado nunca é prova suficiente de prontidão.

## 2. Ordem obrigatória após P22

1. fechar P22 sem lacunas autorais deliberadas;
2. reconstruir a máquina de estados longitudinal real;
3. corrigir motores somente onde comportamento/teste provar discrepância;
4. criar Coverage Matrix executável;
5. abrir fábrica curricular em ondas pedagógicas;
6. realizar mega auditoria pedagógica longitudinal;
7. auditar Dojo completo JD/FD/PD;
8. executar release hardening.

Não inverter 2–4 com produção curricular em massa: construir dezenas de cenas sobre mastery/unlock/revisão errados multiplica retrabalho e dívida pedagógica.

## 3. Auditoria longitudinal dos motores

Traçar ponta a ponta:

**GameLoop resposta → política de resposta → misconception/Radar → evidência → progress/mastery → persistência/sync → revisão/retenção → recomendação/Minha Aula/Oficina → unlock do grafo.**

### Perfis sintéticos mínimos

1. entende, mas responde devagar;
2. responde rápido chutando;
3. repete a mesma misconception;
4. alterna erros sem padrão;
5. aprende hoje e esquece depois;
6. forte no visual, fraco no simbólico;
7. depende de andaime;
8. retorna após dias/semanas;
9. erra primeiro e recupera com ajuda;
10. domina conceito, mas ainda não automatizou;
11. acelera sem compreensão;
12. criança muito acima da faixa inicial.

### Invariantes a provar

- tempo/`rt_alvo` não coroa domínio conceitual da Jornada;
- `dojoTracks` não promove mastery da competência-mãe;
- acerto nunca gera misconception;
- uma única alternativa errada não vira diagnóstico forte sem hipótese causal defensável;
- unlock depende das evidências/pré-requisitos corretos;
- persistência e sync não duplicam nem perdem mutações;
- revisão compete de forma explícita com conteúdo novo;
- remediação não cria loops infinitos;
- regressão de treino não apaga conquista conceitual, mas também não esconde esquecimento;
- recomendação explica-se pelo estado da criança, não por regra paralela invisível.

Cada divergência confirmada vira teste longitudinal/property test antes da correção.

## 4. Coverage Matrix executável

Construir uma matriz calculada, não planilha manual, para as 90 competências.

Colunas mínimas:

- ID/cânone;
- grafo/prereqs;
- ficha Markdown;
- Journey TS;
- registro runtime;
- proveniência atual: legado / Composer / fallback;
- 5 níveis coerentes;
- micros cobertos;
- cena/primitiva executável;
- gerador parametrizado;
- tutorial/coreografia;
- exemplos e não-exemplos;
- distratores diagnósticos;
- feedback/intervenção por erro;
- evidência/mastery;
- áudio/pré-leitor;
- QA 320/390/900/tablet;
- acessibilidade;
- simulação longitudinal;
- status final.

Status permitidos por célula/competência:

- `OK`;
- `micro-lacuna`;
- `lacuna estrutural`;
- `precisa observação empírica`;
- `não aplicável`, sempre justificado.

Exemplo de leitura desejada:

`N3.04 — ficha ✅ | runtime legado ⚠️ | coreografia ❌ | diagnóstico parcial ⚠️ | visual ✅ | produção ❌`

O relatório precisa falhar quando uma fonte de verdade deriva silenciosamente.

## 5. Fábrica curricular — não banco de exercícios

Depois dos motores estabilizados, converter fichas/fallbacks em **gramáticas geradoras**.

Para cada competência produzir:

- parâmetros válidos e limites;
- distribuição de dificuldade;
- cenas e estados visuais;
- exemplos/não-exemplos;
- famílias de distratores com hipótese diagnóstica;
- falas/TTS pré-leitoras;
- microaulas/coreografias;
- retirada progressiva de andaime;
- transição concreto/pictórico/abstrato quando aplicável;
- regras de variedade que não vazem a resposta;
- contraprovas;
- testes de propriedade com muitas amostras;
- sonda visual e acessibilidade.

Uma ficha bem construída deve gerar muitas instâncias coerentes sem depender de um banco manual enorme e sem usar IA generativa online como requisito para cada questão.

## 6. Ordem das ondas pedagógicas

Não executar por ordem alfabética de ID.

### Onda A — fundações

N1/N2 iniciais, cardinalidade, sequência, comparação, parte-todo e primeiras linguagens visuais. Garantir que toda representação seja alfabetizada antes de ser cobrada.

### Onda B — adição/subtração

Significado, estratégias, composição de 10, fatos, reagrupamento e transferência entre representações.

### Onda C — multiplicação/divisão

Grupos iguais, arrays, famílias, decomposição, âncoras, fatos e procedimentos.

### Onda D — frações e número avançado

Construir somente sobre partição/equivalência/razão visual já compreendidas.

### Onda E — geometria, grandezas, medidas, tempo e álgebra inicial

Cenas contextualizadas, manipulação e linguagem visual própria; evitar transformar leitura em pré-requisito oculto.

A ordem fina será recalculada pelo grafo e pelas lacunas da Coverage Matrix.

## 7. Mega auditoria pedagógica

Depois da primeira passagem da fábrica, reler a história inteira da criança.

Para cada transição perguntar:

> **O que esta criança já viu, já entendeu e já automatizou antes desta tela?**

Auditar:

- necessidade de cada nó/aresta;
- pré-requisitos suficientes e necessários;
- saltos conceituais;
- progressão dos cinco níveis;
- variável nova por degrau quando possível;
- primeira exposição a cada linguagem visual;
- CPA e exceções justificadas;
- exemplos/contraprovas;
- feedback de erro;
- carga cognitiva;
- áudio/texto/objeto semanticamente alinhados;
- retirada de andaime;
- generalização e transferência;
- acessibilidade e interação infantil.

Confrontar com fontes externas autoritativas e atuais quando esta fase começar: NCETM, NCTM, EEF, IES/WWC, CPA/Singapura e ciência cognitiva sobre worked examples, retrieval, spacing, interleaving, variation e feedback.

## 8. Dojo completo

Manter três camadas distintas:

1. **JD/Jardim:** automaticidade pré-simbólica ou de ponte inicial de conceitos já compreendidos;
2. **FD/Sensei:** recuperação de fatos;
3. **PD:** fluência de procedimentos.

Provar unlock pela competência-mãe, metas de velocidade não punitivas, strength por fato/procedimento, revisão espaçada, interleaving e retorno à compreensão quando velocidade não é o problema real.

## 9. Release hardening

Somente após auditorias/correções:

- auditores completos;
- TypeScript;
- suíte completa;
- build;
- sonda representativa e inspeção humana;
- 320/390/900 + tablet/landscape;
- áudio/TTS;
- acessibilidade;
- auth anônimo/Google/link/logout;
- offline→online;
- saves antigos/migração/troca de conta;
- performance/bundle;
- privacidade/dados infantis/telemetria/retenção;
- documentação sem contradições;
- nenhum artefato temporário;
- `main` ainda imóvel.

## 10. Regras de execução

- `main` nunca é laboratório;
- Creature Engine fica fora deste fluxo;
- PR #29 permanece draft/no-merge;
- uma alteração sistêmica por lote sempre que possível;
- tela alterada exige sonda;
- documento antigo não vence runtime/teste/cânone atual;
- não esconder dívida para melhorar métrica;
- não construir infraestrutura sem cliente curricular comprovado;
- não declarar concluído sem evidência reproduzível.

> **O objetivo da fábrica não é preencher 90 quadrinhos verdes. É fazer com que cada tela seja uma continuação inteligível da aprendizagem anterior e gere evidência útil para a próxima decisão do tutor.**
