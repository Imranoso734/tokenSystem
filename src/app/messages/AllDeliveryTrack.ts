// import { FromSchema } from "json-schema-to-ts"
// import { MessageHandler } from "@/core/server/plugins/SocketRoutesPlugin/index.types"
// import { Validate } from "@/core/helpers"
// import { AuthService } from "@/core/services/AuthService"
// import { db } from "@/core/database"
// import bordcast from "@/core/helpers/bordcast"


// const deliveryStatsMessageSchema = {
//   type: "object",
//   properties: {
//     siteId: { type: "number" }
//   },
//   required: ["siteId"],
//   additionalProperties: false,
// } as const
// type deliveryStatsMessage = FromSchema<typeof deliveryStatsMessageSchema>

// /**
//  *  after a driver marks the start of a delivery, he will be broadcasting
//  *  his live location every n seconds,
//  */
// export const DeliveriesTrackBySite: MessageHandler = async (socket, payload) => {
//   const body =
//     Validate.validateWithException<deliveryStatsMessage>(
//       deliveryStatsMessageSchema,
//       payload,
//     )

//   const site = await db.site.findFirst({ where: { id: body.siteId }, select: { id: true, holdingAreas: true } })
//   if (!site) {
//     throw new Error("invalid site id provided")
//   }

//   let deliveries = bordcast.getAll(body.siteId)


//   socket.send({ deliveries, holdingAreas: site.holdingAreas })
// }
