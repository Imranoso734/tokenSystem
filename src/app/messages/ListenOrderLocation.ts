// import { MessageHandler } from "@/core/server/plugins/SocketRoutesPlugin/index.types"
// import { SubscriptionManagerSingleton } from "@/core/server/plugins/SocketRoutesPlugin/subscriptionManager"

// /**
//  *  admins will subscribe to receive the live location updates of "in-progress"
//  *  orders. Anytime the system receives updated location of an order
//  *  the system will relay this to all sockets who have subscribed to getting
//  *  these location updates
//  */
// export const ListenOrderLocationMessage: MessageHandler = async (socket) => {
//   const subscriptionName = "order.location"
//   SubscriptionManagerSingleton.instance.subscribe(subscriptionName, socket)

//   socket.send({
//     message:
//       "successfully subscribed to live locations of 'in-progress' orders",
//   })
// }
