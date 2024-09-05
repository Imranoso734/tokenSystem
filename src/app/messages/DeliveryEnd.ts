// import { FromSchema } from "json-schema-to-ts"
// import { MessageHandler } from "@/core/server/plugins/SocketRoutesPlugin/index.types"
// import { DeliveryService } from "@/app/services/DeliveryService"
// import { SubscriptionManagerSingleton } from "@/core/server/plugins/SocketRoutesPlugin/subscriptionManager"
// import { Validate } from "@/core/helpers/Validate"

// /**
//  *  when a driver needs to mark a delivery as completed, he must send the
//  *  unique id of the delivery
//  */
// const deliveryStartMessageSchema = {
//   type: "object",
//   properties: {
//     delivery_id: { type: "integer" },
//   },
//   required: ["delivery_id"],
//   additionalProperties: false,
// } as const

// type DeliveryEndMessage = FromSchema<typeof deliveryStartMessageSchema>

// /**
//  *  after the driver has completed a delivery, he must indicate to the server
//  *  that the delivery has been completed.
//  *
//  */
// export const DeliveryEndMessage: MessageHandler = async (socket, payload) => {
//   const body = Validate.validateWithException<DeliveryEndMessage>(
//     deliveryStartMessageSchema,
//     payload,
//   )
//   let delivery = await DeliveryService.findDeliveryById(body.delivery_id)
//   if (!delivery) {
//     throw new Error("invalid delivery_id provided")
//   }

//   delivery = await DeliveryService.markDeliveryArrived(delivery)

//   /**
//    *  after a driver has completed a delivery we automatically unsubscribe
//    *  him to receiving updates on order drop location update
//    */
//   const messageName = `delivery.drop.update.${body.delivery_id}`
//   SubscriptionManagerSingleton.instance.unsubscribe(messageName, socket)

//   /**
//    *  after a delivery is complete, the driver will no longer be sending
//    *  location updates on the following subscription. We close down the
//    *  subscription channel so that no one is subscribed to this any longer
//    */
//   let subscriptionName = `delivery.location.${body.delivery_id}`
//   SubscriptionManagerSingleton.instance.closeSubscription(subscriptionName)

//   /**
//    *  we must notify the admin that this particular delivery has been completed
//    *  so that the updated status can be shown in the Dashboard.
//    */
//   subscriptionName = "delivery.completed"
//   SubscriptionManagerSingleton.instance.publish(subscriptionName, { delivery })

//   socket.send({
//     message: "order delivery status updated successfully",
//     delivery,
//   })
// }
