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

    // Palcos compostos ficam explícitos nas linhas de TODAS as primitivas
    // canônicas que realmente carregam. O observador faz a união; não escolhe a
    // primeira e não promove helper físico (Arranjo) a vocabulário da ficha.
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
      "NumberLine: executável | kinds=numberline+counting-on-f14+tabuada | builder=numberline+tabuada+special:N3.03 | renderer=numberline+counting-on-f14+tabuada",
    );
    expect(output).toContain(
      "Quadrado100: executável | kinds=hundred-chart+frac-shade+quadrado100-f36+tabuada | builder=tabuada+special:N2.02 | renderer=quadrado100-f36+tabuada",
    );

    expect(output).toContain(
      "Regua: executável | kinds=measure+regua+regua-f61 | builder=special:GM.05 | renderer=regua+regua-f61",
    );
    expect(output).toContain(
      "VisualAddition: executável | kinds=visual-addition+visual-addition-f13+subvis | builder=special:N3.01 | renderer=visual-addition+visual-addition-f13",
    );

    // W10/F14: LinkingCubes deixa de ser renderer-sem-builder por um owner
    // especializado local; o kind legado linking-cubes continua disponível.
    expect(output).toContain(
      "LinkingCubes: executável | kinds=linking-cubes+counting-on-f14 | builder=special:N3.03 | renderer=linking-cubes+counting-on-f14",
    );

    // Lacuna real restante continua visível. SingaporeBars saiu desta classe
    // somente porque story-bars prova uma cadeia builder→renderer composta.
    expect(output).toContain("Moedas: renderer-sem-builder");

    expect(output).toContain("- executável: 25");
    expect(output).toContain("- renderer-sem-builder: 1");
    expect(output).toContain("- componente-isolado: 0");
    expect(output).toContain("- ausente: 0");

    expect(output).toContain("[RESULTADO]");
    expect(output).toContain("fichas válidas, nove seções presentes");
  });
});
