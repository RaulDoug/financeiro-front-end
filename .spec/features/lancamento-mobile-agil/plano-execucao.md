# Plano de execução — lancamento-mobile-agil

> gerado conforme metodologia onp-spec-driven em 2026-09-16 08:07

## Resumo — o que vai acontecer

- **3 tarefa(s) planejada(s)**:
  - `T-143`: Fechamento por backdrop e remoção do teclado virtual customizado
  - `T-144`: Seletores estruturados de Descrição, Conta, Categoria, Método de Pagamento e Switch Pago
  - `T-145`: Testes automatizados de especificação AC-224 a AC-227
- **Branch de trabalho**: `spec/lancamento-mobile-agil`

## Detalhamento das Tarefas

### Tarefa T-143 — Fechamento por backdrop e remoção do teclado virtual customizado
- **Objetivo**: Adicionar evento de clique no backdrop do container para fechar a tela com `onClose()`, e remover o teclado virtual numérico que ocupava grande parte da tela, substituindo-o pelo display estilizado de valor da transação com input numérico nativo (`inputMode="decimal"`).
- **Arquivos**:
  - `src/components/transactions/MobileQuickEntry.tsx`
- **Critérios**: `US-064`, `AC-224`, `AC-225`

### Tarefa T-144 — Seletores estruturados de Descrição, Conta, Categoria, Método de Pagamento e Switch Pago
- **Objetivo**: Renderizar campos limpos e ergonômicos seguindo o design de referência (`Docs/front_layout/transa_es_lan_amento_gil`):
  1. Campo Descrição com ícone.
  2. Grid com seletor de Conta (com ícone/cor do banco) e Categoria (com ícone da categoria).
  3. Campo de Método de Pagamento (com ícone da forma de pagamento).
  4. Interruptor toggle "Já está pago" (liquidado hoje).
  5. Botão "Confirmar Lançamento (Salvar)" disparando payload completo.
- **Arquivos**:
  - `src/components/transactions/MobileQuickEntry.tsx`
- **Critérios**: `US-064`, `AC-226`, `AC-227`

### Tarefa T-145 — Testes automatizados de especificação AC-224 a AC-227
- **Objetivo**: Implementar a suíte executável `test/lancamento-mobile-agil.spec.test.js` cobrindo AC-224 (fechamento por backdrop), AC-225 (remoção do teclado virtual e valor nativo), AC-226 (seletores estruturados) e AC-227 (switch pago e payload completo).
- **Arquivos**:
  - `test/lancamento-mobile-agil.spec.test.js`
- **Critérios**: `US-064`, `AC-224`, `AC-225`, `AC-226`, `AC-227`

