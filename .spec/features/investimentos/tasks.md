# Tasks: Investimentos

> feature: investimentos

## T-059 — Integração da API de Ativos de Investimento [pendente]

- Refs: US-021, AC-089, AC-090, AC-091, AC-092
- Arquivos: src/services/investment-asset.service.ts, src/hooks/useInvestmentAssets.ts
- Notas: Implementar GET, POST, PATCH, DELETE para `/api/investiment-asset`. Configurar React Query.

## T-060 — Interface de Listagem de Ativos [pendente]

- Refs: US-021, AC-089
- Arquivos: src/pages/Investments/index.tsx, src/pages/Investments/InvestmentList.tsx
- Notas: Criar a página principal em `/investments`. Listar ativos com cards ou tabela (nome, banco, data vencimento).

## T-061 — Formulário de Criação e Edição [pendente]

- Refs: US-021, AC-090, AC-091, AC-093, AC-094
- Arquivos: src/pages/Investments/InvestmentFormModal.tsx, src/pages/Investments/investmentSchema.ts
- Notas: Formulário (React Hook Form + Zod) com nome (min 2 chars), conta obrigatória, vencimento opcional.

## T-062 — Exclusão de Ativos [pendente]

- Refs: US-021, AC-092
- Arquivos: src/pages/Investments/InvestmentDeleteAlert.tsx
- Notas: AlertDialog de confirmação para exclusão e chamada à mutation de DELETE.

## T-063 — Banner de Funcionalidades Pendentes [pendente]

- Refs: US-022, AC-095
- Arquivos: src/pages/Investments/PendingFeaturesBanner.tsx, src/pages/Investments/index.tsx
- Notas: Adicionar o banner "Movimentações de investimento em breve" no topo ou meio da página.
