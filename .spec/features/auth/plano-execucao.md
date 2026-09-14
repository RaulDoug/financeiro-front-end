# Plano de execução — auth

> gerado por `onp-spec plano` em 2026-09-14 19:05 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano auth --sequencial`

## Resumo — o que vai acontecer

- **modo SEQUENCIAL (escolha do usuário)**: 8 tarefa(s) pendente(s), UMA APÓS A OUTRA, na árvore principal
- sem worktrees e sem paralelismo — cada tarefa roda numa janela de contexto limpa, na ordem do tasks.md
- tudo acontece na branch de trabalho `spec/auth`; levar para a main é decisão sua

## Ordem de execução (uma tarefa após a outra)

| tarefa | título | modelo | esforço |
|---|---|---|---|
| T-001 | Configuração do Store e Interceptor Axios | `claude-sonnet-5` | medium |
| T-002 | Serviços de API (Login e Register) | `claude-sonnet-5` | medium |
| T-003 | Layout Base de Autenticação | `claude-sonnet-5` | medium |
| T-004 | Página de Login | `claude-sonnet-5` | medium |
| T-005 | Página de Registro | `claude-sonnet-5` | medium |
| T-006 | Página de Recuperação de Senha (Placeholder) | `claude-sonnet-5` | medium |
| T-007 | Guardas de Rota Privadas/Públicas | `claude-sonnet-5` | medium |
| T-008 | Integração Geral das Rotas de Auth | `claude-sonnet-5` | medium |

## Gestão de branches e commits

1. branch de trabalho `spec/auth` criada do ponto atual (se ainda não existir)
2. as tarefas rodam nela mesma, na ordem — **1 tarefa = 1 commit** (`T-xxx feature: título`), marcada `[concluida]` só com trabalho feito
3. gate final na branch de trabalho: `onp-spec verify auth` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Sequencial no Antigravity (uma tarefa após a outra, sem Claude CLI)

1. **Entre na branch de trabalho** (terminal, na raiz do repositório):

```bash
git checkout -b spec/auth   # ou: git checkout spec/auth
```

2. **Execute as tarefas NA ORDEM, uma após a outra** (janela limpa por tarefa
   ajuda o foco; a próxima só começa quando a anterior commitou):

#### Prompt — T-001

```
Você executa UMA tarefa da feature "auth" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/auth/spec.md, .spec/features/auth/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-001 — "Configuração do Store e Interceptor Axios"
  critérios/refs: AC-008 (Sessão expirada)
  arquivos permitidos (e seus testes): src/stores/auth.store.ts, src/lib/axios.ts
  mensagem de commit: "T-001 auth: Configuração do Store e Interceptor Axios"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa auth T-001 concluida` após o commit.

#### Prompt — T-002

```
Você executa UMA tarefa da feature "auth" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/auth/spec.md, .spec/features/auth/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-002 — "Serviços de API (Login e Register)"
  critérios/refs: AC-003 (Limite de tentativas excedido (Rate limit)), AC-005 (Registro com sucesso e auto-login), AC-006 (E-mail já em uso)
  arquivos permitidos (e seus testes): src/services/auth.service.ts
  mensagem de commit: "T-002 auth: Serviços de API (Login e Register)"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa auth T-002 concluida` após o commit.

#### Prompt — T-003

```
Você executa UMA tarefa da feature "auth" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/auth/spec.md, .spec/features/auth/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-003 — "Layout Base de Autenticação"
  critérios/refs: US-001, US-002
  arquivos permitidos (e seus testes): src/layouts/AuthLayout.tsx, src/components/ui/AuthCard.tsx
  mensagem de commit: "T-003 auth: Layout Base de Autenticação"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa auth T-003 concluida` após o commit.

#### Prompt — T-004

```
Você executa UMA tarefa da feature "auth" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/auth/spec.md, .spec/features/auth/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-004 — "Página de Login"
  critérios/refs: AC-001 (Login com sucesso), AC-002 (Credenciais inválidas), AC-003 (Limite de tentativas excedido (Rate limit))
  arquivos permitidos (e seus testes): src/pages/auth/LoginPage.tsx
  mensagem de commit: "T-004 auth: Página de Login"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa auth T-004 concluida` após o commit.

#### Prompt — T-005

```
Você executa UMA tarefa da feature "auth" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/auth/spec.md, .spec/features/auth/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-005 — "Página de Registro"
  critérios/refs: AC-004 (Senha forte), AC-005 (Registro com sucesso e auto-login), AC-006 (E-mail já em uso)
  arquivos permitidos (e seus testes): src/pages/auth/RegisterPage.tsx
  mensagem de commit: "T-005 auth: Página de Registro"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa auth T-005 concluida` após o commit.

#### Prompt — T-006

```
Você executa UMA tarefa da feature "auth" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/auth/spec.md, .spec/features/auth/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-006 — "Página de Recuperação de Senha (Placeholder)"
  critérios/refs: AC-010 (Acesso à página de recuperação), AC-011 (Validação do placeholder)
  arquivos permitidos (e seus testes): src/pages/auth/ForgotPasswordPage.tsx
  mensagem de commit: "T-006 auth: Página de Recuperação de Senha (Placeholder)"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa auth T-006 concluida` após o commit.

#### Prompt — T-007

```
Você executa UMA tarefa da feature "auth" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/auth/spec.md, .spec/features/auth/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-007 — "Guardas de Rota Privadas/Públicas"
  critérios/refs: AC-007 (Redirecionamento de não autenticados), AC-009 (Redirecionamento de logados da tela de login), AC-012 (Ação de Sair (Logout))
  arquivos permitidos (e seus testes): src/routes/PrivateRoute.tsx, src/routes/PublicRoute.tsx
  mensagem de commit: "T-007 auth: Guardas de Rota Privadas/Públicas"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa auth T-007 concluida` após o commit.

#### Prompt — T-008

```
Você executa UMA tarefa da feature "auth" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/auth/spec.md, .spec/features/auth/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-008 — "Integração Geral das Rotas de Auth"
  critérios/refs: US-001, US-002, US-003
  arquivos permitidos (e seus testes): src/App.tsx, src/routes/index.tsx
  mensagem de commit: "T-008 auth: Integração Geral das Rotas de Auth"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa auth T-008 concluida` após o commit.

3. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify auth
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

4. **Acompanhamento (a cada ~1 min, enquanto executa)**: avise ANTES de começar
   que o trabalho roda em background e que o resumo completo vem ao final. Marque
   cada tarefa no ledger ao começar e ao terminar (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-auth-mu1m4e4r --tipo tarefa --tarefa <T-xxx> --faixa seq --estado executando   # ao começar
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-auth-mu1m4e4r --tipo tarefa --tarefa <T-xxx> --faixa seq --estado concluida    # após o commit
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo auth --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo auth --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

