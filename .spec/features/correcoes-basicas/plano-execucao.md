# Plano de execução — correcoes-basicas

> gerado por `onp-spec plano` em 2026-09-29 12:55 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano correcoes-basicas --sequencial`

## Resumo — o que vai acontecer

- **modo SEQUENCIAL (escolha do usuário)**: 2 tarefa(s) pendente(s), UMA APÓS A OUTRA, na árvore principal
- sem worktrees e sem paralelismo — cada tarefa roda numa janela de contexto limpa, na ordem do tasks.md
- tudo acontece na branch de trabalho `spec/correcoes-basicas`; levar para a main é decisão sua

## Ordem de execução (uma tarefa após a outra)

| tarefa | título | modelo | esforço |
|---|---|---|---|
| T-206 | Trocar ordem dos campos no MobileQuickEntry | `claude-sonnet-5` | low |
| T-207 | Testes automatizados de especificação AC-318 e AC-319 | `claude-sonnet-5` | low |

## Gestão de branches e commits

1. branch de trabalho `spec/correcoes-basicas` criada do ponto atual (se ainda não existir)
2. as tarefas rodam nela mesma, na ordem — **1 tarefa = 1 commit** (`T-xxx feature: título`), marcada `[concluida]` só com trabalho feito
3. gate final na branch de trabalho: `onp-spec verify correcoes-basicas` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Sequencial no Antigravity (uma tarefa após a outra, sem Claude CLI)

1. **Entre na branch de trabalho** (terminal, na raiz do repositório):

```bash
git checkout -b spec/correcoes-basicas   # ou: git checkout spec/correcoes-basicas
```

2. **Execute as tarefas NA ORDEM, uma após a outra** (janela limpa por tarefa
   ajuda o foco; a próxima só começa quando a anterior commitou):

#### Prompt — T-206

```
Você executa UMA tarefa da feature "correcoes-basicas" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/correcoes-basicas/spec.md, .spec/features/correcoes-basicas/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-206 — "Trocar ordem dos campos no MobileQuickEntry"
  critérios/refs: AC-318 (Troca de posição entre Forma de Pagamento e Conta de Saída/Entrada no lançamento de receitas e despesas mobile), AC-319 (Preservação da disposição dos campos no lançamento de transferências)
  arquivos permitidos (e seus testes): src/components/transactions/MobileQuickEntry.tsx
  mensagem de commit: "T-206 correcoes-basicas: Trocar ordem dos campos no MobileQuickEntry"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa correcoes-basicas T-206 concluida` após o commit.

#### Prompt — T-207

```
Você executa UMA tarefa da feature "correcoes-basicas" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/correcoes-basicas/spec.md, .spec/features/correcoes-basicas/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-207 — "Testes automatizados de especificação AC-318 e AC-319"
  critérios/refs: AC-318 (Troca de posição entre Forma de Pagamento e Conta de Saída/Entrada no lançamento de receitas e despesas mobile), AC-319 (Preservação da disposição dos campos no lançamento de transferências)
  arquivos permitidos (e seus testes): test/correcoes-basicas.spec.test.js
  mensagem de commit: "T-207 correcoes-basicas: Testes automatizados de especificação AC-318 e AC-319"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `node --test --test-reporter=tap` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
```

`node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa correcoes-basicas T-207 concluida` após o commit.

3. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify correcoes-basicas
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

4. **Acompanhamento (a cada ~1 min, enquanto executa)**: avise ANTES de começar
   que o trabalho roda em background e que o resumo completo vem ao final. Marque
   cada tarefa no ledger ao começar e ao terminar (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-correcoes-basicas-mumoikw1 --tipo tarefa --tarefa <T-xxx> --faixa seq --estado executando   # ao começar
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run Front-End_Financeiro-correcoes-basicas-mumoikw1 --tipo tarefa --tarefa <T-xxx> --faixa seq --estado concluida    # após o commit
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo correcoes-basicas --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo correcoes-basicas --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

