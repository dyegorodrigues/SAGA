const fs = require('fs');
let content = fs.readFileSync('src/components/KidHomeScreen.tsx', 'utf8');

const oldStr = `
                <div className="text-xs font-bold mt-1 leading-snug text-rose-900/80">
                  Treine sua velocidade e reflexos! Responda o mais rápido que puder para ganhar o título de Gênio. ⚡
                </div>
              </button>
            </div>
          </div>
        )}

        {activeShellTab === "oficina"`;

const newStr = `
                <div className="text-xs font-bold mt-1 leading-snug text-rose-900/80">
                  Treine sua velocidade e reflexos! Responda o mais rápido que puder para ganhar o título de Gênio. ⚡
                </div>
              </button>
            </div>
          </div>
        </div>
        )}

        {activeShellTab === "oficina"`;

content = content.replace(oldStr, newStr);
fs.writeFileSync('src/components/KidHomeScreen.tsx', content);
