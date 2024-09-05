import { FromSchema } from "json-schema-to-ts"

export const messageSchema = {
  type: "object",
  properties: {
    type: { type: "string" },
    payload: {
      type: "object",
    },
  },
  required: ["type", "payload"],
  additionalProperties: false,
} as const

export type Message = FromSchema<typeof messageSchema>
