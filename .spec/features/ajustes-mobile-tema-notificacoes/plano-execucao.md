# Plano de execução — ajustes-mobile-tema-notificacoes

> gerado por `onp-spec plano` em 2026-09-15 09:23 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano ajustes-mobile-tema-notificacoes --sequencial`

## Resumo — o que vai acontecer

- **modo SEQUENCIAL (escolha do usuário)**: 6 tarefa(s) pendente(s), UMA APÓS A OUTRA, na árvore principal
- sem worktrees e sem paralelismo — cada tarefa roda numa janela de contexto limpa, na ordem do tasks.md
- tudo acontece na branch de trabalho `spec/ajustes-mobile-tema-notificacoes`; levar para a main é decisão sua

## Ordem de execução (uma tarefa após a outra)

| tarefa | título | modelo | esforço |
|---|---|---|---|
| T-087 | Correção do fluxo de dados e badge do Sino de Notificações | `claude-sonnet-5` | medium |
| T-088 | Ajuste de cores dos cards da Dashboard e componentes no Tema Escuro | `claude-sonnet-5` | medium |
| T-089 | Adaptação da Tabela e Filtros de Transações ao Tema Escuro | `claude-sonnet-5` | medium |
| T-090 | Header Mobile Compacto Anti-Quebra e Seletor de Carteira Responsivo | `claude-sonnet-5` | medium |
| T-091 | Barra de Navegação Inferior Mobile (Bottom Navigation) com Ação Rápida | `claude-sonnet-5` | medium |
| T-092 | Testes Automatizados de Especificação da Feature | `claude-sonnet-5` | medium |

## Gestão de branches e commits

1. branch de trabalho `spec/ajustes-mobile-tema-notificacoes` criada do ponto atual (se ainda não existir)
2. as tarefas rodam nela mesma, na ordem — **1 tarefa = 1 commit** (`T-xxx feature: título`), marcada `[concluida]` só com trabalho feito
3. gate final na branch de trabalho: `onp-spec verify ajustes-mobile-tema-notificacoes` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Sequencial no Antigravity (uma tarefa após a outra, sem Claude CLI)

1. **Entre na branch de trabalho** (terminal, na raiz do repositório):

```bash
git checkout -b spec/ajustes-mobile-tema-notificacoes   # ou: git checkout spec/ajustes-mobile-tema-notificacoes
```

2. **Execute as tarefas NA ORDEM, uma após a outra** (janela limpa por tarefa
   ajuda o foco; a próxima só começa quando a anterior commitou):

#### Prompt — T-087

```
Você executa UMA tarefa da feature "ajustes-mobile-tema-notificacoes" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/ajustes-mobile-tema-notificacoes/spec.md, .spec/features/ajustes-mobile-tema-notificacoes/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-087 — "Correção do fluxo de dados e badge do Sino de Notificações"
  critérios/refs: AC-123 (Badge numérico no sino com total de contas atrasadas), AC-124 (Listagem descritiva no popover de notificações), AC-125 (Estado vazio do sino quando não há pendências)
  arquivos permitidos (e seus testes): src/components/layout/NotificationsBell.tsx, src/components/layout/Topbar.tsx
  mensagem de commit: "T-087 ajustes-mobile-tema-notificacoes: Correção do fluxo de dados e badge do Sino de Notificações"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa ajustes-mobile-tema-notificacoes T-087 concluida` após o commit.

#### Prompt — T-088

```
Você executa UMA tarefa da feature "ajustes-mobile-tema-notificacoes" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/ajustes-mobile-tema-notificacoes/spec.md, .spec/features/ajustes-mobile-tema-notificacoes/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-088 — "Ajuste de cores dos cards da Dashboard e componentes no Tema Escuro"
  critérios/refs: AC-126 (Cards informativos da dashboard com fundo escuro)
  arquivos permitidos (e seus testes): src/pages/Dashboard/components/KpiCards.tsx, src/pages/Dashboard/components/AccountBalances.tsx, src/pages/Dashboard/components/CreditCardSummary.tsx, src/pages/Dashboard/components/RecentTransactions.tsx, src/pages/Dashboard/components/OverdueAlerts.tsx, src/pages/Dashboard/components/QuickActions.tsx, src/index.css
  mensagem de commit: "T-088 ajustes-mobile-tema-notificacoes: Ajuste de cores dos cards da Dashboard e componentes no Tema Escuro"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa ajustes-mobile-tema-notificacoes T-088 concluida` após o commit.

#### Prompt — T-089

```
Você executa UMA tarefa da feature "ajustes-mobile-tema-notificacoes" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/ajustes-mobile-tema-notificacoes/spec.md, .spec/features/ajustes-mobile-tema-notificacoes/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-089 — "Adaptação da Tabela e Filtros de Transações ao Tema Escuro"
  critérios/refs: AC-127 (Tabela de transações compatível com tema escuro), AC-128 (Barra de filtros e controles de transação no tema escuro)
  arquivos permitidos (e seus testes): src/components/transactions/TransactionTable.tsx, src/components/transactions/TransactionFilters.tsx, src/pages/Transactions/index.tsx
  mensagem de commit: "T-089 ajustes-mobile-tema-notificacoes: Adaptação da Tabela e Filtros de Transações ao Tema Escuro"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa ajustes-mobile-tema-notificacoes T-089 concluida` após o commit.

#### Prompt — T-090

```
Você executa UMA tarefa da feature "ajustes-mobile-tema-notificacoes" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/ajustes-mobile-tema-notificacoes/spec.md, .spec/features/ajustes-mobile-tema-notificacoes/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-090 — "Header Mobile Compacto Anti-Quebra e Seletor de Carteira Responsivo"
  critérios/refs: AC-129 (Header mobile compacto sem quebra ou overflow)
  arquivos permitidos (e seus testes): src/components/layout/Topbar.tsx, src/components/layout/WalletSelector.tsx
  mensagem de commit: "T-090 ajustes-mobile-tema-notificacoes: Header Mobile Compacto Anti-Quebra e Seletor de Carteira Responsivo"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa ajustes-mobile-tema-notificacoes T-090 concluida` após o commit.

#### Prompt — T-091

```
Você executa UMA tarefa da feature "ajustes-mobile-tema-notificacoes" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/ajustes-mobile-tema-notificacoes/spec.md, .spec/features/ajustes-mobile-tema-notificacoes/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-091 — "Barra de Navegação Inferior Mobile (Bottom Navigation) com Ação Rápida"
  critérios/refs: AC-130 (Barra de navegação inferior (Bottom Navigation) em todas as páginas mobile), AC-131 (Botão de ação rápida central para Nova Transação), AC-132 (Preservação da navegação desktop tradicional)
  arquivos permitidos (e seus testes): src/components/layout/MobileNav.tsx, src/layouts/AppLayout.tsx, src/components/layout/MoreMenuModal.tsx
  mensagem de commit: "T-091 ajustes-mobile-tema-notificacoes: Barra de Navegação Inferior Mobile (Bottom Navigation) com Ação Rápida"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa ajustes-mobile-tema-notificacoes T-091 concluida` após o commit.

#### Prompt — T-092

```
Você executa UMA tarefa da feature "ajustes-mobile-tema-notificacoes" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/ajustes-mobile-tema-notificacoes/spec.md, .spec/features/ajustes-mobile-tema-notificacoes/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-092 — "Testes Automatizados de Especificação da Feature"
  critérios/refs: AC-123 (Badge numérico no sino com total de contas atrasadas), AC-124 (Listagem descritiva no popover de notificações), AC-125 (Estado vazio do sino quando não há pendências), AC-126 (Cards informativos da dashboard com fundo escuro), AC-127 (Tabela de transações compatível com tema escuro), AC-128 (Barra de filtros e controles de transação no tema escuro), AC-129 (Header mobile compacto sem quebra ou overflow), AC-130 (Barra de navegação inferior (Bottom Navigation) em todas as páginas mobile), AC-131 (Botão de ação rápida central para Nova Transação), AC-132 (Preservação da navegação desktop tradicional)
  arquivos permitidos (e seus testes): test/ajustes-mobile-tema-notificacoes.spec.test.js
  mensagem de commit: "T-092 ajustes-mobile-tema-notificacoes: Testes Automatizados de Especificação da Feature"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa ajustes-mobile-tema-notificacoes T-092 concluida` após o commit.

3. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify ajustes-mobile-tema-notificacoes
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

4. **Acompanhamento (a cada ~1 min, enquanto executa)**: avise ANTES de começar
   que o trabalho roda em background e que o resumo completo vem ao final. Marque
   cada tarefa no ledger ao começar e ao terminar (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-ajustes-mobile-tema-notificacoes-mu2gsmhj --tipo tarefa --tarefa <T-xxx> --faixa seq --estado executando   # ao começar
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-ajustes-mobile-tema-notificacoes-mu2gsmhj --tipo tarefa --tarefa <T-xxx> --faixa seq --estado concluida    # após o commit
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo ajustes-mobile-tema-notificacoes --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo ajustes-mobile-tema-notificacoes --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

