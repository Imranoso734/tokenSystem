import { params } from './../chat/chat.schema';
import { RouteOptions } from "fastify"
import { TokenControllerClass } from "./tokenController"
import { hasRole, validateToken } from "@/core/server/middleware";
import { ShopId, shopIdSchema, tokenBody, tokenBodySchema, tokenNumber, tokenNumberSchema, tokenNumberWithShop, tokenNumberWithShopSchema, TokenProcessBody, tokenprocessSchema } from "./token.schema";
import { requestMeta } from "@/core/helpers";
import { UserRole } from "@prisma/client";
import { Dates } from "@/core/helpers/Dates";
import { Time } from '@/core/helpers/Time';


/**
 * create a new token, using shopId and userId 
 *
*/
export const createToken: RouteOptions = {
  url: "/token",
  method: "POST",
  preValidation: [
    validateToken,
    hasRole(
      UserRole.SHOPKEEPER,
      UserRole.AGENT,
      UserRole.HELPER
    ),
  ],
  schema: {
    body: tokenBodySchema,
  },
  handler: async (req, reply) => {
    const { userId } = requestMeta(req)
    const body = req.body as tokenBody
    const token = await TokenControllerClass.createToken(userId, body)
    reply.send({ tokenNumber: token.tokenNumberInt })
  }
}

/**
 * compelet a token process with user details and change status with COMPLETE 
 *
*/
export const processOnToken: RouteOptions = {
  url: "/token/:tokenNumber",
  method: "PUT",
  preValidation: [
    validateToken,
    hasRole(
      UserRole.SHOPKEEPER,
      UserRole.HELPER
    ),
  ],
  schema: {
    body: tokenprocessSchema,
    params: tokenNumberSchema
  },
  handler: async (req, reply) => {
    const { userId } = requestMeta(req)
    const body = req.body as TokenProcessBody
    const { tokenNumber } = req.params as tokenNumber
    const token = await TokenControllerClass.processOnTokenAllocated(tokenNumber, userId, body)
    reply.send(token)
  }
}

/**
 * Get single token with tokenNumber
 *
*/
export const getSingleToken: RouteOptions = {
  url: "/get-token/:tokenNumber",
  method: "GET",
  preValidation: [
    validateToken,
    hasRole(
      UserRole.SHOPKEEPER,
      UserRole.HELPER,
      UserRole.AGENT
    ),
  ],
  schema: {
    params: tokenNumberSchema
  },
  handler: async (req, reply) => {
    const { userId } = requestMeta(req)
    const { tokenNumber } = req.params as tokenNumber
    const token = await TokenControllerClass.getOneToken(tokenNumber)
    reply.send(token)
  }
}

/**
 * Get list of tokens for shop with current date and with status ACTIVE
 *
*/
export const listOfTokensByActiveOfCurrentDate: RouteOptions = {
  url: "/token/:shopId",
  method: "GET",
  preValidation: [
    validateToken,
    hasRole(
      UserRole.SHOPKEEPER,
      UserRole.AGENT,
      UserRole.HELPER
    ),
  ],
  schema: {
    params: shopIdSchema,
  },
  handler: async (req, reply) => {
    const { userId } = requestMeta(req)
    const { shopId } = req.params as ShopId
    const token = await TokenControllerClass.listOfTokens(shopId)
    reply.send(token)
  }
}

/**
 * Get list of tokens for shop with current date and with status ACTIVE
 *
*/
export const listOfTokensByCompleteOfCurrentDate: RouteOptions = {
  url: "/completed-token/:shopId",
  method: "GET",
  preValidation: [
    validateToken,
    hasRole(
      UserRole.SHOPKEEPER,
      UserRole.AGENT,
      UserRole.HELPER
    ),
  ],
  schema: {
    params: shopIdSchema,
  },
  handler: async (req, reply) => {
    const { userId } = requestMeta(req)
    const { shopId } = req.params as ShopId
    const token = await TokenControllerClass.listOfCompletedTokens(shopId)
    reply.send(token)
  }
}

/**
 * Get list of tokens for shop with current date and with status ACTIVE
 *
*/
export const listOfAllTokens: RouteOptions = {
  url: "/token/:shopId/all",
  method: "GET",
  preValidation: [
    validateToken,
    hasRole(
      UserRole.SHOPKEEPER,
      UserRole.AGENT,
      UserRole.HELPER
    ),
  ],
  schema: {
    params: shopIdSchema,
  },
  handler: async (req, reply) => {
    const { userId } = requestMeta(req)
    const { shopId } = req.params as ShopId
    const token = await TokenControllerClass.listOfAllTokens(shopId)
    reply.send(token)
  }
}


/**
 * Get list of tokens for shop with high priority
 *
*/
export const listOfTokensByPriority: RouteOptions = {
  url: "/token-by-priority/:shopId",
  method: "GET",
  preValidation: [
    validateToken,
    hasRole(
      UserRole.SHOPKEEPER,
      UserRole.AGENT,
      UserRole.HELPER
    ),
  ],
  schema: {
    params: shopIdSchema,
  },
  handler: async (req, reply) => {
    const { userId } = requestMeta(req)
    const { shopId } = req.params as ShopId
    const token = await TokenControllerClass.listOfTokensByPriority(shopId)
    reply.send(token)
  }
}


/**
 * set token status high priority
 *
*/
export const setTokenHighPriority: RouteOptions = {
  url: "/ste-token-priority/:tokenNumber/:shopId",
  method: "GET",
  preValidation: [
    validateToken,
    hasRole(
      UserRole.SHOPKEEPER,
      UserRole.HELPER,
      UserRole.AGENT
    ),
  ],
  schema: {
    params: tokenNumberWithShopSchema
  },
  handler: async (req, reply) => {
    const { userId } = requestMeta(req)
    const { tokenNumber, shopId } = req.params as tokenNumberWithShop
    const token = await TokenControllerClass.setTokenStatusHighPriority(tokenNumber, shopId as string, userId)
    reply.send(token)
  }
}

/**
 * Add reserved token
 *
*/
export const addReservedToken: RouteOptions = {
  url: "/add-reserved-token/:shopId/:noOftokens",
  method: "GET",
  preValidation: [
    validateToken,
    hasRole(
      UserRole.SHOPKEEPER
    ),
  ],
  schema: {
    params: shopIdSchema
  },
  handler: async (req, reply) => {
    const { userId } = requestMeta(req)
    const { shopId, noOftokens } = req.params as ShopId
    const token = await TokenControllerClass.createReservedToken(shopId as string, noOftokens as number, userId)
    reply.send(token)
  }
}


export const deleteTokens: RouteOptions = {
  url: "/token",
  method: "DELETE",
  preValidation: [
    validateToken,
    hasRole(
      UserRole.SHOPKEEPER,
      UserRole.AGENT,
      UserRole.HELPER
    ),
  ],
  schema: {
    // body: tokenBodySchema,
  },
  handler: async (req, reply) => {
    const { userId } = requestMeta(req)
    const body = req.body as tokenBody
    const token = await TokenControllerClass.deleteToken()
    reply.send(token)
  }
}