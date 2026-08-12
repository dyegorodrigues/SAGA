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

    expect(output).toContain(
      "DragGroup: executável | kinds=draggroup+pareamento+classificacao | builder=draggroup+pareamento+classificacao | renderer=draggroup+pareamento+classificacao",
    );
    expect(output).toContain(
      "EmojiRow: executável | kinds=emojirow+fileira+moldura+emojirow-riscar-f15 | builder=emojirow+fileira+moldura+special:N3.02 | renderer=emojirow+fileira+moldura+emojirow-riscar-f15",
    );
    expect(output).toContain(
      "Grupo: executável | kinds=groups+grandeza+comparacao-simbolica | builder=grandeza+special:N2.03 | renderer=grandeza+comparacao-simbolica",
    );
    expect(output).toContain(
      "StoryPanel: executável | kinds=story+scene+storypanel+story-bars | builder=storypanel | renderer=story-bars",
    );
    expect(output).toContain(
      "MaterialDourado: executável | kinds=tens+material-dourado | builder=tens | renderer=tens+material-dourado",
    );
    expect(output).toContain(
      "TenFrame: executável | kinds=tenframe+moldura+bond+plain+material-dourado | builder=tenframe+moldura+bond+plain | renderer=tenframe+moldura+bond+plain+material-dourado",
    );
    expect(output).toContain(
      "Regua: executável | kinds=measure+regua+regua-f61 | builder=special:GM.05 | renderer=regua+regua-f61",
    );
    expect(output).toContain(
      "Quadrado100: executável | kinds=hundred-chart+frac-shade+quadrado100-f36 | builder=special:N2.02 | renderer=quadrado100-f36",
    );
    expect(output).toContain(
      "VisualAddition: executável | kinds=visual-addition+visual-addition-f13+subvis | builder=special:N3.01 | renderer=visual-addition+visual-addition-f13",
    );

    // W10/F14: LinkingCubes deixa de ser renderer-sem-builder por um owner
    // especializado local; o kind legado linking-cubes continua disponível.
    expect(output).toContain(
      "LinkingCubes: executável | kinds=linking-cubes+counting-on-f14 | builder=special:N3.03 | renderer=linking-cubes+counting-on-f14",
    );

    // Lacunas reais restantes continuam visíveis; W10 não inventa owner para elas.
    expect(output).toContain("Moedas: renderer-sem-builder");
    expect(output).toContain("SingaporeBars: renderer-sem-builder");

    expect(output).toContain("- executável: 24");
    expect(output).toContain("- renderer-sem-builder: 2");
    expect(output).toContain("- componente-isolado: 0");
    expect(output).toContain("- ausente: 0");

    expect(output).toContain("[RESULTADO]");
    expect(output).toContain("fichas válidas, nove seções presentes");
  });
});
