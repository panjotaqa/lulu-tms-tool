### contexto

Como usuário
Eu quero criar pastas dentro de projetos
Para que eu possa futuramente armazenar meus casos de testes dentro dessas pastas


### pre requisitos
1. Todo projeto possui uma pasta ROOT
2. Se um projeto não tiver pasta root, ao criar a primeira pasta para o projeto, deve-se criar a pasta ROOT e após isso vincular a nova pasta a pasta ROOT.
3. pense nisso como uma árvore onde temos os nós, aqui teremos a pasta ROOT e a partir dai teremos nossos nós a partir dela, os nós filhos guardam a informação da pasta pai.

### campos importantes
1. título
2. created by
3. ordem (aqui iremos salvar a ordem de visualização da pasta (será utilizada pelo front))
4. pasta pai (será utilizar para quando quisermos criar sub pastas)

### Criar pasta de casos de teste
1. Criar pasta com sucesso
    - se for a primeira pasta e o projeto não tiver uma pasta root o sistema deve criar uma pasta root e vincular o campo "pasta pai" a pasta Root.
    - A pasta root não irá ter o campo "pasta pai" preenchido
2. Tentar criar pasta com dados inválidos - Deve retornar erro

### renomear título da pasta
1. Renomear pasta com sucesso
2. Tentar renomear pasta com dados inválidos - Deve retornar Erro

### Mover pasta (alterar pasta pai e/ou ordem)
1. Mover pasta com sucesso
   - aqui o frontend irá enviar pro backend o ID da pasta a ser movida, o novo pai (opcional) e a nova ordem (opcional)
   - se não informar o novo pai, a pasta permanece no mesmo pai
   - se não informar a nova ordem, a pasta é movida para o final
   - ao mover uma pasta, o sistema deve automaticamente reorganizar a ordem das pastas irmãs
2. Tentar mover pasta com dados inválidos - Deve retornar erro
3. Tentar mover pasta para ser filha de si mesma - Deve retornar erro
4. Tentar mover pasta para ser filha de um de seus descendentes - Deve retornar erro

### Reordenar pastas irmãs
1. Reordenar pastas irmãs com sucesso
   - aqui o frontend irá enviar o ID da pasta e a nova ordem dentro do mesmo pai
   - o sistema deve automaticamente reorganizar a ordem das outras pastas irmãs
2. Tentar reordenar com dados inválidos - Deve retornar erro

