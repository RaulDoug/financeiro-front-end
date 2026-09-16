# Spec: Lançamento Ágil Mobile Sem Teclado Virtual

> feature: lancamento-mobile-agil
> status: implementada

## Contexto

A tela de lançamento de transação no layout mobile (`MobileQuickEntry`) utilizava anteriormente um teclado numérico virtual composto por 12 botões que ocupava mais da metade da altura da tela. Devido a esse teclado embutido, campos cruciais como descrição, conta, categoria e método de pagamento ficavam espremidos em chips de rolagem horizontal minúsculos, dificultando a seleção rápida e a usabilidade em dispositivos móveis.

Além disso, a gaveta (bottom sheet) não podia ser fechada tocando no backdrop (área externa escurecida), obrigando o usuário a mirar no botão de fechar (X) no topo.

Esta especificação alinha a tela mobile com o layout de referência presente em `Docs/front_layout/transa_es_lan_amento_gil/` (`code.html` e `screen.png`), removendo o teclado virtual grande, permitindo inserção do valor com campo monetário em destaque com teclado nativo do dispositivo, fornecendo seletores dedicados e estruturados para Descrição, Conta, Categoria e Método de Pagamento, interruptor de status ("Já está pago"), e habilitando o fechamento ao tocar no backdrop.

---

## Histórias

### US-064 — Lançamento Ágil Mobile Sem Teclado Virtual e com Seletores Estruturados

Como usuário mobile do FinFlow,
quero lançar transações rapidamente em um drawer limpo com campos visíveis de descrição, conta, categoria e método de pagamento,
para registrar despesas e receitas em menos de 10 segundos sem que um teclado virtual customizado ocupe minha tela e podendo fechar o drawer tocando fora dele.

#### AC-224 — Fechamento do drawer ao tocar fora (Backdrop Click)
- **Dado** que a tela/drawer de lançamento mobile está aberta
- **Quando** o usuário clica ou toca na área escurecida externa (backdrop)
- **Então** o drawer fecha imediatamente disparando `onClose()` e sem submeter dados parciais.

#### AC-225 — Remoção do teclado numérico customizado e valor com entrada nativa
- **Dado** que o usuário abre a tela de lançamento rápido no mobile
- **Quando** visualiza o campo de valor
- **Então** nenhum teclado virtual de 12 botões é renderizado na tela (`quick-entry-keypad` não ocupa o layout)
- **E** o valor monetário é exibido em destaque (estilo `VALOR DA DESPESA / R$ 0,00`) com campo de entrada nativo com `inputMode="decimal"`.

#### AC-226 — Seleção fácil e estruturada de descrição, conta, categoria e método de pagamento
- **Dado** que o usuário está no formulário mobile
- **Quando** navega pelos campos
- **Então** encontra campos dedicados e confortáveis para:
  1. Descrição (input com ícone e placeholder claro)
  2. Conta Bancária (seletor com nome do banco e indicador visual)
  3. Categoria (seletor com ícone da categoria e nome)
  4. Método de Pagamento (seletor com ícone da forma e nome)
- **E** para transferências, exibe a Conta de Origem e Conta de Destino.

#### AC-227 — Status de liquidação ("Já está pago") e confirmação de lançamento
- **Dado** que o usuário preenche a transação
- **Quando** ativa ou desativa o switch "Já está pago"
- **Então** o status da transação é alternado entre `completed` (com data de pagamento atual) e `pending`
- **E** ao clicar no botão "Confirmar Lançamento (Salvar)", a transação é submetida com `description`, `value`, `type`, `bank_account_id`, `category_id`, `pay_methods_id` e `status` corretos.

#### AC-228 — Campos de Data de Vencimento e Data de Pagamento com padrão na data atual
- **Dado** que o usuário acessa o formulário de lançamento mobile
- **Quando** visualiza a seção de datas
- **Então** são exibidos dois campos dedicados: Data de Vencimento e Data de Pagamento
- **E** por padrão ambos inicializam com a data atual (hoje)
- **E** caso o usuário limpe ou não preencha um dos campos, o sistema aplica automaticamente a data atual como fallback no payload.

#### AC-229 — Injeção automática de contraparte e prevenção de erro 400
- **Dado** que o usuário submete uma transação no layout mobile
- **Quando** o payload é montado
- **Então** o sistema associa automaticamente uma contraparte válida (`counterparty_id`) correspondente ao tipo (payer/payee) ou cria contraparte 'Geral', evitando rejeição com HTTP 400
- **E** caso ocorra qualquer erro da API, um banner de erro visual amigável é exibido no drawer sem crash não capturado.

#### AC-230 — Edição fluida e acionamento direto do calendário nos campos de data
- **Dado** que o usuário toca ou clica nos campos de Data de Vencimento ou Data de Pagamento
- **Quando** o card ou o input é acionado
- **Então** o seletor nativo de calendário do navegador/sistema operacional é invocado imediatamente via `showPicker()` ou input direto visível
- **E** o valor selecionado atualiza os estados `dueDate` e `paymentDate` sem travar a interface.

#### AC-231 — Botão de confirmação de lançamento ampliado e ergonômico
- **Dado** que o usuário finaliza o preenchimento no layout mobile
- **Quando** visualiza o botão de ação no rodapé
- **Então** o botão "Confirmar Lançamento (Salvar)" possui dimensões aumentadas (`h-14` / 56px de altura, tipografia `text-base` e cantos `rounded-2xl`) facilitando o toque em telas sensíveis.

#### AC-232 — Seletor dedicado de Contraparte (Favorecido / Pagador)
- **Dado** que o usuário preenche a transação no layout mobile
- **Quando** visualiza os campos do formulário
- **Então** encontra um seletor dedicado para Contraparte com ícone e rótulo contextual (`Pagador / Origem` para receitas e `Beneficiário / Destino` para despesas)
- **E** pode selecionar facilmente a contraparte desejada dentre as cadastradas na carteira atual
- **E** o `counterparty_id` selecionado é enviado no payload de salvamento.

#### AC-233 — Ocultação de contraparte em transferências e injeção automática de contraparte padrão Transferências
- **Dado** que o usuário está na aba "Transferência" (`type === 'transfers'`) no layout mobile
- **Quando** visualiza a interface de seleção
- **Então** o seletor visual de "Beneficiário / Destino" fica oculto e o seletor de "Forma de Pagamento" ocupa a linha com ergonomia
- **E** ao salvar a transferência, o sistema vincula silenciosamente a contraparte padrão do sistema denominada `"Transferências"`, criando-a automaticamente via API caso ainda não exista
- **E** a contraparte `"Transferências"` fica oculta na tela de gerenciamento de contrapartes para impedir exclusão ou alteração indevida pelo usuário.

---

## Fora de escopo

- Alterações no modal desktop (`TransactionModal` em viewports >= 768px).
- Alterações em regras de negócio no backend.

---

## Suposições

| ID      | Suposição                                                                                                                            | Status     | Resolução                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------ |
| ASM-058 | O componente `MobileQuickEntry.tsx` é o único renderizado exclusivamente para viewports móveis (< 768px) no fluxo de nova transação. | confirmada | Confirmado em `TransactionModal.tsx` (`isMobile && !initialData`). |

---

## Perguntas em aberto

Nenhuma.

