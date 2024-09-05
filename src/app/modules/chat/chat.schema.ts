import { FromSchema } from "json-schema-to-ts"

export const bodySchema = {
    type: "object",
    properties: {
        siteId: { type: "integer" },
        durationHours: { type: "integer", minimum: 0, maximum: 23 },
        durationMinutes: { type: "integer", minimum: 0, maximum: 59 },
    },
    required: [
        "siteId",
        "durationHours",
    ],
    additionalProperties: false,
} as const

export type Body = FromSchema<typeof bodySchema>


export const paramsSchema = {
    type: "object",
    properties: {
        userId: { type: "string" },
    },
    required: ["userId"],
    additionalProperties: false,
} as const

export type params = FromSchema<typeof paramsSchema>

