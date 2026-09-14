# Plano de execução — onboarding

> gerado por `onp-spec plano` em 2026-09-14 19:57 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano onboarding --sequencial`

## Resumo — o que vai acontecer

- **modo SEQUENCIAL (escolha do usuário)**: 6 tarefa(s) pendente(s), UMA APÓS A OUTRA, na árvore principal
- sem worktrees e sem paralelismo — cada tarefa roda numa janela de contexto limpa, na ordem do tasks.md
- tudo acontece na branch de trabalho `spec/onboarding`; levar para a main é decisão sua

## Ordem de execução (uma tarefa após a outra)

| tarefa | título | modelo | esforço |
|---|---|---|---|
| T-009 | Lógica Global de Redirecionamento para Onboarding | `claude-sonnet-5` | medium |
| T-010 | Serviços de API da Configuração Inicial | `claude-sonnet-5` | medium |
| T-011 | Estrutura Base e Layout do Wizard (Stepper) | `claude-sonnet-5` | medium |
| T-012 | Step 1: Criação da Carteira | `claude-sonnet-5` | medium |
| T-013 | Step 2: Criação da Conta Bancária Inicial | `claude-sonnet-5` | medium |
| T-014 | Step 3: Cartão de Crédito Opcional e Finalização | `claude-sonnet-5` | medium |

## Gestão de branches e commits

1. branch de trabalho `spec/onboarding` criada do ponto atual (se ainda não existir)
2. as tarefas rodam nela mesma, na ordem — **1 tarefa = 1 commit** (`T-xxx feature: título`), marcada `[concluida]` só com trabalho feito
3. gate final na branch de trabalho: `onp-spec verify onboarding` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Sequencial no Antigravity (uma tarefa após a outra, sem Claude CLI)

1. **Entre na branch de trabalho** (terminal, na raiz do repositório):

```bash
git checkout -b spec/onboarding   # ou: git checkout spec/onboarding
```

2. **Execute as tarefas NA ORDEM, uma após a outra** (janela limpa por tarefa
   ajuda o foco; a próxima só começa quando a anterior commitou):

#### Prompt — T-009

```
Você executa UMA tarefa da feature "onboarding" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/onboarding/spec.md, .spec/features/onboarding/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-009 — "Lógica Global de Redirecionamento para Onboarding"
  critérios/refs: AC-013 (Redirecionamento forçado ao onboarding), AC-019 (Prevenção de abandono do Wizard)
  arquivos permitidos (e seus testes): src/hooks/useOnboardingCheck.ts, src/routes/PrivateRoute.tsx, src/stores/wallet.store.ts
  mensagem de commit: "T-009 onboarding: Lógica Global de Redirecionamento para Onboarding"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa onboarding T-009 concluida` após o commit.

#### Prompt — T-010

```
Você executa UMA tarefa da feature "onboarding" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/onboarding/spec.md, .spec/features/onboarding/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-010 — "Serviços de API da Configuração Inicial"
  critérios/refs: US-004, US-005
  arquivos permitidos (e seus testes): src/services/wallet.service.ts, src/services/bankAccount.service.ts, src/services/payMethod.service.ts
  mensagem de commit: "T-010 onboarding: Serviços de API da Configuração Inicial"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa onboarding T-010 concluida` após o commit.

#### Prompt — T-011

```
Você executa UMA tarefa da feature "onboarding" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/onboarding/spec.md, .spec/features/onboarding/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-011 — "Estrutura Base e Layout do Wizard (Stepper)"
  critérios/refs: US-004, US-005
  arquivos permitidos (e seus testes): src/pages/onboarding/OnboardingPage.tsx, src/components/onboarding/Stepper.tsx, src/stores/onboarding.store.ts
  mensagem de commit: "T-011 onboarding: Estrutura Base e Layout do Wizard (Stepper)"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa onboarding T-011 concluida` após o commit.

#### Prompt — T-012

```
Você executa UMA tarefa da feature "onboarding" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/onboarding/spec.md, .spec/features/onboarding/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-012 — "Step 1: Criação da Carteira"
  critérios/refs: AC-014 (Criação da primeira carteira (Step 1))
  arquivos permitidos (e seus testes): src/components/onboarding/steps/StepWallet.tsx
  mensagem de commit: "T-012 onboarding: Step 1: Criação da Carteira"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa onboarding T-012 concluida` após o commit.

#### Prompt — T-013

```
Você executa UMA tarefa da feature "onboarding" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/onboarding/spec.md, .spec/features/onboarding/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-013 — "Step 2: Criação da Conta Bancária Inicial"
  critérios/refs: AC-015 (Criação da primeira conta bancária (Step 2)), AC-016 (Saldo inicial padrão (Conta Bancária))
  arquivos permitidos (e seus testes): src/components/onboarding/steps/StepBankAccount.tsx
  mensagem de commit: "T-013 onboarding: Step 2: Criação da Conta Bancária Inicial"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa onboarding T-013 concluida` após o commit.

#### Prompt — T-014

```
Você executa UMA tarefa da feature "onboarding" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/onboarding/spec.md, .spec/features/onboarding/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-014 — "Step 3: Cartão de Crédito Opcional e Finalização"
  critérios/refs: AC-017 (Adição de Cartão de Crédito (Step 3 - Opcional)), AC-018 (Pular adição de Cartão de Crédito (Step 3 - Opcional)), AC-020 (Registro do estado concluído)
  arquivos permitidos (e seus testes): src/components/onboarding/steps/StepCreditCard.tsx
  mensagem de commit: "T-014 onboarding: Step 3: Cartão de Crédito Opcional e Finalização"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa onboarding T-014 concluida` após o commit.

3. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify onboarding
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

4. **Acompanhamento (a cada ~1 min, enquanto executa)**: avise ANTES de começar
   que o trabalho roda em background e que o resumo completo vem ao final. Marque
   cada tarefa no ledger ao começar e ao terminar (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-onboarding-mu1o007a --tipo tarefa --tarefa <T-xxx> --faixa seq --estado executando   # ao começar
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-onboarding-mu1o007a --tipo tarefa --tarefa <T-xxx> --faixa seq --estado concluida    # após o commit
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo onboarding --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo onboarding --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

