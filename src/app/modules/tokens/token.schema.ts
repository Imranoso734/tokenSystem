import def from 'ajv/dist/vocabularies/discriminator';
import { Shop } from './../../../../node_modules/.prisma/client/index.d';
import { FromSchema } from "json-schema-to-ts"

export const tokenBodySchema = {
    type: "object",
    properties: {
        cnic: { type: "string" },
        name: { type: "string" },
        shopId: { type: "string" },
    },
    required: ["shopId"],
    additionalProperties: false,
} as const

export type tokenBody = FromSchema<typeof tokenBodySchema>


export const tokenprocessSchema = {
    type: "object",
    properties: {
        shopId: { type: "string" },
        cnic: { type: "string" },
        name: { type: "string" },
        surName: { type: "string" },
        dateOfBirth: { type: "string" },
        issueCnic: { type: "string" },
        expiryCnic: { type: "string" },
        phoneNumber: { type: "string" },
        address: { type: "string" }
    },
    required: ["shopId"],
    additionalProperties: false,
} as const;

export type TokenProcessBody = FromSchema<typeof tokenprocessSchema>;



export const tokenNumberSchema = {
    type: "object",
    properties: {
        tokenNumber: { type: "string" },
    },
    required: ["tokenNumber"],
    additionalProperties: false,
} as const

export type tokenNumber = FromSchema<typeof tokenNumberSchema>



export const tokenNumberWithShopSchema = {
    type: "object",
    properties: {
        tokenNumber: { type: "string" },
        shopId: { type: "string" },
    },
    required: ["tokenNumber"],
    additionalProperties: false,
} as const

export type tokenNumberWithShop = FromSchema<typeof tokenNumberWithShopSchema>


export const shopIdSchema = {
    type: "object",
    properties: {
        shopId: { type: "string" },
        noOftokens: { type: "integer", default: 10 },
    },
    required: ["shopId"],
    additionalProperties: false,
} as const

export type ShopId = FromSchema<typeof shopIdSchema>

