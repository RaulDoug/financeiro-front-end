# Spec: Melhorias de Ícones e Seleção de Bandeiras

> feature: melhorias-icones-categorias
> status: pronta

## Contexto

Melhoria de experiência do usuário na gestão de categorias, formas de pagamento, contas bancárias e cartões de crédito, adicionando seleção visual de ícones e, no caso de cartões, seleção da bandeira. Contas bancárias recebem funcionalidade especial: auto-detecção de ícone e cores do banco baseada no nome, com lista curada dos principais bancos do mercado brasileiro, além de seleção manual.

## Histórias

### US-050 — Seleção de Ícone para Categorias e Contrapartes

Como usuário, quero escolher um ícone visual para cada categoria e contraparte que cadastro, para identificar rapidamente meus lançamentos na listagem.

#### AC-169 — Seletor de ícone no formulário de categoria

- **Dado** que o usuário está criando ou editando uma categoria
- **Quando** abre o campo de ícone
- **Então** vê um seletor de ícones (grid ou busca) com emojis ou ícones da biblioteca (ex: Lucide/HeroIcons), podendo escolher um e salvar junto com a categoria

#### AC-170 — Ícone exibido na listagem de categorias

- **Dado** que uma categoria possui ícone configurado
- **Quando** o usuário visualiza a listagem de categorias
- **Então** o ícone é exibido ao lado do nome da categoria

### US-051 — Seleção de Ícone para Formas de Pagamento

Como usuário, quero escolher um ícone para cada forma de pagamento (exceto cartões de crédito, que têm bandeira própria), para visualizá-las facilmente nas listas e seletores.

#### AC-171 — Seletor de ícone no formulário de forma de pagamento

- **Dado** que o usuário está criando ou editando uma forma de pagamento que não é cartão de crédito
- **Quando** abre o formulário
- **Então** há um campo de seleção de ícone com opções visuais relevantes (carteira, dinheiro, banco, PIX, etc.)

#### AC-172 — Ícone exibido nos seletores e listagens de formas de pagamento

- **Dado** que uma forma de pagamento possui ícone configurado
- **Quando** aparece em seletores (modais de transação, configurações)
- **Então** o ícone é exibido ao lado do nome

### US-052 — Seleção de Bandeira para Cartões de Crédito

Como usuário, quero selecionar a bandeira do meu cartão de crédito (Visa, Mastercard, Elo, etc.) ao cadastrá-lo, para identificá-lo visualmente de forma correta.

#### AC-173 — Seletor de bandeira no formulário de cartão

- **Dado** que o usuário está cadastrando ou editando um cartão de crédito
- **Quando** abre o formulário
- **Então** há um seletor de bandeira com as opções: Visa, Mastercard, Elo, Amex, Hipercard, Diners e "Outro", exibidas com logotipos ou ícones representativos

#### AC-174 — Bandeira exibida no card visual do cartão

- **Dado** que um cartão possui bandeira selecionada
- **Quando** o usuário visualiza o card visual do cartão na lista de cartões de crédito
- **Então** o logo/ícone da bandeira é exibido no canto do card visual

### US-053 — Auto-detecção de Banco por Nome para Contas Bancárias

Como usuário, quero que ao digitar o nome de uma conta bancária (ex: "Nubank Raul") o sistema detecte automaticamente o banco e aplique o ícone e as cores correspondentes, para agilizar o cadastro sem precisar selecionar manualmente.

#### AC-175 — Auto-detecção de banco pelo nome da conta

- **Dado** que o usuário está digitando o nome de uma conta bancária
- **Quando** o nome contém uma palavra-chave de banco reconhecido (ex: "Nubank", "Itaú", "Bradesco", "Caixa", "Santander", "Inter", "C6", "BTG", "Sicoob", "Original", "PicPay", "Mercado Pago")
- **Então** o sistema seleciona automaticamente o ícone e as cores correspondentes ao banco identificado

#### AC-176 — Visualização prévia do banco auto-detectado

- **Dado** que o banco foi auto-detectado pelo nome
- **Quando** o usuário visualiza o formulário
- **Então** há um preview visual mostrando o ícone e cores selecionados automaticamente, com indicação de que foram detectados automaticamente

#### AC-177 — Seleção manual de banco/ícone para contas bancárias

- **Dado** que o usuário quer escolher manualmente o ícone e cores da conta bancária
- **Quando** clica em "Trocar manualmente" ou abre o seletor de banco
- **Então** vê a lista completa de bancos disponíveis (incluindo os principais do mercado brasileiro) com seus ícones e cores, podendo selecionar qualquer um — mesmo que o nome da conta não contenha a palavra-chave

#### AC-178 — Ícone e cores do banco exibidos na conta

- **Dado** que uma conta bancária possui banco/ícone configurado (auto ou manual)
- **Quando** a conta aparece na listagem de contas, seletores de conta e no dashboard
- **Então** o ícone e cores do banco são exibidos consistentemente

### US-054 — Mobile: Lançamento de Transação com Layout Rápido

Como usuário em dispositivo móvel, quero um layout de lançamento de transação otimizado para mobile (seguindo o padrão Ágil descrito no design de referência), para registrar transações de forma muito rápida com o polegar.

#### AC-179 — Layout mobile de lançamento seguindo padrão "Ágil"

- **Dado** que o usuário está em mobile e abre o modal/bottom-sheet de nova transação
- **Quando** o componente é renderizado em viewport mobile (< 768px)
- **Então** o layout segue o padrão descrito nas telas de referência: teclado numérico grande para valor, abas de tipo (Receita/Despesa/Transferência) no topo, campos secundários (categoria, conta, data, descrição) em linha abaixo do valor, botão de salvar proeminente

#### AC-180 — Acessibilidade dos campos no layout mobile ágil

- **Dado** que o usuário está no layout mobile ágil
- **Quando** toca em qualquer campo secundário (categoria, conta, data)
- **Então** o seletor/picker correspondente abre em bottom-sheet ou modal nativo, sem deslocar o layout principal

## Fora de escopo

- Upload de imagem personalizada como ícone (apenas seleção de biblioteca curada).
- Sincronização automática de logo de banco via API externa.
- Ícones para investimentos (escopo separado).

## Suposições

| ID      | Suposição                                                                                                                                          | Status     | Resolução                                                                                                                              |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| ASM-045 | O campo `icon` (varchar 100) e `color` (varchar 20) foram adicionados pela API nas tabelas categories, pay_methods e bank_accounts.                | confirmada | API atualizada pelo usuário; campos disponíveis para envio direto no payload. Documentação atualizada em api_docs.md e front_docs2.md. |
| ASM-046 | A detecção automática de banco será feita por correspondência de string no front-end (lista hardcoded de palavras-chave → banco), sem chamada API. | confirmada | Confirma-se: lista curada de ~15 bancos principais.                                                                                    |
| ASM-047 | A bandeira do cartão será armazenada como string (ex: "visa", "mastercard") no campo `icon` do método de pagamento.                                | confirmada | Seguindo o mesmo padrão dos campos icon/color adicionados na API.                                                                      |

## Perguntas em aberto

| ID    | Pergunta                                                                                                                                                                  | Status     | Resposta                                                                                                                                                          |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q-036 | A API suporta salvar campo de ícone (emoji ou nome de ícone) para categorias, contas e métodos de pagamento? Se não, o ícone será salvo apenas localmente (localStorage)? | respondida | API atualizada com colunas `icon` (varchar 100) e `color` (varchar 20) nas tabelas categories, pay_methods e bank_accounts. Salvar diretamente no payload da API. |
| Q-037 | O layout "Ágil" de lançamento mobile deve substituir completamente o modal atual em mobile, ou ser uma opção alternativa?                                                 | respondida | Substituir completamente o formulário padrão em mobile (< 768px). Experiência totalmente otimizada para celular.                                                  |
