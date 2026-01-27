const products = [
  {
    id: '1',
    name: 'Ahorro Fácil',
    description: 'Perfecto para principiantes. Comienza a ahorrar sin monto mínimo y disfruta tasas de interés competitivas.',
    minAmount: 0,
    interestRates: {
      3: 3.5,
      6: 4.0,
      12: 4.5,
      24: 5.0
    },
    features: [
      'Sin depósito mínimo',
      'Pago de intereses mensual',
      'Retiros gratis al finalizar el plazo',
      'Gestión en línea'
    ],
    category: 'basic'
  },
  {
    id: '2',
    name: 'Ahorro Plus',
    description: 'Para ahorradores serios. Tasas de interés más altas con requisito de depósito mínimo.',
    minAmount: 1000000,
    interestRates: {
      3: 4.5,
      6: 5.0,
      12: 5.5,
      24: 6.0
    },
    features: [
      'Tasas de interés más altas',
      'Soporte al cliente prioritario',
      'Bonificación trimestral de intereses',
      'Promociones exclusivas'
    ],
    category: 'premium'
  },
  {
    id: '3',
    name: 'Ahorro Premium',
    description: 'Nuestras mejores tasas para depósitos de alto valor. Máximos rendimientos para tus ahorros.',
    minAmount: 10000000,
    interestRates: {
      3: 5.5,
      6: 6.0,
      12: 6.5,
      24: 7.0
    },
    features: [
      'Mejores tasas de interés',
      'Asesor de cuenta dedicado',
      'Opciones de plazo flexibles',
      'Cobertura de seguro incluida'
    ],
    category: 'vip'
  },
  {
    id: '4',
    name: 'Ahorro Joven',
    description: 'Diseñado para jóvenes ahorradores entre 18-25 años. Construye tu futuro financiero desde temprano.',
    minAmount: 50000,
    interestRates: {
      3: 4.0,
      6: 4.5,
      12: 5.0,
      24: 5.5
    },
    features: [
      'Tasas especiales para jóvenes',
      'Recursos de educación financiera',
      'Herramientas de seguimiento de metas',
      'Experiencia móvil prioritaria'
    ],
    category: 'youth'
  }
];

module.exports = products;
