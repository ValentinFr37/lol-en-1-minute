import { useCallback, useEffect, useRef, useState } from 'react'

// Charge une ressource asynchrone et expose { status, data, error, retry }.
// `initial` : donnée déjà connue (pré-rendu), affichée tout de suite sans requête.
export function useAsync(load, deps, initial) {
  const [state, setState] = useState(() =>
    initial === undefined
      ? { status: 'loading', data: null, error: null }
      : { status: 'ready', data: initial, error: null },
  )
  const [attempt, setAttempt] = useState(0)
  const skipFirstLoad = useRef(initial !== undefined)

  useEffect(() => {
    if (skipFirstLoad.current) {
      skipFirstLoad.current = false
      return
    }
    let cancelled = false
    setState((s) => ({ ...s, status: 'loading', error: null }))
    load()
      .then((data) => !cancelled && setState({ status: 'ready', data, error: null }))
      .catch((error) => !cancelled && setState({ status: 'error', data: null, error }))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])
  return { ...state, retry }
}
