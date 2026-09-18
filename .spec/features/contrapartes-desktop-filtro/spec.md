# Especificação: Filtragem Contextual de Contrapartes no Desktop

> Feature: `contrapartes-desktop-filtro`  
> Referência de Usuário: `US-080`  
> Metodologia: `onp-spec-driven`

---

## Contexto e Problema

1. **Ausência de filtro no Desktop (AC-294)**: Na tela de lançamento de transações no desktop (`TransactionFormBase`), o campo de seleção de contraparte (`Beneficiário / Destino` ou `Pagador / Origem`) iterava sobre a lista crua de contrapartes (`counterpartiesData`). Como resultado, ao lançar uma despesa (`expenses`), eram exibidos pagadores de receitas (`payer`) e contrapartes internas de transferências. O mesmo ocorria de forma invertida ao lançar receitas (`incomings`). No layout mobile (`MobileQuickEntry`), a filtragem já havia sido implementada anteriormente na feature `lancamento-mobile-agil` (US-064 / AC-232), mas o desktop havia ficado fora de escopo.
2. **Auto-seleção inconsistente e fallback cego (AC-295)**: Em novos lançamentos, caso a busca por contraparte correspondente falhasse, o sistema fazia fallback para `counterpartiesData[0].id`, atribuindo acidentalmente uma contraparte do tipo oposto. Na submissão (`handleSubmit`), o mesmo fallback cego ocorria.

---

## Critérios de Aceite

### US-080 — Filtragem Contextual de Contrapartes no Formulário Desktop
- **AC-294 — Filtragem estrita por tipo de transação no Desktop**:
  - Em transações do tipo Despesa (`type === 'expenses'`), o `<select>` de contrapartes deve listar exclusivamente contrapartes com `type === 'payee'`.
  - Em transações do tipo Receita (`type === 'incomings'`), o `<select>` de contrapartes deve listar exclusivamente contrapartes com `type === 'payer'`.
  - Contrapartes de sistema com nome `'Transferências'` ou `'Transferencias'` devem ser excluídas da listagem em ambos os tipos.
  - O elemento `<select>` desktop deve possuir `data-testid="select-counterparty"`.
- **AC-295 — Auto-seleção coerente e fallback defensivo**:
  - Em novos lançamentos (`!initialData`), a auto-seleção deve vincular o primeiro item da lista filtrada (`filteredCounterparties[0].id`).
  - Em edições (`initialData`), a contraparte original da transação deve ser mantida e exibida no seletor mesmo caso pertença a um formato legado.
  - O fallback do payload no submit deve selecionar `filteredCounterparties[0]?.id` em vez de selecionar cegamente o índice zero de todas as contrapartes.

