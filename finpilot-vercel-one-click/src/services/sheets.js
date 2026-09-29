import { google } from "googleapis";
import { randomUUID } from "node:crypto";
import { config } from "../config.js";

let sheetsClient;

function getSheetsClient() {
  if (!config.sheetId || !config.serviceAccountEmail || !config.privateKey) {
    throw new Error("Google Sheets integration is not configured.");
  }

  if (!sheetsClient) {
    const auth = new google.auth.JWT({
      email: config.serviceAccountEmail,
      key: config.privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    sheetsClient = google.sheets({ version: "v4", auth });
  }

  return sheetsClient;
}

function safeJson(value) {
  return JSON.stringify(value ?? {}).slice(0, 10000);
}

export async function appendRecord({ module, data, result, goal }) {
  const sheets = getSheetsClient();
  const requestId = randomUUID();

  const row = [
    new Date().toISOString(),
    requestId,
    module,
    data.income ?? "",
    data.loanAmount ?? "",
    data.age ?? "",
    data.creditScore ?? "",
    data.employment ?? "",
    data.existingEmi ?? "",
    safeJson(result),
    goal ?? ""
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.sheetId,
    range: config.sheetRange,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] }
  });

  return { requestId };
}

export async function listRecords() {
  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.sheetId,
    range: config.sheetRange
  });

  return response.data.values ?? [];
}
