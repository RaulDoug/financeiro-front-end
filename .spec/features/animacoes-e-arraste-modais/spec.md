# Spec: Animações e Arraste em Modais e Gavetas

> feature: animacoes-e-arraste-modais
> status: implementada

## Contexto

Modernização da experiência mobile e desktop do aplicativo financeiro por meio da implementação de animações fluidas de abertura e fechamento em gavetas (bottom sheets), modais e popups, além da inclusão do gesto de arrastar para baixo (drag-to-dismiss) no fluxo de lançamento rápido mobile.

## Histórias

### US-072 — Arraste para Baixo (Drag to Dismiss) no Lançamento Mobile

Como usuário utilizando o aplicativo em smartphone,
quero poder arrastar a gaveta de lançamento rápido para baixo a partir da barra indicadora superior,
para que eu possa fechar o formulário de forma natural e ergonômica sem precisar esticar o dedo até o botão de fechar.

#### AC-266 — Detecção de toque e arraste descendente no topo da gaveta
- **Dado** que a tela de lançamento rápido mobile (`MobileQuickEntry`) está aberta
- **Quando** o usuário toca no indicador `#drawer-handle` ou na barra superior e arrasta o dedo verticalmente para baixo
- **Então** o componente deve capturar os eventos de toque (`onTouchStart`, `onTouchMove`, `onTouchEnd`) e permitir o movimento apenas no sentido descendente (`deltaY > 0`).

#### AC-267 — Deslocamento visual em tempo real e atenuação de opacidade
- **Dado** que o usuário está arrastando a gaveta para baixo
- **Quando** o dedo se move verticalmente
- **Então** o card da gaveta deve acompanhar a posição do dedo via `transform: translateY` sem atrasos e a opacidade do fundo escuro (backdrop) deve reduzir proporcionalmente ao deslocamento.

#### AC-268 — Limiar de fechamento e restauração com mola elástica
- **Dado** que o usuário iniciou o arraste da gaveta
- **Quando** soltar o toque após ultrapassar o limiar de 90px (ou soltar com velocidade descendente)
- **Então** a gaveta deve completar a animação de saída para baixo e invocar `onClose`; caso solte antes do limiar, a gaveta deve retornar suavemente à posição inicial (0px).

---

### US-073 — Animações Fluidas de Abertura e Fechamento em Modais e Bottom Sheets

Como usuário navegando pelo sistema financeiro,
quero que os diálogos, modais e gavetas tenham transições visuais suaves tanto ao abrir quanto ao fechar,
para que a transição não desapareça de forma abrupta e proporcione sensação de acabamento profissional.

#### AC-269 — Animações nativas de Slide para gavetas inferiores (Bottom Sheets)
- **Dado** qualquer gaveta inferior mobile aberta (`MobileQuickEntry` ou `MoreMenuModal`)
- **Quando** o usuário aciona o fechamento (clicando no X, no backdrop ou na tecla Esc)
- **Então** a gaveta deve deslizar suavemente para baixo com animação `drawer-out` (200ms) antes do elemento ser desmontado do DOM.

#### AC-270 — Animações de Escala e Fade para diálogos centrais e popups
- **Dado** um modal central ou diálogo de confirmação aberto (como `TransactionModal` desktop ou `DeleteConfirmModal`)
- **Quando** for aberto ou fechado
- **Então** deve executar animações coordenadas de entrada (`scale-in` / `fade-in`) e de saída (`scale-out` / `fade-out`) com duração entre 150ms e 200ms.

#### AC-271 — Hook gerenciador de ciclo de vida de desmonte seguro (`useModalTransition`)
- **Dado** um componente de modal controlado pela propriedade `isOpen`
- **Quando** `isOpen` passar de `true` para `false`
- **Então** o hook utilitário deve manter a renderização temporária pelo tempo exato da animação de saída, disparando o desmonte apenas após o término da transição CSS.

---

### US-074 — Suavidade de Transição no App Shell e Menus

Como usuário alternando entre seções do aplicativo,
quero que as trocas de rotas e o menu 'Mais' tenham transições harmoniosas,
para que a navegação do sistema seja fluida e moderna.

#### AC-272 — Abertura e fechamento com animação na gaveta de Mais Opções
- **Dado** que o menu de navegação inferior mobile está visível
- **Quando** o usuário clica no botão "Mais" ou fecha a gaveta `MoreMenuModal`
- **Então** o painel de opções deve entrar e sair deslizando suavemente de baixo para cima e de cima para baixo com sincronização de backdrop.

#### AC-273 — Transição sutil de visualização de conteúdo (Viewport Fade)
- **Dado** o container principal de visualização de páginas (`AppLayout`)
- **Quando** uma rota de página for alterada
- **Então** o conteúdo da nova página deve ser apresentado com transição sutil de dissolvência (`fade-in` de 150ms) sem bloquear interação.

## Fora de escopo

- Redesenho de campos ou regras de negócio dos formulários de transações.
- Instalação de bibliotecas de física complexas que adicionem peso desnecessário ao bundle.
- Alterações no back-end (`API_Financeiro`).

## Suposições

| ID      | Suposição                                                                                                                                                                                      | Status     | Resolução                                                                                      |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| ASM-001 | A duração de 150ms a 200ms para as animações de saída é a faixa ideal que equilibra fluidez visual sem prejudicar a percepção de agilidade no mobile.                                          | confirmada | Implementadas durações entre 150ms e 200ms com cubic-bezier responsivo e testadas com sucesso. |
| ASM-002 | O arraste na gaveta deve ser ativado apenas com deslocamento descendente (deltaY > 0) a partir da área de cabeçalho/handle para não conflitar com a rolagem vertical dos campos do formulário. | confirmada | Implementada restrição a deltaY > 0 e touch-none no cabeçalho e handle.                        |
| ASM-003 | Utilizar animações nativas em CSS (`@keyframes` no index.css) garante performance máxima a 60fps sem dependências externas adicionais no React 19.                                             | confirmada | Validado via build do Vite e teste de renderização nativa.                                     |

## Perguntas em aberto

| ID    | Pergunta                                                                                                                                                                   | Status     | Resposta                                                                                                            |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- |
| Q-001 | Além da tela de lançamento rápido (`MobileQuickEntry`), a gaveta de navegação "Mais Opções" (`MoreMenuModal`) também deve receber o gesto de fechar arrastando para baixo? | respondida | Sim, a gaveta MoreMenuModal foi equipada com handle superior e fechamento por arraste idêntico ao MobileQuickEntry. |
