import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unansweredPath = path.join(__dirname, '..', 'data', 'unanswered.jsonl');
const outPath = path.join(__dirname, '..', 'data', 'J_Bot_Unanswered_Questions.xlsx');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const token = req.query.token || req.headers['x-admin-token'];
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (!fs.existsSync(unansweredPath)) {
      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet([]);
      xlsx.utils.book_append_sheet(wb, ws, 'Unanswered Questions');
      xlsx.writeFile(wb, outPath);
      return res.status(200).json({ message: 'No unanswered questions found', file: 'J_Bot_Unanswered_Questions.xlsx', count: 0 });
    }
    const lines = fs.readFileSync(unansweredPath, 'utf8').split('\n').filter(l => l.trim());
    const records = lines.map(l => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    }).filter(Boolean);

    const summary = records.reduce((acc, r) => {
      acc[r.category || 'unknown'] = (acc[r.category || 'unknown'] || 0) + 1;
      return acc;
    }, {});

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(records);
    xlsx.utils.book_append_sheet(wb, ws, 'Unanswered Questions');
    const ws2 = xlsx.utils.json_to_sheet(Object.entries(summary).map(([k,v]) => ({ category: k, count: v })));
    xlsx.utils.book_append_sheet(wb, ws2, 'Summary');
    xlsx.writeFile(wb, outPath);
    return res.status(200).json({ message: 'Exported', file: 'J_Bot_Unanswered_Questions.xlsx', count: records.length });
  } catch (e) {
    return res.status(500).json({ error: 'Export failed' });
  }
}
