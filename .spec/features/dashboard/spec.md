# Spec: Dashboard

> feature: dashboard
> status: concluída

## Contexto

A página inicial (Dashboard) oferece um panorama financeiro imediato, reunindo saldos, gráficos de receitas/despesas, alertas de atrasos, cartões e atalhos rápidos para lançamentos.

## Histórias

### US-008 — Visão geral da saúde financeira

Como usuário, quero visualizar os indicadores principais e saldo de contas logo ao entrar no sistema, para ter ciência imediata da minha situação financeira.

#### AC-029 — Cartões de KPI Principais
- **Dado** que o usuário está na tela inicial
- **Quando** o dashboard é carregado
- **Então** ele deve visualizar cartões de KPI mostrando o Saldo Total, Entradas Realizadas, Saídas Realizadas e Sobra Projetada do mês atual.

#### AC-030 — Saldos das Contas
- **Dado** que o usuário quer ver onde está seu dinheiro
- **Quando** ele visualiza a seção de contas no dashboard
- **Então** ele deve ver uma lista sumarizada de saldos por conta (ex: Banco X: R$ 100, Corretora Y: R$ 500).

#### AC-031 — Resumo de Cartões de Crédito
- **Dado** que o usuário possui cartões de crédito configurados
- **Quando** ele navega pela tela
- **Então** ele vê o limite disponível e a fatura atual de cada cartão.

#### AC-032 — Estado vazio para KPIs
- **Dado** que é uma carteira totalmente nova sem dados
- **Quando** os KPIs são carregados
- **Então** os cartões devem exibir valores zerados graciosamente, sem erros.

#### AC-033 — Lista de transações recentes
- **Dado** que o usuário quer ver o que aconteceu por último
- **Quando** ele visualiza a lista de "Transações Recentes" (máximo 5)
- **Então** ele vê as movimentações ordenadas logicamente, utilizando data de pagamento, compra ou vencimento.

#### AC-034 — Transações recentes vazias
- **Dado** que não existem transações cadastradas
- **Quando** a área de recentes é renderizada
- **Então** uma mensagem amigável "Nenhuma transação recente" deve aparecer.

### US-009 — Análise gráfica de gastos

Como usuário, quero ver gráficos do meu fluxo de caixa e de categorias de despesas, para entender melhor meu comportamento financeiro.

#### AC-035 — Gráfico de Receitas vs Despesas (Barras com seletor de ano)
- **Dado** que o usuário está visualizando o gráfico de fluxo de caixa
- **Quando** ele observa o componente ou altera o ano através do seletor (< Ano >)
- **Então** ele visualiza a comparação mensal (12 meses) de entradas e saídas em barras agrupadas correspondentes ao ano selecionado (padrão: ano corrente)

#### AC-036 — Gráfico de Despesas por Categoria (Rosca)
- **Dado** que há despesas no período
- **Quando** o usuário observa a distribuição
- **Então** ele deve visualizar um gráfico de rosca mostrando a proporção gasta em categorias (Moradia, Alimentação, etc.).

#### AC-037 — Interatividade nos gráficos
- **Dado** que os gráficos estão visíveis
- **Quando** o usuário passa o mouse sobre uma barra ou fatia da rosca
- **Então** um tooltip deve surgir mostrando o valor monetário exato e o nome da categoria ou mês.

#### AC-038 — Tratamento de gráficos sem dados
- **Dado** que não houve movimentações
- **Quando** o gráfico tenta renderizar
- **Então** um estado vazio ilustrado com a mensagem "Não há dados suficientes para exibição" deve substituir o gráfico.

### US-010 — Alertas e Ações Rápidas

Como usuário, quero ser notificado de contas atrasadas e ter atalhos para lançar dados, para manter meu fluxo rápido e preciso.

#### AC-039 — Alertas de Atraso
- **Dado** que o usuário possui contas vencidas e não pagas
- **Quando** ele entra no dashboard
- **Então** deve aparecer uma seção de "Alertas" indicando a quantidade de itens em atraso e o detalhamento de quantos dias passaram.

#### AC-040 — Estado "Tudo em dia"
- **Dado** que o usuário não tem contas vencidas
- **Quando** ele observa a seção de alertas
- **Então** ele deve ver uma mensagem positiva, como "Tudo em dia!".

#### AC-041 — Ações rápidas de lançamento (Receita/Despesa)
- **Dado** que o usuário clica em "+ Nova Receita" ou "+ Nova Despesa"
- **Quando** ele executa a ação
- **Então** o modal global de transação deve abrir, já pré-selecionado para o tipo correspondente.

#### AC-042 — Ação rápida de transferência
- **Dado** que o usuário clica em "⇄ Transferência"
- **Quando** ele executa a ação
- **Então** o modal global de transferência entre contas deve abrir.

## Fora de escopo

- Filtros avançados de datas no dashboard (o dashboard é uma visão rápida; relatórios avançados ficam no módulo Relatórios).
- Pagamento direto de contas atrasadas pelo dashboard (redirecionar para Transações).

## Suposições

| ID      | Suposição                                                                                                            | Status     | Resolução                                                   |
| ------- | -------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------- |
| ASM-011 | Endpoints do dashboard (`/api/dashboard-report/*`) retornam dados do mês/ano atual por padrão quando não informados. | confirmada | Confirmado conforme comportamento padrão da API.            |
| ASM-012 | O limite de 5 transações recentes é suficiente; atalho "Ver Todas" redireciona para a página de Transações.          | confirmada | Confirmado conforme layout e spec.                          |
| ASM-013 | Os modais disparados pelos botões de Ações Rápidas são gerenciados globalmente por Zustand stores.                   | confirmada | Confirmado: store Zustand para abertura dos modais globais. |

## Perguntas em aberto

| ID    | Pergunta                                                                                                                                 | Status     | Resposta                                                                                                                           |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Q-009 | O usuário deveria poder alternar o ano exibido no gráfico de Receitas vs Despesas diretamente no dashboard?                              | respondida | Sim, o componente do gráfico possui controles de navegação de ano (< 2026 >) iniciando no ano corrente.                            |
| Q-010 | As "Entradas e Saídas Realizadas" exibidas nos KPIs incluem os valores pendentes ou são estritamente o que já foi compensado?            | respondida | Estritamente os lançamentos compensados (completed); valores pendentes aparecem nos cards secundários e compõem a Sobra Projetada. |
| Q-011 | Há necessidade de um sistema de auto-refresh no dashboard, ou os dados atualizam apenas quando o cache é invalidado em ações do usuário? | respondida | Atualização reativa por invalidação de cache (mutações, troca de carteira, foco na aba) com botão de recarga manual no topo.       |
