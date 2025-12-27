### Contexto

Como usuário
Eu quero poder criar, visualizar, arquivar, editar projetos, vincular usuários
Para poder gerencia-los

### informações importantes
1. Titulo
2. SLUG
3. Descrição
4. IS ARCHIVED
5. usuário (relação muitos para muitos, um projeto pode ter vários usuários e um usuário pode ter vários projetos)

### Pré requisitos
1. para os testes do Bruno, deve-se fazer um pré script criando uma conta, realizando login e reautilizando o token.
2. Todas as rotas são privadas e precisam obrigatoriamente de autenticação
3. o Projeto precisa ter vinculo com o criador do mesmo.

### Cadastrar projeto
1. Cadastrar projeto com sucesso (deve cadastrar as informações e criar vinculo com o usuário que criou o projeto)
2. Tentar cadastrar projeto com nome já existente - Deve retornar Erro
3. Tentar cadastrar projeto com SLUG já existente - Deve retornar Erro
4. Tentar cadastrar projeto com dados inválidos - Deve retornar Erro

### Editar projeto
1. Editar projeto com sucesso
2. Tentar cadastrar projeto com nome já existente - Deve retornar Erro
3. Tentar cadastrar projeto com SLUG já existente - Deve retornar Erro
4. Tentar cadastrar projeto com dados inválidos - Deve retornar Erro

### Visualizar projeto com IS ARCHIVED = False
1. Visualizar projeto com paginação, mínimo de 10 itens por página

### Visualizar projeto com IS ARCHIVED = True
1. Visualizar projeto com paginação, mínimo de 10 itens por página

### arquivar projeto
1. Atualizar campo para true IS ARCHIVED

### desarquivar projeto
1. Atualizar campo para false IS ARCHIVED

### Vincular usuários
1. Vincular um usuário com sucesso
2. Tentar vincular um usuário com ID inexistente - Deve retornar erro
3. Tentar vincular um usuário já vinculado no projeto - Deve retornar erro


### Desvincular usuário
1. Desvincular um usuário com sucesso
2. Tentar desvincular um usuário com ID inexistente - Deve retornar erro
3. Tentar desvincular um usuário sem vínculo com projeto - Deve retornar erro