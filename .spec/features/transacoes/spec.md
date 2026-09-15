# Spec: Transações

> feature: transacoes
> status: rascunho

## Contexto

Módulo central do sistema financeiro — permite ao usuário registrar, visualizar, filtrar, editar e excluir transações (receitas, despesas e transferências), incluindo parcelamentos e recorrências. A API REST já está pronta; este módulo consome os endpoints existentes.

## Histórias

### US-011 — Visualizar e filtrar listagem de transações

Como usuário, quero visualizar e filtrar minhas transações, para acompanhar minhas receitas e despesas de forma organizada.

#### AC-043 — Listagem padrão de transações

- **Dado** que o usuário acessa a página de transações
- **Quando** a página carrega
- **Então** ele vê uma lista com as transações recentes, exibindo data, descrição (com chips de categoria e contraparte), conta/cartão, valor com cor indicativa (verde para receita, vermelho para despesa), status visual (🟢 concluído, 🟡 pendente, 🔴 expirado, ⚫ cancelado) e badge vermelho "Atrasada (X dias)" para transações pendentes cuja data de vencimento seja anterior a hoje

#### AC-044 — Filtro por tipo de transação

- **Dado** que o usuário está na lista de transações
- **Quando** seleciona o filtro de tipo (ex: apenas despesas)
- **Então** a lista exibe apenas as transações correspondentes ao tipo selecionado

#### AC-045 — Filtro por data e busca textual

- **Dado** que o usuário procura uma transação específica
- **Quando** preenche um período de datas ou busca por uma palavra-chave na descrição
- **Então** a listagem atualiza mostrando apenas os registros que casam com os filtros informados

#### AC-046 — Indicador visual de parcelamento

- **Dado** que o usuário possui transações parceladas
- **Quando** as visualiza na listagem
- **Então** vê a indicação visual de qual parcela se trata (ex: "3/10")

#### AC-060 — Rolagem infinita ao aproximar do final da lista

- **Dado** que há mais páginas a serem carregadas (`has_more: true` na paginação da API)
- **Quando** o usuário rola a listagem e se aproxima do fim da visualização
- **Então** o front-end requisita automaticamente a próxima página (`page + 1`) e anexa os novos registros à lista de forma contínua

### US-012 — Criar transação simples (Receita/Despesa)

Como usuário, quero registrar rapidamente uma nova receita ou despesa, para manter meu controle financeiro atualizado.

#### AC-047 — Fluxo "Cafézinho" rápido (≤ 10 segundos)

- **Dado** que o usuário quer registrar uma despesa rápida
- **Quando** abre o modal de nova transação
- **Então** a aba "Despesa" já vem selecionada, a data preenchida com hoje e a conta padrão pré-selecionada, permitindo registrar em menos de 10 segundos

#### AC-048 — Validação de formulário de transação

- **Dado** que o usuário preenche uma nova transação
- **Quando** insere uma descrição com menos de 3 caracteres ou deixa o valor vazio
- **Então** vê mensagens de erro inline alertando os requisitos mínimos

#### AC-049 — Categorias filtradas pelo tipo de transação

- **Dado** que o usuário está no modal de nova transação
- **Quando** alterna entre as abas "Receita" e "Despesa"
- **Então** a lista de categorias muda para mostrar apenas as do tipo correspondente (incomings ou expenses)

#### AC-050 — Marcação de "Já está pago"

- **Dado** que o usuário registra uma transação
- **Quando** marca a opção "Já está pago"
- **Então** a data de pagamento é preenchida automaticamente com hoje e a transação é salva como concluída

### US-013 — Criar transferência entre contas

Como usuário, quero registrar uma transferência entre minhas próprias contas, para manter os saldos corretos em cada uma.

#### AC-051 — Aba de transferência no modal

- **Dado** que o usuário abre o modal de transação
- **Quando** seleciona a aba "Transferência"
- **Então** vê os campos de conta de origem e conta de destino, sem campo de categoria obrigatório

#### AC-052 — Validação de contas distintas

- **Dado** que o usuário preenche uma transferência
- **Quando** seleciona a mesma conta para origem e destino
- **Então** é impedido de salvar e vê um erro "As contas de origem e destino devem ser diferentes"

#### AC-053 — Confirmação visual de transferência criada

- **Dado** que o usuário salva uma transferência válida
- **Quando** a operação é concluída
- **Então** vê uma mensagem de sucesso e a lista de transações é atualizada mostrando os dois registros gerados

### US-014 — Criar transação parcelada ou recorrente

Como usuário, quero registrar uma compra parcelada ou despesa recorrente, para planejar meus gastos futuros.

#### AC-054 — Campos de parcelamento

- **Dado** que o usuário preenche uma despesa
- **Quando** ativa a opção de parcelamento
- **Então** vê campos para informar o número de parcelas, o dia de vencimento fixo e se a primeira parcela é para este mês

#### AC-055 — Bloqueio de cartão como receita recorrente

- **Dado** que o usuário preenche uma receita
- **Quando** escolhe um cartão de crédito como método e ativa a recorrência
- **Então** a interface exibe um alerta "Não é possível usar cartão de crédito como forma de entrada recorrente"

### US-015 — Editar e excluir transações

Como usuário, quero poder corrigir informações ou remover registros incorretos, para manter meu histórico financeiro preciso.

#### AC-056 — Edição de transação simples

- **Dado** que o usuário clica em editar uma transação
- **Quando** altera os dados e salva
- **Então** a listagem reflete a mudança imediatamente (cache invalidado)

#### AC-057 — Edição em lote de parcelas

- **Dado** que o usuário edita uma transação parcelada
- **Quando** escolhe "Aplicar a todas as parcelas" e salva
- **Então** a mudança reflete em toda a série de parcelas

#### AC-058 — Exclusão de transação concluída com aviso

- **Dado** que o usuário exclui uma transação já paga
- **Quando** confirma a exclusão no diálogo de confirmação
- **Então** o registro some da lista e uma mensagem avisa que o saldo da conta foi revertido

#### AC-059 — Exclusão de transferência remove ambos registros

- **Dado** que o usuário exclui uma transação de transferência
- **Quando** a ação é completada
- **Então** ambos os registros (entrada e saída) são removidos da listagem

### US-035 — Robustez de Lançamento e Experiência Mobile

Como usuário em dispositivo móvel ou desktop, quero cadastrar transações com todas as categorias disponíveis e interagir com um modal responsivo e adaptável.

#### AC-120 — Responsividade Mobile do Modal de Lançamentos
- **Dado** que o usuário abre o modal de nova transação em tela móvel
- **Quando** ele visualiza e preenche o formulário
- **Então** o modal se ajusta à viewport com altura máxima de 92vh e rolagem vertical interna, permitindo interagir com todos os campos e botões sem corte de interface.

#### AC-121 — Carregamento Completo de Categorias no Card de Lançamento
- **Dado** que o usuário seleciona a aba Receita ou Despesa no modal
- **Quando** o seletor de categorias carrega os dados da carteira
- **Então** ele exibe todas as categorias cadastradas para aquele tipo, sem omissão ou limitação a um único item.

#### AC-122 — Ordenação por Data de Vencimento e Filtro Mensal Padrão
- **Dado** que o usuário acessa a listagem de transações
- **Quando** a listagem é carregada ou os filtros são resetados
- **Então** a ordenação padrão é por data de vencimento (`order_by: 'due_date'`), e o período inicial de consulta filtra automaticamente o mês corrente pelo vencimento (`due_date_from` no 1º dia do mês e `due_date_to` no último dia do mês), com controles para alternar mês ou direção da ordenação (`order_dir`).


## Fora de escopo

- Criação de endpoints de API (backend já pronto).
- Importação em lote de transações via arquivo.
- Anexo de comprovantes.

## Suposições

| ID      | Suposição                                                                                                                                                   | Status     | Resolução                                                            |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------- |
| ASM-014 | O usuário não pode alterar o método de pagamento de cartão de crédito para outra modalidade durante a edição (restrição do backend).                        | confirmada | Confirmado via regra de negócio do backend (campo travado).          |
| ASM-015 | A listagem de transações utiliza paginação da API (`page` e `limit: 20`) integrada a rolagem infinita no front-end via TanStack Query (`useInfiniteQuery`). | confirmada | Confirmado pelo usuário e API atualizada com suporte a page e limit. |
| ASM-016 | A wallet_id do cabeçalho é injetada automaticamente pelo interceptor HTTP configurado no app-shell.                                                         | confirmada | Confirmado via arquitetura do interceptor Axios.                     |
| ASM-017 | Transações de transferência não permitem a opção de parcelamento/recorrência.                                                                               | confirmada | Confirmado via regra da API.                                         |
| ASM-018 | O backend já trata da reversão de saldos ao excluir transações concluídas e retorna 422 para saldo insuficiente.                                            | confirmada | Confirmado via documentação da API.                                  |

## Perguntas em aberto

| ID    | Pergunta                                                                                                                                      | Status     | Resposta                                                                                                                                     |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Q-012 | O usuário poderá anexar comprovantes (foto/PDF) no registro da transação em uma versão futura?                                                | respondida | Fora de escopo para esta versão (marcado para roadmap futuro).                                                                               |
| Q-013 | Como tratar visualmente transações pendentes cuja data de vencimento já passou? Mostrar como "expirada" automaticamente ou manter "pendente"? | respondida | Exibir badge de alerta "Atrasada (X dias)" na cor vermelha mantendo o status pendente no backend até ação do usuário ou expiração.           |
| Q-014 | Na exclusão de múltiplas parcelas, o usuário pode cancelar apenas as que ainda não foram pagas?                                               | respondida | O modal de exclusão oferece as opções: "Apenas esta parcela" ou "Todas as parcelas da série" (com aviso sobre parcelas já pagas).            |
| Q-015 | Quais colunas devem ser ocultadas na versão mobile da listagem de transações?                                                                 | respondida | Em telas pequenas, priorizar Descrição, Valor e Data; Conta/Categoria são exibidas como chips sob a descrição e parcela como badge compacto. |
