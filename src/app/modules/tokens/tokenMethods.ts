import { RouteOptions } from "fastify"
import { ChatControllerClass } from "./tokenController"
import { validateToken } from "@/core/server/middleware";
import { params, paramsSchema } from "./token.schema";
import { requestMeta } from "@/core/helpers";

export const chat: RouteOptions = {
  url: "/get-token",
  method: "GET",
  preValidation: [
    validateToken,
    // hasRole(
    //   UserRole.SITE_MANAGER,
    //   UserRole.SUB_CONTRACTOR,
    //   UserRole.GATE_KEEPER,
    // ),
  ],
  schema: {
    // params: paramsSchema,
  },
  handler: async (req) => {
    const { userId } = requestMeta(req)
    return userId
  }
}