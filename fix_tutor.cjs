const fs = require('fs');
let content = fs.readFileSync('src/components/KidHomeScreen.tsx', 'utf8');

// 1. Rename 'O professor preparou pra você'
content = content.replace('🎓 O professor preparou pra você', '🎓 O Sensei preparou pra você');

// 2. Rename 'Missões Diárias'
content = content.replace('Missões Diárias', 'Tarefas do Sensei');

// 3. Rename 'Sugestão do Sensei' and 'Sua missão diária de revisão espaçada!' if needed
// The user complained: "Ele só botou muito em pouco, mas é só isso que tinha que fazer. De exercícios. Essa análise que ele coloca. Porque ali está aparecendo o exercício, mas não tinha. Ele pode aparecer embaixo. Porque ele estava no próximo portal secreto, pronto para se explorar. Nada a ver isso."
// The old code used 'Sua missão diária de revisão espaçada!'. Let's change the description.
content = content.replace(/\{rec\.reason \|\| 'Sua missão diária de revisão espaçada!'\}/g, "{rec.reason || 'Sua missão de revisão!'}");

// 4. In Dojo, fix the strangs to show appropriate titles:
content = content.replace(
  /'N1': 'Senso Numérico e Contagem',\s*'N2': 'Sistema Decimal',\s*'N3': 'Adição e Subtração',\s*'N4': 'Multiplicação e Divisão',\s*'N5': 'Frações',\s*'N6': 'Decimais e Porcentagem'/g,
  `'N1': 'Alfabetização e Quantificação',\n                    'N2': 'Sistema Decimal',\n                    'N3': 'Adição e Subtração',\n                    'N4': 'Multiplicação e Divisão',\n                    'N5': 'Frações',\n                    'N6': 'Decimais e Porcentagem'`
);

// 5. Dojo: Remove Modo Dojo Livre, and rename Desafio Misto to Desafio do Sensei.
const dojoStart = content.indexOf('{/* 3. DESAFIO DO MESTRE (Misto / Livre) */}');
const dojoEnd = content.indexOf('{activeShellTab === "oficina" && (');

if (dojoStart > -1 && dojoEnd > -1) {
    const dojoBlock = content.slice(dojoStart, dojoEnd);
    let newDojoBlock = dojoBlock.replace('O Desafio do Mestre', 'O Desafio do Sensei');
    newDojoBlock = newDojoBlock.replace('Desafio Misto 👑', 'Desafio do Sensei 🦊');
    newDojoBlock = newDojoBlock.replace(/👑/g, '🦊');
    
    // Remove the Modo Dojo Livre section
    const livreStart = newDojoBlock.indexOf('{/* Dojo Matemático 🥋 */}');
    if (livreStart > -1) {
        newDojoBlock = newDojoBlock.slice(0, livreStart) + '</div>\n          </div>\n        )}\n\n        ';
    }
    
    content = content.slice(0, dojoStart) + newDojoBlock + content.slice(dojoEnd);
}

fs.writeFileSync('src/components/KidHomeScreen.tsx', content);
console.log('done fixing tutor and dojo');
