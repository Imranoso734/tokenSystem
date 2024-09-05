import { RouteOptions } from "fastify"
import { ChatControllerClass } from "./chatController"
import { validateToken } from "@/core/server/middleware";
import { params, paramsSchema } from "./chat.schema";
import { requestMeta } from "@/core/helpers";

export const chat: RouteOptions = {
  url: "/chat-history",
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
    return await ChatControllerClass.getUserChatHistory(userId);
  }
}