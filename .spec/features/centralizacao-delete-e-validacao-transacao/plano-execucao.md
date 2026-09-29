# Plano de execução — centralizacao-delete-e-validacao-transacao

> gerado por `onp-spec plano` em 2026-09-29 13:55 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano centralizacao-delete-e-validacao-transacao`

## Resumo — o que vai acontecer

- **4 tarefa(s) pendente(s)**: 4 em 4 faixa(s) paralela(s) + 0 sequencial(is)
- **1 faixa = 1 worktree + 1 branch + 1 janela de contexto limpa** — faixas não compartilham nenhum arquivo entre si
- prefere outra seleção ou uma após a outra? Regenere com `onp-spec plano centralizacao-delete-e-validacao-transacao --paralelizar T-xxx,T-yyy` ou `--sequencial`
- tudo acontece na branch de trabalho `spec/centralizacao-delete-e-validacao-transacao`; levar para a main é decisão sua

## Faixas e ondas

### Onda 1 — faixa-1 ∥ faixa-2 ∥ faixa-3

#### faixa-1 — branch `spec/centralizacao-delete-e-validacao-transacao-faixa-1` — worktree `../onp-worktrees/Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-faixa-1`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-215 | Centralização e transição suave do `TransactionDeleteDialog` com Portal | `claude-sonnet-5` | low | `src/components/transactions/TransactionDeleteDialog.tsx` |

#### faixa-2 — branch `spec/centralizacao-delete-e-validacao-transacao-faixa-2` — worktree `../onp-worktrees/Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-faixa-2`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-216 | Normalização de mensagens de erro de validação no cliente Axios e helper | `claude-sonnet-5` | low | `src/lib/axios.ts`, `src/utils/apiError.ts` |

#### faixa-3 — branch `spec/centralizacao-delete-e-validacao-transacao-faixa-3` — worktree `../onp-worktrees/Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-faixa-3`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-217 | Validação de descrição mínima e exibição de erro no `MobileQuickEntry` e `TransactionModal` | `claude-sonnet-5` | low | `src/components/transactions/MobileQuickEntry.tsx`, `src/components/transactions/TransactionModal.tsx` |

### Onda 2 — faixa-4

#### faixa-4 — branch `spec/centralizacao-delete-e-validacao-transacao-faixa-4` — worktree `../onp-worktrees/Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-faixa-4`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-218 | Testes automatizados de especificação AC-330 a AC-333 | `claude-sonnet-5` | low | `test/centralizacao-delete-e-validacao-transacao.spec.test.js` |

## Gestão de branches e commits

1. branch de trabalho `spec/centralizacao-delete-e-validacao-transacao` criada do ponto atual (se ainda não existir)
2. cada faixa nasce dela como branch própria e roda no seu worktree — **1 tarefa = 1 commit** (`T-xxx feature: título`)
3. terminou a onda → merge `--no-ff` de cada faixa de volta, na ordem; conflito interrompe a faixa e pede resolução humana
4. faixa mesclada → worktree removido, branch apagada, tarefa marcada `[concluida]` no tasks.md
5. gate final na branch de trabalho: `onp-spec verify centralizacao-delete-e-validacao-transacao` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Paralelo nativo no Antigravity (janelas limpas, sem Claude CLI)

1. **Prepare a branch de trabalho e os worktrees** (terminal, na raiz do repositório):

```bash
git checkout -b spec/centralizacao-delete-e-validacao-transacao   # ou: git checkout spec/centralizacao-delete-e-validacao-transacao
git worktree add ../onp-worktrees/Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-faixa-1 -b spec/centralizacao-delete-e-validacao-transacao-faixa-1
git worktree add ../onp-worktrees/Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-faixa-2 -b spec/centralizacao-delete-e-validacao-transacao-faixa-2
git worktree add ../onp-worktrees/Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-faixa-3 -b spec/centralizacao-delete-e-validacao-transacao-faixa-3
git worktree add ../onp-worktrees/Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-faixa-4 -b spec/centralizacao-delete-e-validacao-transacao-faixa-4
```

2. **Abra um agente NOVO por faixa** (janela limpa) e cole o prompt da faixa:

#### Prompt — faixa-1

```
Você executa as tarefas da faixa-1 da feature "centralizacao-delete-e-validacao-transacao" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-faixa-1 (branch spec/centralizacao-delete-e-validacao-transacao-faixa-1) — já preparado.
Leia primeiro: .spec/features/centralizacao-delete-e-validacao-transacao/spec.md, .spec/features/centralizacao-delete-e-validacao-transacao/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-215 — "Centralização e transição suave do `TransactionDeleteDialog` com Portal"
  critérios/refs: AC-330 (Renderização do diálogo de exclusão via Portal no body com centralização total), AC-331 (Animações de transição suave e suporte ao fechamento por tecla ESC)
  arquivos permitidos (e seus testes): src/components/transactions/TransactionDeleteDialog.tsx
  mensagem de commit: "T-215 centralizacao-delete-e-validacao-transacao: Centralização e transição suave do `TransactionDeleteDialog` com Portal"

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
Você executa as tarefas da faixa-2 da feature "centralizacao-delete-e-validacao-transacao" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-faixa-2 (branch spec/centralizacao-delete-e-validacao-transacao-faixa-2) — já preparado.
Leia primeiro: .spec/features/centralizacao-delete-e-validacao-transacao/spec.md, .spec/features/centralizacao-delete-e-validacao-transacao/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-216 — "Normalização de mensagens de erro de validação no cliente Axios e helper"
  critérios/refs: AC-333 (Extração automática de mensagens de validação da API (status 400 com errors))
  arquivos permitidos (e seus testes): src/lib/axios.ts, src/utils/apiError.ts
  mensagem de commit: "T-216 centralizacao-delete-e-validacao-transacao: Normalização de mensagens de erro de validação no cliente Axios e helper"

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
Você executa as tarefas da faixa-3 da feature "centralizacao-delete-e-validacao-transacao" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-faixa-3 (branch spec/centralizacao-delete-e-validacao-transacao-faixa-3) — já preparado.
Leia primeiro: .spec/features/centralizacao-delete-e-validacao-transacao/spec.md, .spec/features/centralizacao-delete-e-validacao-transacao/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-217 — "Validação de descrição mínima e exibição de erro no `MobileQuickEntry` e `TransactionModal`"
  critérios/refs: AC-332 (Validação prévia de tamanho mínimo de descrição no lançamento rápido mobile), AC-333 (Extração automática de mensagens de validação da API (status 400 com errors))
  arquivos permitidos (e seus testes): src/components/transactions/MobileQuickEntry.tsx, src/components/transactions/TransactionModal.tsx
  mensagem de commit: "T-217 centralizacao-delete-e-validacao-transacao: Validação de descrição mínima e exibição de erro no `MobileQuickEntry` e `TransactionModal`"

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
Você executa as tarefas da faixa-4 da feature "centralizacao-delete-e-validacao-transacao" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-faixa-4 (branch spec/centralizacao-delete-e-validacao-transacao-faixa-4) — já preparado.
Leia primeiro: .spec/features/centralizacao-delete-e-validacao-transacao/spec.md, .spec/features/centralizacao-delete-e-validacao-transacao/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-218 — "Testes automatizados de especificação AC-330 a AC-333"
  critérios/refs: AC-330 (Renderização do diálogo de exclusão via Portal no body com centralização total), AC-331 (Animações de transição suave e suporte ao fechamento por tecla ESC), AC-332 (Validação prévia de tamanho mínimo de descrição no lançamento rápido mobile), AC-333 (Extração automática de mensagens de validação da API (status 400 com errors))
  arquivos permitidos (e seus testes): test/centralizacao-delete-e-validacao-transacao.spec.test.js
  mensagem de commit: "T-218 centralizacao-delete-e-validacao-transacao: Testes automatizados de especificação AC-330 a AC-333"

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
git merge --no-ff spec/centralizacao-delete-e-validacao-transacao-faixa-1 -m "merge faixa-1 (centralizacao-delete-e-validacao-transacao)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-faixa-1 && git branch -d spec/centralizacao-delete-e-validacao-transacao-faixa-1
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa centralizacao-delete-e-validacao-transacao T-215 concluida
git merge --no-ff spec/centralizacao-delete-e-validacao-transacao-faixa-2 -m "merge faixa-2 (centralizacao-delete-e-validacao-transacao)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-faixa-2 && git branch -d spec/centralizacao-delete-e-validacao-transacao-faixa-2
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa centralizacao-delete-e-validacao-transacao T-216 concluida
git merge --no-ff spec/centralizacao-delete-e-validacao-transacao-faixa-3 -m "merge faixa-3 (centralizacao-delete-e-validacao-transacao)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-faixa-3 && git branch -d spec/centralizacao-delete-e-validacao-transacao-faixa-3
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa centralizacao-delete-e-validacao-transacao T-217 concluida
git merge --no-ff spec/centralizacao-delete-e-validacao-transacao-faixa-4 -m "merge faixa-4 (centralizacao-delete-e-validacao-transacao)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-faixa-4 && git branch -d spec/centralizacao-delete-e-validacao-transacao-faixa-4
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa centralizacao-delete-e-validacao-transacao T-218 concluida
```

5. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify centralizacao-delete-e-validacao-transacao
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

6. **Acompanhamento (a cada ~1 min, enquanto os agentes trabalham)**: avise ANTES
   de despachar os agentes que o trabalho roda em background e que o resumo
   completo vem ao final. Marque cada tarefa no ledger quando um agente começa
   e quando termina (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-mumqof13 --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado executando
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-centralizacao-delete-e-validacao-transacao-mumqof13 --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado concluida
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo centralizacao-delete-e-validacao-transacao --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo centralizacao-delete-e-validacao-transacao --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

