import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

interface User {
  id: string
  name: string
}

const users: User[] = []

export const routes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/users',
    {
      schema: {
        tags: ['users'],
        description: 'create user',
        operationId: 'createUser',
        body: z.object({
          name: z.string(),
        }),
        response: {
          201: z.object({}),
        },
      },
    },
    async (request, reply) => {
      const { name } = request.body

      users.push({
        id: randomUUID(),
        name,
      })

      return reply.status(201).send({})
    },
  )

  app.get(
    '/users/:id',
    {
      schema: {
        tags: ['users'],
        description: 'get an user',
        operationId: 'getUser',
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            name: z.string(),
          }),
          404: z.object({
            message: z.literal('user not found'),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const user = users.find((user) => user.id === id)

      if (!user) {
        return reply.status(404).send({ message: 'user not found' })
      }

      return user
    },
  )

  app.get(
    '/users',
    {
      schema: {
        tags: ['users'],
        description: 'list users',
        operationId: 'getUsers',
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
            }),
          ),
        },
      },
    },
    () => {
      return users
    },
  )
}
