// import { FromSchema } from "json-schema-to-ts"
// import { MessageHandler } from "@/core/server/plugins/SocketRoutesPlugin/index.types"
// import { DeliveryService } from "@/app/services/DeliveryService"
// import { SubscriptionManagerSingleton } from "@/core/server/plugins/SocketRoutesPlugin/subscriptionManager"
// import { Validate } from "@/core/helpers/Validate"
// import { DeliveryStatus } from "@prisma/client"
// import { db } from "@/core/database"
// import BordcastDeliver from "@/core/helpers/bordcast"
// import { list } from "pm2"

// /**
//  *  the driver will send the id of the delivery before the system can start
//  *  tracking live location of the driver
//  */
// const deliveryStartMessageSchema = {
//   type: "object",
//   properties: {
//     routeId: { type: "string" },
//     lat: { type: "number" },
//     long: { type: "number" },
//     status: { type: "string" },
//   },
//   required: ["routeId", "lat", "long"],
//   additionalProperties: false,
// } as const

// type DeliveryStartMessage = FromSchema<typeof deliveryStartMessageSchema>

// export const DriverDeliveryStartMessage: MessageHandler = async (socket, payload) => {

//   const deliveryRoute = await db.deliveryRouteId.findFirst({ where: { routeId: body.routeId } })

//   if (!deliveryRoute) {
//     throw new Error("invalid delivery id provided")
//   }

//   const deliveryId = deliveryRoute?.deliveryId as number

//   let delivery = await DeliveryService.findDeliveryById(deliveryId)

//   if (!delivery) {
//     throw new Error("invalid delivery id provided")
//   }

//   let socketMessage, dlat, dlng;

//   let bordcast = BordcastDeliver;


//   // check if the delivery is inprogress and mark it as arrived then it's completed

//   if (delivery.status === DeliveryStatus.ACCEPTED && body.status === "INITIATE") {
//     // await DeliveryService.markDeliveryInProgress(delivery)
//     socketMessage = "Delivery initiated"
//     dlat = delivery.booking.site.siteProfile.lat
//     dlng = delivery.booking.site.siteProfile.lng

//   }
//   else if (delivery.status === DeliveryStatus.ACCEPTED && body.status === "START") {
//     await DeliveryService.markDeliveryInProgress(delivery)
//     delivery = await DeliveryService.findDeliveryById(deliveryId)
//     socketMessage = "Delivery started now"
//     dlat = delivery.booking.site.siteProfile.lat
//     dlng = delivery.booking.site.siteProfile.lng


//     bordcast.set(deliveryRoute?.deliveryId, {
//       siteId: delivery.booking.site.id,
//       message: socketMessage,
//       status: delivery.status,
//       refferenceId: delivery.reference,
//       gateName: delivery.gate?.name,
//       clat: body.lat,
//       clng: body.long,
//       dlat: dlat,
//       dlng: dlng,
//       delivery: delivery
//     })

//   }
//   else if (delivery.status === DeliveryStatus.INPROGRESS && body.status === "ARRIVED") {
//     const del = await DeliveryService.markDeliveryArrived(delivery)
//     delivery = await DeliveryService.findDeliveryById(deliveryId)
//     socketMessage = "Delivery Completed"
//     dlat = delivery.booking.site.siteProfile.lat
//     dlng = delivery.booking.site.siteProfile.lng

//     const sitename = `delivery.completed_${del.booking.site.id}`
//     SubscriptionManagerSingleton.instance.publish(sitename, {
//       message: "That is completed",
//       deliveryId: deliveryId,
//     })

//     bordcast.remove(deliveryRoute?.deliveryId)

//   }
//   else if (delivery.status === DeliveryStatus.ONHOLD) {
//     socketMessage = "Delivery On Hold"
//     dlat = delivery.DeliveryOnHold?.holdingArea.lat
//     dlng = delivery.DeliveryOnHold?.holdingArea.lng


//     bordcast.set(deliveryRoute?.deliveryId, {
//       siteId: delivery.booking.site.id,
//       message: socketMessage,
//       status: delivery.status,
//       refferenceId: delivery.reference,
//       gateName: delivery.gate?.name,
//       clat: body.lat,
//       clng: body.long,
//       dlat: dlat,
//       dlng: dlng,
//       delivery: delivery
//     })

//   } else if (delivery.status === DeliveryStatus.ARRIVED) {
//     socketMessage = "Delivery Arrived"
//     dlat = delivery.booking.site.siteProfile.lat
//     dlng = delivery.booking.site.siteProfile.lng

//     bordcast.remove(deliveryRoute?.deliveryId)

//   } else {
//     socketMessage = "Delivery On way"
//     dlat = delivery.booking.site.siteProfile.lat
//     dlng = delivery.booking.site.siteProfile.lng

//     bordcast.set(deliveryRoute?.deliveryId, {
//       siteId: delivery.booking.site.id,
//       message: socketMessage,
//       status: delivery.status,
//       refferenceId: delivery.reference,
//       gateName: delivery.gate?.name,
//       clat: body.lat,
//       clng: body.long,
//       dlat: dlat,
//       dlng: dlng,
//       delivery: delivery
//     })
//   }

//   const messageName = `driver_delivery_${deliveryRoute?.deliveryId}`
//   SubscriptionManagerSingleton.instance.subscribe(messageName, socket)

//   /**
//    *  inform the admins that a delivery is now in-progress
//    *
//    */

//   SubscriptionManagerSingleton.instance.publish(`delivery_inprogress_${deliveryRoute?.deliveryId}`, {
//     message: socketMessage,
//     status: delivery.status,
//     clat: body.lat,
//     clng: body.long,
//     dlat: dlat,
//     dlng: dlng,
//   })

//   console.log(bordcast.getAll(1));


//   let deliveryInfo = {
//     siteName: delivery.booking.site.name,
//     refferenceId: delivery.reference,
//     date: delivery.booking.date,
//     gateName: delivery.gate?.name,
//   }

//   socket.socket.on("close", () => {
//     SubscriptionManagerSingleton.instance.unsubscribe(messageName, socket)
//     SubscriptionManagerSingleton.instance.closeSubscription(messageName)
//   })

//   socket.send({
//     message: socketMessage,
//     status: delivery.status,
//     deliveryInfo: deliveryInfo,
//     lat: dlat,
//     lng: dlng,
//   })
// }
