# Estado do trabalho Codex

> Esta pasta é um ponto de continuidade e auditoria. Ela **não contém uma segunda
> cópia do repositório**, porque duplicar o SAGA dentro dele criaria arquivos
> concorrentes e risco de editar a cópia errada.

## Estado preservado

- Branch local: `work`
- Baseline curricular/DAG: `24317be`
- Marco atual: contrato efetivo do Composer registrado no Diário de Bordo.
- Repositório de backup pretendido: <https://github.com/dyegorodrigues/SAGA-Codex>
- Repositório do Google AI Studio: <https://github.com/dyegorodrigues/SAGA>

No estado atual deste ambiente não há remoto Git configurado. Portanto, nenhum push
é feito automaticamente e o repositório do Google AI Studio não pode ser alterado
por acidente a partir desta cópia.

## Bloqueio de publicação

Em 31/jul/2026, leitura e escrita HTTPS para o GitHub falharam antes da
autenticação com:

```text
CONNECT tunnel failed, response 403
```

Tornar o repositório público não remove esse bloqueio de rede. Quando houver rede e
autorização, configurar exclusivamente o repositório de backup e publicar com:

```bash
git remote add origin https://github.com/dyegorodrigues/SAGA-Codex.git
git push -u origin work
```

Nunca configurar o repositório do Google AI Studio como destino de push sem
autorização explícita do proprietário.

## Persistência local

O trabalho está preservado no histórico Git local da branch `work`. Não há ZIP,
patch, bundle ou cópia do repositório dentro dele; isso evita backups concorrentes,
arquivos obsoletos e consumo desnecessário de espaço/contexto.

A cópia externa no GitHub só estará garantida depois de um `git push` confirmado;
commit local e PR preparado não equivalem a publicação remota.

## Baseline técnico vigente

- grafo canônico: 88 competências e 13 trilhas de fluência;
- geradores explícitos: 42/88;
- fallbacks “Em construção”: 46/88;
- fichas autorais recebidas: 92, cobrindo 88/88 competências;
- fichas TypeScript de Jornada no disco/registradas: 12/12;
- fichas Dojo no disco/registradas: 4/4;
- fichas fora de `AllFichas`: nenhuma;
- YAMLs individuais por strand: 88 nós, sincronizados por ID e pré-requisitos com
  o grafo agregado; JSON/TypeScript são artefatos gerados e verificáveis.

Os comandos reproduzíveis são `npm run auditar` e `npm run fichas:auditar`. O plano de execução permanece em
`AI_Studio_Lab/pedagogia/PLANO_MESTRE_SAGA.md` e os fatos de cada sessão em
`AI_Studio_Lab/DIARIO_DE_BORDO.md`.

## Dependência de conteúdo em elaboração

As fichas cinematográficas detalhadas estão sendo produzidas separadamente pelo
proprietário. O Codex pode criar ou completar fichas provisórias quando isso for
necessário para fazer o produto funcionar, sempre fundamentado em Bíblia, Grafo,
Manual e SPEC e com a origem registrada no commit/Diário.

Quando o arquivo do proprietário chegar, ele entra primeiro como material de
comparação, nunca como substituição cega. A fusão avalia lado a lado objetivo,
escada CRA, parâmetros, misconceptions, roteiro/coreografia, acessibilidade e
testes; aproveita o melhor de cada versão e publica apenas uma ficha runtime
canônica. O original recebido fica preservado em staging para rastreabilidade.

## Dossiê consolidado das conversas

O relatório, os diagnósticos, as decisões e o plano produzidos nas conversas com
o Codex estão preservados em:

- `AI_Studio_Lab/codex/DOSSIE_AUDITORIA_E_PLANO.md`

O dossiê é a melhor porta de entrada para retomar o trabalho sem depender do
histórico do chat. Ele não substitui as fontes pedagógicas canônicas.

## Auditoria completa, problema por problema

Para consultar a auditoria detalhada — fatos observados, impactos, riscos,
recomendações, lacunas pedagógicas/técnicas e matriz de prioridade — abra:

- **[`AUDITORIA_PROFUNDA_COMPLETA.md`](./AUDITORIA_PROFUNDA_COMPLETA.md)**

Use este arquivo quando precisar do detalhe que não cabe no resumo do dossiê.
