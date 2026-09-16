# Especificação: Suporte a Transferências — Categoria Padrão e Sinais de Entrada/Saída

> Feature: `transferencias-categorias-sinais`  
> Referência de Usuário: `US-065`  
> Metodologia: `onp-spec-driven`

---

## Contexto e Problema

Nas transferências entre contas bancárias registradas no sistema:
1. **Categoria Indevida**: As transações de transferência exibiam categorias aleatórias do usuário (como "Alimentação"), pois o sistema enviava o primeiro ID da lista em vez de uma categoria dedicada.
2. **Sinal Negativo na Conta de Destino**: A conta bancária que recebe a transferência (`destiny_bank_account_id`) exibia `- R$ 100,00` em vermelho na listagem, da mesma forma que a conta de saída, em vez de valor positivo (`+ R$ 100,00` em verde). A causa raiz identificada no backend é que o registro de entrada recebe `type: 'transfer_in'`, mas as telas de listagem verificavam apenas `type === 'incomings'`, tratando `transfer_in` como despesa por padrão.

---

## Critérios de Aceite

### AC-234 — Categoria Padrão Interna "Transferência"
- **Dado** que o usuário realiza uma transferência entre contas (no mobile ou desktop)
- **Quando** o payload de submissão para `POST /api/transaction/register` é gerado
- **Então** o sistema busca uma categoria existente com nome `"Transferência"` (ou cria automaticamente via API caso ainda não exista)
- **E** associa o `id` dessa categoria em `category_id`, garantindo que ambos os registros (`transfer_out` e `transfer_in`) sejam exibidos com a categoria "Transferência" em vez de categorias pessoais.

### AC-235 — Ocultação da Categoria "Transferência" das Listagens do Usuário
- **Dado** que o usuário acessa a tela de configurações de categorias (`/settings/categories`) ou os seletores de categoria de receitas/despesas
- **Quando** a lista de categorias é renderizada
- **Então** a categoria de sistema `"Transferência"` fica oculta das contagens e da tabela
- **E** o usuário é impedido de editar ou excluir acidentalmente a categoria de transferências do sistema.

### AC-236 — Exibição Correta de Sinal e Cores para `transfer_in` e `transfer_out`
- **Dado** que o usuário visualiza lançamentos na listagem mobile (`TransactionMobileList`), tabela desktop (`TransactionTable`) ou modal de detalhes
- **Quando** a transação é do tipo `transfer_in` (conta que recebeu a transferência)
- **Então** o valor é exibido com prefixo positivo `+ ` e cor verde (`text-emerald-600`)
- **Quando** a transação é do tipo `transfer_out` (conta de onde o dinheiro saiu)
- **Então** o valor é exibido com prefixo negativo `- ` e cor correspondente a saída.

---

## Suposições e Restrições Técnicas

| ID      | Suposição                                                                                                                                                 | Status     | Resolução                                                                                                           |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- |
| ASM-059 | O endpoint `POST /api/transaction/register` recebe apenas 1 `category_id` por requisição e o propaga tanto para `transfer_out` quanto para `transfer_in`. | confirmada | Confirmado no código do backend `API_Financeiro/src/services/transactions/transactionServices.js` (linhas 145-171). |
| ASM-060 | As transações retornadas pelo backend possuem `type: 'transfer_in'` e `type: 'transfer_out'`.                                                             | confirmada | Confirmado no backend `transactionServices.js` (`createInsertQuery` com `type: 'transfer_in'` e `'transfer_out'`).  |

---

## Fora de Escopo

- Alterações nas regras ou rotas do back-end.
- Mudanças no fluxo de parcelamento de cartão de crédito.

