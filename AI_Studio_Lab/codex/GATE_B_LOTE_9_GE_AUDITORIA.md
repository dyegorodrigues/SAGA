# Gate B — Lote 9 — GE — auditoria Child-Ready

Data: 2026-08-20  
Modo: **AUDIT-ONLY**  
Âncora de entrada: `1088aed5e6afa4af78e0fb7228f7e5998a51da39`  
PR: #35 · branch `codex/fechamento-curricular`

## 0. Veredito do lote

**GE — PARADA POR CONDIÇÃO D069: 10/10 competências e 50/50 contratos de nível auditados; 6 candidatas individuais; 17/50 contratos de nível materialmente afetados; descoberta de nova classe estrutural CLASS-007.**

A condição de parada é deliberada. D069 autoriza GE → GM → PE sem pausa por domínio, mas manda parar quando surgir classe estrutural nova. O lote GE encontrou uma classe transversal em que a interação conceitual prescrita/visível pode ser ignorada e a criança ainda compra a evidência que conclui a questão. A classe é registrada **aberta**, não fechada e não dimensionada globalmente.

GM e PE **não foram iniciados como lotes**. Leituras estreitas fora de GE ocorreram somente para R2 (testar transversalidade da descoberta), sem contabilizar auditoria de competência e sem criar candidato numerado nesses domínios.

## 1. Pré-condição fechada antes do lote

A correção CLASS-006 foi certificada no SHA `1088aed5e6afa4af78e0fb7228f7e5998a51da39`:

- CI #1546 / run `32371318136`: success 4/4;
- Certificação transversal #282 / run `32371318137`: success 9/9;
- 248 arquivos / 3.437 testes;
- Matrix 75 Composer / 15 legado / 0 fallback / 90 servidas / 11 divergências;
- Sonda real Sensei incluiu F30/F97 e ficou verde;
- 320/900 e as oito sementes 390px ficaram verdes.

CLASS-006 foi registrada no PR #35 como `FECHADO-COM-RECIBO`, junto com D068, no comentário `5357519503`.

Regra D068 preservada:

> Portão de invariante não usa lista de INCLUSÃO escrita à mão. Usa descoberta ou medição. Lista, quando existir, é de EXCEÇÃO explícita, justificada, e que não dispensa a medição.

## 2. Regras D068/D069 aplicadas

- **R1 — medir, não ler:** nenhuma classe foi declarada fechada por inspeção. CLASS-007 fica aberta.
- **R2 — varrer as 90:** a descoberta foi testada fora de GE antes de ser tratada como estrutural. A varredura encontrou testemunha independente em `N4.02/F98`. Como a própria descoberta de classe aciona STOP, este relatório registra somente uma **cota inferior de testemunhas**, não um inventário global nem uma prevalência sobre 90.
- **R3 — lista de inclusão é suspeita:** nenhum portão/lista positiva foi criado.
- **R4 — o gate também erra:** nenhum gate novo foi criado neste lote; item de mutação = N/A.

## 3. Medição principal do lote

Universo GE:

- competências auditadas: **10/10** (`GE.01`–`GE.10`);
- níveis por competência: 5;
- contratos de nível comparados ficha ↔ contrato ↔ palco: **50/50**;
- candidatas individuais novas: **6** (`GAP-045`–`GAP-050`);
- contratos de nível materialmente afetados: **17/50 = 34%**;
- competências sem candidata individual nova: **4/10** (`GE.01`, `GE.02`, `GE.03`, `GE.10`);
- proveniência atual: **10 Composer / 0 legado / 0 fallback**;
- correções de Gate B implementadas: **0**.

Decomposição dos 17 contratos afetados:

- GE.04: L3–L4 = 2;
- GE.05: L2 e L4 = 2;
- GE.06: L4 = 1;
- GE.07: L1–L5 = 5;
- GE.08: L3–L4 = 2;
- GE.09: L1–L5 = 5.

## 4. Progressão e DAG

A progressão GE permanece coerente em macroescala:

`posição → formas planas → atributos/simetria → sólidos → mapas/malha → ângulos → polígonos → plano cartesiano → áreas/círculo → volume/vistas`.

Pré-requisitos observados preservam a causalidade principal:

- GE.01: raiz espacial;
- GE.02 ← AL.01;
- GE.03 ← GE.02;
- GE.04 ← GE.02;
- GE.05 ← GE.01;
- GE.06 ← GE.03;
- GE.07 ← GE.03 + GE.06;
- GE.08 ← GE.05 + N1.12;
- GE.09 ← GM.08 + GE.06;
- GE.10 ← GE.04 + GM.08.

Nenhuma candidata deste lote é causada por ordem de DAG.

## 5. Competências sem candidata nova

### GE.01 / F47 — posição e localização

**Refutação.** O nível de produção realmente usa Pointer Events/drag e possui alternativa motora por toque. A colocação determina a relação espacial e erro de colocação não compra acerto. A produção prescrita é executável e autoritativa.

### GE.02 / F48 — formas planas

**Refutação.** O runtime varia orientação/representação e a resposta continua sendo identidade geométrica, não posição/rótulo fixo. A rotação não transforma a forma em outra categoria.

### GE.03 / F58 — propriedades e simetria

**Refutação.** L1–L3 trabalham propriedades; L4 varia o eixo de simetria; L5 exige completar reflexão. Não foi agregado à CLASS-003 porque a competência não é um único caso fixo uniforme em todos os níveis.

### GE.10 / F92 — volume e vistas

**Refutação importante.** É contraexemplo para CLASS-007: L3 realmente exige reconstrução por toque da matriz de alturas e L5 realmente exige produzir três vistas antes da verificação. A ação conceitual é necessária para concluir a atividade.

## 6. Candidatas individuais

Todas as candidatas abaixo ficam em §0.2 como **HIPÓTESE-A-PROVAR**, rota **CODIGO**, sem correção no Gate B.

### GAP-045 — GE.04 / F59 — experimento prescrito não compra evidência

Tipos: `INTERAÇÃO-AUSENTE` / `RESOLUÇÃO-DIVERGENTE`.

A ficha prescreve prever e testar rolamento/empilhamento. O palco oferece botão de experimento em L3/L4 e mantém estado `testeFeito`, mas as alternativas de resposta permanecem habilitadas independentemente desse estado. A criança pode responder corretamente sem executar o experimento.

Prova/refutação futura: exigir evidência do teste antes de liberar a decisão que compra mastery, preservando acessibilidade e alternativa motora.

### GAP-046 — GE.05 / F60 — linguagem espacial produzida vira reconhecimento

Tipos: `PRODUÇÃO-TROCADA-POR-RECONHECIMENTO` / `TRANSFERÊNCIA-INSUFICIENTE`.

L2 pede nomear coordenada e L4 pede descrever caminho. O runtime entrega respostas prontas para seleção. O caso não mede produção da linguagem espacial descrita na ficha.

Prova/refutação futura: entrada/assemblagem acessível da coordenada/caminho ou outra produção observável sem transformar precisão motora em conteúdo matemático.

### GAP-047 — GE.06 / F78 — medir ângulo sem instrumento e vazamento acessível

Tipos: `REPRESENTAÇÃO-AUSENTE` / `PRODUÇÃO-TROCADA-POR-RECONHECIMENTO` / `VAZAMENTO-DE-RESPOSTA`.

L4 pede medir em graus. O palco desenha raios e arco, mas não materializa transferidor/escala de medição; a criança escolhe um valor pronto. Além disso, o `aria-label` do SVG contém a abertura numérica em graus, revelando a resposta a tecnologia assistiva antes da decisão.

Prova/refutação futura: instrumento/escala executável e descrição acessível que preserve a informação geométrica sem serializar o gabarito.

### GAP-048 — GE.07 / F79 — agrupamento visível, mas não autoritativo

Tipos: `INTERAÇÃO-AUSENTE` / `PRODUÇÃO-TROCADA-POR-RECONHECIMENTO`.

A ficha declara ShapeCanvas + DragGroup para classificação/hierarquia. O palco renderiza DragGroup, mas seu `onAnswer` é no-op; a resposta que vale é o botão de alternativa separado. Assim, L1–L5 podem ser concluídos sem usar a classificação por agrupamento.

Prova/refutação futura: o estado produzido pelo agrupamento precisa alimentar a resposta/evidência ou o affordance deve deixar de fingir que é a ação avaliativa.

### GAP-049 — GE.08 / F80 — descrição/desenho reduzidos a endpoint

Tipos: `PRODUÇÃO-TROCADA-POR-RECONHECIMENTO` / `RESOLUÇÃO-DIVERGENTE`.

L3 descreve caminho mas responde por endpoint em alternativas. L4, cuja ficha fala em desenhar figura ligando vértices, foi reduzido a colocar apenas o quarto ponto de um retângulo. Há produção parcial, porém não a produção declarada.

Prova/refutação futura: materializar sequência de caminho/desenho ou retificar formalmente o contrato se o escopo pedagógico pretendido for de fato apenas completar vértice.

### GAP-050 — GE.09 / F91 — transformação/derivação opcional e conteúdo antecipado

Tipos: `CONTEÚDO-SÓ-EXPLICADO` / `RESOLUÇÃO-DIVERGENTE` / `VAZAMENTO-DE-RESPOSTA`.

A ficha usa transformação para derivar relações de área. O palco oferece transformação em L1/L3/L5, porém permite responder sem executá-la. Em níveis adicionais, parte da montagem já apresenta literalmente a relação/formula que a criança deveria construir ou inferir.

Prova/refutação futura: tornar a transformação uma etapa observável da resolução e impedir que representação/instrução antecipe a própria conclusão avaliada.

## 7. CLASS-007 — nova classe estrutural — ABERTA

Nome operacional:

**CLASS-007 — bypass de interação conceitual prescrita**.

Definição provisória:

> Uma interação conceitual que a ficha/contrato trata como parte da resolução é visível e executável no palco, mas não participa da condição que autoriza a resposta/evidência; a criança pode ignorá-la e ainda concluir a questão/comprar mastery.

Isso é mais estreito que “produção trocada por reconhecimento”: exige que o affordance conceitual esteja de fato presente, porém seja não vinculante.

### Testemunhas atuais — cota inferior, NÃO inventário global

- `N4.02/F98`: giro existe, mas a orientação girada não é condição real de acerto;
- `GE.04/F59`: L3–L4, experimento existe, mas não bloqueia resposta;
- `GE.07/F79`: L1–L5, DragGroup existe, mas `onAnswer` não participa da decisão;
- `GE.09/F91`: L1/L3/L5, transformação existe, mas pode ser ignorada.

Cota inferior observada: **4 competências / pelo menos 11 contratos de nível testemunha**.

**Não interpretar 4/90 como prevalência.** R1/R2 proíbem declarar a classe fechada ou dimensionada sem medição executada sobre as 90. A descoberta da própria classe é uma condição de STOP em D069; portanto a varredura global completa fica como próxima operação autorizável, não como conclusão deste lote.

Contraexemplo explícito: `GE.10/F92` obriga reconstrução/desenho antes da validação; `GM.05/F61`, lido apenas no sweep estreito de R2, também bloqueia as escolhas até a medição/comparação requerida. Isso mostra que “interação presente” não implica automaticamente CLASS-007.

## 8. Sweep R2 fora de GE e limite de escopo

A checagem transversal mínima confirmou que o padrão não é específico do domínio GE:

- `N4.02/F98` já documentava rotação disponível porém não vinculante;
- `GM.05/F61` funciona como contraexemplo: a ação de medir/comparar libera a continuação;
- uma leitura estreita de PE.02 mostrou divergência potencial entre modos de construção declarados e um palco predominantemente de escolha, mas **PE.02 não recebe GAP neste relatório** porque o lote PE não foi aberto e esse caso pode pertencer a outra classe já existente, não necessariamente à CLASS-007.

Essa checagem serve somente para cumprir a pergunta “o achado existe fora de GE?”. Não é auditoria de GM/PE e não dimensiona a classe.

## 9. Acumulado do Gate B após Lote 9

Partindo do fechamento pós-AL:

- competências auditadas: **74/90**;
- candidatas individuais: **45**;
- rotas: **40 CODIGO / 1 SIMULACAO / 4 CRIANCA**;
- classes estruturais: **7** (`CLASS-001`–`CLASS-007`);
- `CLASS-005`: `FECHADO-COM-RECIBO`;
- `CLASS-006`: `FECHADO-COM-RECIBO` em `1088aed...`;
- `CLASS-007`: **ABERTA / não dimensionada**;
- `DECISAO-001/GM.04`: permanece `PENDENTE-DE-DECISÃO-HUMANA` e não foi tocada;
- correções implementadas dentro do Gate B: **0**;
- não auditadas como lote: **16 competências** = GM 12 + PE 4.

## 10. Autoverificação do relatório

No SHA documental deste relatório devem ser comprovados antes de registrar recibo:

1. diff contra `1088aed...` somente neste arquivo autorizado;
2. `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`; PR #35 open + draft + unmerged;
3. CI + transversal citados com `head_sha` igual ao SHA documental;
4. medição principal: 10/10 competências, 50/50 contratos, 17/50 afetados e 6 GAPs; CLASS-007 apenas por cota inferior de testemunhas, sem prevalência global;
5. gate tocado: **não**; mutação: **N/A**.

## 11. STOP D069

**STOP acionado por nova classe estrutural CLASS-007.**

Não iniciar GM, PE, Gate B′, Gates C–J ou Creature Engine enquanto a condição não for tratada/reautorizada. Não marcar PR ready, não habilitar auto-merge e não mergear. `main` permanece intocada.
