# Spec: Relatórios

> feature: relatorios
> status: implementada

## Contexto

Os usuários precisam visualizar relatórios financeiros analíticos para entender suas finanças: DRE (Receitas x Despesas anuais), gastos detalhados por categoria e fluxo financeiro segmentado por contrapartes.

## Histórias

### US-023 — Visualização do DRE (Receitas vs Despesas Anual)

Como usuário, quero ver um relatório anual de Receitas vs Despesas, para acompanhar o saldo e a taxa de economia (savings rate) a cada mês do ano.

#### AC-096 — Resumo Mensal DRE
- **Dado** que o usuário está na tela de DRE / Relatório Anual
- **Quando** visualizar os dados do ano selecionado
- **Então** ele deve ver uma lista ou tabela com os 12 meses, exibindo o total de receitas, despesas, saldo resultante e o percentual de economia exibido como badge verde "Poupança: X%" quando positivo, ou badge vermelho "Déficit: -X%" quando negativo.

#### AC-097 — Seleção de Ano
- **Dado** que o usuário está visualizando o relatório anual
- **Quando** ele altera o ano no filtro
- **Então** o gráfico e os dados devem ser recarregados para exibir as informações referentes ao ano escolhido.

#### AC-098 — Gráfico de Barras DRE
- **Dado** que o usuário está na tela de DRE
- **Quando** visualizar o relatório
- **Então** ele deve ver um gráfico (ex: barras duplas) comparando visualmente as receitas e despesas ao longo dos meses.

### US-024 — Análise de Despesas por Categoria

Como usuário, quero analisar a distribuição de minhas despesas por categorias, para entender onde estou gastando mais dinheiro.

#### AC-099 — Listagem por Categorias
- **Dado** que o usuário selecionou o relatório de "Despesas por Categoria"
- **Quando** a busca retornar resultados
- **Então** ele deve ver uma tabela mostrando a posição, o nome da categoria, o total gasto e a porcentagem que aquela categoria representa no total.

#### AC-100 — Filtro de Período para Categorias
- **Dado** que o usuário está no relatório de categorias
- **Quando** alterar as datas de início e fim no filtro
- **Então** a tabela e os gráficos devem refletir o total acumulado apenas naquele período.

#### AC-101 — Gráfico de Pizza ou Rosca
- **Dado** que o usuário vê os dados de despesas por categoria
- **Quando** os resultados estiverem carregados
- **Então** a tela deve exibir um gráfico de pizza/rosca ao lado da tabela, facilitando a visualização proporcional.

### US-025 — Análise de Gastos por Contraparte

Como usuário, quero analisar onde meu dinheiro está indo ou de onde vem com base nos pagadores/recebedores, para monitorar transações frequentes com a mesma contraparte.

#### AC-102 — Consolidação de Contrapartes via Frontend
- **Dado** que não há endpoint dedicado para relatório de contrapartes
- **Quando** o usuário abrir esse relatório
- **Então** o frontend deve buscar as transações no período, agrupá-las pelo nome da contraparte (`counterparty_name`) e exibir a soma total para cada uma.

#### AC-103 — Tabela de Contrapartes
- **Dado** que os dados de contraparte foram calculados
- **Quando** apresentados na interface
- **Então** o usuário deve ver as contrapartes ordenadas pelo maior volume transacionado, exibindo o valor total e o respectivo percentual.

#### AC-104 — Diferenciação de Despesas e Receitas por Contraparte
- **Dado** que transações de entrada e saída têm impactos diferentes
- **Quando** agrupadas por contraparte
- **Então** o sistema deve distinguir se o valor agrupado é receita (pagador) ou despesa (recebedor).

#### AC-105 — Navegação na Rota de Relatórios
- **Dado** que o usuário acessa `/reports`
- **Quando** navegar entre as abas ou menus da tela
- **Então** ele deve poder alternar facilmente entre o "DRE (Anual)", "Despesas por Categoria" e "Relatório por Contraparte".

## Fora de escopo

- Exportação dos relatórios para PDF ou planilhas de Excel/CSV não estão previstos nesta etapa.
- Relatórios preditivos ou orçamentos não serão criados.

## Suposições

| ID      | Suposição                                                                                                                                 | Status     | Resolução                                                     |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------- |
| ASM-028 | O payload da transação contém `counterparty_name` consistente o suficiente para agrupamento por string.                                   | confirmada | Confirmado: normalizado via trim e case-insensitive no front. |
| ASM-029 | A API de `/dashboard-report/income-vs-expense?year=YYYY` sempre retorna 12 itens ordenados, do mês 1 ao 12.                               | confirmada | Confirmado conforme contrato da API.                          |
| ASM-030 | Paginação nas listagens de categorias e contrapartes não é necessária pois a quantidade é previsível e gerenciável na memória (frontend). | confirmada | Confirmado pelo volume esperado por carteira.                 |

## Perguntas em aberto

| ID    | Pergunta                                                                                                                         | Status     | Resposta                                                                                                                       |
| ----- | -------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Q-024 | O agrupamento por nome no frontend (contrapartes) lida com nomes exatos apenas. Precisamos sanitizar as strings (ex: lowercase)? | respondida | Sim, o front normaliza com trim() e case-insensitive para evitar duplicações visuais indesejadas.                              |
| Q-025 | Se a taxa de economia (savings rate) for negativa (mais gasto que ganho), como deve ser exibida no DRE mensal?                   | respondida | Exibir badge vermelho de alerta "Déficit: -X%" para meses com resultado negativo, e verde "Poupança: X%" para meses positivos. |
| Q-026 | Qual o período default carregado nos relatórios de categorias e contrapartes ao abrir a tela? (Ex: mês atual?)                   | respondida | Primeiro ao último dia do mês corrente, com controles de navegação mensal e seletor de intervalo customizado.                  |
