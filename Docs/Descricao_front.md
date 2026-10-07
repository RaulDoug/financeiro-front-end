# 📱 Descrição do Projeto Front-End — App Financeiro

Documento oficial de visão geral, arquitetura técnica e especificação funcional do front-end do **App Financeiro**.

---

## 1. Visão Geral

O **Front-End do App Financeiro** é uma Single Page Application (SPA) moderna, responsiva e de alta performance desenvolvida em **React 19**, **TypeScript** e **Vite**. 

Seu objetivo é fornecer uma gestão financeira pessoal e compartilhada completa, intuitiva e segura, abstraindo a complexidade de regras de negócio como controle multicarteira, conciliação bancária, faturas de cartão de crédito parceladas, ativos de investimentos e projeções de fluxo de caixa.

### Diferenciais da Solução
- **Arquitetura Multicarteira:** Alternância ágil entre carteiras pessoais, empresariais ou familiares, com contexto propagado dinamicamente para todas as requisições via cabeçalho `x-wallet-id`.
- **Foco Mobile & Desktop:** Interface responsiva com navegação adaptativa (sidebar no desktop e bottom navigation com drawer/modal no mobile).
- **Dark Mode Nativo:** Suporte completo a tema claro e escuro persistido.
- **Cache e Sincronização em Tempo Real:** Camada de dados reativa alimentada por TanStack React Query v5.

---

## 2. Stack Tecnológica

| Camada / Função | Tecnologia | Finalidade no Projeto |
| :--- | :--- | :--- |
| **Framework Base** | React 19 + TypeScript | Interface declarativa com tipagem estática ponta a ponta |
| **Build Tool & Bundler** | Vite 8 + Babel React Compiler | Hot Module Replacement ultrarrápido e compilação otimizada |
| **Estilização** | Tailwind CSS v4 + Tailwind Merge + clsx | Estilização utilitária moderna e composição flexível de classes |
| **Roteamento** | React Router v7 | Navegação SPA, proteção de rotas públicas/privadas e aliases |
| **Gerenciamento de Estado do Servidor** | TanStack React Query v5 | Cache inteligente, mutações assíncronas e invalidação automática |
| **Gerenciamento de Estado Global do Cliente** | Zustand v5 | Stores desacopladas para autenticação, carteira ativa, tema e filtros |
| **Formulários & Validação** | React Hook Form + Zod | Formulários de alta performance com esquemas de validação rígidos |
| **Visualização de Dados** | Recharts v3 | Gráficos de barras, rosca e comparativos mensais/anuais |
| **Ícones** | Lucide React | Iconografia consistente e padronizada |
| **Cliente HTTP** | Axios v1 | Interceptors para injeção de JWT (`Bearer`) e cabeçalho `x-wallet-id` |

---

## 3. Estrutura Arquitetural do Código

A aplicação adota separação clara de responsabilidades no diretório `src/`:

```
src/
├── assets/             # Recursos estáticos e ilustrações
├── components/         # Componentes reutilizáveis por domínio
│   ├── bank-accounts/  # Cards de conta, formulários e totalizadores
│   ├── common/         # Componentes transversais (ex: MultiSelect)
│   ├── credit-cards/   # Cartão visual, faturas, limites e pagamentos
│   ├── layout/         # Topbar, Sidebar, MobileNav, notificações, seletores
│   ├── onboarding/     # Stepper e etapas do assistente inicial
│   ├── shared/         # Seletores visuais (BankPicker, IconPicker)
│   ├── transactions/   # Tabelas, filtros avançados, modais e quick entry
│   └── ui/             # Componentes base de interface
├── hooks/              # Custom React Hooks
├── layouts/            # AppLayout (painel principal) e AuthLayout (autenticação)
├── lib/                # Instâncias centrais (ex: queryClient)
├── pages/              # Páginas e views roteadas
│   ├── auth/           # Login, Registro e Recuperação
│   ├── onboarding/     # Fluxo do primeiro acesso
│   ├── Dashboard/      # Painel consolidado e gráficos
│   ├── Transactions/   # Livro-caixa e lançamentos
│   ├── CreditCardsPage # Gestão visual de cartões e faturas
│   ├── BankAccountsPage# Contas bancárias e saldos
│   ├── Investments/    # Ativos patrimoniais
│   ├── Reports/        # Relatórios anuais, categorias e contrapartes
│   └── Settings/       # Configurações de carteira, categorias e membros
├── routes/             # Definição de rotas, PublicRoute e PrivateRoute
├── schemas/            # Schemas de validação Zod
├── services/           # Camada de comunicação com a API (Axios)
├── stores/             # Stores Zustand (Auth, Wallet, Theme, Filters, Modais)
├── types/              # Definições de tipos TypeScript compartilhadas
└── utils/              # Formatadores de moeda, data, cálculos e helpers
```

---

## 4. Funcionalidades Detalhadas

### 4.1. Autenticação e Controle de Sessão
- **Login e Registro:** Autenticação com credenciais por e-mail e senha com validação via Zod.
- **Sessão Persistente:** Armazenamento seguro de token JWT e recarregamento automático do perfil do usuário.
- **Proteção de Rotas:** Redirecionamento automático de usuários não autenticados para `/login` e controle de acesso a páginas públicas/privadas.
- **Onboarding Guiado (Primeiro Acesso):** Wizard passo a passo (`Stepper`) para novos usuários configurarem:
  1. Criação da primeira Carteira.
  2. Cadastro da primeira Conta Bancária com saldo inicial.
  3. (Opcional) Cadastro do primeiro Cartão de Crédito.

### 4.2. Gestão Multicarteira e Membros
- **Seletor Global de Carteira (`WalletSelector`):** Dropdown sempre visível no cabeçalho; a troca de carteira altera o contexto e atualiza todos os dados na tela em tempo real.
- **Gerenciamento de Carteiras:** Criação, edição de nome/descrição e exclusão segura de carteiras.
- **Compartilhamento e Convites:** Envio de convites por e-mail, visualização de convites pendentes/aceitos e gerenciamento de membros participantes da carteira.

### 4.3. Dashboard (Visão Geral da Saúde Financeira)
- **Cards de Resumo Consolidado:**
  - Saldo Atual (soma dos saldos das contas bancárias).
  - Receitas do Mês Atual.
  - Despesas do Mês Atual.
  - Previsão de Sobra / Saldo Projetado (`monthForecast` e `monthForecastFinal`).
  - Total de Faturas Abertas de Cartão.
- **Atalhos Rápidos:** Botões imediatos para Nova Receita, Nova Despesa e Transferência entre contas.
- **Gráficos Interativos:**
  - Despesas por Categoria (gráfico de rosca/pizza).
  - Fluxo de Caixa Mensal (comparativo de barras Receitas vs. Despesas).
- **Lista de Transações Recentes:** Visualização das últimas movimentações com alternância de exibição e link rápido para a tela completa.

### 4.4. Gestão de Transações (Livro-Caixa)
- **Classificação Completa:** Suporte a Receitas (`incomings`), Despesas (`expenses`) e Transferências internas (`transfers`).
- **Lançamento Rápido e Modal Global:** Lançamento de movimentações a partir de qualquer ponto da aplicação (`GlobalTransactionModal` e `MobileQuickEntry`).
- **Parcelamento Inteligente:** Configuração de compras parceladas com vinculação automática de grupos de parcelas (`installments`).
- **Status e Baixa:** Controle de transações pendentes e efetivadas; baixa direta de pagamentos e recebimentos.
- **Filtros Avançados:** Filtro por período, mês/ano, status de liquidação, conta bancária, cartão, categoria e contraparte com persistência de estado.
- **Visualização Adaptativa:** Tabela detalhada para telas desktop e cards otimizados com suporte a gestos e ações rápidas para mobile.

### 4.5. Cartões de Crédito e Faturas
- **Interface Visual de Cartões:** Representação realista do cartão com bandeira, 4 últimos dígitos, limite total, limite utilizado e disponível.
- **Timeline de Faturas:** Navegação mensal pelas faturas (abertas, fechadas e pagas).
- **Discriminação de Gastos:** Listagem detalhada das compras lançadas na fatura do mês selecionado.
- **Quitação de Fatura (`PayInvoiceModal`):** Fluxo assistido para efetuar o pagamento da fatura debitando diretamente de uma conta bancária com data e valor parametrizáveis.

### 4.6. Contas Bancárias
- **Gestão de Contas:** Cadastro, edição e inativação de contas correntes, poupanças e carteiras de dinheiro.
- **Controle de Saldo Negativo:** Suporte explícito ao parâmetro de permissão de saldo negativo por conta (`allow_negative_balance`).
- **Totalizador de Saldos:** Indicador em destaque do montante líquido disponível na carteira ativa.

### 4.7. Investimentos (Patrimônio)
- **Gestão de Ativos:** Cadastro e listagem de ativos de investimento (`investment_assets`) vinculados a contas de custódia.
- **Segregação Patrimonial:** Separação do fluxo de caixa diário das alocações de capital a médio e longo prazo.
- **Banner de Funcionalidades:** Indicação visual de recursos pendentes de liberação na API (módulo de transações de aportes e resgates).

### 4.8. Relatórios e Análises Estratégicas
- **Relatório Anual:** Gráfico e métricas de evolução patrimonial mês a mês com receitas, despesas e balanço líquido anual.
- **Relatório por Categoria:** Detalhamento percentual e numérico da distribuição de gastos e ganhos.
- **Relatório por Contraparte:** Rastreamento do volume transacionado por pagador ou favorecido.

### 4.9. Configurações e Cadastros Auxiliares
- **Categorias:** Cadastro com personalização de ícones (`IconPicker`) e cores para receitas e despesas.
- **Contrapartes:** Cadastro de fornecedores, clientes, fontes de renda e favorecidos (`payer` / `payee`).
- **Métodos de Pagamento:** Parametrização de formas de pagamento (dinheiro, PIX, boleto, cartão de débito e cartão de crédito).
- **Membros da Carteira:** Gestão de permissões e convites para colaboração entre usuários.

---

## 5. Layout, UX e Acessibilidade

- **Sistema de Layout App Shell:** Cabeçalho superior unificado (`Topbar`) e barra lateral retrátil (`Sidebar`), com transição para barra de navegação inferior (`MobileNav`) em telas pequenas.
- **Central de Notificações (`NotificationsBell`):** Sino de avisos no topo com alertas de vencimentos do dia e pendências urgentes.
- **Seletores Visuais:** Componentes dedicados para escolha de instituições financeiras (`BankPicker`) e ícones de categorias (`IconPicker`).
- **Rotas com Aliases em Português:** Suporte transparente a rotas em inglês e português (ex: `/dashboard`, `/transacoes`, `/cartoes`, `/contas`, `/relatorios`, `/investimentos`).
- **Tratamento de Estados:** Componentes específicos para carregamento com esqueleto (`DashboardSkeleton`), estados vazios informativos (`ChartEmptyState`) e modais de confirmação destrutiva.

---

## 6. Integração com a API Back-End

- **Base URL:** Gerenciada por variáveis de ambiente ou proxy reverso do Vite (`/api`).
- **Cabeçalhos Padrão:**
  ```http
  Authorization: Bearer <jwt_token>
  x-wallet-id: <uuid_carteira_ativa>
  Content-Type: application/json
  ```
- **Tratamento de Erros:** Interceptors centralizados para captura de erros de rede, 401 (desautenticação automática e redirecionamento para login) e notificações claras ao usuário.
