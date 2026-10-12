import { useEffect, useRef, useState } from 'react'
import { imageUrl } from '../lib/ddragon.js'

// Illustration officielle du champion, fondue dans le haut de la page.
export default function Backdrop({ championId }) {
  const [loaded, setLoaded] = useState(null)
  const imageRef = useRef(null)
  const src = championId ? imageUrl.splash(championId) : null

  // Sur une page pré-rendue, l'image peut finir de charger avant que React prenne la main :
  // l'événement onLoad est alors manqué, on vérifie donc son état au montage.
  useEffect(() => {
    const image = imageRef.current
    if (image?.complete && image.naturalWidth > 0) setLoaded(src)
  }, [src])

  if (!src) return <div className="backdrop" aria-hidden="true" />

  return (
    <div className="backdrop" aria-hidden="true">
      <img
        key={src}
        ref={imageRef}
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
