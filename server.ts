import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 3000;

const FIREBASE_PROJECT_ID = "ferrous-reactor-rgtt6";
let googlePublicCerts: Record<string, string> = {};
let lastCertsFetch = 0;

// Fetch Google public certificates to verify RS256 signatures
async function getGooglePublicCerts() {
  const now = Date.now();
  // Cache certificates for 1 hour
  if (Object.keys(googlePublicCerts).length > 0 && now - lastCertsFetch < 3600000) {
    return googlePublicCerts;
  }
  try {
    const res = await fetch("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com");
    googlePublicCerts = await res.json();
    lastCertsFetch = now;
  } catch (err) {
    console.error("[Auth] Failed to fetch Google public certificates:", err);
  }
  return googlePublicCerts;
}

// Verify the Firebase ID Token using public certificates and audience/issuer claims
async function verifyFirebaseToken(token: string): Promise<any> {
  const decodedToken = jwt.decode(token, { complete: true }) as any;
  if (!decodedToken || typeof decodedToken === "string") {
    throw new Error("Token de autenticação inválido ou malformado.");
  }

  const kid = decodedToken.header.kid;
  if (!kid) {
    throw new Error("Token sem ID de chave (kid) no cabeçalho.");
  }

  const certs = await getGooglePublicCerts();
  const cert = certs[kid];
  if (!cert) {
    throw new Error("Chave pública correspondente do Google não encontrada.");
  }

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      cert,
      {
        audience: FIREBASE_PROJECT_ID,
        issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) {
          return reject(new Error(`Falha na assinatura do token: ${err.message}`));
        }
        resolve(decoded);
      }
    );
  });
}

// Custom authenticated request interface
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Rate limit por usuário: protege a fatura do Gemini contra abuso.
// Contador em memória, zerado a cada dia (chave = uid + data).
const DAILY_LIMITS: Record<string, number> = {
  tutor: 20,
  report: 5,
};
const usageCounters = new Map<string, number>();

function rateLimit(kind: "tutor" | "report") {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const uid = req.user?.user_id || req.user?.sub;
    if (!uid) {
      return res.status(401).json({ error: "Sessão inválida." });
    }
    const today = new Date().toISOString().slice(0, 10);
    const key = `${kind}:${uid}:${today}`;
    const used = usageCounters.get(key) || 0;
    if (used >= DAILY_LIMITS[kind]) {
      return res.status(429).json({
        error: "Limite diário atingido.",
        hint: kind === "tutor"
          ? "Ufa, quantas dicas hoje! Amanhã eu te ajudo mais — agora tenta contar com calma que você consegue! 🌟"
          : "O limite diário de relatórios foi atingido. Tente novamente amanhã.",
      });
    }
    usageCounters.set(key, used + 1);
    // Limpeza simples: evita crescimento infinito do Map entre dias
    if (usageCounters.size > 10000) {
      for (const k of usageCounters.keys()) {
        if (!k.endsWith(today)) usageCounters.delete(k);
      }
    }
    next();
  };
}

// Security Middleware to enforce valid Firebase Session (Google or Anonymous)
async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Acesso negado. Token de autorização ausente ou inválido." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = await verifyFirebaseToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error("[Auth Error] Token verification failed:", error.message || error);
    return res.status(401).json({ error: "Sessão expirada ou inválida. Faça login novamente no aplicativo." });
  }
}

// Initialize GoogleGenAI SDK safely
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper function to generate content with transient error retries and model fallbacks
async function generateContentWithRetry(params: {
  model: string;
  contents: any;
  config?: any;
}) {
  const models = [params.model, "gemini-3.5-flash"];
  let lastError: any = null;

  for (const currentModel of models) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[Gemini API] Chamando ${currentModel} (Tentativa ${attempt}/3)...`);
        const response = await ai.models.generateContent({
          model: currentModel,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (error: any) {
        lastError = error;
        console.error(
          `[Gemini API] Erro ao chamar ${currentModel} na tentativa ${attempt}:`,
          error.message || error
        );
        // Wait before retrying (exponential backoff)
        if (attempt < 3) {
          const delay = attempt * 500;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  }
  throw lastError;
}

// JSON parser middleware
app.use(express.json());

// API route 1: Mascot intelligent tutor
app.post("/api/tutor", authMiddleware, rateLimit("tutor"), async (req, res) => {
  const { kidName, grade, theme, question } = req.body;

  try {
    const qDetails = question
      ? `Pergunta: "${question.prompt}". Expressão matemática/problema: "${question.expr || question.story || ""}". Tipo de exercício: ${question.kind}`
      : "Exercício genérico de matemática.";

    const systemInstruction = `Você é o mascote tutor inteligente e super fofinho do tema "${theme}" da Matemágica. 
Sua missão é dar uma dica ou pista lúdica, engraçada e amigável para ajudar a criança "${kidName}" (da ${grade}) a resolver um exercício de matemática sem nunca dar a resposta direta!
Use expressões extremamente naturais, coloquiais, calorosas e divertidas associadas ao seu tema, agindo como um amiguinho real e carinhoso de brincadeiras. Nunca fale de forma robótica ou formal.
Mantenha a resposta super curta (no máximo 2 frases curtas) para ser fácil de ler e ouvir.`;

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: `Por favor, me dê uma dica amigável e divertida para este exercício: ${qDetails}`,
      config: {
        systemInstruction,
        temperature: 1.0,
      },
    });

    const hint = response.text || "Vamos contar juntos e com calma? Você consegue! ✨";
    res.json({ hint });
  } catch (error: any) {
    console.error("Erro no tutor de IA:", error);
    res.json({ hint: "Você está indo muito bem! Que tal contar as figuras com calma de uma em uma? 🌟" });
  }
});

// API route 2: Pedagogical progress analyst
app.post("/api/analyze-progress", authMiddleware, rateLimit("report"), async (req, res) => {
  const { kidName, grade, stats, recentLogs } = req.body;

  try {
    const statsSummary = JSON.stringify(stats);
    const logsSummary = JSON.stringify(recentLogs);

    const systemInstruction = `Você é um especialista sênior em pedagogia infantil e educação matemática. 
Sua tarefa é analisar os dados reais de aprendizado da criança "${kidName}" (da faixa etária "${grade}") e gerar um relatório pedagógico acolhedor, profissional e encorajador para os pais.
Você deve formatar o relatório em Markdown legível usando exatamente estas 3 seções com cabeçalhos ###:
### 🌟 Pontos Fortes do Aprendizado
### 🎯 Áreas para Praticar com Atenção
### 🎲 Brincadeiras Reais Recomendadas (Ideias de atividades lúdicas e simples fora das telas que os pais podem fazer em casa com objetos reais para exercitar os conceitos)

Mantenha a linguagem afetiva, pedagógica e construtiva, sem revelar dados técnicos crus de JSON para não assustar os pais. Foque no significado pedagógico de cada número.`;

    const contents = `Dados estatísticos do jogo: ${statsSummary}. Histórico recente de atividades diárias: ${logsSummary}.`;

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const report = response.text || "Relatório temporariamente indisponível. Continue praticando para acumular mais dados!";
    res.json({ report });
  } catch (error: any) {
    console.error("Erro no analista de progresso de IA:", error);
    res.json({
      report: "### 🌟 Relatório Pedagógico\nOcorreu um pequeno erro ao se conectar com o especialista de IA. No entanto, o progresso está incrível! Continue praticando os portais para gerar novas estatísticas e liberar mais medalhas.",
    });
  }
});

// Setup Vite Dev Server / Static files routing
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Matemágica App Server] escutando na porta http://localhost:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Falha ao iniciar o servidor express full-stack:", err);
});
