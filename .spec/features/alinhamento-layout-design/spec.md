# Spec: Alinhamento de Layout com Design de Referência

> feature: alinhamento-layout-design
> status: pronta

## Contexto

Análise e ajuste de todos os layouts do aplicativo para alinhá-los com os exemplos visuais da pasta `Docs/front_layout`. Inclui ajuste do dashboard (padrão `dashboard_finflow`), relatório DRE (`relat_rios_anal_ticos_dre`), e revisão geral de todas as telas comparando com os designs de referência. Fontes de KPIs são tratadas com moderação: os exemplos usam fontes muito grandes que causam quebra de linha — o ajuste deve priorizar legibilidade e organização sobre fidelidade literal ao tamanho de fonte do exemplo.

## Histórias

### US-055 — Dashboard Alinhado ao Design de Referência

Como usuário, quero que o dashboard siga o padrão visual definido nos exemplos da pasta `dashboard_finflow`, para ter uma experiência coesa e profissional.

#### AC-181 — Layout geral do dashboard conforme referência

- **Dado** que o usuário acessa o dashboard
- **Quando** a página é renderizada
- **Então** a disposição dos elementos (KPIs, gráficos, transações recentes, ações rápidas, saldos de contas) segue o grid e hierarquia visual definidos na tela de referência `Docs/front_layout/dashboard_finflow/screen.png`

#### AC-182 — KPIs do dashboard com tamanho de fonte equilibrado

- **Dado** que os KPIs são exibidos no dashboard
- **Quando** o usuário visualiza em qualquer viewport (mobile/desktop)
- **Então** os valores monetários dos KPIs são legíveis sem quebra de linha, usando tamanho de fonte proporcional ao container (não replicando o tamanho excessivo da referência que causa quebra)

#### AC-183 — Seção de saldos de contas alinhada à referência

- **Dado** que o usuário visualiza a seção de contas no dashboard
- **Quando** renderizada
- **Então** a apresentação visual (cards, cores, layout) segue o padrão da referência `dashboard_finflow`

### US-056 — Relatório DRE Alinhado ao Design de Referência

Como usuário, quero que a tela de Relatórios Analíticos DRE siga o padrão visual definido em `relat_rios_anal_ticos_dre`, para uma melhor compreensão dos dados financeiros anuais.

#### AC-184 — Layout da tela DRE conforme referência

- **Dado** que o usuário acessa a aba DRE nos relatórios
- **Quando** a página é renderizada
- **Então** a disposição dos elementos (tabela de meses, gráfico de barras, badges de poupança/déficit, seletor de ano) segue o layout definido em `Docs/front_layout/relat_rios_anal_ticos_dre/screen.png`

#### AC-185 — Tabela DRE com colunas e badges corretos

- **Dado** que o usuário visualiza os dados do DRE
- **Quando** a tabela é renderizada
- **Então** cada linha de mês exibe: mês, receitas, despesas, saldo e badge "Poupança: X%" em verde ou "Déficit: -X%" em vermelho, com o mesmo estilo visual da referência

#### AC-186 — Gráfico DRE com estilo alinhado à referência

- **Dado** que o gráfico de barras do DRE está visível
- **Quando** renderizado
- **Então** as cores das barras (receita vs despesa), espaçamento e eixos seguem o padrão visual da referência

### US-057 — Auditoria e Alinhamento Geral de Layouts

Como usuário, quero que todas as telas do aplicativo estejam alinhadas com os respectivos designs de referência da pasta `front_layout`, para uma experiência visual consistente e profissional.

#### AC-187 — Tela de Transações (Web) alinhada à referência

- **Dado** que o usuário acessa a tela de transações no desktop
- **Quando** a página é renderizada
- **Então** o layout da tabela, filtros, KPIs e paginação seguem o padrão de `finflow_web_transa_es_lan_amentos`, com fontes legíveis e sem quebra de linha nos KPIs

#### AC-188 — Tela de Cartões de Crédito (Web) alinhada à referência

- **Dado** que o usuário acessa a tela de cartões de crédito
- **Quando** a página é renderizada
- **Então** o layout dos cards visuais, barra de limite e informações seguem o padrão de `finflow_web_cart_es_de_cr_dito_faturas`

#### AC-189 — Tela de Contas Bancárias (Web) alinhada à referência

- **Dado** que o usuário acessa contas bancárias (configurações ou visão geral)
- **Quando** a página é renderizada
- **Então** o layout segue o padrão de `finflow_web_contas_banc_rias_saldos`

#### AC-190 — Tela de Categorias/Configurações (Web) alinhada à referência

- **Dado** que o usuário acessa a tela de categorias nas configurações
- **Quando** a página é renderizada
- **Então** o layout (abas, listagem, botões de ação) segue o padrão de `finflow_web_categorias_centro_de_custos`

#### AC-191 — Tela de Métodos de Pagamento (Web) alinhada à referência

- **Dado** que o usuário acessa métodos de pagamento nas configurações
- **Quando** a página é renderizada
- **Então** o layout segue o padrão de `finflow_web_m_todos_de_pagamento_meios_de_cobran_a`

#### AC-192 — Tela de Contrapartes (Web) alinhada à referência

- **Dado** que o usuário acessa contrapartes nas configurações
- **Quando** a página é renderizada
- **Então** o layout segue o padrão de `finflow_web_contrapartes_favorecidos`

#### AC-193 — Tela de Investimentos (Web) alinhada à referência

- **Dado** que o usuário acessa a tela de investimentos
- **Quando** a página é renderizada
- **Então** o layout segue o padrão de `finflow_web_investimentos_ativos`

## Fora de escopo

- Redesign completo de componentes — apenas alinhamento visual ao design existente.
- Criação de novas funcionalidades durante o alinhamento de layout.
- Modificação de tamanhos de fonte para valores maiores que o atual se causarem quebra de linha.

## Suposições

| ID      | Suposição                                                                                                                                                           | Status     | Resolução                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------ |
| ASM-048 | Os designs de referência em `front_layout` são a versão definitiva aprovada pelo usuário para alinhamento, com ressalva explícita sobre tamanho de fontes dos KPIs. | confirmada | Confirmado na solicitação do usuário.                        |
| ASM-049 | Os ajustes de layout serão feitos nos componentes React/CSS existentes sem trocar a biblioteca de UI (manter Tailwind/shadcn).                                      | confirmada | Confirma-se o padrão de tecnologia do projeto.               |
| ASM-050 | As diferenças encontradas durante a auditoria serão catalogadas antes de executar para aprovação.                                                                   | confirmada | Auditoria visual será feita como primeiro passo da execução. |

## Perguntas em aberto

| ID    | Pergunta                                                                                                                                            | Status     | Resposta                                                                                                                                                         |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q-038 | Para fontes de KPIs: qual é o tamanho máximo aceitável antes de causar quebra de linha (em px ou rem)? O padrão atual deve ser mantido ou reduzido? | respondida | Manter o tamanho atual das fontes dos KPIs. Ajustar apenas layout e espaçamentos para alinhar com a referência — não aumentar fontes que causem quebra de linha. |
| Q-039 | O alinhamento deve afetar também o tema escuro (dark mode), ou apenas o tema padrão vigente?                                                        | respondida | Apenas o tema padrão vigente (light/dark que está ativo). Garantir consistência no que o usuário vê atualmente.                                                  |
