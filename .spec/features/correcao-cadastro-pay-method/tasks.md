# Tasks: Correcao cadastro pay method

> feature: correcao-cadastro-pay-method

## T-137 — Sanitização de payload em payMethodService [concluida]
- Refs: US-062, AC-218, AC-219
- Arquivos: src/services/payMethod.service.ts
- Notas: Implementar função auxiliar de higienização de payload em payMethodService (registerPayMethod e updatePayMethod) para garantir que apenas colunas válidas da tabela pay_methods sejam transmitidas, expurgando propriedades como type.

## T-138 — Ajuste no envio de dados no PayMethodModal [concluida]
- Refs: US-062, AC-220
- Arquivos: src/pages/Settings/PayMethodModal.tsx
- Notas: Garantir que o modal não passe a chave type para o payload de submissão do serviço e manter as opções de cor e ícone para cartões de crédito configuradas corretamente.

## T-139 — Testes automatizados dos critérios de aceite AC-218, AC-219 e AC-220 [concluida]
- Refs: US-062, AC-218, AC-219, AC-220
- Arquivos: test/correcao-cadastro-pay-method.spec.test.js
- Notas: Criar suíte de testes com anotações @spec:AC-218, @spec:AC-219 e @spec:AC-220 verificando a sanitização no serviço e no modal.
