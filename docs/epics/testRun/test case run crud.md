Contexto
A funcionalidade de Criação de Test Run (Execução de Teste) é o mecanismo que permite ao usuário planejar e iniciar uma rodada de testes específica. Ela atua como um "container" que agrupa metadados (quem, onde, quando) e uma seleção filtrada de casos de teste oriundos do repositório para serem validados em um ciclo de entrega.

Pré-requisitos
O usuário deve possuir permissão de escrita/gerenciamento de execuções no projeto.

Deve existir pelo menos uma Suíte de Teste com casos de teste cadastrados no Repository.

Ambientes (Environments) e Marcos (Milestones) devem estar previamente configurados se o usuário desejar utilizá-los como filtros.

Campos Importantes
1. Cabeçalho (Metadados)
Description: Campo de texto (Input).

Frontend: Placeholder informativo, validação de caracteres especiais.

Backend: Armazenamento em String/Text no banco de dados.

Environment / Milestone: Dropdowns de seleção única.

Frontend: Carregamento dinâmico via API.

Backend: Chaves estrangeiras (FK) vinculando a execução a essas entidades.

Default Assignee: Busca de usuários do projeto.

Frontend: Componente de busca/autocomplete.

Backend: Atribui o user_id como executor padrão para todos os casos daquela run.

2. Configurações (Configurations)
Operating System: Dropdown para definição de matriz de teste.

Business Rule: Permite que o mesmo caso de teste seja executado em diferentes contextos de infraestrutura dentro da mesma Run.

3. Seleção de Casos (O Modal "Select Test Cases")
Tree View (Lado Esquerdo):

Frontend: Renderiza as pastas (Suítes). Não permite reordenação manual (ordem fixa).

Comportamento: Ao clicar, dispara um evento de onSelect que filtra a lista da direita.

Case List (Painel Central):

Frontend: Exibe ID (DEMO-X), Título e Status de Atribuição.

Checkbox: Permite seleção unitária ou em massa (Select All).

Counters:

Frontend: Badge dinâmico indicando X selecionados / Total.

Critérios de Aceitação
Frontend (Interface e UX)
Navegação de Pastas: Ao clicar em uma pasta na árvore lateral, a lista de casos de teste à direita deve ser atualizada instantaneamente sem recarregar a página.

Imobilidade de Ordem: As pastas de suítes não devem permitir "drag and drop" no modal de seleção, servindo estritamente para visualização e filtro.

Estado dos Checkboxes:

Se o usuário selecionar a checkbox "Select All" de uma pasta, todos os casos contidos nela devem ser marcados.

O estado de seleção deve ser mantido na memória enquanto o modal estiver aberto, mesmo que o usuário navegue entre diferentes pastas.

Botão "Start Run": Deve permanecer desabilitado (disabled) até que o campo "Description" esteja preenchido e pelo menos 1 caso de teste tenha sido selecionado via modal.

Modal de Seleção: Deve exibir o total acumulado de casos selecionados no rodapé ou cabeçalho do modal antes de clicar em "Done".

Backend (Regras de Negócio e API)
Persistência da Run: Ao salvar (Start Run), o sistema deve criar um novo registro na tabela test_runs e gerar registros na tabela pivot test_run_cases para cada caso selecionado.

Herança de Atribuição: Se um "Default Assignee" for definido, o backend deve preencher automaticamente o campo assigned_to de cada caso de teste dentro da Run, a menos que uma atribuição individual tenha sido feita no modal.

Snapshot dos Casos: (Regra Crítica) O sistema deve criar um "snapshot" da versão atual do caso de teste no repositório. Alterações posteriores no repositório não devem afetar a descrição do caso dentro de uma Run que já foi iniciada.

Integridade Referencial: O backend deve impedir a exclusão de uma Suíte de Teste se houver uma Test Run ativa dependendo dos casos de teste contidos nela (ou tratar como "soft delete").

Performance de Consulta: A query que popula o modal de seleção deve ser otimizada para carregar apenas os metadados necessários (ID e Título) para evitar lentidão em repositórios com milhares de casos.