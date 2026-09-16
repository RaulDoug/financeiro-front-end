# Plano de execução — alinhamento-layout-design

> gerado por `onp-spec plano` em 2026-09-15 13:56 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano alinhamento-layout-design`

## Resumo — o que vai acontecer

- **7 tarefa(s) pendente(s)**: 7 em 3 faixa(s) paralela(s) + 0 sequencial(is)
- **1 faixa = 1 worktree + 1 branch + 1 janela de contexto limpa** — faixas não compartilham nenhum arquivo entre si
- prefere outra seleção ou uma após a outra? Regenere com `onp-spec plano alinhamento-layout-design --paralelizar T-xxx,T-yyy` ou `--sequencial`
- tudo acontece na branch de trabalho `spec/alinhamento-layout-design`; levar para a main é decisão sua

## Faixas e ondas

### Onda 1 — faixa-1 ∥ faixa-2 ∥ faixa-3

#### faixa-1 — branch `spec/alinhamento-layout-design-faixa-1` — worktree `../onp-worktrees/Front-End_Financeiro-alinhamento-layout-design-faixa-1`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-116 | Auditoria visual comparativa de todos os layouts | `claude-sonnet-5` | medium | `src/pages/Dashboard/DashboardPage.tsx`, `src/pages/Transactions/index.tsx`, `src/pages/CreditCardsPage.tsx`, `src/pages/Reports/index.tsx`, `src/pages/Settings/index.tsx` |
| T-117 | Ajuste de layout do dashboard | `claude-sonnet-5` | high | `src/pages/Dashboard/DashboardPage.tsx`, `src/pages/Dashboard/components/KpiCards.tsx`, `src/pages/Dashboard/components/AccountBalances.tsx`, `src/pages/Dashboard/components/RecentTransactions.tsx`, `src/pages/Dashboard/components/QuickActions.tsx` |
| T-119 | Ajuste de layout da tela de transações (web) | `claude-sonnet-5` | medium | `src/pages/Transactions/index.tsx`, `src/components/transactions/TransactionTable.tsx`, `src/components/transactions/TransactionFilters.tsx` |
| T-120 | Ajuste de layout da tela de cartões de crédito | `claude-sonnet-5` | low | `src/pages/CreditCardsPage.tsx`, `src/components/credit-cards/CreditCardVisual.tsx`, `src/components/credit-cards/InvoiceSummary.tsx` |
| T-121 | Ajuste de layout das telas de configurações | `claude-sonnet-5` | medium | `src/pages/Settings/index.tsx`, `src/pages/Settings/CategoriesSettings.tsx`, `src/pages/Settings/PayMethodsSettings.tsx`, `src/pages/Settings/CounterpartiesSettings.tsx`, `src/pages/Settings/BankAccountsSettings.tsx` |

#### faixa-2 — branch `spec/alinhamento-layout-design-faixa-2` — worktree `../onp-worktrees/Front-End_Financeiro-alinhamento-layout-design-faixa-2`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-118 | Ajuste de layout do relatório DRE | `claude-sonnet-5` | medium | `src/pages/Reports/AnnualReport.tsx`, `src/pages/Reports/AnnualChart.tsx` |

#### faixa-3 — branch `spec/alinhamento-layout-design-faixa-3` — worktree `../onp-worktrees/Front-End_Financeiro-alinhamento-layout-design-faixa-3`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-122 | Ajuste de layout da tela de investimentos | `claude-sonnet-5` | low | `src/pages/Investments/index.tsx` |

## Gestão de branches e commits

1. branch de trabalho `spec/alinhamento-layout-design` criada do ponto atual (se ainda não existir)
2. cada faixa nasce dela como branch própria e roda no seu worktree — **1 tarefa = 1 commit** (`T-xxx feature: título`)
3. terminou a onda → merge `--no-ff` de cada faixa de volta, na ordem; conflito interrompe a faixa e pede resolução humana
4. faixa mesclada → worktree removido, branch apagada, tarefa marcada `[concluida]` no tasks.md
5. gate final na branch de trabalho: `onp-spec verify alinhamento-layout-design` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Paralelo nativo no Antigravity (janelas limpas, sem Claude CLI)

1. **Prepare a branch de trabalho e os worktrees** (terminal, na raiz do repositório):

```bash
git checkout -b spec/alinhamento-layout-design   # ou: git checkout spec/alinhamento-layout-design
git worktree add ../onp-worktrees/Front-End_Financeiro-alinhamento-layout-design-faixa-1 -b spec/alinhamento-layout-design-faixa-1
git worktree add ../onp-worktrees/Front-End_Financeiro-alinhamento-layout-design-faixa-2 -b spec/alinhamento-layout-design-faixa-2
git worktree add ../onp-worktrees/Front-End_Financeiro-alinhamento-layout-design-faixa-3 -b spec/alinhamento-layout-design-faixa-3
```

2. **Abra um agente NOVO por faixa** (janela limpa) e cole o prompt da faixa:

#### Prompt — faixa-1

```
Você executa as tarefas da faixa-1 da feature "alinhamento-layout-design" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-alinhamento-layout-design-faixa-1 (branch spec/alinhamento-layout-design-faixa-1) — já preparado.
Leia primeiro: .spec/features/alinhamento-layout-design/spec.md, .spec/features/alinhamento-layout-design/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-116 — "Auditoria visual comparativa de todos os layouts"
  critérios/refs: AC-187 (Tela de Transações (Web) alinhada à referência), AC-188 (Tela de Cartões de Crédito (Web) alinhada à referência), AC-189 (Tela de Contas Bancárias (Web) alinhada à referência), AC-190 (Tela de Categorias/Configurações (Web) alinhada à referência), AC-191 (Tela de Métodos de Pagamento (Web) alinhada à referência), AC-192 (Tela de Contrapartes (Web) alinhada à referência), AC-193 (Tela de Investimentos (Web) alinhada à referência)
  arquivos permitidos (e seus testes): src/pages/Dashboard/DashboardPage.tsx, src/pages/Transactions/index.tsx, src/pages/CreditCardsPage.tsx, src/pages/Reports/index.tsx, src/pages/Settings/index.tsx
  mensagem de commit: "T-116 alinhamento-layout-design: Auditoria visual comparativa de todos os layouts"
T-117 — "Ajuste de layout do dashboard"
  critérios/refs: AC-181 (Layout geral do dashboard conforme referência), AC-182 (KPIs do dashboard com tamanho de fonte equilibrado), AC-183 (Seção de saldos de contas alinhada à referência)
  arquivos permitidos (e seus testes): src/pages/Dashboard/DashboardPage.tsx, src/pages/Dashboard/components/KpiCards.tsx, src/pages/Dashboard/components/AccountBalances.tsx, src/pages/Dashboard/components/RecentTransactions.tsx, src/pages/Dashboard/components/QuickActions.tsx
  mensagem de commit: "T-117 alinhamento-layout-design: Ajuste de layout do dashboard"
T-119 — "Ajuste de layout da tela de transações (web)"
  critérios/refs: AC-187 (Tela de Transações (Web) alinhada à referência)
  arquivos permitidos (e seus testes): src/pages/Transactions/index.tsx, src/components/transactions/TransactionTable.tsx, src/components/transactions/TransactionFilters.tsx
  mensagem de commit: "T-119 alinhamento-layout-design: Ajuste de layout da tela de transações (web)"
T-120 — "Ajuste de layout da tela de cartões de crédito"
  critérios/refs: AC-188 (Tela de Cartões de Crédito (Web) alinhada à referência)
  arquivos permitidos (e seus testes): src/pages/CreditCardsPage.tsx, src/components/credit-cards/CreditCardVisual.tsx, src/components/credit-cards/InvoiceSummary.tsx
  mensagem de commit: "T-120 alinhamento-layout-design: Ajuste de layout da tela de cartões de crédito"
T-121 — "Ajuste de layout das telas de configurações"
  critérios/refs: AC-189 (Tela de Contas Bancárias (Web) alinhada à referência), AC-190 (Tela de Categorias/Configurações (Web) alinhada à referência), AC-191 (Tela de Métodos de Pagamento (Web) alinhada à referência), AC-192 (Tela de Contrapartes (Web) alinhada à referência)
  arquivos permitidos (e seus testes): src/pages/Settings/index.tsx, src/pages/Settings/CategoriesSettings.tsx, src/pages/Settings/PayMethodsSettings.tsx, src/pages/Settings/CounterpartiesSettings.tsx, src/pages/Settings/BankAccountsSettings.tsx
  mensagem de commit: "T-121 alinhamento-layout-design: Ajuste de layout das telas de configurações"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

#### Prompt — faixa-2

```
Você executa as tarefas da faixa-2 da feature "alinhamento-layout-design" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-alinhamento-layout-design-faixa-2 (branch spec/alinhamento-layout-design-faixa-2) — já preparado.
Leia primeiro: .spec/features/alinhamento-layout-design/spec.md, .spec/features/alinhamento-layout-design/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-118 — "Ajuste de layout do relatório DRE"
  critérios/refs: AC-184 (Layout da tela DRE conforme referência), AC-185 (Tabela DRE com colunas e badges corretos), AC-186 (Gráfico DRE com estilo alinhado à referência)
  arquivos permitidos (e seus testes): src/pages/Reports/AnnualReport.tsx, src/pages/Reports/AnnualChart.tsx
  mensagem de commit: "T-118 alinhamento-layout-design: Ajuste de layout do relatório DRE"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

#### Prompt — faixa-3

```
Você executa as tarefas da faixa-3 da feature "alinhamento-layout-design" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-alinhamento-layout-design-faixa-3 (branch spec/alinhamento-layout-design-faixa-3) — já preparado.
Leia primeiro: .spec/features/alinhamento-layout-design/spec.md, .spec/features/alinhamento-layout-design/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-122 — "Ajuste de layout da tela de investimentos"
  critérios/refs: AC-193 (Tela de Investimentos (Web) alinhada à referência)
  arquivos permitidos (e seus testes): src/pages/Investments/index.tsx
  mensagem de commit: "T-122 alinhamento-layout-design: Ajuste de layout da tela de investimentos"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

3. **Todas terminaram? Mescle na ordem e marque as tarefas** (na árvore principal):

```bash
git merge --no-ff spec/alinhamento-layout-design-faixa-1 -m "merge faixa-1 (alinhamento-layout-design)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-alinhamento-layout-design-faixa-1 && git branch -d spec/alinhamento-layout-design-faixa-1
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa alinhamento-layout-design T-116 concluida
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa alinhamento-layout-design T-117 concluida
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa alinhamento-layout-design T-119 concluida
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa alinhamento-layout-design T-120 concluida
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa alinhamento-layout-design T-121 concluida
git merge --no-ff spec/alinhamento-layout-design-faixa-2 -m "merge faixa-2 (alinhamento-layout-design)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-alinhamento-layout-design-faixa-2 && git branch -d spec/alinhamento-layout-design-faixa-2
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa alinhamento-layout-design T-118 concluida
git merge --no-ff spec/alinhamento-layout-design-faixa-3 -m "merge faixa-3 (alinhamento-layout-design)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-alinhamento-layout-design-faixa-3 && git branch -d spec/alinhamento-layout-design-faixa-3
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa alinhamento-layout-design T-122 concluida
```

5. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify alinhamento-layout-design
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

6. **Acompanhamento (a cada ~1 min, enquanto os agentes trabalham)**: avise ANTES
   de despachar os agentes que o trabalho roda em background e que o resumo
   completo vem ao final. Marque cada tarefa no ledger quando um agente começa
   e quando termina (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-alinhamento-layout-design-mu2qjjip --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado executando
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-alinhamento-layout-design-mu2qjjip --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado concluida
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo alinhamento-layout-design --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo alinhamento-layout-design --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

