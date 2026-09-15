# Spec: Melhorias ux mobile desktop

> feature: melhorias-ux-mobile-desktop
> status: pronta

## Contexto

Pacote integrado de ajustes de usabilidade, refinamento responsivo mobile e novas funcionalidades no Front-End financeiro. Contempla: remoção de controles redundantes no mobile, filtros avançados de transações (mobile e desktop), modal unificado de detalhes da transação em toda a aplicação, alinhamento do sino de alertas, seleção de mês no dashboard, paleta de cores e detalhes de cartões, exibição multi-linha sem scroll horizontal nos relatórios e correção do formulário de métodos de pagamento.

## Histórias

### US-036 — Experiência Mobile do App Shell e Dashboard

Como usuário mobile, quero um dashboard limpo e ajustado à tela do meu aparelho, com fontes legíveis, sem botões duplicados e com controle de mês do dashboard, para acompanhar minhas finanças confortavelmente.

#### AC-133 — Ocultação de ações redundantes e menu hambúrguer no mobile
- **Dado** que a aplicação está sendo executada em viewport mobile (< 768px)
- **Quando** o usuário visualiza o cabeçalho (Topbar) ou os botões de ação rápida da Dashboard
- **Então** o botão de menu hambúrguer no cabeçalho e os botões de lançamento de nova transação na Dashboard ficam ocultos, preservando o botão central (+) da Bottom Navigation como ação primária.

#### AC-134 — Tipografia fluida e responsiva nos cards da Dashboard
- **Dado** qualquer resolução de tela ou tamanho de dispositivo
- **Quando** os cards de KPIs e resumos financeiros são renderizados
- **Então** os títulos e valores utilizam tipografia proporcional com truncamento e quebra inteligente, sem que as palavras fiquem espremidas ou ultrapassem o contêiner.

#### AC-135 — Filtro de mês e ano no Dashboard
- **Dado** que o usuário está na página inicial (Dashboard)
- **Quando** ele altera o mês ou ano no seletor de período do Dashboard
- **Então** os indicadores de KPI, resumo de receitas/despesas e transações recentes atualizam os dados correspondentes ao mês selecionado.

#### AC-136 — Scroll horizontal e barras condensadas no gráfico de Receitas x Despesas da Dashboard
- **Dado** que o usuário visualiza o gráfico de receitas versus despesas no Dashboard em tela mobile
- **Quando** o gráfico é renderizado
- **Então** as barras mensais são exibidas com espaçamento condensado e contêiner com rolagem horizontal contínua (touch scroll) para visualização fluida de todos os meses.

### US-037 — Reorganização e Filtros Avançados na Tela de Transações

Como usuário que gerencia transações, quero filtros organizados sem quebra de layout no mobile e uma opção de filtros avançados por categoria e método de pagamento, para localizar registros com precisão em qualquer dispositivo.

#### AC-137 — Ocultação do botão de nova transação no mobile
- **Dado** a página de Transações em viewport mobile (< 768px)
- **Quando** o topo da página é visualizado
- **Então** o botão de cabeçalho "Nova Transação" fica oculto, utilizando o botão (+) da barra inferior.

#### AC-138 — Reorganização da barra de período e filtros de data no mobile
- **Dado** a barra de filtros da tela de transações em dispositivo móvel
- **Quando** os controles são renderizados
- **Então** o seletor de mês/ano fica posicionado na linha superior e os botões de atalho ("Este mês" e "Todas as datas") na linha inferior, contidos perfeitamente dentro dos limites do card sem transbordar.

#### AC-139 — Botão e painel de Filtros Avançados (Desktop e Mobile)
- **Dado** a barra de filtros de transações em qualquer dispositivo
- **Quando** o usuário clica no botão "Filtros"
- **Então** abre-se um painel modal ou gaveta contendo opções para filtrar por categoria específica, método de pagamento, tipo e status, aplicando os filtros instantaneamente à lista.

#### AC-140 — Visualização compacta de transações em lista mobile sem scroll horizontal
- **Dado** que o usuário visualiza a listagem de transações em viewport mobile (< 768px)
- **Quando** as transações são exibidas
- **Então** o layout adota uma lista de cards/itens compactos com descrição, chips de categoria/conta, data, valor e status, eliminando qualquer rolagem lateral.

### US-038 — Modal Unificado de Detalhes da Transação

Como usuário, quero clicar em qualquer transação (na listagem geral, na fatura de cartão ou nas notificações) e abrir um card com os detalhes completos, com opção de edição e exclusão.

#### AC-141 — Abertura do card de detalhes da transação (Mobile e Desktop)
- **Dado** uma transação na listagem de transações, fatura de cartão ou alertas do sino
- **Quando** o usuário clica sobre a linha ou card da transação
- **Então** abre-se um modal centralizado no mesmo estilo visual do modal de inclusão, exibindo todos os detalhes em modo somente-leitura (descrição, valor, tipo, categoria, conta/cartão, método de pagamento, data, status e observações).

#### AC-142 — Ações de Edição e Exclusão a partir do Modal de Detalhes
- **Dado** o modal de detalhes da transação aberto
- **Quando** o usuário aciona o botão "Editar" ou "Excluir"
- **Então** o botão "Editar" direciona para o formulário de edição daquela transação e o botão "Excluir" aciona a confirmação de exclusão com as opções pertinentes.

### US-039 — Centralização e Rastreabilidade do Sino de Notificações

Como usuário que acompanha contas vencidas pelo sino de notificações, quero que o painel abra centralizado na tela e permita navegar diretamente para a transação ou para a listagem filtrada de contas atrasadas.

#### AC-143 — Popover de notificações centralizado horizontalmente
- **Dado** o cabeçalho da aplicação em qualquer tamanho de tela
- **Quando** o usuário clica no sino de notificações
- **Então** o painel popover abre alinhado ao centro horizontal relativo ao header/viewport, sem transbordar para a borda direita da tela.

#### AC-144 — Navegação direta para detalhes da transação a partir do alerta vencido
- **Dado** a lista de contas atrasadas no popover de notificações
- **Quando** o usuário clica em um item vencido
- **Então** o popover se fecha e o modal de detalhes daquela transação é aberto imediatamente na tela.

#### AC-145 — Redirecionamento com filtro de vencidas ao clicar em 'Ver transações vencidas'
- **Dado** o popover de notificações aberto
- **Quando** o usuário clica no botão "Ver transações vencidas"
- **Então** a aplicação navega para `/transactions` com o filtro pré-ativado para exibir apenas as transações vencidas/em atraso.

### US-040 — Customização e Visualização de Cartões de Crédito

Como usuário que controla cartões de crédito, quero ver a data de compra de cada transação da fatura, o vencimento posicionado no cabeçalho do cartão, abrir detalhes das despesas e escolher a cor do cartão no cadastro.

#### AC-146 — Exibição da data de compra nas transações da fatura
- **Dado** a aba de faturas e compras do cartão de crédito
- **Quando** a lista de transações da fatura é exibida
- **Então** cada item apresenta a data em que a despesa foi realizada de forma clara.

#### AC-147 — Exibição do dia de vencimento fora da lista de transações
- **Dado** a tela de gestão do cartão de crédito
- **Quando** os detalhes do cartão ativo são visualizados
- **Então** a informação do dia de vencimento e fechamento da fatura é apresentada na seção de resumo/limite disponível, despoluindo as linhas individuais de transação.

#### AC-148 — Modal de detalhes da transação a partir da fatura do cartão
- **Dado** a lista de transações da fatura do cartão
- **Quando** o usuário clica em qualquer compra
- **Então** o modal unificado de detalhes da transação é aberto com os dados completos do lançamento.

#### AC-149 — Seletor de cores elegantes no cadastro de cartão
- **Dado** o modal de cadastro ou edição de cartão de crédito
- **Quando** o usuário preenche o formulário
- **Então** é disponibilizada uma paleta de cores selecionáveis em tons escuros e sofisticados (ex: azul petróleo, grafite, verde esmeralda, vinho, índigo), aplicando a cor escolhida ao cartão visual.

### US-041 — Relatórios Financeiros Responsivos e Refinamento de Gráficos

Como usuário que analisa a saúde financeira pelo módulo de Relatórios, quero que as tabelas e grids caibam na tela mobile sem scroll lateral, que o gráfico de evolução possua zoom/pan e que não surjam contornos pretos nos gráficos ao clicar.

#### AC-150 — Zoom e navegação horizontal no gráfico de evolução mensal
- **Dado** o gráfico de evolução mensal de receitas versus despesas na tela de Relatórios
- **Quando** o usuário aciona a opção de zoom
- **Então** a escala do gráfico se ajusta permitindo arrastar horizontalmente para inspecionar meses específicos em detalhe.

#### AC-151 — Remoção do contorno preto ao interagir com gráficos
- **Dado** qualquer gráfico de barras ou pizza da tela de Relatórios e Dashboard
- **Quando** o usuário clica sobre uma barra, fatia ou elemento do gráfico
- **Então** o destaque visual ocorre sem a criação de borda escura/preta espessa ao redor do elemento.

#### AC-152 — Detalhamento DRE sem scroll horizontal no mobile
- **Dado** a seção de Detalhamento Mensal DRE em viewport mobile (< 768px)
- **Quando** os dados do relatório são apresentados
- **Então** o layout substitui a tabela larga por cards em grid multi-linhas, exibindo receitas, despesas e resultado sem necessidade de rolagem lateral.

#### AC-153 — Detalhamento por categoria e ranking de contrapartes sem scroll horizontal no mobile
- **Dado** os relatórios de despesas por categoria e ranking de contrapartes em viewport mobile (< 768px)
- **Quando** as listagens são exibidas
- **Então** as informações são apresentadas em formato compacto adaptado à largura da tela sem scroll horizontal.

### US-042 — Correção e Validação no Cadastro de Métodos de Pagamento

Como usuário configurando a aplicação, quero que o cadastro de métodos de pagamento exiba dinamicamente os campos corretos ao selecionar cartão de crédito ou outros métodos, garantindo consistência nos dados.

#### AC-154 — Exibição dinâmica de campos ao selecionar cartão de crédito
- **Dado** o modal de criação/edição de método de pagamento em Configurações
- **Quando** o usuário marca a opção indicando que é cartão de crédito
- **Então** o formulário exibe os campos pertinentes (como vínculo ao cartão de crédito cadastrado) e valida o preenchimento antes do salvamento.

#### AC-155 — Validação completa de campos para outros métodos de pagamento
- **Dado** o formulário de método de pagamento para opções que não são cartão de crédito
- **Quando** o usuário cadastra ou altera o método
- **Então** todos os campos obrigatórios (nome, tipo, conta bancária associada) são validados e exibidos adequadamente.

## Fora de escopo

- Alterações na API de autenticação ou banco de dados relacional que exijam migrações no backend.
- Criação de novos tipos de relatórios não previstos nos requisitos.

## Suposições

| ID      | Suposição                                                                                                          | Status     | Resolução                                                                              |
| ------- | ------------------------------------------------------------------------------------------------------------------ | ---------- | -------------------------------------------------------------------------------------- |
| ASM-039 | O seletor de mês na Dashboard manterá por padrão o mês atual selecionado ao inicializar a página                   | confirmada | Permite visão imediata do período vigente com opção de navegação para meses anteriores |
| ASM-040 | O modal de detalhes da transação será gerenciado por store Zustand compartilhada e acessível globalmente           | confirmada | Unifica a abertura a partir de qualquer ponto (Transações, Dashboard, Cartões, Sino)   |
| ASM-041 | A paleta de cores dos cartões será gravada em campo suportado no payload de cartão ou mapeada de forma persistente | confirmada | Garante consistência visual no tema claro e escuro                                     |

## Perguntas em aberto

| ID    | Pergunta                                                                                             | Status     | Resposta                                                                                               |
| ----- | ---------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| Q-032 | A paleta de cores de cartão deve consistir em um conjunto de opções pré-definidas?                   | respondida | Sim: paleta fixa com 6 a 8 tons elegantes e escuros harmônicos com a aplicação                         |
| Q-033 | Como o filtro de transações vencidas ativado pelo sino deve ser repassado para a tela de transações? | respondida | Via query parameter de busca ou navigation state `status=overdue` interceptado pelo TransactionFilters |
