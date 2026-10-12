# Plano de execução — orcamentos

> gerado por `onp-spec plano` em 2026-10-11 18:32 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano orcamentos`

## Resumo — o que vai acontecer

- **8 tarefa(s) pendente(s)**: 8 em 8 faixa(s) paralela(s) + 0 sequencial(is)
- **1 faixa = 1 worktree + 1 branch + 1 janela de contexto limpa** — faixas não compartilham nenhum arquivo entre si
- prefere outra seleção ou uma após a outra? Regenere com `onp-spec plano orcamentos --paralelizar T-xxx,T-yyy` ou `--sequencial`
- tudo acontece na branch de trabalho `spec/orcamentos`; levar para a main é decisão sua

## Faixas e ondas

### Onda 1 — faixa-1 ∥ faixa-2 ∥ faixa-3

#### faixa-1 — branch `spec/orcamentos-faixa-1` — worktree `../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-1`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-248 | Tipos TypeScript e Serviço de API de Orçamentos | `claude-sonnet-5` | medium | `src/types/budget.ts`, `src/services/budget.service.ts` |

#### faixa-2 — branch `spec/orcamentos-faixa-2` — worktree `../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-2`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-249 | Hooks React Query para Busca e Mutações de Orçamentos | `claude-sonnet-5` | medium | `src/hooks/useBudgets.ts`, `src/hooks/useBudgetMutations.ts` |

#### faixa-3 — branch `spec/orcamentos-faixa-3` — worktree `../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-3`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-250 | Componente de Resumo Superior com KPI Cards de Caixa e Metas | `claude-sonnet-5` | medium | `src/components/budgets/BudgetSummaryCards.tsx` |

### Onda 2 — faixa-4 ∥ faixa-5 ∥ faixa-6

#### faixa-4 — branch `spec/orcamentos-faixa-4` — worktree `../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-4`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-251 | Componentes de Card de Categoria, Barra de Progresso e Ações | `claude-sonnet-5` | medium | `src/components/budgets/BudgetCategoryCard.tsx`, `src/components/budgets/BudgetProgressBar.tsx` |

#### faixa-5 — branch `spec/orcamentos-faixa-5` — worktree `../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-5`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-252 | Componente de Visão Anual com Gráfico Comparativo Mês a Mês | `claude-sonnet-5` | medium | `src/components/budgets/BudgetAnnualChart.tsx` |

#### faixa-6 — branch `spec/orcamentos-faixa-6` — worktree `../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-6`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-253 | Modais de Formulário de Orçamento com Gestão de Escopo e Conflito | `claude-sonnet-5` | medium | `src/components/budgets/BudgetModal.tsx`, `src/components/budgets/BudgetDeleteDialog.tsx`, `src/schemas/budgetSchema.ts` |

### Onda 3 — faixa-7 ∥ faixa-8

#### faixa-7 — branch `spec/orcamentos-faixa-7` — worktree `../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-7`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-254 | Página Principal de Orçamentos e Integração no Layout/Rotas | `claude-sonnet-5` | medium | `src/pages/Budgets/BudgetsPage.tsx`, `src/layouts/AppLayout.tsx`, `src/components/layout/Sidebar.tsx`, `src/components/layout/MoreMenuModal.tsx`, `src/routes/index.tsx` |

#### faixa-8 — branch `spec/orcamentos-faixa-8` — worktree `../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-8`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-255 | Testes Automatizados dos Critérios de Aceite AC-374 a AC-383 | `claude-sonnet-5` | medium | `test/orcamentos.spec.test.js` |

## Gestão de branches e commits

1. branch de trabalho `spec/orcamentos` criada do ponto atual (se ainda não existir)
2. cada faixa nasce dela como branch própria e roda no seu worktree — **1 tarefa = 1 commit** (`T-xxx feature: título`)
3. terminou a onda → merge `--no-ff` de cada faixa de volta, na ordem; conflito interrompe a faixa e pede resolução humana
4. faixa mesclada → worktree removido, branch apagada, tarefa marcada `[concluida]` no tasks.md
5. gate final na branch de trabalho: `onp-spec verify orcamentos` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Paralelo nativo no Antigravity (janelas limpas, sem Claude CLI)

1. **Prepare a branch de trabalho e os worktrees** (terminal, na raiz do repositório):

```bash
git checkout -b spec/orcamentos   # ou: git checkout spec/orcamentos
git worktree add ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-1 -b spec/orcamentos-faixa-1
git worktree add ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-2 -b spec/orcamentos-faixa-2
git worktree add ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-3 -b spec/orcamentos-faixa-3
git worktree add ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-4 -b spec/orcamentos-faixa-4
git worktree add ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-5 -b spec/orcamentos-faixa-5
git worktree add ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-6 -b spec/orcamentos-faixa-6
git worktree add ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-7 -b spec/orcamentos-faixa-7
git worktree add ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-8 -b spec/orcamentos-faixa-8
```

2. **Abra um agente NOVO por faixa** (janela limpa) e cole o prompt da faixa:

#### Prompt — faixa-1

```
Você executa as tarefas da faixa-1 da feature "orcamentos" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-1 (branch spec/orcamentos-faixa-1) — já preparado.
Leia primeiro: .spec/features/orcamentos/spec.md, .spec/features/orcamentos/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-248 — "Tipos TypeScript e Serviço de API de Orçamentos"
  critérios/refs: AC-374 (Navegação e acesso à aba de orçamentos), AC-375 (Indicadores de resumo de caixa e metas (KPI cards)), AC-378 (Cadastro de orçamento avulso para categoria de despesa), AC-381 (Edição de meta com seleção de escopo pontual ou cascata), AC-382 (Exclusão de orçamento com escopo para registros recorrentes), AC-383 (Recálculo e sincronização sob demanda (auto-heal))
  arquivos permitidos (e seus testes): src/types/budget.ts, src/services/budget.service.ts
  mensagem de commit: "T-248 orcamentos: Tipos TypeScript e Serviço de API de Orçamentos"

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
Você executa as tarefas da faixa-2 da feature "orcamentos" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-2 (branch spec/orcamentos-faixa-2) — já preparado.
Leia primeiro: .spec/features/orcamentos/spec.md, .spec/features/orcamentos/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-249 — "Hooks React Query para Busca e Mutações de Orçamentos"
  critérios/refs: AC-375 (Indicadores de resumo de caixa e metas (KPI cards)), AC-376 (Listagem visual de categorias com barra de progresso), AC-377 (Alternância para visão anual com comparativo mês a mês), AC-378 (Cadastro de orçamento avulso para categoria de despesa), AC-381 (Edição de meta com seleção de escopo pontual ou cascata), AC-382 (Exclusão de orçamento com escopo para registros recorrentes), AC-383 (Recálculo e sincronização sob demanda (auto-heal))
  arquivos permitidos (e seus testes): src/hooks/useBudgets.ts, src/hooks/useBudgetMutations.ts
  mensagem de commit: "T-249 orcamentos: Hooks React Query para Busca e Mutações de Orçamentos"

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
Você executa as tarefas da faixa-3 da feature "orcamentos" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-3 (branch spec/orcamentos-faixa-3) — já preparado.
Leia primeiro: .spec/features/orcamentos/spec.md, .spec/features/orcamentos/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-250 — "Componente de Resumo Superior com KPI Cards de Caixa e Metas"
  critérios/refs: AC-375 (Indicadores de resumo de caixa e metas (KPI cards))
  arquivos permitidos (e seus testes): src/components/budgets/BudgetSummaryCards.tsx
  mensagem de commit: "T-250 orcamentos: Componente de Resumo Superior com KPI Cards de Caixa e Metas"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

#### Prompt — faixa-4

```
Você executa as tarefas da faixa-4 da feature "orcamentos" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-4 (branch spec/orcamentos-faixa-4) — já preparado.
Leia primeiro: .spec/features/orcamentos/spec.md, .spec/features/orcamentos/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-251 — "Componentes de Card de Categoria, Barra de Progresso e Ações"
  critérios/refs: AC-376 (Listagem visual de categorias com barra de progresso), AC-383 (Recálculo e sincronização sob demanda (auto-heal))
  arquivos permitidos (e seus testes): src/components/budgets/BudgetCategoryCard.tsx, src/components/budgets/BudgetProgressBar.tsx
  mensagem de commit: "T-251 orcamentos: Componentes de Card de Categoria, Barra de Progresso e Ações"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

#### Prompt — faixa-5

```
Você executa as tarefas da faixa-5 da feature "orcamentos" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-5 (branch spec/orcamentos-faixa-5) — já preparado.
Leia primeiro: .spec/features/orcamentos/spec.md, .spec/features/orcamentos/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-252 — "Componente de Visão Anual com Gráfico Comparativo Mês a Mês"
  critérios/refs: AC-377 (Alternância para visão anual com comparativo mês a mês)
  arquivos permitidos (e seus testes): src/components/budgets/BudgetAnnualChart.tsx
  mensagem de commit: "T-252 orcamentos: Componente de Visão Anual com Gráfico Comparativo Mês a Mês"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

#### Prompt — faixa-6

```
Você executa as tarefas da faixa-6 da feature "orcamentos" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-6 (branch spec/orcamentos-faixa-6) — já preparado.
Leia primeiro: .spec/features/orcamentos/spec.md, .spec/features/orcamentos/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-253 — "Modais de Formulário de Orçamento com Gestão de Escopo e Conflito"
  critérios/refs: AC-378 (Cadastro de orçamento avulso para categoria de despesa), AC-379 (Cadastro de orçamento recorrente com quantidade de meses), AC-380 (Alerta amigável de conflito para categoria já orçada no mês), AC-381 (Edição de meta com seleção de escopo pontual ou cascata), AC-382 (Exclusão de orçamento com escopo para registros recorrentes)
  arquivos permitidos (e seus testes): src/components/budgets/BudgetModal.tsx, src/components/budgets/BudgetDeleteDialog.tsx, src/schemas/budgetSchema.ts
  mensagem de commit: "T-253 orcamentos: Modais de Formulário de Orçamento com Gestão de Escopo e Conflito"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

#### Prompt — faixa-7

```
Você executa as tarefas da faixa-7 da feature "orcamentos" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-7 (branch spec/orcamentos-faixa-7) — já preparado.
Leia primeiro: .spec/features/orcamentos/spec.md, .spec/features/orcamentos/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-254 — "Página Principal de Orçamentos e Integração no Layout/Rotas"
  critérios/refs: AC-374 (Navegação e acesso à aba de orçamentos)
  arquivos permitidos (e seus testes): src/pages/Budgets/BudgetsPage.tsx, src/layouts/AppLayout.tsx, src/components/layout/Sidebar.tsx, src/components/layout/MoreMenuModal.tsx, src/routes/index.tsx
  mensagem de commit: "T-254 orcamentos: Página Principal de Orçamentos e Integração no Layout/Rotas"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

#### Prompt — faixa-8

```
Você executa as tarefas da faixa-8 da feature "orcamentos" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-8 (branch spec/orcamentos-faixa-8) — já preparado.
Leia primeiro: .spec/features/orcamentos/spec.md, .spec/features/orcamentos/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-255 — "Testes Automatizados dos Critérios de Aceite AC-374 a AC-383"
  critérios/refs: AC-374 (Navegação e acesso à aba de orçamentos), AC-375 (Indicadores de resumo de caixa e metas (KPI cards)), AC-376 (Listagem visual de categorias com barra de progresso), AC-377 (Alternância para visão anual com comparativo mês a mês), AC-378 (Cadastro de orçamento avulso para categoria de despesa), AC-379 (Cadastro de orçamento recorrente com quantidade de meses), AC-380 (Alerta amigável de conflito para categoria já orçada no mês), AC-381 (Edição de meta com seleção de escopo pontual ou cascata), AC-382 (Exclusão de orçamento com escopo para registros recorrentes), AC-383 (Recálculo e sincronização sob demanda (auto-heal))
  arquivos permitidos (e seus testes): test/orcamentos.spec.test.js
  mensagem de commit: "T-255 orcamentos: Testes Automatizados dos Critérios de Aceite AC-374 a AC-383"

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
git merge --no-ff spec/orcamentos-faixa-1 -m "merge faixa-1 (orcamentos)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-1 && git branch -d spec/orcamentos-faixa-1
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa orcamentos T-248 concluida
git merge --no-ff spec/orcamentos-faixa-2 -m "merge faixa-2 (orcamentos)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-2 && git branch -d spec/orcamentos-faixa-2
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa orcamentos T-249 concluida
git merge --no-ff spec/orcamentos-faixa-3 -m "merge faixa-3 (orcamentos)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-3 && git branch -d spec/orcamentos-faixa-3
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa orcamentos T-250 concluida
git merge --no-ff spec/orcamentos-faixa-4 -m "merge faixa-4 (orcamentos)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-4 && git branch -d spec/orcamentos-faixa-4
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa orcamentos T-251 concluida
git merge --no-ff spec/orcamentos-faixa-5 -m "merge faixa-5 (orcamentos)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-5 && git branch -d spec/orcamentos-faixa-5
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa orcamentos T-252 concluida
git merge --no-ff spec/orcamentos-faixa-6 -m "merge faixa-6 (orcamentos)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-6 && git branch -d spec/orcamentos-faixa-6
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa orcamentos T-253 concluida
git merge --no-ff spec/orcamentos-faixa-7 -m "merge faixa-7 (orcamentos)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-7 && git branch -d spec/orcamentos-faixa-7
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa orcamentos T-254 concluida
git merge --no-ff spec/orcamentos-faixa-8 -m "merge faixa-8 (orcamentos)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-orcamentos-faixa-8 && git branch -d spec/orcamentos-faixa-8
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa orcamentos T-255 concluida
```

5. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify orcamentos
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

6. **Acompanhamento (a cada ~1 min, enquanto os agentes trabalham)**: avise ANTES
   de despachar os agentes que o trabalho roda em background e que o resumo
   completo vem ao final. Marque cada tarefa no ledger quando um agente começa
   e quando termina (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-orcamentos-mv45v47z --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado executando
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-orcamentos-mv45v47z --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado concluida
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo orcamentos --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo orcamentos --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

