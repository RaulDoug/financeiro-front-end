# Especificação: Edição Segura e Confiável de Transações (Resolução do Erro 500 no Update)

> Feature: `edicao-transacao-segura`  
> Referência de Usuário: `US-079`  
> Metodologia: `onp-spec-driven`

---

## Contexto e Problema

1. **Erro 500 ao editar transação (AC-284, AC-286)**: Ao editar uma transação existente via modal (`TransactionModal` / `TransactionFormBase`), a requisição `PATCH /api/transaction/update/:id` retornava HTTP 500. Isso ocorria porque o front-end enviava o objeto completo com todos os campos (`bank_account_id`, `pay_methods_id`, `category_id`, `counterparty_id`, etc.) em vez de enviar somente os campos alterados (diff). Como a rota `GET /transaction` retornava apenas nomes textuais e não os UUIDs, o formulário executava fallbacks acidentais (ex: assumindo a primeira conta bancária ou método de pagamento da lista).
2. **Sobrescrita involuntária de Categoria no `CategorySelect` (AC-285)**: Ao montar o componente `CategorySelect` durante a edição, o `useEffect` interno auto-selecionava forçadamente a primeira categoria retornada (`onChange(filteredCategories[0].id)`) antes do término do matching de dados do `initialData`, trocando a categoria original da transação.
3. **Consumo de Chaves Estrangeiras Retornadas pelo Back-end (AC-284)**: O back-end foi atualizado para incluir `t.bank_account_id`, `t.category_id`, `t.pay_methods_id` e `t.counterparty_id` no `SELECT` da listagem. O formulário deve consumir esses IDs diretamente com prioridade máxima.
4. **Mensagens e Resiliência em Resposta a Erros no Modal (AC-287)**: Se ocorrer qualquer erro no servidor (status 500 ou 400), o modal deve exibir no banner de erro uma mensagem clara e amigável ao usuário.

---

## Critérios de Aceite

### US-079 — Edição Segura e Confiável de Transações
- **AC-284**: O formulário de edição (`TransactionFormBase`) deve mapear diretamente os IDs de FKs (`bank_account_id`, `pay_methods_id`, `category_id`, `counterparty_id`) fornecidos em `initialData`, garantindo que os selects de conta, método e categoria iniciem exatamente com os valores da transação existente.
- **AC-285**: O componente `CategorySelect` não deve sobrescrever a categoria com a primeira opção quando estiver em modo de edição e já possuir valor ou aguardar o valor inicial da transação (`hasInitialValue` / `isEditing`).
- **AC-286**: Ao submeter uma edição via `PATCH /api/transaction/update/:id`, o front-end deve gerar um payload em formato **diff** contendo exclusivamente os campos que foram modificados pelo usuário em relação ao `initialData`. Propriedades inalteradas não devem ser enviadas no payload.
- **AC-287**: Caso a requisição de atualização falhe com erro de servidor (HTTP 500), o modal deve tratar a exceção e apresentar no `errorBanner` uma mensagem amigável e acionável.
- **AC-288**: Prova executável automatizada com suíte de testes `test/edicao-transacao-segura.spec.test.js` cobrindo todos os critérios de aceitação com `node --test`.

---

## Suposições e Restrições Técnicas

| ID      | Suposição                                                                                         | Status     | Resolução                                                                          |
| ------- | ------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------- |
| ASM-069 | `GET /transaction` retorna `bank_account_id`, `category_id`, `pay_methods_id`, `counterparty_id`. | confirmada | Back-end atualizado pelo usuário para incluir os IDs na listagem.                  |
| ASM-070 | `PATCH /api/transaction/update/:id` aceita corpo parcial (`createSchema.shape.body.partial()`).   | confirmada | Zod schema do back-end valida campos parciais e atualiza apenas os informados.     |
| ASM-071 | O back-end é somente leitura para o assistente conforme regra de governança.                      | confirmada | Todas as alterações de código são estritamente limitadas ao repositório front-end. |

