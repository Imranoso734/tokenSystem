// import { FromSchema } from "json-schema-to-ts"
// import { MessageHandler } from "@/core/server/plugins/SocketRoutesPlugin/index.types"
// import { DeliveryService } from "@/app/services/DeliveryService"
// import { SubscriptionManagerSingleton } from "@/core/server/plugins/SocketRoutesPlugin/subscriptionManager"
// import { Validate } from "@/core/helpers/Validate"

// /**
//  *  the driver will send the id of the delivery before the system can start
//  *  tracking live location of the driver
//  */
// const deliveryStartMessageSchema = {
//   type: "object",
//   properties: {
//     delivery_id: { type: "integer" },
//   },
//   required: ["delivery_id"],
//   additionalProperties: false,
// } as const

// type DeliveryStartMessage = FromSchema<typeof deliveryStartMessageSchema>

// /**
//  *  when a driver intends to start a delivery, they will send this message
//  *  over the socket to status change to the server
//  *
//  *  we are not using a REST endpoint for this purpose because the server needs
//  *  to know which socket is associated with the delivery driver
//  */
// export const DeliveryStartMessage: MessageHandler = async (socket, payload) => {
//   const body = Validate.validateWithException<DeliveryStartMessage>(
//     deliveryStartMessageSchema,
//     payload,
//   )

//   let delivery = await DeliveryService.findDeliveryById(body.delivery_id)
//   if (!delivery) {
//     throw new Error("invalid delivery_id provided")
//   }

//   delivery = await DeliveryService.markDeliveryInProgress(delivery)

//   /**
//    *  when a driver starts the delivery of an order, we automatically subscribe
//    *  him to receive updates related to the drop location of the delivery.
//    *  These updates to the drop location will be published by the admin using
//    *  the dashboard
//    */
//   const messageName = `delivery.drop.update.${body.delivery_id}`
//   SubscriptionManagerSingleton.instance.subscribe(messageName, socket)

//   /**
//    *  inform the admins that a delivery is now in-progress
//    *
//    */
//   SubscriptionManagerSingleton.instance.publish(`delivery.inprogress_${body.delivery_id}`, {
//     delivery,
//   })

//   socket.send({
//     message: "order delivery status updated successfully",
//     delivery,
//   })
// }
