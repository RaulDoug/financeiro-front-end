# Tasks: Onboarding

> feature: onboarding

## T-009 — Lógica Global de Redirecionamento para Onboarding [pendente]
- Refs: US-004, AC-013, AC-019
- Arquivos: src/hooks/useOnboardingCheck.ts, src/routes/PrivateRoute.tsx, src/stores/wallet.store.ts
- Notas: Implementar Hook/Lógica no contexto do roteamento privado que verifica se o usuário autenticado não possui uma carteira ativa/existente. Se faltar, interceptar e redirecionar a navegação para `/onboarding`.

## T-010 — Serviços de API da Configuração Inicial [pendente]
- Refs: US-004, US-005
- Arquivos: src/services/wallet.service.ts, src/services/bankAccount.service.ts, src/services/payMethod.service.ts
- Notas: Implementar métodos de chamadas HTTP usando axios para `POST /api/wallet/register`, `POST /api/bank-account/register` e `POST /api/pay-method/register`, já aceitando os DTOs esperados.

## T-011 — Estrutura Base e Layout do Wizard (Stepper) [pendente]
- Refs: US-004, US-005
- Arquivos: src/pages/onboarding/OnboardingPage.tsx, src/components/onboarding/Stepper.tsx, src/stores/onboarding.store.ts
- Notas: Criar o layout da página de onboarding e o componente de "Progresso/Passos" (Stepper). Desenvolver um store temporário no Zustand para manter a navegação entre steps e dados em rascunho, protegendo contra F5 acidental.

## T-012 — Step 1: Criação da Carteira [pendente]
- Refs: US-004, AC-014
- Arquivos: src/components/onboarding/steps/StepWallet.tsx
- Notas: Implementar o formulário de nome da carteira com React Hook Form. Ao salvar, invocar a API e atualizar a global store `wallet.store.ts` com o ID gerado da carteira (usado nos próximos passos).

## T-013 — Step 2: Criação da Conta Bancária Inicial [pendente]
- Refs: US-005, AC-015, AC-016
- Arquivos: src/components/onboarding/steps/StepBankAccount.tsx
- Notas: Formulário para configurar banco e saldo inicial, com validações apropriadas via Zod. Injetar na requisição o cabeçalho `x-wallet-id` referente à carteira criada no T-012.

## T-014 — Step 3: Cartão de Crédito Opcional e Finalização [pendente]
- Refs: US-005, AC-017, AC-018, AC-020
- Arquivos: src/components/onboarding/steps/StepCreditCard.tsx
- Notas: Formulário contendo os dados do cartão de crédito (limite e datas). Criar botão de "Pular etapa". Em caso de sucesso ou omissão, concluir o Wizard e forçar transição (navigate) para a rota `/dashboard`.
