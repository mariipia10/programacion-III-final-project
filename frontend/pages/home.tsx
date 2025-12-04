import { useUser } from '../context/UserContext'

export default function Home() {
  const { user, logout } = useUser()

  if (!user) return <div>No hay sesión</div>

  return (
    <div>
      <h1>Home</h1>
      <p>{user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
