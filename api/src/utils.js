import { places } from './places'

export const getRandom = (length = places.length - 1) => {
  const currentDate = new Date()
  let seed = currentDate.getTime()
  function xorShift() {
    seed ^= seed << 13
    seed ^= seed >> 17
    seed ^= seed << 5

    function ruleOfThree(had, got, have) {
      return (have * got) / had
    }
    const OneHundredBase = parseInt(seed.toString().substr(-2))
    return Math.floor(ruleOfThree(100, length, OneHundredBase))
  }

  return xorShift()
}

export const getPlacesByCountry = input =>
  places.filter(place => {
    const countries = place.countries.map(country => country.code.toLowerCase())
    const countriesID = place.countries.map(country => country.id)
    return countries.includes(input) || countriesID.includes(input)
  })

export const getPlacesByCategory = input =>
  places.filter(place => {
    const cats = place.categories.map(cat => cat.slug)
    const catsId = place.categories.map(cat => cat.id)
    return cats.includes(input) || catsId.includes(input)
  })

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
  'Access-Control-Max-Age': '86400',
}

export const json = j => {
  return new Response(JSON.stringify(j), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/json',
    },
  })
}
