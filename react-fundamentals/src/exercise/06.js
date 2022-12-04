// Basic Forms
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

function UsernameForm({onSubmitUsername}) {
  // 🐨 add a submit event handler here (`handleSubmit`).
  // 💰 Make sure to accept the `event` as an argument and call
  // `event.preventDefault()` to prevent the default behavior of form submit
  // events (which refreshes the page).
  //
  // 🐨 get the value from the username input (using whichever method
  // you prefer from the options mentioned in the instructions)
  // 💰 For example: event.target.elements[0].value
  // 🐨 Call `onSubmitUsername` with the value of the input

  const inputRef = React.useRef(null)
  const [isAlert, setAlert] = React.useState(false)
  const [managedValue, setManagedValue] = React.useState('placeholder')

  function setManagedValueToValidInput(event) {
    setManagedValue(event.target.value.toLowerCase())
  }

  function handleSubmit(event) {
    event.preventDefault()

    console.log(event.target.elements.usernameInput)
    console.log(inputRef.current.value)
  }

  function validateInputForLowerCase(event) {
    setAlert(event.target.value !== event.target.value.toLowerCase())
  }
  // 🐨 add the onSubmit handler to the <form> below

  // 🐨 make sure to associate the label to the input.
  // to do so, set the value of 'htmlFor' prop of the label to the id of input
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="usernameInput">Username:</label>
        <input
          type="text"
          name="usernameInput"
          id="usernameInput"
          ref={inputRef}
          onChange={validateInputForLowerCase}
        />
        <label>
          Managed Username:{' '}
          <input
            type="text"
            value={managedValue}
            onChange={setManagedValueToValidInput}
          />
        </label>
      </div>
      {isAlert ? <p style={{color: 'red'}}>Some error occured</p> : ''}
      <button type="submit" disabled={isAlert}>
        Submit
      </button>
    </form>
  )
}

function App() {
  const onSubmitUsername = username => alert(`You entered: ${username}`)
  return <UsernameForm onSubmitUsername={onSubmitUsername} />
}

export default App
