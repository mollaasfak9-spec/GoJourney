import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Runs an async loader on mount (and whenever `deps` change) while tracking
 * loading/error state. `reload` lets a page refresh the data after a mutation.
 *
 * The loader is kept in a ref so callers can pass an inline closure without
 * re-triggering the effect on every render.
 */
export function useAsync(loader, deps = [], { immediate = true } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const loaderRef = useRef(loader)
  const mounted = useRef(true)

  useEffect(() => {
    loaderRef.current = loader
  })

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await loaderRef.current()
      if (mounted.current) setData(result)
      return result
    } catch (err) {
      if (mounted.current) setError(err)
      throw err
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (immediate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      run().catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error, reload: run, setData }
}
