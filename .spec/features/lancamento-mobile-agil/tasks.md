# Tasks: Lançamento Móvel Ágil

> feature: lancamento-mobile-agil

## T-143 — Fechamento por backdrop e remoção do teclado virtual customizado [concluida]
- Refs: US-064, AC-224, AC-225
- Arquivos: src/components/transactions/MobileQuickEntry.tsx
- Notas: Implementar suporte a clique no backdrop externo para disparar onClose(), e remover o teclado virtual numérico (12 botões), substituindo-o pelo display monetário com input nativo (inputMode="decimal") em destaque conforme o design de referência em Docs/front_layout/transa_es_lan_amento_gil.

## T-144 — Seletores estruturados de Descrição, Conta, Categoria, Método de Pagamento e Switch Pago [concluida]
- Refs: US-064, AC-226, AC-227
- Arquivos: src/components/transactions/MobileQuickEntry.tsx
- Notas: Adicionar campos no formato da referência: campo de Descrição com ícone, grid de seletores para Conta e Categoria, campo de Método de Pagamento (pay_methods_id), switch de status "Já está pago" (completed/pending) e botão proeminente de confirmação que envia o payload completo.

## T-145 — Testes automatizados de especificação AC-224 a AC-227 [concluida]
- Refs: US-064, AC-224, AC-225, AC-226, AC-227
- Arquivos: test/lancamento-mobile-agil.spec.test.js
- Notas: Criar suíte executável via node --test validando todas as regras e atributos de acessibilidade e comportamento do novo MobileQuickEntry.

## T-146 — Inclusão dos campos de Data de Vencimento e Pagamento com fallback automático [concluida]
- Refs: US-064, AC-228
- Arquivos: src/components/transactions/MobileQuickEntry.tsx, test/lancamento-mobile-agil.spec.test.js
- Notas: Adicionar campos dedicados para Data de Vencimento e Data de Pagamento no layout mobile com inicialização e fallback para data atual.

## T-147 — Seletor dedicado de contraparte e tratamento de erro 400 [concluida]
- Refs: US-064, AC-229, AC-232
- Arquivos: src/components/transactions/MobileQuickEntry.tsx, src/components/transactions/TransactionModal.tsx
- Notas: Adicionar card seletor visual de Contraparte (Pagador/Beneficiário) no MobileQuickEntry com opções da carteira atual, auto-seleção inteligente e fallback 'Geral' garantindo envio de counterparty_id válido no POST /api/transaction/register para eliminar o erro 400 Bad Request, além de adicionar banner de erro amigável.

## T-148 — Correção da edição nos campos de data e ampliação do botão de confirmação [concluida]
- Refs: US-064, AC-230, AC-231
- Arquivos: src/components/transactions/MobileQuickEntry.tsx
- Notas: Tornar os inputs de data diretamente editáveis com acionamento de showPicker() ao toque no card em desktop e mobile, e aumentar as dimensões do botão Confirmar Lançamento para h-14 (56px) com tipografia text-base e cantos rounded-2xl.

## T-149 — Testes automatizados de especificação AC-229 a AC-232 [concluida]
- Refs: US-064, AC-229, AC-230, AC-231, AC-232
- Arquivos: test/lancamento-mobile-agil.spec.test.js
- Notas: Expandir suíte de testes executável validando seletor de contraparte na UI, envio de counterparty_id no payload, suporte a showPicker/inputs de data editáveis e altura ampliada do botão de salvar.

## T-150 — Ocultação de contraparte em transferências e contraparte padrão "Transferências" [concluida]
- Refs: US-064, AC-233
- Arquivos: src/components/transactions/MobileQuickEntry.tsx, src/pages/Settings/CounterpartiesSettings.tsx, src/components/transactions/TransactionFormBase.tsx, test/lancamento-mobile-agil.spec.test.js
- Notas: Ocultar o seletor visual de contraparte quando type === 'transfers', expandir forma de pagamento, injetar contraparte padrão 'Transferências' auto-criada se necessário no payload e ocultar contraparte 'Transferências' das listagens do usuário.



