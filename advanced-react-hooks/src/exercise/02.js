// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function PokemonInfo({pokemonName, formRef}) {
  const {run, ...state} = useAsync({status: pokemonName ? 'pending' : 'idle'})

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    const abortController = new AbortController()

    run(fetchPokemon(pokemonName, abortController.signal))

    return () => {
      abortController.abort()
    }
  }, [pokemonName, run])

  // 🐨 this will change from "pokemon" to "data"
  const {data, status, error} = state

  if (status === 'idle' || !pokemonName) {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={data} />
  }

  throw new Error('This should be impossible')
}

function useAsync(initialState) {
  const [state, dispatch] = React.useReducer(asyncReducer, initialState)

  const run = React.useCallback(promise => {
    dispatch({type: 'pending'})

    promise.then(
      data => {
        dispatch({type: 'resolved', data})
      },
      error => {
        if (error.code === error.ABORT_ERR) {
          return
        }

        dispatch({type: 'rejected', error})
      },
    )
  }, [])

  return {...state, run}
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
