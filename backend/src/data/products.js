const products = [
  {
    id: '1',
    name: 'Ahorro Fácil',
    description: 'Perfect for beginners. Start saving with no minimum amount and enjoy competitive interest rates.',
    minAmount: 0,
    interestRates: {
      3: 3.5,
      6: 4.0,
      12: 4.5,
      24: 5.0
    },
    features: [
      'No minimum deposit',
      'Monthly interest payments',
      'Free withdrawals after term',
      'Online management'
    ],
    category: 'basic'
  },
  {
    id: '2',
    name: 'Ahorro Plus',
    description: 'For serious savers. Higher interest rates with a minimum deposit requirement.',
    minAmount: 1000000,
    interestRates: {
      3: 4.5,
      6: 5.0,
      12: 5.5,
      24: 6.0
    },
    features: [
      'Higher interest rates',
      'Priority customer support',
      'Quarterly bonus interest',
      'Exclusive promotions'
    ],
    category: 'premium'
  },
  {
    id: '3',
    name: 'Ahorro Premium',
    description: 'Our best rates for high-value deposits. Maximum returns for your savings.',
    minAmount: 10000000,
    interestRates: {
      3: 5.5,
      6: 6.0,
      12: 6.5,
      24: 7.0
    },
    features: [
      'Best interest rates',
      'Dedicated account manager',
      'Flexible term options',
      'Insurance coverage included'
    ],
    category: 'vip'
  },
  {
    id: '4',
    name: 'Ahorro Joven',
    description: 'Designed for young savers between 18-25 years old. Build your financial future early.',
    minAmount: 50000,
    interestRates: {
      3: 4.0,
      6: 4.5,
      12: 5.0,
      24: 5.5
    },
    features: [
      'Special youth rates',
      'Financial education resources',
      'Goal tracking tools',
      'Mobile-first experience'
    ],
    category: 'youth'
  }
];

module.exports = products;
