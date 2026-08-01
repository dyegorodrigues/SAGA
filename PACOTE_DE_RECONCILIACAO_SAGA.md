# 🔧 PACOTE DE RECONCILIAÇÃO SAGA
**Cânone × Repositório · 1º de agosto de 2026 · documento de decisão**

> ✅ **STATUS: EXECUTADO.** Todas as edições descritas neste documento **já foram aplicadas** aos
> arquivos canônicos entregues junto. A Bíblia está na **v3.1**, o Grafo na **v1.2**, o Dojo na
> **v1.3**, o Manual na **v2.3**, e as fichas passaram de 90 para **92** (JD2 e JD3 escritas).
> O registro detalhado da execução — o que mudou, onde, por quê, e o que o código tem de fazer —
> está em **`DIARIO_DE_ALTERACOES_CANONE_v3.1.md`**.
>
> Este documento continua sendo a **justificativa da decisão** e a evidência que a sustenta.
> Leia-o primeiro; leia o Diário depois.

> Este documento resolve a divergência entre os documentos canônicos e o repositório,
> define a **Bíblia v3.1** como versão final antes da retomada, e entrega ao Codex uma
> ordem de trabalho sem ambiguidade. Tudo aqui foi **medido**, não presumido.

---

# 0. COMO ISTO FOI PRODUZIDO

Fonte A — cânone: os 13 documentos do projeto (`/mnt/project`).
Fonte B — repositório: ZIP do branch `codex/realizar-auditoria-completa-do-repositorio-saga-fovec6`.

Medições executadas: contagem de nós por parsing do YAML e do TXT, diff nó a nó,
diff de seções da Bíblia v2.7 × v3.0, leitura do `GENERATOR_MAP`, contagem de fichas
em disco, verificação de pré-requisitos cruzados, e leitura do Diário de Bordo.

Nenhuma nota deste documento é dada a arquivo que não foi lido.

---

# 1. ESTADO MEDIDO

## 1.1 O que diverge

| Item | Cânone (docs) | Repositório | Veredito |
|---|---|---|---|
| Competências no grafo | **88** | **95** | ⚠️ divergência real |
| Trilhas de fluência | 13 | 13 | ✅ idênticas, byte a byte |
| Nós que só existem no repo | — | 7 | ⚠️ ver §2 |
| Nós que só existem no cânone | 0 | — | ✅ o repo contém os 88 |
| Nomes e faixas dos 88 comuns | — | — | ✅ **zero divergência** |
| Bíblia | **v3.0** | v2.7 (2 cópias) | repo atrasado |
| Grafo `.md` | 88 IDs | 95 IDs | coerente com cada YAML |
| Manual Didático | — | — | ✅ **md5 idêntico** |
| Dojo | **v1.2** | v1.1 | repo atrasado |
| Método, Arquitetura Cognitiva, 5 blocos de fichas | existem | **ausentes** | nunca subiram |

## 1.2 O que o repositório tem e o cânone não sabia

O relatório de auditoria que circulou estava **desatualizado e com a tabela errada**.
O repositório real, medido agora, tem:

- **865 testes**, 30 arquivos de teste, `typecheck` e `build` aprovados
- `catalog_auditor.cjs` (238 linhas) rodando via `npm run auditar` — existe, em
  `AI_Studio_Lab/tools/`, não em `scripts/`
- `grafo:check` no pipeline de build — o grafo não pode divergir sem quebrar o build
- `rescuePlanner.ts` real: procura o pré-requisito mais frágil, dose curta (4) ou
  severa (8), anti-loop de 3 missões, retorna `null` em vez de inventar fallback
- **Domínio multidimensional implementado**: compreensão, independência, fluência e
  retenção; coroas antigas preservadas como `crownedBy: legacy`
- Painel dos pais com as 4 dimensões
- `rt_alvo` da ficha alimentando `rt_max_s` no runtime

**Correção às notas que circularam:** a tabela por faixa da auditoria anterior
(F2 21 · F3 18 · F4 10 · fluência 11) está errada. O real é F0 15 · F1 20 · F2 22 ·
F3 21 · F4 17 = 95, mais 13 trilhas. E ela deu nota A− a motores que declarou não ter
conseguido ler. **Nota sem leitura não é evidência** (§14.1).

O headline dela, esse sim, confere: **42/95 com gerador, 53 em fallback, 44,2%.**

## 1.3 A cobertura real, medida agora

| Faixa | Com gerador | Total | % |
|---|---:|---:|---:|
| F0 | 14 | 15 | 93% |
| F1 | 20 | 20 | 100% |
| F2 | 7 | 22 | 32% |
| F3 | 1 | 21 | 5% |
| F4 | 0 | 17 | 0% |

Único buraco em F0: **GM.01** (comparação direta de grandezas).
Fichas declarativas em código: **12 de 90**.
Kinds implementados no Composer: **10** de ~45 do catálogo §9. Faltam os críticos:
`vertical`, `array`, `area-model`, `frac-shade`, `singapore-bars`, `angle`, `measure`.

---

# 2. A DECISÃO CENTRAL: **88**

## 2.1 Os 7 nós extras são duplicatas

| Nó no repo | Já existe no cânone como | Veredito |
|---|---|---|
| `N5.07` Frações equivalentes (pré-req N5.02) | `N5.03` Equivalência e comparação de frações (pré-req N5.02) | **duplicata exata** — mesmo conceito, mesmo pré-requisito |
| `N5.08` Comparar frações | `N5.03` — que já inclui "comparação" no nome | **duplicata** |
| `N5.06` Somar frações (mesmo denom.) | `N5.04` Adição e subtração de frações | **duplicata e mais fraca** — cobre menos |
| `N7.04` Porcentagem | `N6.03` **Porcentagem** | **duplicata literal** |
| `N7.03` Razão e proporção | `N6.04` Razão e proporcionalidade | **duplicata literal** |
| `PE.05` Probabilidade e chance | `PE.03` Média e probabilidade como fração + `PE.04` Estatística e probabilidade | **sobreposição total** |
| `N2.08` Múltiplos | `N4.11` **múltiplos, divisores e primos** (ficha F70, com crivo de Eratóstenes no nível 5) | **duplicata** |

O caso mais claro do defeito: no YAML do repo, **`N7.04 Porcentagem` tem `N6.03` como
pré-requisito**. O grafo está dizendo que *Porcentagem exige Porcentagem*. É um ciclo
semântico que o detector de ciclos não pega, porque os IDs são diferentes.

## 2.2 Remover custa zero

Medido, um por um:

| Nó | Gerador | Ficha | Citado como pré-req por nó canônico |
|---|:---:|:---:|:---:|
| N2.08 | 0 | 0 | 0 |
| N5.06 | 0 | 0 | 0 |
| N5.07 | 0 | 0 | 1 — só por N5.08 |
| N5.08 | 0 | 0 | 1 — só por N7.03 |
| N7.03 | 0 | 0 | 1 — só por N7.04 |
| N7.04 | 0 | 0 | 0 |
| PE.05 | 0 | 0 | 0 |

Os 7 formam uma **ilha fechada**: só apontam uns para os outros. Nenhum nó canônico
depende deles. Nenhum tem gerador. Nenhum tem ficha. **Remover não perde uma linha de
código nem uma hora de trabalho.**

## 2.3 Por que 88 vence 95

1. As **90 fichas** — o maior ativo do projeto, ~4.000 especificações — foram escritas
   contra o grafo de 88. Mudar o grafo obriga a reescrever fichas boas.
2. Os 7 extras violam a **§15.3** da própria Bíblia, que exige teste de duplicação
   antes de criar competência.
3. `Método SAGA` e `Arquitetura Cognitiva` já dizem 88.
4. Cobertura de ficha: **88/88, zero órfã, zero citando nó inexistente** (medido).
5. Manter 95 significa carregar 7 buracos permanentes que nunca terão ficha.

**Decisão: o grafo canônico é de 88 competências e 13 trilhas de fluência.**
De onde veio o "95": o changelog da v2.7 anunciou 11 novas competências. O repo criou
as 11; o cânone, ao auditar, absorveu 4 (N2.06 Pares e ímpares, N2.07 Fatores,
GM.10 Conversão, GM.11 Volume de prismas) e rejeitou 7 por duplicação. 84 + 4 = **88**.
O anúncio ficou no changelog; a decisão de rejeitar nunca foi registrada. É isso que
o §15.8 abaixo conserta.

---

# 3. BÍBLIA v3.1 — AS EDIÇÕES
> *Todas as edições desta seção foram **aplicadas**. O que segue é o registro do que foi feito e do critério usado.*

## 3.A Mecânicas (sem discussão, aplicar)

| # | Onde | O quê |
|---|---|---|
| A1 | linha 76 | `84 competências` → `88 competências` |
| A2 | linha 305 | `as 84 competências` → `as 88 competências` |
| A3 | linha 539 | `84 geradores × 5 níveis` → `88 geradores × 5 níveis` |
| A4 | linha 545 | `produzem-se 84 competências pela metade` → `88` |
| A5 | linha 618 | `84 nós com arestas` → `88 nós com arestas` |
| A6 | linha 815 (changelog v1.0) | `grafo de 84 competências` → **não mexer**, é registro histórico |
| A7 | linha 819 (changelog v2.7) | acrescentar ao fim: *"— das 11 anunciadas, 4 foram absorvidas (N2.06, N2.07, GM.10, GM.11) e 7 rejeitadas por duplicação na auditoria de ago/2026; o grafo fecha em 88."* |
| A8 | antes de `### 13.1` | **restaurar o cabeçalho perdido**: `## §13. DIAGNÓSTICO DO ESTADO ATUAL E PLANO DE MIGRAÇÃO` — ele existe na v2.7 e sumiu na edição para v3.0. Hoje a Bíblia pula de §12 para §14 e dois trechos referenciam "§13" apontando para o vazio. |

Nos outros documentos:

| Arquivo | Linha | Correção |
|---|---|---|
| `GRAFO_DE_CONHECIMENTO_SAGA.md` | 56 | `Total: 84 competências` → `Total: 88 competências` |
| `GRAFO_DE_CONHECIMENTO_SAGA.md` | 694 | `O grafo passa de 84 para 95 nós` → `O grafo passa de 84 para 88 nós (11 candidatas analisadas, 4 absorvidas, 7 rejeitadas por duplicação)` |
| `MANUAL_DIDATICO_SAGA.md` | 883 | `nenhuma das 84 competências` → `nenhuma das 88 competências` |
| `METODO_SAGA.md`, `ARQUITETURA_COGNITIVA_SAGA.md` | — | já corretos (88), não mexer |

## 3.B Pedagógicas — as 5 correções que as auditorias acertaram

Estas são as únicas recomendações das auditorias que eu endosso e que mudam
comportamento. Texto pronto para colar.

### B1 · §8 — Erro motor não é erro conceitual

> **Filtro motor antes da tag.** Nenhuma tag de misconception é aplicada a partir de
> um evento isolado de manipulação. Antes de registrar, o motor separa dois padrões:
> **erro motor** — a criança mira o alvo certo, solta perto, e corrige sozinha na
> sequência; ou o gesto termina fora de qualquer alvo válido. **Erro conceitual** — a
> criança acerta o gesto e escolhe o destino errado, e repete o mesmo destino.
> Erro motor **nunca** pontua como erro, nunca alimenta o Radar e nunca aparece no
> painel dos pais. Isto é aplicação direta do contrato de robustez gentil: toque
> acidental jamais conta como erro.

### B2 · §11.4 — O Radar passa a ser probabilístico

> **Peso de evidência.** Uma tag não é um fato; é uma hipótese que acumula força.
> Cada ocorrência entra com um peso: erro isolado `0.2` · mesmo erro em duas fichas
> diferentes `0.5` · erro com tempo de resposta muito curto (chute ou automatismo
> errado) `0.7` · erro com padrão consistente na mesma sessão `0.9` · erro que
> **persiste depois da dica** `1.0`. O Radar só abre Missão de Resgate quando a soma
> passa de `1.5`. Abaixo disso age a Oficina invisível.
> O sistema afirma *"há indício de que a criança está usando subtração invertida"* —
> nunca *"a criança tem subtração invertida"*.

### B3 · §5 — Velocidade não tranca compreensão

> **O relógio é sempre silencioso na Jornada.** O `rt` é medido em toda resposta, mas
> na Jornada ele alimenta apenas a dimensão *fluência* do domínio multidimensional —
> **nunca bloqueia a subida de nível nem a abertura de competência seguinte**.
> Cronômetro visível existe só no Dojo, só a partir dos 7 anos, e é opcional.
> Uma criança que resolve pela estratégia certa, devagar, **dominou o conceito**.
> Consequência direta: nenhuma ficha pode declarar tempo como critério de domínio
> conceitual. *(Corrige a F14, que exigia rt < 8s para domínio na Jornada.)*

### B4 · §12.3 — Divulgação progressiva nas fichas densas

> **Uma tela nunca mostra tudo ao mesmo tempo na primeira vez.** Em fichas que reúnem
> três ou mais representações simultâneas (material + conta armada + coluna ativa +
> vai-um), a primeira exposição segue escada de revelação: (1) só o material;
> (2) material + a transformação; (3) material + conta ao lado; (4) conta com material
> de apoio; (5) só a conta. A escada de revelação é **independente** da escada de
> níveis: uma criança no nível 4 que volta pela Oficina reentra no degrau de revelação
> apropriado. *(Fichas afetadas: F39, F40, F35, F68, F69, F76.)*

### B5 · §7 — A Mão Fantasma vira exemplo esmaecido

> **A Mão Fantasma não resolve o exercício inteiro com a tela travada.** Ela demonstra
> **o primeiro item**, em no máximo 10 segundos, e devolve a tela imediatamente,
> piscando o próximo alvo para a criança fazer. Se a criança errar o segundo, a mão
> demonstra de novo — um item, não o exercício. A cada retomada da mesma competência a
> demonstração encolhe (fading), até sumir no nível 3.
> Motivo: criança de 4 a 5 anos tem foco de 4 a 6 minutos e urgência motora. Tela
> travada por 40 segundos produz toque-spam, que o motor lê como desistência.
> *(A `<GhostHand/>` ainda não foi construída — esta é a especificação antes do código,
> que é o momento barato de corrigir.)*

## 3.C Uma seção nova: §15.8 — o teste que teria pegado os 7

> **§15.8 Invariante de contagem e teste de duplicação executável.**
> O número de competências é um invariante verificável, não uma frase em prosa.
> O auditor falha o build se:
> 1. `count(grafo_saga.yaml.nodes) ≠ count(GRAFO_DE_CONHECIMENTO_SAGA.md) ≠ count(.json) ≠ count(.ts)`;
> 2. o número declarado no corpo da Bíblia, do Manual e do Método divergir da contagem real;
> 3. dois nós tiverem **nome com sobreposição semântica** e **o mesmo conjunto de pré-requisitos** — sinal de duplicata;
> 4. um nó tiver como pré-requisito outro nó cujo nome o contenha (`N7.04 Porcentagem` ← `N6.03 Porcentagem`).
>
> **Toda candidata a competência nova entra primeiro numa lista de espera com o teste
> de duplicação registrado por escrito.** Rejeitar é uma decisão que se documenta, não
> se esquece: se a candidata for recusada, a recusa vai para o changelog com o nó que
> já a cobria. *(Regra escrita a partir do incidente das 11 candidatas de v2.7: 4
> absorvidas, 7 duplicatas que chegaram a virar código.)*

## 3.D O que eu recusei das auditorias — e por quê

| Recomendação | Veredito | Motivo |
|---|---|---|
| Renomear IDs das fichas (N5.03→N5.07 etc.) | ❌ **recusada** | Os IDs das fichas estão certos. Executar isso quebraria 4 fichas boas apontando para nós que vão deixar de existir. |
| Adotar "95 competências" | ❌ **recusada** | 7 são duplicatas. Ver §2. |
| Afrouxar domínio para "3/3" e "4 acertos assistidos" | ⚠️ **parcial** | Aceito a **regra anti-frustração** (duas sessões ruins → baixa dificuldade, traz ficha dominada como aquecimento, depois reintroduz). Recuso coroar criança que só acerta com ajuda: o domínio multidimensional já implementado pelo Codex resolve isso melhor, medindo *independência* como dimensão separada. |
| 8 lacunas de cobertura (mediana, ×÷ decimais, ×÷ negativos, 4 quadrantes, funções, desigualdades, transformações, problemas multietapa) | 🅿️ **estacionadas** | Medido: ×÷ decimais já está em `N6.02`, ×÷ negativos já está em `N7.02`. As outras 6 são conteúdo de F4 — 5 a 6 anos à frente dos teus filhos — e nenhuma passou pelo teste de duplicação da §15.3. Entram na lista de espera da §15.8, não no grafo. |
| Casca visual por idade (Kids / Explorer / Lab) | ✅ **aceita como expansão documentada** | Resolve o problema real do filho de 9 anos que ainda está em F1. Vira `§12.5-ter`, marcada como direção futura, igual ao modo caneta. Não bloqueia nada agora. |

---

# 4. OS OUTROS DOCUMENTOS
> *Aplicado. Versões finais: Grafo v1.2 · Manual v2.3 · Dojo v1.3 · Método e Arquitetura Cognitiva com contagem de fichas corrigida.*

| Documento | Ação |
|---|---|
| `GRAFO_DE_CONHECIMENTO_SAGA.md` | corrigir linhas 56 e 694 · subir ao repo substituindo a versão de 95 |
| `grafo_saga.yaml` / `.json` / `.txt` | **regenerar a partir do cânone de 88** · rodar `npm run grafo:gerar` |
| `DOJO_SAGA.md` | subir a **v1.2** (repo está na v1.1, sem degrau zero, comutatividade e eixo Y) |
| `MANUAL_DIDATICO_SAGA.md` | só a linha 883 · o arquivo é idêntico ao do repo |
| `METODO_SAGA.md` · `ARQUITETURA_COGNITIVA_SAGA.md` | **subir** — nunca existiram no repo |
| `FICHAS_F0` a `F4_COMPLETAS.md` | **subir** — nunca existiram no repo. É o que o Codex está esperando. |
| Bíblia duplicada (`Upload_docs/` × `AI_Studio_Lab/pedagogia/`) | ⚠️ **duas cópias divergentes** — uma diz 84, outra diz 95. Manter **uma só** e apontar a outra por link. |

## 4.1 As duas fichas que faltavam de verdade — ✅ **ESCRITAS**

`JD2 · A Mão Relâmpago` (mãe N1.08) e `JD3 · Moldura Relâmpago` (mãe N1.11) existem
**apenas como duas linhas de especificação** no `DOJO_SAGA.md` (linhas 253-254).
Eram as duas únicas ausências reais do cânone. **Foram escritas no formato completo de 9 seções**
e estão no `FICHAS_F0_COMPLETAS.md` — JD2 (mãe N1.08, a âncora do 5 virando reflexo) e JD3
(mãe N1.11, os amigos do 10 como percepção de vazio, porta de entrada da trilha FD1).
**Jardim do Dojo completo: JD1, JD2, JD3, JD4, JD5.** Total de fichas: 90 → **92**.

---

# 5. O QUE ENTREGAR AO CODEX, NESTA ORDEM

O Diário de Bordo dele registra, textualmente, que ele está **bloqueado esperando as
fichas**: *"ampliar tags semânticas, demonstrações e Mão Fantasma por competência
depende das fichas cinematográficas em elaboração"*. Ele também escreveu a regra certa:
quando o arquivo do proprietário chegar, ele *"entra primeiro como material de
comparação, nunca como substituição cega"*.

**Envio 1 — a reconciliação do grafo** *(bloqueia todo o resto)*
1. Remover os 7 nós duplicados do `curriculum/grafo_saga.yaml` e dos YAMLs por strand
2. `npm run grafo:gerar` para regenerar `.md`, `.json`, `.ts`
3. `npm run auditar` + `npm test` — exigir **saída bruta de terminal** (§14.1)
4. Critério de aceite: `88` em todos os artefatos, 865 testes ainda verdes

**Envio 2 — o cânone atualizado**
Bíblia v3.1, Grafo corrigido, Dojo v1.2, Manual, Método, Arquitetura Cognitiva,
5 blocos de fichas. Uma cópia só de cada, com a duplicata apontando por link.

**Envio 3 — a §15.8 no auditor**
Implementar os 4 testes de invariante no `catalog_auditor.cjs` e ligá-lo à CI.
É a correção mais barata e a que impede o problema de voltar.

**Envio 4 — os kinds P1**
`vertical`, `array`, `area-model`, `frac-shade`, `singapore-bars`. Sem eles F2, F3 e
F4 não são viáveis, e hoje o Composer só tem 10 dos ~45 kinds do catálogo §9.

**Envio 5 — tampar F0**
`GM.01` (comparação direta de grandezas) é o único buraco de F0. F0 é a porta de
entrada do teu filho de 4 anos. Não pode ter fallback.

**Envio 6 — F2 antes de F3/F4**
15 competências de F2 em fallback. Construir F3 antes de fechar F2 é levantar parede
sem alicerce, e viola a §14.6 (migração nunca reduz alcance).

---

# 6. O QUE NÃO FAZER

1. **Não renomear IDs de ficha.** As fichas estão certas.
2. **Não adotar 95.** São 88.
3. **Não criar competência nova** sem passar pela §15.8 — inclusive as 6 "lacunas"
   que sobraram das auditorias.
4. **Não deixar duas cópias do mesmo documento canônico** no repo. Foi assim que uma
   Bíblia passou a dizer 84 e a outra 95.
5. **Não aceitar relatório sem saída bruta de terminal.** A auditoria que circulou deu
   nota A− a quatro motores que declarou não ter conseguido ler.
6. **Um ambiente edita por vez.** Enquanto o Codex faz o Envio 1, ninguém mexe no grafo.

---

# 7. RESUMO EM UMA LINHA

O papel está pronto e vale 88 competências. O código está melhor do que se dizia
(865 testes, auditor, Oficina executável, domínio multidimensional) mas carrega
7 competências duplicadas que nunca deveriam ter existido e está esperando as fichas.
Remove os 7, sobe o cânone, liga a §15.8 na CI — e o Codex volta a andar.

---

*Produzido em 1º de agosto de 2026, a partir de medição direta dos arquivos.
Toda afirmação numérica deste documento é reproduzível.*
