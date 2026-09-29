# Spec: Gráfico de Pizza em Relatórios e Filtro de Categorias em Transações

> feature: grafico-pizza-e-filtro-categorias-relatorios
> status: implementada

## Contexto

Na tela de Relatórios (`CategoryReport`), o gráfico de despesas por categoria (`CategoryChart`) utiliza o componente SVG `<Legend>` nativo do Recharts com dimensões estáticas (`innerRadius={65}`, `outerRadius={95}`) e sem estilização Tailwind de dark mode. Em telas de dispositivos móveis, os elementos SVG extrapolam a largura do card, quebrando a disposição visual e provocando overflow horizontal indesejado. No desktop, o gráfico aparenta ser muito espesso e desalinhado com o design limpo do dashboard (`CategoryExpenseChart`).

Além disso, na seção "Detalhamento por Categoria", ao visualizar o ranking de gastos tanto no layout mobile (cards) quanto no desktop (tabela), os itens não respondem ao toque ou clique. O usuário precisa sair da tela de relatórios, navegar até a página de transações e abrir o modal de filtros avançados manualmente para inspecionar os lançamentos que originaram aquele gasto.

Esta feature unifica visualmente o gráfico de pizza de relatórios com o padrão aprovado da Dashboard e torna as categorias clicáveis, redirecionando o usuário para a listagem de transações com o filtro correspondente aplicado.

---

## Histórias

### US-093 — Contenção e Harmonização Visual do Gráfico de Pizza de Relatórios

Como usuário do FinFlow visualizando os relatórios financeiros, quero que o gráfico de pizza de despesas por categoria tenha layout contido, legenda fluida em HTML e tema escuro harmonizado com o Dashboard, para que a visualização seja elegante e sem quebras em qualquer tamanho de tela.

#### AC-334 — Remoção do Legend SVG e introdução de Legenda Customizada Contida

- **Dado** que o usuário acessa a aba de "Despesas por Categoria" na tela de Relatórios
- **Quando** o gráfico de despesas por categoria for renderizado
- **Então** ele deve utilizar container com altura contida (`h-48`), `innerRadius={55}`, `outerRadius={75}` e substituir o `<Legend>` SVG do Recharts por container HTML (`data-testid="category-custom-legend"`) com scroll vertical suave (`max-h-28 overflow-y-auto px-1`) e truncamento de texto, evitando qualquer transbordamento do card.

#### AC-335 — Alinhamento visual e suporte a dark mode com o padrão do Dashboard

- **Dado** que o gráfico de despesas por categoria é exibido em telas desktop ou mobile com tema claro ou escuro
- **Quando** a visualização for montada
- **Então** o card deve adotar o cabeçalho padronizado com ícone `PieChart`, bordas suaves, paleta cromática `COLORS` consistente com a Dashboard e classes `dark:bg-slate-900` e `dark:border-slate-800`.

---

### US-094 — Navegação com Filtro de Categoria a partir do Detalhamento

Como usuário analisando o relatório de gastos por categoria, quero clicar em qualquer categoria do detalhamento e ser levado diretamente para a listagem de transações com aquela categoria e período selecionados, para consultar os lançamentos individuais de forma imediata.

#### AC-336 — Clique na categoria detalhada redireciona para transações com filtro aplicado

- **Dado** que o usuário está na tela de Relatórios e visualiza o detalhamento de categorias (mobile ou desktop)
- **Quando** clicar sobre uma linha de categoria na tabela ou card mobile
- **Então** o sistema navega imediatamente para a rota `/transactions`, aplicando o filtro com o identificador da categoria clicada (`category_id`) e atualizando a visualização de lançamentos.

#### AC-337 — Preservação de período do relatório e sincronização de query params

- **Dado** que o usuário selecionou um intervalo de datas específico no filtro do relatório
- **Quando** a navegação para transações for acionada pelo clique na categoria
- **Então** a URL de destino deve conter os parâmetros de consulta (`category_id`, `due_date_from` e `due_date_to`), e a página `TransactionsPage` sincroniza tanto a store de filtros quanto a requisição da API de transações.

---

## Fora de escopo

- Alterações em arquivos do back-end (`API_Financeiro`), estritamente somente leitura.
- Alteração no cálculo numérico retornado pelo endpoint de agregação de categorias.

---

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-087 | A estrutura HTML customizada de legenda utilizada em `CategoryExpenseChart.tsx` (Dashboard) previne o transbordamento no mobile e unifica a experiência visual da aplicação. | confirmada | Comprovada no Dashboard pelo teste AC-302 e AC-303. |
| ASM-088 | O serviço `transactionService.getTransactions` já suporta o recebimento e serialização de `category_id`, `due_date_from` e `due_date_to`. | confirmada | Confirmado pela leitura de `transactionService.ts` e `types/transaction.ts`. |

---

## Perguntas em aberto

| ID | Pergunta | Status | Resposta |
|---|---|---|---|
| Q-048 | Ao navegar para transações a partir do relatório, o intervalo de datas do relatório deve ser repassado? | respondida | Sim, preservando a coerência entre os totais informados no relatório e os registros exibidos na listagem. |
| Q-049 | O clique deve ser suportado tanto na listagem mobile quanto na tabela desktop? | respondida | Sim, em ambos os layouts com feedback de cursor pointer e hover. |
