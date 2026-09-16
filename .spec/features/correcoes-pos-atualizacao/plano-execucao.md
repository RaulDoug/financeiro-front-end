# Plano de execução — correcoes-pos-atualizacao

> gerado por `onp-spec plano` em 2026-09-15 13:56 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano correcoes-pos-atualizacao`

## Resumo — o que vai acontecer

- **7 tarefa(s) pendente(s)**: 7 em 4 faixa(s) paralela(s) + 0 sequencial(is)
- **1 faixa = 1 worktree + 1 branch + 1 janela de contexto limpa** — faixas não compartilham nenhum arquivo entre si
- prefere outra seleção ou uma após a outra? Regenere com `onp-spec plano correcoes-pos-atualizacao --paralelizar T-xxx,T-yyy` ou `--sequencial`
- tudo acontece na branch de trabalho `spec/correcoes-pos-atualizacao`; levar para a main é decisão sua

## Faixas e ondas

### Onda 1 — faixa-1 ∥ faixa-2 ∥ faixa-3

#### faixa-1 — branch `spec/correcoes-pos-atualizacao-faixa-1` — worktree `../onp-worktrees/Front-End_Financeiro-correcoes-pos-atualizacao-faixa-1`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-103 | Centralizar sino de notificação na viewport | `claude-sonnet-5` | low | `src/components/layout/Header.tsx`, `src/components/layout/NotificationsBell.tsx` |

#### faixa-2 — branch `spec/correcoes-pos-atualizacao-faixa-2` — worktree `../onp-worktrees/Front-End_Financeiro-correcoes-pos-atualizacao-faixa-2`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-104 | Corrigir abertura do modal de transação na tela de Transações | `claude-sonnet-5` | low | `src/pages/Transactions/index.tsx`, `src/stores/transactionModal.store.ts`, `src/components/layout/BottomNav.tsx` |
| T-107 | Corrigir exibição de transações vencidas na listagem | `claude-sonnet-5` | medium | `src/pages/Transactions/index.tsx`, `src/components/transactions/TransactionFilters.tsx`, `src/hooks/useTransactions.ts` |

#### faixa-3 — branch `spec/correcoes-pos-atualizacao-faixa-3` — worktree `../onp-worktrees/Front-End_Financeiro-correcoes-pos-atualizacao-faixa-3`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-105 | Adicionar botão de pagamento nos detalhes de transação | `claude-sonnet-5` | medium | `src/components/transactions/TransactionDetailsModal.tsx`, `src/hooks/useTransactionMutations.ts` |
| T-108 | Tornar transações recentes do dashboard clicáveis com layout correto | `claude-sonnet-5` | medium | `src/pages/Dashboard/components/RecentTransactions.tsx`, `src/components/transactions/TransactionDetailsModal.tsx` |

### Onda 2 — faixa-4

#### faixa-4 — branch `spec/correcoes-pos-atualizacao-faixa-4` — worktree `../onp-worktrees/Front-End_Financeiro-correcoes-pos-atualizacao-faixa-4`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-106 | Corrigir corte e fechamento do formulário de cadastro de cartão | `claude-sonnet-5` | low | `src/components/credit-cards/CreditCardModal.tsx`, `src/components/credit-cards/CreditCardForm.tsx` |
| T-109 | Corrigir erro 500 no cadastro de cartão de crédito | `claude-sonnet-5` | medium | `src/services/api/creditCards.ts`, `src/components/credit-cards/CreditCardForm.tsx`, `src/schemas/creditCardSchema.ts` |

## Gestão de branches e commits

1. branch de trabalho `spec/correcoes-pos-atualizacao` criada do ponto atual (se ainda não existir)
2. cada faixa nasce dela como branch própria e roda no seu worktree — **1 tarefa = 1 commit** (`T-xxx feature: título`)
3. terminou a onda → merge `--no-ff` de cada faixa de volta, na ordem; conflito interrompe a faixa e pede resolução humana
4. faixa mesclada → worktree removido, branch apagada, tarefa marcada `[concluida]` no tasks.md
5. gate final na branch de trabalho: `onp-spec verify correcoes-pos-atualizacao` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Paralelo nativo no Antigravity (janelas limpas, sem Claude CLI)

1. **Prepare a branch de trabalho e os worktrees** (terminal, na raiz do repositório):

```bash
git checkout -b spec/correcoes-pos-atualizacao   # ou: git checkout spec/correcoes-pos-atualizacao
git worktree add ../onp-worktrees/Front-End_Financeiro-correcoes-pos-atualizacao-faixa-1 -b spec/correcoes-pos-atualizacao-faixa-1
git worktree add ../onp-worktrees/Front-End_Financeiro-correcoes-pos-atualizacao-faixa-2 -b spec/correcoes-pos-atualizacao-faixa-2
git worktree add ../onp-worktrees/Front-End_Financeiro-correcoes-pos-atualizacao-faixa-3 -b spec/correcoes-pos-atualizacao-faixa-3
git worktree add ../onp-worktrees/Front-End_Financeiro-correcoes-pos-atualizacao-faixa-4 -b spec/correcoes-pos-atualizacao-faixa-4
```

2. **Abra um agente NOVO por faixa** (janela limpa) e cole o prompt da faixa:

#### Prompt — faixa-1

```
Você executa as tarefas da faixa-1 da feature "correcoes-pos-atualizacao" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-correcoes-pos-atualizacao-faixa-1 (branch spec/correcoes-pos-atualizacao-faixa-1) — já preparado.
Leia primeiro: .spec/features/correcoes-pos-atualizacao/spec.md, .spec/features/correcoes-pos-atualizacao/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-103 — "Centralizar sino de notificação na viewport"
  critérios/refs: AC-156 (Sino centralizado na viewport horizontal)
  arquivos permitidos (e seus testes): src/components/layout/Header.tsx, src/components/layout/NotificationsBell.tsx
  mensagem de commit: "T-103 correcoes-pos-atualizacao: Centralizar sino de notificação na viewport"

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
Você executa as tarefas da faixa-2 da feature "correcoes-pos-atualizacao" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-correcoes-pos-atualizacao-faixa-2 (branch spec/correcoes-pos-atualizacao-faixa-2) — já preparado.
Leia primeiro: .spec/features/correcoes-pos-atualizacao/spec.md, .spec/features/correcoes-pos-atualizacao/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-104 — "Corrigir abertura do modal de transação na tela de Transações"
  critérios/refs: AC-157 (Botão "+" da barra inferior abre modal na tela de transações), AC-158 (Estado do modal não vaza entre telas)
  arquivos permitidos (e seus testes): src/pages/Transactions/index.tsx, src/stores/transactionModal.store.ts, src/components/layout/BottomNav.tsx
  mensagem de commit: "T-104 correcoes-pos-atualizacao: Corrigir abertura do modal de transação na tela de Transações"
T-107 — "Corrigir exibição de transações vencidas na listagem"
  critérios/refs: AC-164 (Transações vencidas exibidas na listagem)
  arquivos permitidos (e seus testes): src/pages/Transactions/index.tsx, src/components/transactions/TransactionFilters.tsx, src/hooks/useTransactions.ts
  mensagem de commit: "T-107 correcoes-pos-atualizacao: Corrigir exibição de transações vencidas na listagem"

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
Você executa as tarefas da faixa-3 da feature "correcoes-pos-atualizacao" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-correcoes-pos-atualizacao-faixa-3 (branch spec/correcoes-pos-atualizacao-faixa-3) — já preparado.
Leia primeiro: .spec/features/correcoes-pos-atualizacao/spec.md, .spec/features/correcoes-pos-atualizacao/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-105 — "Adicionar botão de pagamento nos detalhes de transação"
  critérios/refs: AC-159 (Botão de pagamento visível em detalhes de transações pendentes), AC-160 (Botão de pagamento ausente em transações já concluídas)
  arquivos permitidos (e seus testes): src/components/transactions/TransactionDetailsModal.tsx, src/hooks/useTransactionMutations.ts
  mensagem de commit: "T-105 correcoes-pos-atualizacao: Adicionar botão de pagamento nos detalhes de transação"
T-108 — "Tornar transações recentes do dashboard clicáveis com layout correto"
  critérios/refs: AC-165 (Transações recentes clicáveis no dashboard), AC-166 (Layout visual das transações recentes alinhado com a tela de transações)
  arquivos permitidos (e seus testes): src/pages/Dashboard/components/RecentTransactions.tsx, src/components/transactions/TransactionDetailsModal.tsx
  mensagem de commit: "T-108 correcoes-pos-atualizacao: Tornar transações recentes do dashboard clicáveis com layout correto"

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
Você executa as tarefas da faixa-4 da feature "correcoes-pos-atualizacao" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-correcoes-pos-atualizacao-faixa-4 (branch spec/correcoes-pos-atualizacao-faixa-4) — já preparado.
Leia primeiro: .spec/features/correcoes-pos-atualizacao/spec.md, .spec/features/correcoes-pos-atualizacao/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-106 — "Corrigir corte e fechamento do formulário de cadastro de cartão"
  critérios/refs: AC-161 (Formulário de cartão sem corte superior), AC-162 (Botão de fechar do formulário de cartão funciona), AC-163 (Formulário de cartão acessível pelas configurações)
  arquivos permitidos (e seus testes): src/components/credit-cards/CreditCardModal.tsx, src/components/credit-cards/CreditCardForm.tsx
  mensagem de commit: "T-106 correcoes-pos-atualizacao: Corrigir corte e fechamento do formulário de cadastro de cartão"
T-109 — "Corrigir erro 500 no cadastro de cartão de crédito"
  critérios/refs: AC-167 (Cadastro de cartão sem erro 500), AC-168 (Payload de cadastro de cartão correto)
  arquivos permitidos (e seus testes): src/services/api/creditCards.ts, src/components/credit-cards/CreditCardForm.tsx, src/schemas/creditCardSchema.ts
  mensagem de commit: "T-109 correcoes-pos-atualizacao: Corrigir erro 500 no cadastro de cartão de crédito"

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
git merge --no-ff spec/correcoes-pos-atualizacao-faixa-1 -m "merge faixa-1 (correcoes-pos-atualizacao)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-correcoes-pos-atualizacao-faixa-1 && git branch -d spec/correcoes-pos-atualizacao-faixa-1
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa correcoes-pos-atualizacao T-103 concluida
git merge --no-ff spec/correcoes-pos-atualizacao-faixa-2 -m "merge faixa-2 (correcoes-pos-atualizacao)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-correcoes-pos-atualizacao-faixa-2 && git branch -d spec/correcoes-pos-atualizacao-faixa-2
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa correcoes-pos-atualizacao T-104 concluida
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa correcoes-pos-atualizacao T-107 concluida
git merge --no-ff spec/correcoes-pos-atualizacao-faixa-3 -m "merge faixa-3 (correcoes-pos-atualizacao)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-correcoes-pos-atualizacao-faixa-3 && git branch -d spec/correcoes-pos-atualizacao-faixa-3
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa correcoes-pos-atualizacao T-105 concluida
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa correcoes-pos-atualizacao T-108 concluida
git merge --no-ff spec/correcoes-pos-atualizacao-faixa-4 -m "merge faixa-4 (correcoes-pos-atualizacao)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-correcoes-pos-atualizacao-faixa-4 && git branch -d spec/correcoes-pos-atualizacao-faixa-4
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa correcoes-pos-atualizacao T-106 concluida
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa correcoes-pos-atualizacao T-109 concluida
```

5. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify correcoes-pos-atualizacao
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

6. **Acompanhamento (a cada ~1 min, enquanto os agentes trabalham)**: avise ANTES
   de despachar os agentes que o trabalho roda em background e que o resumo
   completo vem ao final. Marque cada tarefa no ledger quando um agente começa
   e quando termina (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-correcoes-pos-atualizacao-mu2qjjab --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado executando
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-correcoes-pos-atualizacao-mu2qjjab --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado concluida
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo correcoes-pos-atualizacao --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo correcoes-pos-atualizacao --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

