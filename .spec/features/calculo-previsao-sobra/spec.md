# Spec: Calculo de Previsao de Sobra com Opcao de Saldo em Conta

> feature: calculo-previsao-sobra
> status: rascunho

## Contexto

A API do dashboard agora retorna no payload de resumo (`/api/dashboard-report/summary`) o campo `monthForecastFinal`, que projeta o saldo final em conta considerando o saldo total atual somado às receitas pendentes e subtraído das despesas pendentes (`totalBalance + pendingIncomes - pendingExpenses`). O usuário necessita alternar facilmente entre visualizar a Sobra Operacional do Mês (`monthForecast`, apenas transações do mês) e o Saldo Final Projetado (`monthForecastFinal`, considerando o saldo das contas bancárias).

## Histórias

### US-085 — Alternância da Previsão de Sobra no Dashboard

Como usuário acompanhando a saúde financeira no Dashboard, quero alternar entre a Sobra Operacional do Mês e o Saldo Final Projetado em Conta através de um toggle no card de previsão, para entender tanto o fluxo operacional líquido quanto o saldo bancário que restará ao final do mês.

#### AC-315 — Suporte ao campo monthForecastFinal no contrato de dados

- **Dado** o recebimento dos dados do resumo do Dashboard via endpoint `/api/dashboard-report/summary`
- **Quando** a tipagem `DashboardSummary` é consumida pela aplicação
- **Então** o campo `monthForecastFinal` é reconhecido e tipado como numérico opcional, garantindo fallback gracioso para cálculo operacional caso não esteja presente.

#### AC-316 — Toggle interativo no card de Sobra Projetada

- **Dado** que o usuário está no Dashboard visualizando os cartões de KPI
- **Quando** o usuário clica no botão/toggle "Considerar saldo em conta" no card de previsão de sobra
- **Então** o valor exibido alterna para `monthForecastFinal`, o título/subtítulo reflete o modo ativo, e as cores de destaque (positivo/negativo) são recalculadas com base no valor projetado selecionado.

#### AC-317 — Persistência e acessibilidade do seletor de previsão

- **Dado** que o usuário configurou o toggle de cálculo de previsão no card
- **Quando** a página for recarregada ou revisitada durante a navegação
- **Então** o estado do toggle é preservado via armazenamento local (`localStorage`), e o componente conta com atributos de acessibilidade adequados (`role="switch"`, `aria-checked` e identificador semântico).

## Fora de escopo

- Modificações em outros cards do Dashboard (Saldo Total, Entradas, Saídas).
- Criação de novos endpoints ou alterações no back-end (que é somente leitura).
- Alterações na fórmula de cálculo fornecida pelo back-end.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-078 | O valor padrão do toggle ao abrir pela primeira vez será desligado (Sobra Operacional padrão `monthForecast`) para manter compatibilidade e consistência visual imediata | confirmada | Confirmado pelo usuário com valor padrão desativado no primeiro acesso |
| ASM-079 | O design do toggle deve ser discreto e integrado harmonicamente ao cabeçalho do card sem quebrar o layout do grid de 4 colunas em telas menores | confirmada | Confirmado pelo usuário adotando switch compacto com tooltip |

## Perguntas em aberto

| ID | Pergunta | Status | Resposta |
|---|---|---|---|
| Q-043 | Qual a melhor rotulagem para o controle: texto compacto com switch ("Considerar saldo em conta") ou abas/pills segmentadas ("Fluxo do mês" / "Saldo final")? | respondida | Opção 1 confirmada pelo usuário: switch compacto com rótulo "Considerar saldo em conta" |
