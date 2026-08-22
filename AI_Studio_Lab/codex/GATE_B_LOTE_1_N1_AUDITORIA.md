# GATE B — LOTE 1 · Mega-auditoria de microprogressão N1

**Data:** 2026-08-18  
**Modo:** AUDIT-ONLY  
**Escopo:** somente domínio `N1` (`N1.01`–`N1.13`)  
**Autoridade:** Issue #47 §3 + Issue #48  
**Estado do Gate B:** ABERTO, **não fechado**  
**Regra:** nenhuma candidata deste documento é dívida confirmada ou autorização de correção.

## 0. Âncora e método

A auditoria foi aberta a partir do HEAD remoto `b116e6c5cca6ce191d322e9c230eb76ffe1a3db0`, com PR #35 open + draft + unmerged e `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`.

Foram revalidadas no HEAD, conforme a autoridade específica de cada fonte:

- `curriculum/N1.yaml`;
- `src/curriculum/grafo_saga.ts`;
- as 13 fichas TS `src/curriculum/fichas/jornada/N1.01.ts` … `N1.13.ts`;
- `src/curriculum/Composer.ts`;
- `src/curriculum/motores/composerCanary.ts` e `composerCanaryIds.ts`;
- contratos especializados atuais de `N1.05`, `N1.09` e `N1.12`;
- `src/curriculum/fichas/dojo/jardim/index.ts`;
- `src/curriculum/motores/jardimSession.ts` e `jardimEngine.ts`;
- Issue #47 §0.2/§3 e Issue #48.

Documentos históricos foram consultados apenas para evitar falsos positivos e localizar decisões a revalidar; não foram promovidos a estado atual por existência.

### Regra de evidência deste lote

Todo achado abaixo é registrado na Issue #48 como:

- **Estado do gap:** `CANDIDATA`;
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`.

Os fatos objetivos que motivam uma candidata podem estar visíveis no HEAD; a conclusão pedagógica — “isto é uma lacuna que precisa ser corrigida” — continua hipótese até investigação causal/executável suficiente.

## 1. Resultado executivo

- competências N1 auditadas: **13/13**;
- candidatas abertas: **10**;
- `HIPÓTESE-A-PROVAR`: **10**;
- `CONFIRMADO-ATUAL` como achado: **0**;
- `DÍVIDA-REGISTRADA` como achado novo: **0**;
- `HISTÓRICO-A-REVALIDAR` como achado: **0**;
- `FECHADO-COM-RECIBO`: **0**;
- `FORA-DE-ESCOPO`: **0**.

Nenhuma correção de runtime, Matrix, canário, DAG, ficha ou motor foi feita neste lote.

## 2. Auditoria competência por competência

### N1.01 — Correspondência um a um

- **Conceito/faixa:** pareamento um-a-um; `F0`.
- **Pré-requisitos:** nenhum explícito; nenhum implícito necessário foi demonstrado neste lote.
- **CPA/representação:** concreto/perceptual por `pareamento`/DragGroup; não depende de numeral.
- **L1–L5 / salto:** pareamento exato com demonstração → sobra de 1 → disposição espalhada → cena → previsão antes de distribuir. Escada coerente e progressiva no estado observado.
- **Diversidade:** cenas/temas e distribuição variam; L5 muda de execução para antecipação.
- **Transferência:** sustenta cardinalidade N1.04 e a estratégia de comparação por pareamento usada em N1.05.
- **Misconceptions:** distribuição desigual, pareamento incompleto e comparação puramente visual.
- **Mastery:** 3/3 em 2 sessões por micro; sem RT conceitual.
- **Revisão:** responsabilidade do motor global; nenhuma contradição N1-específica encontrada aqui.
- **Dependência motora:** o gesto de distribuir é parte do conceito, mas a ficha evita transformar numeral/leitura em atalho.
- **Onboarding/resolução:** tutorial inicial e resolução baseada em completar pares.
- **Dojo/Jardim:** sem trilha Jardim própria.
- **Resultado:** nenhuma CANDIDATA neste lote.

### N1.02 — Sequência oral de contagem

- **Conceito/faixa:** sequência oral estável e sincronização palavra↔ação; `F0`.
- **Pré-requisitos:** nenhum explícito.
- **CPA/representação:** oral/ação; progressivamente retira numeral visível.
- **L1–L5 / salto atual da ficha viva:** até 3 → até 5 → até 10 → sem numeral → continuar de um número interno.
- **Diversidade:** quantidade e ponto de partida variam; a competência deixa de depender do início em 1.
- **Transferência:** alimenta N1.04, N1.06, N1.07, N1.09 e N1.13.
- **Misconceptions:** ação excedente, contagem incompleta, incapacidade de começar de N.
- **Mastery:** 3/3 em 2 sessões.
- **Revisão:** global.
- **Motor/onboarding/resolução:** interação rítmica sem teclado no modo oral; tutorial presente.
- **Dojo/Jardim:** sem trilha Jardim própria.
- **Resultado:** **GAP-002**.

### N1.03 — Subitização perceptual (Olhômetro)

- **Conceito/faixa:** reconhecer pequenas quantidades sem contagem; `F0`; `excecaoCPA: perceptual`.
- **Pré-requisitos:** nenhum.
- **CPA/representação:** perceptual; fileira/dado/dispersão, com retirada de tempo e estrutura.
- **L1–L5 / salto:** estreia guiada → fileira → padrão de dado com tutorial próprio → dado mais rápido → disperso.
- **Diversidade:** formatos e exposição variam; reduz dependência de uma configuração.
- **Transferência:** pré-requisito explícito de N1.08.
- **Misconceptions:** off-by-one, chute seguro, dependência de formato.
- **Mastery:** 4/5 em 2 sessões.
- **Revisão:** global; automaticidade tem trilha separada.
- **Motor/onboarding/resolução:** resposta por escolha, pouca precisão motora; tutorial na estreia e no novo formato de dado.
- **Dojo/Jardim:** **JD1** viva; desbloqueio derivado da mãe no nível 3; RT governa automaticidade do Jardim, não domínio da Jornada.
- **Resultado:** nenhuma CANDIDATA neste lote.

### N1.04 — Contagem com cardinalidade

- **Conceito/faixa:** contar cada objeto uma vez e compreender que a última palavra-numérica representa o total; `F0`.
- **Pré-requisitos:** N1.01 + N1.02.
- **CPA/representação:** toque/contagem em fileira → grade → disperso → retirada de marcação.
- **L1–L5 / salto:** andaime forte → retirada progressiva → arranjo menos estruturado → sem marcação final.
- **Diversidade:** inclui arranjo disperso e exige evidência específica em micros críticos.
- **Transferência:** N1.05, N1.06, N1.08, N1.09, N1.10, N1.13 e vários consumidores posteriores.
- **Misconceptions:** não-cardinalidade, recontagem, pulo de item, dependência de ordem.
- **Mastery:** 3/3 em 2 sessões, com evidência de arranjo disperso onde declarada.
- **Revisão:** global.
- **Motor/onboarding/resolução:** tocar/acompanhar é parte da correspondência; níveis posteriores retiram apoio visual para reduzir dependência do gesto.
- **Dojo/Jardim:** sem trilha própria.
- **Resultado:** nenhuma CANDIDATA neste lote. A produção de quantidade foi separada em N1.13 e não foi tratada como ausência automática em N1.04.

### N1.05 — Comparação de quantidades

- **Conceito/faixa:** comparar quantidade sem confundir tamanho/ocupação espacial; `F0`.
- **Pré-requisitos:** N1.04.
- **CPA/representação:** grupos concretos/perceptuais + pareamento sob demanda.
- **L1–L5 / salto:** diferença óbvia → clara → próxima → tamanho engana → espaço engana.
- **Diversidade observada no runtime especializado:** pares são sempre **desiguais** e o enunciado é sempre “Qual grupo tem MAIS?”.
- **Transferência:** N2.03 (comparação simbólica) e PE.01; igualdade quantitativa deveria ser investigada como ponte antes do `=` simbólico.
- **Misconceptions:** conservação de espaço, tamanho≠quantidade, comparação global sem parear/contar.
- **Mastery:** 3/3 em 2 sessões em cada micro.
- **Revisão:** global.
- **Motor/onboarding/resolução:** clique em grupo; tutorial L1 ensina um par e não revela a sobra; erro mostra pareamento e limpa antes do retry.
- **Dojo/Jardim:** sem trilha própria.
- **Resultado:** **GAP-003**.

### N1.06 — Numerais / ouvir e escolher

- **Conceito/faixa da ficha viva:** som do número ↔ símbolo escrito; `F0`.
- **Contrato de domínio no YAML vivo:** `símbolo ↔ quantidade ↔ nome`, incluindo traçado e zero.
- **Pré-requisitos:** N1.02 + N1.04.
- **CPA/representação:** `AudioChoice`; pergunta auditiva, alternativas numéricas.
- **L1–L5 da ficha viva:** 1–3 distintos → 1–5 vizinhos → 1–10 → pares fonologicamente confundíveis → 1–20/voz mais rápida.
- **Diversidade:** amplia escopo e discriminação fonológica, mas não troca para produção/quantidade/zero.
- **Transferência:** N1.07 e GM.04; também prepara leitura numérica para superfícies posteriores.
- **Misconceptions:** vizinho, confusão fonológica, não escutou, precisa repetição.
- **Mastery:** 3/3 em 2 sessões + evidência `PRIMEIRA_AUDICAO`.
- **Revisão:** global.
- **Motor/onboarding/resolução:** botão de áudio + escolhas; tutorial explícito; repetição é medida separadamente.
- **Dojo/Jardim:** sem trilha própria.
- **Resultado:** **GAP-002** e **GAP-004**.

### N1.07 — Ordem, sucessor e antecessor até 10

- **Conceito/faixa:** ordem/vizinhança numérica; `F0`.
- **Pré-requisitos:** N1.02 + N1.06.
- **CPA/representação:** reta numérica nos níveis iniciais, depois `plain` e ordenação.
- **L1–L5 / salto:** sucessor até 5 com reta → sucessor até 10 → antecessor até 5 → antecessor até 10 → ordenar 3–4 numerais consecutivos.
- **Diversidade:** alterna direção e termina em ordenação de sequência curta.
- **Transferência:** N1.12; automaticidade correspondente em JD4.
- **Misconceptions:** direção invertida, repetir estímulo, ordem errada.
- **Mastery:** 4/5 em 2 sessões.
- **Revisão:** global; JD4 treina automaticidade posteriormente.
- **Dependência motora:** baixa; escolhas/ordenação não exigem precisão conceitualmente relevante.
- **Onboarding/resolução:** não há `tutorial` explícito no primeiro uso da reta em N1.07; N1.12, que vem depois, possui tutorial explícito da reta.
- **Dojo/Jardim:** **JD4** viva; `jardimEngine` deriva unlock da mãe e separa RT/fluência do domínio conceitual.
- **Resultado:** **GAP-002** e **GAP-005**.

### N1.08 — Subitização com estrutura: mão e moldura

- **Conceito/faixa:** âncora do 5 → estrutura da moldura de 10; ficha TS `F1`, grafo TS `F0`.
- **Pré-requisitos:** N1.03 + N1.04.
- **CPA/representação:** perceptual; mão nos L1–L2, moldura nos L3–L5.
- **L1–L5 / salto:** mão canônica → mão livre → 5+n na moldura → flash → pergunta inversa “quantos faltam?”.
- **Diversidade:** muda formato, exposição e pergunta; domínio da moldura exige caso com 6+.
- **Transferência:** N1.10 e N1.11; L5 é ponte explícita para amigos do 10.
- **Misconceptions:** off-by-one, âncora 5 rígida, ignora segunda mão, depende de formato, conta vazios, não usa estrutura, inverte pergunta.
- **Mastery:** mão 4/5×2; moldura 3/3×2 + evidência estrutural.
- **Revisão:** global; **JD2** automatiza os cinco degraus da mão.
- **Motor/onboarding/resolução:** tutorial explícito da mão; a primeira entrada na moldura, no L3, não possui `tutorial` próprio na micro.
- **Dojo/Jardim:** JD2 viva, unlock no nível 3 da mãe.
- **Resultado:** **GAP-006** e **GAP-007**.

### N1.09 — Contagem até 20 e a partir de N

- **Conceito/faixa:** contagem de conjuntos 10–20, continuação a partir de N e regressiva; `F0`.
- **Pré-requisitos:** N1.04 + N1.02.
- **CPA/representação:** `scattered` nos dois primeiros níveis; `plain` para sequências.
- **L1–L5 / salto:** 10–15 → 10–20 → continuar 3 passos a partir de N → regressiva 3 passos → mistura aleatória das três famílias.
- **Diversidade:** L5 escolhe aleatoriamente uma família por item.
- **Transferência:** N1.12, N2.01, N3.03 e AL.03.
- **Misconceptions:** quebra/pulo de sequência, necessidade de voltar ao 1, direção errada.
- **Mastery:** 4/5 em 2 sessões; o builder L5 não exige evidência de ter amostrado todas as três famílias antes de satisfazer a regra.
- **Revisão:** global.
- **Motor/onboarding/resolução:** contagem visual/seleção de sequência; sem precisão motora relevante.
- **Dojo/Jardim:** sem trilha própria.
- **Resultado:** **GAP-008**.

### N1.10 — Parte-todo: do escondido ao number bond

- **Conceito/faixa:** relação todo = parte + parte; `F1`.
- **Pré-requisitos:** N1.04 + N1.08.
- **CPA/representação:** objetos escondidos/moldura → retirada da moldura → `NumberBond`.
- **L1–L5 / salto:** esconder 1 → esconder até 2 → sem contagem em voz alta → alternar moldura/objetos soltos → formalizar no bond.
- **Diversidade:** total e parte variam; L4 exige resolver sem moldura; domínio exige total além de cinco.
- **Transferência:** N1.11, N3.01, N3.05 e N3.07.
- **Misconceptions:** responde visível/todo, repete parte, off-by-one, depende da estrutura.
- **Mastery:** 3/3 em 2 sessões + evidências específicas.
- **Revisão:** global; JD5 automatiza imagem mental parte-todo.
- **Motor/onboarding/resolução:** tutorial inicial e tutorial separado para o `NumberBond`.
- **Dojo/Jardim:** **JD5** viva, unlock no nível 3.
- **Resultado:** nenhuma CANDIDATA neste lote.

### N1.11 — Amigos do 10

- **Conceito/faixa:** complementos de 10; `F1`.
- **Pré-requisitos:** N1.08 + N1.10.
- **CPA/representação:** moldura → bond → sentença simbólica.
- **L1–L5 / salto:** faltam 1–2 → faltam até 4 → bond com 10 como todo → `n + □ = 10` → a **mesma micro `f28_simbolo`** novamente.
- **Diversidade:** L1/L2 variam vazio; L3 varia parte do bond; L4/L5 usam o mesmo branch `complemento_dez`, que sorteia parte 1–9 sem diferença de família por nível.
- **Transferência:** N2.01 e N3.07.
- **Misconceptions:** responde cheio/todo, sem âncora 5, repete parte, só funciona visual, off-by-one.
- **Mastery:** JD3 4/5×2; F28 4/4×3. L5 acrescenta `rt_alvo`, mas RT é metadado de fluência e não pode comprar mastery conceitual.
- **Revisão:** global; JD3 automatiza percepção do vazio.
- **Motor/onboarding/resolução:** há tutorial da moldura e do bond; não há tutorial específico quando a representação muda para `n + □ = 10` no L4.
- **Dojo/Jardim:** **JD3** viva, unlock no nível 3.
- **Resultado:** **GAP-009** e **GAP-010**.

### N1.12 — Reta numérica até 20

- **Conceito/faixa:** número como posição e movimento; grafo TS `F1`, ficha TS `F0/F1`.
- **Pré-requisitos:** N1.07 + N1.09.
- **CPA/representação:** `InteractiveNumberLine` especializada.
- **L1–L5 / salto:** localizar 0–10 → saltar à frente → saltar para trás → localizar 0–20 com quase todos numerais ocultos → saltos variáveis 0–20.
- **Diversidade:** posição, direção e magnitude variam; L5 exige evidência de pelo menos um salto para trás.
- **Transferência:** N3.04 e GE.08.
- **Misconceptions:** off-by-one, direção invertida, contar marcas em vez de intervalos, senso espacial instável.
- **Mastery:** 3/3 em 2 sessões; L5 com evidência `SALTO_PARA_TRAS`.
- **Revisão:** global.
- **Dependência motora:** o contrato explicita snap/hitbox; precisão de dedo não é a competência.
- **Onboarding/resolução:** tutorial explícito no L1.
- **Dojo/Jardim:** sem trilha própria.
- **Resultado:** **GAP-007** apenas; nenhuma outra candidata estática neste lote.

### N1.13 — Produzir quantidade

- **Conceito/faixa:** transformar número ouvido em quantidade produzida; `F0`.
- **Pré-requisitos:** N1.02 + N1.04.
- **CPA/representação:** `TouchPlace`; vagas visíveis → contorno → cena livre → pedido ouvido uma vez.
- **L1–L5 / salto:** andaime motor explícito → retirada progressiva → produção sem vaga → memória de trabalho no pedido único.
- **Diversidade:** quantidade 1–10 e tema variam; L4+ precisa produzir sem molde.
- **Transferência declarada na ficha:** “teste real da cardinalidade”. **Transferência no DAG atual:** nenhum nó posterior lista N1.13 como prerequisito.
- **Misconceptions:** produção incompleta, não monitora alvo, ignora quantidade, depende de andaime.
- **Mastery:** 3/3 em 2 sessões + evidência `SEM_ANDAIME`.
- **Revisão:** global.
- **Motor/onboarding/resolução:** tutorial inicial; a resposta é o que a criança produz, não múltipla escolha.
- **Dojo/Jardim:** sem trilha própria.
- **Resultado:** **GAP-011**.

## 3. Candidatas do lote

### GAP-002 — N1.02 → N1.06/N1.07: cobertura oral exigida pelos consumidores não está garantida

- **Estado:** `CANDIDATA`.
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`.
- **Tipo(s):** `MICRONÍVEL-AUSENTE`, `PRÉ-REQUISITO-IMPLÍCITO`.
- **Competências:** N1.02, N1.06, N1.07; N1.09 como possível redistribuição deliberada a reconciliar.
- **Evidência atual:** o YAML de N1.02 lista recitação até 20 e regressiva 10→0; a ficha viva N1.02 termina em até 10/sem numeral/continuar de N. N1.06 L5 exige reconhecer por som numerais até 20; N1.07 introduz antecessor, e o YAML explicita a regressiva como requisito da micro.
- **Hipótese:** existe uma lacuna de microprogressão/pré-requisito, ou o conteúdo foi deliberadamente redistribuído para N1.09 sem reconciliar todas as autoridades.
- **Como provar/refutar:** executar auditoria nominal das três escadas e dos unlocks; provar que a criança recebe oral 11–20 e direção regressiva antes de qualquer consumidor que as pressuponha.

### GAP-003 — N1.05 não exercita “menos” nem igualdade quantitativa

- **Estado:** `CANDIDATA`.
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`.
- **Tipo(s):** `MICRONÍVEL-AUSENTE`, `VARIEDADE-DE-MASTERY`, `TRANSFERÊNCIA-AUSENTE`.
- **Competência:** N1.05; transferência para N2.03.
- **Evidência atual:** `comparacaoQuantidadeContract.ts` sempre cria pares desiguais e pergunta “Qual grupo tem MAIS?”. O YAML atual de N1.05 inclui mais/menos/mesma quantidade e conservação com a mesma quantidade em arranjos distintos.
- **Hipótese:** mastery de “comparar quantidades” pode ser obtida sem jamais decidir “menos” ou “igual”, deixando a ponte para `=` simbólico sem treino quantitativo explícito.
- **Como provar/refutar:** inventariar distribuição real de itens e o contrato canônico final; se igualdade/menos forem intencionais, exigir casos nominais antes de corrigir qualquer implementação.

### GAP-004 — N1.06: contrato do nó é mais amplo que a ficha AudioChoice viva

- **Estado:** `CANDIDATA`.
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`.
- **Tipo(s):** `CONCEITO-AUSENTE`, `MICRONÍVEL-AUSENTE`, `REPRESENTAÇÃO-AUSENTE`.
- **Competência:** N1.06.
- **Evidência atual:** o YAML define `símbolo ↔ quantidade ↔ nome`, traçado e zero; a ficha TS/Composer atual mede essencialmente som→símbolo e chega a 20.
- **Hipótese:** quantidade↔símbolo, zero e/ou traçado ficaram sem prova dentro do contrato de N1.06, ou foram distribuídos deliberadamente por outras fichas sem reconciliação de autoridade.
- **Como provar/refutar:** mapear cada micro YAML a uma evidência executável atual; não criar traçado/ficha nova até decidir o que é conceito, o que é prática motora e o que já é coberto por N1.04/outputs adjacentes.

### GAP-005 — N1.07 introduz NumberLine antes do microtutorial da própria reta

- **Estado:** `CANDIDATA`.
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`.
- **Tipo(s):** `ONBOARDING-DE-FERRAMENTA`.
- **Competência:** N1.07; vizinha N1.12.
- **Evidência atual:** N1.07 L1 usa `numberline`, seus prereqs N1.02/N1.06 não usam essa ferramenta e a ficha não declara `tutorial`; N1.12, posterior, possui tutorial explícito da reta.
- **Hipótese:** a criança pode ser avaliada com uma linguagem visual nova antes de ser ensinada a operá-la.
- **Como provar/refutar:** sonda/E2E da primeira exposição real à reta a partir de um perfil que nunca viu a ferramenta; distinguir hesitação de UI de erro de sucessor.

### GAP-006 — N1.08: mudança mão → moldura no L3 sem ponte/tutorial explícito

- **Estado:** `CANDIDATA`.
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`.
- **Tipo(s):** `PONTE-CPA-AUSENTE`, `ONBOARDING-DE-FERRAMENTA`.
- **Competência:** N1.08.
- **Evidência atual:** L1–L2 usam a mão com tutorial; L3 muda para `moldura`/10 células e a micro `moldura_dez` não declara tutorial próprio.
- **Hipótese:** a âncora corporal do 5 pode não estar explicitamente conectada à convenção espacial 5+n da moldura no primeiro item avaliado.
- **Como provar/refutar:** observar/sondar primeira transição L2→L3 sem ajuda adulta e verificar se o erro decorre do conceito ou da nova representação.

### GAP-007 — faixa de N1.08 e N1.12 diverge entre grafo e ficha viva

- **Estado:** `CANDIDATA`.
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`.
- **Tipo(s):** `IDADE/LINGUAGEM`, `OUTRO` — divergência de autoridade de faixa.
- **Competências:** N1.08, N1.12.
- **Evidência atual:** `grafo_saga.ts` marca N1.08 `F0` e N1.12 `F1`; as fichas TS declaram N1.08 `F1` e N1.12 `F0/F1`.
- **Hipótese:** a divergência pode contaminar placement, linguagem/densidade ou simplesmente refletir metadado histórico não consumido.
- **Como provar/refutar:** identificar consumidor real de `faixa`, comparar artefatos derivados/canônicos e decidir uma única semântica antes de editar.

### GAP-008 — N1.09 L5 “misto” pode satisfazer mastery sem cobrir todas as famílias

- **Estado:** `CANDIDATA`.
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`.
- **Tipo(s):** `VARIEDADE-DE-MASTERY`.
- **Competência:** N1.09.
- **Evidência atual:** no L5 o builder escolhe aleatoriamente entre contar objetos, continuar de N e regressiva; a regra local é 4/5 em 2 sessões e não possui evidência obrigatória por família.
- **Hipótese:** por amostragem aleatória, a criança pode fechar o nível misto sem demonstrar uma das famílias que o próprio nível pretende recuperar flexivelmente.
- **Como provar/refutar:** enumerar seeds/distribuição e provar cobertura mínima por família na janela real de mastery; se a probabilidade permitir fechamento sem família, decidir gate de variedade em lote corretivo futuro.

### GAP-009 — N1.11 muda de bond para `n + □ = 10` sem onboarding simbólico explícito

- **Estado:** `CANDIDATA`.
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`.
- **Tipo(s):** `PONTE-CPA-AUSENTE`, `ONBOARDING-DE-FERRAMENTA`.
- **Competência:** N1.11.
- **Evidência atual:** L3 possui tutorial para o `NumberBond`; L4 troca para a sentença simbólica `n + □ = 10`, mas a micro `f28_simbolo` não possui tutorial da caixa/sentença.
- **Hipótese:** a criança pode conhecer o complemento e errar por não compreender a nova notação.
- **Como provar/refutar:** sonda da primeira transição L3→L4 separando compreensão do complemento de compreensão da notação.

### GAP-010 — N1.11 L4 e L5 reutilizam a mesma micro e a mesma distribuição conceitual

- **Estado:** `CANDIDATA`.
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`.
- **Tipo(s):** `MICRONÍVEL-AUSENTE`, `VARIEDADE-DE-MASTERY`.
- **Competência:** N1.11.
- **Evidência atual:** L4 e L5 apontam para `f28_simbolo`; o branch `complemento_dez` sorteia parte 1–9 sem diferença por nível. L5 acrescenta `rt_alvo`, mas RT não governa domínio conceitual.
- **Hipótese:** o quinto degrau não acrescenta variedade/evidência conceitual nova e pode ser um nível nominalmente distinto sem progressão real.
- **Como provar/refutar:** comparar itens gerados L4×L5 em seeds determinísticas e o comportamento do mastery engine; decidir se o L5 precisa transferência/variedade ou se é escolha deliberada a documentar.

### GAP-011 — N1.13 é “teste real da cardinalidade”, mas é folha no DAG

- **Estado:** `CANDIDATA`.
- **Classe §0.2:** `HIPÓTESE-A-PROVAR`.
- **Tipo(s):** `TRANSFERÊNCIA-AUSENTE`, `PRÉ-REQUISITO-IMPLÍCITO`.
- **Competência:** N1.13 e consumidores posteriores de cardinalidade a identificar.
- **Evidência atual:** a ficha descreve produzir quantidade como teste de saída da cardinalidade; o DAG atual dá a N1.13 prereqs N1.02+N1.04, mas nenhum nó posterior observado a lista como prerequisito.
- **Hipótese:** falhar produção de quantidade pode não bloquear progressões que pressupõem cardinalidade produtiva, ou N1.13 foi deliberadamente desenhada como competência terminal/diagnóstica sem função de gate.
- **Como provar/refutar:** traçar consumidores conceituais reais de cardinalidade e simular uma criança que domina N1.04 mas falha N1.13; observar se o DAG permite avanço pedagogicamente indevido.

## 4. Padrões da Issue #47 §3 — cobertura desta varredura

Os 13 padrões foram procurados explicitamente. Neste lote surgiram candidatas nas famílias:

- conceito/micronível ausente — GAP-002/003/004/010;
- salto/ponte de representação — GAP-006/009;
- pré-requisito implícito — GAP-002/011;
- transferência ausente — GAP-003/011;
- mastery com variedade insuficiente — GAP-003/008/010;
- ferramenta/linguagem visual sem microtutorial — GAP-005/006/009;
- divergência entre autoridades atuais — GAP-004/007.

Não foi encontrada, com evidência suficiente neste lote estático, candidata N1 específica para:

- redundância mascarando lacuna em outro ponto;
- dificuldade motora indevida como prova conceitual;
- conteúdo apenas explicado e nunca exigido fora das candidatas já descritas;
- divergência ficha↔runtime legitimada somente por história além das divergências concretas acima.

Ausência de candidata não prova ausência definitiva: simulação/E2E/piloto podem gerar novas `CANDIDATA` depois.

## 5. Jardim/Dojo — reconciliação N1

A busca inicial pelo símbolo `JARDIM` isolado não foi usada como conclusão. O estado vivo foi revalidado:

- JD1 ↔ N1.03;
- JD2 ↔ N1.08;
- JD3 ↔ N1.11;
- JD4 ↔ N1.07;
- JD5 ↔ N1.10.

`jardimSession.ts` consome `JARDIM`; `jardimEngine.ts` deriva o unlock da competência-mãe e separa automaticidade de mastery conceitual. Portanto a antiga suspeita “Jardim declarativo sem motor” foi **refutada nesta auditoria** e não foi registrada como gap.

## 6. O que este lote NÃO fez

- não alterou runtime;
- não alterou Matrix;
- não alterou canário;
- não alterou DAG;
- não alterou fichas N1;
- não alterou motores de mastery/Jardim/Sensei;
- não iniciou N2;
- não iniciou Gate C–J;
- não tocou Creature Engine/Tamagotchi;
- não promoveu `CANDIDATA` a `PROVADA` ou dívida confirmada.

## 7. Parada e lote seguinte proposto

Com N1 auditado, **parar**.

Próximo lote proposto, somente sob nova autorização: **Gate B · Lote 2 — domínio N2**. A próxima execução deve reancorar o remoto, ler os recibos deste lote e só então abrir N2; não antecipar nenhuma auditoria N2 neste documento.