# J Bot Setup & Usage Guide

## Overview
J Bot is integrated into your portfolio as an independent, modular component. It provides answers based on your verified portfolio data, with AI provider fallback and automatic collection of unanswered questions.

## Files Added
- pi/chat.js - Secure serverless endpoint (never exposes API keys)
- pi/export-unanswered.js - Authenticated export to Excel
- public/jbot.css, public/jbot.js - Frontend widget (floating bottom-right)
- data/jbot-knowledge.json - Verified portfolio knowledge base
- data/J_Bot_Unanswered_Questions.xlsx - Generated on export (local only, not committed)
- data/unanswered.jsonl - Runtime log of unanswered questions (local only)
- .env.example - Environment variable template
- package.json, ercel.json - Dependencies and deployment config

## Local Development

1. Copy .env.example to .env:
   `ash
   cp .env.example .env  # or copy in Windows
   `

2. Fill in API keys (use free tiers):
   - GEMINI_API_KEY - Google AI Studio (free tier)
   - GROQ_API_KEY - Groq Cloud (free tier) 
   - HUGGINGFACE_API_KEY - Hugging Face (free tier)
   - ADMIN_TOKEN - Strong random string for export auth
   - PRIMARY_PROVIDER - Preferred: gemini/groq/huggingface

3. Install dependencies:
   `ash
   npm install
   `

4. Run with Vercel dev:
   `ash
   npm run dev
   `

Visit http://localhost:3000 - J Bot appears bottom-right.

## Vercel Deployment

1. Push to GitHub (current branch: jbot-integration)
2. Import project in Vercel, connect repo
3. Add environment variables in Vercel Project Settings > Environment Variables:
   - Same as .env (all keys)
4. Deploy - API routes at /api/* work automatically

## Unanswered Questions Export

Unanswered questions save to data/unanswered.jsonl and can be exported to Excel.

**Local:**
`ash
node -e "
const handler = (await import('./api/export-unanswered.js')).default;
const req = {method:'GET', query:{token:process.env.ADMIN_TOKEN}};
const res = {status(c){this._c=c; return this;}, json(o){console.log(o);}};
handler(req,res);
" 
`

**Production (authenticated):**
`
https://your-domain.vercel.app/api/export-unanswered?token=YOUR_ADMIN_TOKEN
`

This generates data/J_Bot_Unanswered_Questions.xlsx with sheets: "Unanswered Questions" (with filters, frozen header) and "Summary".

**Note:** Serverless filesystem is ephemeral - download the Excel file locally after export. The JSONL is runtime-only in production.

## Security Notes
- API keys never sent to client
- .env and generated Excel/JSONL are gitignored
- Admin export requires token
- Rate limiting (30 req/min per IP by default)
- Input validation and length limits

## Privacy
When J Bot cannot answer confidently using verified portfolio data, questions are logged (question, timestamp, reason, category). No IPs or identifying visitor data stored beyond rate limiting. Review logs periodically via export.

## Testing Checklist
- Profile/skills/projects/contact questions (answered from knowledge)
- Questions outside portfolio ? AI fallback or logged as unanswered
- Provider fallback works if primary fails
- Dark/light theme toggle persists
- Mobile responsive
- Existing portfolio features unchanged
