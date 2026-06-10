import { chromium } from 'playwright';
import { callClaude } from './claude.js';
import { executeAction } from './actions.js';

const VIEWPORT = { width: 1280, height: 800 };
const MAX_STEPS = 50;

export async function run(task, startUrl) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  await page.goto(startUrl);
  console.log(`\n🚀 任務：${task}`);
  console.log(`📍 網址：${startUrl}\n`);

  const messages = [];
  let step = 0;

  const screenshot = await takeScreenshot(page);
  messages.push({
    role: 'user',
    content: [
      { type: 'text', text: task },
      screenshot,
    ],
  });

  while (step < MAX_STEPS) {
    step++;
    console.log(`\n--- Step ${step} ---`);

    const response = await callClaude(messages, VIEWPORT);

    if (response.stop_reason === 'end_turn') {
      const text = response.content.find((b) => b.type === 'text')?.text ?? '任務結束';
      console.log(`\n✅ ${text}`);
      break;
    }

    messages.push({ role: 'assistant', content: response.content });

    const toolResults = [];
    for (const block of response.content) {
      if (block.type === 'text') {
        console.log(`Claude: ${block.text}`);
      } else if (block.type === 'tool_use' && block.name === 'computer') {
        await executeAction(page, block.input);
        const newScreenshot = await takeScreenshot(page);
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: [newScreenshot],
        });
      }
    }

    if (toolResults.length > 0) {
      messages.push({ role: 'user', content: toolResults });
    }
  }

  if (step >= MAX_STEPS) {
    console.log(`\n⚠️  已達最大步數 (${MAX_STEPS})，停止`);
  }

  await browser.close();
}

async function takeScreenshot(page) {
  const buf = await page.screenshot({ type: 'png' });
  return {
    type: 'image',
    source: {
      type: 'base64',
      media_type: 'image/png',
      data: buf.toString('base64'),
    },
  };
}
