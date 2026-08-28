import express from "express";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createApp } from "./createApp";
import { createIndicatorRepository } from "./config/repositoryFactory";
import { loadIndicatorSeed } from "./data/indicatorSeed";
import { IndicatorService } from "./services/indicatorService";
import { logger } from "./observability/logger";
import indicadoresData from "../../data/indicadores.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const { rawIndicators, rawReports } = loadIndicatorSeed(indicadoresData);

  const indicatorRepository = createIndicatorRepository({ rawIndicators, rawReports });
  await indicatorRepository.initialize();

  const indicatorService = new IndicatorService(indicatorRepository);
  const app = createApp({ indicatorService });
  const server = createServer(app);

  const bundledStaticPath = path.resolve(__dirname, "public");
  const sourceStaticPath = path.resolve(__dirname, "..", "..", "dist", "public");
  const staticPath = fs.existsSync(bundledStaticPath) ? bundledStaticPath : sourceStaticPath;

  app.use(
    express.static(staticPath, {
      maxAge: "1y",
      immutable: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".html")) {
          // Keep HTML fresh so deployments reflect immediately.
          res.setHeader("Cache-Control", "no-store");
        }
      },
    })
  );

  app.get("*", (_req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    res.setHeader("Cache-Control", "no-store");
    res.sendFile(indexPath);
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    logger.info(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch((err) => {
  logger.error({ err }, "Server startup failed");
  process.exit(1);
});
