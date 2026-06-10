import 'dotenv/config';
import { run } from './loop.js';

const task = process.argv[2];
const url = process.argv[3] ?? 'https://www.google.com';

if (!task) {
  console.error('用法: npm start "<任務描述>" "<網址>"');
  console.error('例如: npm start "搜尋 Anthropic 官網" "https://www.google.com"');
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('請設定 ANTHROPIC_API_KEY（複製 .env.example 成 .env）');
  process.exit(1);
}

await run(task, url);
