// Testes de spec da feature app-shell — gerados por onp-spec scaffold
import { test } from 'node:test';
import assert from 'node:assert/strict';

// US-006 — Navegação pelo layout principal
test('AC-021: Exibição do layout base @spec:AC-021', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const { useAuthStore } = await import('../src/stores/auth.store.ts');
  const { useWalletStore } = await import('../src/stores/wallet.store.ts');

  // Dado: que o usuário fez login com sucesso e tem uma carteira ativa
  useAuthStore.getState().setAuth({ id: 'u1', name: 'User Test', email: 'user@test.com' }, 'token-abc');
  useWalletStore.getState().setCurrentWalletId('wallet-active-1');

  assert.equal(useAuthStore.getState().isAuthenticated, true);
  assert.equal(useWalletStore.getState().currentWalletId, 'wallet-active-1');

  // Quando: a aplicação é carregada
  const appLayoutPath = path.resolve('src/layouts/AppLayout.tsx');
  assert.equal(fs.existsSync(appLayoutPath), true);
  const layoutContent = fs.readFileSync(appLayoutPath, 'utf-8');

  // Então: ele deve visualizar uma barra superior (Topbar) e um menu lateral (Sidebar) com links para Dashboard, Transações, Cartões, Contas, Relatórios, Investimentos e Configurações.
  const requiredNavItems = [
    'Dashboard',
    'Transações',
    'Cartões',
    'Contas',
    'Relatórios',
    'Investimentos',
    'Configurações',
  ];

  for (const item of requiredNavItems) {
    assert.equal(layoutContent.includes(item), true, `Item ${item} deve estar presente no layout`);
  }

  assert.equal(layoutContent.includes('topbar') || layoutContent.includes('Topbar'), true);
  assert.equal(layoutContent.includes('sidebar') || layoutContent.includes('Sidebar'), true);
});

// US-006 — Navegação pelo layout principal
test('AC-022: Menu responsivo em dispositivos móveis @spec:AC-022', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');

  // Dado: que o usuário acessa o sistema por um dispositivo móvel
  const sidebarPath = path.resolve('src/components/layout/Sidebar.tsx');
  assert.equal(fs.existsSync(sidebarPath), true);
  const sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');

  // Quando: ele visualiza a tela
  // Então: o menu lateral deve estar oculto por padrão no mobile (-translate-x-full) e visível apenas quando aberto ou em desktop (md:translate-x-0)
  assert.equal(sidebarContent.includes('-translate-x-full'), true);
  assert.equal(sidebarContent.includes('translate-x-0'), true);
  assert.equal(sidebarContent.includes('md:static'), true);
  assert.equal(sidebarContent.includes('md:translate-x-0'), true);

  // E deve aceitar prop isOpen e callback onClose para controle do botão hambúrguer
  assert.equal(sidebarContent.includes('isOpen'), true);
  assert.equal(sidebarContent.includes('onClose'), true);
});

// US-006 — Navegação pelo layout principal
test('AC-023: Indicador de notificações @spec:AC-023', () => {
  // Dado: que há alertas de contas em atraso
  // Quando: o usuário olha para a barra superior
  // Então: o ícone de sino de notificações deve exibir um contador (badge) com o número de itens em atraso.
  assert.fail('critério de aceite AC-023 ainda não provado — implemente este teste');
});

// US-006 — Navegação pelo layout principal
test('AC-024: Menu de perfil do usuário @spec:AC-024', () => {
  // Dado: que o usuário está no layout principal
  // Quando: ele clica no seu avatar na barra superior
  // Então: um menu suspenso deve aparecer, mostrando opções de Perfil e Sair (Logout).
  assert.fail('critério de aceite AC-024 ainda não provado — implemente este teste');
});

// US-007 — Alternância de contexto (Wallet)
test('AC-025: Seletor de carteira @spec:AC-025', () => {
  // Dado: que o usuário possui mais de uma carteira
  // Quando: ele clica no seletor na barra superior
  // Então: ele vê a lista de carteiras disponíveis com seus respectivos papéis (owner, editor, viewer).
  assert.fail('critério de aceite AC-025 ainda não provado — implemente este teste');
});

// US-007 — Alternância de contexto (Wallet)
test('AC-026: Recarregamento ao trocar de carteira @spec:AC-026', async () => {
  const { useWalletStore, subscribeToWalletChange } = await import('../src/stores/wallet.store.ts');
  const { useAuthStore } = await import('../src/stores/auth.store.ts');

  // Dado: que o usuário está visualizando os dados de uma carteira
  useWalletStore.getState().setWallets([
    { id: 'wallet-1', name: 'Carteira Pessoal', role: 'owner' },
    { id: 'wallet-2', name: 'Carteira Empresa', role: 'editor' },
  ]);
  useWalletStore.getState().setCurrentWalletId('wallet-1');
  assert.equal(useWalletStore.getState().currentWalletId, 'wallet-1');
  assert.equal(useWalletStore.getState().currentWallet?.name, 'Carteira Pessoal');

  let invalidatedQueries = false;
  let switchedToWallet = null;

  const unsubscribe = subscribeToWalletChange((newWalletId) => {
    invalidatedQueries = true;
    switchedToWallet = newWalletId;
  });

  try {
    // Quando: ele seleciona uma carteira diferente no seletor
    useWalletStore.getState().setCurrentWalletId('wallet-2');

    // Então: toda a aplicação deve recarregar seu contexto (invalidar cache de dados) e exibir as informações da nova carteira selecionada.
    assert.equal(invalidatedQueries, true);
    assert.equal(switchedToWallet, 'wallet-2');
    assert.equal(useWalletStore.getState().currentWalletId, 'wallet-2');
    assert.equal(useWalletStore.getState().currentWallet?.name, 'Carteira Empresa');
    assert.equal(useAuthStore.getState().activeWalletId, 'wallet-2');
  } finally {
    unsubscribe();
  }
});

// US-007 — Alternância de contexto (Wallet)
test('AC-027: Header obrigatório nas requisições @spec:AC-027', async () => {
  const { useWalletStore } = await import('../src/stores/wallet.store.ts');
  const { useAuthStore } = await import('../src/stores/auth.store.ts');
  const { api } = await import('../src/lib/axios.ts');

  // Dado: que uma carteira está selecionada
  useAuthStore.getState().setAuth({ id: 'u1', name: 'User', email: 'user@teste.com' }, 'mock-token-xyz');
  useWalletStore.getState().setCurrentWalletId('wallet-active-999');

  let interceptedHeaders = null;
  const originalAdapter = api.defaults.adapter;
  api.defaults.adapter = async (config) => {
    interceptedHeaders = config.headers;
    return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
  };

  try {
    // Quando: a aplicação faz uma requisição para a API (ex: buscar dashboard)
    await api.get('/dashboard-report/summary');

    // Então: o cabeçalho `x-wallet-id` deve ser incluído automaticamente com o ID da carteira ativa.
    assert.equal(interceptedHeaders['x-wallet-id'], 'wallet-active-999');
    assert.equal(interceptedHeaders['Authorization'], 'Bearer mock-token-xyz');
  } finally {
    api.defaults.adapter = originalAdapter;
  }
});

// US-007 — Alternância de contexto (Wallet)
test('AC-028: Rota protegida sem carteira @spec:AC-028', async () => {
  const { useWalletStore, resolveDefaultWallet } = await import('../src/stores/wallet.store.ts');
  const { useAuthStore } = await import('../src/stores/auth.store.ts');

  // Dado: que o usuário acessa a aplicação
  useAuthStore.getState().setAuth({ id: 'u1', name: 'User Test', email: 'user@test.com' }, 'token-abc');

  const availableWallets = [
    { id: 'wallet-alpha', name: 'Carteira Principal' },
    { id: 'wallet-beta', name: 'Carteira Reserva' },
  ];

  // Quando: nenhuma carteira foi selecionada previamente
  const currentWalletId = null;
  const resolvedWalletId = resolveDefaultWallet(currentWalletId, availableWallets);

  // Então: o sistema deve selecionar automaticamente a primeira carteira disponível e redirecioná-lo.
  assert.equal(resolvedWalletId, 'wallet-alpha');

  // Aplicando ao store
  useWalletStore.getState().setWallets(availableWallets);
  useWalletStore.getState().setCurrentWalletId(resolvedWalletId);
  assert.equal(useWalletStore.getState().currentWalletId, 'wallet-alpha');
  assert.equal(useAuthStore.getState().activeWalletId, 'wallet-alpha');
});
