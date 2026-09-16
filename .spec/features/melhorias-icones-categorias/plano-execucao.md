# Plano de execução — melhorias-icones-categorias

> gerado por `onp-spec plano` em 2026-09-15 13:56 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano melhorias-icones-categorias`

## Resumo — o que vai acontecer

- **6 tarefa(s) pendente(s)**: 6 em 6 faixa(s) paralela(s) + 0 sequencial(is)
- **1 faixa = 1 worktree + 1 branch + 1 janela de contexto limpa** — faixas não compartilham nenhum arquivo entre si
- prefere outra seleção ou uma após a outra? Regenere com `onp-spec plano melhorias-icones-categorias --paralelizar T-xxx,T-yyy` ou `--sequencial`
- tudo acontece na branch de trabalho `spec/melhorias-icones-categorias`; levar para a main é decisão sua

## Faixas e ondas

### Onda 1 — faixa-1 ∥ faixa-2 ∥ faixa-3

#### faixa-1 — branch `spec/melhorias-icones-categorias-faixa-1` — worktree `../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-1`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-110 | Componente seletor de ícones reutilizável | `claude-sonnet-5` | medium | `src/components/shared/IconPicker.tsx` |

#### faixa-2 — branch `spec/melhorias-icones-categorias-faixa-2` — worktree `../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-2`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-111 | Seleção de ícone em categorias | `claude-sonnet-5` | low | `src/components/settings/CategoryForm.tsx`, `src/components/settings/CategoryList.tsx`, `src/types/category.ts` |

#### faixa-3 — branch `spec/melhorias-icones-categorias-faixa-3` — worktree `../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-3`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-112 | Seleção de ícone em formas de pagamento | `claude-sonnet-5` | low | `src/components/settings/PayMethodForm.tsx`, `src/components/settings/PayMethodList.tsx`, `src/types/payMethod.ts` |

### Onda 2 — faixa-4 ∥ faixa-5 ∥ faixa-6

#### faixa-4 — branch `spec/melhorias-icones-categorias-faixa-4` — worktree `../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-4`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-113 | Seleção de bandeira para cartões de crédito | `claude-sonnet-5` | medium | `src/components/credit-cards/CreditCardForm.tsx`, `src/components/credit-cards/CreditCardVisual.tsx`, `src/types/creditCard.ts` |

#### faixa-5 — branch `spec/melhorias-icones-categorias-faixa-5` — worktree `../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-5`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-114 | Auto-detecção de banco por nome de conta bancária | `claude-sonnet-5` | high | `src/lib/bankDetector.ts`, `src/components/settings/BankAccountForm.tsx`, `src/components/shared/BankPicker.tsx` |

#### faixa-6 — branch `spec/melhorias-icones-categorias-faixa-6` — worktree `../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-6`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-115 | Layout mobile ágil para lançamento de transação | `claude-sonnet-5` | high | `src/components/transactions/TransactionModal.tsx`, `src/components/transactions/MobileQuickEntry.tsx` |

## Gestão de branches e commits

1. branch de trabalho `spec/melhorias-icones-categorias` criada do ponto atual (se ainda não existir)
2. cada faixa nasce dela como branch própria e roda no seu worktree — **1 tarefa = 1 commit** (`T-xxx feature: título`)
3. terminou a onda → merge `--no-ff` de cada faixa de volta, na ordem; conflito interrompe a faixa e pede resolução humana
4. faixa mesclada → worktree removido, branch apagada, tarefa marcada `[concluida]` no tasks.md
5. gate final na branch de trabalho: `onp-spec verify melhorias-icones-categorias` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Paralelo nativo no Antigravity (janelas limpas, sem Claude CLI)

1. **Prepare a branch de trabalho e os worktrees** (terminal, na raiz do repositório):

```bash
git checkout -b spec/melhorias-icones-categorias   # ou: git checkout spec/melhorias-icones-categorias
git worktree add ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-1 -b spec/melhorias-icones-categorias-faixa-1
git worktree add ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-2 -b spec/melhorias-icones-categorias-faixa-2
git worktree add ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-3 -b spec/melhorias-icones-categorias-faixa-3
git worktree add ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-4 -b spec/melhorias-icones-categorias-faixa-4
git worktree add ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-5 -b spec/melhorias-icones-categorias-faixa-5
git worktree add ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-6 -b spec/melhorias-icones-categorias-faixa-6
```

2. **Abra um agente NOVO por faixa** (janela limpa) e cole o prompt da faixa:

#### Prompt — faixa-1

```
Você executa as tarefas da faixa-1 da feature "melhorias-icones-categorias" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-1 (branch spec/melhorias-icones-categorias-faixa-1) — já preparado.
Leia primeiro: .spec/features/melhorias-icones-categorias/spec.md, .spec/features/melhorias-icones-categorias/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-110 — "Componente seletor de ícones reutilizável"
  critérios/refs: AC-169 (Seletor de ícone no formulário de categoria), AC-171 (Seletor de ícone no formulário de forma de pagamento)
  arquivos permitidos (e seus testes): src/components/shared/IconPicker.tsx
  mensagem de commit: "T-110 melhorias-icones-categorias: Componente seletor de ícones reutilizável"

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
Você executa as tarefas da faixa-2 da feature "melhorias-icones-categorias" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-2 (branch spec/melhorias-icones-categorias-faixa-2) — já preparado.
Leia primeiro: .spec/features/melhorias-icones-categorias/spec.md, .spec/features/melhorias-icones-categorias/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-111 — "Seleção de ícone em categorias"
  critérios/refs: AC-169 (Seletor de ícone no formulário de categoria), AC-170 (Ícone exibido na listagem de categorias)
  arquivos permitidos (e seus testes): src/components/settings/CategoryForm.tsx, src/components/settings/CategoryList.tsx, src/types/category.ts
  mensagem de commit: "T-111 melhorias-icones-categorias: Seleção de ícone em categorias"

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
Você executa as tarefas da faixa-3 da feature "melhorias-icones-categorias" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-3 (branch spec/melhorias-icones-categorias-faixa-3) — já preparado.
Leia primeiro: .spec/features/melhorias-icones-categorias/spec.md, .spec/features/melhorias-icones-categorias/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-112 — "Seleção de ícone em formas de pagamento"
  critérios/refs: AC-171 (Seletor de ícone no formulário de forma de pagamento), AC-172 (Ícone exibido nos seletores e listagens de formas de pagamento)
  arquivos permitidos (e seus testes): src/components/settings/PayMethodForm.tsx, src/components/settings/PayMethodList.tsx, src/types/payMethod.ts
  mensagem de commit: "T-112 melhorias-icones-categorias: Seleção de ícone em formas de pagamento"

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
Você executa as tarefas da faixa-4 da feature "melhorias-icones-categorias" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-4 (branch spec/melhorias-icones-categorias-faixa-4) — já preparado.
Leia primeiro: .spec/features/melhorias-icones-categorias/spec.md, .spec/features/melhorias-icones-categorias/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-113 — "Seleção de bandeira para cartões de crédito"
  critérios/refs: AC-173 (Seletor de bandeira no formulário de cartão), AC-174 (Bandeira exibida no card visual do cartão)
  arquivos permitidos (e seus testes): src/components/credit-cards/CreditCardForm.tsx, src/components/credit-cards/CreditCardVisual.tsx, src/types/creditCard.ts
  mensagem de commit: "T-113 melhorias-icones-categorias: Seleção de bandeira para cartões de crédito"

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
Você executa as tarefas da faixa-5 da feature "melhorias-icones-categorias" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-5 (branch spec/melhorias-icones-categorias-faixa-5) — já preparado.
Leia primeiro: .spec/features/melhorias-icones-categorias/spec.md, .spec/features/melhorias-icones-categorias/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-114 — "Auto-detecção de banco por nome de conta bancária"
  critérios/refs: AC-175 (Auto-detecção de banco pelo nome da conta), AC-176 (Visualização prévia do banco auto-detectado), AC-177 (Seleção manual de banco/ícone para contas bancárias), AC-178 (Ícone e cores do banco exibidos na conta)
  arquivos permitidos (e seus testes): src/lib/bankDetector.ts, src/components/settings/BankAccountForm.tsx, src/components/shared/BankPicker.tsx
  mensagem de commit: "T-114 melhorias-icones-categorias: Auto-detecção de banco por nome de conta bancária"

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
Você executa as tarefas da faixa-6 da feature "melhorias-icones-categorias" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-6 (branch spec/melhorias-icones-categorias-faixa-6) — já preparado.
Leia primeiro: .spec/features/melhorias-icones-categorias/spec.md, .spec/features/melhorias-icones-categorias/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-115 — "Layout mobile ágil para lançamento de transação"
  critérios/refs: AC-179 (Layout mobile de lançamento seguindo padrão "Ágil"), AC-180 (Acessibilidade dos campos no layout mobile ágil)
  arquivos permitidos (e seus testes): src/components/transactions/TransactionModal.tsx, src/components/transactions/MobileQuickEntry.tsx
  mensagem de commit: "T-115 melhorias-icones-categorias: Layout mobile ágil para lançamento de transação"

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
git merge --no-ff spec/melhorias-icones-categorias-faixa-1 -m "merge faixa-1 (melhorias-icones-categorias)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-1 && git branch -d spec/melhorias-icones-categorias-faixa-1
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa melhorias-icones-categorias T-110 concluida
git merge --no-ff spec/melhorias-icones-categorias-faixa-2 -m "merge faixa-2 (melhorias-icones-categorias)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-2 && git branch -d spec/melhorias-icones-categorias-faixa-2
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa melhorias-icones-categorias T-111 concluida
git merge --no-ff spec/melhorias-icones-categorias-faixa-3 -m "merge faixa-3 (melhorias-icones-categorias)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-3 && git branch -d spec/melhorias-icones-categorias-faixa-3
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa melhorias-icones-categorias T-112 concluida
git merge --no-ff spec/melhorias-icones-categorias-faixa-4 -m "merge faixa-4 (melhorias-icones-categorias)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-4 && git branch -d spec/melhorias-icones-categorias-faixa-4
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa melhorias-icones-categorias T-113 concluida
git merge --no-ff spec/melhorias-icones-categorias-faixa-5 -m "merge faixa-5 (melhorias-icones-categorias)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-5 && git branch -d spec/melhorias-icones-categorias-faixa-5
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa melhorias-icones-categorias T-114 concluida
git merge --no-ff spec/melhorias-icones-categorias-faixa-6 -m "merge faixa-6 (melhorias-icones-categorias)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-melhorias-icones-categorias-faixa-6 && git branch -d spec/melhorias-icones-categorias-faixa-6
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa melhorias-icones-categorias T-115 concluida
```

5. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify melhorias-icones-categorias
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

6. **Acompanhamento (a cada ~1 min, enquanto os agentes trabalham)**: avise ANTES
   de despachar os agentes que o trabalho roda em background e que o resumo
   completo vem ao final. Marque cada tarefa no ledger quando um agente começa
   e quando termina (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-melhorias-icones-categorias-mu2qjjeo --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado executando
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-melhorias-icones-categorias-mu2qjjeo --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado concluida
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo melhorias-icones-categorias --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo melhorias-icones-categorias --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

