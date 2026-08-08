# Briefing operacional — continue daqui

> **VIGENTE em 8/ago/2026 após P17 + P8 Jardim.**
>
> Leia primeiro [`HANDOFF_CONTINUIDADE_IA.md`](./HANDOFF_CONTINUIDADE_IA.md). Este briefing é a versão executiva: estado, próxima fila e definição de pronto.

## 0. Estado que não deve ser redescoberto

- Repo: `dyegorodrigues/SAGA`.
- Trabalho: **`codex/integrar-bloco-f0`**.
- `main`: `68fad4c575e28959b2ca4776e9a541d6828b63f3` — **não tocar**.
- PR #29: draft, base `main`, somente comparação/CI, nunca auto-merge.
- Creature Engine: fora deste fluxo.
- Remoto: main + cumulativa + duas branches do Creature Engine.

## 1. P17 está fechada

Documento: `DECISAO_P17_N110.md`.

- `N1.10`: JD5 → retirada real de moldura → NumberBond; `SEM_MOLDURA` é gate antes de L5.
- `N1.11`: JD3 → F28 NumberBond → `n + □ = 10`.
- N1.10/N1.11 estão ativos e revalidados em CI normal separada.
- representações diferentes da mesma competência não viram nós paralelos.
- `MasteryRule` agora executa `acertos/de/sessoes` da ficha.

## 2. P8 está fechada

Documento: `DECISAO_P8_JARDIM.md`.

O Garden antigo era uma lista CRA de trilhas da Jornada. Agora consome o catálogo canônico:

- JD1 → N1.03;
- JD2 → N1.08;
- JD3 → N1.11;
- JD5 → N1.10.

### Regras permanentes

- JD não entra no DAG;
- unlock deriva da mãe no nível 3/domínio;
- estado fica em `state.dojoTracks`, nunca `state.progress[JD*]`;
- GameLoop em modo Garden não chama `applyJourneyAnswer`;
- round atual = 8 itens (contrato aceita 6–10);
- dois rounds ≥80% precisão **e** ≥80% fluência → avança;
- dois rounds <60% → recua treino sem retirar conquista;
- acerto lento não é erro conceitual;
- primeira resposta cognitiva mede automaticidade;
- erros reais alimentam Radar da mãe;
- sem seletor manual de nível no Garden.

### QA

- teste permanente de DojoTab cobre unlock, stats, currentStep/highestStep e ausência do Garden CRA;
- sonda permanente: bloqueado / parcial / avançado;
- primeiro QA falhou contraste e o componente foi corrigido;
- depois passou 320/390/900;
- PNGs 320 inspecionados manualmente;
- UI funcional validada, arte premium final continua dívida separada.

Commits-chave:

- motor puro: `5b22e6d4594db68c3f86414dccd18c40faf49619`;
- cânone Dojo v1.5: `3ec25a4007c0e79b89bafcb7887bf270000ca545`;
- QA visual: `21ab21e6c4d7465f66a37136dc15b68970c1f795`;
- remoção do caminho CRA morto: `37a03a8bbf9d33221b8a3c75c7f8b847fdffbf97`.

JD4 continua fora e não deve ser inventada nesta linha.

## 3. Canários F0 ativos/revalidados

- `AL.01`
- `N1.06`
- `N1.13`
- `GE.01`
- `GE.02`
- `GM.01`
- `N1.10`
- `N1.11`

Lista única: `src/curriculum/motores/composerCanaryIds.ts`.

Promoção futura = **um id por commit**.

## 4. GM.12 continua desligada

F50/GM.12 está implementada e visualmente revisada, mas permanece em observação e fora dos canários.

**Não promover por momentum.**

## 5. Próxima frente — integridade de estado/migração/dependências

### 5.1 Migração/estado

Suspeita a provar:

- `App.tsx` tem função local `migrate`;
- `src/utils/migrator.ts` existe como outro migrador;
- busca inicial não encontrou consumidor ativo do utilitário.

Auditar antes de editar:

1. todos os imports/consumidores;
2. diferenças entre os dois migradores;
3. compatibilidade de `dojoTracks` com saves antigos;
4. add/delete/reset de criança;
5. testes de migração existentes;
6. se a duplicação pode divergir silenciosamente.

Não apagar por aparência de código morto.

### 5.2 Dependências

`npm ci` vem reportando vulnerabilidades. Rodar `npm audit`, identificar pacote/cadeia/impacto/versão corrigida e só então decidir.

**Nunca `npm audit fix` cegamente.**

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

Tela afetada também exige sonda/prints.

## 7. Regras não negociáveis

- não tocar na `main`;
- não tocar Creature Engine;
- não reabrir P17/P8 sem falha objetiva;
- não criar currículo paralelo;
- não criar `progress[JD*]`;
- não transformar lentidão em misconception;
- não reintroduzir Garden CRA;
- não promover GM.12 no embalo;
- não apagar migrador sem provar consumidores;
- não atualizar dependência automaticamente sem análise;
- não tratar sonda como arte final;
- não deixar workflow temporário órfão.

## 8. Definição de pronto

- [ ] commit na cumulativa;
- [ ] `main` imóvel;
- [ ] nenhuma branch extra;
- [ ] nenhum workflow/script temporário órfão;
- [ ] auditorias/TS/testes/build verdes;
- [ ] sonda/prints quando há tela;
- [ ] handoff/PR atualizados quando o estado muda;
- [ ] PR #29 draft/não mesclada;
- [ ] nova conversa retoma sem reler o chat.

**Existir não é estar certo. Divergência pode ser corrigida; divergência silenciosa não.**
