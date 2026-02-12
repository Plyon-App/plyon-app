import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from './config/firebase'
import './App.css'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  if (loading) return (
    <div className="app">
      <p>Cargando...</p>
    </div>
  )

  return (
    <div className="app">
      <h1>🏃‍♂️ Plyon</h1>
      {user ? (
        <div>
          <p>Bienvenido, {user.email}</p>
          <button onClick={() => auth.signOut()}>Cerrar sesión</button>
        </div>
      ) : (
        <div>
          <p>Plataforma multi-deporte</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Firebase conectado ✅</p>
        </div>
      )}
    </div>
  )
}

export default App
