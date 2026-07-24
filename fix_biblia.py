import re

content = open("AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md").read()

lines = content.split('\n')
changelog_start = 0
for i, line in enumerate(lines):
    if line.startswith('*Changelog: v1.0'):
        changelog_start = i
        break

changelog_lines = lines[changelog_start:]

# The user wants v2.6 at the top of the v2.x section, wait, they said "No arquivo original o changelog é DECRESCENTE (v2.6 no topo)."
# Let's extract the exact lines from the user prompt. Wait, the user said "O número acima acompanha SEMPRE a última entrada do changelog no fim do arquivo" in the header... Wait, the user said:
# "Você reordenou o changelog para a v2.6 ficar por último. No arquivo original o changelog é DECRESCENTE (v2.6 no topo)."
# In the original prompt, the changelog was:
# *Changelog: v1.0 ...
# *v1.1 ...
# *v1.2 ...
# *v1.3 ...
# *v2.6 ...
# *v2.5 ...
# *v2.4 ...
# *v2.3 ...
# *v2.2 ...
# *v2.1 ...
# *v2.0 ...
# *v1.9 ...
# *v1.8 ...
# *v1.7 ...
# *v1.6 ...
# *v1.5 ...
# *v1.4 ...

# Let's just hardcode the exact changelog tail that the user provided.
changelog = """*Changelog: v1.0 (jul/2026) — unificação total pós-auditoria; renomeação Matemágica → SAGA; escopo 4-12; grafo de 84 competências (inclui N4.12, divisor de 2 dígitos, e divisão de decimais em N6.02 — fecha o algoritmo de divisão por completo).*
*v1.1 (jul/2026) — §11 expandido: Bússola de Posicionamento (11.3), Radar de Lacunas com tags de misconception e Missões de Resgate (11.4), regra Idade Nunca Trava (11.5), representação na tela (11.6); Dojo promovido a documento próprio (`DOJO_SAGA.md`); Manual Didático v2 completo integrado ao cânone.*
*v1.2 (jul/2026) — modelo de erro reformulado para DUAS CAMADAS (§8): resposta imediata leve na questão (preserva o fluxo, nunca trava) + remediação profunda disparada por PADRÃO via Radar (§11.4), entregue em pausa/fim de sessão/resgate. Princípio 5 refinado ("o fluxo é sagrado"). Correção da rigidez do escalonamento E1→E2→E3 por questão.*
*v1.3 (jul/2026) — regra do FADING (§5): o andaime some conforme a proficiência sobe (aula é exceção, não enfeite). §6: aula é feita de prática, não palestra; distinção entender-a-matéria vs entender-o-exercício com gatilhos separados. §11.2.4: Dojo como pilar autônomo com DUAS famílias de fluência (FD fatos + PD procedimentos armados).*
*v2.6 (jul/2026) — §14.5: controle de versão é infraestrutura crítica (git quebrado = parar tudo; commit por mudança; NADA é apagado fisicamente — `arquivo_morto` é túmulo, não incinerador). §14.6: regra de PARIDADE — migração nunca reduz o que a criança alcança; conta-se antes e depois, e o caminho antigo só se desliga com paridade atingida. §14.7: comportamento consertado vira especificação escrita + teste no mesmo commit, senão regride repetidamente. §10.12: especificação fechada do enquadramento do mascote (telinha retangular arredondada, cenário preenchendo o fundo, mascote inteiro e solto por cima, parado em repouso).*
*v2.5 (jul/2026) — cabeçalho corrigido para acompanhar o changelog (divergência entre topo e rodapé causou confusão real de versão). §14.4: contagem de teste não é evidência — o relatório exibe QUAIS suítes rodaram; runner exclui `arquivo_morto/`/`backup*/` (metade das suítes vinha de backup, inflando a contagem); as suítes do cânone (unlockEngine, composer, contrato, coreografia, invariantes) são nominalmente obrigatórias na lista. §12.8 item 3-quater: simulador exige LINHA DE BASE de plausibilidade — incoerência interna (perfil com lacuna mais rápido que sem lacuna) e deriva entre versões (18→55→73→367) indicam simulador ou ritmo quebrado, e exigem investigação antes de qualquer decisão.*
*v2.4 (jul/2026) — §14.4: toda ferramenta de auditoria/simulação tem comando no `package.json` que o DONO roda sozinho e vê a mesma saída — antídoto estrutural contra relatório inventado (terceira ocorrência); todo relatório abre com o comando que o produziu. §14.2: proibido ajustar a ASSERÇÃO para bater com a saída do código (teste vira espelho e a regra evapora) — quando teste e código discordam, decide-se pelo cânone. §10.12: o catálogo passa a detectar também deriva de nomenclatura (gerador servindo nó sob nome herdado); nome da função espelha o ID do nó.*
*v2.3 (jul/2026) — §8.1: `explain` NUNCA pode descrever uma misconception documentada do próprio nó (regra testável contra o Grafo; contraexemplo N1.05, que mandava comparar por espaço ocupado — a própria falha de conservação). §3.1: as três funções viram a NAVEGAÇÃO (barra de abas Jornada/Dojo/Oficina/Perfil) e ficam mapeados os nomes antigos (Jornada Mágica = Academia; Desafio Misto = Dojo modo Mestre). §7: demonstração é sobreposição com exemplo GÊMEO (outros números), com a contagem passo a passo virando dica e não aula repetida. §10.11: contrato de redesenho (só tokens + apresentação + assets; proibido clonar a árvore de telas). §10.12: mascote vive em palco de 3 camadas (fundo/ator/frente), fim da "bolinha"; catálogo passa a detectar duplicatas, órfãos e buracos.*
*v2.2 (jul/2026) — §8.4: a OFICINA GANHA FÍSICA PRÓPRIA (escada de 2 acertos por ser reaprendizagem; alvo é destravar e não coroar; dose proporcional à lacuna; teto de 3 resgates com escalada para o pré-requisito do pré-requisito) — descoberto pela simulação, que expôs 11 resgates para uma única lacuna. §8.1: `explain` nomeia a ESTRATÉGIA do Manual, nunca repete o enunciado nem contraria a natureza da habilidade (contraexemplo N1.03). §12.8 item 3-ter: simulação é estocástica — exige semente, versão e mediana/faixa sobre ≥30 execuções. §7.4 item 4-ter: sincronia com TTS só é real com um enunciado curto por batida visual ou áudio pré-gravado com marcas.*
*v2.1 (jul/2026) — §12.10: FRONTEIRA DA IA EM TEMPO DE EXECUÇÃO. Com IA conectada em runtime (dica do mascote e relatório dos pais), fica explícito: a aula é 100% offline e determinística, a fala autoral é o caminho primário e suficiente; a IA nunca substitui dica, decide progressão, gera exercício ou é pré-requisito para a aula rodar; pode ser extra pedido pela criança e relatório assíncrono aos pais; guarda-corpos obrigatórios (nunca dá resposta, validação, fallback autoral, chave de desligar, sem dado pessoal no prompt, teto de uso).*
*v2.0 (jul/2026) — §8.1: `explain` definido como DICA DE ERRO (nunca elogio, nunca entrega a resposta) com exemplo errado/certo — corrige vício encontrado nos três Padrões-Ouro. §7.4 item 4-bis: coreografia exige ao menos um passo com `show` não-vazio (fecha o falso verde da narração sem visual). §12.8 item 3-bis: simulação estreita não valida pedagogia — só vale como evidência se exercitar a orquestração inteira (Composer + Radar + Oficina + sonda de pré-req + avanço paralelo). §14.3: ferramenta nunca adultera arquivo de produção.*
*v1.9 (jul/2026) — §14.1 REGRA DA EVIDÊNCIA (nenhum resultado aceito sem prova bruta; protótipo se declara antes, nunca depois; números específicos exigem execução real) e §14.2 (corrigir para estar certo, nunca para passar no teste; correção em lote sobre decisão pedagógica passa por revisão humana contra o Manual). §12.3 refinado: competências perceptuais declaram `excecaoCPA` em vez de forjar variação, e alerta contra a variação de fachada que passa no teste e quebra a escada CPA.*
*v1.8 (jul/2026) — §12.8: DESCOBERTA EM LOTE — Definição de Pronto por competência, snapshots dourados anti-regressão, APRENDIZ SIMULADO (roda crianças falsas por dezenas de sessões e acha travamentos/ritmo/disparos do Radar em lote) e invariantes do sistema; mais a regra contra o falso verde (teste tem de verificar presença, não só validade).*
*v1.7 (jul/2026) — §7.4: CONTRATO DE COREOGRAFIA (a explicação é dado, não fiação): timeline declarado, API visual publicada por primitiva, player único, teste que quebra o build se a primitiva perder um comando (causa raiz do sumiço do destaque da Caixa Mágica) e modo coreografia na galeria. §10.12: tokens de movimento (só transform/opacity, 60fps no tablet real, animação decorativa vs pedagógica), mascotes com registro único e vocabulário de expressões, e catálogo de exercícios gerado automaticamente para o painel Admin.*
*v1.6 (jul/2026) — §10.11: arquitetura da CAMADA VISUAL — 5 camadas separadas (tokens semânticos → chrome → primitivas → skins → geradores), vocabulário único de estados visuais, lista do que macula o sistema, e a ordem de execução (passagem de tokens ANTES de massificar). Permite trocar toda a arte (ex.: pixel-art) mexendo num dicionário só.*
*v1.5 (jul/2026) — §12 expandido para a produção em massa: nível dita a REPRESENTAÇÃO CPA e não só a magnitude (12.3); kinds de SELEÇÃO vs PRODUÇÃO com contratos de correção distintos e `misconceptionFrom` para produção (12.4); tema/skin cosmético, por sessão e com vocabulário próprio (12.5); mapa mecânica→primitiva com as 4 primitivas faltantes (12.6); suíte de testes de contrato obrigatória antes de massificar (12.7).*
*v1.4 (jul/2026) — TRÊS FUNÇÕES (§3.1): Academia (aprender) / Dojo (treinar) / Oficina (recuperar), com o Motor Adaptativo acima das três. Oficina HÍBRIDA (§8.4): invisível para tropeço pequeno, Missão de Resgate visível para lacuna teimosa, sempre visível aos pais. §5: as DUAS escadas (competências × proficiência) — resposta a "quantos níveis tem uma conta". §6: Plano do Dia (pai não opera) + limite saudável que não engaiola quem quer mais. §11.8: simulação da jornada (Téo 4 / Rocha 6) no curto/médio/longo prazo. §11.9: estado de domínio multidimensional (compreensão/fluência/retenção/independência).*"""

lines_without_changelog = lines[:changelog_start]
# Remove any empty lines at the end before appending
while lines_without_changelog and lines_without_changelog[-1].strip() == '':
    lines_without_changelog.pop()

new_content = '\n'.join(lines_without_changelog) + '\n\n' + changelog + '\n'

with open("AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md", "w") as f:
    f.write(new_content)
