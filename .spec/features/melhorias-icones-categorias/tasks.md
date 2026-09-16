# Tasks: Melhorias de Ícones e Seleção de Bandeiras

> feature: melhorias-icones-categorias

## T-110 — Componente seletor de ícones reutilizável [concluida]

- Refs: US-050, US-051, AC-169, AC-171
- Arquivos: src/components/shared/IconPicker.tsx
- Esforço: medio
- Notas: Criar componente genérico `IconPicker` com grid de ícones (Lucide Icons + emojis financeiros curados), campo de busca por nome e callback `onSelect(iconName: string)`. Deve funcionar como popover ou bottom-sheet em mobile.

## T-111 — Seleção de ícone em categorias [concluida]

- Refs: US-050, AC-169, AC-170
- Arquivos: src/pages/Settings/CategoryModal.tsx, src/pages/Settings/CategoriesSettings.tsx, src/services/category.service.ts
- Esforço: baixo
- Notas: Integrar `IconPicker` no formulário de criação/edição de categoria. Adicionar campo `icon` ao tipo e ao payload enviado à API (verificar suporte no backend). Exibir ícone na listagem de categorias.

## T-112 — Seleção de ícone em formas de pagamento [concluida]

- Refs: US-051, AC-171, AC-172
- Arquivos: src/pages/Settings/PayMethodModal.tsx, src/pages/Settings/PayMethodsSettings.tsx, src/services/payMethod.service.ts
- Esforço: baixo
- Notas: Integrar `IconPicker` no formulário de método de pagamento (apenas para não-cartões). Exibir ícone nos seletores e listagens.

## T-113 — Seleção de bandeira para cartões de crédito [concluida]

- Refs: US-052, AC-173, AC-174
- Arquivos: src/components/credit-cards/CreditCardForm.tsx, src/components/credit-cards/CreditCardVisual.tsx, src/types/creditCard.ts
- Esforço: medio
- Notas: Criar componente `CardBrandPicker` com opções: Visa, Mastercard, Elo, Amex, Hipercard, Diners, Outro. Integrar ao formulário de cartão. Exibir logo da bandeira no card visual (SVG ou classe CSS). Armazenar como campo `brand` no payload.

## T-114 — Auto-detecção de banco por nome de conta bancária [concluida]

- Refs: US-053, AC-175, AC-176, AC-177, AC-178
- Arquivos: src/lib/bankDetector.ts, src/components/shared/BankPicker.tsx, src/pages/BankAccountsPage.tsx
- Esforço: alto
- Notas: Criar `bankDetector.ts` com mapa de palavras-chave → {nome, ícone, cor primária, cor secundária} para os principais bancos brasileiros (Nubank, Itaú, Bradesco, Caixa, Santander, Inter, C6, BTG, Sicoob, Sicredi, Original, PicPay, Mercado Pago, XP, Rico, Clear). Integrar ao formulário de conta bancária: detectar ao alterar o campo nome (debounce 300ms), exibir preview. Criar `BankPicker` para seleção manual com lista scrollável de bancos. Persistir banco selecionado como campo no payload.

## T-115 — Layout mobile ágil para lançamento de transação [concluida]

- Refs: US-054, AC-179, AC-180
- Arquivos: src/components/transactions/TransactionModal.tsx, src/components/transactions/MobileQuickEntry.tsx
- Esforço: alto
- Notas: Criar variante `MobileQuickEntry` ativada quando viewport < 768px. Seguir layout de referência `Docs/front_layout/transa_es_lan_amento_gil/screen.png`: teclado numérico customizado para valor, abas de tipo no topo, campos secundários em linha, botão salvar. O modal/bottom-sheet existente permanece para desktop. Coordenar com a store global de modal para abrir o componente correto por breakpoint.
