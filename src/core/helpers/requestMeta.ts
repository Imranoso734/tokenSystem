import { FastifyRequest } from "fastify"
import { UserRole } from "@prisma/client"

/**
 * Quickly read all request metadata
 *
 */
export function requestMeta(req: FastifyRequest): {
  userId: string
  userRole: UserRole
} {
  const userId = req.requestContext.get("userId" as never) as string | undefined
  const userRole = req.requestContext.get("userRole" as never) as
    | UserRole
    | undefined

  if (!userId || !userRole) {
    throw new Error("failed to process request")
  }

  return { userId, userRole }
}
