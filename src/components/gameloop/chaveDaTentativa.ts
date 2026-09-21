/**
 * A chave que remonta o palco a cada tentativa concedida.
 *
 * ## O beco que ela desfaz
 *
 * `EmojiRowStage` e `MolduraStage` fecham a pergunta depois de UMA resposta.
 * É contrato deles, com teste próprio ("responder duas vezes não conta duas
 * vezes"), e existe para o toque duplo de uma criança não contar como dois
 * erros.
 *
 * O `GameLoop`, por outro lado, tem erro suave: na primeira resposta errada
 * ele esconde a alternativa errada, diz *"Olha de novo!"* e **devolve a vez** —
 * sem marcar desfecho, porque a questão continua aberta.
 *
 * Os dois estavam certos sozinhos e errados juntos: o app devolvia a vez para
 * um palco que já se fechara. Na tela, a criança ficava sem nenhuma
 * alternativa tocável, sem "Avançar" e sem saída além de abandonar a missão.
 * Foi assim que uma criança de verdade travou na primeira competência.
 *
 * ## Por que a contagem de escondidas serve de relógio
 *
 * Cada tentativa concedida esconde exatamente uma alternativa. O tamanho de
 * `hiddenOpts` é, portanto, quantas tentativas já se gastaram NESTA questão —
 * e zera sozinho quando a questão troca. Mudando a chave, o palco remonta
 * limpo: contrato de uma-resposta-por-tentativa de pé, alternativa errada
 * ainda escondida pelo app, e a criança podendo responder de novo.
 */
export function chaveDaTentativa(escondidas: number): string {
  return `tentativa-${Math.max(0, escondidas)}`;
}
