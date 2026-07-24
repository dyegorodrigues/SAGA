const fs = require('fs');
let code = fs.readFileSync('src/components/GameLoop.tsx', 'utf-8');

const replacement = `
      </div>

      {q.review && !status && (
        <div className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-md text-xs font-bold mb-3">
          🧠 Prática Espaçada / Revisão Inteligente
        </div>
      )}

      <div className="relative">
        {status === "right" && <Burst />}
        {q.kind === "rapid-fire" && <RapidFire q={q} onAnswer={handlePick} disabled={status !== null} />}
        {q.kind === "singapore-bars" && <SingaporeBars q={q} onAnswer={handlePick} disabled={status !== null} />}
        {q.kind !== "rapid-fire" && q.kind !== "singapore-bars" && (
          <>
        {/* Dynamic Canvas Area (escondida no \`order\`: as próprias peças são a cena) */}
        <div className="mk-pop" style={{ background: C.card, borderRadius: 24, boxShadow: \`0 6px 0 \${C.line}\`, padding: "20px 14px", ...(q.kind === "order" || q.kind === "groups" ? { display: "none" } : {}) }}>
          {q.kind === "count" && q.emoji && q.n != null && (
            <div className="flex flex-col items-center gap-3">
              <EmojiRow emoji={q.emoji} n={mockTutorialN !== null ? mockTutorialN : q.n} highlightIndex={guidedIdx} />                                        
            </div>
          )}
          {q.kind === "sum" && q.expr && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-wrap justify-center gap-2">
                {q.emoji && <EmojiRow emoji={q.emoji} n={q.a || 0} startIndex={1} highlightIndex={guidedIdx !== null && guidedIdx < (q.a || 0) ? guidedIdx : null} />}
                {q.emoji && <EmojiRow emoji={q.emoji} n={q.b || 0} startIndex={(q.a || 0) + 1} highlightIndex={guidedIdx !== null && guidedIdx >= (q.a || 0) ? guidedIdx - (q.a || 0) : null} state="sucesso" />}
              </div>
              <div className="mt-2">
                <BigText size={34}>{q.expr}</BigText>
              </div>
            </div>
          )}
`;

code = code.replace(
  /\{\/\* AI Tutor Floating Bulb Button \*\/\}\s*<\/div>\s*<\/div>\s*<div className="mt-2">\s*<BigText size=\{34\}>\{q\.expr\}<\/BigText>\s*<\/div>\s*<\/div>\s*\)\}/,
  replacement
);

fs.writeFileSync('src/components/GameLoop.tsx', code);
