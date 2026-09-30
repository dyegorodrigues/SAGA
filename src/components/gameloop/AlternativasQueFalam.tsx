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
}: Props) {
  const [armada, setArmada] = React.useState<number | string | null>(null);

  // Alternativas novas (questão nova) desarmam. Sem isto a barra de confirmar
  // sobrevive à troca de questão apontando para um valor que não existe mais.
  const assinatura = alternativas.map(a => String(a.valor)).join("|");
  React.useEffect(() => { setArmada(null); }, [assinatura]);
  React.useEffect(() => { if (escolhida !== null) setArmada(null); }, [escolhida]);

  const daArmada = alternativas.find(a => a.valor === armada) ?? null;
  const dizer = (a: Alternativa) => falar?.(a.dito ?? a.rotulo.toLowerCase());

  return (
    <>
      <div role="group" aria-label={rotuloDoGrupo} className={className}>
        {alternativas.map(a => {
          const respondida = escolhida !== null;
          const estaEscolhida = escolhida === a.valor;
          const estaCerta = correta !== null && a.valor === correta;
          return (
            <button
              key={String(a.valor)}
              type="button"
              disabled={disabled || respondida}
              onClick={() => { setArmada(a.valor); dizer(a); }}
              aria-label={a.rotulo}
              className="flex min-h-[56px] min-w-[64px] items-center justify-center rounded-2xl border-2 px-4 text-lg font-black transition-all active:translate-y-1"
              style={{
                borderColor: tokens.cor.elementos.borda,
                color: tokens.cor.texto.principal,
                // Só a ESCOLHIDA muda de cor — ver a nota em `correta`.
                background: respondida
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
          onConfirmar={() => { const v = daArmada.valor; setArmada(null); onEscolher(v); }}
          onCancelar={() => setArmada(null)}
        />
      )}
    </>
  );
}
