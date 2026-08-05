# Como publicar as regras do Firestore (pelo tablet, sem computador)

O arquivo `firestore.rules` na raiz do repositório é a **fonte da verdade**, mas
ele não entra em vigor sozinho: o Firebase só passa a usá-lo depois que as regras
são publicadas no projeto. Enquanto isso não acontece, valem as regras antigas.

## Primeiro: isto NÃO é urgente. Nada está quebrado para a criança.

Vale a pena dizer com todas as letras, porque a descrição do defeito soa pior do
que ele é:

- **O progresso está salvo.** Estrelas, níveis, coroas, mascote e — o que mais
  importa — as hipóteses do Radar moram dentro do save do usuário, no caminho
  `userStates/{id}`, que as regras antigas **já autorizam**. Nada disso depende
  do que está bloqueado.
- **O Radar funciona.** Ele lê os erros do próprio save, não da nuvem. Missão de
  Resgate, Oficina invisível e painel dos pais continuam funcionando hoje.
- **O que está bloqueado** é só a subcoleção `Kids/{kidId}/TelemetryLogs`: o
  registro detalhado, questão a questão, para análise profunda depois. E hoje
  **nenhuma tela do app lê esse registro** — ele é gravado e mais nada.

Ou seja: publicar as regras liga uma gravação que ainda não tem leitor. É
trabalho de fundação, para quando as análises existirem. **Pode ser feito
quando for confortável para você** — no computador novo, se preferir. Enquanto
não for, o aplicativo funciona por inteiro e nenhum aprendizado se perde.

O que já está pronto do meu lado: o arquivo `firestore.rules` está corrigido e
tem teste que trava a correção, e o workflow do caminho B está escrito e
esperando. O único passo que eu não consigo dar sozinho é o de dentro do
Console do seu projeto Firebase, porque não tenho acesso a ele — não é uma
tarefa que estou te passando, é o limite de onde eu alcanço.

---

## Caminho A — Console do Firebase (funciona no navegador do tablet)

1. Abra <https://console.firebase.google.com> e entre com a mesma conta Google do
   projeto.
2. Escolha o projeto do SAGA.
3. No menu lateral, **Criação → Firestore Database**.
4. Na barra de abas do topo, toque em **Regras** (*Rules*).
5. Vai aparecer um editor com o texto das regras atuais. **Apague tudo.**
6. Cole o conteúdo do arquivo `firestore.rules` deste repositório — ele está
   reproduzido no fim deste documento para facilitar.
7. Toque em **Publicar** (*Publish*).

Pronto. A mudança vale em segundos, para todos os aparelhos, sem precisar
republicar o aplicativo.

**Como conferir que funcionou.** Depois de publicar, abra o app, responda uma
questão e volte ao Console em **Firestore Database → Dados**. Deve aparecer, sob
`userStates/{seu-id}`, uma subcoleção `Kids` com os registros de telemetria.

> Se o editor de regras reclamar de erro de sintaxe, não publique: copie a
> mensagem e traga para a conversa. Regra inválida derruba o acesso do
> aplicativo inteiro.

---

## Caminho B — automático pelo GitHub (para quando houver computador)

O workflow `.github/workflows/deploy-rules.yml` publica as regras sozinho, mas
só funciona depois que existir um segredo com credencial de serviço do Firebase.
Enquanto o segredo não existir, o workflow simplesmente avisa e não faz nada —
não quebra nada.

Para ligar, quando for o momento:

1. No Console do Firebase: **Configurações do projeto → Contas de serviço →
   Gerar nova chave privada**. Baixa um arquivo JSON.
2. No GitHub: **Settings → Secrets and variables → Actions → New repository
   secret**, com o nome `FIREBASE_SERVICE_ACCOUNT` e o conteúdo do JSON.
3. Criar também a variável `FIREBASE_PROJECT_ID` com o id do projeto.

A partir daí, toda alteração em `firestore.rules` que chegar na `main` publica
sozinha, e a fonte da verdade passa a ser de fato o repositório.

---

## Regras atuais, para copiar

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Negação padrão: tudo que não for explicitamente permitido, é bloqueado.
    match /{document=**} {
      allow read, write: if false;
    }

    // Perfis: SOMENTE o dono autenticado (Google OU anônimo) acessa o próprio documento.
    // O prefixo usr_cloud_ + uid vale para os dois tipos de login,
    // porque o Firebase Auth emite uid tanto para Google quanto para anônimo.
    function ehDono(userId) {
      return request.auth != null
             && userId == "usr_cloud_" + request.auth.uid;
    }

    match /userStates/{userId} {
      allow read, write: if ehDono(userId);

      // Uma regra de documento NÃO alcança as subcoleções dele. Sem este bloco,
      // a telemetria por criança caía na negação padrão e era rejeitada em
      // silêncio, porque o cliente engole o erro para não interromper a aula.
      // O Radar ficava sem os dados que justificam sua existência.
      match /Kids/{kidId}/TelemetryLogs/{logId} {
        // Telemetria é registro append-only de aprendizagem: cria e lê, nunca
        // reescreve nem apaga, para que o histórico diagnóstico seja confiável.
        allow read, create: if ehDono(userId);
        allow update, delete: if false;
      }
    }
  }
}
```

Se este bloco divergir de `firestore.rules`, **o arquivo manda** — ele é
verificado por teste a cada alteração, e este documento não.
