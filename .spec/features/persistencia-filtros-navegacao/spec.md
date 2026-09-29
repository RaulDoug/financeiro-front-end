# Spec: Persistência de Filtros e Limpeza Padrão em Transações e Dashboard

> feature: persistencia-filtros-navegacao
> status: implementada


## Contexto

Atualmente, ao clicar no botão "Limpar filtros" na tela de Transações, o estado de datas é removido por completo (`due_date_from` e `due_date_to` ficam indefinidos), fazendo com que a API busque todas as transações de todo o histórico da conta em vez de retornar ao filtro padrão do mês corrente. Além disso, ao transitar entre subpáginas do sistema (ex: navegar da tela de Transações para o Dashboard, Contas ou Configurações e retornar), os filtros aplicados, o texto digitado na pesquisa e o mês selecionado no Dashboard são reiniciados para o estado inicial, frustrando o fluxo de trabalho do usuário. Esta feature implementa a restauração correta para o mês atual ao limpar filtros e a retenção de estado persistente entre navegações para as telas de Transações e Dashboard.

## Histórias

### US-089 — Restauração do Filtro Padrão de Mês Atual ao Limpar Filtros em Transações

Como usuário analisando movimentações financeiras, quero que o botão de limpar filtros restaure a visualização para o mês atual padrão em vez de exibir todas as transações da história, para que eu visualize rapidamente o período corrente limpo de critérios secundários.

#### AC-325 — Botão Limpar Filtros restaura mês atual e zera filtros secundários

- **Dado** que o usuário está na tela de transações com filtros ativos (ex: texto de busca, status, categoria ou data de outro período)
- **Quando** o usuário clica no botão "Limpar filtros"
- **Então** o filtro de intervalo de datas (`due_date_from` e `due_date_to`) é restaurado para o primeiro e último dia do mês corrente, os filtros secundários (busca por texto, tipo, status, categorias, contas, métodos e valores) são limpos, e a consulta busca estritamente as transações do mês atual.

#### AC-326 — Visibilidade condicional do botão Limpar Filtros

- **Dado** que a listagem de transações está no seu estado padrão (intervalo de datas correspondente ao mês atual e nenhum filtro secundário preenchido)
- **Quando** a barra de filtros é renderizada
- **Então** o botão "Limpar filtros" permanece oculto; e assim que qualquer filtro for modificado (busca digitada, tipo ou status alternado, categoria/conta/método selecionado ou data alterada para outro mês/todas as datas), o botão se torna visível.

### US-090 — Persistência de Filtros e Pesquisa entre Navegação de Telas

Como usuário do FinFlow, quero navegar entre as telas e subpáginas do sistema mantendo meus filtros e pesquisas salvos, para que ao retornar para Transações ou Dashboard eu continue exatamente de onde parei.

#### AC-327 — Armazenamento e restauração dos filtros e pesquisa de Transações

- **Dado** que o usuário aplicou filtros na tela de Transações (como texto de busca, categoria, tipo, status ou navegação de mês)
- **Quando** o usuário navega para outra tela (ex: Dashboard, Contas, Configurações) e depois retorna para a página de Transações
- **Então** todos os filtros e a busca textual são restaurados exatamente como estavam antes de sair da página.

#### AC-328 — Armazenamento e restauração do período selecionado no Dashboard

- **Dado** que o usuário selecionou um mês ou ano específico no seletor de período do Dashboard
- **Quando** o usuário navega para outra tela e retorna ao Dashboard
- **Então** o mês/ano selecionado no Dashboard é recuperado do estado persistente, renderizando os KPIs e gráficos com o período escolhido anteriormente.

#### AC-329 — Precedência de query params na URL e redefinição ao trocar de carteira

- **Dado** que o usuário acessa `/transactions?status=expired` via atalho/notificação, ou altera a carteira ativa no seletor global
- **Quando** a tela de Transações é carregada ou a carteira ativa é trocada
- **Então** query params explícitos na URL têm precedência sobre os filtros salvos, e ao trocar de carteira ativa os filtros específicos por ID (categorias, métodos, contas) são redefinidos para evitar incongruências entre carteiras.

## Fora de escopo

- Alterações em arquivos do back-end (`API_Financeiro`), que permanece somente leitura.
- Persistência permanente de formulários modais de criação/edição não submetidos.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-083 | O armazenamento de filtros em Zustand com persistência local (`localStorage`) garante continuidade tanto na transição de telas quanto no recarregamento da página. | confirmada | Padrão já utilizado com sucesso nas stores de auth, tema e carteira. |
| ASM-084 | Ao alternar de carteira (`activeWalletId`), os filtros com IDs específicos de categorias, métodos e contas bancárias devem ser redefinidos para evitar que identificadores de uma carteira filtrem dados de outra. | confirmada | Garante integridade referencial entre diferentes carteiras. |

## Perguntas em aberto

| ID | Pergunta | Status | Resposta |
|---|---|---|---|
| Q-046 | Parâmetros de URL diretos (ex: `/transactions?status=expired` vindo de cards ou notificações) devem sobrescrever o filtro salvo no store? | respondida | Sim, parâmetros explícitos na URL devem ter precedência para garantir que cliques em cards de atalho abram a listagem filtrada correspondente. |
