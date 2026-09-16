# Tasks: Suporte a Transferências — Categoria Padrão e Sinais de Entrada/Saída

> feature: transferencias-categorias-sinais

## T-151 — Expansão dos tipos de transação para suportar transfer_in e transfer_out [concluida]
- Refs: US-065, AC-236
- Arquivos: src/types/transaction.ts
- Notas: Adicionar 'transfer_in' e 'transfer_out' ao tipo TransactionType em transaction.ts.

## T-152 — Auto-vinculação e criação da categoria padrão "Transferência" [concluida]
- Refs: US-065, AC-234
- Arquivos: src/components/transactions/MobileQuickEntry.tsx, src/components/transactions/TransactionFormBase.tsx
- Notas: Em transferências, buscar ou auto-criar via API categoria com nome 'Transferência' (type: 'expenses', icon: 'arrow-left-right') e vincular seu ID no payload de salvamento.

## T-153 — Ocultação da categoria "Transferência" das listagens e seletores [concluida]
- Refs: US-065, AC-235
- Arquivos: src/pages/Settings/CategoriesSettings.tsx, src/components/transactions/CategorySelect.tsx, src/components/transactions/MobileQuickEntry.tsx
- Notas: Filtrar categorias cujo nome seja ou inicie com 'Transferência' para que fiquem invisíveis e protegidas contra exclusão do usuário.

## T-154 — Ajuste da formatação de valores e sinais para transfer_in e transfer_out [concluida]
- Refs: US-065, AC-236
- Arquivos: src/components/transactions/TransactionMobileList.tsx, src/components/transactions/TransactionTable.tsx, src/components/transactions/TransactionDetailsModal.tsx, src/pages/Dashboard/components/RecentTransactions.tsx
- Notas: Tratar transfer_in como positivo (+ R$ / verde) e transfer_out como saída (- R$ / vermelho) na listagem mobile, tabela desktop e modal de detalhes.

## T-155 — Testes automatizados de especificação AC-234 a AC-236 [concluida]
- Refs: US-065, AC-234, AC-235, AC-236
- Arquivos: test/transferencias-categorias-sinais.spec.test.js
- Notas: Criar suíte executável via node --test validando todas as regras e atributos implementados.

