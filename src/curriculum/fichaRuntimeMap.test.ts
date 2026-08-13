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
      "EmojiRow: executável | kinds=emojirow+fileira+moldura+emojirow-riscar-f15+regra-sequencia-f57 | builder=emojirow+fileira+moldura+special:N3.02+special:AL.04 | renderer=emojirow+fileira+moldura+emojirow-riscar-f15+regra-sequencia-f57",
    );
    expect(output).toContain(
      "Grupo: executável | kinds=groups+grandeza+comparacao-simbolica+equal-groups-f97 | builder=grandeza+special:N2.03+special:N4.01 | renderer=grandeza+comparacao-simbolica+equal-groups-f97",
    );

    expect(output).toContain(
      "ArrayGrid: executável | kinds=array+area+area-model+tabuada+decomposicao+ancora | builder=arraygrid+area+tabuada+decomposicao+ancora | renderer=array+area+tabuada+decomposicao+ancora",
    );
    expect(output).toContain(
      "StoryPanel: executável | kinds=story+scene+storypanel+story-bars | builder=storypanel | renderer=story-bars",
    );
    expect(output).toContain(
      "SingaporeBars: executável | kinds=singapore-bars+ratio-table+story-bars | builder=storypanel | renderer=singapore-bars+story-bars",
    );
    expect(output).toContain(
      "MaterialDourado: executável | kinds=tens+material-dourado+vertical+deslocamento | builder=tens+vertical+deslocamento | renderer=tens+material-dourado+vertical+deslocamento",
    );
    expect(output).toContain(
      "TenFrame: executável | kinds=tenframe+moldura+bond+plain+material-dourado | builder=tenframe+moldura+bond+plain | renderer=tenframe+moldura+bond+plain+material-dourado",
    );
    expect(output).toContain(
      "NumberLine: executável | kinds=numberline+counting-on-f14+tabuada+regra-sequencia-f57 | builder=numberline+tabuada+special:N3.03+special:AL.04 | renderer=numberline+counting-on-f14+tabuada+regra-sequencia-f57",
    );
    expect(output).toContain(
      "InteractiveNumberLine: executável | kinds=numberline+numberline-f19+skip-count-f30 | builder=numberline+special:AL.03 | renderer=numberline+numberline-f19+skip-count-f30",
    );
    expect(output).toContain(
      "Quadrado100: executável | kinds=hundred-chart+frac-shade+quadrado100-f36+tabuada+skip-count-f30 | builder=tabuada+special:N2.02+special:AL.03 | renderer=quadrado100-f36+tabuada+skip-count-f30",
    );
    expect(output).toContain(
      "Regua: executável | kinds=measure+regua+regua-f61 | builder=special:GM.05 | renderer=regua+regua-f61",
    );
    expect(output).toContain(
      "VisualAddition: executável | kinds=visual-addition+visual-addition-f13+subvis | builder=special:N3.01 | renderer=visual-addition+visual-addition-f13",
    );
    expect(output).toContain(
      "LinkingCubes: executável | kinds=linking-cubes+counting-on-f14 | builder=special:N3.03 | renderer=linking-cubes+counting-on-f14",
    );

    expect(output).toContain("Moedas: renderer-sem-builder");
    expect(output).toContain("- executável: 25");
    expect(output).toContain("- renderer-sem-builder: 1");
    expect(output).toContain("- componente-isolado: 0");
    expect(output).toContain("- ausente: 0");
    expect(output).toContain("[RESULTADO]");
    expect(output).toContain("fichas válidas, nove seções presentes");
  });
});
