import { CreateUser } from './CreateUser'
import { useGetUsers } from './http/generated/users/users'

export function App() {
  const { data: users } = useGetUsers()

  return (
    <div>
      <ul>
        {users?.data.map((user) => {
          return <li key={user.id}>{user.name}</li>
        })}
      </ul>

      <CreateUser />
    </div>
  )
}
