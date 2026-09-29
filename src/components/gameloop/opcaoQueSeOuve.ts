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
 * - **"A", "B"** → uma letra só é rótulo de coordenada, não palavra.
 *
 * ## ⚠️ O numeral também precisa, e eu tinha decidido que não
 *
 * A versão anterior desta regra abria exceção: *"o numeral é justamente o que
 * o exercício está ensinando a reconhecer, e obrigar dois toques em toda conta
 * deixaria a missão arrastada"*. Raciocínio de quem lê. O pai devolveu a
 * medida certa, no exercício do relance, onde as alternativas são "1" e "2":
 *
 * > *"tinha que dar essa opção de ouvir também, né? Um, dois, tu apertar nos
 * > botões e ouvir o som."*
 *
 * Para uma criança de quatro anos o algarismo 2 é tão ilegível quanto a
 * palavra "dois" — é EXATAMENTE isso que essas fichas existem para ensinar.
 * Obrigá-la a escolher entre dois símbolos que ela ainda não lê transforma a
 * ficha num cara ou coroa, e o app anota o cara ou coroa como erro de
 * matemática. O custo do toque a mais é um segundo; o custo do chute é a
 * medida pedagógica inteira.
 *
 * Então a regra passa a ser: **toda alternativa é ouvível.** A ficha ainda
 * pode pedir explicitamente (`audibleOptions`), e isso continua valendo.
 */

/** Duas letras seguidas já são palavra; uma letra sozinha é rótulo. */
const PALAVRA = /\p{L}\p{L}/u;

export function rotuloEhPalavra(rotulo: unknown): boolean {
  return typeof rotulo === "string" && PALAVRA.test(rotulo);
}

export function opcoesPrecisamDeVoz(q: Pick<Question, "audibleOptions" | "options">): boolean {
  if (q.audibleOptions) return true;
  const opcoes = q.options;
  return Array.isArray(opcoes) && opcoes.length > 0;
}
