### Contexto

Como usuário 
Eu quero acessar minhas pastas
Para poder criar, editar, excluir e visualizar meus casos de teste

### pré requisitos

1. um caso de teste possui vínculo com uma pasta e uma pasta pode ter vários casos de teste.

### Campos importantes
1. o único campo obrigatório é title

Title: título do caso de teste. (obrigatório)

Test Suite: Seleção (ou ID de referência para uma suíte pai). (obrigtório)

Severity: Seleção (Blocker, Critical, Major, Minor, Trivial). (opcional = Trivial é campo default)

Status: Seleção (Draft, Ready, Review, Deprecated, Active). (opcional = Active é campo default)

Priority: Seleção (High, Medium, Low). (opcional = Medium é campo default)

Type: Seleção (Functional, Security, Performance, Usability).  (opcional = functional é campo default)

Is Flaky: Booleano (Yes, No). (opcional = No é campo default)

Milestone: Seleção ou Texto (ex: v1.0, Sprint 45, Release 2024.1). (opcional = campo pode ser vazio)

User Story Link: String com o link da US (opcional = campo pode ser vazio)

Tags: Lista de strings (ex: UI, API, Checkout, Hotfix). (opcional = campo pode ser vazio, as Tags vão ser uma tabela, pois é uma relação de muitos para muitos, a mesma tag pode estar em vários casos de testes, quando uma tag não existir, ela deve ser criada)

Layer: Seleção (E2E, API, Unit). (opcional = E2E é campo default)

Environment: Seleção (Integration, Location) (opcional = Integration é default)

Automation Status: Seleção (Manual, Automated). (opcional = Manual é default)

To be Automated: Booleano (Yes, No). (opcional = No é default)

Description: Texto rico (Markdown aceita imagens que serão carregadas em attachments). (opcional = pode ficar vazio)

Pre-conditions: Texto rico (Markdown aceita imagens que serão carregadas em attachments). (opcional = pode ficar vazio)

Steps: Lista de String, será baseado em BDD Gherkin (opcional = pode ficar vazio)

Attachments: Arquivos no geral (opcional = pode ficar vazio)

### CRUD de casos de teste.
1. Criar caso de teste com sucesso
2. Editar caso de teste com sucesso
3. visualizar caso de teste com sucesso
4. Deletar caso de teste com sucesso
5. Tentar Criar ou editar com dados inválidos
6. Tentar deletar com id inválido