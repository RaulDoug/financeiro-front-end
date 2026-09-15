# Plano de execução — melhorias-ux-mobile-desktop

> gerado por `onp-spec plano` em 2026-09-15 11:29 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano melhorias-ux-mobile-desktop --sequencial`

## Resumo — o que vai acontecer

- **modo SEQUENCIAL (escolha do usuário)**: 10 tarefa(s) pendente(s), UMA APÓS A OUTRA, na árvore principal
- sem worktrees e sem paralelismo — cada tarefa roda numa janela de contexto limpa, na ordem do tasks.md
- tudo acontece na branch de trabalho `spec/melhorias-ux-mobile-desktop`; levar para a main é decisão sua

## Ordem de execução (uma tarefa após a outra)

| tarefa | título | modelo | esforço |
|---|---|---|---|
| T-093 | Ocultação de elementos redundantes e ajuste de fontes/cards no Mobile e Dashboard | `claude-sonnet-5` | medium |
| T-094 | Seletor de mês/ano e gráfico com scroll horizontal na Dashboard | `claude-sonnet-5` | medium |
| T-095 | Reorganização de filtros e painel de Filtros Avançados na tela de Transações | `claude-sonnet-5` | medium |
| T-096 | Visualização compacta de transações em lista mobile sem scroll horizontal | `claude-sonnet-5` | medium |
| T-097 | Modal global unificado de Detalhes da Transação com ações de edição e exclusão | `claude-sonnet-5` | medium |
| T-098 | Centralização do popover de notificações e navegações do sino | `claude-sonnet-5` | medium |
| T-099 | Customização de cores, data da compra e detalhes na fatura de Cartões de Crédito | `claude-sonnet-5` | medium |
| T-100 | Responsividade sem scroll lateral e limpeza visual de gráficos nos Relatórios | `claude-sonnet-5` | medium |
| T-101 | Correção dinâmica e validação de formulário em Métodos de Pagamento | `claude-sonnet-5` | medium |
| T-102 | Testes Automatizados de Especificação da Feature | `claude-sonnet-5` | medium |

## Gestão de branches e commits

1. branch de trabalho `spec/melhorias-ux-mobile-desktop` criada do ponto atual (se ainda não existir)
2. as tarefas rodam nela mesma, na ordem — **1 tarefa = 1 commit** (`T-xxx feature: título`), marcada `[concluida]` só com trabalho feito
3. gate final na branch de trabalho: `onp-spec verify melhorias-ux-mobile-desktop` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Sequencial no Antigravity (uma tarefa após a outra, sem Claude CLI)

1. **Entre na branch de trabalho** (terminal, na raiz do repositório):

```bash
git checkout -b spec/melhorias-ux-mobile-desktop   # ou: git checkout spec/melhorias-ux-mobile-desktop
```

2. **Execute as tarefas NA ORDEM, uma após a outra** (janela limpa por tarefa
   ajuda o foco; a próxima só começa quando a anterior commitou):

#### Prompt — T-093

```
Você executa UMA tarefa da feature "melhorias-ux-mobile-desktop" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/melhorias-ux-mobile-desktop/spec.md, .spec/features/melhorias-ux-mobile-desktop/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-093 — "Ocultação de elementos redundantes e ajuste de fontes/cards no Mobile e Dashboard"
  critérios/refs: AC-133 (Ocultação de ações redundantes e menu hambúrguer no mobile), AC-134 (Tipografia fluida e responsiva nos cards da Dashboard)
  arquivos permitidos (e seus testes): src/components/layout/Topbar.tsx, src/pages/Dashboard/components/QuickActions.tsx, src/pages/Dashboard/components/KpiCards.tsx
  mensagem de commit: "T-093 melhorias-ux-mobile-desktop: Ocultação de elementos redundantes e ajuste de fontes/cards no Mobile e Dashboard"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa melhorias-ux-mobile-desktop T-093 concluida` após o commit.

#### Prompt — T-094

```
Você executa UMA tarefa da feature "melhorias-ux-mobile-desktop" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/melhorias-ux-mobile-desktop/spec.md, .spec/features/melhorias-ux-mobile-desktop/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-094 — "Seletor de mês/ano e gráfico com scroll horizontal na Dashboard"
  critérios/refs: AC-135 (Filtro de mês e ano no Dashboard), AC-136 (Scroll horizontal e barras condensadas no gráfico de Receitas x Despesas da Dashboard)
  arquivos permitidos (e seus testes): src/pages/Dashboard/DashboardPage.tsx, src/pages/Dashboard/components/IncomeExpenseChart.tsx, src/hooks/useDashboardData.ts
  mensagem de commit: "T-094 melhorias-ux-mobile-desktop: Seletor de mês/ano e gráfico com scroll horizontal na Dashboard"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa melhorias-ux-mobile-desktop T-094 concluida` após o commit.

#### Prompt — T-095

```
Você executa UMA tarefa da feature "melhorias-ux-mobile-desktop" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/melhorias-ux-mobile-desktop/spec.md, .spec/features/melhorias-ux-mobile-desktop/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-095 — "Reorganização de filtros e painel de Filtros Avançados na tela de Transações"
  critérios/refs: AC-137 (Ocultação do botão de nova transação no mobile), AC-138 (Reorganização da barra de período e filtros de data no mobile), AC-139 (Botão e painel de Filtros Avançados (Desktop e Mobile))
  arquivos permitidos (e seus testes): src/pages/Transactions/index.tsx, src/components/transactions/TransactionFilters.tsx, src/components/transactions/TransactionAdvancedFiltersModal.tsx
  mensagem de commit: "T-095 melhorias-ux-mobile-desktop: Reorganização de filtros e painel de Filtros Avançados na tela de Transações"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa melhorias-ux-mobile-desktop T-095 concluida` após o commit.

#### Prompt — T-096

```
Você executa UMA tarefa da feature "melhorias-ux-mobile-desktop" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/melhorias-ux-mobile-desktop/spec.md, .spec/features/melhorias-ux-mobile-desktop/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-096 — "Visualização compacta de transações em lista mobile sem scroll horizontal"
  critérios/refs: AC-140 (Visualização compacta de transações em lista mobile sem scroll horizontal)
  arquivos permitidos (e seus testes): src/components/transactions/TransactionTable.tsx, src/components/transactions/TransactionMobileList.tsx
  mensagem de commit: "T-096 melhorias-ux-mobile-desktop: Visualização compacta de transações em lista mobile sem scroll horizontal"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa melhorias-ux-mobile-desktop T-096 concluida` após o commit.

#### Prompt — T-097

```
Você executa UMA tarefa da feature "melhorias-ux-mobile-desktop" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/melhorias-ux-mobile-desktop/spec.md, .spec/features/melhorias-ux-mobile-desktop/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-097 — "Modal global unificado de Detalhes da Transação com ações de edição e exclusão"
  critérios/refs: AC-141 (Abertura do card de detalhes da transação (Mobile e Desktop)), AC-142 (Ações de Edição e Exclusão a partir do Modal de Detalhes)
  arquivos permitidos (e seus testes): src/stores/transactionDetailsModal.store.ts, src/components/transactions/TransactionDetailsModal.tsx, src/layouts/AppLayout.tsx
  mensagem de commit: "T-097 melhorias-ux-mobile-desktop: Modal global unificado de Detalhes da Transação com ações de edição e exclusão"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa melhorias-ux-mobile-desktop T-097 concluida` após o commit.

#### Prompt — T-098

```
Você executa UMA tarefa da feature "melhorias-ux-mobile-desktop" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/melhorias-ux-mobile-desktop/spec.md, .spec/features/melhorias-ux-mobile-desktop/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-098 — "Centralização do popover de notificações e navegações do sino"
  critérios/refs: AC-143 (Popover de notificações centralizado horizontalmente), AC-144 (Navegação direta para detalhes da transação a partir do alerta vencido), AC-145 (Redirecionamento com filtro de vencidas ao clicar em 'Ver transações vencidas')
  arquivos permitidos (e seus testes): src/components/layout/NotificationsBell.tsx
  mensagem de commit: "T-098 melhorias-ux-mobile-desktop: Centralização do popover de notificações e navegações do sino"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa melhorias-ux-mobile-desktop T-098 concluida` após o commit.

#### Prompt — T-099

```
Você executa UMA tarefa da feature "melhorias-ux-mobile-desktop" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/melhorias-ux-mobile-desktop/spec.md, .spec/features/melhorias-ux-mobile-desktop/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-099 — "Customização de cores, data da compra e detalhes na fatura de Cartões de Crédito"
  critérios/refs: AC-146 (Exibição da data de compra nas transações da fatura), AC-147 (Exibição do dia de vencimento fora da lista de transações), AC-148 (Modal de detalhes da transação a partir da fatura do cartão), AC-149 (Seletor de cores elegantes no cadastro de cartão)
  arquivos permitidos (e seus testes): src/pages/CreditCardsPage.tsx, src/components/credit-cards/TransactionList.tsx, src/components/credit-cards/CreditCardModal.tsx, src/components/credit-cards/CreditCardVisual.tsx
  mensagem de commit: "T-099 melhorias-ux-mobile-desktop: Customização de cores, data da compra e detalhes na fatura de Cartões de Crédito"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa melhorias-ux-mobile-desktop T-099 concluida` após o commit.

#### Prompt — T-100

```
Você executa UMA tarefa da feature "melhorias-ux-mobile-desktop" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/melhorias-ux-mobile-desktop/spec.md, .spec/features/melhorias-ux-mobile-desktop/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-100 — "Responsividade sem scroll lateral e limpeza visual de gráficos nos Relatórios"
  critérios/refs: AC-150 (Zoom e navegação horizontal no gráfico de evolução mensal), AC-151 (Remoção do contorno preto ao interagir com gráficos), AC-152 (Detalhamento DRE sem scroll horizontal no mobile), AC-153 (Detalhamento por categoria e ranking de contrapartes sem scroll horizontal no mobile)
  arquivos permitidos (e seus testes): src/pages/ReportsPage.tsx, src/components/reports/MonthlyDreReport.tsx, src/components/reports/CategoryExpensesReport.tsx, src/components/reports/CounterpartyReport.tsx
  mensagem de commit: "T-100 melhorias-ux-mobile-desktop: Responsividade sem scroll lateral e limpeza visual de gráficos nos Relatórios"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa melhorias-ux-mobile-desktop T-100 concluida` após o commit.

#### Prompt — T-101

```
Você executa UMA tarefa da feature "melhorias-ux-mobile-desktop" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/melhorias-ux-mobile-desktop/spec.md, .spec/features/melhorias-ux-mobile-desktop/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-101 — "Correção dinâmica e validação de formulário em Métodos de Pagamento"
  critérios/refs: AC-154 (Exibição dinâmica de campos ao selecionar cartão de crédito), AC-155 (Validação completa de campos para outros métodos de pagamento)
  arquivos permitidos (e seus testes): src/pages/SettingsPage.tsx, src/components/settings/PaymentMethodModal.tsx
  mensagem de commit: "T-101 melhorias-ux-mobile-desktop: Correção dinâmica e validação de formulário em Métodos de Pagamento"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa melhorias-ux-mobile-desktop T-101 concluida` após o commit.

#### Prompt — T-102

```
Você executa UMA tarefa da feature "melhorias-ux-mobile-desktop" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/melhorias-ux-mobile-desktop/spec.md, .spec/features/melhorias-ux-mobile-desktop/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-102 — "Testes Automatizados de Especificação da Feature"
  critérios/refs: AC-133 (Ocultação de ações redundantes e menu hambúrguer no mobile), AC-134 (Tipografia fluida e responsiva nos cards da Dashboard), AC-135 (Filtro de mês e ano no Dashboard), AC-136 (Scroll horizontal e barras condensadas no gráfico de Receitas x Despesas da Dashboard), AC-137 (Ocultação do botão de nova transação no mobile), AC-138 (Reorganização da barra de período e filtros de data no mobile), AC-139 (Botão e painel de Filtros Avançados (Desktop e Mobile)), AC-140 (Visualização compacta de transações em lista mobile sem scroll horizontal), AC-141 (Abertura do card de detalhes da transação (Mobile e Desktop)), AC-142 (Ações de Edição e Exclusão a partir do Modal de Detalhes), AC-143 (Popover de notificações centralizado horizontalmente), AC-144 (Navegação direta para detalhes da transação a partir do alerta vencido), AC-145 (Redirecionamento com filtro de vencidas ao clicar em 'Ver transações vencidas'), AC-146 (Exibição da data de compra nas transações da fatura), AC-147 (Exibição do dia de vencimento fora da lista de transações), AC-148 (Modal de detalhes da transação a partir da fatura do cartão), AC-149 (Seletor de cores elegantes no cadastro de cartão), AC-150 (Zoom e navegação horizontal no gráfico de evolução mensal), AC-151 (Remoção do contorno preto ao interagir com gráficos), AC-152 (Detalhamento DRE sem scroll horizontal no mobile), AC-153 (Detalhamento por categoria e ranking de contrapartes sem scroll horizontal no mobile), AC-154 (Exibição dinâmica de campos ao selecionar cartão de crédito), AC-155 (Validação completa de campos para outros métodos de pagamento)
  arquivos permitidos (e seus testes): test/melhorias-ux-mobile-desktop.spec.test.js
  mensagem de commit: "T-102 melhorias-ux-mobile-desktop: Testes Automatizados de Especificação da Feature"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa melhorias-ux-mobile-desktop T-102 concluida` após o commit.

3. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify melhorias-ux-mobile-desktop
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

4. **Acompanhamento (a cada ~1 min, enquanto executa)**: avise ANTES de começar
   que o trabalho roda em background e que o resumo completo vem ao final. Marque
   cada tarefa no ledger ao começar e ao terminar (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-melhorias-ux-mobile-desktop-mu2lag87 --tipo tarefa --tarefa <T-xxx> --faixa seq --estado executando   # ao começar
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-melhorias-ux-mobile-desktop-mu2lag87 --tipo tarefa --tarefa <T-xxx> --faixa seq --estado concluida    # após o commit
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo melhorias-ux-mobile-desktop --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo melhorias-ux-mobile-desktop --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

