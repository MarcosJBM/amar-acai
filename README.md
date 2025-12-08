# Amar Açaí - Sistema de Gestão de Pedidos

Sistema completo de gestão de pedidos para a loja [Amar Açaí](https://www.instagram.com/amaracai.itapema/?hl=en), com dashboard de vendas e controle de pedidos.

Aplicação desenvolvida como **projeto de extensão** da máteria Programação Web do curso de Ciência da Computação na Univali.

🔗 **Deploy:** https://amar-acai-web.onrender.com/

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 24 ou superior) - [Download](https://nodejs.org/)
- **pnpm** (gerenciador de pacotes) - [Instalação](https://pnpm.io/installation)
- **Docker** e **Docker Compose** - [Download](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download](https://git-scm.com/)

### Verificando instalações

```bash
node --version  # deve retornar v24.x.x ou superior
pnpm --version  # deve retornar 10.x.x ou superior
docker --version
docker-compose --version
```

## 🚀 Configurando o Projeto

### 1. Clonando o Repositório

```bash
git clone https://github.com/MarcosJBM/amar-acai
cd amar-acai
```

### 2. Configurando o Banco de Dados

Inicie o container do PostgreSQL:

```bash
docker-compose up -d
```

Verifique se o container está rodando:

```bash
docker ps
```

Você deve ver um container chamado `amar-acai` em execução.

### 3. Configurando a API

Abra um **novo terminal** e navegue para a pasta api:

```bash
cd api
```

#### 3.1. Configurando variáveis de ambiente

Crie um arquivo `.env` na pasta `api`:

```bash
touch .env
```

Adicione as seguintes variáveis no arquivo `.env`:

```env
NODE_ENV=development
PORT=3333
DATABASE_URL=postgresql://amar:acai123@localhost:5432/amar_acai
JWT_SECRET=sua-chave-secreta-muito-segura-com-pelo-menos-32-caracteres
```

> ⚠️ **Importante:** O `JWT_SECRET` deve ter no mínimo 32 caracteres.

#### 3.2. Instalando dependências

```bash
pnpm install
```

#### 3.3. Executando migrations do banco de dados

```bash
pnpm migrate:deploy
```

#### 3.4. Iniciando o servidor

```bash
pnpm start:dev
```

A API estará rodando em: **http://localhost:3333**

### 4. Configurando o Frontend

Abra um **novo terminal** e navegue para a pasta web:

```bash
cd web
```

#### 4.1. Configurando variáveis de ambiente

Crie um arquivo `.env` na pasta `web`:

```bash
touch .env
```

Adicione a seguinte variável no arquivo `.env`:

```env
VITE_API_URL=http://localhost:3333
```

#### 4.2. Instalando às dependências

```bash
pnpm install
```

#### 4.3. Iniciando o servidor

```bash
pnpm dev
```

O frontend estará rodando em: **http://localhost:3000**

## 🎯 Testando a Aplicação

### 1. Criando um usuário

Você pode criar um usuário usando uma ferramenta como **Postman** ou **cURL**:

```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "123456"
  }'
```

### 2. Fazendo login na aplicação

Acesse http://localhost:3000 e faça login com as credenciais criadas:

- **Usuário:** admin
- **Senha:** 123456

## 🛠️ Scripts Disponíveis

### API (pasta `api/`)

```bash
pnpm start:dev        # Inicia o servidor em modo desenvolvimento
pnpm build            # Compila o projeto para produção
pnpm start            # Inicia o servidor em modo produção
pnpm lint             # Verifica erros de código
pnpm lint:fix         # Corrige erros de código automaticamente
pnpm pretty           # Formata o código
```

### Web (pasta `web/`)

```bash
pnpm dev              # Inicia o servidor de desenvolvimento
pnpm build            # Compila o projeto para produção
pnpm preview          # Preview da build de produção
pnpm lint             # Verifica erros de código
pnpm lint:fix         # Corrige erros de código automaticamente
pnpm prettier         # Formata o código
```

## 👨‍💻 Tecnologias Utilizadas

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- Bcrypt para hash de senhas
- Zod para validação

### Frontend

- React
- Vite
- TypeScript
- Redux Toolkit
- React Router
- Tailwind CSS
- Recharts (gráficos)
- Radix UI (componentes)
