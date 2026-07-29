import { ThemeConfig } from "../../types";

export const C = {
  bg: "#F1F7FF",
  ink: "#22315C",
  sub: "#6B7AA8",
  card: "#FFFFFF",
  line: "#D9E5F8",
  soft: "#EBF2FF",
  sun: "#FFC531",
  sunDark: "#D9A312",
  mint: "#2ED573",
  mintDark: "#1FA855",
  melon: "#FF6B6B",
  melonDark: "#D94A4A",
  grape: "#7C5CFF",
  grapeDark: "#5A3BE0",
  ocean: "#1E90FF",
  oceanDark: "#0F6FD0",
  pink: "#FF8FD8",
  pinkDark: "#D964AC",
};

export const BODY_COLORS: Record<string, string> = {
  classico: "#C4B5FD",          // Purple
  heroi: "#FDBA74",             // Orange
  futebol: "#FED7AA",           // Peach
  musica: "#A855F7",            // Roqueiro Purple
  dino: "#4ADE80",              // Green
  homem_aranha: "#E11D48",      // Crimson Red
  batman: "#374151",            // Charcoal Gray
  elsa: "#93C5FD",              // Light Sky Blue
  pikachu: "#FDE047",           // Pikachu Yellow
  hulk: "#22C55E",              // Hulk Green
  capitao_america: "#2563EB",   // Captain America Blue
  homem_ferro: "#EF4444",       // Iron Man Red
  bruxo: "#6D28D9",             // Wizard Purple
  pantera_negra: "#1E293B",     // Black Panther Dark Charcoal
  thor: "#78716C",              // Thor Gray/Stone
  goku: "#F97316",              // Goku Orange
  homem_ferro_pixel: "#EF4444", // Iron Man Pixel Art Red
  homem_aranha_pixel: "#E11D48", // Spider Man Pixel Art Crimson
  hulk_pixel: "#22C55E",        // Hulk Pixel Art Green
  homem_ferro_hd: "#EF4444",    // HD Pixel Iron Man Red
  homem_aranha_hd: "#E11D48",   // HD Pixel Spider-Man Red
  capitao_america_hd: "#2563EB", // HD Pixel Captain America Blue
  thor_hd: "#78716C",           // HD Pixel Thor Gray
  dragao_fogo: "#EF4444",       // Dragão de Fogo Red
  trex: "#4ADE80",              // T-Rex Green
  trex2: "#22D3EE",             // T-Rex 2 Cyan
};

export const THEME_EMOJIS: Record<string, string> = {
  classico: "🎩",
  homem_aranha: "🕷️",
  batman: "BAT",
  elsa: "❄️",
  pikachu: "⚡",
  heroi: "🦸",
  hulk: "🟢",
  capitao_america: "🛡️",
  homem_ferro: "🦾",
  bruxo: "🧙‍♂️",
  futebol: "⚽",
  musica: "🎸",
  dino: "🦖",
  pantera_negra: "🐈‍⬛",
  thor: "🔨",
  goku: "🥋",
  homem_ferro_pixel: "🤖",
  homem_aranha_pixel: "🕷️",
  hulk_pixel: "🥦",
  homem_ferro_hd: "🛡️⚡",
  homem_aranha_hd: "🕸️✨",
  capitao_america_hd: "⭐️🛡️",
  thor_hd: "⚡️🔨",
  dragao_fogo: "🔥",
  trex: "🦖",
  trex2: "🦕",
};

export const EMO = ["🍎", "🐶", "⚽", "🍓", "🐟", "🚗", "🦆", "🌼", "🍪", "🎈", "🐞", "⭐"];
export const PRAISE = [
  "Você acertou! Que orgulho! 🎉",
  "Uau, você mandou muito bem! ⭐",
  "Isso mesmo! Você é brilhante! 🥳",
  "Parabéns, meu amiguinho! Que inteligência! 💪",
  "Uhul! Que lindo acerto! ✨",
  "Perfeito! Você brilha como uma estrela! 🌟"
];

export const THEMES: Record<string, ThemeConfig> = {
  classico: { nome: "Clássico", icon: "🎩", emojis: EMO, praise: PRAISE, bg: ["#E4F0FF", "#F1F7FF"], burst: ["⭐", "✨", "🎉", "💛", "🌟"] },
  homem_aranha: {
    nome: "Aranha", icon: "🕷️", bg: ["#FFD6D6", "#FFF0F0"], burst: ["🕷️", "🕸️", "🔴", "🔵", "✨"],
    emojis: ["🕷️", "🕸️", "🏙️", "🦸", "💥", "🔴", "🔵", "👟", "🛹", "⭐"],
    praise: [
      "Sensacional! Teia de aranha certeira! 🕸️",
      "Incrível! Com grandes poderes matemáticos vêm grandes acertos! 🕷️",
      "Uau! Um acerto espetacular! 🏙️",
      "Parabéns! Você escalou essa questão como um verdadeiro herói! 🦸",
      "Espetacular! Seu sentido aranha estava certíssimo! 🔴🔵"
    ],
  },
  batman: {
    nome: "Batman", icon: "🦇", bg: ["#E2E8F0", "#F1F5F9"], burst: ["🦇", "🌕", "⭐", "🖤", "✨"],
    emojis: ["🦇", "🌕", "🌌", "🕵️", "🚗", "🔦", "🖤", "💛", "⚙️", "⭐"],
    praise: [
      "Fantástico! A justiça matemática foi feita! 🦇",
      "Excelente! Você decifrou esse mistério como o maior detetive do mundo! 🔍",
      "Uau! Direto da Batcaverna para o topo! 🌌",
      "Parabéns! Sua mente é tão brilhante quanto o Bat-sinal! 🌕",
      "Incrível! Nem o Coringa venceria sua inteligência! 🖤"
    ],
  },
  elsa: {
    nome: "Elsa", icon: "❄️", bg: ["#E0F2FE", "#F0F9FF"], burst: ["❄️", "✨", "👑", "🧊", "💙"],
    emojis: ["❄️", "⛄", "🏰", "👑", "🧊", "🪄", "🦌", "🧣", "💙", "⭐"],
    praise: [
      "Lindo! Um acerto congelante e mágico! ❄️",
      "Sensacional! Livre estou para acertar tudo! 🏰",
      "Incrível! Sua inteligência brilha como um castelo de gelo! ✨",
      "Parabéns! Você domina as matérias com muita elegância! 👑",
      "Espetacular! Um verdadeiro show de mágica congelante! 💙"
    ],
  },
  pikachu: {
    nome: "Pikachu", icon: "⚡", bg: ["#FEF9C3", "#FEFCE8"], burst: ["⚡", "🔴", "⭐", "💥", "💛"],
    emojis: ["⚡", "🎒", "🍒", "🔥", "💧", "🍃", "🔴", "⭐", "🌟", "🧢"],
    praise: [
      "Pika-Chuuu! Que choque de inteligência! ⚡",
      "Uau! Um acerto super efetivo! 🔴",
      "Incrível! Você evoluiu suas habilidades! ⭐",
      "Parabéns! Brilhante como um raio de eletricidade! 🌟",
      "Fantástico! Você capturou a resposta perfeita! 🎒"
    ],
  },
  heroi: {
    nome: "Heróis", icon: "⚡", bg: ["#FFDCD2", "#FFF4EE"], burst: ["⚡", "💥", "⭐", "🔥", "✨"],
    emojis: ["⚡", "🛡️", "💥", "🦸", "🚀", "🌩️", "🧤", "💪", "🔥", "⭐"],
    praise: [
      "Incrível! Você tem superpoderes! ⚡",
      "Super acerto! Você é o herói do dia! 💥",
      "Uau! Você salvou o dia com essa inteligência brilhante! 🦸",
      "Parabéns! Que força mental incrível! 💪",
      "Espetacular! Você brilha mais que o sol! 🌟"
    ],
  },
  hulk: {
    nome: "Hulk", icon: "🟢", bg: ["#DCFCE7", "#F0FDF4"], burst: ["🟢", "💥", "🤜", "💜", "✨"],
    emojis: ["🤜", "🧱", "🦖", "💪", "💥", "🟢", "💜", "🩳", "🔥", "⭐"],
    praise: [
      "ESMAGADOR! Que acerto forte! 🤜",
      "Uau! Força incrível do Hulk verde! 💪",
      "Sensacional! Você superou esse desafio com inteligência! 💥",
      "Incrível! Hulk está super orgulhoso de você! 🟢",
      "Parabéns! Um salto gigante rumo ao acerto! 🧱"
    ],
  },
  capitao_america: {
    nome: "Capitão", icon: "🛡️", bg: ["#DBEAFE", "#EFF6FF"], burst: ["🛡️", "⭐", "🔴", "🔵", "✨"],
    emojis: ["🛡️", "⭐", "🔴", "🔵", "🧢", "🎖️", "🏢", "💥", "🗽", "⭐"],
    praise: [
      "Excelente! Defesa e ataque impecáveis! 🛡️",
      "Uau! Acerto digno do líder dos heróis! ⭐",
      "Sensacional! Lançamento de escudo certeiro! 🔵",
      "Parabéns! Sua determinação é inabalável! 🎖️",
      "Incrível! Você é a força e justiça da equipe! 🔴"
    ],
  },
  homem_ferro: {
    nome: "H. de Ferro", icon: "🦾", bg: ["#FEE2E2", "#FEF2F2"], burst: ["🤖", "🚀", "🔥", "💛", "✨"],
    emojis: ["🤖", "🚀", "🔥", "🦾", "🛠️", "⚙️", "🌟", "🟥", "🟨", "⭐"],
    praise: [
      "Gênio! Tecnologia de ponta e acerto perfeito! 🤖",
      "Uau! Seus propulsores te levaram direto ao acerto! 🚀",
      "Incrível! Armadura blindada contra erros! 🦾",
      "Sensacional! Reator Arc brilhando em potência máxima! 🔥",
      "Parabéns! Você calculou com precisão cirúrgica! 🛠️"
    ],
  },
  bruxo: {
    nome: "Bruxo", icon: "🧙‍♂️", bg: ["#F3E8FF", "#F9F5FF"], burst: ["🧙‍♂️", "🪄", "🔮", "✨", "💜"],
    emojis: ["🧙‍♂️", "🪄", "🔮", "🏰", "🦉", "🧹", "🧪", "📜", "⭐", "🌟"],
    praise: [
      "Feitiço perfeito! Um acerto mágico! 🪄",
      "Uau! Você decifrou a alquimia dos números! 🔮",
      "Incrível! Alvo atingido com varinha mágica! 🧙‍♂️",
      "Espetacular! Sabedoria ancestral brilhante! 📜",
      "Parabéns! Uma lição fascinante! 🏰"
    ],
  },
  futebol: {
    nome: "Futebol", icon: "⚽", bg: ["#D8F5DF", "#F0FFF4"], burst: ["⚽", "🏆", "⭐", "🥇", "✨"],
    emojis: ["⚽", "🥅", "🏆", "👟", "🧤", "🟨", "📣", "🎽", "🥇", "⭐"],
    praise: [
      "GOLAÇO! Você joga como um campeão! ⚽",
      "Que jogada linda! Nota dez para você! 🏆",
      "Isso aí! Chute certeiro direto pro gol! 👟",
      "Espetacular! Um acerto digno de troféu! 🥇",
      "Maravilhoso! Você brilha muito em campo! 🌟"
    ],
  },
  musica: {
    nome: "Roqueiro", icon: "🎸", bg: ["#F1F5F9", "#F8FAFC"], burst: ["⚡", "🎸", "💀", "🤘", "✨"],
    emojis: ["🎸", "🥁", "🎹", "🎤", "⚡", "💀", "🤘", "🎧", "🎵", "⭐"],
    praise: [
      "Rock'n Roll! Solo de guitarra impecável e acerto épico! 🎸",
      "Sensacional! A plateia inteira foi ao delírio com esse show! 🎤",
      "Uau! Ritmo avassalador e resposta certeira! ⚡",
      "Parabéns! Você arrasou no palco com muito estilo! 🤘",
      "Espetacular! Sua inteligência é puro rock de primeira! 🎧"
    ],
  },
  dino: {
    nome: "Dinos", icon: "🦖", bg: ["#E2F5D3", "#F4FFF0"], burst: ["🦖", "🌿", "⭐", "🦴", "✨"],
    emojis: ["🦖", "🦕", "🌋", "🥚", "🦴", "🌴", "🐊", "🍖", "🌿", "⭐"],
    praise: [
      "Uau! Um acerto jurássico e gigante! 🦖",
      "Sensacional! Que força incrível de dinossauro! 🦕",
      "Você arrasou! Descoberta digna de um cientista! 🌋",
      "Rawr! Que garra incrível! Nota dez! 🦴",
      "Parabéns! Você é dino-demais! 🌟"
    ],
  },
  pantera_negra: {
    nome: "Pantera", icon: "🐈‍⬛", bg: ["#1E293B", "#334155"], burst: ["🐾", "🖤", "👑", "✨", "🧬"],
    emojis: ["🐾", "🐈‍⬛", "🖤", "👑", "🛡️", "🌌", "🪐", "🔥", "💪", "⭐"],
    praise: [
      "Wakanda Para Sempre! Um acerto com a agilidade do Pantera! 🐾",
      "Incrível! Garra e inteligência dignas de um rei! 👑",
      "Uau! Sua mente brilha como o Vibranium! 🖤",
      "Parabéns! Resposta super veloz e silenciosa! 🐈‍⬛",
      "Espetacular! Você domina os desafios com a força de Wakanda! 🌌"
    ],
  },
  thor: {
    nome: "Thor", icon: "🔨", bg: ["#475569", "#64748B"], burst: ["⚡", "🔨", "⛈️", "✨", "🌟"],
    emojis: ["⚡", "🔨", "⛈️", "👑", "🛡️", "🌌", "🪐", "⚔️", "⭐", "🌟"],
    praise: [
      "Pelos trovões de Asgard! Que acerto estrondoso! ⚡",
      "Incrível! Você levantou o Mjolnir da matemática! 🔨",
      "Uau! Um raio de sabedoria acertou em cheio! ⛈️",
      "Parabéns! Você é o herói mais forte de Asgard! 🌟",
      "Sensacional! Que poder de cálculo supremo! 👑"
    ],
  },
  goku: {
    nome: "Goku", icon: "🥋", bg: ["#FFEDD5", "#FFDBB5"], burst: ["🥋", "🐉", "🟠", "🔥", "⚡"],
    emojis: ["🥋", "🐉", "🟠", "🔥", "💨", "💪", "⚡", "👊", "⭐", "🌟"],
    praise: [
      "KAMEHAMEHA! Que acerto de outro mundo! 💥🔥",
      "Incrível! Seu poder matemático é de mais de 8000! 📈⚡",
      "Uau! Você se superou e alcançou o Super Saiyajin! 🌟🥋",
      "Parabéns! Que determinação de guerreiro das estrelas! 🟠",
      "Sensacional! Você reuniu as 7 esferas da resposta certa! 🐉"
    ],
  },
  homem_ferro_pixel: {
    nome: "H. Ferro (Pixel)", icon: "🤖", bg: ["#FEE2E2", "#FEF2F2"], burst: ["👾", "🤖", "🚀", "⚡", "✨"],
    emojis: ["👾", "🤖", "🚀", "🔥", "🦾", "🛠️", "⚙️", "🌟", "🟥", "⭐"],
    praise: [
      "SISTEMA UPGRADED! Precisão pixel-art perfeita! 🤖✨",
      "Uau! Propulsores de 16-bits ativados rumo ao topo! 🚀",
      "Incrível! Super cálculo de inteligência artificial! 🦾",
      "Sensacional! Reator Arc em retro-estilo brilhando! ⚡",
      "Parabéns! Você resolveu com a maestria de Tony Stark! 🛠️"
    ],
  },
  homem_aranha_pixel: {
    nome: "Aranha (Pixel)", icon: "🕷️", bg: ["#FFD6D6", "#FFF0F0"], burst: ["👾", "🕷️", "🕸️", "🔴", "🔵"],
    emojis: ["👾", "🕷️", "🕸️", "🏙️", "💥", "🔴", "🔵", "🛹", "🦸", "⭐"],
    praise: [
      "SENSACIONAL! Teia de 8-bits lançada com sucesso! 🕸️👾",
      "Incrível! Com grandes retro-poderes vêm grandes acertos! 🕷️",
      "Uau! Sentido aranha apitando no pixel perfeito! 🔴🔵",
      "Parabéns! Você escalou esse desafio matemático com maestria! 🦸",
      "Espetacular! Super pulo arcade para o acerto! 💥"
    ],
  },
  hulk_pixel: {
    nome: "Hulk (Pixel)", icon: "🥦", bg: ["#DCFCE7", "#F0FDF4"], burst: ["👾", "🟢", "💥", "🤜", "✨"],
    emojis: ["👾", "🤜", "🧱", "💪", "💥", "🟢", "💜", "🔥", "🧱", "⭐"],
    praise: [
      "HULK ESMAGA EM PIXEL! Que pancada de acerto! 🤜💚",
      "Uau! Força bruta de 16-bits resolvendo a questão! 💪",
      "Sensacional! Um salto gigante de blocos rumo à vitória! 💥",
      "Incrível! Retro-Hulk está orgulhoso da sua inteligência! 🟢",
      "Parabéns! Você quebrou a barreira dos erros! 🧱"
    ],
  },
  homem_ferro_hd: {
    nome: "H. Ferro HD 2D", icon: "🛡️⚡", bg: ["#FEE2E2", "#FEF2F2"], burst: ["✨", "🛡️", "🔥", "⚡", "💎"],
    emojis: ["👾", "🛡️", "⚡", "🦾", "🚀", "⚙️", "🔥", "🌟", "🟥", "⭐"],
    praise: [
      "ESPETACULAR! Precisão cirúrgica de Pixel Art HD! 🛡️✨",
      "Sensacional! Reator Arc brilhando em alta resolução! ⚡💎",
      "Incrível! Upgrade completo de inteligência matemática! 🦾",
      "Uau! Seus cálculos voaram na velocidade de um foguete! 🚀🌟",
      "Parabéns! Um gênio como o próprio Stark! ⚙️"
    ]
  },
  homem_aranha_hd: {
    nome: "Aranha HD 2D", icon: "🕸️✨", bg: ["#FFD6D6", "#FFF0F0"], burst: ["🕸️", "🔴", "🔵", "⚡", "✨"],
    emojis: ["👾", "🕸️", "🏙️", "🕷️", "🦸", "💥", "👟", "🛹", "✨", "⭐"],
    praise: [
      "INCRÍVEL! Teia do Pixel Perfeito lançada com maestria! 🕸️✨",
      "Uau! Seu sentido aranha de alta definição acertou em cheio! 🔴🔵",
      "Sensacional! Acrobacias matemáticas sensacionais! 🦸⚡",
      "Parabéns! Você escalou esse mistério com muito estilo! 🏙️",
      "Espetacular! Um verdadeiro show de herói moderno! 🕷️"
    ]
  },
  capitao_america_hd: {
    nome: "Capitão HD 2D", icon: "⭐️🛡️", bg: ["#DBEAFE", "#EFF6FF"], burst: ["🛡️", "⭐️", "🔴", "🔵", "✨"],
    emojis: ["👾", "🛡️", "⭐️", "🎖️", "🗽", "💥", "🔴", "🔵", "🕶️", "⭐"],
    praise: [
      "IMPECÁVEL! Estratégia de escudo em alta definição! ⭐️🛡️",
      "Incrível! Liderança e precisão matemática absolutas! 🎖️✨",
      "Uau! Lançamento de escudo no pixel exato! 🔴🔵",
      "Parabéns! Sua determinação brilha como uma estrela! 🌟",
      "Fantástico! Você defendeu seu recorde com maestria! 🛡️"
    ]
  },
  thor_hd: {
    nome: "Thor HD 2D", icon: "⚡️🔨", bg: ["#475569", "#64748B"], burst: ["⚡️", "🔨", "⛈️", "✨", "💫"],
    emojis: ["👾", "⚡️", "🔨", "⛈️", "🪐", "👑", "🌌", "🛡️", "💫", "⭐"],
    praise: [
      "ESTRONDOSO! Pelos raios de Asgard HD! ⚡️⛈️",
      "Uau! Você ergueu o martelo sagrado da matemática! 🔨✨",
      "Incrível! Um raio de genialidade cortou os céus! 🌩️💫",
      "Sensacional! Força e sabedoria dignas de um deus! 👑",
      "Parabéns! Seu poder de cálculo é lendário! 🌌"
    ]
  },
  dragao_fogo: {
    nome: "Dragão de Fogo", icon: "🔥", bg: ["#FFECEC", "#FFF5F5"], burst: ["🔥", "✨", "☄️", "🔴", "🔶"],
    emojis: ["🔥", "🐉", "☄️", "🌋", "🏰", "🛡️", "🥚", "⚔️", "✨", "⭐"],
    praise: [
      "INCRÍVEL! Um acerto flamejante e poderoso! 🔥🐉",
      "Uau! O sopro de fogo do seu cérebro acertou em cheio! ☄️✨",
      "Sensacional! Sua inteligência é quente como lava! 🌋",
      "Parabéns! Você resolveu essa questão com a força de um dragão lendário! 👑",
      "Espetacular! Um verdadeiro campeão dos dragões! 🐉✨"
    ]
  },
  trex: {
    nome: "T-Rex", icon: "🦖", bg: ["#E2F5D3", "#F4FFF0"], burst: ["🦖", "🌿", "⭐", "🦴", "✨"],
    emojis: ["🦖", "🦕", "🌋", "🥚", "🦴", "🌴", "🐊", "🍖", "🌿", "⭐"],
    praise: [
      "Uau! Um acerto jurássico e gigante! 🦖",
      "Sensacional! Que força incrível de dinossauro! 🦕",
      "Você arrasou! Descoberta digna de um cientista! 🌋",
      "Rawr! Que garra incrível! Nota dez! 🦴",
      "Parabéns! Você é dino-demais! 🌟"
    ]
  },
  trex2: {
    nome: "T-Rex 2", icon: "🦕", bg: ["#E0F7FA", "#E0F2F1"], burst: ["🦕", "🌊", "⭐", "🌿", "✨"],
    emojis: ["🦕", "🦖", "🌊", "🥚", "🐟", "🌴", "🐊", "🌿", "⭐", "💎"],
    praise: [
      "Uau! Um acerto aquático e gigante! 🦕",
      "Sensacional! Que força incrível de dinossauro! 🌊",
      "Você arrasou! Mergulho digno de um campeão! 💎",
      "Splash! Que garra incrível! Nota dez! 🐟",
      "Parabéns! Você é dino-demais! 🌟"
    ]
  },
};
