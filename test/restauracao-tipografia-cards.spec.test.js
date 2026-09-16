/**
 * Testes de Especificação: restauracao-tipografia-cards
 * feature: restauracao-tipografia-cards
 * Padrão de referência: InvoiceSummary (tela Cartões) e CategoriesSettings (Configurações)
 * Cobre: AC-194, AC-195, AC-196, AC-197, AC-198, AC-199
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const readSrc = (rel) => readFileSync(path.join(root, rel), 'utf-8');

// ─── KpiCards ─────────────────────────────────────────────────────────────────

describe('AC-194 — Título do card KPI segue padrão xs/uppercase da tela de Cartões @spec:AC-194', () => {
  it('deve usar text-xs font-semibold uppercase tracking-wider (igual ao InvoiceSummary)', () => {
    const src = readSrc('src/pages/Dashboard/components/KpiCards.tsx');
    assert.match(
      src,
      /text-xs font-semibold.*uppercase tracking-wider/,
      'Esperado: text-xs font-semibold uppercase tracking-wider no rótulo do KPI'
    );
    // Não deve usar text-sm como rótulo (difere do padrão de referência)
    assert.doesNotMatch(
      src,
      /text-sm font-medium.*gray-500.*truncate" title/,
      'Não esperado: text-sm font-medium no rótulo do KPI'
    );
  });
});

describe('AC-195 — Valor monetário do KPI usa text-2xl (padrão InvoiceSummary) @spec:AC-195', () => {
  it('deve usar text-2xl font-bold fixo, sem escala responsiva variável', () => {
    const src = readSrc('src/pages/Dashboard/components/KpiCards.tsx');
    assert.match(
      src,
      /`text-2xl font-bold truncate block/,
      'Esperado: text-2xl font-bold truncate block no valor do KPI'
    );
    assert.doesNotMatch(
      src,
      /text-xl sm:text-2xl lg:text-3xl/,
      'Não esperado: escala responsiva variável no valor do KPI'
    );
    assert.doesNotMatch(
      src,
      /text-lg sm:text-xl lg:text-2xl/,
      'Não esperado: escala reduzida anterior'
    );
  });
});

describe('AC-196 — Ícone do card KPI com p-2 w-5 h-5 fixos @spec:AC-196', () => {
  it('deve usar p-2 e w-5 h-5 sem variação de breakpoint', () => {
    const src = readSrc('src/pages/Dashboard/components/KpiCards.tsx');
    assert.match(src, /`p-2 rounded-lg border shrink-0/, 'Esperado: p-2 fixo no container do ícone');
    assert.match(src, /w-5 h-5"/, 'Esperado: w-5 h-5 no ícone');
    assert.doesNotMatch(src, /p-1\.5 sm:p-2/, 'Não esperado: p-1.5 como base do container do ícone');
    assert.doesNotMatch(src, /w-4 h-4 sm:w-5 sm:h-5/, 'Não esperado: w-4 como tamanho base do ícone');
  });
});

// ─── TransactionMobileList ────────────────────────────────────────────────────

describe('AC-197 — Descrição da transação mobile em text-sm (padrão CategoriesSettings) @spec:AC-197', () => {
  it('deve usar text-sm na descrição (igual ao padrão text-sm das listas de Configurações)', () => {
    const src = readSrc('src/components/transactions/TransactionMobileList.tsx');
    assert.match(
      src,
      /font-semibold text-sm text-gray-900/,
      'Esperado: text-sm no span da descrição da transação mobile'
    );
    assert.doesNotMatch(
      src,
      /font-semibold text-xs sm:text-sm text-gray-900/,
      'Não esperado: text-xs como base da descrição'
    );
  });
});

describe('AC-198 — Valor monetário da transação mobile em text-sm @spec:AC-198', () => {
  it('deve usar text-sm no valor monetário', () => {
    const src = readSrc('src/components/transactions/TransactionMobileList.tsx');
    assert.match(
      src,
      /`text-sm font-bold whitespace-nowrap/,
      'Esperado: text-sm no span do valor monetário da transação mobile'
    );
    assert.doesNotMatch(
      src,
      /`text-xs sm:text-sm font-bold whitespace-nowrap/,
      'Não esperado: text-xs como base do valor monetário'
    );
  });
});

describe('AC-199 — Chips e data mantidos em tamanho compacto @spec:AC-199', () => {
  it('deve preservar text-[10px] nos elementos secundários (diferenciação hierárquica)', () => {
    const src = readSrc('src/components/transactions/TransactionMobileList.tsx');
    const occurrences = (src.match(/text-\[10px\]/g) || []).length;
    assert.ok(
      occurrences >= 2,
      `Esperado: ao menos 2 ocorrências de text-[10px] para chips/data (encontrado: ${occurrences})`
    );
  });
});
