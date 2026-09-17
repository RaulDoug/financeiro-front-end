// Testes de spec da feature convites-carteira — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  walletInviteService,
  INVITE_QUERY_KEYS,
} from '../src/services/walletInvite.service.ts';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-075 — Envio, Recebimento, Notificação e Aceite de Convites de Carteira

test('AC-274: Serviço e contrato de envio de convite (POST /api/wallet-invite/send-invite) @spec:AC-274', () => {
  assert.equal(typeof walletInviteService.sendInvite, 'function');

  const serviceSource = readSource('services/walletInvite.service.ts');
  assert.ok(
    serviceSource.includes('/wallet-invite/send-invite'),
    'Deve chamar a rota /wallet-invite/send-invite'
  );
  assert.ok(
    serviceSource.includes('inviter_user_id') &&
    serviceSource.includes('invited_email') &&
    serviceSource.includes('role'),
    'Deve enviar parâmetros inviter_user_id, invited_email e role'
  );
  assert.ok(
    serviceSource.includes("headers['x-wallet-id'] = params.wallet_id"),
    'Deve anexar x-wallet-id no header quando informado'
  );
});

test('AC-275: Listagem de convites pendentes (GET /api/wallet-invite/find-invites) @spec:AC-275', () => {
  assert.equal(typeof walletInviteService.getPendingInvites, 'function');
  assert.ok(Array.isArray(INVITE_QUERY_KEYS.pending()), 'Deve fornecer chave de cache para convites pendentes');

  const serviceSource = readSource('services/walletInvite.service.ts');
  assert.ok(
    serviceSource.includes('/wallet-invite/find-invites'),
    'Deve chamar a rota /wallet-invite/find-invites'
  );
  assert.ok(
    serviceSource.includes('response.data?.result?.rows'),
    'Deve extrair a lista de rows de result'
  );
});

test('AC-276: Aceite e recusa de convite (PATCH /api/wallet-invite/accept-invite) @spec:AC-276', () => {
  assert.equal(typeof walletInviteService.respondInvite, 'function');

  const serviceSource = readSource('services/walletInvite.service.ts');
  assert.ok(
    serviceSource.includes('/wallet-invite/accept-invite'),
    'Deve chamar a rota /wallet-invite/accept-invite'
  );
  assert.ok(
    serviceSource.includes("accept: params.accept ? 'true' : 'false'"),
    'Deve converter accept para string true ou false conforme contrato da API'
  );
  assert.ok(
    serviceSource.includes('wallet_id: params.wallet_id') &&
    serviceSource.includes('invite_id: params.invite_id'),
    'Deve enviar wallet_id e invite_id na query'
  );
});

test('AC-277: Notificação de convite no sino com direcionamento para tela de membros @spec:AC-277', () => {
  const bellSource = readSource('components/layout/NotificationsBell.tsx');

  // Consulta de convites integrada no sino
  assert.ok(
    bellSource.includes('walletInviteService.getPendingInvites') ||
    bellSource.includes('INVITE_QUERY_KEYS.pending'),
    'Sino deve consultar convites pendentes'
  );

  // Somatória no badge
  assert.ok(
    bellSource.includes('queryInvitesCount') && bellSource.includes('defaultTotalCount'),
    'Badge deve somar convites pendentes aos alertas de vencimento'
  );

  // Redirecionamento ao clicar no convite
  assert.ok(
    bellSource.includes("navigate('/settings/members')"),
    'Clicar no convite do sino deve redirecionar para /settings/members'
  );
  assert.ok(
    bellSource.includes('data-testid={`invite-item-${invite.id}`}'),
    'Convite no sino deve possuir data-testid acessível'
  );
});

test('AC-278: Interface de envio, gestão e resposta a convites em MembersSettings @spec:AC-278', () => {
  const membersSource = readSource('pages/Settings/MembersSettings.tsx');

  // Seção de envio e verificação de owner
  assert.ok(
    membersSource.includes('data-testid="send-invite-section"'),
    'Deve conter seção de envio de convite'
  );
  assert.ok(
    membersSource.includes("currentWallet?.role === 'owner'"),
    'Deve verificar se usuário atual é proprietário da carteira'
  );
  assert.ok(
    membersSource.includes('data-testid="input-invited-email"'),
    'Deve possuir campo de e-mail do convidado'
  );
  assert.ok(
    membersSource.includes('data-testid="select-invite-role"'),
    'Deve possuir seleção de papel (editor ou viewer)'
  );
  assert.ok(
    membersSource.includes('data-testid="btn-send-invite"'),
    'Deve possuir botão de envio de convite'
  );

  // Seção de recebidos e ações de resposta
  assert.ok(
    membersSource.includes('data-testid="received-invites-section"'),
    'Deve conter seção de convites recebidos'
  );
  assert.ok(
    membersSource.includes('accept-invite-') && membersSource.includes('reject-invite-'),
    'Deve possuir botões de aceitar e recusar convite'
  );
  assert.ok(
    membersSource.includes('fetchWallets'),
    'Deve atualizar a lista de carteiras após aceitar convite'
  );
});

