# Spec: Auth

> feature: auth
> status: pronto

## Contexto

Gerenciamento de acesso e segurança da aplicação, permitindo que usuários se registrem, façam login e acessem as áreas protegidas do FinFlow de forma segura.

## Histórias

### US-001 — Acesso ao sistema (Login)

Como usuário, quero entrar no sistema usando meu e-mail e senha, para que eu possa gerenciar minhas finanças.

#### AC-001 — Login com sucesso
- **Dado** que o usuário está na tela de login
- **Quando** preenche um e-mail válido e a senha correta, e clica em "Entrar"
- **Então** o sistema salva o token na sessão e redireciona o usuário para a aplicação

#### AC-002 — Credenciais inválidas
- **Dado** que o usuário está na tela de login
- **Quando** preenche e-mail ou senha incorretos e tenta entrar
- **Então** o sistema exibe uma mensagem de erro ("Credenciais inválidas") e não faz o login

#### AC-003 — Limite de tentativas excedido (Rate limit)
- **Dado** que o usuário está tentando fazer login
- **Quando** falha 5 vezes na mesma janela de 15 minutos (recebendo erro 429 da API)
- **Então** o sistema exibe uma mensagem bloqueando novas tentativas por um período e orientando o usuário a aguardar

### US-002 — Registro de novo usuário

Como um novo usuário, quero criar uma conta com meus dados básicos, para que eu possa usar o FinFlow.

#### AC-004 — Senha forte
- **Dado** que o usuário está preenchendo o formulário de registro
- **Quando** digita uma senha que não atende aos requisitos (mínimo de 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial)
- **Então** a interface exibe mensagens claras de validação indicando quais requisitos faltam

#### AC-005 — Registro com sucesso e auto-login
- **Dado** que o formulário de registro foi preenchido corretamente (nome de 2 a 255 chars, e-mail válido, senha forte)
- **Quando** o usuário submete o formulário
- **Então** a conta é criada via `POST /api/auth/register`, o front-end executa o auto-login chamando `POST /api/auth/login` em segundo plano e direciona o usuário para o Onboarding/Dashboard

#### AC-006 — E-mail já em uso
- **Dado** que o usuário preenche o registro
- **Quando** utiliza um e-mail que já está cadastrado
- **Então** o sistema informa que o e-mail já está em uso

### US-003 — Proteção de rotas e Gestão de Sessão

Como sistema, quero garantir que apenas usuários autenticados acessem a área logada, para que os dados financeiros fiquem protegidos.

#### AC-007 — Redirecionamento de não autenticados
- **Dado** que um usuário não tem um token ativo e persistido no `localStorage`
- **Quando** tenta acessar uma rota protegida (ex: `/dashboard`)
- **Então** ele é interceptado e redirecionado para a página `/login`

#### AC-008 — Sessão expirada
- **Dado** que o usuário logado deixou o sistema aberto e o token expirou (passou de 1 dia)
- **Quando** o sistema tentar fazer qualquer requisição que retorne erro 401 (Não Autorizado)
- **Então** a sessão do usuário é limpa do Zustand e `localStorage` e ele é redirecionado para `/login` informando que a sessão expirou

#### AC-009 — Redirecionamento de logados da tela de login
- **Dado** que o usuário já está logado e possui token válido
- **Quando** acessa manualmente rotas como `/login` ou `/register`
- **Então** o sistema o redireciona automaticamente de volta para o `/dashboard`

#### AC-010 — Acesso à página de recuperação
- **Dado** que o usuário clica em "Esqueci minha senha"
- **Quando** a rota `/forgot-password` é acessada
- **Então** ele visualiza uma página marcadora (placeholder) indicando que a funcionalidade estará disponível em breve

#### AC-011 — Validação do placeholder
- **Dado** que o usuário está no placeholder de recuperação de senha
- **Quando** tenta submeter um e-mail com formato inválido
- **Então** a interface deve exibir erro de validação de formulário

#### AC-012 — Ação de Sair (Logout)
- **Dado** que o usuário está logado e usando o sistema
- **Quando** clica na opção de "Sair" / "Logout" na interface
- **Então** os dados do usuário e o token são removidos do Zustand e do armazenamento local, e ele é levado para a tela de login

## Fora de escopo

- Implementação funcional do backend para recuperação de senha (apenas interface de placeholder por enquanto).
- Confirmação de conta via e-mail ou SMS.
- Login via provedores externos (OAuth via Google, Apple, etc).

## Suposições

| ID      | Suposição                                                                                                                                                | Status     | Resolução                                                 |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------- |
| ASM-001 | A validação do token é feita checando a expiração do JWT localmente antes de cada request, ou apenas aguardando o HTTP 401 da API. Vamos aguardar o 401. | confirmada | O interceptor Axios tratará os status 401 como expiração. |
| ASM-002 | O usuário não precisa confirmar e-mail logo após se registrar, podendo já realizar login na sequência.                                                   | confirmada | Confirmado: front-end executa auto-login imediato.        |
| ASM-003 | O ID, nome e e-mail retornados no endpoint POST `/api/auth/login` serão guardados no estado global (Zustand) para exibição na UI.                        | confirmada | —                                                         |

## Perguntas em aberto

| ID    | Pergunta                                                                                                                                              | Status     | Resposta                                                                                                                                     |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Q-001 | Ao concluir o registro com sucesso, o usuário é auto-logado (via token de resposta) ou deve ir para a tela de login preencher as credenciais de novo? | respondida | Auto-login em segundo plano chamando POST /api/auth/login com as credenciais submetidas e redirecionamento direto para Onboarding/Dashboard. |
| Q-002 | Como será o comportamento de Refresh Token? Não consta nos requisitos atuais, assumimos que o token expira rigidamente em 1 dia, forçando re-login.   | respondida | Sem refresh token na API; ao receber 401 (expiração de 1 dia), a sessão é limpa do localStorage/Zustand e redireciona para /login com aviso. |
| Q-003 | Onde armazenamos o token e dados de usuário no frontend de forma segura? (O requisito pede local storage e store, manteremos isso).                   | respondida | Token JWT persistido no localStorage (chave finflow_token) e dados do usuário (id, nome, email) reativos na store Zustand.                   |
