import { useState, useEffect } from 'react'
import './banner.css'

export const Banner = () => {
  const [place, setPlace] = useState({})
  useEffect(() => {
    fetch('https://api.donate-ua.dev/random')
      .then((rsp) => rsp.json())
      .then(setPlace)
  }, [])
  return (
    <header className="flex items-center justify-between max-w-7xl m-auto">
      <div className="flex items-center">
        <div className="flag" />
        <p>Stand with Ukraine</p>
      </div>
      <a title={`Donate to ${place.name}`} target="_blank" href={place.link}>
        Donate
      </a>
    </header>
  )
}
