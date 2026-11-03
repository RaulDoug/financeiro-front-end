export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Se for rota de API, faz o proxy reverso para o backend no Render
    if (url.pathname.startsWith('/api/')) {
      return handleApiProxy(request, env);
    }

    // Para qualquer outro caminho, serve os assets estáticos do front-end
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};

async function handleApiProxy(request, env) {
  const backendUrl = env?.BACKEND_URL || (typeof process !== 'undefined' ? process.env?.BACKEND_URL : undefined);

  if (!backendUrl) {
    return new Response(
      JSON.stringify({ error: 'BACKEND_URL não configurada nas variáveis do Cloudflare Worker.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const url = new URL(request.url);
  const targetPath = url.pathname.replace(/^\/api/, '');
  const base = backendUrl.replace(/\/$/, '').replace(/\/api$/, '');
  const targetUrl = `${base}/api${targetPath}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete('host');

  const hasBody = !['GET', 'HEAD'].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  return fetch(targetUrl, {
    method: request.method,
    headers,
    body,
  });
}

