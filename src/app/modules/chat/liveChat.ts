import { db } from "@/core/database"
import { Validate } from "@/core/helpers/Validate"
import { MessageHandler } from "@/core/server/plugins/SocketRoutesPlugin"
import { FromSchema } from "json-schema-to-ts"
import { ObjectId } from "mongodb"

const textMessageSchema = {
    type: "object",
    properties: {
        userId: { type: "string" },
        text: { type: "string" },
    },
    required: ["text", "userId"],
    additionalProperties: false,
} as const

type textMessage = FromSchema<typeof textMessageSchema>

/**
 *  echo the received message back to the client
 *
 */
export const chatWithGPT: MessageHandler = async (socket, payload) => {

    const body = Validate.validateWithException<textMessage>(
        textMessageSchema,
        payload,
    )

    const resp = "" //await OpenAIService.generateQuery(body.text, body.userId)
    socket.send({ message: "Assistant", reponse: resp })

}

export const chatWithGPTTesting: MessageHandler = async (socket, payload) => {

    const body = Validate.validateWithException<textMessage>(
        textMessageSchema,
        payload,
    )

    // const resp = await OpenAIService.generateQuery(body.text, body.userId)
    // socket.send({ message: "Assistant", reponse: resp })
    const resp = ""//await PerplexityAIService.generateQuery(body.text)



    socket.send({ message: "Assistant", reponse: resp })

}
