import { FromSchema } from "json-schema-to-ts"

export const bodySchema = {
    type: "object",
    properties: {
        shopkeeperName: { type: "string" },
        shopName: { type: "string" },
        location: { type: "string" },
        email: { type: "string" },
        mobile: { type: "string" },
        password: { type: "string" },

    },
    required: ["shopkeeperName", "shopName", "location", "email", "mobile"],
    additionalProperties: false,
} as const

export type Body = FromSchema<typeof bodySchema>


export const paramsSchema = {
    type: "object",
    properties: {
        shopId: { type: "string" },
    },
    required: ["shopId"],
    additionalProperties: false,
} as const

export type params = FromSchema<typeof paramsSchema>

