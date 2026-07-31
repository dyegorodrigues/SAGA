# Estado do trabalho Codex

> Esta pasta é um ponto de continuidade e auditoria. Ela **não contém uma segunda
> cópia do repositório**, porque duplicar o SAGA dentro dele criaria arquivos
> concorrentes e risco de editar a cópia errada.

## Estado preservado

- Branch local: `work`
- Baseline anterior: `9f8ab0f` (`docs: consolidate project documentation`)
- Commit da sincronização/auditoria: `46235e6`
- Repositório de backup pretendido: <https://github.com/dyegorodrigues/SAGA-Codex>
- Repositório do Google AI Studio: <https://github.com/dyegorodrigues/SAGA>

O remoto `origin` aponta para `SAGA-Codex`. O remoto `ai-studio` serve para buscar
o original e tem push desabilitado localmente, evitando publicação acidental.

## Bloqueio de publicação

Em 31/jul/2026, leitura e escrita HTTPS para o GitHub falharam antes da
autenticação com:

```text
CONNECT tunnel failed, response 403
```

Tornar o repositório público não remove esse bloqueio de rede. Assim que o acesso
for restabelecido, publicar com:

```bash
git push -u origin work
```

Nunca trocar `origin` pelo repositório do Google AI Studio e nunca habilitar push
em `ai-studio` sem autorização explícita do proprietário.

## Backups locais de emergência

Foram produzidos fora da árvore Git, para não inflar nem macular o aplicativo:

- `/workspace/SAGA-Codex-work.bundle` — branch e histórico Git completos;
- `/workspace/SAGA-Codex-work.zip` — snapshot dos arquivos;
- `/workspace/SAGA-Codex-work.patch` — alterações após `9f8ab0f`;
- `/workspace/SAGA-Codex-work.SHA256` — hashes de integridade.

O bundle foi validado com `git bundle verify` e registra histórico completo.

## Baseline técnico já descoberto

- grafo canônico: 95 competências;
- geradores explícitos: 42/95;
- fallbacks “Em construção”: 53/95;
- fichas de Jornada no disco/registradas: 12/11;
- fichas Dojo no disco/registradas: 4/4;
- ficha fora de `AllFichas`: `AL.01`;
- YAMLs individuais por strand: 84 nós, faltando as 11 competências da v2.7.

O comando reproduzível é `npm run auditar`. O plano de execução permanece em
`AI_Studio_Lab/pedagogia/PLANO_MESTRE_SAGA.md` e os fatos de cada sessão em
`AI_Studio_Lab/DIARIO_DE_BORDO.md`.

