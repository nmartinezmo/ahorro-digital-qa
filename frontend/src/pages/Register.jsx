import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return regex.test(password)
  }

  const getPasswordErrors = () => {
    const errors = []
    if (password.length < 8) errors.push('Mínimo 8 caracteres')
    if (!/[a-z]/.test(password)) errors.push('Una letra minúscula')
    if (!/[A-Z]/.test(password)) errors.push('Una letra mayúscula')
    if (!/\d/.test(password)) errors.push('Un número')
    if (!/[@$!%*?&]/.test(password)) errors.push('Un carácter especial (@$!%*?&)')
    return errors
  }

  const isFormValid = 
    name.trim() && 
    validateEmail(email) && 
    validatePassword(password) && 
    password === confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim()) {
      setError('El nombre es requerido')
      return
    }

    if (!validateEmail(email)) {
      setError('Por favor ingresa un correo electrónico válido')
      return
    }

    if (!validatePassword(password)) {
      setError('La contraseña no cumple los requisitos')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      await register(name, email, password)
      setSuccess('¡Registro exitoso! Redirigiendo al inicio de sesión...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Error en el registro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
          <p className="text-gray-600 mt-2">Comienza a ahorrar con Ahorro Digital</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg" data-testid="error-message">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg" data-testid="success-message">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-sm text-green-700">{success}</span>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ingresa tu nombre completo"
                data-testid="name-input"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  email && !validateEmail(email) ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ingresa tu correo electrónico"
                data-testid="email-input"
                required
              />
            </div>
            {email && !validateEmail(email) && (
              <p className="mt-1 text-sm text-red-600" data-testid="email-error">Por favor ingresa un correo válido</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  password && !validatePassword(password) ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Crea una contraseña"
                data-testid="password-input"
                required
              />
            </div>
            {password && getPasswordErrors().length > 0 && (
              <div className="mt-2 text-sm text-gray-600" data-testid="password-requirements">
                <p className="font-medium">La contraseña necesita:</p>
                <ul className="list-disc list-inside">
                  {getPasswordErrors().map((err, i) => (
                    <li key={i} className="text-red-600">{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  confirmPassword && password !== confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirma tu contraseña"
                data-testid="confirm-password-input"
                required
              />
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-sm text-red-600" data-testid="password-match-error">Las contraseñas no coinciden</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full py-2 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            data-testid="register-button"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
