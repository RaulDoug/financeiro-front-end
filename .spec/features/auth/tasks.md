# Tasks: Auth

> feature: auth

## T-001 — Configuração do Store e Interceptor Axios [pendente]
- Refs: US-003, AC-008
- Arquivos: src/stores/auth.store.ts, src/lib/axios.ts
- Notas: Criar Zustand store guardando token, id, nome e email com persistência (via `zustand/middleware`). Configurar interceptor global no Axios para injetar o header Bearer com o token, e tratar falhas 401 para acionar logout.

## T-002 — Serviços de API (Login e Register) [pendente]
- Refs: US-001, US-002, AC-003, AC-005, AC-006
- Arquivos: src/services/auth.service.ts
- Notas: Implementar chamadas HTTP usando axios para `POST /api/auth/login` e `POST /api/auth/register`. Criar os DTOs e tratamentos de exceção esperados da API (como HTTP 429 para limite).

## T-003 — Layout Base de Autenticação [pendente]
- Refs: US-001, US-002
- Arquivos: src/layouts/AuthLayout.tsx, src/components/ui/AuthCard.tsx
- Notas: Construir o layout centralizado, com fundo ou divisão da tela, que envelopa as páginas de Login, Registro e Esqueci a Senha.

## T-004 — Página de Login [pendente]
- Refs: US-001, AC-001, AC-002, AC-003
- Arquivos: src/pages/auth/LoginPage.tsx
- Notas: Formulário integrado com React Hook Form + Zod. Exibir feedback adequado ao usuário caso ocorra erro de "Credenciais inválidas" ou de rate limit (5 tentativas em 15min).

## T-005 — Página de Registro [pendente]
- Refs: US-002, AC-004, AC-005, AC-006
- Arquivos: src/pages/auth/RegisterPage.tsx
- Notas: Implementar schema de validação complexa do Zod para garantir que a senha tenha 8+ caracteres, com número, maiúscula, minúscula e especial. Ao registrar com sucesso, executar auto-login imediato chamando POST /api/auth/login e redirecionar para Onboarding/Dashboard. Feedback imediato em caso de e-mail em uso.

## T-006 — Página de Recuperação de Senha (Placeholder) [pendente]
- Refs: US-003, AC-010, AC-011
- Arquivos: src/pages/auth/ForgotPasswordPage.tsx
- Notas: Construir interface informativa (placeholder) simulando um campo de digitação de e-mail com aviso de "funcionalidade em breve".

## T-007 — Guardas de Rota Privadas/Públicas [pendente]
- Refs: US-003, AC-007, AC-009, AC-012
- Arquivos: src/routes/PrivateRoute.tsx, src/routes/PublicRoute.tsx
- Notas: Criar componentes High-Order que verificam o estado de auth. O PrivateRoute bloqueia quem não tem token. O PublicRoute impede quem já logou de ver as telas de login/registro (forçando redirect pro dashboard).

## T-008 — Integração Geral das Rotas de Auth [pendente]
- Refs: US-001, US-002, US-003
- Arquivos: src/App.tsx, src/routes/index.tsx
- Notas: Consolidar a montagem das rotas, incluindo `/login`, `/register`, e `/forgot-password`, envelopando as rotas da aplicação de finanças dentro do PrivateRoute.
