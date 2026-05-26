export async function handleInstallScript(env) {
  try {
    // 从 KV 或 Assets 中读取 install.sh
    // 如果使用 Workers Assets，文件放在 public/ 目录
    const installScript = await env.ASSETS?.fetch('https://dummy/install.sh');
    
    if (installScript && installScript.ok) {
      const content = await installScript.text();
      return new Response(content, {
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
          'Content-Disposition': 'attachment; filename="install.sh"'
        }
      });
    }
    
    // 如果 Assets 不可用，返回错误
    return new Response('Install script not found. Please check deployment.', { 
      status: 404,
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
    });
  } catch (e) {
    console.error('读取 install.sh 失败:', e);
    return new Response('Internal Server Error', { status: 500 });
  }
}