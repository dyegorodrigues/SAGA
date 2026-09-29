import type { Question } from "../../types";

/**
 * Quando a alternativa precisa ser OUVIDA antes de ser escolhida.
 *
 * ## O problema
 *
 * A Jornada começa aos quatro anos e vai até o 1º ano. **A criança não lê.**
 * Diante de três botões escritos "Sobrou", "Deu certinho" e "Faltou", ela não
 * escolhe: ela chuta. E o app anota o chute como erro de matemática.
 *
 * O `audibleOptions` existia para isso, e a tela até prometia o comportamento
 * ("Toque para OUVIR · toque de novo para escolher"). Mas era um campo escrito
 * à mão em cada ficha, e as fichas de matemática nunca o marcaram — só as de
 * língua e a GM.02. O pai encontrou isso no primeiro exercício que abriu.
 *
 * ## A regra, por descoberta
 *
 * Lista escrita à mão protege o que alguém lembrou de marcar. Aqui a pergunta
 * é feita ao CONTEÚDO da alternativa: se o rótulo é palavra, precisa de voz.
 *
 * - **"Sobrou", "Faltou", "Deu certinho"** → palavra. Precisa.
 * - **"7", "12", "3 + 4", "½"** → número e símbolo. Não precisa: o numeral é
 *   justamente o que o exercício está ensinando a reconhecer, e obrigar dois
 *   toques em toda conta deixaria a missão arrastada.
 * - **"A", "B"** → uma letra só é rótulo de coordenada, não palavra.
 *
 * A ficha ainda pode pedir voz explicitamente (`audibleOptions`), e isso
 * continua valendo — a regra só acrescenta, nunca tira.
 */

/** Duas letras seguidas já são palavra; uma letra sozinha é rótulo. */
const PALAVRA = /\p{L}\p{L}/u;

export function rotuloEhPalavra(rotulo: unknown): boolean {
  return typeof rotulo === "string" && PALAVRA.test(rotulo);
}

export function opcoesPrecisamDeVoz(q: Pick<Question, "audibleOptions" | "options">): boolean {
  if (q.audibleOptions) return true;
  const opcoes = q.options;
  if (!Array.isArray(opcoes) || opcoes.length === 0) return false;
  return opcoes.some(o => rotuloEhPalavra((o as { label?: unknown } | null)?.label));
}
