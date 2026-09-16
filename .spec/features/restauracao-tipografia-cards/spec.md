# Spec: Restauração de Tipografia dos Cards — Início e Transações

> feature: restauracao-tipografia-cards
> status: pronta

## Contexto

A tarefa T-093 (feature `melhorias-ux-mobile-desktop`) reduziu o tamanho das fontes e dos cards nas telas de Início (Dashboard) e Transações para resolver quebra de linha em viewports estreitas. No entanto, o ajuste foi excessivo: os títulos e valores monetários dos KPIs do Dashboard ficaram visivelmente menores do que o restante da aplicação (headings de página usam `text-2xl`, cards de outras telas usam `text-base`/`text-lg`), e os itens da lista mobile de transações ficaram com fontes abaixo do mínimo legível.

O objetivo desta feature é restaurar a tipografia dos cards de KPI e da lista mobile de transações para um tamanho coerente com o padrão visual do restante do app, sem causar quebra de linha — usando estratégias de layout já disponíveis (truncamento com `truncate`, ajuste de `min-w-0`, `break-words`).

## Histórias

### US-058 — Tipografia dos KPIs do Dashboard Restaurada ao Padrão

Como usuário do Dashboard, quero ver os títulos e valores dos KPIs em tamanho legível e coerente com o restante da aplicação, sem quebra de linha.

#### AC-194 — Título do card KPI em tamanho padrão

- **Dado** que o usuário está na página inicial (Dashboard)
- **Quando** os cards de KPI são renderizados em qualquer viewport
- **Então** o título do card (ex: "Saldo Total", "Entradas Realizadas") usa a classe `text-sm font-medium` (sem o modificador `xs` no breakpoint base), idêntico ao padrão de labels usados em outros cards da aplicação

#### AC-195 — Valor monetário do KPI em tamanho proeminente

- **Dado** que o usuário visualiza os cards de KPI no Dashboard
- **Quando** renderizados em viewport desktop (≥ 1024px)
- **Então** o valor monetário usa `text-2xl` ou superior (ex: `text-xl sm:text-2xl lg:text-3xl`), mantendo legibilidade e sem transbordar o container

#### AC-196 — Ícone do card KPI sem redução excessiva no mobile

- **Dado** que o usuário está em viewport mobile (< 768px)
- **Quando** os cards de KPI são renderizados
- **Então** o ícone do card tem tamanho mínimo de `w-4 h-4` e o container do ícone usa padding `p-2`, sem redução com breakpoint base `p-1.5`

### US-059 — Tipografia da Lista Mobile de Transações Restaurada ao Padrão

Como usuário que visualiza transações em dispositivo móvel, quero que a descrição e o valor de cada transação sejam apresentados em fonte legível, equivalente ao `text-sm` padrão da aplicação.

#### AC-197 — Descrição da transação mobile em `text-sm`

- **Dado** que o usuário está na tela de Transações em viewport mobile (< 768px)
- **Quando** a lista compacta de transações é exibida
- **Então** o texto da descrição de cada item usa no mínimo `text-sm font-semibold`, sem redutor `text-xs` como tamanho base

#### AC-198 — Valor monetário da transação mobile em `text-sm`

- **Dado** que o usuário está na tela de Transações em viewport mobile (< 768px)
- **Quando** a lista compacta de transações é exibida
- **Então** o valor monetário de cada item usa no mínimo `text-sm font-bold`, sem redutor `text-xs` como tamanho base

#### AC-199 — Informações secundárias (chips e data) mantidas compactas

- **Dado** que o usuário visualiza a lista mobile de transações
- **Quando** os chips de categoria/conta e a data são renderizados
- **Então** esses elementos secundários continuam usando `text-[10px]` ou `text-xs`, diferenciando-se visualmente das informações primárias (descrição e valor)

## Fora de escopo

- Alteração na estrutura de grid ou layout dos cards do Dashboard.
- Modificação de qualquer tipografia fora dos componentes `KpiCards.tsx` e `TransactionMobileList.tsx`.
- Quebra de linha em nenhum viewport: se o valor não couber, aplica `truncate`.

## Suposições

| ID      | Suposição                                                                                                                                                                  | Status     | Resolução                                                                               |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------- |
| ASM-051 | Os KpiCards do Dashboard usam `truncate` para evitar quebra de linha; aumentar a fonte não causará overflow desde que o truncamento permaneça ativo.                       | confirmada | Confirmado: o código atual já usa `truncate block` no valor — basta aumentar o tamanho. |
| ASM-052 | O grid de 4 colunas dos KpiCards (desktop) tem largura suficiente para suportar `text-3xl` sem transbordar nos valores médios de uso (R\$ 999.999,99 é o máximo esperado). | aberta     | A validar visualmente após a mudança.                                                   |
| ASM-053 | A lista mobile de transações não usa scroll horizontal; o `flex items-center justify-between` garante que descrição e valor ficam em lados opostos sem quebra.             | confirmada | Confirmado pelo layout atual do `TransactionMobileList.tsx`.                            |

## Perguntas em aberto

| ID    | Pergunta                                                                                                               | Status | Resposta                                    |
| ----- | ---------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------- |
| Q-040 | Para os valores dos KPIs, qual é a escala exata desejada: `text-xl sm:text-2xl lg:text-3xl` ou `text-2xl sm:text-3xl`? | aberta | Aguardando aprovação do plano pelo usuário. |
| Q-041 | O ícone do card KPI deve voltar ao tamanho `p-2 w-5 h-5` em todos os breakpoints, ou apenas a partir de `sm`?          | aberta | Aguardando aprovação do plano pelo usuário. |

