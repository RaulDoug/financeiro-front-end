# Especificação: Definição e Personalização da Data da Compra no Lançamento de Transações

> Feature: `data-compra-lancamento-transacoes`  
> Referência de Usuário: `US-097`  
> Metodologia: `onp-spec-driven`

---

## Contexto e Problema

Nos formulários de lançamento e edição de transações (Desktop em `TransactionFormBase` e Mobile em `MobileQuickEntry`), os usuários não possuíam um campo explícito para definir a **Data da Compra** (`purchase_date`).

A data da compra é fundamental no domínio financeiro, em especial para transações efetuadas com cartões de crédito e despesas/receitas cujo momento de realização difere do vencimento da fatura (`due_date`) ou da liquidação efetiva (`payment_date`). Sem esse campo no layout, a data da compra não podia ser retroagida ou selecionada manualmente pelo usuário.

---

## Critérios de Aceite

### US-097 — Definição e Personalização da Data da Compra no Lançamento de Transações
- **AC-347**: Disponibilização do campo "Data da Compra" no layout desktop (`TransactionFormBase.tsx`), com input tipo date, rotulado "Data da Compra *", `data-testid="input-purchase-date"`, inicializado por padrão com a data atual (`todayStr`) e preservando a data existente ao editar (`initialData.purchase_date`).
- **AC-348**: Disponibilização do campo "Data da Compra" no fluxo ágil mobile (`MobileQuickEntry.tsx`), com chip seletor ergonômico (`chip-purchase-date` e `input-quick-purchase-date`), suporte ao clique para acionamento direto do calendário nativo (`showPicker()`) e inicialização com a data atual (`todayStr`).
- **AC-349**: Envio consistente de `purchase_date` no payload de submissão na criação e no cálculo estrito de diff de edição (`buildUpdateTransactionDiff`) para PATCH, enviando a propriedade apenas quando houver alteração explícita.
- **AC-350**: Preservação e não-regressão das regras de data: preenchimento defensivo com data atual se inalterada, manutenção intacta de `due_date` e `payment_date`, e respeito à ordem de resolução de data (`payment_date` → `purchase_date` → `due_date`).
- **AC-351**: Prova executável automatizada através de `test/data-compra-lancamento-transacoes.spec.test.js` com 100% de aprovação no `node --test`.

---

## Suposições e Restrições Técnicas

| ID      | Suposição                                                                                    | Status     | Resolução                                                              |
| ------- | -------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------- |
| ASM-092 | O back-end aceita o campo `purchase_date` tanto no POST quanto no PATCH de transações.        | confirmada | Validado nos schemas (`transaction.ts`), nos contratos de API e testes. |
| ASM-093 | O campo Data da Compra aplica-se a despesas e receitas; transferências mantêm datas próprias. | confirmada | Transferências entre contas utilizam Data da Transferência/Efetivação.  |
