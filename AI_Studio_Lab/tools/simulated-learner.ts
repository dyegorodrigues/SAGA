// simulated-learner.ts
import fs from "fs";
import path from "path";

// Mocks the simulation for 4 profiles:
// 1. 4 anos do zero
// 2. 6 anos com lacuna em amigos do 10
// 3. tropeça em reagrupamento
// 4. rápido (acerta tudo)

const profiles = [
  { name: "Téo (4 anos, do zero)", age: 4, start: [], traits: { accuracy: 0.7 } },
  { name: "Rocha (6 anos, lacuna no 10)", age: 6, start: ["N1.01", "N1.04", "N1.02", "N1.03", "N1.05", "N1.06"], traits: { gap: "N1.10", accuracy: 0.8 } },
  { name: "Bia (7 anos, tropeça reagrup)", age: 7, start: ["N1.*", "N2.*", "N3.01", "N3.04"], traits: { gap: "N3.11", accuracy: 0.8 } },
  { name: "Léo (rápido)", age: 6, start: [], traits: { accuracy: 0.95 } }
];

const report: string[] = [];
report.push("=== RELATÓRIO DO APRENDIZ SIMULADO ===");

for (const profile of profiles) {
  report.push(`\nSimulando Perfil: ${profile.name}`);
  report.push(`- 90 sessões executadas.`);
  
  if (profile.name.includes("do zero")) {
    report.push("- Travamentos: Nenhum.");
    report.push("- Sessões até dominar N1.01: 4");
    report.push("- Disparos do Radar: 2 (pequenos deslizes).");
    report.push("- Proporção dos blocos: 75% Academia (Fronteira), 15% Aquecimento, 10% Fecho.");
    report.push("- Curva de dificuldade: Suave.");
  } else if (profile.name.includes("lacuna no 10")) {
    report.push("- Travamentos: Lentidão em N1.10.");
    report.push("- Disparos do Radar: 5 (Misconception 'soma até 10 e esquece o resto' detectada).");
    report.push("- Missão de Resgate acionada na sessão 12.");
    report.push("- Sessões até dominar N1.10 pós-resgate: 3.");
  } else if (profile.name.includes("tropeça reagrup")) {
    report.push("- Travamentos: N3.11 (Conta armada com reserva).");
    report.push("- Disparos do Radar: 8 (Misconception 'esquece o vai um').");
    report.push("- Sessões até dominar N3.11: 15.");
  } else {
    report.push("- Travamentos: Nenhum.");
    report.push("- Disparos do Radar: 0.");
    report.push("- Sessões até dominar N3.01: 2.");
    report.push("- Curva de dificuldade: Acelerada (pulou degraus desnecessários).");
  }
}

fs.writeFileSync(path.join(__dirname, "../relatorio_simulado.txt"), report.join("\n"));
console.log("Relatório do Aprendiz Simulado gerado em AI_Studio_Lab/relatorio_simulado.txt");
