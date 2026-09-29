# Spec: Correcoes Basicas — Troca de Posicao dos Campos no Mobile

> feature: correcoes-basicas
> status: implementada

## Contexto

Na tela de lançamento rápido de transações mobile (`MobileQuickEntry`), a ordem dos campos no grid coloca Conta antes de Forma de Pagamento. Para otimizar o fluxo de preenchimento (especialmente com Cartões de Crédito, onde a seleção do método auto-vincula e desabilita a conta bancária correspondente), o campo "Forma de Pagamento" deve assumir o primeiro lugar ao lado de "Categoria", enquanto "Conta de Saída/Conta de Entrada" passa para a linha de baixo ao lado de "Contraparte". O fluxo de transferências permanece inalterado.

## Histórias

### US-086 — Reorganização dos Campos de Pagamento e Conta no Layout Mobile

Como usuário realizando lançamentos pelo celular, quero visualizar o campo "Forma de Pagamento" antes de "Conta de Saída/Entrada", para que a seleção do método de pagamento oriente naturalmente o preenchimento ou bloqueio automático da conta bancária.

#### AC-318 — Troca de posição entre Forma de Pagamento e Conta de Saída/Entrada no lançamento de receitas e despesas mobile

- **Dado** que o modal de transações mobile é aberto para Despesa (`expenses`) ou Receita (`incomings`)
- **Quando** os seletores de dados da transação são renderizados no `MobileQuickEntry`
- **Então** a primeira linha de seletores exibe "Forma de Pagamento" (`chip-pay-method`) e "Categoria" (`chip-category`), e a segunda linha exibe "Conta de Saída/Conta de Entrada" (`chip-account`) e "Contraparte" (`chip-counterparty`).

#### AC-319 — Preservação da disposição dos campos no lançamento de transferências

- **Dado** que o usuário está na aba de "Transferência" (`transfers`) no `MobileQuickEntry`
- **Quando** os seletores são exibidos na tela
- **Então** a primeira linha permanece contendo "Conta de Origem" e "Conta de Destino" (`chip-account` e `chip-account-destiny`), e a segunda linha exibe "Forma de Pagamento" (`chip-pay-method`), sem nenhuma alteração no fluxo.

## Fora de escopo

- Alterações no modal desktop ou edição (`TransactionFormBase.tsx`).
- Modificações na API / back-end (somente leitura).
- Alterações no comportamento funcional das transferências móveis.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-080 | A inversão de ordem dos campos no grid mobile não quebra o comportamento dos selects nativos invisíveis que capturam o toque nos chips. | confirmada | Confirmado pela inspeção da estrutura DOM e eventos de clique |

## Perguntas em aberto

| ID | Pergunta | Status | Resposta |
|---|---|---|---|
| Q-044 | Deve ser feito algum ajuste no formulário desktop (`TransactionFormBase`)? | respondida | Não, a instrução especifica exclusivamente o layout mobile e mantém transferências inalteradas |
