import { Router } from 'itty-router'
import { places } from './places'

// Create a new router
const router = Router()
const json = j => {
  return new Response(JSON.stringify(j), {
    headers: {
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
