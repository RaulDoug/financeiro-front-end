# Spec: Centralização do Mês Vigente no Gráfico de Receitas x Despesas

> feature: centralizacao-mes-grafico-dashboard  
> status: implementada  

## Contexto

No Dashboard inicial do FinFlow, o gráfico de evolução de Receitas vs Despesas (`IncomeExpenseChart`) exibe os 12 meses do ano selecionado. Em telas mobile ou contêineres menores onde o gráfico possui rolagem horizontal contínua (`overflow-x-auto`), o componente abria com a rolagem fixada no início (`scrollLeft = 0`), exibindo Janeiro a Maio/Junho. Meses posteriores — como o mês vigente — ficavam fora do campo de visão à direita, obrigando o usuário a arrastar manualmente a tela a cada carregamento ou recarga da página.

Esta especificação define o comportamento de centralização automática do scroll horizontal no mês vigente sempre que a página for aberta ou recarregada no ano corrente, além de aplicar destaque visual ao mês atual no eixo horizontal para rápida identificação em qualquer dispositivo.

---

## Histórias

### US-066 — Foco e Centralização Automática no Mês Atual no Gráfico do Dashboard

Como usuário visualizando o Dashboard em qualquer resolução de tela,  
quero que o gráfico de Receitas vs Despesas centralize automaticamente o mês vigente e o destaque visualmente,  
para acompanhar meu desempenho financeiro imediato sem rolagens manuais desnecessárias.

#### AC-237 — Centralização automática do scroll horizontal no mês vigente
- **Dado** que o usuário acessa ou recarrega o Dashboard no ano corrente
- **Quando** o gráfico de Receitas vs Despesas conclui a renderização dos dados
- **Então** o contêiner de rolagem horizontal calcula o deslocamento geométrico proporcional ao mês vigente e posiciona as barras do mês atual centralizadas no viewport visível do gráfico.

#### AC-238 — Destaque visual distintivo do mês corrente no eixo X
- **Dado** qualquer resolução de tela (mobile ou desktop)
- **Quando** as legendas dos meses no eixo X são renderizadas
- **Então** o mês correspondente ao mês atual (quando o ano selecionado for o ano corrente) recebe destaque visual diferenciado (cor proeminente, peso tipográfico e indicador `data-testid="current-month-tick"`).

#### AC-239 — Preservação de rolagem inicial para anos históricos
- **Dado** que o usuário seleciona um ano anterior ou posterior ao ano corrente
- **Quando** os dados do ano selecionado são carregados
- **Então** o contêiner de rolagem inicia posicionado no início (Janeiro, `scrollLeft = 0`) sem forçar deslocamento para o mês vigente.
