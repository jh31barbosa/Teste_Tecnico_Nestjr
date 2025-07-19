import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:3001';

function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    sku: ''
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar produtos ao inicializar
  useEffect(() => {
    fetchProducts();
  }, []);

  // Buscar produtos da API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  // Manipular mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validar formulário
  const validateForm = () => {
    const validationErrors = [];
    
    if (!formData.name.trim()) {
      validationErrors.push('Nome é obrigatório');
    }
    
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      validationErrors.push('Preço deve ser maior que zero');
    }
    
    if (!formData.sku.trim()) {
      validationErrors.push('SKU é obrigatório');
    }
    
    return validationErrors;
  };

  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors([]);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        sku: formData.sku.trim()
      });
      
      // Adicionar produto à lista e ordenar
      setProducts(prev => {
        const newProducts = [...prev, response.data];
        return newProducts.sort((a, b) => a.name.localeCompare(b.name));
      });
      
      // Limpar formulário
      setFormData({ name: '', price: '', sku: '' });
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors(['Erro ao adicionar produto']);
      }
    } finally {
      setLoading(false);
    }
  };

  // Remover produto
  const handleRemoveProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      alert('Erro ao remover produto');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Gerenciamento de Produtos</h1>
        
        {/* Formulário */}
        <div className="form-section">
          <h2>Adicionar Produto</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Preço:</label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="sku">SKU:</label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Adicionando...' : 'Adicionar Produto'}
            </button>
          </form>
          
          {/* Exibir erros */}
          {errors.length > 0 && (
            <div className="errors">
              {errors.map((error, index) => (
                <p key={index} className="error">{error}</p>
              ))}
            </div>
          )}
        </div>
        
        {/* Lista de produtos */}
        <div className="products-section">
          <h2>Produtos ({products.length})</h2>
          {products.length === 0 ? (
            <p>Nenhum produto cadastrado</p>
          ) : (
            <div className="products-list">
              {products.map(product => (
                <div key={product.id} className="product-item">
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p><strong>Preço:</strong> R$ {product.price.toFixed(2)}</p>
                    <p><strong>SKU:</strong> {product.sku}</p>
                    <p><strong>Primeira letra ausente:</strong> {product.missingLetter}</p>
                  </div>
                  <button 
                    onClick={() => handleRemoveProduct(product.id)}
                    className="remove-btn"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;