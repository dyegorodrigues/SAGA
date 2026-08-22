import { Evidencia } from "../../constants/evidencias";
import { DetetiveFormasMisconception, type DetetiveFormasEixo } from "./detetiveFormasContract";

/**
 * O que a criança fez na dobra — o suficiente para decidir evidência e
 * equívoco, e nada além disso.
 */
export interface AcaoDetetiveFormas {
  nivel: number;
  eixoEscolhido: DetetiveFormasEixo;
  eixoCorreto?: DetetiveFormasEixo;
}

export function acertouDetetiveFormas(acao: AcaoDetetiveFormas): boolean {
  return acao.eixoCorreto !== undefined && acao.eixoEscolhido === acao.eixoCorreto;
}

/**
 * A decisão de emitir mora aqui, e não dentro do palco.
 *
 * Enquanto a condição era montada em linha no componente, ela só podia ser
 * conferida abrindo um navegador — e o portão da §9, que compara o que a ficha
 * exige com o que alguém emite, não tinha como alcançá-la. Função pura é o que
 * torna a evidência verificável sem tela.
 */
export function evidenciasDetetiveFormas(acao: AcaoDetetiveFormas): string[] {
  return acao.nivel === 4 && acertouDetetiveFormas(acao) ? [Evidencia.SIMETRIA_EIXO] : [];
}

/**
 * Errar o eixo tem duas leituras diferentes, e elas pedem explicações
 * diferentes: escolher a vertical quando ela não era a certa é a generalização
 * de que todo eixo é vertical; qualquer outro erro é só eixo errado.
 */
export function diagnosticarDetetiveFormas(acao: AcaoDetetiveFormas): string | undefined {
  if (acao.eixoCorreto === undefined || acertouDetetiveFormas(acao)) return undefined;
  return acao.eixoEscolhido === "vertical"
    ? DetetiveFormasMisconception.SO_EIXO_VERTICAL
    : DetetiveFormasMisconception.EIXO_ERRADO;
}
