# Plano de execução — ordenacao-multi-filtros-transacoes

> gerado por `onp-spec plano` em 2026-09-29 13:10 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano ordenacao-multi-filtros-transacoes --sequencial`

## Resumo — o que vai acontecer

- **modo SEQUENCIAL (escolha do usuário)**: 3 tarefa(s) pendente(s), UMA APÓS A OUTRA, na árvore principal
- sem worktrees e sem paralelismo — cada tarefa roda numa janela de contexto limpa, na ordem do tasks.md
- tudo acontece na branch de trabalho `spec/ordenacao-multi-filtros-transacoes`; levar para a main é decisão sua

## Ordem de execução (uma tarefa após a outra)

| tarefa | título | modelo | esforço |
|---|---|---|---|
| T-208 | Componente MultiSelect e integração nos Filtros Avançados | `claude-sonnet-5` | medium |
| T-209 | Ordenação dinâmica pelas colunas da tabela e barra de filtros | `claude-sonnet-5` | medium |
| T-210 | Testes automatizados de especificação AC-320 a AC-324 | `claude-sonnet-5` | low |

## Gestão de branches e commits

1. branch de trabalho `spec/ordenacao-multi-filtros-transacoes` criada do ponto atual (se ainda não existir)
2. as tarefas rodam nela mesma, na ordem — **1 tarefa = 1 commit** (`T-xxx feature: título`), marcada `[concluida]` só com trabalho feito
3. gate final na branch de trabalho: `onp-spec verify ordenacao-multi-filtros-transacoes` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Sequencial no Antigravity (uma tarefa após a outra, sem Claude CLI)

1. **Entre na branch de trabalho** (terminal, na raiz do repositório):

```bash
git checkout -b spec/ordenacao-multi-filtros-transacoes   # ou: git checkout spec/ordenacao-multi-filtros-transacoes
```

2. **Execute as tarefas NA ORDEM, uma após a outra** (janela limpa por tarefa
   ajuda o foco; a próxima só começa quando a anterior commitou):

#### Prompt — T-208

```
Você executa UMA tarefa da feature "ordenacao-multi-filtros-transacoes" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/ordenacao-multi-filtros-transacoes/spec.md, .spec/features/ordenacao-multi-filtros-transacoes/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-208 — "Componente MultiSelect e integração nos Filtros Avançados"
  critérios/refs: AC-322 (Interface de multi-seleção de categorias com contagem e chips), AC-323 (Consulta e filtragem na API com múltiplos identificadores), AC-324 (Limpeza e restauração completa dos filtros múltiplos)
  arquivos permitidos (e seus testes): src/components/common/MultiSelect.tsx, src/components/transactions/TransactionAdvancedFiltersModal.tsx, src/pages/Transactions/index.tsx
  mensagem de commit: "T-208 ordenacao-multi-filtros-transacoes: Componente MultiSelect e integração nos Filtros Avançados"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa ordenacao-multi-filtros-transacoes T-208 concluida` após o commit.

#### Prompt — T-209

```
Você executa UMA tarefa da feature "ordenacao-multi-filtros-transacoes" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/ordenacao-multi-filtros-transacoes/spec.md, .spec/features/ordenacao-multi-filtros-transacoes/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-209 — "Ordenação dinâmica pelas colunas da tabela e barra de filtros"
  critérios/refs: AC-320 (Cabeçalhos interativos e alternância de ordenação na tabela desktop), AC-321 (Preservação e sincronização da ordenação na barra de filtros)
  arquivos permitidos (e seus testes): src/components/transactions/TransactionTable.tsx, src/components/transactions/TransactionFilters.tsx, src/pages/Transactions/index.tsx
  mensagem de commit: "T-209 ordenacao-multi-filtros-transacoes: Ordenação dinâmica pelas colunas da tabela e barra de filtros"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa ordenacao-multi-filtros-transacoes T-209 concluida` após o commit.

#### Prompt — T-210

```
Você executa UMA tarefa da feature "ordenacao-multi-filtros-transacoes" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/ordenacao-multi-filtros-transacoes/spec.md, .spec/features/ordenacao-multi-filtros-transacoes/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-210 — "Testes automatizados de especificação AC-320 a AC-324"
  critérios/refs: AC-320 (Cabeçalhos interativos e alternância de ordenação na tabela desktop), AC-321 (Preservação e sincronização da ordenação na barra de filtros), AC-322 (Interface de multi-seleção de categorias com contagem e chips), AC-323 (Consulta e filtragem na API com múltiplos identificadores), AC-324 (Limpeza e restauração completa dos filtros múltiplos)
  arquivos permitidos (e seus testes): test/ordenacao-multi-filtros-transacoes.spec.test.js
  mensagem de commit: "T-210 ordenacao-multi-filtros-transacoes: Testes automatizados de especificação AC-320 a AC-324"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa ordenacao-multi-filtros-transacoes T-210 concluida` após o commit.

3. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify ordenacao-multi-filtros-transacoes
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

4. **Acompanhamento (a cada ~1 min, enquanto executa)**: avise ANTES de começar
   que o trabalho roda em background e que o resumo completo vem ao final. Marque
   cada tarefa no ledger ao começar e ao terminar (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-ordenacao-multi-filtros-transacoes-mump2kvn --tipo tarefa --tarefa <T-xxx> --faixa seq --estado executando   # ao começar
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-ordenacao-multi-filtros-transacoes-mump2kvn --tipo tarefa --tarefa <T-xxx> --faixa seq --estado concluida    # após o commit
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo ordenacao-multi-filtros-transacoes --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo ordenacao-multi-filtros-transacoes --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

