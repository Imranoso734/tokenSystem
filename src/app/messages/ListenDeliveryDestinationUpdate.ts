// import { FromSchema } from "json-schema-to-ts"
// import { MessageHandler } from "@/core/server/plugins/SocketRoutesPlugin/index.types"
// import { SubscriptionManagerSingleton } from "@/core/server/plugins/SocketRoutesPlugin/subscriptionManager"
// import { DeliveryService } from "@/app/services/DeliveryService"
// import { Validate } from "@/core/helpers"

// /**
//  *  the driver will send the mongodb object id of the delivery before the
//  *  system can start tracking live location of the driver
//  */
// const listenDeliveryDestinationUpdateMessageSchema = {
//   type: "object",
//   properties: {
//     delivery_id: { type: "integer" },
//   },
//   required: ["delivery_id"],
//   additionalProperties: false,
// } as const

// type ListenDeliveryDestinationUpdateMessage = FromSchema<
//   typeof listenDeliveryDestinationUpdateMessageSchema
// >

// /**
//  *  when a driver starts delivery, they are automatically subscribed to updates
//  *  to the destination of the delivery. However, in certain scenarios, they may
//  *  close the socket and need to re-connect it. For this scenario, we provide
//  *  an option to the driver to manually subscribe to destination updates
//  *  for their current delivery
//  */
// export const ListenDeliveryDestinationUpdateMessage: MessageHandler = async (
//   socket,
//   payload,
// ) => {
//   const body =
//     Validate.validateWithException<ListenDeliveryDestinationUpdateMessage>(
//       listenDeliveryDestinationUpdateMessageSchema,
//       payload,
//     )

//   const delivery = await DeliveryService.findDeliveryById(body.delivery_id)
//   if (!delivery) {
//     throw new Error("invalid delivery_id provided")
//   }

//   const messageName = `delivery.drop.update.${body.delivery_id}`
//   SubscriptionManagerSingleton.instance.subscribe(messageName, socket)

//   socket.send({
//     message: "successfully subscribed to order destination updates",
//     delivery,
//   })
// }
