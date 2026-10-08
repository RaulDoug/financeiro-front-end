# Tasks: Modo de Demonstração e Bloqueio de Registro

> feature: modo-demo-e-bloqueio-registro

## T-239 — Criação das Especificações onp-spec [concluida]

- Refs: US-100, US-101, US-102, US-103, US-104, AC-362, AC-363, AC-364, AC-365, AC-366, AC-367, AC-368, AC-369, AC-370, AC-371
- Arquivos: .spec/features/modo-demo-e-bloqueio-registro/spec.md, .spec/features/modo-demo-e-bloqueio-registro/tasks.md
- Notas: Especificar histórias, critérios de aceite e mapeamento de tarefas.

## T-240 — Dataset Mock e Store da Demonstração [concluida]

- Refs: US-101, AC-364, AC-366, US-104, AC-371
- Arquivos: src/mocks/demoData.ts, src/stores/demo.store.ts
- Notas: Criar dataset com contas, cartões, categorias, transações realistas de múltiplos meses e store com recálculo em tempo real de DRE e categorias.

## T-241 — Interceptação de Rede no Axios [concluida]

- Refs: US-101, AC-365
- Arquivos: src/lib/axios.ts, src/lib/demoAxiosAdapter.ts
- Notas: Interceptar chamadas no cliente Axios quando `isDemoMode === true` para servir dados mockados locais em vez de requisições de rede.

## T-242 — Rota /demo, Banner do Layout e Ocultação Condicional de Investimentos [concluida]

- Refs: US-100, AC-362, US-102, AC-367, US-104, AC-370, AC-371
- Arquivos: src/pages/demo/DemoRedirectPage.tsx, src/layouts/AppLayout.tsx, src/components/layout/Sidebar.tsx, src/components/layout/MoreMenuModal.tsx, src/routes/index.tsx
- Notas: Implementar rota `/demo`, banner no topo do app, e condicional para ocultar Investimentos apenas no modo demo.

## T-243 — Bloqueio Incondicional de /register e Botão Demo no Login [concluida]

- Refs: US-100, AC-363, US-103, AC-368, AC-369
- Arquivos: src/routes/index.tsx, src/pages/auth/LoginPage.tsx, src/pages/auth/RegisterPage.tsx
- Notas: Redirecionar `/register` diretamente para `/login` via `<Navigate to="/login" replace />` e adicionar botão destacado de demo na tela de login.

## T-244 — Suíte de Testes Executáveis com Anotações @spec [concluida]

- Refs: US-100, US-101, US-102, US-103, US-104, AC-362, AC-363, AC-364, AC-365, AC-366, AC-367, AC-368, AC-369, AC-370, AC-371
- Arquivos: test/modo-demo-e-bloqueio-registro.spec.test.js
- Notas: Criar testes automatizados para cada critério de aceite com prova executável via node --test.

## T-245 — Validação Executável e Testes Finais [concluida]

- Refs: US-100, US-101, US-102, US-103, US-104
- Arquivos: test/modo-demo-e-bloqueio-registro.spec.test.js
- Notas: Executar suíte de testes e validar build do projeto.

## T-246 — Rota Raiz e Rota Padrão para Modo Demonstração [concluida]

- Refs: US-100, AC-372, US-104, AC-370
- Arquivos: src/routes/index.tsx, src/routes/PrivateRoute.tsx, src/layouts/AppLayout.tsx
- Notas: Configurar rota raiz `/` e fallback para `DefaultRoute` levando à demonstração por padrão com disclaimer atualizado.

## T-247 — Liberação do Fluxo de Login a partir da Demonstração [concluida]

- Refs: US-104, AC-373
- Arquivos: src/routes/PublicRoute.tsx, src/routes/PrivateRoute.tsx, src/layouts/AppLayout.tsx
- Notas: Ajustar PublicRoute para não bloquear acessos com token demo e restaurar direcionamento de rotas deslogadas para /login.
