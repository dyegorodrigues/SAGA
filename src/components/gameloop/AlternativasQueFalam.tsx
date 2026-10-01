import React from "react";
import { ConfirmarEscolha } from "./ConfirmarEscolha";
import { tokens } from "../../styles/tokens";

/**
 * As alternativas que a criança OUVE antes de escolher.
 *
 * ## Por que uma peça só, e não a regra repetida em cada palco
 *
 * O app tem quinze palcos que desenham as próprias alternativas. A regra de
 * ouvir-antes-de-escolher nasceu no renderizador genérico, e por isso nenhum
 * deles a tinha: o pai abriu o PRIMEIRO exercício da Jornada e encontrou o
 * buraco de novo — *"no primeiro exercício nem confirma, o botão ali verdinho
 * para confirmar a resposta, não"*.
 *
 * Consertar palco a palco é como o buraco nasceu. Aqui a regra é UMA, e quem
 * a importa não tem como esquecer metade dela:
 *
 * 1. o primeiro toque FALA o rótulo e arma;
 * 2. a barra de confirmar aparece, com 🔊 para ouvir de novo e ↺ para trocar;
 * 3. só o ✓ responde.
 *
 * ## O que ela NÃO serve
 *
 * Palco de manipulação — estourar balão, arrastar peça, contar objeto. Ali o
 * gesto É a resposta, e pedir confirmação seria atravessar o exercício. Esta
 * peça é para ESCOLHA entre alternativas.
 */
export interface Alternativa {
  valor: number | string;
  /** O que a criança lê no botão. */
  rotulo: string;
  /** O que a voz diz. Sem isto, fala o rótulo. */
  dito?: string;
  /** Desenho no lugar do rótulo (peça, moeda, forma). */
  conteudo?: React.ReactNode;
}

interface Props {
  alternativas: Alternativa[];
  /** Chamado só pelo ✓. */
  onEscolher: (valor: number | string) => void;
  falar?: (texto: string) => void;
  disabled?: boolean;
  /** A escolha já feita: fecha a barra e pinta o resultado. */
  escolhida?: number | string | null;
  /**
   * Qual é a certa.
   *
   * ⚠️ Serve para pintar SÓ A ESCOLHIDA: verde se ela era a certa, âmbar se
   * não. A alternativa certa que a criança NÃO escolheu nunca acende.
   *
   * A regra é da `ClassificacaoStage`, e eu quase a perdi ao migrar o palco
   * para cá — a catraca documental pegou: *"Só o toque DA CRIANÇA muda de
   * cor. Pintar a alternativa certa de verde no erro entregava a resposta um
   * instante antes de o app dizer 'Olha de novo!' e devolver a vez: a segunda
   * tentativa virava cópia, não pensamento."*
   */
  correta?: number | string | null;
  /** Nome do grupo para leitor de tela. */
  rotuloDoGrupo?: string;
  className?: string;
  /** Para grade: `className` não carrega `gridTemplateColumns`. */
  style?: React.CSSProperties;
  /**
   * O palco desenha a própria alternativa, e a REGRA continua aqui.
   *
   * ## Por que isto existe
   *
   * O `FormaStage` desenha formas que giram, contam os próprios lados e se
   * fecham no acerto — a §4 da ficha pede isso, e trocar os botões dele pelos
   * botões daqui apagaria a aula. Então ele ficou de fora da regra, e o pai
   * encontrou o buraco: *"Qual é o círculo?"*, três botões escritos, um toque
   * e já era.
   *
   * A saída errada é o palco implementar a regra por conta — foi assim que a
   * regra nasceu valendo em dois lugares e faltando em treze. A saída é esta:
   * **a regra mora aqui; o desenho vem de fora.** Quem usa isto recebe o
   * estado e devolve o botão, e não tem como esquecer o confirmar: quem fala,
   * arma e confirma continua sendo esta peça.
   *
   * Recebe `onToque` (fala e arma — nunca responde) e `disabled`, e deve
   * devolver UM botão. O grupo `aria-label="Alternativas"` entra junto, o que
   * faz o palco passar a ser VISTO pelo portão de
   * `escolherExigeConfirmar.test.tsx`.
   */
  renderAlternativa?: (
    a: Alternativa,
    estado: {
      /** Tocada uma vez, esperando o ✓. */
      armada: boolean;
      /** Esta é a marcada (escolha enviada). */
      escolhida: boolean;
      /** Já houve resposta: ninguém mais responde. */
      respondida: boolean;
      /** Esta é a certa — só para pintar a ESCOLHIDA. Ver a nota em `correta`. */
      certa: boolean;
      /** Fala o rótulo e arma. Não responde. */
      onToque: () => void;
      disabled: boolean;
    },
  ) => React.ReactNode;
}

export function AlternativasQueFalam({
  alternativas,
  onEscolher,
  falar,
  disabled,
  escolhida = null,
  correta = null,
  rotuloDoGrupo = "Alternativas",
  className = "flex flex-wrap justify-center gap-2",
  style,
  renderAlternativa,
}: Props) {
  const [armada, setArmada] = React.useState<number | string | null>(null);
  /**
   * ⚠️ A última resposta enviada, para ERRAR APARECER.
   *
   * A sonda que joga encontrou isto no "Sistema monetário" e no "Horas":
   * responder errado deixava a tela **byte a byte idêntica**. A criança
   * tocava, confirmava, e não acontecia nada — nem cor, nem dica, nem sinal
   * de que o app tinha ouvido. Com a resposta certa a tela virava "Perfeito!"
   * e aparecia Avançar; com a errada, silêncio.
   *
   * Silêncio depois de agir é a pior resposta para quem não lê: ela não sabe
   * se errou, se o botão quebrou, ou se não apertou direito.
   *
   * Isto marca a escolha e **não tranca nada**. Quem tranca é o `escolhida`
   * que o palco controla (a `ClassificacaoStage` usa); aqui o app pode
   * devolver a vez, e devolver a vez sem apagar a marca é o que deixa a
   * criança comparar a tentativa nova com a anterior.
   */
  const [ultima, setUltima] = React.useState<number | string | null>(null);

  // Alternativas novas (questão nova) desarmam e limpam a marca. Sem isto a
  // barra de confirmar sobrevive à troca de questão apontando para um valor
  // que não existe mais.
  const assinatura = alternativas.map(a => String(a.valor)).join("|");
  React.useEffect(() => { setArmada(null); setUltima(null); }, [assinatura]);
  React.useEffect(() => { if (escolhida !== null) setArmada(null); }, [escolhida]);

  const daArmada = alternativas.find(a => a.valor === armada) ?? null;
  const dizer = (a: Alternativa) => falar?.(a.dito ?? a.rotulo.toLowerCase());

  return (
    <>
      <div role="group" aria-label={rotuloDoGrupo} className={className} style={style}>
        {alternativas.map(a => {
          // `escolhida` vem do palco e TRANCA; `ultima` é só a marca.
          const respondida = escolhida !== null;
          const marcada = escolhida !== null ? escolhida : ultima;
          const estaEscolhida = marcada !== null && marcada === a.valor;
          const estaCerta = correta !== null && a.valor === correta;
          const onToque = () => { setArmada(a.valor); dizer(a); };
          if (renderAlternativa) {
            return (
              <React.Fragment key={String(a.valor)}>
                {renderAlternativa(a, {
                  armada: armada === a.valor,
                  escolhida: estaEscolhida,
                  respondida,
                  certa: estaCerta,
                  onToque,
                  disabled: Boolean(disabled) || respondida,
                })}
              </React.Fragment>
            );
          }
          return (
            <button
              key={String(a.valor)}
              type="button"
              disabled={disabled || respondida}
              onClick={onToque}
              aria-label={a.rotulo}
              data-escolhida={estaEscolhida ? "true" : undefined}
              className="flex min-h-[56px] min-w-[64px] items-center justify-center rounded-2xl border-2 px-4 text-lg font-black transition-all active:translate-y-1"
              style={{
                borderColor: tokens.cor.elementos.borda,
                color: tokens.cor.texto.principal,
                // Só a ESCOLHIDA muda de cor — ver a nota em `correta`.
                background: estaEscolhida || respondida
                  ? (estaEscolhida
                    ? (estaCerta
                      ? `color-mix(in srgb, ${tokens.cor.feedback.acerto} 22%, white)`
                      : `color-mix(in srgb, ${tokens.cor.feedback.erro_suave} 22%, white)`)
                    : tokens.cor.superficie.fundo)
                  : armada === a.valor
                    ? `color-mix(in srgb, ${tokens.cor.elementos.marcador} 26%, white)`
                    : tokens.cor.superficie.fundo,
              }}
            >
              {a.conteudo ?? a.rotulo}
            </button>
          );
        })}
      </div>

      {!disabled && escolhida === null && daArmada && (
        <ConfirmarEscolha
          rotulo={daArmada.rotulo}
          onOuvirDeNovo={() => dizer(daArmada)}
          onConfirmar={() => { const v = daArmada.valor; setArmada(null); setUltima(v); onEscolher(v); }}
          onCancelar={() => setArmada(null)}
        />
      )}
    </>
  );
}
