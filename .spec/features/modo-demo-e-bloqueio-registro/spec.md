# Spec: Modo de Demonstração e Bloqueio de Registro

> feature: modo-demo-e-bloqueio-registro
> status: implementada

## Contexto

Para permitir que potenciais clientes conheçam e interajam com a aplicação sem conectar ao banco de dados ou backend real, é necessário disponibilizar um Modo de Demonstração interativo (via rota direta `/demo`), com dados mockados em memória, capacidade de lançar despesas/receitas e visualizar relatórios dinâmicos recalculados em tempo real. Simultaneamente, para evitar registros indevidos antes da implementação de validação de e-mail no backend, a criação de contas deve ser desabilitada e a rota `/register` deve redirecionar diretamente para o login.

## Histórias

### US-100 — Acesso Rápido ao Modo Demonstração (`/demo`)

Como visitante ou potencial cliente, quero acessar o sistema diretamente pelo modo de demonstração, para conhecer as funcionalidades sem necessidade de criar conta ou realizar login prévio.

#### AC-362 — Inicialização Direta via Rota `/demo`
- **Dado** que o usuário acessa a URL `/demo`
- **Quando** a página é carregada
- **Então** o modo demo é ativado, uma sessão de usuário fictícia é inicializada em memória e o usuário é redirecionado instantaneamente para `/dashboard`.

#### AC-363 — Atalho para Modo Demo na Tela de Login
- **Dado** que o visitante está na tela de `/login`
- **Quando** visualizar as opções de acesso
- **Então** ele deve ver um botão proeminente "Experimentar Modo Demonstração" que o direciona para `/demo`.

#### AC-372 — Rota Raiz Padrão para Modo Demonstração
- **Dado** que o visitante acessa a URL raiz `http://localhost:5173/` sem sessão autenticada real
- **Quando** a rota for resolvida
- **Então** o sistema redireciona automaticamente para o modo de demonstração (`/demo`), tornando-o a tela padrão de entrada da aplicação.

### US-101 — Simulação e Recálculo em Memória das Telas Principais

Como usuário em demonstração, quero visualizar informações realistas, realizar novos lançamentos e ver os relatórios atualizados na hora, para compreender a proposta de valor do aplicativo.

#### AC-364 — Dataset Mockado Realista
- **Dado** que a demonstração foi iniciada
- **Quando** o usuário navega pelas telas do sistema
- **Então** ele vê contas bancárias, cartões de crédito, categorias estruturadas e transações distribuídas pelos meses do ano corrente.

#### AC-365 — Interceptação de Rede Transparente
- **Dado** que o modo demo está ativo (`isDemoMode === true`)
- **Quando** qualquer componente ou hook dispara requisição HTTP para rotas financeiras
- **Então** o cliente HTTP resolve localmente a resposta com os dados mockados em memória, sem emitir chamadas de rede externas.

#### AC-366 — Lançamento e Recálculo Dinâmico em Memória
- **Dado** que o usuário está no modo demo
- **Quando** ele cria uma nova receita ou despesa através do modal de lançamentos
- **Então** o registro é adicionado aos dados em memória e o relatório de DRE e despesas por categoria refletem a alteração imediatamente.

### US-102 — Ocultação Condicional de Investimentos Apenas no Modo Demo

Como usuário em demonstração, não devo visualizar opções de investimentos para focar nas funcionalidades centrais do aplicativo; enquanto na aplicação oficial de produção, o módulo de investimentos deve continuar 100% acessível e inalterado.

#### AC-367 — Isolamento do Módulo de Investimentos
- **Dado** que a aplicação está no modo demo (`isDemoMode === true`)
- **Quando** o menu lateral, menu mobile e rotas forem avaliados
- **Então** o item "Investimentos" não é exibido e a rota `/investimentos` redireciona para `/dashboard`; já quando a aplicação estiver em sessão oficial (`isDemoMode === false`), "Investimentos" é exibido normalmente.

### US-103 — Bloqueio Incondicional da Rota de Cadastro (`/register`)

Como administrador do sistema, quero desabilitar o acesso à criação de conta para prevenir cadastros sem validação de e-mail.

#### AC-368 — Bloqueio Total da URL `/register`
- **Dado** que qualquer usuário tenta acessar `/register` (seja por link ou digitando manualmente na URL)
- **Quando** a rota for processada
- **Então** ele é imediatamente redirecionado para `/login`, sem que o formulário de cadastro seja montado ou exibido.

#### AC-369 — Omissão de Links de Registro
- **Dado** que o usuário está na tela de `/login`
- **Quando** visualizar o rodapé do formulário
- **Então** nenhum link funcional de "Criar conta" ou navegação para `/register` é apresentado.

### US-104 — Restauração e Saída Segura da Demonstração

Como usuário em demonstração, quero saber claramente que estou em um ambiente fictício e poder sair a qualquer momento restaurando o estado original.

#### AC-370 — Banner Informativo de Demonstração
- **Dado** que o usuário está logado no modo demo
- **Quando** visualizar o layout principal do aplicativo
- **Então** um banner fixo no topo informa que os dados são temporários e oferece um botão "Sair da Demonstração".

#### AC-371 — Descarte de Dados e Reset ao Sair
- **Dado** que o usuário clica em "Sair da Demonstração" ou encerra a sessão
- **Quando** a ação for concluída
- **Então** todas as alterações feitas na demo são descartadas, a sessão é limpa e o usuário retorna à tela de `/login`.

#### AC-373 — Acesso Desimpedido à Tela de Login
- **Dado** que um usuário em modo demonstração deseja acessar sua conta real
- **Quando** ele clica em "Sair da Demonstração" ou navega diretamente para `/login`
- **Então** o sistema permite a visualização da tela de login sem redirecionar em loop para `/demo` ou `/dashboard`.
