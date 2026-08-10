import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("mapa autoral de fichas para o runtime", () => {
  it("mantém as 26 primitivas e os aliases comprovados pelo runtime", () => {
    const auditor = path.resolve(process.cwd(), "AI_Studio_Lab/tools/ficha_catalog_auditor.cjs");
    const output = execFileSync(process.execPath, [auditor], {
      cwd: process.cwd(),
      encoding: "utf8",
    });

    expect(output).toContain("Primitivas declaradas: 26");
    expect(output).toContain("[MAPA FICHA → RUNTIME]");

    // P21.2: nomes autorais que foram especializadas no runtime precisam
    // continuar declarando a cadeia builder → kind final → renderer.
    expect(output).toContain(
      "DragGroup: executável | kinds=draggroup+pareamento+classificacao | builder=draggroup+pareamento+classificacao | renderer=draggroup+pareamento+classificacao",
    );
    expect(output).toContain(
      "EmojiRow: executável | kinds=emojirow+fileira+moldura | builder=emojirow+fileira+moldura | renderer=emojirow+fileira+moldura",
    );
    expect(output).toContain(
      "Grupo: executável | kinds=groups+grandeza | builder=grandeza | renderer=grandeza",
    );
    expect(output).toContain(
      "StoryPanel: executável | kinds=story+scene+storypanel+story-bars | builder=storypanel | renderer=story-bars",
    );
    // W3/F21 compõe MaterialDourado + TenFrame no palco especializado. O alias
    // `material-dourado` precisa continuar visível nos DOIS componentes reais;
    // retirar daqui esconderia uma regressão do mapa, não uma mudança cosmética.
    expect(output).toContain(
      "MaterialDourado: executável | kinds=tens+material-dourado | builder=tens | renderer=tens+material-dourado",
    );
    expect(output).toContain(
      "TenFrame: executável | kinds=tenframe+moldura+bond+plain+material-dourado | builder=tenframe+moldura+bond+plain | renderer=tenframe+moldura+bond+plain+material-dourado",
    );

    // Lacunas reais permanecem visíveis: reconciliar o mapa não significa
    // fabricar builder/componente só para deixar a tabela verde.
    expect(output).toContain("LinkingCubes: renderer-sem-builder");
    expect(output).toContain("Moedas: renderer-sem-builder");
    expect(output).toContain("Quadrado100: componente-isolado");
    expect(output).toContain("SingaporeBars: renderer-sem-builder");
    expect(output).toContain("VisualAddition: renderer-sem-builder");
    expect(output).toContain("Regua: ausente");

    expect(output).toContain("- executável: 20");
    expect(output).toContain("- renderer-sem-builder: 4");
    expect(output).toContain("- componente-isolado: 1");
    expect(output).toContain("- ausente: 1");

    // A quantidade de fichas cresce quando lacunas curriculares são fechadas;
    // este teste protege o MAPA de runtime, não uma fotografia histórica do
    // catálogo. O auditor específico é a autoridade para contagem/cobertura.
    expect(output).toContain("[RESULTADO]");
    expect(output).toContain("fichas válidas, nove seções presentes");
  });
});
