# Tasks: Restauração de Tipografia dos Cards — Início e Transações

> feature: restauracao-tipografia-cards

## T-123 — Restaurar tipografia dos cards KPI no Dashboard

- Refs: US-058, AC-194, AC-195, AC-196
- Arquivos: src/pages/Dashboard/components/KpiCards.tsx
- Esforço: baixo
- Notas: Alterar as classes de fonte do título de `text-xs sm:text-sm` para `text-sm`; alterar o valor de `text-lg sm:text-xl lg:text-2xl` para `text-xl sm:text-2xl lg:text-3xl`; padronizar padding do ícone de `p-1.5 sm:p-2` para `p-2` e ícone de `w-4 h-4 sm:w-5 sm:h-5` para `w-5 h-5`.

## T-124 — Restaurar tipografia dos itens na lista mobile de Transações

- Refs: US-059, AC-197, AC-198, AC-199
- Arquivos: src/components/transactions/TransactionMobileList.tsx
- Esforço: baixo
- Notas: Alterar a classe da descrição de `text-xs sm:text-sm` para `text-sm`; alterar a classe do valor de `text-xs sm:text-sm` para `text-sm`. Manter chips de categoria/conta e data em `text-[10px]` para diferenciar hierarquia visual.

## T-125 — Testes Automatizados de Especificação da Feature

- Refs: US-058, US-059, AC-194, AC-195, AC-196, AC-197, AC-198, AC-199
- Arquivos: test/restauracao-tipografia-cards.spec.test.js
- Esforço: baixo
- Notas: Criar suíte de testes verificando a presença das classes CSS corretas nos elementos-alvo de cada AC. Verificar que `text-sm` (e não `text-xs`) está presente nos seletores de título e descrição; `text-xl`/`text-2xl`/`text-3xl` no valor dos KPIs; `text-sm` no valor da lista mobile.

