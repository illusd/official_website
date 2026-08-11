export default async function handler(req, res) {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send('缺少 code 參數');
  }

  try {
    // 1. 用 code 換 access_token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Token error:', tokenData);
      return res.redirect(302, 'https://org.illusd.com/?error=auth_failed');
    }

    const accessToken = tokenData.access_token;

    // 2. 用 token 取得 Github 使用者資料
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    const user = await userResponse.json();
    const githubUsername = user.login;

    if (!githubUsername) {
      return res.redirect(302, 'https://org.illusd.com/?error=no_username');
    }

    // 3. 導回首頁，並帶上 github 帳號
    res.redirect(302, `https://org.illusd.com/?github=${encodeURIComponent(githubUsername)}`);
  } catch (error) {
    console.error('OAuth error:', error);
    res.redirect(302, 'https://org.illusd.com/?error=server_error');
  }
}
