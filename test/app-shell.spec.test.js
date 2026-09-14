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
test('AC-026: Recarregamento ao trocar de carteira @spec:AC-026', () => {
  // Dado: que o usuário está visualizando os dados de uma carteira
  // Quando: ele seleciona uma carteira diferente no seletor
  // Então: toda a aplicação deve recarregar seu contexto (invalidar cache de dados) e exibir as informações da nova carteira selecionada.
  assert.fail('critério de aceite AC-026 ainda não provado — implemente este teste');
});

// US-007 — Alternância de contexto (Wallet)
test('AC-027: Header obrigatório nas requisições @spec:AC-027', () => {
  // Dado: que uma carteira está selecionada
  // Quando: a aplicação faz uma requisição para a API (ex: buscar dashboard)
  // Então: o cabeçalho `x-wallet-id` deve ser incluído automaticamente com o ID da carteira ativa.
  assert.fail('critério de aceite AC-027 ainda não provado — implemente este teste');
});

// US-007 — Alternância de contexto (Wallet)
test('AC-028: Rota protegida sem carteira @spec:AC-028', () => {
  // Dado: que o usuário acessa a aplicação
  // Quando: nenhuma carteira foi selecionada previamente
  // Então: o sistema deve selecionar automaticamente a primeira carteira disponível e redirecioná-lo.
  assert.fail('critério de aceite AC-028 ainda não provado — implemente este teste');
});
