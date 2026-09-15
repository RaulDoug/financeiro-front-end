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
  // Dado: a página de Transações em viewport mobile (< 768px)
  // Quando: o topo da página é visualizado
  // Então: o botão de cabeçalho "Nova Transação" fica oculto, utilizando o botão (+) da barra inferior.
  assert.fail('critério de aceite AC-137 ainda não provado — implemente este teste');
});

// US-037 — Reorganização e Filtros Avançados na Tela de Transações
test('AC-138: Reorganização da barra de período e filtros de data no mobile @spec:AC-138', () => {
  // Dado: a barra de filtros da tela de transações em dispositivo móvel
  // Quando: os controles são renderizados
  // Então: o seletor de mês/ano fica posicionado na linha superior e os botões de atalho ("Este mês" e "Todas as datas") na linha inferior, contidos perfeitamente dentro dos limites do card sem transbordar.
  assert.fail('critério de aceite AC-138 ainda não provado — implemente este teste');
});

// US-037 — Reorganização e Filtros Avançados na Tela de Transações
test('AC-139: Botão e painel de Filtros Avançados (Desktop e Mobile) @spec:AC-139', () => {
  // Dado: a barra de filtros de transações em qualquer dispositivo
  // Quando: o usuário clica no botão "Filtros"
  // Então: abre-se um painel modal ou gaveta contendo opções para filtrar por categoria específica, método de pagamento, tipo e status, aplicando os filtros instantaneamente à lista.
  assert.fail('critério de aceite AC-139 ainda não provado — implemente este teste');
});

// US-037 — Reorganização e Filtros Avançados na Tela de Transações
test('AC-140: Visualização compacta de transações em lista mobile sem scroll horizontal @spec:AC-140', () => {
  // Dado: que o usuário visualiza a listagem de transações em viewport mobile (< 768px)
  // Quando: as transações são exibidas
  // Então: o layout adota uma lista de cards/itens compactos com descrição, chips de categoria/conta, data, valor e status, eliminando qualquer rolagem lateral.
  assert.fail('critério de aceite AC-140 ainda não provado — implemente este teste');
});

// US-038 — Modal Unificado de Detalhes da Transação
test('AC-141: Abertura do card de detalhes da transação (Mobile e Desktop) @spec:AC-141', () => {
  // Dado: uma transação na listagem de transações, fatura de cartão ou alertas do sino
  // Quando: o usuário clica sobre a linha ou card da transação
  // Então: abre-se um modal centralizado no mesmo estilo visual do modal de inclusão, exibindo todos os detalhes em modo somente-leitura (descrição, valor, tipo, categoria, conta/cartão, método de pagamento, data, status e observações).
  assert.fail('critério de aceite AC-141 ainda não provado — implemente este teste');
});

// US-038 — Modal Unificado de Detalhes da Transação
test('AC-142: Ações de Edição e Exclusão a partir do Modal de Detalhes @spec:AC-142', () => {
  // Dado: o modal de detalhes da transação aberto
  // Quando: o usuário aciona o botão "Editar" ou "Excluir"
  // Então: o botão "Editar" direciona para o formulário de edição daquela transação e o botão "Excluir" aciona a confirmação de exclusão com as opções pertinentes.
  assert.fail('critério de aceite AC-142 ainda não provado — implemente este teste');
});

// US-039 — Centralização e Rastreabilidade do Sino de Notificações
test('AC-143: Popover de notificações centralizado horizontalmente @spec:AC-143', () => {
  // Dado: o cabeçalho da aplicação em qualquer tamanho de tela
  // Quando: o usuário clica no sino de notificações
  // Então: o painel popover abre alinhado ao centro horizontal relativo ao header/viewport, sem transbordar para a borda direita da tela.
  assert.fail('critério de aceite AC-143 ainda não provado — implemente este teste');
});

// US-039 — Centralização e Rastreabilidade do Sino de Notificações
test('AC-144: Navegação direta para detalhes da transação a partir do alerta vencido @spec:AC-144', () => {
  // Dado: a lista de contas atrasadas no popover de notificações
  // Quando: o usuário clica em um item vencido
  // Então: o popover se fecha e o modal de detalhes daquela transação é aberto imediatamente na tela.
  assert.fail('critério de aceite AC-144 ainda não provado — implemente este teste');
});

// US-039 — Centralização e Rastreabilidade do Sino de Notificações
test('AC-145: Redirecionamento com filtro de vencidas ao clicar em \'Ver transações vencidas\' @spec:AC-145', () => {
  // Dado: o popover de notificações aberto
  // Quando: o usuário clica no botão "Ver transações vencidas"
  // Então: a aplicação navega para `/transactions` com o filtro pré-ativado para exibir apenas as transações vencidas/em atraso.
  assert.fail('critério de aceite AC-145 ainda não provado — implemente este teste');
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
