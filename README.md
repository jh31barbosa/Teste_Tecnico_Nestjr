# Sistema de Gerenciamento de Produtos

Este projeto implementa um sistema completo de CRUD para produtos, com backend em Node.js/Express e frontend em React.

## Funcionalidades

### Backend (API)
- ✅ **POST /products** - Cadastrar produto
- ✅ **GET /products** - Listar produtos ordenados por nome
- ✅ **GET /products/:id** - Obter produto específico
- ✅ **PUT /products/:id** - Atualizar produto
- ✅ **DELETE /products/:id** - Remover produto
- ✅ Validação de dados (nome obrigatório, preço > 0, SKU único)
- ✅ Cálculo da primeira letra ausente no nome
- ✅ Banco de dados SQLite
- ✅ Tratamento de erros

### Frontend (React)
- ✅ Formulário de criação de produtos
- ✅ Lista de produtos ordenada por nome
- ✅ Remoção de produtos da lista
- ✅ Exibição da primeira letra ausente
- ✅ Validação de formulário
- ✅ Interface responsiva

## Tecnologias Utilizadas

### Backend
- Node.js
- Express.js 4.18.2
- SQLite3 5.1.6
- CORS 2.8.5

### Frontend
- React 18.2.0
- Axios 1.6.2
- CSS3

## Como Executar

### 1. Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Execute o servidor
npm run dev
# ou
npm start
```

O servidor estará rodando em `http://localhost:3001`

### 2. Frontend

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Execute a aplicação
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
projeto/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.js
│   │   └── App.css
│   └── public/
└── README.md
```

## API Endpoints

### POST /products
Cadastra um novo produto.

**Body:**
```json
{
  "name": "Produto Exemplo",
  "price": 29.99,
  "sku": "PRD001"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "Produto Exemplo",
  "price": 29.99,
  "sku": "PRD001",
  "missingLetter": "a"
}
```

### GET /products
Lista todos os produtos ordenados por nome.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Produto A",
    "price": 29.99,
    "sku": "PRD001",
    "missingLetter": "b"
  }
]
```

### GET /products/:id
Obtém um produto específico.

### PUT /products/:id
Atualiza um produto existente.

### DELETE /products/:id
Remove um produto.

## Algoritmo da Letra Ausente

O sistema calcula a primeira letra do alfabeto (a-z) que não está presente no nome do produto:

- Se o nome contém todas as letras a-z, retorna "_"
- Considera apenas letras minúsculas
- Ignora caracteres especiais, números e espaços

**Exemplos:**
- "Produto" → "a" (primeira letra ausente)
- "abcdefghijklmnopqrstuvwxyz" → "_" (todas presentes)
- "Notebook" → "a" (primeira letra ausente)

## Validações

### Backend
- Nome: obrigatório e não vazio
- Preço: obrigatório e maior que zero
- SKU: obrigatório, não vazio e único

### Frontend
- Validação em tempo real
- Mensagens de erro claras
- Prevenção de envio com dados inválidos

## Características Técnicas

- **Banco de dados**: SQLite em memória (dados são perdidos ao reiniciar)
- **CORS**: Configurado para desenvolvimento
- **Responsivo**: Interface adaptável para mobile
- **Estados de loading**: Feedback visual durante operações
- **Tratamento de erros**: Tanto no frontend quanto backend