// Testes de spec da feature ajustes-modais-cartoes-transacoes — metodologia opn-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-076 — Layout Mobile em Bottom Sheet e Gesto de Arraste no Lançamento de Cartão

test('AC-279: Gaveta inferior (Bottom Sheet) com animações de slide no cadastro de cartão mobile @spec:AC-279', () => {
  const cardModalSource = readSource('components/credit-cards/CreditCardModal.tsx');

  assert.ok(
    cardModalSource.includes('rounded-t-3xl'),
    'CreditCardModal deve ter cantos superiores arredondados rounded-t-3xl no mobile'
  );
  assert.ok(
    cardModalSource.includes('animate-drawer-in') &&
    cardModalSource.includes('animate-drawer-out'),
    'CreditCardModal deve utilizar animações animate-drawer-in e animate-drawer-out no mobile'
  );
  assert.ok(
    cardModalSource.includes('justify-end'),
    'CreditCardModal deve ancorar o conteúdo na base (justify-end) no mobile'
  );
});

test('AC-280: Gesto de arraste para baixo (drag-to-dismiss) no modal de cartão mobile @spec:AC-280', () => {
  const cardModalSource = readSource('components/credit-cards/CreditCardModal.tsx');

  assert.ok(
    cardModalSource.includes('id="drawer-handle"'),
    'CreditCardModal deve conter indicador de arraste #drawer-handle'
  );
  assert.ok(
    cardModalSource.includes('onTouchStart={handleTouchStart}') &&
    cardModalSource.includes('onTouchMove={handleTouchMove}') &&
    cardModalSource.includes('onTouchEnd={handleTouchEnd}'),
    'CreditCardModal deve registrar manipuladores touch para drag-to-dismiss'
  );
  assert.ok(
    cardModalSource.includes('dragY > 90'),
    'CreditCardModal deve possuir limiar de 90px para fechamento por arraste'
  );
  assert.ok(
    cardModalSource.includes('translateY(${dragY}px)'),
    'CreditCardModal deve aplicar deslocamento vertical em tempo real via translateY'
  );
  assert.ok(
    cardModalSource.includes('1 - dragY / 300'),
    'CreditCardModal deve atenuar opacidade do backdrop proporcionalmente ao arraste'
  );
});

// US-077 — Backdrop de Tela Inteira e Centralização Viewport para Modais via Portal

test('AC-281: Backdrop escuro cobrindo 100% da tela (header e sidebar inclusos) e centralização de viewport via Portal @spec:AC-281', () => {
  const cardModalSource = readSource('components/credit-cards/CreditCardModal.tsx');
  const deleteDialogSource = readSource('components/credit-cards/CreditCardDeleteDialog.tsx');
  const txModalSource = readSource('components/transactions/TransactionModal.tsx');
  const cssSource = readSource('index.css');

  assert.ok(
    cardModalSource.includes('createPortal') && cardModalSource.includes('document.body'),
    'CreditCardModal deve renderizar via createPortal no document.body'
  );
  assert.ok(
    deleteDialogSource.includes('createPortal') && deleteDialogSource.includes('document.body'),
    'CreditCardDeleteDialog deve renderizar via createPortal no document.body'
  );
  assert.ok(
    txModalSource.includes('createPortal') && txModalSource.includes('document.body'),
    'TransactionModal deve renderizar via createPortal no document.body'
  );
  assert.ok(
    cssSource.includes('viewFadeIn') && cssSource.includes('transform: none'),
    'index.css deve normalizar viewFadeIn com transform: none para não prender elementos fixos'
  );
});

test('AC-282: Desmonte suave e sincronizado com useModalTransition em CreditCardModal @spec:AC-282', () => {
  const cardModalSource = readSource('components/credit-cards/CreditCardModal.tsx');
  const deleteDialogSource = readSource('components/credit-cards/CreditCardDeleteDialog.tsx');

  assert.ok(
    cardModalSource.includes('useModalTransition') &&
    cardModalSource.includes('isClosing') &&
    cardModalSource.includes('triggerClose'),
    'CreditCardModal deve gerenciar ciclo de fechamento via useModalTransition'
  );
  assert.ok(
    deleteDialogSource.includes('useModalTransition'),
    'CreditCardDeleteDialog deve gerenciar ciclo de fechamento via useModalTransition'
  );
});

// US-078 — Remoção da Barra Lateral de Rolagem no Lançamento de Transação Desktop

test('AC-283: Ocultação da barra de rolagem lateral na tela de lançamento de transações desktop @spec:AC-283', () => {
  const cssSource = readSource('index.css');
  const txModalSource = readSource('components/transactions/TransactionModal.tsx');

  assert.ok(
    cssSource.includes('.no-scrollbar') &&
    cssSource.includes('scrollbar-width: none'),
    'index.css deve declarar utilitário .no-scrollbar com scrollbar-width: none'
  );
  assert.ok(
    txModalSource.includes('no-scrollbar'),
    'TransactionModal deve aplicar a classe .no-scrollbar para eliminar a barra lateral cinza'
  );
});

