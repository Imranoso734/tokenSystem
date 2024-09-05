import { RouteShorthandOptionsWithHandler } from "fastify"
import { HealthCheckService } from "./healthCheckService"
import { hasRole, validateToken } from "@/core/server/middleware"
import { UserRole } from "@prisma/client"
import { OpenAIService } from "@/core/openAi"
import { PerplexityAIService } from '@/core/perplexity';
import { FromSchema } from "json-schema-to-ts"

export const HealthCheckController: Record<
  string,
  RouteShorthandOptionsWithHandler
> = {
  healthCheck: {
    handler: async () => {

      // return OpenAIService.interactiveDialogue("I want to buy an iphone 15 pro max");
      return PerplexityAIService.generateQuery("i need Apple 15 pro")
      // return await HealthCheckService.healthcheck()
    },
  },

  memoryUsage: {
    preValidation: [validateToken, hasRole(UserRole.ADMIN)],
    handler: async () => {
      return await HealthCheckService.memoryUsage()
    },
  },
}

export const QuerySchema = {
  type: "object",
  properties: {
    query: { type: "string" },
  },
  required: ["query"],
  additionalProperties: false,
} as const

export type tQuerySchema = FromSchema<typeof QuerySchema>


export const HealthCheckGPT: Record<
  string,
  RouteShorthandOptionsWithHandler
> = {
  healthCheck: {
    schema: {
      body: QuerySchema,
    },
    handler: async (req, reply) => {
      const body = req.body as tQuerySchema
      return OpenAIService.generateQuery(body.query as string, "");
    },
  }
}



export const HealthCheckPerplexity: Record<
  string,
  RouteShorthandOptionsWithHandler
> = {
  healthCheck: {
    schema: {
      body: QuerySchema,
    },
    handler: async (req, reply) => {
      const body = req.body as tQuerySchema
      return PerplexityAIService.generateQuery(body.query as string)
    },
  }
}
