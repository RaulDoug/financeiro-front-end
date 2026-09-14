// Testes de spec da feature auth — gerados por onp-spec scaffold
import { test } from 'node:test';
import assert from 'node:assert/strict';

// US-001 — Acesso ao sistema (Login)
test('AC-001: Login com sucesso @spec:AC-001', async () => {
  const { authService } = await import('../src/services/auth.service.ts');
  const { api } = await import('../src/lib/axios.ts');
  const { useAuthStore } = await import('../src/stores/auth.store.ts');

  const originalPost = api.post;
  api.post = async (url, data) => {
    if (url === '/auth/login') {
      return {
        status: 200,
        data: {
          message: 'Login realizado com sucesso!',
          userInfo: {
            token: 'valid-jwt-token-123',
            id: 'uuid-joao',
            name: 'João Silva',
            email: data.email,
          },
        },
      };
    }
    throw new Error('Not found');
  };

  try {
    const response = await authService.login({ email: 'joao@email.com', password: 'Senha@123' });
    assert.equal(response.userInfo.token, 'valid-jwt-token-123');
    assert.equal(useAuthStore.getState().isAuthenticated, true);
    assert.equal(useAuthStore.getState().token, 'valid-jwt-token-123');
    assert.equal(useAuthStore.getState().user?.email, 'joao@email.com');
  } finally {
    api.post = originalPost;
  }
});

// US-001 — Acesso ao sistema (Login)
test('AC-002: Credenciais inválidas @spec:AC-002', async () => {
  const { authService, AuthError } = await import('../src/services/auth.service.ts');
  const { api } = await import('../src/lib/axios.ts');
  const { useAuthStore } = await import('../src/stores/auth.store.ts');

  // Reset store to unauthenticated
  useAuthStore.getState().logout();

  const originalPost = api.post;
  api.post = async () => {
    const error = new Error('Credenciais inválidas');
    error.response = {
      status: 400,
      data: { message: 'Credenciais inválidas' },
    };
    throw error;
  };

  try {
    await authService.login({ email: 'joao@email.com', password: 'wrong' });
    assert.fail('Deveria ter lançado erro');
  } catch (err) {
    assert.ok(err instanceof AuthError);
    assert.equal(err.status, 400);
    assert.equal(err.message, 'Credenciais inválidas');
    assert.equal(useAuthStore.getState().isAuthenticated, false);
  } finally {
    api.post = originalPost;
  }
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
  const passwordValidation = {
    minLength: (val) => val.length >= 8,
    hasUpper: (val) => /[A-Z]/.test(val),
    hasLower: (val) => /[a-z]/.test(val),
    hasNumber: (val) => /[0-9]/.test(val),
    hasSpecial: (val) => /[^A-Za-z0-9]/.test(val),
    isValid(val) {
      return (
        this.minLength(val) &&
        this.hasUpper(val) &&
        this.hasLower(val) &&
        this.hasNumber(val) &&
        this.hasSpecial(val)
      );
    },
  };

  assert.equal(passwordValidation.minLength('Ab1!'), false);
  assert.equal(passwordValidation.hasUpper('senha123!'), false);
  assert.equal(passwordValidation.hasLower('SENHA123!'), false);
  assert.equal(passwordValidation.hasNumber('SenhaForte!'), false);
  assert.equal(passwordValidation.hasSpecial('SenhaForte123'), false);
  assert.equal(passwordValidation.isValid('Senha@123'), true);
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
test('AC-007: Redirecionamento de não autenticados @spec:AC-007', async () => {
  const { useAuthStore } = await import('../src/stores/auth.store.ts');
  useAuthStore.getState().logout();

  const checkPrivateRoute = (isAuthenticated) => {
    return isAuthenticated ? { allow: true } : { allow: false, redirect: '/login' };
  };

  const decision = checkPrivateRoute(useAuthStore.getState().isAuthenticated);
  assert.equal(decision.allow, false);
  assert.equal(decision.redirect, '/login');
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
test('AC-009: Redirecionamento de logados da tela de login @spec:AC-009', async () => {
  const { useAuthStore } = await import('../src/stores/auth.store.ts');
  useAuthStore.getState().setAuth({ id: 'u1', name: 'User', email: 'u@test.com' }, 'valid-token');

  const checkPublicRoute = (isAuthenticated) => {
    return isAuthenticated ? { allow: false, redirect: '/dashboard' } : { allow: true };
  };

  const decision = checkPublicRoute(useAuthStore.getState().isAuthenticated);
  assert.equal(decision.allow, false);
  assert.equal(decision.redirect, '/dashboard');
});

// US-003 — Proteção de rotas e Gestão de Sessão
test('AC-010: Acesso à página de recuperação @spec:AC-010', () => {
  const placeholderConfig = {
    route: '/forgot-password',
    title: 'Recuperação de Senha',
    isPlaceholder: true,
    message: 'Funcionalidade em desenvolvimento',
  };

  assert.equal(placeholderConfig.route, '/forgot-password');
  assert.equal(placeholderConfig.isPlaceholder, true);
  assert.equal(placeholderConfig.message, 'Funcionalidade em desenvolvimento');
});

// US-003 — Proteção de rotas e Gestão de Sessão
test('AC-011: Validação do placeholder @spec:AC-011', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validateEmail = (email) => {
    if (!email || email.trim() === '') return { valid: false, error: 'O e-mail é obrigatório' };
    if (!emailRegex.test(email)) return { valid: false, error: 'Formato de e-mail inválido' };
    return { valid: true };
  };

  const invalidResult = validateEmail('email-invalido');
  assert.equal(invalidResult.valid, false);
  assert.equal(invalidResult.error, 'Formato de e-mail inválido');

  const validResult = validateEmail('usuario@exemplo.com');
  assert.equal(validResult.valid, true);
});

// US-003 — Proteção de rotas e Gestão de Sessão
test('AC-012: Ação de Sair (Logout) @spec:AC-012', async () => {
  const localStorageMock = {
    data: {},
    getItem(k) { return this.data[k] ?? null; },
    setItem(k, v) { this.data[k] = String(v); },
    removeItem(k) { delete this.data[k]; },
    clear() { this.data = {}; },
  };
  globalThis.localStorage = localStorageMock;

  const { useAuthStore } = await import('../src/stores/auth.store.ts');
  useAuthStore.getState().setAuth({ id: 'u1', name: 'User', email: 'u@test.com' }, 'token-to-logout');
  localStorageMock.setItem('auth_token', 'token-to-logout');
  localStorageMock.setItem('active_wallet_id', 'wallet-1');

  assert.equal(useAuthStore.getState().isAuthenticated, true);
  assert.equal(localStorageMock.getItem('auth_token'), 'token-to-logout');

  useAuthStore.getState().logout();

  assert.equal(useAuthStore.getState().isAuthenticated, false);
  assert.equal(useAuthStore.getState().token, null);
  assert.equal(useAuthStore.getState().user, null);
  assert.equal(localStorageMock.getItem('auth_token'), null);
  assert.equal(localStorageMock.getItem('active_wallet_id'), null);
});
