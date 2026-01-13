const API_URL = '/api'

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

export const api = {
  login: (email, password) => 
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  getMe: () => request('/auth/me'),

  getProducts: (category) => {
    const params = category ? `?category=${category}` : ''
    return request(`/products${params}`)
  },

  getProduct: (id) => request(`/products/${id}`),

  simulate: (amount, term, productId) =>
    request('/simulator/calculate', {
      method: 'POST',
      body: JSON.stringify({ amount, term, productId }),
    }),

  getTerms: () => request('/simulator/terms'),
}
