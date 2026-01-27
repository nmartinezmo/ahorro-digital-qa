import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { Package, TrendingUp, DollarSign, X, Loader2 } from 'lucide-react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productDetails, setProductDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await api.getProducts()
      setProducts(data.products)
    } catch (err) {
      setError(err.message || 'Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const openProductDetails = async (productId) => {
    setSelectedProduct(productId)
    setDetailsLoading(true)
    try {
      const data = await api.getProduct(productId)
      setProductDetails(data.product)
    } catch (err) {
      setError(err.message || 'Error al cargar detalles del producto')
    } finally {
      setDetailsLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedProduct(null)
    setProductDetails(null)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getCategoryBadge = (category) => {
    const colors = {
      basic: 'bg-gray-100 text-gray-700',
      premium: 'bg-blue-100 text-blue-700',
      vip: 'bg-purple-100 text-purple-700',
      youth: 'bg-green-100 text-green-700',
    }
    return colors[category] || colors.basic
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Productos de Ahorro</h1>
        <p className="text-gray-600 mt-1">Elige el mejor producto para tus metas de ahorro</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="products-list">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => openProductDetails(product.id)}
            data-testid={`product-card-${product.id}`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadge(product.category)}`}>
                    {product.category.toUpperCase()}
                  </span>
                </div>
                <Package className="w-8 h-8 text-primary-600" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>Mín: {formatCurrency(product.minAmount)}</span>
                </div>
                <div className="flex items-center text-sm font-medium text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>Hasta {product.maxRate}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-testid="product-modal">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Detalles del Producto</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  data-testid="close-modal-button"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {detailsLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
              ) : productDetails ? (
                <div className="space-y-6" data-testid="product-details">
                  <div>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadge(productDetails.category)}`}>
                      {productDetails.category.toUpperCase()}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2" data-testid="detail-product-name">
                      {productDetails.name}
                    </h3>
                    <p className="text-gray-600 mt-2">{productDetails.description}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Depósito Mínimo</h4>
                    <p className="text-2xl font-bold text-primary-600">
                      {formatCurrency(productDetails.minAmount)}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Tasas de Interés por Plazo</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(productDetails.interestRates).map(([term, rate]) => (
                        <div key={term} className="bg-green-50 rounded-lg p-3 text-center">
                          <p className="text-sm text-green-600">{term} meses</p>
                          <p className="text-xl font-bold text-green-700">{rate}%</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Características</h4>
                    <ul className="space-y-2">
                      {productDetails.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => { closeModal(); window.location.href = '/simulator'; }}
                    className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    data-testid="simulate-button"
                  >
                    Simular con este Producto
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
