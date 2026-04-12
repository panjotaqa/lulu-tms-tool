---
description: 
---

# Guia de Fluxo Spec-Driven Development (SDD)

Este guia define como transformar intenções de negócio em código estável utilizando agentes de IA.

## Comandos do Workflow

| Comando | Fase | Objetivo |
| :--- | :--- | :--- |
| `/speckit.specify` | **Intenção** | Transforma uma ideia vaga em uma especificação técnica estruturada. |
| `/speckit.plan` | **Arquitetura** | Transforma a especificação em um plano de implementação (arquivos, pastas, contratos). |
| `/speckit.tasks` | **Execução** | Deriva uma lista de tarefas atômicas para o agente de codificação. |

## Ciclo de Vida da Task

1. **Inicie com a Intenção:** Execute `/speckit.specify` com a descrição do problema.
2. **Refine a Especificação:** Resolva todos os marcadores `[NEEDS CLARIFICATION]`.
3. **Gere o Plano Técnico:** Execute `/speckit.plan` para aplicar a "Constituição" ao projeto.
4. **Validação de Testes:** Garanta que os testes foram criados e falharam antes de gerar o código final.
5. **Derive as Tarefas:** Execute `/speckit.tasks` para iniciar a geração do código.

## Princípios de Ouro
- **A Especificação é a Verdade:** Se o código divergir da spec, corrija a spec primeiro, depois regenere o código.
- **Velocidade com Direção:** O tempo gasto no planejamento economiza o tempo gasto no "fix-and-redo" (conserta e refaz).