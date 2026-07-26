const fs = require('fs');
let content = fs.readFileSync('src/components/KidHomeScreen.tsx', 'utf8');

const acadOld = `              <div className="grid grid-cols-2 gap-3.5">
                <button onClick={() => sfx.wrong()} className="p-4 rounded-2xl border-2 border-rose-200 bg-rose-50 text-left active:translate-y-1 transition-all" style={{boxShadow: '0 4px 0 #FECDD3'}}>
                  <div className="text-3xl mb-1">➕</div>
                  <div className="font-black text-rose-700">Academia da<br/>Adição</div>
                </button>
                <button onClick={() => sfx.wrong()} className="p-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50 text-left active:translate-y-1 transition-all" style={{boxShadow: '0 4px 0 #C7D2FE'}}>
                  <div className="text-3xl mb-1">➖</div>
                  <div className="font-black text-indigo-700">Academia da<br/>Subtração</div>
                </button>
                <button onClick={() => sfx.wrong()} className="p-4 rounded-2xl border-2 border-amber-200 bg-amber-50 text-left active:translate-y-1 transition-all" style={{boxShadow: '0 4px 0 #FDE68A'}}>
                  <div className="text-3xl mb-1">✖️</div>
                  <div className="font-black text-amber-700">Academia da<br/>Multiplicação</div>
                </button>
                <button onClick={() => sfx.wrong()} className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-left active:translate-y-1 transition-all" style={{boxShadow: '0 4px 0 #A7F3D0'}}>
                  <div className="text-3xl mb-1">➗</div>
                  <div className="font-black text-emerald-700">Academia da<br/>Divisão</div>
                </button>
              </div>`;

const acadNew = `              <div className="grid grid-cols-2 gap-3.5">
                <button onClick={() => sfx.wrong()} className="p-4 rounded-2xl border-2 border-rose-200 bg-rose-50 text-left active:translate-y-1 transition-all" style={{boxShadow: '0 4px 0 #FECDD3'}}>
                  <div className="text-3xl mb-1">➕</div>
                  <div className="font-black text-rose-700">Academia da<br/>Adição</div>
                </button>
                <button onClick={() => sfx.wrong()} className="p-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50 text-left active:translate-y-1 transition-all" style={{boxShadow: '0 4px 0 #C7D2FE'}}>
                  <div className="text-3xl mb-1">➖</div>
                  <div className="font-black text-indigo-700">Academia da<br/>Subtração</div>
                </button>
                {kid.grade !== "pre" && (
                  <>
                    <button onClick={() => sfx.wrong()} className="p-4 rounded-2xl border-2 border-amber-200 bg-amber-50 text-left active:translate-y-1 transition-all" style={{boxShadow: '0 4px 0 #FDE68A'}}>
                      <div className="text-3xl mb-1">✖️</div>
                      <div className="font-black text-amber-700">Academia da<br/>Multiplicação</div>
                    </button>
                    <button onClick={() => sfx.wrong()} className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-left active:translate-y-1 transition-all" style={{boxShadow: '0 4px 0 #A7F3D0'}}>
                      <div className="text-3xl mb-1">➗</div>
                      <div className="font-black text-emerald-700">Academia da<br/>Divisão</div>
                    </button>
                  </>
                )}
              </div>`;

content = content.replace(acadOld, acadNew);
fs.writeFileSync('src/components/KidHomeScreen.tsx', content);
