// Testes de spec da feature proxy-reverso-api-segura
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import edgeHandler from '../api/[...path].js';
import { api } from '../src/lib/axios.ts';

const ROOT_DIR = path.resolve('.');

function readFile(filePath) {
  return fs.readFileSync(path.join(ROOT_DIR, filePath), 'utf8');
}

// US-063 — Proxy Reverso Seguro na Vercel com Ocultação de Endereço da API
test('AC-284: Edge proxy handler encaminha métodos, headers e monta URL target correta via process.env.BACKEND_URL @spec:AC-284', async () => {
  const originalEnv = process.env.BACKEND_URL;
  const originalFetch = globalThis.fetch;

  try {
    process.env.BACKEND_URL = 'https://api-financeiro.example.com';

    let capturedTargetUrl = '';
    let capturedOptions = null;

    globalThis.fetch = async (url, options) => {
      capturedTargetUrl = url.toString();
      capturedOptions = options;
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    // Cenário 1: POST /api/auth/login com body e headers de autenticação
    const request = new Request('https://meu-front.vercel.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-teste',
        'x-wallet-id': 'carteira-123',
        Host: 'meu-front.vercel.app',
      },
      body: JSON.stringify({ email: 'teste@example.com', password: '123' }),
    });

    const response = await edgeHandler(request);
    assert.equal(response.status, 200);

    const json = await response.json();
    assert.equal(json.success, true);

    // Valida que o target gerado preservou a rota e protocolo correto
    assert.equal(capturedTargetUrl, 'https://api-financeiro.example.com/api/auth/login');
    assert.equal(capturedOptions.method, 'POST');
    assert.equal(capturedOptions.headers.get('authorization'), 'Bearer token-teste');
    assert.equal(capturedOptions.headers.get('x-wallet-id'), 'carteira-123');
    assert.equal(capturedOptions.headers.get('host'), null, 'Header Host do front deve ser removido');

    // Cenário 2: Erro 500 caso BACKEND_URL não esteja definida
    delete process.env.BACKEND_URL;
    const failedResponse = await edgeHandler(request);
    assert.equal(failedResponse.status, 500);
    const failedJson = await failedResponse.json();
    assert.ok(failedJson.error.includes('BACKEND_URL'));
  } finally {
    process.env.BACKEND_URL = originalEnv;
    globalThis.fetch = originalFetch;
  }
});

test('AC-285: Roteamento no vercel.json sem placeholders e com regra SPA preservada @spec:AC-285', () => {
  const vercelConfig = JSON.parse(readFile('vercel.json'));

  assert.ok(Array.isArray(vercelConfig.rewrites), 'vercel.json deve conter chave rewrites');
  assert.equal(
    vercelConfig.rewrites.some((r) => r.destination && r.destination.includes('BACKEND_URL_PLACEHOLDER')),
    false,
    'vercel.json não deve conter nenhum placeholder'
  );

  const spaRewrite = vercelConfig.rewrites.find((r) => r.source === '/(.*)');
  assert.ok(spaRewrite, 'Regra de fallback SPA /(.*) deve existir');
  assert.equal(spaRewrite.destination, '/', 'Fallback do SPA deve apontar para /');
});

test('AC-286: Axios configurado com baseURL defensiva sem vazar URLs externas @spec:AC-286', () => {
  const axiosSource = readFile('src/lib/axios.ts');

  // Garante que não há URLs ou placeholders hardcoded
  assert.equal(axiosSource.includes('BACKEND_URL_PLACEHOLDER'), false);
  assert.ok(
    axiosSource.includes("baseURL: isDev ? 'http://localhost:3000/api' : '/api'"),
    'axios deve apontar para rota relativa /api em produção'
  );
  assert.ok(
    axiosSource.includes('Boolean(import.meta.env?.DEV)'),
    'axios deve ter proteção defensiva contra execução fora do Vite'
  );

  // Instância do Axios importada funciona sem erro
  assert.ok(api.defaults.baseURL === '/api' || api.defaults.baseURL === 'http://localhost:3000/api');
});

test('AC-287: Ausência de script prebuild mutador no package.json @spec:AC-287', () => {
  const pkg = JSON.parse(readFile('package.json'));

  assert.equal(
    pkg.scripts?.prebuild,
    undefined,
    'Script prebuild legado deve ser removido para evitar interferências'
  );
  assert.ok(pkg.scripts?.build, 'Script build deve existir');
});

