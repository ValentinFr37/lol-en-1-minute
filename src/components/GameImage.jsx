import { useState } from 'react'

// Image Riot avec repli sur l'initiale si elle ne charge pas.
export default function GameImage({ src, label, className = '', ...props }) {
  const [failed, setFailed] = useState(false)
  if (failed || !src) {
    return (
      <span className={`image-fallback ${className}`} aria-hidden="true">
        {label?.[0] ?? '?'}
      </span>
    )
  }
  return <img src={src} alt="" className={className} onError={() => setFailed(true)} {...props} />
}
