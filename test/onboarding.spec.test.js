// Testes de spec da feature onboarding — gerados por onp-spec scaffold
import { test } from 'node:test';
import assert from 'node:assert/strict';

// US-004 — Assistente de primeiros passos (Wallet e Redirecionamento)
test('AC-013: Redirecionamento forçado ao onboarding @spec:AC-013', () => {
  // Dado: que o usuário fez login com sucesso no sistema
  // Quando: o front-end consulta `GET /api/wallet` e recebe `walletsList` vazio
  // Então: ele é imediatamente redirecionado para a tela do Wizard de Onboarding ao invés do Dashboard principal
  assert.fail('critério de aceite AC-013 ainda não provado — implemente este teste');
});

// US-004 — Assistente de primeiros passos (Wallet e Redirecionamento)
test('AC-014: Criação da primeira carteira (Step 1) @spec:AC-014', () => {
  // Dado: que o usuário está no passo inicial (Step 1) do onboarding
  // Quando: ele preenche o nome da carteira desejado e clica para avançar
  // Então: o sistema aciona a API para criar a carteira (`POST /api/wallet/register`) e avança para o Step 2
  assert.fail('critério de aceite AC-014 ainda não provado — implemente este teste');
});

// US-005 — Configuração das contas e cartões no onboarding
test('AC-015: Criação da primeira conta bancária (Step 2) @spec:AC-015', () => {
  // Dado: que o usuário completou o Step 1 e está no Step 2
  // Quando: ele preenche os dados (nome da conta, banco emissor) informando ou não um saldo inicial e avança
  // Então: o sistema cadastra a conta no backend (`POST /api/bank-account/register`), atrelando-a ao cabeçalho `x-wallet-id` da carteira recém-criada, e avança para o Step 3
  assert.fail('critério de aceite AC-015 ainda não provado — implemente este teste');
});

// US-005 — Configuração das contas e cartões no onboarding
test('AC-016: Saldo inicial padrão (Conta Bancária) @spec:AC-016', () => {
  // Dado: que o usuário está criando a sua conta bancária no Step 2
  // Quando: ele opta por deixar o saldo inicial em branco ou omite o valor
  // Então: o sistema assume e cadastra o valor "0.00" como saldo padrão
  assert.fail('critério de aceite AC-016 ainda não provado — implemente este teste');
});

// US-005 — Configuração das contas e cartões no onboarding
test('AC-017: Adição de Cartão de Crédito (Step 3 - Opcional) @spec:AC-017', () => {
  // Dado: que o usuário chegou ao Step 3 (Opcional)
  // Quando: ele informa os dados do cartão de crédito (limite, dias de fechamento/vencimento da fatura) e clica em Finalizar
  // Então: o sistema cadastra o meio de pagamento (`POST /api/pay-method/register` indicando ser cartão de crédito) na carteira, salva o `wallet_id` na sessão ativa e o direciona ao Dashboard
  assert.fail('critério de aceite AC-017 ainda não provado — implemente este teste');
});

// US-005 — Configuração das contas e cartões no onboarding
test('AC-018: Pular adição de Cartão de Crédito (Step 3 - Opcional) @spec:AC-018', () => {
  // Dado: que o usuário chegou ao Step 3 e não deseja cadastrar cartão de crédito
  // Quando: ele clica no botão "Pular esta etapa" ou similar
  // Então: nenhum cartão é registrado, mas o sistema salva o `wallet_id` ativo da sessão e avança o usuário diretamente para o Dashboard
  assert.fail('critério de aceite AC-018 ainda não provado — implemente este teste');
});

// US-005 — Configuração das contas e cartões no onboarding
test('AC-019: Prevenção de abandono do Wizard @spec:AC-019', () => {
  // Dado: que o usuário iniciou o onboarding, mas não concluiu (não possui configuração mínima registrada)
  // Quando: ele tentar acessar diretamente qualquer outra rota da área logada como `/dashboard` pela URL
  // Então: o sistema o barra e o força de volta para o ambiente de Onboarding
  assert.fail('critério de aceite AC-019 ainda não provado — implemente este teste');
});

// US-005 — Configuração das contas e cartões no onboarding
test('AC-020: Registro do estado concluído @spec:AC-020', () => {
  // Dado: que o usuário acaba de finalizar ou pular o último passo do onboarding
  // Quando: ocorre a transição final para a aplicação
  // Então: o sistema assegura que a carteira (Wallet) criada está configurada globalmente no front-end como a carteira corrente (`currentWalletId`) e as próximas requisições já incluirão este identificador
  assert.fail('critério de aceite AC-020 ainda não provado — implemente este teste');
});
