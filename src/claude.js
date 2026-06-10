import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function callClaude(messages, viewport) {
  return await client.beta.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    tools: [
      {
        type: 'computer_20241022',
        name: 'computer',
        display_width_px: viewport.width,
        display_height_px: viewport.height,
      },
    ],
    messages,
    betas: ['computer-use-2024-10-22'],
  });
}
