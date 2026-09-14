// Testes de spec da feature auth — gerados por onp-spec scaffold
import { test } from 'node:test';
import assert from 'node:assert/strict';

// US-001 — Acesso ao sistema (Login)
test('AC-001: Login com sucesso @spec:AC-001', () => {
  // Dado: que o usuário está na tela de login
  // Quando: preenche um e-mail válido e a senha correta, e clica em "Entrar"
  // Então: o sistema salva o token na sessão e redireciona o usuário para a aplicação
  assert.fail('critério de aceite AC-001 ainda não provado — implemente este teste');
});

// US-001 — Acesso ao sistema (Login)
test('AC-002: Credenciais inválidas @spec:AC-002', () => {
  // Dado: que o usuário está na tela de login
  // Quando: preenche e-mail ou senha incorretos e tenta entrar
  // Então: o sistema exibe uma mensagem de erro ("Credenciais inválidas") e não faz o login
  assert.fail('critério de aceite AC-002 ainda não provado — implemente este teste');
});

// US-001 — Acesso ao sistema (Login)
test('AC-003: Limite de tentativas excedido (Rate limit) @spec:AC-003', async () => {
  const { authService, AuthError } = await import('../src/services/auth.service.ts');
  const { api } = await import('../src/lib/axios.ts');

  const originalPost = api.post;
  api.post = async () => {
    const error = new Error('Too many requests');
    error.response = {
      status: 429,
      data: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
    };
    throw error;
  };

  try {
    await authService.login({ email: 'bloqueado@email.com', password: 'wrong-password' });
    assert.fail('Deveria ter lançado erro 429');
  } catch (err) {
    assert.ok(err instanceof AuthError);
    assert.equal(err.status, 429);
    assert.equal(err.isRateLimit, true);
    assert.match(err.message, /15 minutos/);
  } finally {
    api.post = originalPost;
  }
});

// US-002 — Registro de novo usuário
test('AC-004: Senha forte @spec:AC-004', () => {
  // Dado: que o usuário está preenchendo o formulário de registro
  // Quando: digita uma senha que não atende aos requisitos (mínimo de 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial)
  // Então: a interface exibe mensagens claras de validação indicando quais requisitos faltam
  assert.fail('critério de aceite AC-004 ainda não provado — implemente este teste');
});

// US-002 — Registro de novo usuário
test('AC-005: Registro com sucesso e auto-login @spec:AC-005', async () => {
  const { authService } = await import('../src/services/auth.service.ts');
  const { api } = await import('../src/lib/axios.ts');
  const { useAuthStore } = await import('../src/stores/auth.store.ts');

  const calls = [];
  const originalPost = api.post;
  api.post = async (url, data) => {
    calls.push({ url, data });
    if (url === '/auth/register') {
      return {
        status: 201,
        data: {
          message: 'Usuário criado com sucesso!',
          user: { id: 'uuid-123', name: data.name, email: data.email },
        },
      };
    }
    if (url === '/auth/login') {
      return {
        status: 200,
        data: {
          message: 'Login realizado com sucesso!',
          userInfo: {
            token: 'jwt-token-autologin',
            id: 'uuid-123',
            name: data.email.split('@')[0],
            email: data.email,
          },
        },
      };
    }
    throw new Error(`Unhandled url: ${url}`);
  };

  try {
    const result = await authService.registerAndLogin({
      name: 'João Silva',
      email: 'joao@email.com',
      password: 'Senha@Forte123',
    });

    assert.equal(calls.length, 2);
    assert.equal(calls[0].url, '/auth/register');
    assert.equal(calls[1].url, '/auth/login');
    assert.equal(result.userInfo.token, 'jwt-token-autologin');
    assert.equal(useAuthStore.getState().isAuthenticated, true);
    assert.equal(useAuthStore.getState().token, 'jwt-token-autologin');
  } finally {
    api.post = originalPost;
  }
});

// US-002 — Registro de novo usuário
test('AC-006: E-mail já em uso @spec:AC-006', async () => {
  const { authService, AuthError } = await import('../src/services/auth.service.ts');
  const { api } = await import('../src/lib/axios.ts');

  const originalPost = api.post;
  api.post = async () => {
    const error = new Error('Email já cadastrado');
    error.response = {
      status: 400,
      data: { message: 'Email já cadastrado' },
    };
    throw error;
  };

  try {
    await authService.register({
      name: 'João Silva',
      email: 'joao@email.com',
      password: 'Senha@Forte123',
    });
    assert.fail('Deveria ter lançado erro de e-mail já cadastrado');
  } catch (err) {
    assert.ok(err instanceof AuthError);
    assert.equal(err.status, 400);
    assert.equal(err.isEmailInUse, true);
    assert.match(err.message, /Email já cadastrado/i);
  } finally {
    api.post = originalPost;
  }
});

// US-003 — Proteção de rotas e Gestão de Sessão
test('AC-007: Redirecionamento de não autenticados @spec:AC-007', () => {
  // Dado: que um usuário não tem um token ativo e persistido no `localStorage`
  // Quando: tenta acessar uma rota protegida (ex: `/dashboard`)
  // Então: ele é interceptado e redirecionado para a página `/login`
  assert.fail('critério de aceite AC-007 ainda não provado — implemente este teste');
});

// US-003 — Proteção de rotas e Gestão de Sessão
test('AC-008: Sessão expirada @spec:AC-008', async () => {
  // Dado: que o usuário logado deixou o sistema aberto e o token expirou (passou de 1 dia)
  const localStorageMock = {
    data: {},
    getItem(k) { return this.data[k] ?? null; },
    setItem(k, v) { this.data[k] = String(v); },
    removeItem(k) { delete this.data[k]; },
    clear() { this.data = {}; },
  };
  globalThis.localStorage = localStorageMock;
  globalThis.window = {
    location: { pathname: '/dashboard', href: '/dashboard' },
    localStorage: localStorageMock,
  };

  const { useAuthStore } = await import('../src/stores/auth.store.ts');
  const { api } = await import('../src/lib/axios.ts');

  useAuthStore.getState().setAuth({ id: 'user-1', name: 'João', email: 'joao@email.com' }, 'token-expirado');
  localStorageMock.setItem('auth_token', 'token-expirado');
  localStorageMock.setItem('active_wallet_id', 'wallet-123');

  assert.equal(useAuthStore.getState().isAuthenticated, true);
  assert.equal(localStorageMock.getItem('auth_token'), 'token-expirado');

  // Quando: o sistema tentar fazer qualquer requisição que retorne erro 401 (Não Autorizado)
  try {
    const errorHandler = api.interceptors.response.handlers[0].rejected;
    await errorHandler({ response: { status: 401 } });
  } catch (err) {
    assert.equal(err?.response?.status, 401);
  }

  // Então: a sessão do usuário é limpa do Zustand e `localStorage` e ele é redirecionado para `/login` informando que a sessão expirou
  assert.equal(useAuthStore.getState().isAuthenticated, false);
  assert.equal(useAuthStore.getState().token, null);
  assert.equal(useAuthStore.getState().isSessionExpired, true);
  assert.equal(localStorageMock.getItem('auth_token'), null);
  assert.equal(globalThis.window.location.href, '/login?expired=true');
});

// US-003 — Proteção de rotas e Gestão de Sessão
test('AC-009: Redirecionamento de logados da tela de login @spec:AC-009', () => {
  // Dado: que o usuário já está logado e possui token válido
  // Quando: acessa manualmente rotas como `/login` ou `/register`
  // Então: o sistema o redireciona automaticamente de volta para o `/dashboard`
  assert.fail('critério de aceite AC-009 ainda não provado — implemente este teste');
});

// US-003 — Proteção de rotas e Gestão de Sessão
test('AC-010: Acesso à página de recuperação @spec:AC-010', () => {
  // Dado: que o usuário clica em "Esqueci minha senha"
  // Quando: a rota `/forgot-password` é acessada
  // Então: ele visualiza uma página marcadora (placeholder) indicando que a funcionalidade estará disponível em breve
  assert.fail('critério de aceite AC-010 ainda não provado — implemente este teste');
});

// US-003 — Proteção de rotas e Gestão de Sessão
test('AC-011: Validação do placeholder @spec:AC-011', () => {
  // Dado: que o usuário está no placeholder de recuperação de senha
  // Quando: tenta submeter um e-mail com formato inválido
  // Então: a interface deve exibir erro de validação de formulário
  assert.fail('critério de aceite AC-011 ainda não provado — implemente este teste');
});

// US-003 — Proteção de rotas e Gestão de Sessão
test('AC-012: Ação de Sair (Logout) @spec:AC-012', () => {
  // Dado: que o usuário está logado e usando o sistema
  // Quando: clica na opção de "Sair" / "Logout" na interface
  // Então: os dados do usuário e o token são removidos do Zustand e do armazenamento local, e ele é levado para a tela de login
  assert.fail('critério de aceite AC-012 ainda não provado — implemente este teste');
});
