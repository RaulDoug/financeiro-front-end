export async function onRequest(context) {
  const { request, env } = context;
  const backendUrl = env?.BACKEND_URL || (typeof process !== 'undefined' ? process.env?.BACKEND_URL : undefined);

  if (!backendUrl) {
    console.error('[Cloudflare Proxy] BACKEND_URL não definida');
    return new Response(
      JSON.stringify({ error: 'BACKEND_URL não configurada no ambiente do Cloudflare Pages.' }),
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

