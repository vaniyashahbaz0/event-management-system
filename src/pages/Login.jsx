import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import FormInput from '../components/FormInput'
import { clearError, login } from '../features/auth/authSlice'
import { validateLogin } from '../utils/validation'

export default function Login() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { user, error } = useSelector((state) => state.auth)
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  if (user) {
    const from = location.state?.from?.pathname || '/events'
    return <Navigate to={from} replace />
  }

  const handleChange = (e) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validateLogin(values)
    setErrors(found)
    if (Object.keys(found).length === 0) {
      dispatch(login(values))
    }
  }

  return (
    <div className="card">
      <h1>Login</h1>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <FormInput id="email" label="Email" type="email" value={values.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <FormInput id="password" label="Password" type="password" value={values.password} onChange={handleChange} error={errors.password} autoComplete="current-password" />
        <button type="submit" className="btn">Login</button>
      </form>
      <p className="muted">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}
