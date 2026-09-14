# Plano de execução — dashboard

> gerado por `onp-spec plano` em 2026-09-14 20:41 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano dashboard --sequencial`

## Resumo — o que vai acontecer

- **modo SEQUENCIAL (escolha do usuário)**: 9 tarefa(s) pendente(s), UMA APÓS A OUTRA, na árvore principal
- sem worktrees e sem paralelismo — cada tarefa roda numa janela de contexto limpa, na ordem do tasks.md
- tudo acontece na branch de trabalho `spec/dashboard`; levar para a main é decisão sua

## Ordem de execução (uma tarefa após a outra)

| tarefa | título | modelo | esforço |
|---|---|---|---|
| T-022 | Layout Estrutural do Dashboard e Skeleton Loaders | `claude-sonnet-5` | medium |
| T-023 | Cartões de KPI Principais e Estado Vazio | `claude-sonnet-5` | medium |
| T-024 | Saldos das Contas e Resumo de Cartões | `claude-sonnet-5` | medium |
| T-025 | Seção de Transações Recentes e Ordenação | `claude-sonnet-5` | medium |
| T-026 | Alertas de Atrasos e Estado Tudo em Dia | `claude-sonnet-5` | medium |
| T-027 | Ações Rápidas de Lançamento e Store Global | `claude-sonnet-5` | medium |
| T-028 | Gráfico de Barras Receitas vs Despesas com Seletor de Ano | `claude-sonnet-5` | medium |
| T-029 | Gráfico de Rosca Despesas por Categoria | `claude-sonnet-5` | medium |
| T-030 | Orquestração de Dados com TanStack Query | `claude-sonnet-5` | medium |

## Gestão de branches e commits

1. branch de trabalho `spec/dashboard` criada do ponto atual (se ainda não existir)
2. as tarefas rodam nela mesma, na ordem — **1 tarefa = 1 commit** (`T-xxx feature: título`), marcada `[concluida]` só com trabalho feito
3. gate final na branch de trabalho: `onp-spec verify dashboard` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Sequencial no Antigravity (uma tarefa após a outra, sem Claude CLI)

1. **Entre na branch de trabalho** (terminal, na raiz do repositório):

```bash
git checkout -b spec/dashboard   # ou: git checkout spec/dashboard
```

2. **Execute as tarefas NA ORDEM, uma após a outra** (janela limpa por tarefa
   ajuda o foco; a próxima só começa quando a anterior commitou):

#### Prompt — T-022

```
Você executa UMA tarefa da feature "dashboard" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/dashboard/spec.md, .spec/features/dashboard/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-022 — "Layout Estrutural do Dashboard e Skeleton Loaders"
  critérios/refs: US-008
  arquivos permitidos (e seus testes): src/pages/Dashboard/DashboardPage.tsx, src/pages/Dashboard/DashboardSkeleton.tsx
  mensagem de commit: "T-022 dashboard: Layout Estrutural do Dashboard e Skeleton Loaders"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa dashboard T-022 concluida` após o commit.

#### Prompt — T-023

```
Você executa UMA tarefa da feature "dashboard" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/dashboard/spec.md, .spec/features/dashboard/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-023 — "Cartões de KPI Principais e Estado Vazio"
  critérios/refs: AC-029 (Cartões de KPI Principais), AC-032 (Estado vazio para KPIs)
  arquivos permitidos (e seus testes): src/pages/Dashboard/components/KpiCards.tsx, src/services/dashboard.service.ts, src/types/dashboard.ts
  mensagem de commit: "T-023 dashboard: Cartões de KPI Principais e Estado Vazio"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa dashboard T-023 concluida` após o commit.

#### Prompt — T-024

```
Você executa UMA tarefa da feature "dashboard" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/dashboard/spec.md, .spec/features/dashboard/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-024 — "Saldos das Contas e Resumo de Cartões"
  critérios/refs: AC-030 (Saldos das Contas), AC-031 (Resumo de Cartões de Crédito)
  arquivos permitidos (e seus testes): src/pages/Dashboard/components/AccountBalances.tsx, src/pages/Dashboard/components/CreditCardSummary.tsx
  mensagem de commit: "T-024 dashboard: Saldos das Contas e Resumo de Cartões"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa dashboard T-024 concluida` após o commit.

#### Prompt — T-025

```
Você executa UMA tarefa da feature "dashboard" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/dashboard/spec.md, .spec/features/dashboard/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-025 — "Seção de Transações Recentes e Ordenação"
  critérios/refs: AC-033 (Lista de transações recentes), AC-034 (Transações recentes vazias)
  arquivos permitidos (e seus testes): src/pages/Dashboard/components/RecentTransactions.tsx, src/utils/formatDate.ts
  mensagem de commit: "T-025 dashboard: Seção de Transações Recentes e Ordenação"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa dashboard T-025 concluida` após o commit.

#### Prompt — T-026

```
Você executa UMA tarefa da feature "dashboard" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/dashboard/spec.md, .spec/features/dashboard/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-026 — "Alertas de Atrasos e Estado Tudo em Dia"
  critérios/refs: AC-039 (Alertas de Atraso), AC-040 (Estado "Tudo em dia")
  arquivos permitidos (e seus testes): src/pages/Dashboard/components/OverdueAlerts.tsx
  mensagem de commit: "T-026 dashboard: Alertas de Atrasos e Estado Tudo em Dia"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa dashboard T-026 concluida` após o commit.

#### Prompt — T-027

```
Você executa UMA tarefa da feature "dashboard" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/dashboard/spec.md, .spec/features/dashboard/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-027 — "Ações Rápidas de Lançamento e Store Global"
  critérios/refs: AC-041 (Ações rápidas de lançamento (Receita/Despesa)), AC-042 (Ação rápida de transferência)
  arquivos permitidos (e seus testes): src/pages/Dashboard/components/QuickActions.tsx, src/stores/transactionModal.store.ts
  mensagem de commit: "T-027 dashboard: Ações Rápidas de Lançamento e Store Global"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa dashboard T-027 concluida` após o commit.

#### Prompt — T-028

```
Você executa UMA tarefa da feature "dashboard" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/dashboard/spec.md, .spec/features/dashboard/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-028 — "Gráfico de Barras Receitas vs Despesas com Seletor de Ano"
  critérios/refs: AC-035 (Gráfico de Receitas vs Despesas (Barras com seletor de ano)), AC-037 (Interatividade nos gráficos), AC-038 (Tratamento de gráficos sem dados)
  arquivos permitidos (e seus testes): src/pages/Dashboard/components/IncomeExpenseChart.tsx
  mensagem de commit: "T-028 dashboard: Gráfico de Barras Receitas vs Despesas com Seletor de Ano"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa dashboard T-028 concluida` após o commit.

#### Prompt — T-029

```
Você executa UMA tarefa da feature "dashboard" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/dashboard/spec.md, .spec/features/dashboard/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-029 — "Gráfico de Rosca Despesas por Categoria"
  critérios/refs: AC-036 (Gráfico de Despesas por Categoria (Rosca)), AC-037 (Interatividade nos gráficos), AC-038 (Tratamento de gráficos sem dados)
  arquivos permitidos (e seus testes): src/pages/Dashboard/components/CategoryExpenseChart.tsx
  mensagem de commit: "T-029 dashboard: Gráfico de Rosca Despesas por Categoria"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa dashboard T-029 concluida` após o commit.

#### Prompt — T-030

```
Você executa UMA tarefa da feature "dashboard" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/dashboard/spec.md, .spec/features/dashboard/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-030 — "Orquestração de Dados com TanStack Query"
  critérios/refs: US-008, US-009, US-010
  arquivos permitidos (e seus testes): src/hooks/useDashboardData.ts
  mensagem de commit: "T-030 dashboard: Orquestração de Dados com TanStack Query"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa dashboard T-030 concluida` após o commit.

3. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify dashboard
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

4. **Acompanhamento (a cada ~1 min, enquanto executa)**: avise ANTES de começar
   que o trabalho roda em background e que o resumo completo vem ao final. Marque
   cada tarefa no ledger ao começar e ao terminar (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-dashboard-mu1pk6lv --tipo tarefa --tarefa <T-xxx> --faixa seq --estado executando   # ao começar
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-dashboard-mu1pk6lv --tipo tarefa --tarefa <T-xxx> --faixa seq --estado concluida    # após o commit
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo dashboard --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo dashboard --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

