import { useCallback, useMemo, useState } from 'react'
import { nanoid } from '@reduxjs/toolkit'
import { ToastContext } from '../hooks/useToast'
import Toast from './Toast'

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), [])
  const api = useMemo(() => {
    const show = (type) => (message) => setToasts((list) => [...list, { id: nanoid(), type, message }])
    return { success: show('success'), info: show('info'), error: show('error') }
  }, [])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => <Toast key={toast.id} toast={toast} onDismiss={dismiss} />)}
      </div>
    </ToastContext.Provider>
  )
}
