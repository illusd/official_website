export default async function handler(req, res) {
  const WEBHOOK = process.env.DISCORD_WEBHOOK || 'https://discord.com/api/webhooks/1536718647987544175/5w42paHscDa4l7yIJ5ga51vkYkGFNF3g_hhJUs8BLpP6sxwLjwZdmIfZLZxRo6NKLWpk';

  const now = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

  const content = `定時訊息測試\n目前時間：${now}\n發送成功 ✅`;

  try {
    await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    res.status(200).json({ success: true, time: now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}
