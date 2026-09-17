# Plano de execução — animacoes-e-arraste-modais

> gerado por `onp-spec plano` em 2026-09-17 11:47 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano animacoes-e-arraste-modais`

## Resumo — o que vai acontecer

- **6 tarefa(s) pendente(s)**: 6 em 6 faixa(s) paralela(s) + 0 sequencial(is)
- **1 faixa = 1 worktree + 1 branch + 1 janela de contexto limpa** — faixas não compartilham nenhum arquivo entre si
- prefere outra seleção ou uma após a outra? Regenere com `onp-spec plano animacoes-e-arraste-modais --paralelizar T-xxx,T-yyy` ou `--sequencial`
- tudo acontece na branch de trabalho `spec/animacoes-e-arraste-modais`; levar para a main é decisão sua

## Faixas e ondas

### Onda 1 — faixa-1 ∥ faixa-2 ∥ faixa-3

#### faixa-1 — branch `spec/animacoes-e-arraste-modais-faixa-1` — worktree `../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-1`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-176 | Definição de keyframes e classes utilitárias de animação em index.css | `claude-sonnet-5` | medium | `src/index.css` |

#### faixa-2 — branch `spec/animacoes-e-arraste-modais-faixa-2` — worktree `../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-2`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-177 | Criação do hook utilitário useModalTransition para controle de desmonte seguro | `claude-sonnet-5` | medium | `src/hooks/useModalTransition.ts` |

#### faixa-3 — branch `spec/animacoes-e-arraste-modais-faixa-3` — worktree `../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-3`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-178 | Implementação de drag-to-dismiss e animações de entrada/saída em MobileQuickEntry | `claude-sonnet-5` | medium | `src/components/transactions/MobileQuickEntry.tsx` |

### Onda 2 — faixa-4 ∥ faixa-5 ∥ faixa-6

#### faixa-4 — branch `spec/animacoes-e-arraste-modais-faixa-4` — worktree `../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-4`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-179 | Integração de animações de entrada e saída em MoreMenuModal e TransactionModal | `claude-sonnet-5` | medium | `src/components/layout/MoreMenuModal.tsx`, `src/components/transactions/TransactionModal.tsx` |

#### faixa-5 — branch `spec/animacoes-e-arraste-modais-faixa-5` — worktree `../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-5`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-180 | Suavização de transição de rota (Viewport Fade) e modais de confirmação | `claude-sonnet-5` | medium | `src/layouts/AppLayout.tsx`, `src/components/bank-accounts/DeleteConfirmModal.tsx` |

#### faixa-6 — branch `spec/animacoes-e-arraste-modais-faixa-6` — worktree `../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-6`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-181 | Suíte de testes automatizados de especificação para critérios AC-266 a AC-273 | `claude-sonnet-5` | medium | `test/animacoes-e-arraste-modais.spec.test.js` |

## Gestão de branches e commits

1. branch de trabalho `spec/animacoes-e-arraste-modais` criada do ponto atual (se ainda não existir)
2. cada faixa nasce dela como branch própria e roda no seu worktree — **1 tarefa = 1 commit** (`T-xxx feature: título`)
3. terminou a onda → merge `--no-ff` de cada faixa de volta, na ordem; conflito interrompe a faixa e pede resolução humana
4. faixa mesclada → worktree removido, branch apagada, tarefa marcada `[concluida]` no tasks.md
5. gate final na branch de trabalho: `onp-spec verify animacoes-e-arraste-modais` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Paralelo nativo no Antigravity (janelas limpas, sem Claude CLI)

1. **Prepare a branch de trabalho e os worktrees** (terminal, na raiz do repositório):

```bash
git checkout -b spec/animacoes-e-arraste-modais   # ou: git checkout spec/animacoes-e-arraste-modais
git worktree add ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-1 -b spec/animacoes-e-arraste-modais-faixa-1
git worktree add ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-2 -b spec/animacoes-e-arraste-modais-faixa-2
git worktree add ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-3 -b spec/animacoes-e-arraste-modais-faixa-3
git worktree add ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-4 -b spec/animacoes-e-arraste-modais-faixa-4
git worktree add ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-5 -b spec/animacoes-e-arraste-modais-faixa-5
git worktree add ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-6 -b spec/animacoes-e-arraste-modais-faixa-6
```

2. **Abra um agente NOVO por faixa** (janela limpa) e cole o prompt da faixa:

#### Prompt — faixa-1

```
Você executa as tarefas da faixa-1 da feature "animacoes-e-arraste-modais" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-1 (branch spec/animacoes-e-arraste-modais-faixa-1) — já preparado.
Leia primeiro: .spec/features/animacoes-e-arraste-modais/spec.md, .spec/features/animacoes-e-arraste-modais/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-176 — "Definição de keyframes e classes utilitárias de animação em index.css"
  critérios/refs: AC-269 (Animações nativas de Slide para gavetas inferiores (Bottom Sheets)), AC-270 (Animações de Escala e Fade para diálogos centrais e popups), AC-273 (Transição sutil de visualização de conteúdo (Viewport Fade))
  arquivos permitidos (e seus testes): src/index.css
  mensagem de commit: "T-176 animacoes-e-arraste-modais: Definição de keyframes e classes utilitárias de animação em index.css"

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
Você executa as tarefas da faixa-2 da feature "animacoes-e-arraste-modais" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-2 (branch spec/animacoes-e-arraste-modais-faixa-2) — já preparado.
Leia primeiro: .spec/features/animacoes-e-arraste-modais/spec.md, .spec/features/animacoes-e-arraste-modais/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-177 — "Criação do hook utilitário useModalTransition para controle de desmonte seguro"
  critérios/refs: AC-271 (Hook gerenciador de ciclo de vida de desmonte seguro (`useModalTransition`))
  arquivos permitidos (e seus testes): src/hooks/useModalTransition.ts
  mensagem de commit: "T-177 animacoes-e-arraste-modais: Criação do hook utilitário useModalTransition para controle de desmonte seguro"

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
Você executa as tarefas da faixa-3 da feature "animacoes-e-arraste-modais" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-3 (branch spec/animacoes-e-arraste-modais-faixa-3) — já preparado.
Leia primeiro: .spec/features/animacoes-e-arraste-modais/spec.md, .spec/features/animacoes-e-arraste-modais/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-178 — "Implementação de drag-to-dismiss e animações de entrada/saída em MobileQuickEntry"
  critérios/refs: AC-266 (Detecção de toque e arraste descendente no topo da gaveta), AC-267 (Deslocamento visual em tempo real e atenuação de opacidade), AC-268 (Limiar de fechamento e restauração com mola elástica), AC-269 (Animações nativas de Slide para gavetas inferiores (Bottom Sheets))
  arquivos permitidos (e seus testes): src/components/transactions/MobileQuickEntry.tsx
  mensagem de commit: "T-178 animacoes-e-arraste-modais: Implementação de drag-to-dismiss e animações de entrada/saída em MobileQuickEntry"

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
Você executa as tarefas da faixa-4 da feature "animacoes-e-arraste-modais" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-4 (branch spec/animacoes-e-arraste-modais-faixa-4) — já preparado.
Leia primeiro: .spec/features/animacoes-e-arraste-modais/spec.md, .spec/features/animacoes-e-arraste-modais/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-179 — "Integração de animações de entrada e saída em MoreMenuModal e TransactionModal"
  critérios/refs: AC-269 (Animações nativas de Slide para gavetas inferiores (Bottom Sheets)), AC-270 (Animações de Escala e Fade para diálogos centrais e popups), AC-272 (Abertura e fechamento com animação na gaveta de Mais Opções)
  arquivos permitidos (e seus testes): src/components/layout/MoreMenuModal.tsx, src/components/transactions/TransactionModal.tsx
  mensagem de commit: "T-179 animacoes-e-arraste-modais: Integração de animações de entrada e saída em MoreMenuModal e TransactionModal"

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
Você executa as tarefas da faixa-5 da feature "animacoes-e-arraste-modais" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-5 (branch spec/animacoes-e-arraste-modais-faixa-5) — já preparado.
Leia primeiro: .spec/features/animacoes-e-arraste-modais/spec.md, .spec/features/animacoes-e-arraste-modais/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-180 — "Suavização de transição de rota (Viewport Fade) e modais de confirmação"
  critérios/refs: AC-270 (Animações de Escala e Fade para diálogos centrais e popups), AC-273 (Transição sutil de visualização de conteúdo (Viewport Fade))
  arquivos permitidos (e seus testes): src/layouts/AppLayout.tsx, src/components/bank-accounts/DeleteConfirmModal.tsx
  mensagem de commit: "T-180 animacoes-e-arraste-modais: Suavização de transição de rota (Viewport Fade) e modais de confirmação"

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
Você executa as tarefas da faixa-6 da feature "animacoes-e-arraste-modais" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-6 (branch spec/animacoes-e-arraste-modais-faixa-6) — já preparado.
Leia primeiro: .spec/features/animacoes-e-arraste-modais/spec.md, .spec/features/animacoes-e-arraste-modais/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-181 — "Suíte de testes automatizados de especificação para critérios AC-266 a AC-273"
  critérios/refs: AC-266 (Detecção de toque e arraste descendente no topo da gaveta), AC-267 (Deslocamento visual em tempo real e atenuação de opacidade), AC-268 (Limiar de fechamento e restauração com mola elástica), AC-269 (Animações nativas de Slide para gavetas inferiores (Bottom Sheets)), AC-270 (Animações de Escala e Fade para diálogos centrais e popups), AC-271 (Hook gerenciador de ciclo de vida de desmonte seguro (`useModalTransition`)), AC-272 (Abertura e fechamento com animação na gaveta de Mais Opções), AC-273 (Transição sutil de visualização de conteúdo (Viewport Fade))
  arquivos permitidos (e seus testes): test/animacoes-e-arraste-modais.spec.test.js
  mensagem de commit: "T-181 animacoes-e-arraste-modais: Suíte de testes automatizados de especificação para critérios AC-266 a AC-273"

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
git merge --no-ff spec/animacoes-e-arraste-modais-faixa-1 -m "merge faixa-1 (animacoes-e-arraste-modais)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-1 && git branch -d spec/animacoes-e-arraste-modais-faixa-1
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa animacoes-e-arraste-modais T-176 concluida
git merge --no-ff spec/animacoes-e-arraste-modais-faixa-2 -m "merge faixa-2 (animacoes-e-arraste-modais)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-2 && git branch -d spec/animacoes-e-arraste-modais-faixa-2
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa animacoes-e-arraste-modais T-177 concluida
git merge --no-ff spec/animacoes-e-arraste-modais-faixa-3 -m "merge faixa-3 (animacoes-e-arraste-modais)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-3 && git branch -d spec/animacoes-e-arraste-modais-faixa-3
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa animacoes-e-arraste-modais T-178 concluida
git merge --no-ff spec/animacoes-e-arraste-modais-faixa-4 -m "merge faixa-4 (animacoes-e-arraste-modais)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-4 && git branch -d spec/animacoes-e-arraste-modais-faixa-4
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa animacoes-e-arraste-modais T-179 concluida
git merge --no-ff spec/animacoes-e-arraste-modais-faixa-5 -m "merge faixa-5 (animacoes-e-arraste-modais)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-5 && git branch -d spec/animacoes-e-arraste-modais-faixa-5
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa animacoes-e-arraste-modais T-180 concluida
git merge --no-ff spec/animacoes-e-arraste-modais-faixa-6 -m "merge faixa-6 (animacoes-e-arraste-modais)"
git worktree remove ../onp-worktrees/Front-End_Financeiro-animacoes-e-arraste-modais-faixa-6 && git branch -d spec/animacoes-e-arraste-modais-faixa-6
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa animacoes-e-arraste-modais T-181 concluida
```

5. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify animacoes-e-arraste-modais
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

6. **Acompanhamento (a cada ~1 min, enquanto os agentes trabalham)**: avise ANTES
   de despachar os agentes que o trabalho roda em background e que o resumo
   completo vem ao final. Marque cada tarefa no ledger quando um agente começa
   e quando termina (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-animacoes-e-arraste-modais-mu5gtrir --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado executando
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-animacoes-e-arraste-modais-mu5gtrir --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado concluida
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo animacoes-e-arraste-modais --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo animacoes-e-arraste-modais --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

