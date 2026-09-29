import "dotenv/config";

const required = [
  "ANTHROPIC_API_KEY",
  "GOOGLE_SHEET_ID",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_PRIVATE_KEY"
];

for (const name of required) {
  if (!process.env[name]) {
    console.warn(`[config] Missing ${name}. Related integration will be unavailable.`);
  }
}

export const config = {
  port: Number(process.env.PORT || 3000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5500",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  anthropicModel: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
  sheetId: process.env.GOOGLE_SHEET_ID,
  serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  sheetRange: process.env.GOOGLE_SHEET_RANGE || "Records!A:K",
  maxTipsLength: Number(process.env.MAX_TIPS_LENGTH || 2000)
};
