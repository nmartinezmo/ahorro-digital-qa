const express = require('express');
const products = require('../data/products');

const router = express.Router();

router.post('/calculate', (req, res) => {
  try {
    const { amount, term, productId } = req.body;

    if (amount === undefined || amount === null || amount === '') {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) {
      return res.status(400).json({ error: 'Amount must be a valid number' });
    }

    if (numericAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    if (numericAmount < 0) {
      return res.status(400).json({ error: 'Amount cannot be negative' });
    }

    const validTerms = [3, 6, 12, 24];
    if (!term || !validTerms.includes(Number(term))) {
      return res.status(400).json({ error: 'Term must be 3, 6, 12, or 24 months' });
    }

    let selectedProduct;
    if (productId) {
      selectedProduct = products.find(p => p.id === productId);
      if (!selectedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
    } else {
      selectedProduct = products
        .filter(p => numericAmount >= p.minAmount)
        .sort((a, b) => b.interestRates[term] - a.interestRates[term])[0];

      if (!selectedProduct) {
        selectedProduct = products[0];
      }
    }

    if (numericAmount < selectedProduct.minAmount) {
      return res.status(400).json({ 
        error: `Minimum amount for ${selectedProduct.name} is ${selectedProduct.minAmount}` 
      });
    }

    const annualRate = selectedProduct.interestRates[term];
    const monthlyRate = annualRate / 100 / 12;
    const months = Number(term);
    
    const interest = numericAmount * monthlyRate * months;
    const finalAmount = numericAmount + interest;

    res.json({
      simulation: {
        initialAmount: numericAmount,
        term: months,
        termLabel: `${months} months`,
        annualRate: annualRate,
        monthlyRate: (monthlyRate * 100).toFixed(4),
        interest: Math.round(interest * 100) / 100,
        finalAmount: Math.round(finalAmount * 100) / 100,
        product: {
          id: selectedProduct.id,
          name: selectedProduct.name
        }
      }
    });
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ error: 'Simulation failed' });
  }
});

router.get('/terms', (req, res) => {
  res.json({
    terms: [
      { value: 3, label: '3 months' },
      { value: 6, label: '6 months' },
      { value: 12, label: '12 months' },
      { value: 24, label: '24 months' }
    ]
  });
});

module.exports = router;
