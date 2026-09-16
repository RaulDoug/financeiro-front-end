# Plano de execução — correcao-cadastro-pay-method

> gerado por `onp-spec plano` em 2026-09-15 20:53 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano correcao-cadastro-pay-method`

## Resumo — o que vai acontecer

- **3 tarefa(s) pendente(s)**: 3 em 3 faixa(s) paralela(s) + 0 sequencial(is)
- **1 faixa = 1 worktree + 1 branch + 1 janela de contexto limpa** — faixas não compartilham nenhum arquivo entre si
- prefere outra seleção ou uma após a outra? Regenere com `onp-spec plano correcao-cadastro-pay-method --paralelizar T-xxx,T-yyy` ou `--sequencial`
- tudo acontece na branch de trabalho `spec/correcao-cadastro-pay-method`; levar para a main é decisão sua

## Faixas e ondas

### Onda 1 — faixa-1 ∥ faixa-2 ∥ faixa-3

#### faixa-1 — branch `spec/correcao-cadastro-pay-method-faixa-1` — worktree `../onp-worktrees/Front-End_Financeiro-correcao-cadastro-pay-method-faixa-1`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-137 | Sanitização de payload em payMethodService | `claude-sonnet-5` | medium | `src/services/payMethod.service.ts` |

#### faixa-2 — branch `spec/correcao-cadastro-pay-method-faixa-2` — worktree `../onp-worktrees/Front-End_Financeiro-correcao-cadastro-pay-method-faixa-2`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-138 | Ajuste no envio de dados no PayMethodModal | `claude-sonnet-5` | medium | `src/pages/Settings/PayMethodModal.tsx` |

#### faixa-3 — branch `spec/correcao-cadastro-pay-method-faixa-3` — worktree `../onp-worktrees/Front-End_Financeiro-correcao-cadastro-pay-method-faixa-3`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-139 | Testes automatizados dos critérios de aceite AC-218, AC-219 e AC-220 | `claude-sonnet-5` | medium | `test/correcao-cadastro-pay-method.spec.test.js` |

## Gestão de branches e commits

1. branch de trabalho `spec/correcao-cadastro-pay-method` criada do ponto atual (se ainda não existir)
2. cada faixa nasce dela como branch própria e roda no seu worktree — **1 tarefa = 1 commit** (`T-xxx feature: título`)
3. terminou a onda → merge `--no-ff` de cada faixa de volta, na ordem; conflito interrompe a faixa e pede resolução humana
4. faixa mesclada → worktree removido, branch apagada, tarefa marcada `[concluida]` no tasks.md
5. gate final na branch de trabalho: `onp-spec verify correcao-cadastro-pay-method` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Paralelo nativo no Antigravity (janelas limpas, sem Claude CLI)

1. **Prepare a branch de trabalho e os worktrees** (terminal, na raiz do repositório):

```bash
git checkout -b spec/correcao-cadastro-pay-method   # ou: git checkout spec/correcao-cadastro-pay-method
git worktree add ../onp-worktrees/Front-End_Financeiro-correcao-cadastro-pay-method-faixa-1 -b spec/correcao-cadastro-pay-method-faixa-1
git worktree add ../onp-worktrees/Front-End_Financeiro-correcao-cadastro-pay-method-faixa-2 -b spec/correcao-cadastro-pay-method-faixa-2
git worktree add ../onp-worktrees/Front-End_Financeiro-correcao-cadastro-pay-method-faixa-3 -b spec/correcao-cadastro-pay-method-faixa-3
```

2. **Abra um agente NOVO por faixa** (janela limpa) e cole o prompt da faixa:

#### Prompt — faixa-1

```
Você executa as tarefas da faixa-1 da feature "correcao-cadastro-pay-method" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-correcao-cadastro-pay-method-faixa-1 (branch spec/correcao-cadastro-pay-method-faixa-1) — já preparado.
Leia primeiro: .spec/features/correcao-cadastro-pay-method/spec.md, .spec/features/correcao-cadastro-pay-method/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-137 — "Sanitização de payload em payMethodService"
  critérios/refs: AC-218 (Sanitização estrita no payload de cadastro de método de pagamento), AC-219 (Sanitização estrita no payload de atualização de método de pagamento)
  arquivos permitidos (e seus testes): src/services/payMethod.service.ts
  mensagem de commit: "T-137 correcao-cadastro-pay-method: Sanitização de payload em payMethodService"

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
Você executa as tarefas da faixa-2 da feature "correcao-cadastro-pay-method" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-correcao-cadastro-pay-method-faixa-2 (branch spec/correcao-cadastro-pay-method-faixa-2) — já preparado.
Leia primeiro: .spec/features/correcao-cadastro-pay-method/spec.md, .spec/features/correcao-cadastro-pay-method/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-138 — "Ajuste no envio de dados no PayMethodModal"
  critérios/refs: AC-220 (Envio limpo e feedback no modal de método de pagamento)
  arquivos permitidos (e seus testes): src/pages/Settings/PayMethodModal.tsx
  mensagem de commit: "T-138 correcao-cadastro-pay-method: Ajuste no envio de dados no PayMethodModal"

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
Você executa as tarefas da faixa-3 da feature "correcao-cadastro-pay-method" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-correcao-cadastro-pay-method-faixa-3 (branch spec/correcao-cadastro-pay-method-faixa-3) — já preparado.
Leia primeiro: .spec/features/correcao-cadastro-pay-method/spec.md, .spec/features/correcao-cadastro-pay-method/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-139 — "Testes automatizados dos critérios de aceite AC-218, AC-219 e AC-220"
  critérios/refs: AC-218 (Sanitização estrita no payload de cadastro de método de pagamento), AC-219 (Sanitização estrita no payload de atualização de método de pagamento), AC-220 (Envio limpo e feedback no modal de método de pagamento)
  arquivos permitidos (e seus testes): test/correcao-cadastro-pay-method.spec.test.js
  mensagem de commit: "T-139 correcao-cadastro-pay-method: Testes automatizados dos critérios de aceite AC-218, AC-219 e AC-220"

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
git merge --no-ff spec/correcao-cadastro-pay-method-faixa-1 -m "merge faixa-1 (correcao-cadastro-pay-method)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-correcao-cadastro-pay-method-faixa-1 && git branch -d spec/correcao-cadastro-pay-method-faixa-1
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa correcao-cadastro-pay-method T-137 concluida
git merge --no-ff spec/correcao-cadastro-pay-method-faixa-2 -m "merge faixa-2 (correcao-cadastro-pay-method)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-correcao-cadastro-pay-method-faixa-2 && git branch -d spec/correcao-cadastro-pay-method-faixa-2
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa correcao-cadastro-pay-method T-138 concluida
git merge --no-ff spec/correcao-cadastro-pay-method-faixa-3 -m "merge faixa-3 (correcao-cadastro-pay-method)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-correcao-cadastro-pay-method-faixa-3 && git branch -d spec/correcao-cadastro-pay-method-faixa-3
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa correcao-cadastro-pay-method T-139 concluida
```

5. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify correcao-cadastro-pay-method
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

6. **Acompanhamento (a cada ~1 min, enquanto os agentes trabalham)**: avise ANTES
   de despachar os agentes que o trabalho roda em background e que o resumo
   completo vem ao final. Marque cada tarefa no ledger quando um agente começa
   e quando termina (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-correcao-cadastro-pay-method-mu35fkhm --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado executando
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-correcao-cadastro-pay-method-mu35fkhm --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado concluida
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo correcao-cadastro-pay-method --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo correcao-cadastro-pay-method --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

