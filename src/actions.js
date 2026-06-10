export async function executeAction(page, input) {
  const { action, coordinate, text, direction, amount } = input;

  console.log(`  ▶ ${action}`, coordinate ? `(${coordinate[0]}, ${coordinate[1]})` : text ?? '');

  switch (action) {
    case 'screenshot':
      break;
    case 'left_click':
      await page.mouse.click(coordinate[0], coordinate[1]);
      break;
    case 'right_click':
      await page.mouse.click(coordinate[0], coordinate[1], { button: 'right' });
      break;
    case 'double_click':
      await page.mouse.dblclick(coordinate[0], coordinate[1]);
      break;
    case 'mouse_move':
      await page.mouse.move(coordinate[0], coordinate[1]);
      break;
    case 'type':
      await page.keyboard.type(text);
      break;
    case 'key':
      await page.keyboard.press(text);
      break;
    case 'scroll': {
      const delta = (amount ?? 3) * 100;
      const dx = direction === 'right' ? delta : direction === 'left' ? -delta : 0;
      const dy = direction === 'down' ? delta : direction === 'up' ? -delta : 0;
      await page.mouse.move(coordinate[0], coordinate[1]);
      await page.mouse.wheel(dx, dy);
      break;
    }
    default:
      console.log(`  ⚠️  未知 action: ${action}`);
  }

  await page.waitForTimeout(500);
}
