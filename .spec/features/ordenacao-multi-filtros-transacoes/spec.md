# Spec: Ordenação por Colunas e Filtro Multi-Seleção em Transações

> feature: ordenacao-multi-filtros-transacoes
> status: implementada

## Contexto

Na tela de Transações, os usuários precisam de maior flexibilidade para auditar e localizar movimentações financeiras. Atualmente, a ordenação na tabela é fixa por data de vencimento e os filtros avançados permitem selecionar apenas uma categoria por vez. Esta funcionalidade introduz a ordenação interativa por qualquer coluna da tabela (Descrição, Compra, Vencimento, Pagamento, Conta, Valor e Status) e a capacidade de selecionar múltiplos itens nos filtros (com destaque para múltiplas categorias simultâneas). O back-end (`API_Financeiro`) já suporta nativamente ordenação por essas colunas e filtro com array de UUIDs (`ANY($X::uuid[])`), portanto todas as alterações ocorrem no front-end.

## Histórias

### US-087 — Ordenação Interativa por Colunas da Tabela de Transações

Como usuário da listagem de transações, quero clicar nos cabeçalhos das colunas da tabela para ordenar os lançamentos de forma crescente ou decrescente, para encontrar rapidamente transações por valor, descrição, data de compra ou status.

#### AC-320 — Cabeçalhos interativos e alternância de ordenação na tabela desktop

- **Dado** que o usuário está visualizando a tabela de transações no desktop
- **Quando** o usuário clica no cabeçalho de uma coluna ordenável (`Descrição`, `Compra`, `Vencimento`, `Pagamento`, `Conta / Cartão`, `Valor` ou `Status`)
- **Então** a listagem é reordenada pelo campo correspondente (`description`, `purchase_date`, `due_date`, `payment_date`, `bank_account_name`, `value` ou `status`), exibindo um indicador visual de direção (ícone indicando ASC ou DESC), e ao clicar novamente na mesma coluna, a direção é invertida entre ASC e DESC.

#### AC-321 — Preservação e sincronização da ordenação na barra de filtros

- **Dado** que uma coluna e direção de ordenação foram selecionadas pelo usuário
- **Quando** o usuário altera filtros de tipo, status, mês ou texto de busca
- **Então** a ordenação ativa (`order_by` e `order_dir`) é preservada sem ser forçadamente resetada para vencimento decrescente, e o botão de ordenação na barra de filtros reflete o campo e direção ativos.

### US-088 — Filtro com Seleção Múltipla de Categorias e Entidades

Como usuário analisando gastos, quero selecionar 2 ou mais categorias (e opcionalmente contas e métodos) simultaneamente nos filtros, para que a listagem exiba todas as transações pertencentes a qualquer uma das categorias escolhidas.

#### AC-322 — Interface de multi-seleção de categorias com contagem e chips

- **Dado** que o modal/popover de filtros avançados está aberto
- **Quando** o usuário interage com o seletor de Categorias
- **Então** é exibido um seletor múltiplo permitindo marcar 2 ou mais categorias, apresentando a contagem de itens selecionados e permitindo desmarcar individualmente ou limpar a seleção.

#### AC-323 — Consulta e filtragem na API com múltiplos identificadores

- **Dado** que 2 ou mais categorias foram selecionadas nos filtros avançados
- **Quando** o usuário clica em "Aplicar Filtros"
- **Então** o front-end envia a requisição à API com todos os `category_id` selecionados (via query params repetidos suportados pela API), retornando transações das categorias especificadas, e a consulta de transações vencidas anteriores (`pastOverdueData`) respeita esses mesmos filtros.

#### AC-324 — Limpeza e restauração completa dos filtros múltiplos

- **Dado** que filtros múltiplos de categorias estão aplicados na tela
- **Quando** o usuário clica em "Limpar filtros" ou redefine os filtros avançados
- **Então** todos os filtros selecionados são desmarcados e a listagem retorna ao estado padrão de todas as categorias sem erros na interface.

## Fora de escopo

- Alterações em arquivos do back-end (`API_Financeiro`), que é somente leitura e já possui suporte completo a ordenação e filtros em array.
- Multi-seleção na tela de lançamentos rápidos mobile (`MobileQuickEntry`), que permanece com seleção unitária por transação individual.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-081 | O endpoint GET `/transaction` do back-end aceita múltiplos parâmetros `category_id` na query string (`category_id=id1&category_id=id2`) convertendo internamente para array com operador ANY SQL. | confirmada | Confirmado pela inspeção de `transactionSchema.js`, `transactionServices.js` e `findTransaction.test.js` na API_Financeiro |
| ASM-082 | A ordenação padrão inicial continua sendo por data de vencimento decrescente (`due_date`, `DESC`) para preservar a experiência usual até intervenção do usuário. | confirmada | Alinhado com o comportamento padrão das telas do sistema |

## Perguntas em aberto

| ID | Perguntas | Status | Resposta |
|---|---|---|---|
| Q-045 | Além de categorias, a multi-seleção deve estar disponível também para Contas Bancárias e Métodos de Pagamento nos filtros avançados? | respondida | Sim, padronizar o seletor múltiplo em Categorias, Contas e Métodos de Pagamento oferece uma experiência uniforme e completa ao usuário. |
