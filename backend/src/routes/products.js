const express = require('express');
const products = require('../data/products');

const router = express.Router();

router.get('/', (req, res) => {
  const { category } = req.query;
  
  let filteredProducts = products;
  
  if (category) {
    filteredProducts = products.filter(p => p.category === category);
  }

  const productList = filteredProducts.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    minAmount: p.minAmount,
    maxRate: Math.max(...Object.values(p.interestRates)),
    category: p.category
  }));

  res.json({ products: productList });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json({ product });
});

module.exports = router;
