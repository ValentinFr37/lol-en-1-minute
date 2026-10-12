import { useState } from 'react'
import { imageUrl } from '../lib/ddragon.js'

// Illustration officielle du champion, fondue dans le haut de la page.
export default function Backdrop({ championId }) {
  const [loaded, setLoaded] = useState(null)
  if (!championId) return <div className="backdrop" aria-hidden="true" />

  const src = imageUrl.splash(championId)
  return (
    <div className="backdrop" aria-hidden="true">
      <img
        key={src}
        src={src}
        alt=""
        className="backdrop-image"
        data-loaded={loaded === src}
        onLoad={() => setLoaded(src)}
        fetchPriority="high"
      />
    </div>
  )
}
