# Spec: Ajustes mobile tema notificacoes

> feature: ajustes-mobile-tema-notificacoes
> status: implementada

## Contexto

Correção de três pontos críticos de experiência do usuário: (1) exibição real das contas atrasadas no sino de notificações com contagem e lista descritiva; (2) correção das cores em modo escuro para que cards e lista de transações não permaneçam brancos; e (3) reestruturação do design mobile com header compacto anti-quebra e navegação inferior fixa (Bottom Navigation) inspirada no modelo FinFlow (`Docs/front_layout/dashboard_finflow`), mantendo o layout desktop intacto.

## Histórias

### US-031 — Notificações de Contas em Atraso no Sino

Como usuário da plataforma, quero visualizar diretamente no sino de notificações o número e o detalhamento das minhas contas em atraso na carteira ativa, para que eu possa identificar pendências financeiras sem navegar para outras telas.

#### AC-123 — Badge numérico no sino com total de contas atrasadas

- **Dado** que o usuário possui transações com status vencido ou pendente com data de vencimento anterior à data atual na carteira ativa
- **Quando** o usuário visualiza o cabeçalho da aplicação (Topbar)
- **Então** o ícone do sino exibe um badge visual vermelho com a contagem real de pendências em atraso (não zero).

#### AC-124 — Listagem descritiva no popover de notificações

- **Dado** que o sino exibe pendências em atraso
- **Quando** o usuário clica no botão do sino
- **Então** o painel popover abre listando cada conta vencida com sua descrição, quantidade de dias em atraso e valor formatado em moeda brasileira, além de link para a listagem completa de transações.

#### AC-125 — Estado vazio do sino quando não há pendências

- **Dado** que não há transações atrasadas na carteira ativa
- **Quando** o usuário abre o popover de notificações
- **Então** o sistema exibe a mensagem de sucesso "Tudo em dia!" e o badge sobre o ícone do sino permanece oculto.

### US-032 — Consistência Visual dos Cards e Tabelas no Tema Escuro

Como usuário que utiliza o tema escuro, quero que todos os cards de resumo, filtros e a tabela de transações adotem tons escuros elegantes e legíveis, para que não haja componentes com fundo branco ofuscante.

#### AC-126 — Cards informativos da dashboard com fundo escuro

- **Dado** que o tema escuro está selecionado na aplicação
- **Quando** o usuário visualiza o Dashboard ou páginas de gestão
- **Então** os cards de indicadores (KPIs, saldos e faturas) utilizam planos de fundo escuros (`dark:bg-slate-900` / `dark:bg-slate-800`), bordas escuras e textos com contraste adequado, sem manter o fundo branco.

#### AC-127 — Tabela de transações compatível com tema escuro

- **Dado** que o tema escuro está ativado
- **Quando** o usuário acessa a página de Transações
- **Então** o contêiner da tabela, cabeçalho das colunas, linhas da tabela e divisores utilizam classes escuras (`dark:bg-slate-900`, `dark:border-slate-800`, `dark:divide-slate-800`, `dark:text-slate-200`) em vez de branco e cinza claro.

#### AC-128 — Barra de filtros e controles de transação no tema escuro

- **Dado** que o usuário visualiza a listagem de transações no modo escuro
- **Quando** ele interage com a barra de busca, paginação de mês e pílulas de filtro
- **Então** todos os elementos de formulário, botões de status e contêineres de filtro apresentam contraste harmônico e sem áreas brancas residuais.

### US-033 — Design Mobile com Header Compacto e Bottom Navigation

Como usuário mobile, quero um cabeçalho que não quebre ou estoure a tela e uma barra de navegação inferior com ação rápida de nova transação inspirada no padrão FinFlow, para que a experiência em smartphones seja fluida enquanto o desktop continua com a sidebar tradicional.

#### AC-129 — Header mobile compacto sem quebra ou overflow

- **Dado** que o usuário acessa a aplicação em viewport mobile (< 640px)
- **Quando** o topo da página é renderizado
- **Então** o cabeçalho distribui de forma proporcional o logotipo compacto, seletor de carteira com limite de largura/truncamento e botões de ação (tema, notificações, perfil) sem gerar rolagem horizontal ou quebra de linha.

#### AC-130 — Barra de navegação inferior (Bottom Navigation) em todas as páginas mobile

- **Dado** que a aplicação está sendo executada em dispositivo móvel (< 768px)
- **Quando** o usuário navega por qualquer tela interna do sistema
- **Então** uma barra inferior fixa (Bottom Navigation) com efeito backdrop-blur é exibida com atalhos para Início, Transações, Cartões, Mais e o botão central destacado de Nova Transação, enquanto o conteúdo principal recebe espaçamento inferior para não ser sobreposto.

#### AC-131 — Botão de ação rápida central para Nova Transação

- **Dado** que o usuário visualiza a barra de navegação inferior mobile
- **Quando** toca no botão circular flutuante central com ícone de adição (+)
- **Então** o modal de inclusão de nova transação é imediatamente acionado.

#### AC-132 — Preservação da navegação desktop tradicional

- **Dado** que o dispositivo possui resolução de tela desktop (>= 768px)
- **Quando** a aplicação é carregada
- **Então** a barra de navegação inferior fica oculta e o menu lateral (Sidebar) tradicional com links e controles permanece ativo e posicionado à esquerda.

## Fora de escopo

- Alterações na lógica de negócios ou endpoints do backend (a API já provê `/api/dashboard-report/overdue-alerts`).
- Redesenho completo das telas desktop (o desktop deve permanecer como está).
- Modificação no fluxo de autenticação ou criação de novas contas.

## Suposições

| ID      | Suposição                                                                                                                                                               | Status     | Resolução                                                                                                     |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| ASM-036 | O componente NotificationsBell pode obter as pendências de forma autônoma via dashboardService.getOverdueAlerts() quando o prop externo count não for especificado      | confirmada | Permite que o Topbar delegue a contagem e listagem diretamente ao componente com base na carteira selecionada |
| ASM-037 | No mobile, a Sidebar lateral pode ser complementada pela Bottom Navigation de 5 ações conforme especificado nos protótipos de Docs/front_layout/dashboard_finflow       | confirmada | A barra inferior concentra a navegação primária rápida nos smartphones                                        |
| ASM-038 | A paleta do tema escuro deve ser padronizada com Tailwind Slate (slate-900 para superfícies de cards, slate-800 para elementos secundários e slate-700/800 para bordas) | confirmada | Garante consistência com os demais módulos que já usam slate dark classes                                     |

## Perguntas em aberto

| ID    | Pergunta                                                                                                                                                    | Status     | Resposta                                                                  |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------- |
| Q-031 | O botão "Mais" da barra de navegação inferior mobile deve abrir uma gaveta/modal com os links restantes (Contas, Relatórios, Investimentos, Configurações)? | respondida | Sim, abrirá um modal/drawer compacto com os links adicionais da aplicação |
