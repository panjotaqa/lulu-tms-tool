# SDD Prompt Template: Specification & Planning

## 1. Contexto e Objetivo
> [DESCREVA AQUI A FUNCIONALIDADE]
> **Restrição de Abstração:** Foque no que o usuário precisa e por que. Evite detalhes de implementação prematuros (stack, APIs) nesta fase.

## 2. Marcação de Incertezas (Anti-Alucinação)
**Instrução para o Agente:** Se houver qualquer ambiguidade neste pedido, utilize obrigatoriamente o marcador `[NEEDS CLARIFICATION]` e descreva a dúvida técnica ou de negócio antes de prosseguir. Não adivinhe comportamentos.

## 3. Diretrizes Arquitetônicas (A Constituição)
Ao elaborar este plano, respeite os seguintes artigos:
- **Library-First:** Projete como biblioteca autônoma e modular, sem acoplamento direto à aplicação principal.
- **CLI Interface:** Exponha a lógica via CLI, aceitando/produzindo entrada e saída em texto/JSON.
- **Simplicity Gate:** Limite a no máximo 3 subprojetos. Proibido "future-proofing".
- **Anti-Abstração:** Use recursos nativos do framework. Não crie camadas de abstração complexas.

## 4. Estratégia de Validação (Test-First)
**Fluxo de Execução:**
1. Defina os **Contratos** (APIs/Interfaces).
2. Escreva os **Testes**: Contrato → Integração → E2E → Unitário.
3. **Red Phase:** A implementação só deve ser escrita após os testes serem validados como falhos.

## 5. Pesquisa e Contexto
**Tarefa do Agente:** Antes de fechar o plano, valide compatibilidade de libs, performance e segurança para esta funcionalidade.