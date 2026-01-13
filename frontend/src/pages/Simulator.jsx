import { useState } from 'react'
import { api } from '../services/api'
import { Calculator, DollarSign, Calendar, TrendingUp, AlertCircle } from 'lucide-react'

export default function Simulator() {
  const [amount, setAmount] = useState('')
  const [term, setTerm] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const terms = [
    { value: 3, label: '3 months' },
    { value: 6, label: '6 months' },
    { value: 12, label: '12 months' },
    { value: 24, label: '24 months' },
  ]

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setAmount(value)
    setResult(null)
    setError('')
  }

  const isFormValid = amount && Number(amount) > 0 && term

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

    if (!amount || Number(amount) <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    if (!term) {
      setError('Please select a term')
      return
    }

    setLoading(true)

    try {
      const data = await api.simulate(Number(amount), Number(term))
      setResult(data.simulation)
    } catch (err) {
      setError(err.message || 'Simulation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Savings Simulator</h1>
        <p className="text-gray-600 mt-1">Calculate how much your savings can grow</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-primary-600" />
            Enter Your Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg" data-testid="error-message">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Deposit Amount (COP)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="amount"
                  type="text"
                  value={amount ? Number(amount).toLocaleString() : ''}
                  onChange={handleAmountChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  placeholder="1,000,000"
                  data-testid="amount-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
                Investment Term
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="term"
                  value={term}
                  onChange={(e) => { setTerm(e.target.value); setResult(null); }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg appearance-none bg-white"
                  data-testid="term-select"
                >
                  <option value="">Select term</option>
                  {terms.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
              data-testid="calculate-button"
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
            Simulation Results
          </h2>

          {result ? (
            <div className="space-y-6" data-testid="simulation-results">
              <div className="bg-primary-50 rounded-lg p-4">
                <p className="text-sm text-primary-600 font-medium">Product Selected</p>
                <p className="text-lg font-semibold text-primary-900" data-testid="product-name">
                  {result.product.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Initial Amount</p>
                  <p className="text-xl font-bold text-gray-900" data-testid="initial-amount">
                    {formatCurrency(result.initialAmount)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Term</p>
                  <p className="text-xl font-bold text-gray-900" data-testid="term-result">
                    {result.termLabel}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Annual Rate</p>
                  <p className="text-xl font-bold text-gray-900" data-testid="annual-rate">
                    {result.annualRate}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Interest Earned</p>
                  <p className="text-xl font-bold text-green-600" data-testid="interest-earned">
                    {formatCurrency(result.interest)}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6 text-center">
                <p className="text-sm text-green-600 font-medium">Final Amount</p>
                <p className="text-3xl font-bold text-green-700" data-testid="final-amount">
                  {formatCurrency(result.finalAmount)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Calculator className="w-16 h-16 mb-4" />
              <p className="text-center">Enter an amount and select a term to see your potential earnings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
