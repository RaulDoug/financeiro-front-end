# Spec: App Shell

> feature: app-shell
> status: implementada

## Contexto

Estrutura principal de navegação e layout da aplicação FinFlow, garantindo que o usuário consiga transitar entre as telas, visualizar notificações, acessar seu perfil e alterar o contexto global (carteira/wallet).

## Histórias

### US-006 — Navegação pelo layout principal

Como usuário autenticado, quero navegar pela aplicação usando um menu lateral e uma barra superior, para que eu possa acessar as diferentes funcionalidades (Dashboard, Transações, etc.) de forma rápida.

#### AC-021 — Exibição do layout base
- **Dado** que o usuário fez login com sucesso e tem uma carteira ativa
- **Quando** a aplicação é carregada
- **Então** ele deve visualizar uma barra superior (Topbar) e um menu lateral (Sidebar) com links para Dashboard, Transações, Cartões, Contas, Relatórios, Investimentos e Configurações.

#### AC-022 — Menu responsivo em dispositivos móveis
- **Dado** que o usuário acessa o sistema por um dispositivo móvel
- **Quando** ele visualiza a tela
- **Então** o menu lateral deve estar oculto, podendo ser aberto através de um ícone de "hambúrguer" na barra superior.

#### AC-023 — Indicador de notificações
- **Dado** que há alertas de contas em atraso
- **Quando** o usuário olha para a barra superior
- **Então** o ícone de sino de notificações deve exibir um contador (badge) com o número de itens em atraso.

#### AC-024 — Menu de perfil do usuário
- **Dado** que o usuário está no layout principal
- **Quando** ele clica no seu avatar na barra superior
- **Então** um menu suspenso deve aparecer, mostrando opções de Perfil e Sair (Logout).

### US-007 — Alternância de contexto (Wallet)

Como usuário com acesso a múltiplas carteiras, quero poder selecionar qual carteira estou visualizando, para que os dados exibidos correspondam ao contexto financeiro correto.

#### AC-025 — Seletor de carteira
- **Dado** que o usuário possui mais de uma carteira
- **Quando** ele clica no seletor na barra superior
- **Então** ele vê a lista de carteiras disponíveis com seus respectivos papéis (owner, editor, viewer).

#### AC-026 — Recarregamento ao trocar de carteira
- **Dado** que o usuário está visualizando os dados de uma carteira
- **Quando** ele seleciona uma carteira diferente no seletor
- **Então** toda a aplicação deve recarregar seu contexto (invalidar cache de dados) e exibir as informações da nova carteira selecionada.

#### AC-027 — Header obrigatório nas requisições
- **Dado** que uma carteira está selecionada
- **Quando** a aplicação faz uma requisição para a API (ex: buscar dashboard)
- **Então** o cabeçalho `x-wallet-id` deve ser incluído automaticamente com o ID da carteira ativa.

#### AC-028 — Rota protegida sem carteira
- **Dado** que o usuário acessa a aplicação
- **Quando** nenhuma carteira foi selecionada previamente
- **Então** o sistema deve selecionar automaticamente a primeira carteira disponível e redirecioná-lo.

### US-034 — Alternância de Tema (Claro / Escuro / Sistema)

Como usuário da aplicação, quero escolher entre tema claro, escuro ou seguir a preferência do sistema operacional, para ter maior conforto visual em qualquer ambiente.

#### AC-118 — Alternância de Tema entre Claro, Escuro e Sistema
- **Dado** que o usuário está navegando pela aplicação
- **Quando** ele clica no seletor de tema na barra superior (Topbar)
- **Então** ele pode escolher entre as opções "Claro", "Escuro" e "Sistema", aplicando a paleta correspondente imediatamente.

#### AC-119 — Persistência e Sincronização do Tema
- **Dado** que o usuário selecionou uma preferência de tema
- **Quando** a aplicação é recarregada ou a preferência do sistema operacional muda
- **Então** o tema escolhido é mantido via localStorage e atualizado automaticamente se estiver no modo "Sistema".

## Fora de escopo

- Criação ou edição de novas carteiras (pertence ao módulo de Configurações).
- Edição de perfil do usuário.

## Suposições

| ID      | Suposição                                                                                                 | Status     | Resolução                                                      |
| ------- | --------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------- |
| ASM-007 | A lista de carteiras com papéis (owner, editor, viewer) é obtida via `GET /api/wallet` logo após o login. | confirmada | Confirmado com adição do endpoint GET /api/wallet na API docs. |
| ASM-008 | O ID da carteira selecionada é persistido no localStorage para sobreviver a reloads.                      | confirmada | Confirmado via useWalletStore.                                 |
| ASM-009 | Trocar de carteira dispara `queryClient.invalidateQueries()` para resetar todas as telas.                 | confirmada | Confirmado via arquitetura TanStack Query.                     |
| ASM-010 | Se o usuário não tiver nenhuma carteira, ele deve ser levado a um fluxo de onboarding.                    | confirmada | Confirmado via redirecionamento inicial.                       |

## Perguntas em aberto

| ID    | Pergunta                                                                                                            | Status     | Resposta                                                                                                                                                                |
| ----- | ------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q-006 | O que acontece se a carteira que estava selecionada for deletada ou o acesso for revogado por outro usuário?        | respondida | O front consulta GET /api/wallet e seleciona a próxima carteira válida; se nenhuma restar, redireciona para o Onboarding.                                               |
| Q-007 | O número de notificações no sino é apenas para a carteira ativa, ou a soma de todas?                                | respondida | O sino reflete estritamente os alertas da carteira ativa via GET /api/dashboard-report/overdue-alerts.                                                                  |
| Q-008 | As permissões (viewer, editor) afetam a exibição de itens no menu lateral (ex: esconder Configurações para viewer)? | respondida | Papel viewer oculta botões de escrita/criação (+ Nova Receita, + Nova Despesa, editar); editor tem acesso total a lançamentos; exclusão de carteira exclusiva de owner. |
