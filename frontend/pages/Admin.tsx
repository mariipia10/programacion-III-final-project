import { useUser } from '../context/UserContext'

export default function Admin() {
  const { user } = useUser()

  return (
    <div>
      <h1>Admin</h1>
      <p>{user?.email}</p>
    </div>
  )
}
