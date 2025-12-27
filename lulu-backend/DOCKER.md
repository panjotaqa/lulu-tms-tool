# Docker Setup - Lulu Backend

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto `lulu-backend` com as seguintes variáveis:

```env
# Database Configuration
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=lulu_db

# Application Configuration
PORT=3000
NODE_ENV=development
```

**Importante:** No Docker Compose, o `DATABASE_HOST` deve ser `postgres` (nome do serviço), não `localhost`.

## Desenvolvimento

### Iniciar os serviços

```bash
docker-compose up -d
```

### Ver logs

```bash
docker-compose logs -f backend
```

### Parar os serviços

```bash
docker-compose down
```

### Parar e remover volumes (apaga dados do banco)

```bash
docker-compose down -v
```

### Rebuild da imagem

```bash
docker-compose build --no-cache
docker-compose up -d
```

## Produção

### Iniciar os serviços

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Ver logs

```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Parar os serviços

```bash
docker-compose -f docker-compose.prod.yml down
```

### Rebuild da imagem

```bash
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## Estrutura

- **Dockerfile**: Imagem para desenvolvimento (hot reload)
- **Dockerfile.prod**: Imagem otimizada para produção (multi-stage build)
- **docker-compose.yml**: Configuração para desenvolvimento
- **docker-compose.prod.yml**: Configuração para produção

## Volumes

### Desenvolvimento
- `./src` → `/app/src` (hot reload)
- `./node_modules` → `/app/node_modules` (cache)
- `postgres_data` → dados do PostgreSQL

### Produção
- `postgres_data_prod` → dados do PostgreSQL
- Código compilado dentro da imagem

## Acessos

- **Backend API**: http://localhost:3000
- **Swagger UI**: http://localhost:3000/api
- **PostgreSQL**: localhost:5432

## Troubleshooting

### Limpar tudo e começar do zero

```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

### Verificar se os containers estão rodando

```bash
docker-compose ps
```

### Entrar no container do backend

```bash
docker-compose exec backend sh
```

### Entrar no PostgreSQL

```bash
docker-compose exec postgres psql -U postgres -d lulu_db
```

