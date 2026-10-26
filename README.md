# FinPilot AI — One-Click GitHub → Vercel

[![Demo Video](https://img.shields.io/badge/Demo_Video-Google_Drive-FF5722?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/drive/folders/1OQvqGT6N4lQDqZLVTk_-v6Sx3po2dtxD?usp=sharing)
[![Project Documentation](https://img.shields.io/badge/Project_Document-Google_Drive-4285F4?style=for-the-badge&logo=googledocs&logoColor=white)](https://drive.google.com/drive/folders/1OQvqGT6N4lQDqZLVTk_-v6Sx3po2dtxD?usp=sharing)

This repository is prepared as a single Vercel project containing:
- `public/index.html` — responsive FinPilot frontend
- `api/index.js` — Express API entrypoint deployed as a Vercel Function
- `src/services/*` — Claude and Google Sheets integration
- `src/validation.js` — request contracts
- `vercel.json` — frontend/API routing
- `.env.example` — required secrets template

## Deploy from GitHub

1. Push this folder to a new GitHub repository.
2. In Vercel, choose **Add New Project → Import Git Repository**.
3. Select the repository and deploy.
4. In **Project → Settings → Environment Variables**, add:
   - `ANTHROPIC_API_KEY`
   - `ANTHROPIC_MODEL`
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SHEET_RANGE`
   - `FRONTEND_ORIGIN` (set to your Vercel production URL after the first deployment)
5. Redeploy after changing variables.

Vercel supports Git-connected deployments and environment variables scoped to Production/Preview/Development. Keep all secrets in Vercel rather than Git. 

## Google Sheets

Create a `Records` tab with:

`timestamp | requestId | module | income | loanAmount | age | creditScore | employment | existingEmi | resultJson | goal`

Share the spreadsheet with the Google service-account email as Editor.

## Local

```bash
npm install
npm i -g vercel
vercel login
vercel dev
```

Open the local URL Vercel prints.

## API

- `GET /api/health`
- `POST /api/loan/eligibility`
- `POST /api/credit/analyze`
- `POST /api/emi/calculate`
- `POST /api/ai/tips`
- `POST /api/records`
- `GET /api/records`

## Security

- No API key is shipped to the browser.
- `.env` is ignored by Git.
- Rate limiting, Helmet, CORS, JSON size limits and Zod validation are enabled.
- Do not store bank passwords, card numbers, CVVs, OTPs or other unnecessary credentials.
- Financial outputs are estimates/education, not lending decisions.

## Important Vercel note

Vercel can deploy Node/Express backends as server-side Functions, so the frontend and API can share one HTTPS origin. 
