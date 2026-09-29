# Plano de execução — persistencia-filtros-navegacao

> gerado por `onp-spec plano` em 2026-09-29 13:31 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano persistencia-filtros-navegacao`

## Resumo — o que vai acontecer

- **4 tarefa(s) pendente(s)**: 4 em 4 faixa(s) paralela(s) + 0 sequencial(is)
- **1 faixa = 1 worktree + 1 branch + 1 janela de contexto limpa** — faixas não compartilham nenhum arquivo entre si
- prefere outra seleção ou uma após a outra? Regenere com `onp-spec plano persistencia-filtros-navegacao --paralelizar T-xxx,T-yyy` ou `--sequencial`
- tudo acontece na branch de trabalho `spec/persistencia-filtros-navegacao`; levar para a main é decisão sua

## Faixas e ondas

### Onda 1 — faixa-1 ∥ faixa-2 ∥ faixa-3

#### faixa-1 — branch `spec/persistencia-filtros-navegacao-faixa-1` — worktree `../onp-worktrees/Front-End_Financeiro-persistencia-filtros-navegacao-faixa-1`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-211 | Store Zustand de filtros e persistência (`filter.store.ts`) | `claude-sonnet-5` | medium | `src/stores/filter.store.ts`, `src/stores/index.ts` |

#### faixa-2 — branch `spec/persistencia-filtros-navegacao-faixa-2` — worktree `../onp-worktrees/Front-End_Financeiro-persistencia-filtros-navegacao-faixa-2`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-212 | Persistência e restauração do período no Dashboard | `claude-sonnet-5` | low | `src/pages/Dashboard/DashboardPage.tsx` |

#### faixa-3 — branch `spec/persistencia-filtros-navegacao-faixa-3` — worktree `../onp-worktrees/Front-End_Financeiro-persistencia-filtros-navegacao-faixa-3`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-213 | Limpeza com retorno ao mês padrão e persistência de Transações | `claude-sonnet-5` | medium | `src/components/transactions/TransactionFilters.tsx`, `src/pages/Transactions/index.tsx` |

### Onda 2 — faixa-4

#### faixa-4 — branch `spec/persistencia-filtros-navegacao-faixa-4` — worktree `../onp-worktrees/Front-End_Financeiro-persistencia-filtros-navegacao-faixa-4`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-214 | Testes automatizados de especificação AC-325 a AC-329 | `claude-sonnet-5` | low | `test/persistencia-filtros-navegacao.spec.test.js` |

## Gestão de branches e commits

1. branch de trabalho `spec/persistencia-filtros-navegacao` criada do ponto atual (se ainda não existir)
2. cada faixa nasce dela como branch própria e roda no seu worktree — **1 tarefa = 1 commit** (`T-xxx feature: título`)
3. terminou a onda → merge `--no-ff` de cada faixa de volta, na ordem; conflito interrompe a faixa e pede resolução humana
4. faixa mesclada → worktree removido, branch apagada, tarefa marcada `[concluida]` no tasks.md
5. gate final na branch de trabalho: `onp-spec verify persistencia-filtros-navegacao` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Paralelo nativo no Antigravity (janelas limpas, sem Claude CLI)

1. **Prepare a branch de trabalho e os worktrees** (terminal, na raiz do repositório):

```bash
git checkout -b spec/persistencia-filtros-navegacao   # ou: git checkout spec/persistencia-filtros-navegacao
git worktree add ../onp-worktrees/Front-End_Financeiro-persistencia-filtros-navegacao-faixa-1 -b spec/persistencia-filtros-navegacao-faixa-1
git worktree add ../onp-worktrees/Front-End_Financeiro-persistencia-filtros-navegacao-faixa-2 -b spec/persistencia-filtros-navegacao-faixa-2
git worktree add ../onp-worktrees/Front-End_Financeiro-persistencia-filtros-navegacao-faixa-3 -b spec/persistencia-filtros-navegacao-faixa-3
git worktree add ../onp-worktrees/Front-End_Financeiro-persistencia-filtros-navegacao-faixa-4 -b spec/persistencia-filtros-navegacao-faixa-4
```

2. **Abra um agente NOVO por faixa** (janela limpa) e cole o prompt da faixa:

#### Prompt — faixa-1

```
Você executa as tarefas da faixa-1 da feature "persistencia-filtros-navegacao" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-persistencia-filtros-navegacao-faixa-1 (branch spec/persistencia-filtros-navegacao-faixa-1) — já preparado.
Leia primeiro: .spec/features/persistencia-filtros-navegacao/spec.md, .spec/features/persistencia-filtros-navegacao/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-211 — "Store Zustand de filtros e persistência (`filter.store.ts`)"
  critérios/refs: AC-325 (Botão Limpar Filtros restaura mês atual e zera filtros secundários), AC-327 (Armazenamento e restauração dos filtros e pesquisa de Transações), AC-328 (Armazenamento e restauração do período selecionado no Dashboard), AC-329 (Precedência de query params na URL e redefinição ao trocar de carteira)
  arquivos permitidos (e seus testes): src/stores/filter.store.ts, src/stores/index.ts
  mensagem de commit: "T-211 persistencia-filtros-navegacao: Store Zustand de filtros e persistência (`filter.store.ts`)"

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
Você executa as tarefas da faixa-2 da feature "persistencia-filtros-navegacao" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-persistencia-filtros-navegacao-faixa-2 (branch spec/persistencia-filtros-navegacao-faixa-2) — já preparado.
Leia primeiro: .spec/features/persistencia-filtros-navegacao/spec.md, .spec/features/persistencia-filtros-navegacao/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-212 — "Persistência e restauração do período no Dashboard"
  critérios/refs: AC-328 (Armazenamento e restauração do período selecionado no Dashboard)
  arquivos permitidos (e seus testes): src/pages/Dashboard/DashboardPage.tsx
  mensagem de commit: "T-212 persistencia-filtros-navegacao: Persistência e restauração do período no Dashboard"

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
Você executa as tarefas da faixa-3 da feature "persistencia-filtros-navegacao" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-persistencia-filtros-navegacao-faixa-3 (branch spec/persistencia-filtros-navegacao-faixa-3) — já preparado.
Leia primeiro: .spec/features/persistencia-filtros-navegacao/spec.md, .spec/features/persistencia-filtros-navegacao/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-213 — "Limpeza com retorno ao mês padrão e persistência de Transações"
  critérios/refs: AC-325 (Botão Limpar Filtros restaura mês atual e zera filtros secundários), AC-326 (Visibilidade condicional do botão Limpar Filtros), AC-327 (Armazenamento e restauração dos filtros e pesquisa de Transações), AC-329 (Precedência de query params na URL e redefinição ao trocar de carteira)
  arquivos permitidos (e seus testes): src/components/transactions/TransactionFilters.tsx, src/pages/Transactions/index.tsx
  mensagem de commit: "T-213 persistencia-filtros-navegacao: Limpeza com retorno ao mês padrão e persistência de Transações"

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
Você executa as tarefas da faixa-4 da feature "persistencia-filtros-navegacao" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-persistencia-filtros-navegacao-faixa-4 (branch spec/persistencia-filtros-navegacao-faixa-4) — já preparado.
Leia primeiro: .spec/features/persistencia-filtros-navegacao/spec.md, .spec/features/persistencia-filtros-navegacao/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-214 — "Testes automatizados de especificação AC-325 a AC-329"
  critérios/refs: AC-325 (Botão Limpar Filtros restaura mês atual e zera filtros secundários), AC-326 (Visibilidade condicional do botão Limpar Filtros), AC-327 (Armazenamento e restauração dos filtros e pesquisa de Transações), AC-328 (Armazenamento e restauração do período selecionado no Dashboard), AC-329 (Precedência de query params na URL e redefinição ao trocar de carteira)
  arquivos permitidos (e seus testes): test/persistencia-filtros-navegacao.spec.test.js
  mensagem de commit: "T-214 persistencia-filtros-navegacao: Testes automatizados de especificação AC-325 a AC-329"

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
git merge --no-ff spec/persistencia-filtros-navegacao-faixa-1 -m "merge faixa-1 (persistencia-filtros-navegacao)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-persistencia-filtros-navegacao-faixa-1 && git branch -d spec/persistencia-filtros-navegacao-faixa-1
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa persistencia-filtros-navegacao T-211 concluida
git merge --no-ff spec/persistencia-filtros-navegacao-faixa-2 -m "merge faixa-2 (persistencia-filtros-navegacao)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-persistencia-filtros-navegacao-faixa-2 && git branch -d spec/persistencia-filtros-navegacao-faixa-2
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa persistencia-filtros-navegacao T-212 concluida
git merge --no-ff spec/persistencia-filtros-navegacao-faixa-3 -m "merge faixa-3 (persistencia-filtros-navegacao)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-persistencia-filtros-navegacao-faixa-3 && git branch -d spec/persistencia-filtros-navegacao-faixa-3
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa persistencia-filtros-navegacao T-213 concluida
git merge --no-ff spec/persistencia-filtros-navegacao-faixa-4 -m "merge faixa-4 (persistencia-filtros-navegacao)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-persistencia-filtros-navegacao-faixa-4 && git branch -d spec/persistencia-filtros-navegacao-faixa-4
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa persistencia-filtros-navegacao T-214 concluida
```

5. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify persistencia-filtros-navegacao
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

6. **Acompanhamento (a cada ~1 min, enquanto os agentes trabalham)**: avise ANTES
   de despachar os agentes que o trabalho roda em background e que o resumo
   completo vem ao final. Marque cada tarefa no ledger quando um agente começa
   e quando termina (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-persistencia-filtros-navegacao-mumpt1dm --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado executando
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-persistencia-filtros-navegacao-mumpt1dm --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado concluida
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo persistencia-filtros-navegacao --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo persistencia-filtros-navegacao --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

