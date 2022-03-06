import { Router } from 'itty-router'
import { places } from './places'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
  'Access-Control-Max-Age': '86400',
}

// Create a new router
const router = Router()
const json = j => {
  return new Response(JSON.stringify(j), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/json',
    },
  })
}
/*
Our index route, a simple hello world.
*/
router.get('/', async () => {
  return json(places)
})

router.get('/random', () => {
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
    return Math.floor(ruleOfThree(100, places.length - 1, OneHundredBase))
  }
  return json(places[xorShift()])
})

router.get('/country/:country', ({ params }) => {
  let input = decodeURIComponent(params.country).toLocaleLowerCase()

  return json(
    places.filter(place => {
      const countries = place.countries.map(country =>
        country.code.toLowerCase(),
      )
      const countriesID = place.countries.map(country => country.id)
      return countries.includes(input) || countriesID.includes(input)
    }),
  )
})

router.get('/category/:category', ({ params }) => {
  let input = decodeURIComponent(params.category)

  return json(
    places.filter(place => {
      const cats = place.categories.map(cat => cat.slug)
      const catsId = place.categories.map(cat => cat.id)
      return cats.includes(input) || catsId.includes(input)
    }),
  )
})

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).

Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all('*', () => new Response('404, not found!', { status: 404 }))

/*
This snippet ties our worker to the router we deifned above, all incoming requests
are passed to the router where your routes are called and the response is sent.
*/
addEventListener('fetch', e => {
  e.respondWith(router.handle(e.request))
})
