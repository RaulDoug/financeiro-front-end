# Plano de Execução: Centralização do Mês Vigente no Gráfico de Receitas x Despesas

> Feature: `centralizacao-mes-grafico-dashboard`
> Status: Em implementação

## 1. Arquivos Envolvidos
- `src/pages/Dashboard/components/IncomeExpenseChart.tsx`
- `test/centralizacao-mes-grafico-dashboard.spec.test.js`

## 2. Ordem de Execução
1. Atualizar `IncomeExpenseChart.tsx` com ref de rolagem, hook de centralização automática e tick estilizado no eixo X.
2. Criar suíte de testes de validação em `test/centralizacao-mes-grafico-dashboard.spec.test.js`.
3. Validar build e testes executando `npm run build` e `node --test test/centralizacao-mes-grafico-dashboard.spec.test.js`.
4. Atualizar status para implementada nas tarefas e especificação.

