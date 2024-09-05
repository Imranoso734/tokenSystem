import { FastifyInstance } from "fastify"
import { routers, routes2 } from "@/app/routers"

export const routesPlugin = {
  plug() {
    return async (app: FastifyInstance) => {
      for (const [prefix, router] of routers) {
        app.register(router, { prefix })
      }
    }
  },
  plug2() {
    return async (app: FastifyInstance) => {
      for (const route of routes2) {
        app.route(route)
      }
    }
  },
}
