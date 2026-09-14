# Tasks: Configurações

> feature: configuracoes

## T-071 — API e Hooks de Categorias [concluída]

- Refs: US-026, AC-106, AC-107
- Arquivos: src/services/category.service.ts, src/hooks/useCategories.ts
- Notas: GET/POST/PATCH/DELETE na rota `/api/categorie`. Importante usar `display_id`.

## T-072 — UI de Gerenciamento de Categorias [concluída]

- Refs: US-026, AC-106, AC-107, AC-108
- Arquivos: src/pages/Settings/CategoriesSettings.tsx, src/pages/Settings/CategoryModal.tsx
- Notas: Dividir exibição (Receitas/Despesas). Formulário de criação/edição.

## T-073 — API e Hooks de Contrapartes [concluída]

- Refs: US-027, AC-109, AC-110
- Arquivos: src/services/counterparty.service.ts, src/hooks/useCounterparties.ts
- Notas: Chamadas para `/api/counterpartie`. `display_id` no path params das exclusões e edições.

## T-074 — UI de Gerenciamento de Contrapartes [concluída]

- Refs: US-027, AC-109, AC-110
- Arquivos: src/pages/Settings/CounterpartiesSettings.tsx, src/pages/Settings/CounterpartyModal.tsx
- Notas: Agrupamento "Pagadores" e "Recebedores". Formulários correspondentes.

## T-075 — API e Hooks de Métodos de Pagamento [concluída]

- Refs: US-028, AC-111, AC-112, AC-113
- Arquivos: src/services/payMethod.service.ts, src/hooks/usePayMethods.ts
- Notas: Endpoint `/api/pay-method`.

## T-076 — UI de Métodos de Pagamento [concluída]

- Refs: US-028, AC-111, AC-112, AC-113
- Arquivos: src/pages/Settings/PayMethodsSettings.tsx, src/pages/Settings/PayMethodModal.tsx
- Notas: Listagem com ícone de Cartão (credit_card). O checkbox no modal deve ser readonly se em modo edição.

## T-077 — API de Gerenciamento de Carteira [concluída]

- Refs: US-029, AC-114, AC-115
- Arquivos: src/services/wallet.service.ts, src/hooks/useWalletSettings.ts
- Notas: PATCH e DELETE para `/api/wallet`. Gerenciar estado global após alteração.

## T-078 — UI de Configurações da Carteira [concluída]

- Refs: US-029, AC-114, AC-115
- Arquivos: src/pages/Settings/WalletSettings.tsx, src/pages/Settings/WalletDeleteAlert.tsx
- Notas: Formulário para renomear e "Danger Zone" de exclusão com modal exigindo a digitação do nome exato da carteira antes de permitir excluir.

## T-079 — UI de Placeholder para Equipe [concluída]

- Refs: US-030, AC-116
- Arquivos: src/pages/Settings/MembersSettings.tsx
- Notas: Um card bonito explicando que gestão de times virá em breve.

## T-080 — Layout da Tela de Configurações [concluída]

- Refs: US-030, AC-117
- Arquivos: src/pages/Settings/index.tsx, src/pages/Settings/SettingsSidebar.tsx, src/pages/Settings/SettingsLayout.tsx
- Notas: Criar um layout com menu lateral (sidebar responsivo) usando React Router Outlet.

## T-081 — Schemas de Validação [concluída]

- Refs: US-026, US-027, US-028, US-029
- Arquivos: src/schemas/settingsSchemas.ts
- Notas: Centralizar validação zod para todos os modais (Categorias, Métodos de pagamento, Contrapartes, Wallet).
