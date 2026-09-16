# Spec: Lançamento de Transação em Qualquer Rota

> feature: lancamento-transacao-global
> status: implementada

## Contexto

Atualmente, o componente `<TransactionModal />` está montado apenas nas páginas locais `DashboardPage` (`/dashboard`) e `TransactionsPage` (`/transacoes`). Quando o usuário clica no botão de adicionar transação presente no layout (como o botão central "+" da barra de navegação inferior `MobileNav` ou atalhos) em qualquer outra tela (como `/configuracoes`, `/cartoes`, `/contas`, `/relatorios` ou `/investimentos`), a store global `useTransactionModalStore` tem seu estado atualizado para `isOpen: true`, mas nenhum modal é renderizado porque a rota atual não possui uma instância do componente montada no DOM.

Assim que o usuário navega para `/dashboard` ou `/transacoes`, essas páginas são montadas, leem o estado `isOpen: true` pendente na store e o modal abre repentinamente. Esta especificação define a centralização do `TransactionModal` no layout principal (`AppLayout`) para que a ação de lançar transação funcione de forma transparente e imediata em 100% das rotas e telas da aplicação.

## Histórias

### US-063 — Acesso Global ao Modal de Lançamento de Transação

Como usuário do aplicativo financeiro, quero clicar no botão de lançar uma transação a partir de qualquer tela e rota da aplicação, para registrar despesas, receitas e transferências imediatamente sem precisar antes mudar para a tela de dashboard ou de transações.

#### AC-221 — Abertura imediata do modal a partir de qualquer rota
- **Dado** que o usuário está em qualquer rota da aplicação (ex: `/configuracoes`, `/cartoes`, `/contas`, `/relatorios`, `/investimentos`)
- **Quando** clica no botão de adicionar/lançar transação (`data-testid="mobile-nav-quick-add"` ou atalho correspondente)
- **Então** o modal de lançamento de transação abre imediatamente sobre a tela atual, exibindo o formulário de cadastro pronto para inserção de dados.

#### AC-222 — Criação e persistência com invalidação de cache reativa
- **Dado** que o usuário preenche e submete os dados de uma transação no modal aberto a partir de qualquer tela
- **Quando** a criação é concluída via `useTransactionMutations`
- **Então** o modal é fechado, o feedback de sucesso é fornecido e os dados em cache no TanStack Query (`transactions`, `dashboard`, `bank-accounts`, `credit-cards`) são invalidados para refletir imediatamente as alterações em todas as telas.

#### AC-223 — Prevenção de vazamento de modal pendente entre rotas
- **Dado** que o usuário fechou o modal de transação em qualquer tela ou navegou entre rotas
- **Quando** transita para `/dashboard` ou `/transacoes`
- **Então** o modal NÃO reabre de forma espúria ou atrasada, garantindo que o estado de abertura esteja sempre sincronizado e limpo.

## Fora de escopo

- Alterações na API backend ou nas tabelas de banco de dados.
- Alteração nos layouts específicos dos gráficos ou relatórios.

## Suposições

| ID      | Suposição                                                                                                                                                                              | Status     | Resolução                                                                                 |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------- |
| ASM-057 | O componente `AppLayout` envolve todas as páginas autenticadas e é o ponto único adequado para hospedar o modal global de transações, assim como já faz com `TransactionDetailsModal`. | confirmada | Confirmado pela estrutura de rotas em `AppLayout.tsx` e uso de `TransactionDetailsModal`. |

## Perguntas em aberto

Nenhuma.

