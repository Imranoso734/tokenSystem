// import { MessageHandler } from "@/core/server/plugins/SocketRoutesPlugin/index.types"
// import { SubscriptionManagerSingleton } from "@/core/server/plugins/SocketRoutesPlugin/subscriptionManager"
// import { FromSchema } from "json-schema-to-ts"
// import { Validate } from "@/core/helpers/Validate"



// const siteMessageSchema = {
//   type: "object",
//   properties: {
//     siteId: { type: "integer" },
//   },
//   required: ["siteId"],
//   additionalProperties: false,
// } as const

// type siteMessageSchemaMessage = FromSchema<typeof siteMessageSchema>

// /**
//  *  the admin must subscribe to getting updates on deliveries being completed
//  *  by the drivers
//  */
// export const ListenDeliveryCompletedMessage: MessageHandler = async (
//   socket,
//   payload
// ) => {

//   const body = Validate.validateWithException<siteMessageSchemaMessage>(
//     siteMessageSchema,
//     payload,
//   )

//   const messageName = `delivery.completed_${body.siteId}`
//   SubscriptionManagerSingleton.instance.subscribe(messageName, socket)

//   socket.send({
//     message: `successfully subscribed to '${messageName}'`,
//   })
// }
