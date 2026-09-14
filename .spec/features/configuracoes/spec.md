# Spec: Configurações

> feature: configuracoes
> status: implementada

## Contexto

Os usuários precisam de um hub centralizado para gerenciar os cadastros básicos de apoio do sistema: categorias de lançamentos, contrapartes (pessoas/empresas), métodos de pagamento e as configurações gerais da carteira.

## Histórias

### US-026 — Gerenciamento de Categorias

Como usuário, quero listar, criar, editar e excluir minhas categorias agrupadas por despesa e receita, para organizar meus lançamentos.

#### AC-106 — Listagem em Abas com Contadores
- **Dado** que o usuário acessa `/settings/categories`
- **Quando** a tela carregar
- **Então** ele deve ver abas superiores ("Todas", "Receitas", "Despesas") com contadores numéricos e campo de busca rápida, filtrando a lista conforme a aba selecionada.

#### AC-107 — Criação de Categoria
- **Dado** que o usuário decide adicionar uma categoria
- **Quando** preencher o nome e tipo, e salvar
- **Então** a nova categoria deve ser exibida na lista correspondente ao seu tipo.

#### AC-108 — Restrição de Exclusão Padrão
- **Dado** que certas categorias vêm por padrão (se aplicável pelo backend)
- **Quando** o usuário tentar excluí-las
- **Então** a ação deve falhar graciosamente e informar que a categoria está em uso ou protegida. (Nota: comportamento genérico de delete).

### US-027 — Gerenciamento de Contrapartes

Como usuário, quero gerenciar contrapartes, agrupando-as entre pagadores e recebedores, para facilitar o preenchimento de transações.

#### AC-109 — Listagem em Abas de Contrapartes
- **Dado** que o usuário acessa `/settings/counterparties`
- **Quando** a tela carregar
- **Então** ele deve ver abas superiores ("Todos", "Pagadores", "Recebedores") com contadores e busca rápida, organizando os favorecidos e pagadores de forma limpa.

#### AC-110 — Criação e Edição de Contraparte
- **Dado** que o usuário acessa os detalhes de uma contraparte
- **Quando** salvar novos dados
- **Então** a tabela ou lista de contrapartes deve refletir as atualizações na hora.

### US-028 — Gerenciamento de Métodos de Pagamento

Como usuário, quero cadastrar contas bancárias, dinheiro e cartões de crédito, para ter clareza das origens de pagamento.

#### AC-111 — Indicador de Cartão de Crédito
- **Dado** que o usuário acessa `/settings/pay-methods`
- **Quando** visualizar os métodos
- **Então** métodos que são cartão de crédito devem ter um ícone ou indicador visual específico.

#### AC-112 — Bloqueio de Edição do Tipo do Cartão
- **Dado** que o usuário tenta editar um método de pagamento
- **Quando** o formulário de edição abrir
- **Então** a opção (checkbox/switch) "É um cartão de crédito?" deve estar desabilitada para edição e apenas em modo leitura.

#### AC-113 — Criação de Método de Pagamento
- **Dado** que o usuário cria um método novo
- **Quando** informar os dados
- **Então** o novo método deve ser listado adequadamente e exibir o indicador de crédito se a flag for enviada como true.

### US-029 — Gerenciamento da Carteira

Como dono da carteira, quero alterar seu nome ou até mesmo deletá-la, para administrar meu espaço no app.

#### AC-114 — Renomear Carteira
- **Dado** que o usuário tem acesso à carteira
- **Quando** ele modificar o nome da carteira na aba de configurações principais
- **Então** o nome atualizado deve ser refletido imediatamente no header/navbar da aplicação.

#### AC-115 — Exclusão Crítica com Digitação do Nome (Owner Only)
- **Dado** que o usuário acessa a opção de Danger Zone (deletar carteira) e possui papel de `owner`
- **Quando** ele clica no botão "Excluir Carteira"
- **Então** um diálogo modal de confirmação crítica é aberto exigindo que ele digite o nome exato da carteira para habilitar o botão de exclusão definitiva, redirecionando em seguida para a listagem ou criação de carteira se confirmada

### US-030 — Gerenciamento de Membros (Placeholder)

Como dono da carteira, quero saber onde adicionarei membros futuros, para me preparar para compartilhamento.

#### AC-116 — Interface de Equipe
- **Dado** que o usuário acessa a área de Time / Membros nas configurações
- **Quando** a tela carregar
- **Então** deve haver um aviso (placeholder) indicando que o recurso de convites e gestão de equipe estará disponível futuramente.

#### AC-117 — Navegação das Configurações
- **Dado** que o usuário entra em `/settings`
- **Quando** observar as opções
- **Então** deve haver um menu lateral ou abas permitindo acesso à: Geral (Carteira), Categorias, Contrapartes, Métodos de Pagamento e Membros.

#### AC-118, AC-119, AC-120 — Padrões de Exclusão, Edição e Respostas (Geral)
- **Dado** que o usuário apaga ou edita um item (Categoria, Contraparte, Pagamento)
- **Quando** a requisição for disparada com base em `display_id` (e não id inteiro)
- **Então** o frontend deve usar a chave de display correta para a rota e exibir toast alert exibindo `message` em caso de sucesso.

## Fora de escopo

- Limite de cadastros não será validado no frontend a menos que o backend retorne 402 ou 403.
- Relacionar as tabelas (ex: vincular contraparte a categoria por padrão).

## Suposições

| ID      | Suposição                                                                                                    | Status     | Resolução                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------ | ---------- | ---------------------------------------------------------- |
| ASM-031 | A tela de configuração usará um Layout aninhado de rotas (Nested Routes do react-router).                    | confirmada | Confirmado: /settings com abas aninhadas.                  |
| ASM-032 | O tipo de categoria e contraparte pode ser atualizado via PATCH conforme especificação da API.               | confirmada | Confirmado via documentação da API (suporta type no body). |
| ASM-033 | A API de Carteira atualiza pelo parâmetro :id da rota com token JWT no header.                               | confirmada | Confirmado via rotas PATCH/DELETE /api/wallet/:id.         |
| ASM-034 | Ao excluir a carteira atual, o usuário será redirecionado para a lista de carteiras restantes ou onboarding. | confirmada | Confirmado: recarrega carteiras via GET /api/wallet.       |
| ASM-035 | O indicador "credit_card" vem como boolean no endpoint GET de pay-methods.                                   | confirmada | Confirmado via contrato da API.                            |

## Perguntas em aberto

| ID    | Pergunta                                                                                                                                       | Status     | Resposta                                                                                                                             |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Q-027 | A opção de excluir carteira exige que o usuário digite o nome dela para confirmar a exclusão (como no GitHub)?                                 | respondida | Sim, exige a digitação exata do nome da carteira em um diálogo modal antes de habilitar a exclusão permanente.                       |
| Q-028 | Se um método de pagamento foi usado em transações, a exclusão falhará. Devemos sugerir um status 'inativo' ou apenas exibir o erro do backend? | respondida | Exibir mensagem clara com alerta explicativo da API informando que o método está em uso e não pode ser excluído.                     |
| Q-029 | As categorias do tipo despesa/receita podem ser filtradas por abas na UI ao invés de listas longas na mesma tela?                              | respondida | Sim, por abas superiores ("Todas", "Receitas", "Despesas" / "Todos", "Pagadores", "Recebedores") com busca e contadores em cada aba. |
| Q-030 | É possível trocar o tipo de uma categoria ou contraparte de Pagador para Recebedor após a criação?                                             | respondida | Sim, o formulário de edição permite atualizar o campo type via PATCH conforme suportado pelo backend.                                |
