import { Router } from 'itty-router'
import { places } from './places'
import {
  getPlacesByCategory,
  getPlacesByCountry,
  getRandom,
  json,
} from './utils'

const router = Router()
router.get('/', async () => {
  return json(places)
})

router.get('/random', () => {
  return json(places[getRandom()])
})

router.get('/random/country/:country', ({ params }) => {
  let input = decodeURIComponent(params.country).toLocaleLowerCase()
  const placesWithCountry = getPlacesByCountry(input)
  return json(placesWithCountry[getRandom(placesWithCountry.length - 1)])
})

router.get('/random/category/:category', ({ params }) => {
  let input = decodeURIComponent(params.category).toLocaleLowerCase()
  const placesWithCategory = getPlacesByCategory(input)
  return json(placesWithCategory[getRandom(placesWithCategory.length - 1)])
})

router.get('/country/:country', ({ params }) => {
  let input = decodeURIComponent(params.country).toLocaleLowerCase()
  return json(getPlacesByCountry(input))
})

router.get('/category/:category', ({ params }) => {
  let input = decodeURIComponent(params.category)

  return json(getPlacesByCategory(input))
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
