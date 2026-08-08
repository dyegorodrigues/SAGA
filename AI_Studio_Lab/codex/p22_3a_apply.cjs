const fs = require("node:fs");
const cp = require("node:child_process");

const mode = process.argv[2];
const branch = "codex/integrar-bloco-f0";
const stableCiCommit = "97efafeab6b4bd5ee4b34e3a268d860378e42f71";
const self = "AI_Studio_Lab/codex/p22_3a_apply.cjs";

function once(text, before, after, label) {
  if (!text.includes(before)) {
    throw new Error(`P22.3A: âncora ausente — ${label}`);
  }
  return text.replace(before, after);
}

function run(command) {
  console.log(`[P22.3A] $ ${command}`);
  cp.execSync(command, { stdio: "inherit" });
}

function apply() {
  const composerPath = "src/curriculum/Composer.ts";
  let composer = fs.readFileSync(composerPath, "utf8");

  composer = once(
    composer,
`      case "numberline": {
        const start = params.start || 0;
        const end = params.end || 10;
        const jump = params.jump_size || 1;
        const current = randomInt(start, end - jump);
        const next = current + jump;
        
        uiProps = {
          start,
          end,
          interactive: true,
          startPos: current, showJumps: [{from: current, to: next}]
        };
        evaluate = (ans) => ans === next;
        answer = next;
        big = String(current);
        options = numericOptions(answer, start, end);
        break;
      }
`,
`      case "numberline": {
        const start = params.start ?? 0;
        const end = params.end ?? 10;
        const jump = params.jump_size ?? 1;
        if (!Number.isInteger(start) || !Number.isInteger(end) || !Number.isInteger(jump) || jump === 0 || start >= end) {
          throw new Error(\`Intervalo/salto inválido na reta de \${ficha.id}/\${micro.id}.\`);
        }
        const currentMin = jump > 0 ? start : start - jump;
        const currentMax = jump > 0 ? end - jump : end;
        if (currentMin > currentMax) {
          throw new Error(\`Salto \${jump} não cabe na reta \${start}..\${end} de \${ficha.id}/\${micro.id}.\`);
        }
        const current = randomInt(currentMin, currentMax);
        const next = current + jump;

        uiProps = {
          start,
          end,
          interactive: true,
          startPos: current,
          showJumps: [{ from: current, to: next }],
        };
        evaluate = ans => Number(ans) === next;
        answer = next;
        big = String(current);
        options = numericOptions(answer, start, end);
        break;
      }
`,
    "numberline bidirecional",
  );

  composer = once(
    composer,
`      case "plain": {
        if (params.complemento_dez) {`,
`      case "plain": {
        // P22.3A: ordenação é opt-in; nenhuma outra ficha plain muda de semântica.
        if (params.modo === "ordering") {
          const start = params.start ?? 1;
          const end = params.end ?? 10;
          if (!Number.isInteger(start) || !Number.isInteger(end) || end - start + 1 < 4) {
            throw new Error(\`Intervalo inválido para ordenação em \${ficha.id}/\${micro.id}.\`);
          }
          const count = randomInt(3, 4);
          const first = randomInt(start, end - count + 1);
          const ascending = Array.from({ length: count }, (_, index) => first + index);
          const correct = ascending.join(" → ");
          const reversed = [...ascending].reverse();
          const swapped = [...ascending];
          [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
          const rotated = [...ascending.slice(1), ascending[0]];
          const sequences = Array.from(new Set(
            [ascending, reversed, swapped, rotated].map(sequence => sequence.join(" → ")),
          ));
          const shuffled = [...ascending].sort(() => Math.random() - 0.5);
          answer = correct;
          big = shuffled.join("   ");
          uiProps = { text: big };
          options = sequences.map(sequence => ({
            label: sequence,
            value: sequence,
            ...(sequence === correct ? {} : { misconception: MisconceptionTag.ORDEM_ERRADA }),
          })).sort(() => Math.random() - 0.5);
          evaluate = ans => String(ans) === correct;
          promptOverride = String(params.audio_prompt ?? "Coloque os números do menor para o maior.");
        } else if (params.complemento_dez) {`,
    "plain/ordering",
  );

  composer = once(
    composer,
`        } else if (typeof params.start === "number" && typeof params.end === "number") {
          const jump = params.jump_size || 1;
          const current = randomInt(params.start, params.end - jump);
          answer = current + jump;
          big = String(current);
          uiProps = { text: String(current) };
          options = numericOptions(answer, params.start, params.end);
          evaluate = (ans) => ans === answer;
          promptOverride = "Qual número vem depois?";
`,
`        } else if (typeof params.start === "number" && typeof params.end === "number") {
          const jump = params.jump_size ?? 1;
          if (!Number.isInteger(jump) || jump === 0 || params.start >= params.end) {
            throw new Error(\`Intervalo/salto inválido no plain de \${ficha.id}/\${micro.id}.\`);
          }
          const currentMin = jump > 0 ? params.start : params.start - jump;
          const currentMax = jump > 0 ? params.end - jump : params.end;
          if (currentMin > currentMax) {
            throw new Error(\`Salto \${jump} não cabe no intervalo \${params.start}..\${params.end} de \${ficha.id}/\${micro.id}.\`);
          }
          const current = randomInt(currentMin, currentMax);
          answer = current + jump;
          big = String(current);
          uiProps = { text: String(current) };
          options = numericOptions(answer, params.start, params.end);
          evaluate = ans => Number(ans) === answer;
          promptOverride = jump < 0 ? "Qual número vem antes?" : "Qual número vem depois?";
`,
    "plain salto bidirecional",
  );
  fs.writeFileSync(composerPath, composer);

  const canonPath = "AI_Studio_Lab/pedagogia/fichas/FICHAS_F0_COMPLETAS.md";
  let canon = fs.readFileSync(canonPath, "utf8");
  canon = once(
    canon,
    '**Competência:** N1.07 (sucessor e antecessor) · **Primitiva:** `AudioChoice` + `NumberLine` · **Faixa:** F0 · **Também é trilha do Dojo (JD4)**',
    '**Competência:** N1.07 (ordem, sucessor e antecessor) · **Primitiva:** `NumberLine` + `plain` · **Faixa:** F0 · **JD4 é a trilha posterior de automaticidade**',
    "identidade autoral N1.07",
  );
  const foundation = '**O que a criança aprende:** que cada número tem um **próximo fixo** — e que "próximo" significa "mais um".\n';
  canon = once(
    canon,
    foundation,
    `${foundation}\n**Escopo da Jornada N1.07:** a competência canônica inclui **sucessor, antecessor e ordenação de 3–4 numerais**. A Jornada observa os três componentes. JD4 automatiza a vizinhança numérica depois; não substitui compreensão nem concede domínio da Jornada.\n`,
    "escopo Jornada versus JD4",
  );
  canon = once(
    canon,
    '## 9. Domínio\n`{ acertos: 3, de: 3, sessoes: 2 }` — e **regra extra**: os acertos precisam ser **sem recitar** (medido pelo tempo de resposta: abaixo de 4 segundos indica acesso direto, acima indica contagem).',
    '## 9. Domínio / automaticidade\nNa **Jornada N1.07**, domínio conceitual exige evidência de sucessor, antecessor e ordenação e **nunca depende de velocidade**. No **JD4**, `{ acertos: 3, de: 3, sessoes: 2 }` e o tempo descrevem automaticidade/fluência, sem coroar a competência-mãe.',
    "domínio conceitual versus fluência",
  );
  fs.writeFileSync(canonPath, canon);

  console.log("[P22.3A] patch focal aplicado no workspace");
}

function publish() {
  run(`git show ${stableCiCommit}:.github/workflows/ci.yml > .github/workflows/ci.yml`);
  fs.rmSync(self, { force: true });
  run('git config user.name "saga-ci-bot"');
  run('git config user.email "saga-ci-bot@users.noreply.github.com"');
  run("git add -A");
  run("git diff --cached --check");
  run('git commit -m "P22.3A: completa N1.07 canônica"');
  run(`git push origin HEAD:${branch}`);
}

if (mode === "apply") apply();
else if (mode === "publish") publish();
else throw new Error("uso: node p22_3a_apply.cjs <apply|publish>");
