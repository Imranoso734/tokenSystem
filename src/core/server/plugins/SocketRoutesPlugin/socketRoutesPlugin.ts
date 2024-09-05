import { FastifyInstance } from "fastify"
import { SocketStream } from '@fastify/websocket'
import { handleMessage } from "./helpers"
import { Socket } from "./socket"
import { SubscriptionManagerSingleton } from "./subscriptionManager/index"
import { JWT } from "@/core/helpers"
import { authConfig } from "@/app/config"
// import { logger } from "@/core/server/logger"

/**
 *  this function defines a fastify plugin which is responsible for handling
 *  socket connections
 */

interface WebSocketRequest {
  headers: {
    authorization?: string;
  };
}

export async function socketRoutesPlugin(app: FastifyInstance) {

  app.get(
    "/ws",
    { websocket: true },
    (conn: SocketStream, req: WebSocketRequest) => {
      const socket = new Socket(conn.socket)
      // logger.info({ message: "new socket connected", id: socket.id })

      // validateConnection(conn, req);
      /** error handling and routing of messages */
      socket.socket.on("message", handleMessage(socket))

      /** cleanup: remove all socket subscriptions on close */
      socket.socket.on("close", () => {
        SubscriptionManagerSingleton.instance.unsubscribeAll(socket)
        // logger.info({ message: "socket disconnected", id: socket.id })
      })
    },
  )
}

async function validateConnection(connection: SocketStream, req: WebSocketRequest) {
  // Check if the connection is valid
  if (!req.headers.authorization) {
    connection.socket.send("please pass authorization token in headers")
    connection.socket.terminate()
    return;
  }

  console.log(req.headers);

  const token = req.headers.authorization;

  const jwtPayload = await JWT.validate(authConfig.jwt.secret, token)

  let result
  if (jwtPayload) {
    result = jwtPayload as {
      sub: number
      scope: string
      role: string
    }
    connection.socket.send(`${result.sub}`)
  } else {
    connection.socket.send("Your token is invalid, please try again")
    connection.socket.terminate()
  }
}