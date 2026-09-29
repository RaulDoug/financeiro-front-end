// Testes de spec da feature grafico-pizza-e-filtro-categorias-relatorios — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-093 — Contenção e Harmonização Visual do Gráfico de Pizza de Relatórios

test('AC-334: Remoção do Legend SVG e introdução de Legenda Customizada Contida @spec:AC-334', () => {
  const chartSource = readSource('pages/Reports/CategoryChart.tsx');

  // Não deve conter o componente rígido <Legend do Recharts
  assert.ok(
    !chartSource.includes('<Legend'),
    'CategoryChart não deve utilizar <Legend> SVG do Recharts que causava overflow'
  );

  // Deve possuir altura contida h-48 e proporções de raio idênticas à Dashboard
  assert.ok(
    chartSource.includes('h-48'),
    'Container do gráfico deve utilizar h-48 para contenção vertical'
  );
  assert.ok(
    chartSource.includes('innerRadius={55}') && chartSource.includes('outerRadius={75}'),
    'Deve utilizar proporções de raio interno 55 e externo 75'
  );

  // Deve possuir legenda customizada com data-testid="category-custom-legend" e scroll suave
  assert.ok(
    chartSource.includes('data-testid="category-custom-legend"'),
    'Deve renderizar container com data-testid="category-custom-legend"'
  );
  assert.ok(
    chartSource.includes('overflow-y-auto') && chartSource.includes('max-h-28'),
    'Legenda deve ter rolagem vertical contida em max-h-28'
  );
  assert.ok(
    chartSource.includes('truncate'),
    'Itens da legenda devem aplicar truncate para prevenir estouro de largura'
  );
});

test('AC-335: Alinhamento visual e suporte a dark mode com o padrão do Dashboard @spec:AC-335', () => {
  const chartSource = readSource('pages/Reports/CategoryChart.tsx');

  // Cabeçalho com ícone e título padronizado
  assert.ok(
    chartSource.includes('Despesas por Categoria'),
    'Deve conter o título padronizado "Despesas por Categoria"'
  );
  assert.ok(
    chartSource.includes('PieChartIcon') || chartSource.includes('PieChart'),
    'Deve conter ícone de gráfico de pizza no cabeçalho'
  );

  // Suporte a Tailwind dark mode
  assert.ok(
    chartSource.includes('dark:bg-slate-900') && chartSource.includes('dark:border-slate-800'),
    'Card deve conter classes de estilização para Tailwind dark mode'
  );
});

// US-094 — Navegação com Filtro de Categoria a partir do Detalhamento

test('AC-336: Clique na categoria detalhada redireciona para transações com filtro aplicado @spec:AC-336', () => {
  const reportSource = readSource('pages/Reports/CategoryReport.tsx');

  // Deve integrar hook de navegação e store de filtros
  assert.ok(
    reportSource.includes('useNavigate'),
    'CategoryReport deve utilizar useNavigate do react-router-dom'
  );
  assert.ok(
    reportSource.includes('useFilterStore'),
    'CategoryReport deve acessar useFilterStore para atualizar os filtros ativos'
  );

  // Deve possuir manipulador de clique com rota de transações
  assert.ok(
    reportSource.includes('/transactions') && reportSource.includes('category_id'),
    'Deve navegar para /transactions com o parâmetro category_id'
  );

  // Interatividade nos cards mobile e na tabela desktop
  assert.ok(
    reportSource.includes('data-testid={`category-mobile-card-${rank}`}') &&
    reportSource.includes('cursor-pointer'),
    'Cards mobile devem ser interativos com cursor-pointer'
  );
  assert.ok(
    reportSource.includes('data-testid={`category-row-${rank}`}') &&
    reportSource.includes('cursor-pointer'),
    'Linhas da tabela desktop devem ser interativas com cursor-pointer'
  );
});

test('AC-337: Preservação de período do relatório e sincronização de query params @spec:AC-337', () => {
  const reportSource = readSource('pages/Reports/CategoryReport.tsx');
  const transactionsSource = readSource('pages/Transactions/index.tsx');

  // CategoryReport deve repassar as datas inicial e final para transações
  assert.ok(
    reportSource.includes('due_date_from') && reportSource.includes('due_date_to'),
    'CategoryReport deve repassar due_date_from e due_date_to'
  );

  // TransactionsPage deve ler category_id e datas de searchParams
  assert.ok(
    transactionsSource.includes("searchParams.get('category_id')"),
    'TransactionsPage deve extrair category_id dos searchParams'
  );
  assert.ok(
    transactionsSource.includes("searchParams.get('due_date_from')") &&
    transactionsSource.includes("searchParams.get('due_date_to')"),
    'TransactionsPage deve extrair datas dos searchParams'
  );
});
