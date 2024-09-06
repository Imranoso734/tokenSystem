import { RouteOptions } from "fastify"
import { hasRole, validateToken } from "@/core/server/middleware";
import { requestMeta } from "@/core/helpers";
import { UserRole } from "@prisma/client";
import { Body, bodySchema, params, paramsSchema } from "./shoper.schema";
import { ShoperControllerClass } from "./shoperController";
import { db } from "@/core/database";

export const createAgent: RouteOptions = {
  url: "/agent",
  method: "POST",
  preValidation: [
    validateToken,
    hasRole(UserRole.SHOPKEEPER),
  ],
  schema: {
    body: bodySchema,
  },
  handler: async (req, reply) => {
    const body = req.body as Body
    const { userId } = requestMeta(req)
    const shop = await db.shop.findFirst({ where: { userId: userId } })
    const resp = await ShoperControllerClass.CreateNewAgent(body as Body, shop?.id as string)
    reply.send(resp)
  }
}

export const singleAgent: RouteOptions = {
  url: "/agent/:agentId",
  method: "GET",
  preValidation: [
    validateToken,
    hasRole(UserRole.SHOPKEEPER),
  ],
  schema: {
    params: paramsSchema,
  },
  handler: async (req, reply) => {
    const params = req.params as params
    const { userId } = requestMeta(req)
    const shop = await db.shop.findFirst({ where: { userId: userId } })
    const resp = await ShoperControllerClass.getSingleAgent(params.agentId as string, shop?.id as string)
    reply.send(resp)
  }
}

export const updateAgent: RouteOptions = {
  url: "/agent/:agentId",
  method: "PUT",
  preValidation: [
    validateToken,
    hasRole(UserRole.SHOPKEEPER),
  ],
  schema: {
    params: paramsSchema,
    body: bodySchema,
  },
  handler: async (req, reply) => {
    const body = req.body as Body
    const agent = req.params as params
    const resp = await ShoperControllerClass.updateAgent(body as Body, agent.agentId as string)
    reply.send(resp)
  }
}

export const getAllAgents: RouteOptions = {
  url: "/get-all-agent",
  method: "GET",
  preValidation: [
    validateToken,
    hasRole(UserRole.SHOPKEEPER),
  ],
  handler: async (req, reply) => {
    const { userId } = requestMeta(req)
    const shop = await db.shop.findFirst({ where: { userId: userId } })
    const resp = await ShoperControllerClass.getAllAgents(shop?.id as string)
    reply.send(resp)
  }
}