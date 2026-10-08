import { useCallback, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { ToastContext } from './toast'

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback(
    (message) => {
      idCounter += 1
      const id = idCounter
      setToasts((prev) => [...prev, { id, message }])
      setTimeout(() => dismiss(id), 4000)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4"
        role="status"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-on-ink shadow-float"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
