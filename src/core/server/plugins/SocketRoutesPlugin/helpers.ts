import { messageHandlers } from "@/app/messages"
import { messageSchema, Message } from "./index.schema"
import { isJSON } from "@/core/helpers/isJSON"
import { Socket } from "./socket"
// import { logger } from "@/core/server/logger" 
import { Validate } from "@/core/helpers/Validate"

/**
 *  ensure that the incoming message has the required fields
 *
 */
function validatePayload(
  buffer: Buffer,
  schema: Record<string, unknown>,
): unknown {
  const data = JSON.parse(buffer.toString())
  if (!Validate.validate(schema, data)) {
    throw new Error("incoming socket message has invalid base structure")
  }

  return data
}

/**
 *  based on the message.type, route the request to the appropriate socket
 *  message handler
 *
 */
async function routeMessage(socket: Socket, message: Message): Promise<void> {
  const handler = messageHandlers.get(message.type)
  if (!handler) {
    throw new Error(`invalid message type: ${message.type}`)
  }
  return handler(socket, message.payload)
}

/**
 *  handle new incoming messaging on open socket connection
 *
 */
export function handleMessage(socket: Socket) {
  return async (buffer: Buffer) => {
    try {
      const message = validatePayload(buffer, messageSchema) as Message
      await routeMessage(socket, message)
    } catch (err) {
      const message = (err as Error).message
      const parsed = isJSON(message) ? JSON.parse(message) : message

      socket.send({ error: parsed })
    }
  }
}
