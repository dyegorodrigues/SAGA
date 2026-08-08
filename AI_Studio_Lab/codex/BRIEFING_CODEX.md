# Briefing operacional — continue daqui

> **VIGENTE em 8/ago/2026, pós-P20.**  
> Não reconstruir o histórico pela conversa.

## 0. Primeira leitura

1. `MAPA_MESTRE_POS_P20.md`
2. `HANDOFF_CONTINUIDADE_IA.md`
3. este briefing

Repo: `dyegorodrigues/SAGA`  
Branch: **`codex/integrar-bloco-f0`**  
`main`: `68fad4c575e28959b2ca4776e9a541d6828b63f3` — **não tocar**.  
PR #29: draft/no-merge.  
Creature Engine: fora deste fluxo.

## 1. Não redescobrir

### P17 fechada

- N1.10: JD5 → retirada real de moldura → NumberBond; `SEM_MOLDURA` é gate.
- N1.11: JD3 → F28 → `n + □ = 10`.
- tempo não reprova compreensão da Jornada.

### P8 fechada

Jardim real:

- JD1→N1.03;
- JD2→N1.08;
- JD3→N1.11;
- JD5→N1.10.

JD fora do DAG; save em `dojoTracks`; GameLoop Garden não usa progressão conceitual da Jornada. **JD4 continua dívida.**

### P18 fechada

Kind autoral sem builder não compila como promessa válida.

### P19 fechada

- migrador único em `src/utils/migrator.ts`;
- npm audit completo/produção = 0 após remediação conservadora do lockfile.

### P20 fechada

Commit funcional:

`f45509ca73739d93fe32986c9cf7bcc5aaf6337a`

- local por Firebase UID;
- legado global só como ponte controlada;
- bootstrap único local/cloud;
- migração/validação antes da escolha;
- sync pendente carrega UID de origem;
- troca de identidade cancela pendência velha;
- anonymous→Google preserva UID por link;
- callback de login não instala estado;
- logout faz flush antes do sign-out.

Gate P20 run `31273869346`: focais + auditores + suíte inteira + build + publicação = success.

Documento: `DECISAO_P20_IDENTIDADE_SAVE.md`.

## 2. Canários

Fonte única:

`src/curriculum/motores/composerCanaryIds.ts`

Registradas mas não ativas que importam para a fila:

- N4.09;
- GM.12.

Promoção = um id/commit, sempre com rollback e QA.

## 3. PRÓXIMA TAREFA — P21

**Reconciliar as fontes de verdade antes de construir mais conteúdo.**

Roadmaps antigos contêm números e estados superados. Não os apagar: marcar contexto histórico e recalcular o presente pelo código.

### Entregáveis P21

1. número real de nós;
2. ficha autoral por nó;
3. active / registered / legacy / fallback;
4. catálogo de primitivas e runtime executável;
5. divergências ficha×runtime atuais;
6. canários atuais;
7. dívida confirmada versus dívida histórica já fechada;
8. atualizar/rotular `RETOMADA`, `ROTEIRO_ATE_O_FIM` e `PLANO_DO_BLOCO_F0`;
9. atualizar `MAPA_MESTRE_POS_P20.md` com números calculados.

## 4. Depois da P21

### Deliberadas

- reauditar N4.09 antes de promoção;
- reavaliar GM.12 sem momentum;
- auditar/definir JD4 e sua relação com N1.07;
- construir `Moedas`/`Regua` somente se uma ficha real exigir.

### Revalidar

- antiga dívida de coreografia: N3.10, N4.03, N4.04, N4.06, N4.07, N4.08 L3–L5;
- antigo P4 flaky;
- qualquer número de “legado/vazio/divergente” anterior a P21.

## 5. Fases sistêmicas grandes

### Auditoria dos motores adaptativos

Testar longitudinalmente Progress Engine, Minha Aula/Composer, Radar, Oficina, Jardim, FD/PD, matrícula, revisão espaçada, mastery, unlock e telemetria.

Não basta unit test. Simular crianças sintéticas: correta-lenta, rápida-chutando, misconception persistente, esquecimento, andaime-dependente, visual forte/simbólico fraco, retorno após semanas etc.

### Mega auditoria de engenharia pedagógica

Auditar:

1. currículo/grafo;
2. cada ficha/escada de níveis;
3. primitivas como linguagem pedagógica;
4. trajetória completa da criança desde zero.

Confrontar com pesquisa externa atualizada e classificar cada competência: `OK`, `micro-lacuna`, `lacuna estrutural`, `precisa observação`.

### Dojo completo

Separar e integrar Jardim/JD, fatos/FD e procedimentos/PD.

### Release hardening

Full QA técnico/visual/auth/offline/migração/acessibilidade/performance/dados infantis/documentação antes de qualquer decisão do autor sobre integração.

## 6. Portões

```bash
npm run auditar
npm run fichas:auditar
npm run fichas:conferir
npm run grafo:check
npx tsc --noEmit
npm test -- --run
npm run build
npm run pr:check
git diff --check
```

Tela afetada: sonda + prints reais.

## 7. Não fazer

- não tocar `main`;
- não tocar Creature Engine;
- não usar roadmap antigo como fila atual;
- não reabrir P17/P8/P19/P20 sem falha objetiva;
- não criar currículo paralelo;
- não criar `progress[JD*]`;
- não promover N4.09/GM.12 por conveniência;
- não implementar JD4 por semelhança nominal;
- não tratar teste verde como prova pedagógica;
- não deixar bancada temporária órfã.

**Comece pela P21.**
