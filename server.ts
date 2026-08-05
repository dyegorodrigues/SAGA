import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  fetchAllowedCreatureAsset,
  getCreatureCatalog,
  getCreatureCharacter,
} from "./server/services/creatureSpriteService";

function messageFromError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.disable("x-powered-by");
  app.use(express.json({ limit: "2mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      app: "SAGA",
      capabilities: {
        creatureEngine: true,
        spriteCollab: true,
      },
    });
  });

  app.get("/api/creatures/catalog", async (req, res) => {
    try {
      const result = await getCreatureCatalog(req.query.refresh === "1");
      res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
      res.json({
        source: "PMDCollab official GraphQL API",
        sourceCommit: result.sourceCommit,
        sourceUpdatedAt: result.sourceUpdatedAt,
        items: result.items,
      });
    } catch (error) {
      console.error("Creature catalog error:", error);
      res.status(502).json({
        error: "Não foi possível carregar o catálogo de criaturas.",
        details: messageFromError(error),
      });
    }
  });

  // Esta rota precisa vir antes de /:numericId para não interpretar "asset" como ID.
  app.get("/api/creatures/asset", async (req, res) => {
    const rawUrl = typeof req.query.url === "string" ? req.query.url : "";
    if (!rawUrl) {
      return res.status(400).json({ error: "O parâmetro 'url' é obrigatório." });
    }

    try {
      const upstream = await fetchAllowedCreatureAsset(rawUrl);
      const contentType = upstream.headers.get("content-type") || "application/octet-stream";
      const contentLength = upstream.headers.get("content-length");
      const etag = upstream.headers.get("etag");
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
      if (contentLength) res.setHeader("Content-Length", contentLength);
      if (etag) res.setHeader("ETag", etag);
      return res.send(Buffer.from(await upstream.arrayBuffer()));
    } catch (error) {
      console.error("Creature asset proxy error:", error);
      return res.status(502).json({
        error: "Não foi possível carregar o asset da criatura.",
        details: messageFromError(error),
      });
    }
  });

  app.get("/api/creatures/:numericId", async (req, res) => {
    try {
      const character = await getCreatureCharacter(req.params.numericId);
      res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
      return res.json(character);
    } catch (error) {
      console.error("Creature character error:", error);
      return res.status(502).json({
        error: "Não foi possível carregar a criatura selecionada.",
        details: messageFromError(error),
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SAGA server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start SAGA server:", error);
  process.exitCode = 1;
});
