import { useState, useEffect } from 'react'

function App() {
  console.log("🔧 App component loaded!")
  
  const [backendStatus, setBackendStatus] = useState('Connecting...')
  const [error, setError] = useState('')

  console.log("🔧 About to run useEffect")

  useEffect(() => {
    console.log("🔧 useEffect is running!")
    console.log("🔧 Attempting to connect to backend...")
    
    fetch('http://localhost:8080/api/health')
      .then(response => {
        console.log("🔧 Response received:", response)
        return response.text()
      })
      .then(data => {
        console.log("🔧 Data received:", data)
        setBackendStatus(data)
      })
      .catch(error => {
        console.error("🔧 Error connecting to backend:", error)
        setError(error.message)
        setBackendStatus('❌ Backend not connected')
      })
  }, [])

  console.log("🔧 Current backendStatus:", backendStatus)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-green-600 mb-6">
          🏈 GreenLink
        </h1>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">Backend Status:</p>
          <p className="font-mono text-lg">{backendStatus}</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded">
            <p className="text-red-700 text-sm">Error: {error}</p>
          </div>
        )}
        
        <button 
          onClick={() => {
            console.log("🔧 Button clicked!")
            window.location.reload()
          }}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Retry Connection
        </button>
      </div>
    </div>
  )
}

export default App