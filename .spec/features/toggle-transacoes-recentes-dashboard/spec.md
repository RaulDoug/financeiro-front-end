# Spec: Toggle e Filtro de Mês em Transações Recentes do Dashboard

> feature: toggle-transacoes-recentes-dashboard  
> status: implementada  

## Contexto

No Dashboard do FinFlow, o componente `RecentTransactions` exibe as últimas 5 transações registradas. O endpoint utilizado pelo back-end (`/dashboard-report/recent-transactions`) ordena os registros de forma decrescente pela data mais futura (`COALESCE(purchase_date, due_date, created_at) DESC`). Quando o usuário realiza lançamentos previstos para meses futuros, essas transações futuras sobrepõem as transações correntes e ocupam todo o espaço das transações recentes.

Além disso, o usuário deseja poder alternar entre ver as transações pertinentes ao mês atual (mês selecionado no Dashboard) e ver as transações de forma geral (comportamento padrão atual).

Esta especificação define a inclusão de um botão toggle ("Mês atual" / "Geral") no card de transações recentes, definindo o modo "Mês atual" como padrão e garantindo a exclusão de lançamentos de meses futuros na visão mensal, além de persistência da preferência e navegação contextual em "Ver todas".

---

## Histórias

### US-095 — Alternância e Filtragem de Transações Recentes por Mês no Dashboard

Como usuário acompanhando o Dashboard financeiro,  
quero visualizar por padrão as transações recentes do mês atual sem poluição de meses futuros, com opção de alternar para a visão geral,  
para ter clareza imediata das movimentações do mês sem perder o acesso ao histórico amplo quando desejado.

#### AC-338 — Visualização padrão filtrada pelo mês atual/selecionado
- **Dado** que o usuário acessa o Dashboard
- **Quando** o card de Transações Recentes é carregado
- **Então** por padrão (`mode = 'month'`), são buscadas e exibidas as transações compreendidas no intervalo do mês atual/selecionado (`due_date_from` e `due_date_to`), excluindo qualquer transação de meses futuros.

#### AC-339 — Botão toggle com estados "Mês atual" e "Geral"
- **Dado** o cabeçalho do card de Transações Recentes no Dashboard
- **Quando** o componente é renderizado
- **Então** exibe um controle segmented pill (`data-testid="recent-tx-toggle-group"`) com os botões "Mês atual" (`data-testid="toggle-recent-month"`) e "Geral" (`data-testid="toggle-recent-all"`), destacando visualmente o modo ativo e permitindo alternância instantânea com transições suaves.

#### AC-340 — Modo "Geral" preservando histórico amplo
- **Dado** que o usuário clica no botão "Geral" do toggle
- **Quando** o estado é alternado
- **Então** o componente exibe as transações recentes gerais da carteira consultando o serviço de relatório de transações recentes, respeitando o comportamento global original.

#### AC-341 — Navegação contextual em "Ver todas" e persistência da preferência
- **Dado** o card de Transações Recentes
- **Quando** o usuário clica no link "Ver todas" (`data-testid="link-view-all-transactions"`)
- **Então** se o modo for "Mês atual", a navegação direciona para `/transacoes` com os parâmetros `due_date_from` e `due_date_to` do mês ativo; se for "Geral", direciona para `/transacoes`. A preferência de modo selecionada é salva na store de filtros (`useFilterStore`).
