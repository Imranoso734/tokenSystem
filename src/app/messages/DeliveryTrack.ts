// import { FromSchema } from "json-schema-to-ts"
// import { MessageHandler } from "@/core/server/plugins/SocketRoutesPlugin/index.types"
// import { DeliveryService } from "@/app/services/DeliveryService"
// import { SubscriptionManagerSingleton } from "@/core/server/plugins/SocketRoutesPlugin/subscriptionManager"
// import { Validate } from "@/core/helpers"
// import { DeliveryStatus } from "@prisma/client"

// /**
//  *  following information will be sent by driver when broadcasting his
//  *  live location
//  */
// const deliveryTrackMessageSchema = {
//   type: "object",
//   properties: {
//     delivery_id: { type: "integer" },
//     lat: { type: "number" },
//     lng: { type: "number" },
//   },
//   required: ["delivery_id", "lat", "lng"],
//   additionalProperties: false,
// } as const

// type DeliveryTrackMessage = FromSchema<typeof deliveryTrackMessageSchema>

// /**
//  *  after a driver marks the start of a delivery, he will be broadcasting
//  *  his live location every n seconds,
//  */
// export const DeliveryTrackMessage: MessageHandler = async (socket, payload) => {
//   const body = Validate.validateWithException<DeliveryTrackMessage>(
//     deliveryTrackMessageSchema,
//     payload,
//   )

//   const delivery = await DeliveryService.findDeliveryById(body.delivery_id)
//   if (!delivery) {
//     throw new Error("invalid delivery_id provided")
//   }

//   if (delivery.status !== DeliveryStatus.INPROGRESS) {
//     throw new Error(
//       "delivery must be marked as 'INPROGRESS' before live location can be tracked",
//     )
//   }

//   /** send current location to the admin dashboard */
//   const subscriptionName = "order.location_" + body.delivery_id
//   SubscriptionManagerSingleton.instance.publish(subscriptionName, body)

//   socket.send({
//     message: "current location sent",
//   })
// }
