import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const knowledgePath = path.join(__dirname, '..', 'data', 'jbot-knowledge.json');
const unansweredPath = path.join(__dirname, '..', 'data', 'unanswered.jsonl');
const MAX_MESSAGE = parseInt(process.env.JBOT_MAX_MESSAGE_LENGTH || '2000');
const RATE_MAX = parseInt(process.env.RATE_LIMIT_MAX || '30');
const RATE_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000');

const rateMap = new Map();

function loadKnowledge() {
  try {
    const data = fs.readFileSync(knowledgePath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

function isRateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const entry = rateMap.get(ip) || { count: 0, reset: now + RATE_WINDOW };
  if (now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  rateMap.set(ip, entry);
  return entry.count > RATE_MAX;
}

function normalize(q) {
  return q.toLowerCase().trim();
}

function findAnswer(q, kb) {
  if (!kb) return null;
  const nq = normalize(q);
  if (nq.includes('who are you') || nq.includes('what is j bot') || nq.includes('jbot')) {
    return I'm J Bot, Jeyaseelan's AI assistant. I can answer questions about his background, education, skills, projects, achievements, and contact info.;
  }
  if (nq.includes('name') || nq.includes('jeyaseelan')) {
    return Jeyaseelan is a Computer Science Engineering student at Anna University-affiliated college in Tirunelveli, Tamil Nadu. CGPA: , 2023-2027.;
  }
  if (nq.includes('skill') || nq.includes('tech') || nq.includes('language')) {
    const skills = kb.skills.programming.concat(kb.skills.frameworks).concat(kb.skills.aiMl).slice(0, 15).join(', ');
    return Technical skills include: .;
  }
  if (nq.includes('project') || nq.includes('crux') || nq.includes('ecobridge') || nq.includes('retail') || nq.includes('theatre')) {
    const list = kb.projects.map(p => ${p.name} (, ): ).join('; ');
    return Projects: ;
  }
  if (nq.includes('contact') || nq.includes('email') || nq.includes('phone')) {
    return Contact: , , .;
  }
  if (nq.includes('education') || nq.includes('college') || nq.includes('cgpa') || nq.includes('hsc') || nq.includes('12th')) {
    return Education: B.E. CSE at Anna University-affiliated college, Tirunelveli (2023-2027), CGPA . HSC:  in .;
  }
  if (nq.includes('achievement') || nq.includes('hackathon') || nq.includes('award') || nq.includes('certificate')) {
    return Achievements include: .;
  }
  if (nq.includes('internship')) {
    return Open to internships and full-time roles in creative development, full-stack engineering, and AI/ML. Email: .;
  }
  return null;
}

function logUnanswered(question, reason = 'not_found') {
  try {
    const entry = {
      id: Date.now().toString() + '-' + Math.random().toString(36).slice(2, 8),
      timestamp: new Date().toISOString(),
      question,
      normalized: normalize(question),
      category: 'portfolio',
      resolutionStatus: 'unanswered',
      reason,
      aiProvider: null,
      responseSummary: null,
      reviewed: false
    };
    fs.appendFileSync(unansweredPath, JSON.stringify(entry) + '\n');
  } catch (e) {
    // ignore
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }
  if (message.trim().length === 0) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }
  if (message.length > MAX_MESSAGE) {
    return res.status(400).json({ error: 'Message too long' });
  }

  const kb = loadKnowledge();
  const answer = findAnswer(message, kb);
  if (answer) {
    return res.status(200).json({ answer, source: 'knowledge', provider: 'local' });
  }

  // Try free providers with fallback
  const providers = [];
  if (process.env.GEMINI_API_KEY) providers.push('gemini');
  if (process.env.GROQ_API_KEY) providers.push('groq');
  if (process.env.HUGGINGFACE_API_KEY) providers.push('huggingface');
  const primary = process.env.PRIMARY_PROVIDER || providers[0] || 'gemini';
  const order = [primary, ...providers.filter(p => p !== primary)];

  for (const provider of order) {
    try {
      const resp = await callProvider(provider, message, kb);
      if (resp && resp.answer) {
        return res.status(200).json({ answer: resp.answer, source: 'ai', provider });
      }
    } catch (e) {
      // try next
      continue;
    }
  }

  logUnanswered(message, 'all_providers_failed');
  return res.status(200).json({
    answer: "I don't have enough verified info about that in my knowledge base yet. I've logged your question so it can be reviewed and added.",
    source: 'fallback',
    provider: null
  });
}

async function callProvider(provider, message, kb) {
  const context = You are J Bot, a portfolio assistant for S Jeyaseelan. Answer based on verified info: name S Jeyaseelan, Computer Science Engineering student (2023-2027) at Anna University-affiliated college in Tirunelveli, CGPA 8.16, HSC 86%, skills include Python/Java/C/JS/React/Node/AI/ML, projects: Retail Pro, CRUX, EcoBridge, Theatre, Virtual Resume. Contact: jeyaseelan26206@gmail.com, +91 9042201784. Be concise and honest; if not in verified info, say so briefly.;
  if (provider === 'gemini') {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('no key');
    const url = https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=;
    const body = { contents: [{ parts: [{ text: context + '\n\nQ: ' + message + '\nA:' }] }] };
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error('gemini fail');
    const j = await r.json();
    const text = j.candidates?.[0]?.content?.parts?.[0]?.text;
    return { answer: text?.trim() };
  } else if (provider === 'groq') {
    const key = process.env.GROQ_API_KEY;
    if (!key) throw new Error('no key');
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const body = {
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: context },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 300
    };
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': Bearer  }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error('groq fail');
    const j = await r.json();
    const text = j.choices?.[0]?.message?.content;
    return { answer: text?.trim() };
  } else if (provider === 'huggingface') {
    const key = process.env.HUGGINGFACE_API_KEY;
    if (!key) throw new Error('no key');
    const url = 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta';
    const body = { inputs: context + '\n\nQ: ' + message + '\nA:', parameters: { max_new_tokens: 250, temperature: 0.7 } };
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': Bearer  }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error('hf fail');
    const j = await r.json();
    const text = Array.isArray(j) ? j[0]?.generated_text : j.generated_text;
    return { answer: text?.trim() };
  }
  throw new Error('unknown');
}
