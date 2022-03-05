import { Router } from 'itty-router'
import { sample } from 'lodash'
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

function shuffle(array) {
  var counter = array.length,
    temp,
    index

  // While there are elements in the array
  while (counter--) {
    // Pick a random index
    index = (Math.random() * counter) | 0

    // And swap the last element with it
    temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }

  return array
}

router.get('/', json(places))

router.get('/random', () => {
  return json(shuffle(places)[0])
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