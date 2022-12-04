// Render as you fetch
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  // 🐨 you'll need PokemonErrorBoundary here
  PokemonErrorBoundary,
} from '../pokemon'
// 🐨 you'll need createResource from ../utils
import {createResource} from '../utils'

// 🐨 Your goal is to refactor this traditional useEffect-style async
// interaction to suspense with resources. Enjoy!

function PokemonInfo({pokemonResource}) {
  let pokemon = pokemonResource.read()
  // 💣 you're pretty much going to delete all this stuff except for the one
  // place where 🐨 appears
  // const [state, setState] = React.useReducer((s, a) => ({...s, ...a}), {
  //   pokemon: null,
  //   error: null,
  //   status: 'pending',
  // })

  // const {pokemon, error, status} = state

  // React.useEffect(() => {
  //   let current = true
  //   setState({status: 'pending'})
  //   fetchPokemon(pokemonName).then(
  //     p => {
  //       if (current) setState({pokemon: p, status: 'success'})
  //     },
  //     e => {
  //       if (current) setState({error: e, status: 'error'})
  //     },
  //   )
  //   return () => (current = false)
  // }, [pokemonName])

  // 💰 This will be the fallback prop of <React.Suspense />
  // if (status === 'pending') {
  //   return <PokemonInfoFallback name={pokemonName} />
  // }

  // 💰 This is the same thing the PokemonErrorBoundary renders
  // if (status === 'error') {
  //   return (
  //     <div>
  //       There was an error.
  //       <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
  //     </div>
  //   )
  // }

  // 💰 this is the part that will suspend
  // if (status === 'success') {
  // 🐨 instead of accepting the pokemonName as a prop to this component
  // you'll accept a pokemonResource.
  // 💰 you'll get the pokemon from: pokemonResource.read()
  // 🐨 This will be the return value of this component. You won't need it
  // to be in this if statement anymore though!
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  // 🐨 add a useState here to keep track of the current pokemonResource
  const [pokemonResource, setPokemonResource] = React.useState(null)
  // 🐨 Add a useEffect here to set the pokemon resource to a createResource
  // with fetchPokemon whenever the pokemonName changes.
  React.useEffect(() => {
    if (!pokemonName) {
      return setPokemonResource(null)
    }

    setPokemonResource(createResource(fetchPokemon(pokemonName)))
  }, [pokemonName])
  // If the pokemonName is falsy, then set the pokemon resource to null

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      {pokemonResource ? (
        <PokemonErrorBoundary
          resetKeys={[pokemonResource]}
          onReset={() => setPokemonName('')}
        >
          <React.Suspense fallback={<PokemonInfoFallback name={pokemonName} />}>
            <div className="pokemon-info">
              <PokemonInfo pokemonResource={pokemonResource} />
            </div>
          </React.Suspense>
        </PokemonErrorBoundary>
      ) : (
        'Submit a pokemon'
      )}
    </div>
  )
}

export default App
