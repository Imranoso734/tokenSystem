import { MessageHandler } from "@/core/server/plugins/SocketRoutesPlugin"

/**
 *  echo the received message back to the client
 *
 */
export const EchoMessage: MessageHandler = async (socket, payload) => {
  socket.send({ message: "i am from server", payload: payload })
}
