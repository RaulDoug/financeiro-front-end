// Testes de spec da feature melhorias-ux-mobile-desktop — gerados por onp-spec scaffold
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-036 — Experiência Mobile do App Shell e Dashboard
test('AC-133: Ocultação de ações redundantes e menu hambúrguer no mobile @spec:AC-133', () => {
  const topbarSource = readSource('components/layout/Topbar.tsx');
  const quickActionsSource = readSource('pages/Dashboard/components/QuickActions.tsx');

  // Topbar deve ocultar o botão hambúrguer no mobile
  assert.ok(
    topbarSource.includes('data-testid="mobile-hamburger-button"') &&
    topbarSource.includes('className="hidden'),
    'Topbar deve ocultar o botão hambúrguer no mobile'
  );

  // QuickActions deve ficar oculto no mobile (usar hidden md:flex)
  assert.ok(
    quickActionsSource.includes('hidden md:flex'),
    'QuickActions deve ficar oculto no mobile para evitar redundância com botão da barra inferior'
  );
});

// US-036 — Experiência Mobile do App Shell e Dashboard
test('AC-134: Tipografia fluida e responsiva nos cards da Dashboard @spec:AC-134', () => {
  const kpiSource = readSource('pages/Dashboard/components/KpiCards.tsx');

  // Títulos dos cards devem utilizar tipografia fluida com truncate
  assert.ok(
    kpiSource.includes('text-xs sm:text-sm') && kpiSource.includes('truncate'),
    'Cards KPI devem utilizar tipografia proporcional e truncamento no título'
  );

  // Valores devem utilizar tamanho responsivo com truncate
  assert.ok(
    kpiSource.includes('truncate') && (kpiSource.includes('text-lg') || kpiSource.includes('text-xl')),
    'Valores dos cards KPI devem ser responsivos e adaptáveis'
  );
});

// US-036 — Experiência Mobile do App Shell e Dashboard
test('AC-135: Filtro de mês e ano no Dashboard @spec:AC-135', () => {
  const dashboardSource = readSource('pages/Dashboard/DashboardPage.tsx');

  // Deve possuir seletor de mês/ano no Dashboard
  assert.ok(
    dashboardSource.includes('data-testid="dashboard-month-selector"') &&
    dashboardSource.includes('data-testid="dashboard-selected-month"'),
    'Dashboard deve possuir seletor de mês e ano com exibição do mês selecionado'
  );

  // Queries de resumo e despesas por categoria devem receber os parâmetros de data
  assert.ok(
    dashboardSource.includes('useDashboardSummary(dateParams)') &&
    dashboardSource.includes('useExpenseByCategory(dateParams)'),
    'Queries de métricas do Dashboard devem ser parametrizadas com o período selecionado'
  );
});

// US-036 — Experiência Mobile do App Shell e Dashboard
test('AC-136: Scroll horizontal e barras condensadas no gráfico de Receitas x Despesas da Dashboard @spec:AC-136', () => {
  const chartSource = readSource('pages/Dashboard/components/IncomeExpenseChart.tsx');

  // Deve possuir contêiner com rolagem horizontal e largura mínima
  assert.ok(
    chartSource.includes('overflow-x-auto') && chartSource.includes('min-w-['),
    'Gráfico deve conter contêiner com rolagem horizontal contínua'
  );

  // Deve configurar espaçamento condensado entre barras
  assert.ok(
    chartSource.includes('barGap=') && chartSource.includes('barCategoryGap='),
    'Gráfico deve configurar espaçamento condensado entre barras'
  );

  // Barras não devem possuir contorno escuro espesso ao clicar
  assert.ok(
    chartSource.includes('activeBar={{ fillOpacity:') && chartSource.includes("stroke: 'none'"),
    'Barras devem utilizar destaque sutil sem borda preta ao clicar'
  );
});

// US-037 — Reorganização e Filtros Avançados na Tela de Transações
test('AC-137: Ocultação do botão de nova transação no mobile @spec:AC-137', () => {
  const transactionsSource = readSource('pages/Transactions/index.tsx');

  // O botão de cabeçalho 'Nova Transação' deve possuir classe 'hidden md:flex' para ocultar no mobile
  assert.ok(
    transactionsSource.includes('hidden md:flex') && transactionsSource.includes('Nova Transação'),
    'Botão Nova Transação da página deve ficar oculto no mobile'
  );
});

// US-037 — Reorganização e Filtros Avançados na Tela de Transações
test('AC-138: Reorganização da barra de período e filtros de data no mobile @spec:AC-138', () => {
  const filtersSource = readSource('components/transactions/TransactionFilters.tsx');

  // A seção de mês deve adotar flex-col no mobile e flex-row no desktop
  assert.ok(
    filtersSource.includes('flex flex-col sm:flex-row') && filtersSource.includes('data-testid="month-filter-section"'),
    'Seção de filtros de período deve ser empilhada em duas linhas no mobile'
  );

  // Deve possuir atalhos 'Este Mês' e 'Todas as datas'
  assert.ok(
    filtersSource.includes('Este Mês') && filtersSource.includes('Todas as datas'),
    'Deve conter botões de atalho Este Mês e Todas as datas'
  );
});

// US-037 — Reorganização e Filtros Avançados na Tela de Transações
test('AC-139: Botão e painel de Filtros Avançados (Desktop e Mobile) @spec:AC-139', () => {
  const filtersSource = readSource('components/transactions/TransactionFilters.tsx');
  const modalSource = readSource('components/transactions/TransactionAdvancedFiltersModal.tsx');

  // TransactionFilters deve possuir o botão Filtros
  assert.ok(
    filtersSource.includes('data-testid="btn-advanced-filters"'),
    'Deve conter botão para acionar filtros avançados'
  );

  // TransactionAdvancedFiltersModal deve conter seletores de categoria, método de pagamento, conta e status
  assert.ok(
    modalSource.includes('data-testid="filter-category-select"') &&
    modalSource.includes('data-testid="filter-pay-method-select"') &&
    modalSource.includes('data-testid="filter-bank-account-select"') &&
    modalSource.includes('data-testid="filter-status-select"'),
    'Modal deve disponibilizar seletores de categoria, método de pagamento, conta bancária e status'
  );

  assert.ok(
    modalSource.includes('data-testid="btn-apply-advanced-filters"'),
    'Modal deve possuir botão para aplicar os filtros'
  );
});

// US-037 — Reorganização e Filtros Avançados na Tela de Transações
test('AC-140: Visualização compacta de transações em lista mobile sem scroll horizontal @spec:AC-140', () => {
  const tableSource = readSource('components/transactions/TransactionTable.tsx');
  const mobileListSource = readSource('components/transactions/TransactionMobileList.tsx');

  // TransactionTable deve renderizar a lista mobile em < md e a tabela em >= md
  assert.ok(
    tableSource.includes('block md:hidden') && tableSource.includes('<TransactionMobileList'),
    'TransactionTable deve exibir a lista mobile compacta em telas pequenas'
  );
  assert.ok(
    tableSource.includes('hidden md:block'),
    'TransactionTable deve ocultar a tabela larga com rolagem horizontal em telas pequenas'
  );

  // TransactionMobileList deve conter a estrutura de card vertical com descrição, chips, data e status
  assert.ok(
    mobileListSource.includes('data-testid="transaction-mobile-list"') &&
    mobileListSource.includes('category_name') &&
    mobileListSource.includes('formatCurrency'),
    'TransactionMobileList deve exibir itens compactos contendo categoria, status e valor formatado'
  );
});

// US-038 — Modal Unificado de Detalhes da Transação
test('AC-141: Abertura do card de detalhes da transação (Mobile e Desktop) @spec:AC-141', () => {
  const modalSource = readSource('components/transactions/TransactionDetailsModal.tsx');
  const appLayoutSource = readSource('layouts/AppLayout.tsx');
  const tableSource = readSource('components/transactions/TransactionTable.tsx');

  // AppLayout deve montar o modal globalmente
  assert.ok(
    appLayoutSource.includes('<TransactionDetailsModal />'),
    'AppLayout deve conter o TransactionDetailsModal montado no escopo global'
  );

  // TransactionTable deve abrir o modal de detalhes ao selecionar uma transação
  assert.ok(
    tableSource.includes('openDetailsModal(t') || tableSource.includes('openModal(t'),
    'TransactionTable deve invocar o modal de detalhes ao clicar na linha da transação'
  );

  // TransactionDetailsModal deve conter campos de leitura de dados essenciais
  assert.ok(
    modalSource.includes('data-testid="transaction-details-modal"') &&
    modalSource.includes('data-testid="transaction-details-value"') &&
    modalSource.includes('data-testid="transaction-details-description"'),
    'TransactionDetailsModal deve exibir detalhes completos em formato de modal limpo'
  );
});

// US-038 — Modal Unificado de Detalhes da Transação
test('AC-142: Ações de Edição e Exclusão a partir do Modal de Detalhes @spec:AC-142', () => {
  const modalSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  // Modal deve possuir botões para Editar e Excluir com os data-testids
  assert.ok(
    modalSource.includes('data-testid="btn-details-edit"') &&
    modalSource.includes('data-testid="btn-details-delete"'),
    'TransactionDetailsModal deve conter botões de Editar e Excluir'
  );

  // Modal deve executar os respectivos callbacks
  assert.ok(
    modalSource.includes('handleEdit') &&
    modalSource.includes('handleDelete'),
    'TransactionDetailsModal deve disparar os handlers de edição e exclusão'
  );
});

// US-039 — Centralização e Rastreabilidade do Sino de Notificações
test('AC-143: Popover de notificações centralizado horizontalmente @spec:AC-143', () => {
  const bellSource = readSource('components/layout/NotificationsBell.tsx');

  // Popover deve possuir classes de centralização horizontal
  assert.ok(
    bellSource.includes('data-testid="notifications-popover"') &&
    bellSource.includes('left-1/2') &&
    bellSource.includes('-translate-x-1/2'),
    'Popover de notificações deve ser centralizado horizontalmente relativo ao acionador'
  );
});

// US-039 — Centralização e Rastreabilidade do Sino de Notificações
test('AC-144: Navegação direta para detalhes da transação a partir do alerta vencido @spec:AC-144', () => {
  const bellSource = readSource('components/layout/NotificationsBell.tsx');

  // Ao clicar no item vencido, deve invocar o modal de detalhes e fechar o popover
  assert.ok(
    bellSource.includes('handleSelectOverdueItem') &&
    bellSource.includes('useTransactionDetailsModalStore.getState().openModal'),
    'Item vencido deve abrir o TransactionDetailsModal global'
  );

  assert.ok(
    bellSource.includes('data-testid={`overdue-item-${item.id}`}') &&
    bellSource.includes('onClick={() => handleSelectOverdueItem(item)}'),
    'Item de alerta vencido deve possuir testid e handler de seleção'
  );
});

// US-039 — Centralização e Rastreabilidade do Sino de Notificações
test('AC-145: Redirecionamento com filtro de vencidas ao clicar em \'Ver transações vencidas\' @spec:AC-145', () => {
  const bellSource = readSource('components/layout/NotificationsBell.tsx');
  const transactionsSource = readSource('pages/Transactions/index.tsx');

  // Botão/Link deve navegar para a rota de transações com o parâmetro status=expired
  assert.ok(
    bellSource.includes('data-testid="link-view-overdue"') &&
    bellSource.includes('/transactions?status=expired'),
    'Link deve apontar para transações com parâmetro status=expired'
  );

  // TransactionsPage deve ler searchParams e setar o status filtrado
  assert.ok(
    transactionsSource.includes('useSearchParams()') &&
    transactionsSource.includes("searchParams.get('status')"),
    'TransactionsPage deve aplicar o filtro de status vindo da query string'
  );
});

// US-040 — Customização e Visualização de Cartões de Crédito
test('AC-146: Exibição da data de compra nas transações da fatura @spec:AC-146', () => {
  // Dado: a aba de faturas e compras do cartão de crédito
  // Quando: a lista de transações da fatura é exibida
  // Então: cada item apresenta a data em que a despesa foi realizada de forma clara.
  assert.fail('critério de aceite AC-146 ainda não provado — implemente este teste');
});

// US-040 — Customização e Visualização de Cartões de Crédito
test('AC-147: Exibição do dia de vencimento fora da lista de transações @spec:AC-147', () => {
  // Dado: a tela de gestão do cartão de crédito
  // Quando: os detalhes do cartão ativo são visualizados
  // Então: a informação do dia de vencimento e fechamento da fatura é apresentada na seção de resumo/limite disponível, despoluindo as linhas individuais de transação.
  assert.fail('critério de aceite AC-147 ainda não provado — implemente este teste');
});

// US-040 — Customização e Visualização de Cartões de Crédito
test('AC-148: Modal de detalhes da transação a partir da fatura do cartão @spec:AC-148', () => {
  // Dado: a lista de transações da fatura do cartão
  // Quando: o usuário clica em qualquer compra
  // Então: o modal unificado de detalhes da transação é aberto com os dados completos do lançamento.
  assert.fail('critério de aceite AC-148 ainda não provado — implemente este teste');
});

// US-040 — Customização e Visualização de Cartões de Crédito
test('AC-149: Seletor de cores elegantes no cadastro de cartão @spec:AC-149', () => {
  // Dado: o modal de cadastro ou edição de cartão de crédito
  // Quando: o usuário preenche o formulário
  // Então: é disponibilizada uma paleta de cores selecionáveis em tons escuros e sofisticados (ex: azul petróleo, grafite, verde esmeralda, vinho, índigo), aplicando a cor escolhida ao cartão visual.
  assert.fail('critério de aceite AC-149 ainda não provado — implemente este teste');
});

// US-041 — Relatórios Financeiros Responsivos e Refinamento de Gráficos
test('AC-150: Zoom e navegação horizontal no gráfico de evolução mensal @spec:AC-150', () => {
  // Dado: o gráfico de evolução mensal de receitas versus despesas na tela de Relatórios
  // Quando: o usuário aciona a opção de zoom
  // Então: a escala do gráfico se ajusta permitindo arrastar horizontalmente para inspecionar meses específicos em detalhe.
  assert.fail('critério de aceite AC-150 ainda não provado — implemente este teste');
});

// US-041 — Relatórios Financeiros Responsivos e Refinamento de Gráficos
test('AC-151: Remoção do contorno preto ao interagir com gráficos @spec:AC-151', () => {
  // Dado: qualquer gráfico de barras ou pizza da tela de Relatórios e Dashboard
  // Quando: o usuário clica sobre uma barra, fatia ou elemento do gráfico
  // Então: o destaque visual ocorre sem a criação de borda escura/preta espessa ao redor do elemento.
  assert.fail('critério de aceite AC-151 ainda não provado — implemente este teste');
});

// US-041 — Relatórios Financeiros Responsivos e Refinamento de Gráficos
test('AC-152: Detalhamento DRE sem scroll horizontal no mobile @spec:AC-152', () => {
  // Dado: a seção de Detalhamento Mensal DRE em viewport mobile (< 768px)
  // Quando: os dados do relatório são apresentados
  // Então: o layout substitui a tabela larga por cards em grid multi-linhas, exibindo receitas, despesas e resultado sem necessidade de rolagem lateral.
  assert.fail('critério de aceite AC-152 ainda não provado — implemente este teste');
});

// US-041 — Relatórios Financeiros Responsivos e Refinamento de Gráficos
test('AC-153: Detalhamento por categoria e ranking de contrapartes sem scroll horizontal no mobile @spec:AC-153', () => {
  // Dado: os relatórios de despesas por categoria e ranking de contrapartes em viewport mobile (< 768px)
  // Quando: as listagens são exibidas
  // Então: as informações são apresentadas em formato compacto adaptado à largura da tela sem scroll horizontal.
  assert.fail('critério de aceite AC-153 ainda não provado — implemente este teste');
});

// US-042 — Correção e Validação no Cadastro de Métodos de Pagamento
test('AC-154: Exibição dinâmica de campos ao selecionar cartão de crédito @spec:AC-154', () => {
  // Dado: o modal de criação/edição de método de pagamento em Configurações
  // Quando: o usuário marca a opção indicando que é cartão de crédito
  // Então: o formulário exibe os campos pertinentes (como vínculo ao cartão de crédito cadastrado) e valida o preenchimento antes do salvamento.
  assert.fail('critério de aceite AC-154 ainda não provado — implemente este teste');
});

// US-042 — Correção e Validação no Cadastro de Métodos de Pagamento
test('AC-155: Validação completa de campos para outros métodos de pagamento @spec:AC-155', () => {
  // Dado: o formulário de método de pagamento para opções que não são cartão de crédito
  // Quando: o usuário cadastra ou altera o método
  // Então: todos os campos obrigatórios (nome, tipo, conta bancária associada) são validados e exibidos adequadamente.
  assert.fail('critério de aceite AC-155 ainda não provado — implemente este teste');
});
