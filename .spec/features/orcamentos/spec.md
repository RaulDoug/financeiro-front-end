# Spec: Orcamentos

> feature: orcamentos
> status: implementada

## Contexto

Planejamento preventivo e controle contínuo de metas de gastos por categoria de despesa, permitindo acompanhar em tempo real o teto orçado vs consumido, projetar sobras no caixa da carteira e gerenciar recorrências e meses atípicos no mobile e desktop.

## Histórias

### US-105 — Visualização do painel de orçamentos e resumo de metas

Como usuário da carteira ativa, quero visualizar minhas metas orçamentárias mensais e anuais por categoria, para controlar meus limites e evitar surpresas no final do mês.

#### AC-374 — Navegação e acesso à aba de orçamentos
- **Dado** que o usuário está autenticado em uma carteira ativa
- **Quando** acessa o menu lateral no desktop ou o menu inferior/mais no mobile
- **Então** visualiza a opção "Orçamentos" (`/budgets` ou `/orcamentos`) e ao clicar é direcionado para a página de orçamentos com o layout padrão do aplicativo.

#### AC-375 — Indicadores de resumo de caixa e metas (KPI cards)
- **Dado** que existem orçamentos cadastrados no mês selecionado
- **Quando** o usuário visualiza o topo da tela de orçamentos
- **Então** o sistema exibe 4 cards com: Total Orçado no Mês (`total_target`), Total Gasto nas Metas (`total_used`), Restante do Orçamento (`total_remaining_budget`) e Previsão de Sobra no Caixa (`forecasted_savings_if_budget_kept`) com tooltip explicativo.

#### AC-376 — Listagem visual de categorias com barra de progresso
- **Dado** que o usuário está na visão mensal
- **Quando** visualiza a lista de categorias orçadas
- **Então** cada card exibe o nome, ícone e cor da categoria, o valor planejado e gasto, e uma barra de progresso colorida: verde (< 80%), amarela (80% a 99%) e vermelha (>= 100%), informando o restante para gastar ou o valor estourado.

#### AC-377 — Alternância para visão anual com comparativo mês a mês
- **Dado** que o usuário deseja uma visão panorâmica do ano
- **Quando** altera o toggle de visualização de "Mensal" para "Anual"
- **Então** a API busca os dados anuais (`GET /api/budget?year=YYYY`) e exibe o gráfico de barras comparando mês a mês o total planejado vs total gasto.

### US-106 — Cadastro de orçamento e recorrência

Como usuário, quero definir metas de gastos para categorias de despesa, podendo aplicar metas avulsas ou recorrentes para os meses seguintes.

#### AC-378 — Cadastro de orçamento avulso para categoria de despesa
- **Dado** que estou no modal de novo orçamento
- **Quando** seleciono uma categoria de despesa (`expenses`), informo o valor da meta maior que zero, escolho o modo avulso (`single`) e confirmo
- **Então** a requisição `POST /api/budget/register` é enviada com sucesso e a lista e resumo são atualizados na tela.

#### AC-379 — Cadastro de orçamento recorrente com quantidade de meses
- **Dado** que desejo replicar a meta para os meses seguintes
- **Quando** seleciono o modo recorrente (`recurrent`) e defino a quantidade de meses (entre 2 e 12)
- **Então** a API cria os registros em lote com `recurrence_group_id` e o sistema exibe feedback de sucesso.

#### AC-380 — Alerta amigável de conflito para categoria já orçada no mês
- **Dado** que a categoria já possui orçamento cadastrado no mesmo mês e ano
- **Quando** o usuário tenta cadastrar novamente a mesma categoria
- **Então** a API retorna status 409 e o formulário exibe o aviso específico orientando a editar o orçamento existente em vez de criar um novo.

### US-107 — Manutenção, recálculo e exclusão com escopo

Como usuário, quero ajustar metas, lidar com meses atípicos, recalcular valores e remover orçamentos individuais ou recorrentes.

#### AC-381 — Edição de meta com seleção de escopo pontual ou cascata
- **Dado** que clico em editar um orçamento pertencente a um grupo recorrente
- **Quando** altero o valor e seleciono se a mudança vale apenas para este mês (`single`) ou para este e os próximos (`following`)
- **Então** a requisição `PATCH /api/budget/update/:id` é disparada com o payload adequado e os dados são atualizados.

#### AC-382 — Exclusão de orçamento com escopo para registros recorrentes
- **Dado** que solicito a exclusão de um orçamento recorrente
- **Quando** o diálogo de confirmação é exibido e escolho entre "apenas este mês" ou "este e todos os próximos"
- **Então** a requisição `DELETE /api/budget/delete/:id?scope=...` é executada e o item é removido da listagem.

#### AC-383 — Recálculo e sincronização sob demanda (auto-heal)
- **Dado** que transações de despesas foram alteradas ou confirmadas
- **Quando** clico no botão de recálculo/sincronização no card da categoria
- **Então** a requisição `PATCH /api/budget/recalculate_used_amount?category_id=...&year=...&month=...` é enviada e o gasto acumulado é revalidado instantaneamente.

## Fora de escopo

- Definição de orçamentos para categorias de receita (`incomings`) — o back-end proíbe explicitamente.
- Transferência direta de saldo de um orçamento para outro sem passar pela edição.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-001 | A rota `/budgets` será a rota canônica e `/orcamentos` será o alias no front-end. Na API a rota é estritamente `/budget`. | confirmada | Confirmado pelo usuário. |
| ASM-002 | Apenas categorias de despesa (`expenses`) serão carregadas no seletor de orçamento. | confirmada | Confirmado pelo usuário. |
| ASM-003 | Os modais seguirão o padrão nativo do app com gaveta no mobile (arraste para baixo) e diálogo no desktop. | confirmada | Confirmado pelo usuário. |

## Perguntas em aberto

| ID | Pergunta | Status | Resposta |
|---|---|---|---|
| Q-001 | Deseja que a barra de navegação inferior mobile (bottom nav) exiba Orçamentos como um dos 3 botões principais ou dentro do menu "Mais"? | respondida | Manter dentro do menu "Mais". |
| Q-002 | Na visão anual consolidada com gráfico mês a mês, prefere gráfico de barras duplas (Meta vs Gasto) ou barras empilhadas? | respondida | Barras duplas (Meta vs Gasto). |
