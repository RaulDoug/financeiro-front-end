// Testes de spec da feature animacoes-e-arraste-modais — gerados por onp-spec scaffold
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-072 — Arraste para Baixo (Drag to Dismiss) no Lançamento Mobile
test('AC-266: Detecção de toque e arraste descendente no topo da gaveta @spec:AC-266', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');

  assert.ok(
    quickEntrySource.includes('onTouchStart={handleTouchStart}') &&
    quickEntrySource.includes('onTouchMove={handleTouchMove}') &&
    quickEntrySource.includes('onTouchEnd={handleTouchEnd}'),
    'MobileQuickEntry deve registrar manipuladores onTouchStart, onTouchMove e onTouchEnd'
  );

  assert.ok(
    quickEntrySource.includes('id="drawer-handle"') &&
    quickEntrySource.includes('deltaY > 0'),
    'Deve capturar arraste descendente deltaY > 0 a partir da barra de arraste'
  );
});

// US-072 — Arraste para Baixo (Drag to Dismiss) no Lançamento Mobile
test('AC-267: Deslocamento visual em tempo real e atenuação de opacidade @spec:AC-267', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');

  assert.ok(
    quickEntrySource.includes('translateY(${dragY}px)') ||
    quickEntrySource.includes('translateY(${Math.max(0, dragY)}px)'),
    'Card da gaveta deve aplicar deslocamento vertical em tempo real via translateY'
  );

  assert.ok(
    quickEntrySource.includes('1 - dragY / 300') ||
    quickEntrySource.includes('dragY > 0 ? Math.max(0, 1 - dragY /'),
    'Backdrop deve reduzir opacidade proporcionalmente ao deslocamento de arraste'
  );
});

// US-072 — Arraste para Baixo (Drag to Dismiss) no Lançamento Mobile
test('AC-268: Limiar de fechamento e restauração com mola elástica @spec:AC-268', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');

  assert.ok(
    quickEntrySource.includes('dragY > 90') &&
    quickEntrySource.includes('onClose()'),
    'Deve disparar onClose ao soltar além do limiar de 90px'
  );

  assert.ok(
    quickEntrySource.includes('setDragY(0)') &&
    quickEntrySource.includes('cubic-bezier(0.16, 1, 0.3, 1)'),
    'Deve restaurar a 0px com curva suave/elástica caso solte antes do limiar'
  );
});

// US-073 — Animações Fluidas de Abertura e Fechamento em Modais e Bottom Sheets
test('AC-269: Animações nativas de Slide para gavetas inferiores (Bottom Sheets) @spec:AC-269', () => {
  const cssSource = readSource('index.css');
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');
  const moreMenuSource = readSource('components/layout/MoreMenuModal.tsx');

  assert.ok(
    cssSource.includes('@keyframes drawerIn') &&
    cssSource.includes('@keyframes drawerOut') &&
    cssSource.includes('.animate-drawer-in') &&
    cssSource.includes('.animate-drawer-out'),
    'index.css deve declarar keyframes e classes drawerIn e drawerOut'
  );

  assert.ok(
    quickEntrySource.includes('animate-drawer-in') &&
    quickEntrySource.includes('animate-drawer-out'),
    'MobileQuickEntry deve aplicar animate-drawer-in e animate-drawer-out'
  );

  assert.ok(
    moreMenuSource.includes('animate-drawer-in') &&
    moreMenuSource.includes('animate-drawer-out'),
    'MoreMenuModal deve aplicar animate-drawer-in e animate-drawer-out'
  );
});

// US-073 — Animações Fluidas de Abertura e Fechamento em Modais e Bottom Sheets
test('AC-270: Animações de Escala e Fade para diálogos centrais e popups @spec:AC-270', () => {
  const cssSource = readSource('index.css');
  const txModalSource = readSource('components/transactions/TransactionModal.tsx');
  const deleteModalSource = readSource('components/bank-accounts/DeleteConfirmModal.tsx');

  assert.ok(
    cssSource.includes('@keyframes modalScaleIn') &&
    cssSource.includes('@keyframes modalScaleOut') &&
    cssSource.includes('.animate-modal-in') &&
    cssSource.includes('.animate-modal-out'),
    'index.css deve declarar keyframes e classes modalScaleIn e modalScaleOut'
  );

  assert.ok(
    txModalSource.includes('animate-modal-in') &&
    txModalSource.includes('animate-modal-out'),
    'TransactionModal deve aplicar classes de escala e fade no desktop'
  );

  assert.ok(
    deleteModalSource.includes('animate-modal-in') &&
    deleteModalSource.includes('animate-modal-out'),
    'DeleteConfirmModal deve aplicar classes de escala e fade'
  );
});

// US-073 — Animações Fluidas de Abertura e Fechamento em Modais e Bottom Sheets
test('AC-271: Hook gerenciador de ciclo de vida de desmonte seguro (useModalTransition) @spec:AC-271', () => {
  const hookSource = readSource('hooks/useModalTransition.ts');

  assert.ok(
    hookSource.includes('export function useModalTransition') ||
    hookSource.includes('export const useModalTransition'),
    'useModalTransition deve ser exportado'
  );

  assert.ok(
    hookSource.includes('isRendered') &&
    hookSource.includes('isClosing') &&
    hookSource.includes('triggerClose'),
    'useModalTransition deve retornar isRendered, isClosing e triggerClose'
  );

  assert.ok(
    hookSource.includes('setTimeout') &&
    hookSource.includes('duration'),
    'useModalTransition deve atrasar o desmonte pelo tempo da animação'
  );
});

// US-074 — Suavidade de Transição no App Shell e Menus
test('AC-272: Abertura e fechamento com animação na gaveta de Mais Opções @spec:AC-272', () => {
  const moreMenuSource = readSource('components/layout/MoreMenuModal.tsx');

  assert.ok(
    moreMenuSource.includes('useModalTransition') &&
    moreMenuSource.includes('isClosing'),
    'MoreMenuModal deve integrar useModalTransition para controle de saída'
  );

  assert.ok(
    moreMenuSource.includes('id="more-menu-handle"') &&
    moreMenuSource.includes('onTouchStart') &&
    moreMenuSource.includes('onTouchEnd'),
    'MoreMenuModal deve disponibilizar handle e suporte a arraste'
  );
});

// US-074 — Suavidade de Transição no App Shell e Menus
test('AC-273: Transição sutil de visualização de conteúdo (Viewport Fade) @spec:AC-273', () => {
  const cssSource = readSource('index.css');
  const layoutSource = readSource('layouts/AppLayout.tsx');

  assert.ok(
    cssSource.includes('@keyframes viewFadeIn') &&
    cssSource.includes('.animate-view-fade-in'),
    'index.css deve declarar @keyframes viewFadeIn e .animate-view-fade-in'
  );

  assert.ok(
    layoutSource.includes('animate-view-fade-in') &&
    layoutSource.includes('location.pathname'),
    'AppLayout deve envolver o conteúdo com animate-view-fade-in indexado por rota'
  );
});
