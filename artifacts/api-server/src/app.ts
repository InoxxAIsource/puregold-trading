import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ credentials: true, origin: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Cache-control for read-heavy public API endpoints
app.use("/api/products", (req, res, next) => {
  if (req.method === "GET") {
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  }
  next();
});
app.use("/api/prices", (req, res, next) => {
  if (req.method === "GET") {
    res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
  }
  next();
});
app.use("/api/blog", (req, res, next) => {
  if (req.method === "GET") {
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
  }
  next();
});

app.use("/api", router);

export default app;
