# Roteiro de construção do SAGA — os oito andares

**Origem:** consolidação da análise final produzida na task Codex
`Estabelecer fluxo de trabalho para nova tarefa` (2/ago/2026), recuperada de um
snapshot MHT da conversa e verificada contra o repositório em 3/ago/2026.

**Por que este arquivo existe.** O roteiro completo vivia apenas no histórico de
um chat, fora do repositório. Isso contraria o princípio operacional adotado pelo
próprio projeto: *a memória confiável é repositório, testes e histórico Git, não a
conversa.* Cada afirmação abaixo foi reconferida contra o código; onde a conversa
divergia do estado real, a divergência está marcada.

---

## 1. Estado do projeto, em termos simples

Fundação existente: 88 competências canônicas, 13 trilhas de fluência, 92 fichas
autorais em cinco blocos, grafo determinístico, Composer incremental, Radar,
Oficina, painel dos pais, auditoria curricular e runtime com caminhos autorais e
legados convivendo.

> O princípio central é que o SAGA não é um catálogo de exercícios: é uma máquina
> que lê competência, seleciona uma experiência, intervém e registra domínio.

Lotes concluídos: **A** (N3.11 vertical padrão-ouro), **B** (N3.09 como canário do
Composer), **C** (N4.02 e ArrayGrid autoral). O **Lote D não foi implementado**.

### Cobertura real medida (3/ago/2026)

| Medida | Valor |
|---|---:|
| Nós em fallback "Em construção" | **46/88** |
| Fichas de Jornada no disco e registradas | 15/88 |
| Primitivas executáveis | 14 |
| Primitivas com renderer sem builder | 4 |
| Componentes isolados | 6 |
| Lacuna real de primitiva | 1 (`Regua`/`measure`) |

---

## 2. A separação de camadas do Lote D

```
StoryPanel descreve o mundo.
SingaporeBars descreve a matemática.
O Composer coordena os dados.
O renderer apenas apresenta.
A telemetria registra a ação.
```

A separação é obrigatória. Se `SingaporeBars` carregar personagens e narrativa,
deixa de ser primitiva reutilizável, mistura interpretação linguística com
matemática e impede o diagnóstico distinguir erro de leitura de erro de estrutura.
Se `StoryPanel` desenhar as barras, a narrativa passa a conhecer detalhes internos
da primitiva e a telemetria perde a mesma distinção.

---

## 3. As quatro estruturas de N3.10

| Estrutura | Situação | Modelo |
|---|---|---|
| `join` | tinha 4, encontrou mais 3 | `[ 4 ][ 3 ] = [ ? ]` |
| `separate` | tinha 7, entregou 3 | `[ 7 ]` sobre `[ 3 ][ ? ]` |
| `compare` | Lia 8, Caio 5 — quantas a mais? | `Lia: [ 8 ]` sobre `Caio: [ 5 ][ ? ]` |
| `complete` | tem 5, precisa de 9 | `[ 5 ][ ? ] = [ 9 ]` |

**Nível 5 — incógnita variável.** A pergunta não pode recair sempre sobre o
resultado; deve alternar entre parte inicial, transformação, resultado, diferença,
parte ausente e todo. Isso é o coração pedagógico do lote: impede a estratégia
superficial de "pegar os dois números e somar".

---

## 4. Os oito andares

### Andar 1 — Lote D: significado dos problemas aditivos
Ensinar a criança a compreender situações aditivas, não a reconhecer dois números e
aplicar uma operação. `StoryPanel` apresenta personagens, objetos, ação, valores
conhecidos, pergunta, áudio e destaques. `SingaporeBars` representa partes, todo,
diferença, incógnita e a relação entre quantidades.

### Andar 2 — As quatro estruturas
Ver §3. Contrato discriminado por estrutura e diagnóstico específico para cada uma.

### Andar 3 — Implementação técnica
Ordem: investigar `gN3_10` → ler a ficha canônica → tipar `StorySpec` → tipar
`SingaporeBarSpec` → procedimento puro das quatro estruturas → testes do
procedimento → builder do Composer → normalizar o kind runtime → ficha autoral
N3.10 → `StoryPanel` → `SingaporeBars` → integrar em `FichaRenderer` e
`GameLoopExerciseRenderer` → emitir `AnswerMeta` → impedir alternativas duplicadas
→ testar resposta única → 500+ amostras → Sandbox → viewport infantil → manter
`gN3_10` em produção.

**Gate de conclusão:** quatro estruturas executáveis; cinco níveis funcionando;
incógnita variando; resposta não revelada; áudio funcionando; criança não leitora
compreende a ação; sem rolagem; alvos de toque adequados; `reduced-motion`
funcionando; testes passando; build passando; legado intacto.

**Estado dos Andares 1–3: concluídos em 3/ago/2026** — conferido item a item
contra o código em 4/ago, não de memória.

| Item do gate | Evidência |
|---|---|
| Quatro estruturas executáveis | `ADDITIVE_STRUCTURES` em `additiveProcedure.ts`; `coversDistinctStructures` |
| Cinco níveis + incógnita variando | `structuresForLevel`, `unknownSlotsForLevel`; contrato do canário cobre os cinco |
| Resposta não revelada | `BarSlot` da incógnita não tem campo de valor; teste lê a tela renderizada e os rótulos de acessibilidade |
| Áudio | `onReplay` em `StoryPanelStage`; `audioPrompt` na ficha |
| Não leitora compreende | cada parte interrogada anuncia seu papel no texto e no `aria-label` |
| Sem rolagem | 611/611/639/487/487 px contra alvo de 844 |
| Alvos de toque | `minHeight: 80px` nas primitivas de toque (`EmojiRow`, `DragGroup`) |
| `reduced-motion` | `useReducedMotion` em `StoryPanelStage` + regra global em `App.tsx`; teste dedicado |
| Testes / build / legado | 739 testes, build verde, `gN3_10` intacto e exercido pelo teste de paridade |

### Andar 4 — Canário de N3.10, em PR separado

**Estado: concluído em 3/ago/2026.**

Nova branch; N3.10 como canário único; proveniência marcada; rollback explícito;
comparação Composer × legado; testes de saves, telemetria e Jornada; observação de
erros; então promover ou retirar.

> **Implementação e ativação nunca devem ser o mesmo passo.**

| Item | Evidência |
|---|---|
| Nova branch da main mesclada | `origin/main = ea191c2` após o PR #20 |
| N3.10 promovida | `COMPOSER_CANARIES` |
| Proveniência marcada | `generatorSource === "composer"` |
| Rollback explícito | devolve `kind: "story"` na questão seguinte |
| Composer × legado | `storyParity.test.ts` |
| Saves | id, `graphId` e pré-requisitos preservados; save anterior segue válido |
| Telemetria | tag de misconception emitida, aceita pelo Radar; legado não emite |
| Jornada | `contentStatus: "explicit"`, questão completa nos cinco níveis |
| Observação de erro | erro não avança nível; resposta única; sem negativos; 500 amostras sem laço |

**Leitura de "canário único":** foi entendida como *um nó promovido por PR*, e não
como *um único canário no sistema*. N3.09 já havia sido promovida e validada no
Lote B; retirá-la seria regressão. O Plano Mestre confirma a leitura ao exigir
"trocar um único nó por PR".

### Andar 5 — Lote E: confiabilidade antes de expansão

**Estado: concluído em 4/ago/2026. Um único item depende de ação fora do
repositório — publicar as regras e ligar o TTL no Console, dois cliques na mesma
tela — e nada no app depende disso para funcionar hoje.**

E2E da missão diária (criar criança → perfil → missão → ouvir → responder → errar →
dica → recuperar → concluir → salvar → fechar → reabrir → retomar). Firestore:
regras, gravações por sessão, custo de writes, offline, reconciliação entre
dispositivos, migração de saves, retenção, ausência de dados pessoais
desnecessários. Radar: toque errado isolado não gera diagnóstico, erro motor é
filtrado, misconception exige padrão, tags deduplicadas, recuperação observável.
Oficina: ajuda concreta, fluxo não punitivo, limite de resgates, retorno coerente.

| Item | Evidência |
|---|---|
| E2E da missão diária | `missaoDiaria.e2e.test.ts` — ciclo completo com ida e volta real pelo JSON do save |
| Firestore: regras | `firestore.rules` autoriza a subcoleção de telemetria; `firestoreRules.test.ts` compara caminho gravado × caminho declarado |
| Firestore: **publicação** das regras | ⏳ pendente de ação no Console — `PUBLICAR_REGRAS_FIRESTORE.md`. Até lá valem as regras antigas e a telemetria segue negada em silêncio |
| Offline | escrita local primeiro, nuvem depois; erro de rede não vira alerta; cache persistente do Firestore com fallback declarado |
| Reconciliação entre dispositivos | `reconciliacaoDeSaves.ts` — vence o carimbo mais recente, não o lado. Antes a nuvem vencia incondicionalmente e uma sessão só local sumia em silêncio |
| Migração de saves | `migrate()` com `schemaVersion`; `updatedAt` ausente é tratado como save anterior ao carimbo |
| Radar: toque errado isolado não gera diagnóstico | `radarOficina.e2e.test.ts` — três toques na mesma questão chegam ao Radar como um evento só |
| Radar: erro motor é filtrado | `filtroMotor.ts` (§8.3-bis) + sonda de mutação: desligar o filtro derruba 6 testes |
| Radar: misconception exige padrão | `getRescueItems` exige 2 ocorrências da mesma tag em ≤ 5 erros e ≤ 10 min |
| Radar: tags deduplicadas | `Set` em `QuestionDiagnostics`; coberto por `questionDiagnostics.test.ts` |
| Radar: recuperação observável | `recoveredAfterError`, preservado do envenenamento pelo filtro motor |
| Oficina: ajuda concreta e não punitiva | escada acelerada de 2 acertos dentro do resgate (`progressEngine.test.ts`) |
| Oficina: limite de resgates | `RESCUE_ESCALATION_LIMIT = 3`, com sondagem do pré-requisito anterior |
| Oficina: retorno coerente | alvo é destravar (`RESCUE_UNLOCK_LEVEL`), nunca coroar; sem ficha real, retorna `null` em vez de fallback |
| Custo de writes por sessão | `sincronizadorDeNuvem.ts` — 10 gravações do save por missão viram 1; upload anual cai de ~1,3 GB para ~136 MB. Medido, não estimado: `DADOS_E_RETENCAO.md` §3 |
| Retenção | log diário 366 dias, hipóteses do Radar 15 por nó, telemetria 550 dias via campo `expiraEm` (TTL do Firestore). `DADOS_E_RETENCAO.md` §2 |
| Ausência de dados pessoais desnecessários | inventário campo a campo em `DADOS_E_RETENCAO.md` §1. Um campo redundante removido (`parentUserId`); nenhum outro dado sem justificativa |

**Dependência de ordem que vale registrar:** o amortecedor de gravações só é
seguro porque a reconciliação por carimbo veio antes. Na ordem inversa, coalescer
gravações teria aberto uma janela real de perda de progresso — o app fecharia com
gravação pendente e a nuvem antiga venceria na abertura seguinte.

### Andar 6 — Migração gradual de F2
Famílias pequenas: reagrupamento, grupos iguais, arranjos, problemas aditivos,
divisão, tabuadas, medidas. Para cada competência:

```
ficha → contrato → builder → primitiva → renderer → teste
→ Sandbox → paridade → merge → canário separado → promoção ou rollback
```

Não converter automaticamente as 92 fichas Markdown em runtime.

### Andar 7 — Primitivas restantes
`money`, `measure`, `picto`, `pattern`, `area-model`, `frac-shade` e consolidação de
`singapore-bars`. Cada uma exige contrato, procedimento puro, builder, renderer,
acessibilidade, comportamento de áudio, diagnóstico, testes, Sandbox e ao menos
dois usos previstos.

### Andar 8 — Dojo completo
Faixas 1–10, fatos diretos e invertidos, trilhas de fluência, inventário
reproduzível, erro de fluência separado de erro conceitual, Prancheta sobre
contrato próprio, treino sem virar aula e roteamento para a Oficina.

---

## 5. Sistema de design

Redesign entra como infraestrutura, nunca como troca indiscriminada de telas.

**Tokens semânticos**, não literais:

```ts
theme.cor.acao.primaria      // sim
theme.cor.feedback.acerto
theme.movimento.rapido
theme.alvo.infantil

blue500 / green400 / bigButton / fastAnimation   // não
```

Tokens semânticos permitem trocar para pixel-art ou vetorial sem tocar na lógica.
Componentes-base: botão principal, botão de alternativa, botão de áudio, cartão,
palco, feedback, progresso, modal, foco, painel da história e viewport infantil.
Galeria interna mostrando componentes, estados, temas, primitivas, mascotes,
viewports, `reduced-motion`, contraste e foco por teclado.

---

## 6. Motor de mascotes e sprites

```
Evento pedagógico → MascotEngine → Estado expressivo → MascotRenderer → Sprite/atlas
```

Eventos: `session.started`, `question.started`, `prompt.playing`, `answer.correct`,
`answer.incorrect`, `hint.shown`, `regroup.completed`, `mission.completed`,
`reward.received`, `idle`.

Expressões: ocioso, ouvindo, pensando, encorajando, demonstrando, comemorando,
surpreso. **O motor pedagógico decide o estado; o mascote apenas o representa.**

Primeiro pacote de animações — sete, não dezenas: `idle`, `listen`, `think`,
`encourage`, `correct`, `celebrate`, `demonstrate`.

```json
{
  "id": "luna",
  "atlas": "/mascots/luna/atlas.webp",
  "frameWidth": 256,
  "frameHeight": 256,
  "anchor": { "x": 0.5, "y": 1 },
  "animations": {
    "idle":      { "frames": [0], "fps": 1, "loop": false },
    "celebrate": { "frames": [1, 2, 3, 4, 5, 6], "fps": 12, "loop": false },
    "encourage": { "frames": [7, 8, 9, 10], "fps": 8, "loop": false }
  }
}
```

O mascote permanece parado em repouso, inteiro e ancorado ao cenário; movimento
permanente e recorte do personagem são proibidos pelo contrato atual.

---

## 7. Animações pedagógicas e decorativas

**Pedagógica** carrega significado e não pode ser removida: material dourado
formando uma dezena, barra mostrando parte e todo, linha numérica realizando salto,
grupo sendo separado, fileira do ArrayGrid destacada.

**Decorativa** pode ser reduzida ou removida: confete, brilho, estrela, entrada de
cartão, movimento de cenário.

Regras: animar `transform` e `opacity`; evitar `width`, `height`, `top` e `left`;
respeitar `reduced-motion`; não bloquear toque; sincronizar animação pedagógica com
áudio; medir em tablet real.

---

## 8. Áudio e TTS sem API cara em produção

Não faz sentido pagar uma chamada de TTS toda vez que uma criança ouve uma
instrução. A arquitetura correta gera o áudio uma vez e reutiliza.

```
Textos canônicos → Manifesto de falas → Gerador em lote → Arquivos estáticos
→ Validação → public/audio ou CDN → Cache offline → TTS do navegador como fallback
```

**Fase 1 — desenvolvimento:** `speechSynthesis`, gratuito, sem gerar arquivos.
**Fase 2 — geração em lote:** escolher uma voz, gerar tudo no computador, pagar
apenas a geração, salvar arquivos, usar checksum, regerar apenas o que mudou.
**Fase 3 — produção:** arquivos estáticos, cache, offline, TTS somente quando o
arquivo faltar; nunca chamar API por criança.

Formatos: Opus/WebM ou OGG para tamanho; MP3 como fallback de compatibilidade; WAV
apenas como fonte de edição; JSON somente com metadados e caminhos; **nunca base64
dentro do JSON**.

```json
{
  "schemaVersion": 1,
  "contentVersion": "2026.08.1",
  "locale": "pt-BR",
  "voicePack": "luna-v1",
  "entries": {
    "n3.10.join.l1.prompt": {
      "text": "Luna tinha quatro estrelas e encontrou mais três.",
      "file": "/audio/pt-BR/luna/n3-10/join-l1-prompt.opus",
      "fallbackText": "Luna tinha quatro estrelas e encontrou mais três.",
      "durationMs": 3220,
      "checksum": "sha256:...",
      "marks": [
        { "id": "part-a", "atMs": 500 },
        { "id": "part-b", "atMs": 2050 },
        { "id": "unknown", "atMs": 2810 }
      ]
    }
  }
}
```

Organização sugerida:

```
src/audio/        audioTypes.ts, audioCatalog.ts, audioResolver.ts,
                  audioPlayer.ts, speechFallback.ts, choreographyPlayer.ts
content/audio/    speech-manifest.pt-BR.json, speech-source.pt-BR.json
public/audio/     pt-BR/{luna,common,feedback,n3-10,n4-02}/
```

**Falas dinâmicas.** Três estratégias: gravação combinatória (barata, soa
robotizada), TTS local como fallback, e frases parametrizadas pré-geradas. Como os
intervalos matemáticos são limitados e determinísticos, a terceira tende a ser
economicamente viável para grande parte do SAGA.

**Sincronia.** O TTS do navegador não informa de forma confiável o instante exato de
cada palavra. Portanto: uma fala curta por batida visual, ou arquivo pré-gerado com
marcas temporais.

**Independência de fornecedor.** Criar um adaptador em vez de acoplar a uma empresa:

```ts
interface SpeechBatchProvider {
  synthesize(entry: SpeechSourceEntry): Promise<GeneratedSpeech>;
}
```

Antes de escolher, comparar em pt-BR: naturalidade, pronúncia de números e
operações, consistência da voz, licença comercial, custo total do catálogo, geração
em lote, marcas temporais, privacidade e tamanho dos arquivos.

---

## 9. Marcos até o produto publicável

1. **Núcleo pedagógico confiável** — Lote D, canário separado, Lote E, E2E,
   Firestore, saves, Radar, Oficina.
2. **Conteúdo mínimo forte** — F0 e F1 consistentes, F2 prioritário, Dojo inicial,
   missão diária, progressão real.
3. **Sistema visual** — tokens, componentes, temas, galeria, responsividade,
   acessibilidade, `reduced-motion`.
4. **Mídia** — catálogo de falas, player, geração em lote, cache offline, efeitos
   sonoros, motor de mascotes, sprites, animações.
5. **Beta** — 5 a 10 famílias, observação real, métricas, entrevistas, bugs por
   dispositivo, compreensão sem leitura, dificuldade motora, áudio, abandono.
6. **Produção** — staging, CI, deploy, backups, política de privacidade,
   monitoramento, migrações, suporte, checklist de release e plano de rollback.

---

## 10. Correções aplicadas sobre o roteiro original

O roteiro acima foi escrito antes de duas descobertas. Ambas já estão tratadas.

### 10.1 O Andar 4 falharia em silêncio — corrigido em 3/ago/2026

O mecanismo de canário não funcionava pelo caminho de produção, embora seu teste
passasse. Duas causas, comprovadas por execução:

1. `CURRICULUM` era construído avidamente na carga do módulo, capturando o gerador
   em closure. Retirar o id de `VERTICAL_COMPOSER_CANARIES` não surtia efeito:
   `generatorSource` continuava `composer` com o conjunto de canários vazio.
2. `curriculum.ts` só consultava a ponte para os ids `N3.09` e `N3.11`. Adicionar
   qualquer outro nó ao conjunto era ignorado silenciosamente — exatamente o que o
   Andar 4 faria com N3.10.

O teste antigo passava porque exercitava a função isolada, nunca `getTrackById`.

**Correção:** `composerCanary.ts` substitui `verticalMigration.ts`. A decisão passou
a ser resolvida a cada questão gerada, `generatorSource` virou getter e o curriculum
deixou de ter lista de ids privilegiados. Promover um canário agora exige apenas
registrar a ficha em `COMPOSER_FICHAS` e ativar o id. Há testes de regressão que
provam rollback e ativação **pelo caminho de produção**.

### 10.2 A contradição pedagógica do Lote D

A ficha canônica **F20** define `StoryPanel` como primitiva principal de N3.10, e o
`SingaporeBars` existente cobre apenas composição `A + B = total`. O passo "ligar
SingaporeBars ao builder" reduziria as quatro estruturas a uma barra de soma
arrastável. O `PLANO_MESTRE_SAGA.md` foi corrigido; ver a seção do Lote D.

---

## 11. Dívida conhecida, ainda aberta

| Item | Evidência |
|---|---|
| `npm run simular` aponta para `simulated-learner-real.ts`, que não existe | script morto no `package.json` |
| `Kid.grade` só admite `"pre" \| "ano1" \| "ano2"` | produto vai até 12 anos/F4 |
| Dois "Composer" com nomes colidentes | `curriculum/Composer.ts` e `curriculum/motores/composer.ts` |
| `GameLoop.tsx` com 1060 linhas; 11 arquivos acima de 400 | teto arquitetural do `AGENTS.md` |
| Bundle de 1,97 MB (553 kB gzip) e ~5,5 MB de JPGs | orçamento de bundle do Andar 5 |
| `vite` declarado em `dependencies` e `devDependencies` | quebra `--frozen-lockfile` |
| Dois lockfiles versionados (`bun.lock` e `package-lock.json`) | instalação não determinística entre agentes |
