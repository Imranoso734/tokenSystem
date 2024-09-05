// import { MessageHandler } from "@/core/server/plugins/SocketRoutesPlugin/index.types"
// import { SubscriptionManagerSingleton } from "@/core/server/plugins/SocketRoutesPlugin/subscriptionManager"
// import { FromSchema } from "json-schema-to-ts"
// import { Validate } from "@/core/helpers/Validate"
// import { DeliveryService } from "@/app/services/DeliveryService"
// import { de } from "@faker-js/faker"
// import { DeliveryStatus } from "@prisma/client"

// const deliveryIdMessageSchema = {
//   type: "object",
//   properties: {
//     delivery_id: { type: "integer" },
//     previous_delivery_id: { type: "integer", nullable: true },
//   },
//   required: ["delivery_id"],
//   additionalProperties: false,
// } as const

// type DeliveryStartMessage = FromSchema<typeof deliveryIdMessageSchema>


// /**
//  *  the admin must subscribe to getting updates on new deliveries added to the
//  *  system (through delivery reference pin generation)
//  *
//  */
// export const ListenDeliveryInProgressMessage: MessageHandler = async (
//   socket,
//   payload
// ) => {

//   const body = Validate.validateWithException<DeliveryStartMessage>(
//     deliveryIdMessageSchema,
//     payload,
//   )

//   let delivery = await DeliveryService.findDeliveryById(body.delivery_id)
//   if (!delivery) {
//     throw new Error("invalid delivery id provided")
//   }

//   const messageName = `delivery_inprogress_${body.delivery_id}`
//   SubscriptionManagerSingleton.instance.subscribe(messageName, socket)

//   let message

//   if (delivery.status === DeliveryStatus.ONHOLD || delivery.status === DeliveryStatus.ARRIVED) {
//     message = {
//       message: "delivery is " + delivery.status,
//       status: delivery.status,
//       lat: delivery.booking.site.siteProfile.lat,
//       lng: delivery.booking.site.siteProfile.lng,
//     }
//   } else {
//     message = `successfully subscribed to ${messageName}`
//   }

//   if (body.previous_delivery_id !== null) {
//     const _message = `delivery_inprogress_${body.previous_delivery_id}`
//     SubscriptionManagerSingleton.instance.closeSubscription(_message)
//   }


//   socket.send({
//     message
//   })
// }
