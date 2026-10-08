// Testes de spec da feature modo-demo-e-bloqueio-registro — onp-spec driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// US-100 — Acesso Rápido ao Modo Demonstração (/demo)
test('AC-362: Inicialização Direta via Rota /demo @spec:AC-362', async () => {
  const { useDemoStore } = await import('../src/stores/demo.store.ts');
  const { useAuthStore } = await import('../src/stores/auth.store.ts');
  const { useWalletStore } = await import('../src/stores/wallet.store.ts');

  // Dado & Quando: O usuário acessa a rotina de inicialização da demo
  useDemoStore.getState().enterDemo();

  // Então:
  assert.equal(useDemoStore.getState().isDemoMode, true, 'isDemoMode deve ser true');
  assert.equal(useAuthStore.getState().isAuthenticated, true, 'Usuário deve estar autenticado em modo demo');
  assert.equal(useAuthStore.getState().user?.name, 'Usuário Demonstração', 'Nome do usuário demo deve estar definido');
  assert.equal(useWalletStore.getState().wallets.length > 0, true, 'Deve conter carteira de demonstração');
  assert.equal(Boolean(useWalletStore.getState().currentWalletId), true, 'Deve ter currentWalletId ativo');

  // Limpeza
  useDemoStore.getState().exitDemo();
});

// US-100 — Acesso Rápido ao Modo Demonstração (/demo)
test('AC-363: Atalho para Modo Demo na Tela de Login @spec:AC-363', async () => {
  const loginPath = path.resolve('src/pages/auth/LoginPage.tsx');
  const content = fs.readFileSync(loginPath, 'utf-8');

  // Dado & Quando: Visitante está na tela de login
  // Então: Deve haver link para /demo com texto indicativo
  assert.equal(content.includes('to="/demo"'), true, 'Deve conter link apontando para /demo');
  assert.equal(content.includes('Experimentar Modo Demonstração'), true, 'Deve conter botão "Experimentar Modo Demonstração"');
  assert.equal(content.includes('demo-login-button'), true, 'Deve conter data-testid demo-login-button');
});

// US-101 — Simulação e Recálculo em Memória das Telas Principais
test('AC-364: Dataset Mockado Realista @spec:AC-364', async () => {
  const { useDemoStore } = await import('../src/stores/demo.store.ts');
  useDemoStore.getState().enterDemo();

  const state = useDemoStore.getState();

  // Deve possuir contas bancárias
  assert.equal(state.bankAccounts.length >= 2, true, 'Deve conter pelo menos 2 contas bancárias');
  // Deve possuir categorias
  assert.equal(state.categories.length >= 5, true, 'Deve conter categorias de receita e despesa');
  // Deve possuir métodos de pagamento / cartão
  assert.equal(state.payMethods.length >= 2, true, 'Deve conter cartão de crédito e pix');
  // Deve possuir transações realistas
  assert.equal(state.transactions.length >= 10, true, 'Deve conter histórico amplo de transações');

  useDemoStore.getState().exitDemo();
});

// US-101 — Simulação e Recálculo em Memória das Telas Principais
test('AC-365: Interceptação de Rede Transparente @spec:AC-365', async () => {
  const { useDemoStore } = await import('../src/stores/demo.store.ts');
  const { api } = await import('../src/lib/axios.ts');

  useDemoStore.getState().enterDemo();

  try {
    // Quando dispara chamadas para transações e relatórios em modo demo
    const txRes = await api.get('/transaction');
    assert.equal(txRes.status, 200);
    assert.equal(Array.isArray(txRes.data.rows), true, 'Deve retornar linhas de transações');

    const bankRes = await api.get('/bank-account');
    assert.equal(bankRes.status, 200);
    assert.equal(Array.isArray(bankRes.data), true, 'Deve retornar contas bancárias');

    const dreRes = await api.get('/dashboard-report/income-vs-expense');
    assert.equal(dreRes.status, 200);
    assert.equal(Array.isArray(dreRes.data.incomeVsExpense.yearly), true, 'Deve retornar yearly data no DRE');
  } finally {
    useDemoStore.getState().exitDemo();
  }
});

// US-101 — Simulação e Recálculo em Memória das Telas Principais
test('AC-366: Lançamento e Recálculo Dinâmico em Memória @spec:AC-366', async () => {
  const { useDemoStore } = await import('../src/stores/demo.store.ts');
  const { api } = await import('../src/lib/axios.ts');

  useDemoStore.getState().enterDemo();

  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const monthPad = String(currentMonth).padStart(2, '0');

    // DRE antes do lançamento
    const dreBefore = await api.get(`/dashboard-report/income-vs-expense?year=${currentYear}`);
    const monthRowBefore = dreBefore.data.incomeVsExpense.yearly.find((item) => item.month === currentMonth);
    const prevExpense = monthRowBefore ? monthRowBefore.expense : 0;

    // Criar uma nova despesa de R$ 999.00 no mês atual
    const newTxPayload = {
      description: 'Super Despesa Teste Demo',
      value: 999.0,
      type: 'expenses',
      status: 'completed',
      due_date: `${currentYear}-${monthPad}-12`,
      bank_account_id: 'demo-bank-1',
      category_id: 'demo-cat-4',
    };

    const postRes = await api.post('/transaction/register', newTxPayload);
    assert.equal(postRes.status, 200);

    // DRE após o lançamento
    const dreAfter = await api.get(`/dashboard-report/income-vs-expense?year=${currentYear}`);
    const monthRowAfter = dreAfter.data.incomeVsExpense.yearly.find((item) => item.month === currentMonth);
    const expectedExpense = Number((prevExpense + 999).toFixed(2));

    assert.equal(
      monthRowAfter?.expense,
      expectedExpense,
      'A despesa do mês na DRE deve ter sido recalculada instantaneamente'
    );
  } finally {
    useDemoStore.getState().exitDemo();
  }
});

// US-102 — Ocultação Condicional de Investimentos Apenas no Modo Demo
test('AC-367: Isolamento do Módulo de Investimentos @spec:AC-367', async () => {
  const sidebarPath = path.resolve('src/components/layout/Sidebar.tsx');
  const sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');

  const appLayoutPath = path.resolve('src/layouts/AppLayout.tsx');
  const layoutContent = fs.readFileSync(appLayoutPath, 'utf-8');

  const routesPath = path.resolve('src/routes/index.tsx');
  const routesContent = fs.readFileSync(routesPath, 'utf-8');

  // Sidebar deve conter a regra condicional de ocultação apenas para o modo demo
  assert.equal(
    sidebarContent.includes("filter((item) => item.href !== '/investimentos')") ||
    sidebarContent.includes("isDemoMode"),
    true,
    'Sidebar deve conter verificação condicional de isDemoMode para filtrar investimentos'
  );

  // Na lista oficial do Sidebar, Investimentos continua presente
  assert.equal(
    sidebarContent.includes("{ label: 'Investimentos', href: '/investimentos'"),
    true,
    'Lista base oficial de navegação do Sidebar deve manter Investimentos'
  );

  // AppLayout deve filtrar no getAppShellNavLinks quando isDemo for true
  assert.equal(
    layoutContent.includes("item.href !== '/investimentos'"),
    true,
    'AppLayout deve filtrar Investimentos quando isDemo for true'
  );
  assert.equal(
    layoutContent.includes("{ label: 'Investimentos', href: '/investimentos' }"),
    true,
    'AppLayout deve manter Investimentos nos itens oficiais'
  );

  // Rotas devem possuir guard de redirecionamento para Investimentos quando no modo demo
  assert.equal(
    routesContent.includes('const InvestmentsRoute'),
    true,
    'Rotas devem conter guard InvestmentsRoute'
  );
  assert.equal(
    routesContent.includes('isDemoMode') && routesContent.includes('Navigate to="/dashboard" replace'),
    true,
    'InvestmentsRoute deve redirecionar para dashboard em modo demo'
  );
  assert.equal(
    routesContent.includes('<InvestmentsPage />'),
    true,
    'InvestmentsRoute deve renderizar InvestmentsPage na versão oficial'
  );
});

// US-103 — Bloqueio Incondicional da Rota de Cadastro (/register)
test('AC-368: Bloqueio Total da URL /register @spec:AC-368', async () => {
  const routesPath = path.resolve('src/routes/index.tsx');
  const routesContent = fs.readFileSync(routesPath, 'utf-8');

  // A rota /register deve redirecionar diretamente para /login
  assert.equal(
    routesContent.includes('<Route path="/register" element={<Navigate to="/login" replace />} />'),
    true,
    'Rota /register deve conter redirecionamento imediato para /login'
  );

  // O componente RegisterPage deve apresentar o aviso de suspensão
  const registerPagePath = path.resolve('src/pages/auth/RegisterPage.tsx');
  const registerContent = fs.readFileSync(registerPagePath, 'utf-8');
  assert.equal(
    registerContent.includes('Cadastros Temporariamente Suspensos'),
    true,
    'RegisterPage deve exibir título de cadastros suspensos'
  );
  assert.equal(
    registerContent.includes('register-suspended-card'),
    true,
    'RegisterPage deve conter data-testid register-suspended-card'
  );
});

// US-103 — Bloqueio Incondicional da Rota de Cadastro (/register)
test('AC-369: Omissão de Links de Registro @spec:AC-369', async () => {
  const loginPath = path.resolve('src/pages/auth/LoginPage.tsx');
  const loginContent = fs.readFileSync(loginPath, 'utf-8');

  // Não deve haver link apontando para /register
  assert.equal(
    loginContent.includes('to="/register"'),
    false,
    'LoginPage não deve conter nenhum link para to="/register"'
  );
  assert.equal(
    loginContent.includes('registration-disabled-badge'),
    true,
    'LoginPage deve exibir aviso de cadastros suspensos'
  );
});

// US-104 — Restauração e Saída Segura da Demonstração
test('AC-370: Banner Informativo de Demonstração @spec:AC-370', async () => {
  const appLayoutPath = path.resolve('src/layouts/AppLayout.tsx');
  const content = fs.readFileSync(appLayoutPath, 'utf-8');

  assert.equal(
    content.includes('demo-mode-banner'),
    true,
    'AppLayout deve incluir banner com data-testid demo-mode-banner'
  );
  assert.equal(
    content.includes('Dados meramente ilustrativos e não refletem a realidade.'),
    true,
    'AppLayout deve conter o disclaimer com a frase solicitada'
  );
  assert.equal(
    content.includes('Sair da Demonstração'),
    true,
    'AppLayout deve conter botão de Sair da Demonstração'
  );
});

// US-100 — Rota Padrão / Aponta para a Demonstração
test('AC-372: Rota Raiz / Redireciona para Modo Demo @spec:AC-372', async () => {
  const routesPath = path.resolve('src/routes/index.tsx');
  const content = fs.readFileSync(routesPath, 'utf-8');

  assert.equal(
    content.includes('<Route path="/" element={<DefaultRoute />} />'),
    true,
    'Rota raiz / deve renderizar DefaultRoute para conduzir ao modo demonstração'
  );
  assert.equal(
    content.includes('return <Navigate to="/demo" replace />;'),
    true,
    'DefaultRoute deve ter redirecionamento padrão para /demo'
  );
});

// US-104 — Restauração e Saída Segura da Demonstração
test('AC-371: Descarte de Dados e Reset ao Sair @spec:AC-371', async () => {
  const { useDemoStore } = await import('../src/stores/demo.store.ts');
  const { useAuthStore } = await import('../src/stores/auth.store.ts');

  // Entrar na demo
  useDemoStore.getState().enterDemo();
  assert.equal(useDemoStore.getState().isDemoMode, true);

  // Adicionar uma transação
  useDemoStore.getState().addTransaction({
    description: 'Transação Efêmera',
    value: 500,
    type: 'expenses',
    status: 'completed',
  });

  const txCountBeforeExit = useDemoStore.getState().transactions.length;

  // Sair da demo
  useDemoStore.getState().exitDemo();

  // Validar descarte e logout
  assert.equal(useDemoStore.getState().isDemoMode, false, 'isDemoMode deve voltar a false');
  assert.equal(useAuthStore.getState().isAuthenticated, false, 'Usuário deve estar deslogado após sair');
  assert.equal(
    useDemoStore.getState().transactions.length < txCountBeforeExit,
    true,
    'Transação adicionada na demo deve ter sido descartada após o exit'
  );
});

// US-104 — Acesso Desimpedido à Tela de Login
test('AC-373: Acesso à Tela de Login a partir da Demonstração @spec:AC-373', async () => {
  const publicRoutePath = path.resolve('src/routes/PublicRoute.tsx');
  const publicContent = fs.readFileSync(publicRoutePath, 'utf-8');

  const privateRoutePath = path.resolve('src/routes/PrivateRoute.tsx');
  const privateContent = fs.readFileSync(privateRoutePath, 'utf-8');

  assert.equal(
    publicContent.includes('isRealUser'),
    true,
    'PublicRoute deve validar isRealUser em vez de bloquear sessões demo'
  );
  assert.equal(
    privateContent.includes('return <Navigate to="/login" state={{ from: location }} replace />;'),
    true,
    'PrivateRoute deve direcionar usuários deslogados para /login'
  );
});
