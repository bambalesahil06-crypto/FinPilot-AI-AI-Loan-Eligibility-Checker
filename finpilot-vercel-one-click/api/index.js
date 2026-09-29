import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { randomUUID } from "node:crypto";
import { config } from "../src/config.js";
import { loanSchema, creditSchema, emiSchema, tipsSchema, recordSchema } from "../src/validation.js";
import { calculateLoanEligibility, analyzeCredit, calculateEmi } from "../src/services/finance.js";
import { generateFinancialTips } from "../src/services/claude.js";
import { appendRecord, listRecords } from "../src/services/sheets.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: config.frontendOrigin.split(",").map(x => x.trim()),
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "100kb" }));

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-8",
  legacyHeaders: false
}));

function parse(schema, body) {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.details = parsed.error.flatten();
    throw error;
  }
  return parsed.data;
}

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    service: "finpilot-backend",
    timestamp: new Date().toISOString(),
    integrations: {
      claude: Boolean(config.anthropicApiKey),
      googleSheets: Boolean(config.sheetId && config.serviceAccountEmail && config.privateKey)
    }
  });
});

app.post("/api/loan/eligibility", (req, res, next) => {
  try {
    res.json({ success: true, data: calculateLoanEligibility(parse(loanSchema, req.body)) });
  } catch (err) { next(err); }
});

app.post("/api/credit/analyze", (req, res, next) => {
  try {
    res.json({ success: true, data: analyzeCredit(parse(creditSchema, req.body)) });
  } catch (err) { next(err); }
});

app.post("/api/emi/calculate", (req, res, next) => {
  try {
    res.json({ success: true, data: calculateEmi(parse(emiSchema, req.body)) });
  } catch (err) { next(err); }
});

app.post("/api/ai/tips", async (req, res, next) => {
  try {
    res.json({ success: true, data: await generateFinancialTips(parse(tipsSchema, req.body)) });
  } catch (err) { next(err); }
});

app.post("/api/records", async (req, res, next) => {
  try {
    res.status(201).json({ success: true, data: await appendRecord(parse(recordSchema, req.body)) });
  } catch (err) { next(err); }
});

app.get("/api/records", async (_req, res, next) => {
  try {
    res.json({ success: true, data: await listRecords() });
  } catch (err) { next(err); }
});

app.use((err, _req, res, _next) => {
  const requestId = randomUUID();
  console.error(`[${requestId}]`, err);
  res.status(err.status || 500).json({
    success: false,
    error: err.status === 400 ? err.message : "Internal server error",
    requestId,
    ...(err.details ? { details: err.details } : {})
  });
});

export default app;
