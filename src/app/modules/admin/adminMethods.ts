import { RouteOptions } from "fastify"
import { hasRole, validateToken } from "@/core/server/middleware";
import { requestMeta } from "@/core/helpers";
import { UserRole } from "@prisma/client";
import { Body, bodySchema, params, paramsSchema } from "./admin.schema";
import { ShopControllerClass } from "./adminController";

export const createShop: RouteOptions = {
  url: "/shop",
  method: "POST",
  preValidation: [
    validateToken,
    hasRole(UserRole.ADMIN),
  ],
  schema: {
    body: bodySchema,
  },
  handler: async (req, reply) => {
    const body = req.body as Body
    const resp = await ShopControllerClass.CreateNewShop(body as Body)
    reply.send(resp)
  }
}

export const singleShop: RouteOptions = {
  url: "/shop/:shopId",
  method: "GET",
  preValidation: [
    validateToken,
    hasRole(UserRole.ADMIN),
  ],
  schema: {
    params: paramsSchema,
  },
  handler: async (req, reply) => {
    const resp = await ShopControllerClass.getSingleShop(req.params as params)
    reply.send(resp)
  }
}

export const updateShop: RouteOptions = {
  url: "/shop/:shopId",
  method: "PUT",
  preValidation: [
    validateToken,
    hasRole(UserRole.ADMIN),
  ],
  schema: {
    params: paramsSchema,
    body: bodySchema,
  },
  handler: async (req, reply) => {
    const body = req.body as Body
    const shop = req.params as params
    const resp = await ShopControllerClass.updateShop(body as Body, shop.shopId as string)
    reply.send(resp)
  }
}


export const getAllShops: RouteOptions = {
  url: "/get-all-shop",
  method: "GET",
  preValidation: [
    validateToken,
    hasRole(UserRole.ADMIN),
  ],
  handler: async (req, reply) => {
    const resp = await ShopControllerClass.getAllShops()
    reply.send(resp)
  }
}