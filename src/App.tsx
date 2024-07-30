import React from 'react'
import EditorScreen from './components/EditorScreen'
import ErrorBoundary from './components/ErrorBoundary'

// Only Once in your app you can set whether to enable hooks tracking or not.
// In CRA(create-react-app) e.g. this can be done in src/index.js

function App() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <ErrorBoundary>
        <EditorScreen />
      </ErrorBoundary>
    </div>
  )
}

export default App
