# Plano de execução — atualizacao-automatica-transacoes

> gerado por `onp-spec plano` em 2026-09-15 20:20 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano atualizacao-automatica-transacoes`

## Resumo — o que vai acontecer

- **4 tarefa(s) pendente(s)**: 4 em 4 faixa(s) paralela(s) + 0 sequencial(is)
- **1 faixa = 1 worktree + 1 branch + 1 janela de contexto limpa** — faixas não compartilham nenhum arquivo entre si
- prefere outra seleção ou uma após a outra? Regenere com `onp-spec plano atualizacao-automatica-transacoes --paralelizar T-xxx,T-yyy` ou `--sequencial`
- tudo acontece na branch de trabalho `spec/atualizacao-automatica-transacoes`; levar para a main é decisão sua

## Faixas e ondas

### Onda 1 — faixa-1 ∥ faixa-2 ∥ faixa-3

#### faixa-1 — branch `spec/atualizacao-automatica-transacoes-faixa-1` — worktree `../onp-worktrees/Front-End_Financeiro-atualizacao-automatica-transacoes-faixa-1`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-130 | Orquestração de invalidação e refetch no hook useTransactionMutations | `claude-sonnet-5` | low | `src/hooks/useTransactionMutations.ts` |

#### faixa-2 — branch `spec/atualizacao-automatica-transacoes-faixa-2` — worktree `../onp-worktrees/Front-End_Financeiro-atualizacao-automatica-transacoes-faixa-2`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-131 | Sincronização síncrona na submissão do modal em TransactionsPage | `claude-sonnet-5` | low | `src/pages/Transactions/index.tsx` |

#### faixa-3 — branch `spec/atualizacao-automatica-transacoes-faixa-3` — worktree `../onp-worktrees/Front-End_Financeiro-atualizacao-automatica-transacoes-faixa-3`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-132 | Sincronização nos modais de Detalhes da Transação e Dashboard | `claude-sonnet-5` | low | `src/components/transactions/TransactionDetailsModal.tsx`, `src/pages/Dashboard/DashboardPage.tsx` |

### Onda 2 — faixa-4

#### faixa-4 — branch `spec/atualizacao-automatica-transacoes-faixa-4` — worktree `../onp-worktrees/Front-End_Financeiro-atualizacao-automatica-transacoes-faixa-4`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-133 | Testes automatizados da especificação de atualização automática | `claude-sonnet-5` | low | `test/atualizacao-automatica-transacoes.spec.test.js` |

## Gestão de branches e commits

1. branch de trabalho `spec/atualizacao-automatica-transacoes` criada do ponto atual (se ainda não existir)
2. cada faixa nasce dela como branch própria e roda no seu worktree — **1 tarefa = 1 commit** (`T-xxx feature: título`)
3. terminou a onda → merge `--no-ff` de cada faixa de volta, na ordem; conflito interrompe a faixa e pede resolução humana
4. faixa mesclada → worktree removido, branch apagada, tarefa marcada `[concluida]` no tasks.md
5. gate final na branch de trabalho: `onp-spec verify atualizacao-automatica-transacoes` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Paralelo nativo no Antigravity (janelas limpas, sem Claude CLI)

1. **Prepare a branch de trabalho e os worktrees** (terminal, na raiz do repositório):

```bash
git checkout -b spec/atualizacao-automatica-transacoes   # ou: git checkout spec/atualizacao-automatica-transacoes
git worktree add ../onp-worktrees/Front-End_Financeiro-atualizacao-automatica-transacoes-faixa-1 -b spec/atualizacao-automatica-transacoes-faixa-1
git worktree add ../onp-worktrees/Front-End_Financeiro-atualizacao-automatica-transacoes-faixa-2 -b spec/atualizacao-automatica-transacoes-faixa-2
git worktree add ../onp-worktrees/Front-End_Financeiro-atualizacao-automatica-transacoes-faixa-3 -b spec/atualizacao-automatica-transacoes-faixa-3
git worktree add ../onp-worktrees/Front-End_Financeiro-atualizacao-automatica-transacoes-faixa-4 -b spec/atualizacao-automatica-transacoes-faixa-4
```

2. **Abra um agente NOVO por faixa** (janela limpa) e cole o prompt da faixa:

#### Prompt — faixa-1

```
Você executa as tarefas da faixa-1 da feature "atualizacao-automatica-transacoes" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-atualizacao-automatica-transacoes-faixa-1 (branch spec/atualizacao-automatica-transacoes-faixa-1) — já preparado.
Leia primeiro: .spec/features/atualizacao-automatica-transacoes/spec.md, .spec/features/atualizacao-automatica-transacoes/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-130 — "Orquestração de invalidação e refetch no hook useTransactionMutations"
  critérios/refs: AC-211 (Invalidação abrangente com refetch de consultas ativas no hook de mutações), AC-214 (Bloqueio do fechamento de modal até sincronização concluída)
  arquivos permitidos (e seus testes): src/hooks/useTransactionMutations.ts
  mensagem de commit: "T-130 atualizacao-automatica-transacoes: Orquestração de invalidação e refetch no hook useTransactionMutations"

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
Você executa as tarefas da faixa-2 da feature "atualizacao-automatica-transacoes" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-atualizacao-automatica-transacoes-faixa-2 (branch spec/atualizacao-automatica-transacoes-faixa-2) — já preparado.
Leia primeiro: .spec/features/atualizacao-automatica-transacoes/spec.md, .spec/features/atualizacao-automatica-transacoes/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-131 — "Sincronização síncrona na submissão do modal em TransactionsPage"
  critérios/refs: AC-210 (Atualização imediata na listagem de transações após criação), AC-214 (Bloqueio do fechamento de modal até sincronização concluída)
  arquivos permitidos (e seus testes): src/pages/Transactions/index.tsx
  mensagem de commit: "T-131 atualizacao-automatica-transacoes: Sincronização síncrona na submissão do modal em TransactionsPage"

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
Você executa as tarefas da faixa-3 da feature "atualizacao-automatica-transacoes" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-atualizacao-automatica-transacoes-faixa-3 (branch spec/atualizacao-automatica-transacoes-faixa-3) — já preparado.
Leia primeiro: .spec/features/atualizacao-automatica-transacoes/spec.md, .spec/features/atualizacao-automatica-transacoes/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-132 — "Sincronização nos modais de Detalhes da Transação e Dashboard"
  critérios/refs: AC-212 (Atualização imediata após efetivar pagamento nos detalhes da transação), AC-213 (Atualização imediata do Dashboard após criação rápida de transação), AC-214 (Bloqueio do fechamento de modal até sincronização concluída)
  arquivos permitidos (e seus testes): src/components/transactions/TransactionDetailsModal.tsx, src/pages/Dashboard/DashboardPage.tsx
  mensagem de commit: "T-132 atualizacao-automatica-transacoes: Sincronização nos modais de Detalhes da Transação e Dashboard"

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
Você executa as tarefas da faixa-4 da feature "atualizacao-automatica-transacoes" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-atualizacao-automatica-transacoes-faixa-4 (branch spec/atualizacao-automatica-transacoes-faixa-4) — já preparado.
Leia primeiro: .spec/features/atualizacao-automatica-transacoes/spec.md, .spec/features/atualizacao-automatica-transacoes/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-133 — "Testes automatizados da especificação de atualização automática"
  critérios/refs: AC-210 (Atualização imediata na listagem de transações após criação), AC-211 (Invalidação abrangente com refetch de consultas ativas no hook de mutações), AC-212 (Atualização imediata após efetivar pagamento nos detalhes da transação), AC-213 (Atualização imediata do Dashboard após criação rápida de transação), AC-214 (Bloqueio do fechamento de modal até sincronização concluída)
  arquivos permitidos (e seus testes): test/atualizacao-automatica-transacoes.spec.test.js
  mensagem de commit: "T-133 atualizacao-automatica-transacoes: Testes automatizados da especificação de atualização automática"

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
git merge --no-ff spec/atualizacao-automatica-transacoes-faixa-1 -m "merge faixa-1 (atualizacao-automatica-transacoes)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-atualizacao-automatica-transacoes-faixa-1 && git branch -d spec/atualizacao-automatica-transacoes-faixa-1
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa atualizacao-automatica-transacoes T-130 concluida
git merge --no-ff spec/atualizacao-automatica-transacoes-faixa-2 -m "merge faixa-2 (atualizacao-automatica-transacoes)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-atualizacao-automatica-transacoes-faixa-2 && git branch -d spec/atualizacao-automatica-transacoes-faixa-2
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa atualizacao-automatica-transacoes T-131 concluida
git merge --no-ff spec/atualizacao-automatica-transacoes-faixa-3 -m "merge faixa-3 (atualizacao-automatica-transacoes)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-atualizacao-automatica-transacoes-faixa-3 && git branch -d spec/atualizacao-automatica-transacoes-faixa-3
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa atualizacao-automatica-transacoes T-132 concluida
git merge --no-ff spec/atualizacao-automatica-transacoes-faixa-4 -m "merge faixa-4 (atualizacao-automatica-transacoes)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-atualizacao-automatica-transacoes-faixa-4 && git branch -d spec/atualizacao-automatica-transacoes-faixa-4
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa atualizacao-automatica-transacoes T-133 concluida
```

5. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify atualizacao-automatica-transacoes
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

6. **Acompanhamento (a cada ~1 min, enquanto os agentes trabalham)**: avise ANTES
   de despachar os agentes que o trabalho roda em background e que o resumo
   completo vem ao final. Marque cada tarefa no ledger quando um agente começa
   e quando termina (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-atualizacao-automatica-transacoes-mu349fse --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado executando
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-atualizacao-automatica-transacoes-mu349fse --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado concluida
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo atualizacao-automatica-transacoes --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo atualizacao-automatica-transacoes --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

