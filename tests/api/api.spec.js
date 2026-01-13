import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3001/api';

test.describe('API Tests', () => {
  let authToken;

  test.describe('Authentication API', () => {
    
    test('POST /auth/login - successful login', async ({ request }) => {
      const response = await request.post(`${API_URL}/auth/login`, {
        data: {
          email: 'test@example.com',
          password: 'Password123!'
        }
      });
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('token');
      expect(data).toHaveProperty('user');
      expect(data.user.email).toBe('test@example.com');
      
      authToken = data.token;
    });

    test('POST /auth/login - invalid credentials (401)', async ({ request }) => {
      const response = await request.post(`${API_URL}/auth/login`, {
        data: {
          email: 'wrong@example.com',
          password: 'WrongPassword!'
        }
      });
      
      expect(response.status()).toBe(401);
      
      const data = await response.json();
      expect(data.error).toBe('Invalid credentials');
    });

    test('POST /auth/login - missing fields (400)', async ({ request }) => {
      const response = await request.post(`${API_URL}/auth/login`, {
        data: {
          email: 'test@example.com'
        }
      });
      
      expect(response.status()).toBe(400);
    });

    test('POST /auth/register - successful registration', async ({ request }) => {
      const uniqueEmail = `newuser${Date.now()}@example.com`;
      
      const response = await request.post(`${API_URL}/auth/register`, {
        data: {
          name: 'New User',
          email: uniqueEmail,
          password: 'Password123!'
        }
      });
      
      expect(response.status()).toBe(201);
      
      const data = await response.json();
      expect(data.message).toBe('User registered successfully');
      expect(data.user.email).toBe(uniqueEmail);
    });

    test('POST /auth/register - duplicate email (409)', async ({ request }) => {
      const response = await request.post(`${API_URL}/auth/register`, {
        data: {
          name: 'Duplicate User',
          email: 'test@example.com',
          password: 'Password123!'
        }
      });
      
      expect(response.status()).toBe(409);
      
      const data = await response.json();
      expect(data.error).toBe('Email already registered');
    });

    test('POST /auth/register - invalid email format (400)', async ({ request }) => {
      const response = await request.post(`${API_URL}/auth/register`, {
        data: {
          name: 'Test User',
          email: 'invalid-email',
          password: 'Password123!'
        }
      });
      
      expect(response.status()).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Invalid email format');
    });

    test('POST /auth/register - weak password (400)', async ({ request }) => {
      const response = await request.post(`${API_URL}/auth/register`, {
        data: {
          name: 'Test User',
          email: 'weak@example.com',
          password: '123'
        }
      });
      
      expect(response.status()).toBe(400);
    });
  });

  test.describe('Products API', () => {
    
    test.beforeAll(async ({ request }) => {
      const response = await request.post(`${API_URL}/auth/login`, {
        data: {
          email: 'test@example.com',
          password: 'Password123!'
        }
      });
      const data = await response.json();
      authToken = data.token;
    });

    test('GET /products - unauthorized (401)', async ({ request }) => {
      const response = await request.get(`${API_URL}/products`);
      expect(response.status()).toBe(401);
    });

    test('GET /products - successful with auth', async ({ request }) => {
      const response = await request.get(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('products');
      expect(Array.isArray(data.products)).toBe(true);
      expect(data.products.length).toBeGreaterThan(0);
    });

    test('GET /products/:id - product not found (404)', async ({ request }) => {
      const response = await request.get(`${API_URL}/products/999`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      expect(response.status()).toBe(404);
    });

    test('GET /products/:id - successful', async ({ request }) => {
      const response = await request.get(`${API_URL}/products/1`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.product).toHaveProperty('name');
      expect(data.product).toHaveProperty('interestRates');
    });
  });

  test.describe('Simulator API', () => {
    
    test.beforeAll(async ({ request }) => {
      const response = await request.post(`${API_URL}/auth/login`, {
        data: {
          email: 'test@example.com',
          password: 'Password123!'
        }
      });
      const data = await response.json();
      authToken = data.token;
    });

    test('POST /simulator/calculate - successful calculation', async ({ request }) => {
      const response = await request.post(`${API_URL}/simulator/calculate`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        data: {
          amount: 1000000,
          term: 12
        }
      });
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.simulation).toHaveProperty('initialAmount', 1000000);
      expect(data.simulation).toHaveProperty('term', 12);
      expect(data.simulation).toHaveProperty('interest');
      expect(data.simulation).toHaveProperty('finalAmount');
      expect(data.simulation.finalAmount).toBeGreaterThan(data.simulation.initialAmount);
    });

    test('POST /simulator/calculate - zero amount (400)', async ({ request }) => {
      const response = await request.post(`${API_URL}/simulator/calculate`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        data: {
          amount: 0,
          term: 12
        }
      });
      
      expect(response.status()).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Amount must be greater than 0');
    });

    test('POST /simulator/calculate - invalid term (400)', async ({ request }) => {
      const response = await request.post(`${API_URL}/simulator/calculate`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        data: {
          amount: 1000000,
          term: 5
        }
      });
      
      expect(response.status()).toBe(400);
      
      const data = await response.json();
      expect(data.error).toContain('Term must be');
    });

    test('POST /simulator/calculate - unauthorized (401)', async ({ request }) => {
      const response = await request.post(`${API_URL}/simulator/calculate`, {
        data: {
          amount: 1000000,
          term: 12
        }
      });
      
      expect(response.status()).toBe(401);
    });
  });
});
