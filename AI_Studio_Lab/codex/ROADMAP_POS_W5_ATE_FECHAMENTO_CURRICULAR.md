# Roadmap pós-W5 — até o fechamento curricular do SAGA

**Data-base:** 2026-08-10  
**Ponto de partida:** W5 / GM.05 / F61 / Regua  
**Branch de trabalho:** `codex/integrar-bloco-f0`  
**Escopo:** currículo/motores/QA do SAGA. Creature Engine permanece fora desta fila.

> Este roadmap define **fases e critérios de saída**, não uma ordem fixa de competências. Cada nova onda W6+ deve ser escolhida pela Coverage Matrix + DAG do HEAD vigente. Nunca hardcodar uma sequência antiga quando a fonte real mudou.

## 0. Estado de partida após W5

Coverage Matrix vigente:

- 90 competências;
- 94 fichas autorais;
- 30 Composer;
- 22 legado;
- 38 fallback;
- 52 servidas;
- 17 divergências ficha↔screen;
- 12 swaps;
- 44 estreias;
- único blocker de primitive: `Moedas`.

Primitives:

- 21 executáveis;
- 4 renderer-sem-builder;
- 1 componente isolado;
- 0 ausentes.

Dívida conhecida:

- `Moedas`: renderer-sem-builder, afeta GM.03;
- `LinkingCubes`, `SingaporeBars`, `VisualAddition`: renderer-sem-builder;
- `Quadrado100`: isolado;
- 22 competências em legado;
- 38 em fallback;
- 17 divergências.

## 1. W6 e ondas seguintes — fábrica curricular causal

Para **cada** onda:

1. reancorar PR #29, branch, HEAD, CI, review threads;
2. rodar/inspecionar Coverage Matrix atual;
3. ler DAG: profundidade, ancestrais e descendentes;
4. cruzar:
   - fallback/legado;
   - divergência;
   - primitive blocker/debt;
   - onboarding visual;
   - risco motor/a11y;
   - risco pedagógico;
   - reuso horizontal de primitive;
   - custo de implementação;
   - qualidade de evidência/diagnóstico;
5. escolher **uma** competência;
6. ler ficha autoral integral + runtime integral + consumidores da primitive;
7. escrever regressão primeiro;
8. criar/ajustar contract/procedure;
9. implementar stage/boundary/diagnóstico/evidência/a11y;
10. registrar INATIVO;
11. rodar gates e browser real quando gesto/geometria importarem;
12. somente com estado inativo verde, ativar canário;
13. deixar a Matrix observar o delta real;
14. somente depois atualizar `COVERAGE_MIGRATIONS`;
15. rodar gates completos no mesmo HEAD;
16. registrar checkpoint/handoff/PR.

### Critério de saída da fase 1

Não existe um número predeterminado de waves. A fase termina quando todas as competências estão **realmente servidas** ou qualquer exceção restante está explicitamente justificada, governada e testada.

## 2. Fechar blockers e ownership de primitives

Prioridade estrutural alta, sem substituir a seleção causal por hardcode:

- resolver `Moedas`/GM.03 se a Matrix+DAG confirmar o peso esperado;
- eliminar renderer-sem-builder quando a primitive é usada em ficha autoral ativa;
- decidir o destino de `Quadrado100`: integrar com ownership real ou documentar/remover isolamento se for código morto;
- garantir que cada kind tenha builder genérico ou specialized builder com consumidor real comprovado;
- impedir builders órfãos e renderers sem contrato.

### Critério de saída

- 0 primitives bloqueadoras;
- 0 primitive usada em currículo ativo sem ownership/builder comprovado;
- nenhuma primitive isolada sem decisão explícita.

## 3. Zerar fallback real

Fallback significa conteúdo curricular não servido e, pelos invariantes do SAGA, não pode fornecer evidência/recompensa real.

Para cada fallback restante:

- materializar ficha runtime autoral;
- implementar representações e interações corretas;
- diagnóstico/evidência;
- a11y;
- onboarding quando houver estreia/troca visual;
- canário + Matrix + ledger.

### Critério de saída

- **0 fallback não justificado**;
- todas as 90 competências têm conteúdo real disponível sob learner state/DAG.

## 4. Resolver legados

Cada um dos 22 legados precisa de decisão individual:

- migrar para ficha/Composer quando a ficha autoral exigir experiência diferente/mais governada;
- ou, se um legado for realmente adequado, registrar exceção explícita com paridade, ownership e evidência — nunca deixá-lo apenas porque “funciona”.

### Critério de saída

- nenhum legado sem decisão formal;
- idealmente Composer cobre toda entrega autoral compatível;
- qualquer exceção restante tem contrato e justificativa explícitos.

## 5. Zerar divergências ficha↔screen

As 17 divergências atuais precisam cair por reconciliação real, não por mudar expectativa.

Para cada divergência:

1. identificar qual é a autoridade canônica;
2. verificar se a ficha está correta ou histórica;
3. ajustar runtime ou retificar cânone com justificativa;
4. preservar proveniência;
5. testar os cinco níveis;
6. atualizar Matrix só por observação.

### Critério de saída

- **0 divergência não justificada**;
- exceção normativa, se existir, é explícita e testada.

## 6. Auditoria visual premium transversal

O incidente F61 mostrou que “teste verde” não garante produto infantil visualmente aceitável.

Criar/aplicar uma revisão transversal de toda primitive autoral, priorizando as motoras/geométricas:

- screenshots/contact sheets em phone/tablet/desktop;
- silhuetas/objetos coerentes com o conceito;
- sem emoji/sprite quando whitespace/caixa tipográfica altera a matemática;
- proporções plausíveis;
- nada cortado/vazando/sobreposto;
- legibilidade de números/rótulos;
- hierarquia visual clara;
- cores/contraste/a11y;
- estado antes/durante/depois da interação;
- primeira exposição/onboarding;
- coerência com a casca visual da faixa etária;
- nenhum “placeholder bonito” que ensine geometria falsa.

### Critério de saída

- artifacts auditáveis para primitives críticas;
- browser probes onde layout/motor importam;
- nenhuma falha visual conhecida classificada como “só cosmética” quando afeta compreensão ou confiança.

## 7. Auditoria de áudio e tutoria

Para todas as fichas autorais:

- `audioPrompt`, howto e explain coerentes;
- sem fala que entregue resposta;
- sem TTS se autocancelando;
- fallback de áudio seguro;
- tutorial não fabrica evidência;
- repetição/retry não duplica reward/evidence;
- vocabulário adequado à casca/idade real;
- Sensei continua prescrevendo via learner state/DAG.

### Critério de saída

- QA áudio verde;
- nenhuma fala divergente do estado visual/matemático.

## 8. Auditoria learner state / mastery / rewards

Executar regressões transversais sobre:

- mastery/unlock;
- sessões exigidas;
- evidências extras;
- retry/replay idempotentes;
- fallback sem reward;
- XP lifetime não gastável;
- moedas spendable atômicas;
- Misto dobra moedas apenas;
- RT observacional;
- Atlas/insígnias derivados do graph + learner state;
- persistência/cloud reconciliation;
- rollback de canários.

### Critério de saída

Nenhuma rota de UI, telemetry ou reward pode conceder competência fora da autoridade do learner state + DAG.

## 9. Simulação longitudinal

Rodar perfis sintéticos e jornadas completas para verificar:

- onboarding inicial;
- progressão de 4–12 anos;
- desbloqueios causais;
- remediação/resgate;
- revisão espaçada;
- alternância Jornada/Dojo;
- perfis fortes/fracos/irregulares;
- persistência entre sessões;
- ausência de dead ends no grafo;
- ausência de competência inalcançável por evidência impossível.

### Critério de saída

- nenhuma trilha causal bloqueada indevidamente;
- nenhuma mastery impossível ou concedida sem evidência suficiente.

## 10. Performance e robustez

Depois do conteúdo correto:

- atacar bundle >500 kB por code-splitting quando justificável;
- remover warnings de teste que mascaram falhas reais;
- verificar mobile/tablet memory/CPU;
- offline/determinismo;
- erros de asset/font/rede externos não podem derrubar gates funcionais sem motivo;
- first-party HTTP/JS errors continuam fatais;
- revisar lazy loading de primitives/artifacts.

### Critério de saída

Performance não compromete interação infantil nem confiabilidade dos gates.

## 11. Auditoria final do currículo

Rodar uma mega auditoria derivada das fontes:

- 90 competências presentes no grafo;
- 94 fichas autorais catalogadas (ou novo número canônico explicitamente versionado);
- Matrix sem drift;
- prerequisites válidos/aciclicidade;
- nenhuma ficha sem runtime/decisão;
- nenhum kind sem builder/owner;
- nenhuma primitive faltante;
- divergências zeradas ou explicitamente governadas;
- onboarding/a11y/testes nominalmente presentes onde exigidos;
- screenshots/sondas críticas verdes.

Não editar baseline para “fechar”. Corrigir a fonte real.

## 12. Release Candidate curricular

Quando a auditoria final estiver verde:

1. congelar um checkpoint RC;
2. rodar CI integral no SHA exato;
3. rodar sondas browser críticas;
4. executar simulação longitudinal final;
5. revisar diff/higiene/binários/secrets;
6. revisar documentação de retomada;
7. confirmar PR open/draft/unmerged até decisão humana;
8. preparar nota de release/merge, **sem mesclar automaticamente**.

### Critério de saída

Existe um SHA remoto reproduzível com:

- gates verdes;
- Matrix coerente;
- QA visual/áudio/motor verde;
- learner state/reward/persistência íntegros;
- documentação/handoff atualizados;
- nenhuma pendência conhecida escondida.

## 13. Depois do fechamento curricular

Somente após decisão explícita do usuário:

- decidir se/como integrar a branch à main;
- tratar Creature Engine em fila própria;
- planejar backend/contas/tutoria IA em produção, se ainda não estiverem no escopo da branch;
- observabilidade/analytics de produção;
- beta controlado com crianças/responsáveis;
- pesquisa de eficácia pedagógica;
- internacionalização/novas disciplinas como frentes separadas.

Nada desta seção autoriza merge ou mudança de escopo automaticamente.

---

## Regra de ouro até o fim

**Fonte real → teste/regressão → implementação inativa → experiência real → ativação → Matrix observa → ledger → checkpoint.**

E, depois da lição da F61:

**Se a matemática está correta no código mas a criança vê uma representação visual falsa, grotesca ou ambígua, o exercício NÃO está pronto.**
