/**
 * Docker Proxy Server - 极致美化 UI 版 (由 gemini为 zack 输出的js代码)
 */

// 1. IP 白名单
const WHITE_LIST_IPS = [
  'ipv4',
  'ipv6', 
  '127.0.0.1'
];

const upstream = 'https://registry-1.docker.io';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const clientIP = request.headers.get('CF-Connecting-IP');
    const userAgent = request.headers.get('User-Agent') || '';
    const accept = request.headers.get('Accept') || '';

    // --- 逻辑判断 ---
    const isApiRequest = url.pathname !== '/';
    
    // API 请求鉴权
    if (isApiRequest && !WHITE_LIST_IPS.includes(clientIP) && !url.pathname.includes('/token')) {
        return new Response(`Forbidden: IP ${clientIP} not in whitelist`, { status: 403 });
    }

    // 浏览器访问根目录：返回极致美化页面
    if (url.pathname === '/' && accept.includes('text/html') && !userAgent.includes('docker')) {
      return new Response(renderAdvancedHTML(url.hostname, clientIP), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    }

    // --- Docker 核心转发逻辑 (保持不变) ---
    if (url.pathname === '/token' || url.pathname === '/v2/auth') {
      const authUrl = new URL('https://auth.docker.io' + url.pathname + url.search);
      return fetch(new Request(authUrl, { headers: request.headers }));
    }

    let pathname = url.pathname;
    if (pathname.includes('/v2/') && pathname.split('/').length === 3) {
      pathname = pathname.replace('/v2/', '/v2/library/');
    }

    const targetUrl = new URL(upstream + pathname + url.search);
    const newHeaders = new Headers(request.headers);
    newHeaders.set('Host', 'registry-1.docker.io');
    const newRequest = new Request(targetUrl, { method: request.method, headers: newHeaders, body: request.body, redirect: 'follow' });

    let response = await fetch(newRequest);
    if (response.status === 401) {
      const authHeader = response.headers.get('Www-Authenticate');
      if (authHeader) {
        const newAuthHeader = authHeader.replace('https://auth.docker.io/token', `https://${url.hostname}/token`);
        const modifiedResponse = new Response(response.body, response);
        modifiedResponse.headers.set('Www-Authenticate', newAuthHeader);
        return modifiedResponse;
      }
    }
    return response;
  }
};

/**
 * 深度还原 UI 模板
 */
function renderAdvancedHTML(domain, ip) {
  const isAllowed = WHITE_LIST_IPS.includes(ip);
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Docker Hub Proxy | Mirror</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
      body { background-color: #0d1117; color: #c9d1d9; }
      .glass { background: rgba(22, 27, 34, 0.8); backdrop-filter: blur(10px); border: 1px solid #30363d; }
      .code-box { background: #161b22; border: 1px solid #30363d; }
      .status-ok { color: #3fb950; }
      .status-no { color: #f85149; }
    </style>
  </head>
  <body class="min-h-screen">
    <!-- Navbar -->
    <nav class="glass sticky top-0 z-50 px-6 py-3 flex justify-between items-center border-b border-gray-800">
      <div class="flex items-center space-x-2">
        <i class="fab fa-docker text-3xl text-blue-500"></i>
        <span class="text-xl font-bold text-white">Docker 镜像地址</span>
      </div>
      <div class="hidden md:flex space-x-6 text-sm">
        <a href="#setup" class="hover:text-blue-400 transition">配置文档</a>
        <a href="#verify" class="hover:text-blue-400 transition">身份验证</a>
        <a href="https://github.com" class="hover:text-blue-400 transition"><i class="fab fa-github"></i> GitHub</a>
      </div>
    </nav>

    <main class="container mx-auto px-4 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-4">镜像加速中转站</h1>
        <p class="text-gray-400 text-lg">加速您的 Docker Hub 访问速度，从此不再等待下载进度条。</p>
        
        <div class="mt-8 inline-flex items-center px-4 py-2 rounded-full glass text-sm">
          <span class="flex w-3 h-3 me-3 ${isAllowed ? 'bg-green-500' : 'bg-red-500'} rounded-full"></span>
          当前访问 IP: <span class="mx-2 font-mono text-blue-400">${ip}</span> 
          <span class="font-bold ml-1 ${isAllowed ? 'status-ok' : 'status-no'}">${isAllowed ? '[已授权]' : '[未授权]'}</span>
        </div>
      </div>

      <!-- Config Cards -->
      <div id="setup" class="grid md:grid-cols-2 gap-8">
        <div class="glass p-8 rounded-2xl">
          <h2 class="text-2xl font-bold text-white mb-4"><i class="fas fa-terminal mr-2"></i> 快速开始</h2>
          <p class="text-sm text-gray-400 mb-4">无需配置，直接在镜像名称前添加代理前缀：</p>
          <div class="code-box p-4 rounded-lg relative group">
            <code class="text-blue-300">docker pull ${domain}/library/nginx:latest</code>
          </div>
        </div>

        <div class="glass p-8 rounded-2xl">
          <h2 class="text-2xl font-bold text-white mb-4"><i class="fas fa-tools mr-2"></i> 永久设置</h2>
          <p class="text-sm text-gray-400 mb-4">编辑 <code>/etc/docker/daemon.json</code> 添加：</p>
          <div class="code-box p-4 rounded-lg">
            <pre class="text-sm text-green-400"><code>{
  "registry-mirrors": [
    "https://${domain}"
  ]
}</code></pre>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div id="verify" class="mt-12 glass p-8 rounded-2xl">
        <h2 class="text-2xl font-bold text-white mb-6">🛡️ 安全与白名单</h2>
        <div class="space-y-4 text-gray-300">
          <div class="flex items-start space-x-3">
            <i class="fas fa-check-circle mt-1 text-blue-500"></i>
            <p>本服务通过 Cloudflare Workers 边缘计算实现，仅限授权 IP 访问。</p>
          </div>
          <div class="flex items-start space-x-3">
            <i class="fas fa-check-circle mt-1 text-blue-500"></i>
            <p>非授权 IP 访问镜像 API 将直接返回 <span class="text-red-400">403 Forbidden</span>。</p>
          </div>
          <div class="flex items-start space-x-3">
            <i class="fas fa-info-circle mt-1 text-yellow-500"></i>
            <p>如果您在公司/服务器环境拉取失败，请检查是否已将该环境的公网 IP 提交至白名单列表。</p>
          </div>
        </div>
      </div>
    </main>

    <footer class="text-center py-12 border-t border-gray-800 text-gray-500 text-sm">
      <p>© 2026 Powered by Cloudflare Workers & DigitalPlat Domains</p>
      <p class="mt-2 text-xs">Docker and the Docker logo are trademarks of Docker, Inc.</p>
    </footer>
  </body>
  </html>
  `;
}