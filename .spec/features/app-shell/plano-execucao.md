# Plano de execução — app-shell

> gerado por `onp-spec plano` em 2026-09-14 20:25 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano app-shell --sequencial`

## Resumo — o que vai acontecer

- **modo SEQUENCIAL (escolha do usuário)**: 7 tarefa(s) pendente(s), UMA APÓS A OUTRA, na árvore principal
- sem worktrees e sem paralelismo — cada tarefa roda numa janela de contexto limpa, na ordem do tasks.md
- tudo acontece na branch de trabalho `spec/app-shell`; levar para a main é decisão sua

## Ordem de execução (uma tarefa após a outra)

| tarefa | título | modelo | esforço |
|---|---|---|---|
| T-015 | Configurar Store de Wallet e Contexto Global | `claude-sonnet-5` | medium |
| T-016 | Configurar Interceptor do Axios com Header x-wallet-id | `claude-sonnet-5` | medium |
| T-017 | Implementar Proteção de Rotas com Seleção de Carteira | `claude-sonnet-5` | medium |
| T-018 | Layout Base com Áreas de Sidebar e Topbar | `claude-sonnet-5` | medium |
| T-019 | Menu Lateral (Sidebar) Responsivo | `claude-sonnet-5` | medium |
| T-020 | Barra Superior (Topbar) com Notificações e Menu de Perfil | `claude-sonnet-5` | medium |
| T-021 | Seletor de Carteira com Invalidação de Cache | `claude-sonnet-5` | medium |

## Gestão de branches e commits

1. branch de trabalho `spec/app-shell` criada do ponto atual (se ainda não existir)
2. as tarefas rodam nela mesma, na ordem — **1 tarefa = 1 commit** (`T-xxx feature: título`), marcada `[concluida]` só com trabalho feito
3. gate final na branch de trabalho: `onp-spec verify app-shell` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Sequencial no Antigravity (uma tarefa após a outra, sem Claude CLI)

1. **Entre na branch de trabalho** (terminal, na raiz do repositório):

```bash
git checkout -b spec/app-shell   # ou: git checkout spec/app-shell
```

2. **Execute as tarefas NA ORDEM, uma após a outra** (janela limpa por tarefa
   ajuda o foco; a próxima só começa quando a anterior commitou):

#### Prompt — T-015

```
Você executa UMA tarefa da feature "app-shell" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/app-shell/spec.md, .spec/features/app-shell/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-015 — "Configurar Store de Wallet e Contexto Global"
  critérios/refs: AC-026 (Recarregamento ao trocar de carteira)
  arquivos permitidos (e seus testes): src/stores/wallet.store.ts
  mensagem de commit: "T-015 app-shell: Configurar Store de Wallet e Contexto Global"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa app-shell T-015 concluida` após o commit.

#### Prompt — T-016

```
Você executa UMA tarefa da feature "app-shell" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/app-shell/spec.md, .spec/features/app-shell/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-016 — "Configurar Interceptor do Axios com Header x-wallet-id"
  critérios/refs: AC-027 (Header obrigatório nas requisições)
  arquivos permitidos (e seus testes): src/lib/axios.ts
  mensagem de commit: "T-016 app-shell: Configurar Interceptor do Axios com Header x-wallet-id"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa app-shell T-016 concluida` após o commit.

#### Prompt — T-017

```
Você executa UMA tarefa da feature "app-shell" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/app-shell/spec.md, .spec/features/app-shell/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-017 — "Implementar Proteção de Rotas com Seleção de Carteira"
  critérios/refs: AC-028 (Rota protegida sem carteira)
  arquivos permitidos (e seus testes): src/routes/PrivateRoute.tsx, src/routes/index.tsx
  mensagem de commit: "T-017 app-shell: Implementar Proteção de Rotas com Seleção de Carteira"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa app-shell T-017 concluida` após o commit.

#### Prompt — T-018

```
Você executa UMA tarefa da feature "app-shell" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/app-shell/spec.md, .spec/features/app-shell/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-018 — "Layout Base com Áreas de Sidebar e Topbar"
  critérios/refs: AC-021 (Exibição do layout base)
  arquivos permitidos (e seus testes): src/layouts/AppLayout.tsx
  mensagem de commit: "T-018 app-shell: Layout Base com Áreas de Sidebar e Topbar"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa app-shell T-018 concluida` após o commit.

#### Prompt — T-019

```
Você executa UMA tarefa da feature "app-shell" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/app-shell/spec.md, .spec/features/app-shell/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-019 — "Menu Lateral (Sidebar) Responsivo"
  critérios/refs: AC-021 (Exibição do layout base), AC-022 (Menu responsivo em dispositivos móveis)
  arquivos permitidos (e seus testes): src/components/layout/Sidebar.tsx, src/components/layout/SidebarItem.tsx
  mensagem de commit: "T-019 app-shell: Menu Lateral (Sidebar) Responsivo"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa app-shell T-019 concluida` após o commit.

#### Prompt — T-020

```
Você executa UMA tarefa da feature "app-shell" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/app-shell/spec.md, .spec/features/app-shell/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-020 — "Barra Superior (Topbar) com Notificações e Menu de Perfil"
  critérios/refs: AC-023 (Indicador de notificações), AC-024 (Menu de perfil do usuário)
  arquivos permitidos (e seus testes): src/components/layout/Topbar.tsx, src/components/layout/NotificationsBell.tsx, src/components/layout/UserMenu.tsx
  mensagem de commit: "T-020 app-shell: Barra Superior (Topbar) com Notificações e Menu de Perfil"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa app-shell T-020 concluida` após o commit.

#### Prompt — T-021

```
Você executa UMA tarefa da feature "app-shell" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/app-shell/spec.md, .spec/features/app-shell/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-021 — "Seletor de Carteira com Invalidação de Cache"
  critérios/refs: AC-025 (Seletor de carteira), AC-026 (Recarregamento ao trocar de carteira)
  arquivos permitidos (e seus testes): src/components/layout/WalletSelector.tsx, src/hooks/useWallets.ts
  mensagem de commit: "T-021 app-shell: Seletor de Carteira com Invalidação de Cache"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa app-shell T-021 concluida` após o commit.

3. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify app-shell
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

4. **Acompanhamento (a cada ~1 min, enquanto executa)**: avise ANTES de começar
   que o trabalho roda em background e que o resumo completo vem ao final. Marque
   cada tarefa no ledger ao começar e ao terminar (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-app-shell-mu1p06li --tipo tarefa --tarefa <T-xxx> --faixa seq --estado executando   # ao começar
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-app-shell-mu1p06li --tipo tarefa --tarefa <T-xxx> --faixa seq --estado concluida    # após o commit
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo app-shell --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo app-shell --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

