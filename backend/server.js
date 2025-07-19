const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar banco de dados
const db = new sqlite3.Database(':memory:');

// Criar tabela de produtos
db.run(`
  CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    sku TEXT UNIQUE NOT NULL
  )
`);

// Função para encontrar primeira letra ausente
function findMissingLetter(name) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const nameLetters = new Set(name.toLowerCase().match(/[a-z]/g) || []);
  
  for (let letter of alphabet) {
    if (!nameLetters.has(letter)) {
      return letter;
    }
  }
  return '_'; // Todas as letras estão presentes
}

// Função para formatar produto com letra ausente
function formatProduct(product) {
  return {
    ...product,
    missingLetter: findMissingLetter(product.name)
  };
}

// Validação de dados
function validateProduct(name, price, sku) {
  const errors = [];
  
  if (!name || name.trim() === '') {
    errors.push('Nome é obrigatório');
  }
  
  if (!price || price <= 0) {
    errors.push('Preço deve ser maior que zero');
  }
  
  if (!sku || sku.trim() === '') {
    errors.push('SKU é obrigatório');
  }
  
  return errors;
}

// Rotas

// POST /products - Cadastrar produto
app.post('/products', (req, res) => {
  const { name, price, sku } = req.body;
  
  const errors = validateProduct(name, price, sku);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  const stmt = db.prepare('INSERT INTO products (name, price, sku) VALUES (?, ?, ?)');
  stmt.run([name.trim(), price, sku.trim()], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ errors: ['SKU já existe'] });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    res.status(201).json({ 
      id: this.lastID, 
      name: name.trim(), 
      price, 
      sku: sku.trim(),
      missingLetter: findMissingLetter(name.trim())
    });
  });
});

// GET /products - Listar produtos ordenados por nome
app.get('/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY name ASC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    const products = rows.map(formatProduct);
    res.json(products);
  });
});

// GET /products/:id - Obter produto específico
app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json(formatProduct(row));
  });
});

// PUT /products/:id - Atualizar produto
app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, sku } = req.body;
  
  const errors = validateProduct(name, price, sku);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  const stmt = db.prepare('UPDATE products SET name = ?, price = ?, sku = ? WHERE id = ?');
  stmt.run([name.trim(), price, sku.trim(), id], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ errors: ['SKU já existe'] });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json({ 
      id: parseInt(id), 
      name: name.trim(), 
      price, 
      sku: sku.trim(),
      missingLetter: findMissingLetter(name.trim())
    });
  });
});

// DELETE /products/:id - Remover produto
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  
  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  stmt.run([id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.status(204).send();
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});