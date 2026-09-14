// Testes de spec da feature app-shell — gerados por onp-spec scaffold
import { test } from 'node:test';
import assert from 'node:assert/strict';

// US-006 — Navegação pelo layout principal
test('AC-021: Exibição do layout base @spec:AC-021', () => {
  // Dado: que o usuário fez login com sucesso e tem uma carteira ativa
  // Quando: a aplicação é carregada
  // Então: ele deve visualizar uma barra superior (Topbar) e um menu lateral (Sidebar) com links para Dashboard, Transações, Cartões, Contas, Relatórios, Investimentos e Configurações.
  assert.fail('critério de aceite AC-021 ainda não provado — implemente este teste');
});

// US-006 — Navegação pelo layout principal
test('AC-022: Menu responsivo em dispositivos móveis @spec:AC-022', () => {
  // Dado: que o usuário acessa o sistema por um dispositivo móvel
  // Quando: ele visualiza a tela
  // Então: o menu lateral deve estar oculto, podendo ser aberto através de um ícone de "hambúrguer" na barra superior.
  assert.fail('critério de aceite AC-022 ainda não provado — implemente este teste');
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
test('AC-028: Rota protegida sem carteira @spec:AC-028', () => {
  // Dado: que o usuário acessa a aplicação
  // Quando: nenhuma carteira foi selecionada previamente
  // Então: o sistema deve selecionar automaticamente a primeira carteira disponível e redirecioná-lo.
  assert.fail('critério de aceite AC-028 ainda não provado — implemente este teste');
});
