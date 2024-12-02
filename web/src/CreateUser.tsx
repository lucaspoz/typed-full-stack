import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  getGetUsersQueryKey,
  useCreateUser,
} from './http/generated/users/users'

const createUserSchema = z.object({
  name: z.string().min(3, 'Nome precisa ter 3 caracteres'),
})

type CreateUserSchema = z.infer<typeof createUserSchema>

export function CreateUser() {
  const queryClient = useQueryClient()

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
  })

  const { mutateAsync: createUser } = useCreateUser()

  async function handleCreateUser(data: CreateUserSchema) {
    await createUser({ data: { name: data.name } })

    await queryClient.invalidateQueries({
      queryKey: getGetUsersQueryKey(),
    })

    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleCreateUser)}>
      <input type="text" {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      <button type="submit">Criar usuário</button>
    </form>
  )
}
