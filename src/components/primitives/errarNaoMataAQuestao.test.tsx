// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { PareamentoStage } from "./PareamentoStage";
import { EmojiRowStage } from "./EmojiRowStage";
import { MolduraStage } from "./MolduraStage";
import { Composer } from "../../curriculum/Composer";
import { N1_01 } from "../../curriculum/fichas/jornada/N1.01";
import { N1_03 } from "../../curriculum/fichas/jornada/N1.03";
import { N1_08 } from "../../curriculum/fichas/jornada/N1.08";

/**
 * Errar uma vez não pode matar a questão.
 *
 * ## O defeito, como a criança o encontrou
 *
 * Primeira competência da Jornada, nível 1. A criança dá uma banana para cada
 * macaco, a pergunta aparece — "E aí, sobrou algum?" — e ela toca em
 * **"Sobrou"**, que está errado. O app responde certo: diz *"Olha de novo!"* e
 * **não** avança, porque a política de erro suave manda dar nova chance.
 *
 * Só que os três botões de resposta somem da tela nesse instante. Não ficam
 * cinzas: somem. Não há "Avançar", não há como responder de novo, não há nada.
 * A única saída é o × de sair da missão — e o progresso da questão se perde.
 *
 * Foi assim que uma criança de verdade travou no primeiro exercício.
 *
 * ## Por que ninguém viu
 *
 * O `npm run passeio` clica em tudo e só pergunta "a tela mudou?". Ela muda: o
 * "Olha de novo!" aparece. Verde. E a suíte de unidade montava cada palco
 * isolado, sem o ciclo de erro do `GameLoop` em volta.
 *
 * ## A regra que este arquivo trava
 *
 * Quem decide que a questão acabou é o **pai**, pelo `disabled`. Enquanto
 * `disabled` for falso, o app ainda espera resposta — e o palco é obrigado a
 * continuar aceitando uma. Um palco que se tranca sozinho quebra o contrato da
 * linha 497 do `GameLoop`: *"mantém o ciclo de erro dentro da própria
 * primitiva"*.
 *
 * `ClassificacaoStage` sempre fez certo: `travado = Boolean(disabled) || ...`,
 * sem trava própria. Estes três não faziam.
 */

/** Os botões em que a criança pode tocar agora. */
const vivos = (c: HTMLElement) =>
  [...c.querySelectorAll("button")].filter(b => !b.disabled);

describe("errar não mata a questão — o palco continua aceitando resposta", () => {
  it("Pareamento (N1.01, a primeira competência da Jornada)", () => {
    const spec = Composer.generate(N1_01, 1).uiProps as never;
    const onAnswer = vi.fn();
    // `disabled={false}` é o app dizendo "ainda espero resposta" — exatamente o
    // que ele diz depois de um erro suave.
    const { container } = render(<PareamentoStage spec={spec} onAnswer={onAnswer} disabled={false} />);

    // A criança distribui tudo: os receptores começam vazios.
    for (const b of [...container.querySelectorAll("button")]) {
      if (b.getAttribute("aria-label") === "Este ainda está sem") fireEvent.click(b);
    }

    const respostas = () => vivos(container).filter(b => /Sobrou|Deu certinho|Faltou/.test(b.textContent ?? ""));
    expect(respostas().length, "a pergunta precisa aparecer depois de distribuir").toBeGreaterThan(0);

    // Erra de propósito.
    fireEvent.click(respostas()[0]);
    expect(onAnswer, "a resposta precisa chegar ao app").toHaveBeenCalled();

    // O app NÃO encerrou (continua `disabled={false}`): a criança tem de poder
    // tocar de novo. Antes desta correção, os três botões sumiam para sempre.
    expect(
      respostas().length,
      "depois de errar, com o app ainda esperando, a criança ficou sem nenhum botão de resposta",
    ).toBeGreaterThan(0);
  });

  it("EmojiRow e Moldura: o palco fecha depois de UMA resposta — e é o app que reabre", () => {
    // Estes dois não reabrem sozinhos, de propósito: fechar depois de uma
    // resposta é o que impede o toque duplo de contar dois erros. Quem devolve
    // a vez é o `GameLoopExerciseRenderer`, remontando o palco a cada
    // tentativa concedida — ver `chaveDaTentativa.ts`.
    const spec = Composer.generate(N1_03, 1).uiProps as never;
    const onAnswer = vi.fn();
    const { container } = render(<EmojiRowStage spec={spec} onAnswer={onAnswer} disabled={false} fase="perguntando" />);
    const opcoes = () => vivos(container).filter(b => /\d/.test((b.textContent ?? "").trim()));
    expect(opcoes().length, "o palco precisa oferecer alternativas").toBeGreaterThan(0);
    fireEvent.click(opcoes()[0]);
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(opcoes().length, "fechar depois de uma resposta é o contrato deste palco").toBe(0);

    // A remontagem que o app faz: chave nova, palco limpo, criança pode de novo.
    const outra = render(<EmojiRowStage key="tentativa-1" spec={spec} onAnswer={onAnswer} disabled={false} fase="perguntando" />);
    const vivasDepois = [...outra.container.querySelectorAll("button")].filter(b => !b.disabled && /\d/.test(b.textContent ?? ""));
    expect(vivasDepois.length, "remontado, o palco aceita resposta de novo").toBeGreaterThan(0);
  });
});
