// Testes de especificação da feature centralizacao-delete-e-validacao-transacao — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-091 — Centralização do Diálogo de Exclusão no Viewport Geral

test('AC-330: Renderização do diálogo de exclusão via Portal no body com centralização total @spec:AC-330', () => {
  const dialogSource = readSource('components/transactions/TransactionDeleteDialog.tsx');

  // Deve importar createPortal de react-dom
  assert.ok(
    dialogSource.includes("import { createPortal } from 'react-dom';") ||
      dialogSource.includes('createPortal'),
    'TransactionDeleteDialog deve importar createPortal'
  );

  // Deve renderizar via portal no document.body
  assert.ok(
    dialogSource.includes('createPortal(content, document.body)'),
    'TransactionDeleteDialog deve renderizar no document.body via createPortal'
  );

  // Deve conter classes fixed inset-0 z-50 flex items-center justify-center
  assert.ok(
    dialogSource.includes('fixed inset-0 z-50 flex items-center justify-center'),
    'TransactionDeleteDialog deve conter container fixo centralizado na viewport'
  );
});

test('AC-331: Animações de transição suave e suporte ao fechamento por tecla ESC @spec:AC-331', () => {
  const dialogSource = readSource('components/transactions/TransactionDeleteDialog.tsx');

  // Deve usar hook useModalTransition
  assert.ok(
    dialogSource.includes('useModalTransition'),
    'TransactionDeleteDialog deve usar o hook useModalTransition'
  );

  // Deve adicionar listener para a tecla Escape
  assert.ok(
    dialogSource.includes("e.key === 'Escape'") &&
      dialogSource.includes("window.addEventListener('keydown', handleKeyDown)"),
    'TransactionDeleteDialog deve fechar ao pressionar tecla Escape'
  );

  // Deve incluir classes de transição de modal e backdrop
  assert.ok(
    dialogSource.includes('animate-backdrop-out') &&
      dialogSource.includes('animate-backdrop-in') &&
      dialogSource.includes('animate-modal-out') &&
      dialogSource.includes('animate-modal-in'),
    'TransactionDeleteDialog deve aplicar classes de animação suave'
  );
});

// US-092 — Validação e Exibição Amigável de Erros na Criação de Transação

test('AC-332: Validação prévia de tamanho mínimo de descrição no lançamento rápido mobile @spec:AC-332', () => {
  const mobileSource = readSource('components/transactions/MobileQuickEntry.tsx');

  // Deve validar tamanho mínimo de descrição quando preenchida
  assert.ok(
    mobileSource.includes('trimmedDesc.length > 0 && trimmedDesc.length < 3') ||
      mobileSource.includes('description.trim().length > 0 && description.trim().length < 3') ||
      mobileSource.includes('trimmedDesc.length < 3'),
    'MobileQuickEntry deve verificar se descrição tem menos de 3 caracteres'
  );

  // Deve apresentar a mensagem amigável no banner
  assert.ok(
    mobileSource.includes('A descrição deve conter no mínimo 3 caracteres'),
    'MobileQuickEntry deve alertar que a descrição deve ter pelo menos 3 caracteres'
  );
});

test('AC-333: Extração automática de mensagens de validação da API (status 400 com errors) @spec:AC-333', async () => {
  const { getApiErrorMessage } = await import('../src/utils/apiError.ts');
  const axiosSource = readSource('lib/axios.ts');
  const mobileSource = readSource('components/transactions/MobileQuickEntry.tsx');
  const modalSource = readSource('components/transactions/TransactionModal.tsx');

  // 1. getApiErrorMessage deve desempacotar payload do backend: { status: 'fail', errors: [{ message, field }] }
  const mockBackendError = {
    response: {
      status: 400,
      data: {
        status: 'fail',
        errors: [
          { field: 'body.description', message: 'A descrição deve conter no mínimo 3 caracteres' },
        ],
      },
    },
  };
  const extractedMsg = getApiErrorMessage(mockBackendError);
  assert.equal(
    extractedMsg,
    'A descrição deve conter no mínimo 3 caracteres',
    'getApiErrorMessage deve desempacotar o erro do Zod da API'
  );

  // 2. Não deve exibir "Request failed with status code 400"
  const mockAxiosGenericError = {
    message: 'Request failed with status code 400',
  };
  const fallbackMsg = getApiErrorMessage(mockAxiosGenericError);
  assert.ok(
    !fallbackMsg.includes('status code 400'),
    'getApiErrorMessage não deve retornar mensagem feia de status code do Axios'
  );

  // 3. axios.ts deve normalizar error.response.data.message a partir de errors[]
  assert.ok(
    axiosSource.includes('error?.response?.data?.errors') &&
      axiosSource.includes('error.response.data.message ='),
    'axios.ts deve normalizar error.response.data.message para compatibilidade global'
  );

  // 4. Modais devem usar getApiErrorMessage
  assert.ok(
    mobileSource.includes('getApiErrorMessage(err)'),
    'MobileQuickEntry deve utilizar getApiErrorMessage no tratamento de erro'
  );
  assert.ok(
    modalSource.includes('getApiErrorMessage'),
    'TransactionModal deve utilizar getApiErrorMessage'
  );
});
