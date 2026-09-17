# Spec: Ajustes de Layout e Modais (Cartões e Transações)

> feature: ajustes-modais-cartoes-transacoes
> status: em-implementacao

## Contexto

Ajuste do layout de lançamento de cartão no mobile para comportamento idêntico ao de lançamento de transação (gaveta inferior deslizante / bottom sheet com suporte a arraste descendente para fechar), correção de confinamento de backdrop e desalinhamento de centro causado por contextos de empilhamento CSS (resolvido com React Portals para o document.body), e remoção da barra lateral cinza de rolagem na tela de lançamento de transações no modo desktop.

## Histórias

### US-076 — Layout Mobile em Bottom Sheet e Gesto de Arraste no Lançamento de Cartão

Como usuário acessando a área de cartões no smartphone,
quero que o modal de cadastro e edição de cartão abra deslizando de baixo para cima como uma gaveta e permita fechamento por gesto de arraste,
para ter uma experiência consistente e fluida com a tela de lançamento de transações.

#### AC-279 — Gaveta inferior (Bottom Sheet) com animações de slide no cadastro de cartão mobile
- **Dado** que o usuário está em dispositivo móvel (< 768px)
- **Quando** clicar no botão "Novo Cartão" ou editar um cartão existente
- **Então** o formulário deve surgir a partir da base da tela com cantos superiores arredondados (`rounded-t-3xl`), animação `animate-drawer-in` e fechar com `animate-drawer-out`.

#### AC-280 — Gesto de arraste para baixo (drag-to-dismiss) no modal de cartão mobile
- **Dado** que o modal de cartão está aberto no mobile
- **Quando** o usuário tocar na barra indicadora `#drawer-handle` ou no topo da gaveta e arrastar para baixo
- **Então** o card deve acompanhar o movimento em tempo real com atenuação da opacidade do backdrop, e fechar automaticamente caso o deslocamento ultrapasse o limiar de 90px.

---

### US-077 — Backdrop de Tela Inteira e Centralização Viewport para Modais via Portal

Como usuário navegando no sistema tanto no desktop quanto no mobile,
quero que os modais escureçam toda a extensão da tela (incluindo cabeçalho e menu lateral) e fiquem centralizados no meio da tela no desktop,
para que o foco visual seja preservado sem artefatos de corte por containers pais.

#### AC-281 — Backdrop escuro cobrindo 100% da tela (header e sidebar inclusos) e centralização de viewport via Portal
- **Dado** que um modal (`CreditCardModal`, `CreditCardDeleteDialog` ou `TransactionModal`) é acionado
- **Quando** for renderizado
- **Então** seus nós de DOM devem ser montados no `document.body` via `createPortal`, cobrindo 100% do viewport e centralizando-se no centro da janela no desktop.

#### AC-282 — Desmonte suave e sincronizado com useModalTransition em CreditCardModal
- **Dado** que o usuário solicita o fechamento de `CreditCardModal` (via clique no X, Esc, arraste ou clique fora)
- **Quando** o fechamento for disparado
- **Então** o modal deve executar sua animação de saída completa antes de ser desmontado da árvore React via `useModalTransition`.

---

### US-078 — Remoção da Barra Lateral de Rolagem no Lançamento de Transação Desktop

Como usuário criando ou editando transações no computador,
quero que o modal de transações não exiba a barra cinza de rolagem lateral na janela do modal,
para manter uma interface limpa sem elementos visuais desnecessários enquanto a rolagem continua disponível caso haja overflow.

#### AC-283 — Ocultação da barra de rolagem lateral na tela de lançamento de transações desktop
- **Dado** que o modal de lançamento de transação está aberto em modo desktop
- **Quando** o formulário é visualizado
- **Então** a barra de rolagem vertical cinza nativa do navegador não deve ser exibida (`no-scrollbar` / `scrollbar-width: none` e `::-webkit-scrollbar: display: none`), preservando a rolagem com a roda do mouse quando necessário.

