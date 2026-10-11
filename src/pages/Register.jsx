import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import FormInput from '../components/FormInput'
import { clearError, register } from '../features/auth/authSlice'
import { validateRegister } from '../utils/validation'

export default function Register() {
  const dispatch = useDispatch()
  const { user, error } = useSelector((state) => state.auth)
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  if (user) return <Navigate to="/events" replace />

  const handleChange = (e) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validateRegister(values)
    setErrors(found)
    if (Object.keys(found).length === 0) {
      dispatch(register(values))
    }
  }

  // Duplicate-email error comes from the store; show it on the email field.
  const emailError = errors.email || error

  return (
    <div className="card narrow">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} noValidate>
        <FormInput id="name" label="Name" value={values.name} onChange={handleChange} error={errors.name} autoComplete="name" />
        <FormInput id="email" label="Email" type="email" value={values.email} onChange={handleChange} error={emailError} autoComplete="email" />
        <FormInput id="password" label="Password" type="password" value={values.password} onChange={handleChange} error={errors.password} autoComplete="new-password" />
        <FormInput id="confirmPassword" label="Confirm Password" type="password" value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" />
        <button type="submit" className="btn">Create account</button>
      </form>
      <p className="muted">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}

