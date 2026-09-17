export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return new Response(
      JSON.stringify({ error: 'BACKEND_URL não configurada no ambiente da Vercel.' }),
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

  return fetch(targetUrl, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    duplex: 'half',
  });
}

