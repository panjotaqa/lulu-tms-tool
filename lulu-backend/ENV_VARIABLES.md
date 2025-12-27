# Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto `lulu-backend` com as seguintes variáveis:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=lulu_db

# Application Configuration
PORT=3000
NODE_ENV=development

# Debug Configuration
DEBUG_LOG=false

# CORS Configuration
FRONTEND_URL=http://localhost:3001
```

## Descrição das Variáveis

- `DATABASE_HOST`: Host do banco de dados PostgreSQL
- `DATABASE_PORT`: Porta do banco de dados PostgreSQL (padrão: 5432)
- `DATABASE_USERNAME`: Usuário do banco de dados
- `DATABASE_PASSWORD`: Senha do banco de dados
- `DATABASE_NAME`: Nome do banco de dados
- `PORT`: Porta em que a aplicação irá rodar (padrão: 3000)
- `NODE_ENV`: Ambiente de execução (development, production, test)
- `DEBUG_LOG`: Habilita logs de debug detalhados (true/false, padrão: false)
- `FRONTEND_URL`: URL do frontend para configuração de CORS (padrão: http://localhost:3001)

