import { FromSchema } from "json-schema-to-ts"

export const bodySchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        email: { type: "string" },
        mobile: { type: "string" },
        password: { type: "string" },

    },
    required: ["name", "email", "mobile"],
    additionalProperties: false,
} as const

export type Body = FromSchema<typeof bodySchema>


export const paramsSchema = {
    type: "object",
    properties: {
        agentId: { type: "string" },
    },
    required: ["agentId"],
    additionalProperties: false,
} as const

export type params = FromSchema<typeof paramsSchema>

