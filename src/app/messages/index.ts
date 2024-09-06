import { MessageHandlers } from "@/core/server/plugins/SocketRoutesPlugin/index.types"
import { EchoMessage } from "./Echo"
import { chatWithGPT, chatWithGPTTesting } from "../modules/chat/liveChat";
// import { DeliveryStartMessage } from "./DeliveryStart"
// import { DriverDeliveryStartMessage } from "./DriverDeliveryStart"
// import { DeliveryTrackMessage } from "./DeliveryTrack"
// import { DeliveryEndMessage } from "./DeliveryEnd"
// import { ListenOrderLocationMessage } from "./ListenOrderLocation"
// import { ListenDeliveryInProgressMessage } from "./ListenDeliveryInProgress"
// import { ListenDeliveryCompletedMessage } from "./ListenDeliveryCompleted"
// import { ListenDeliveryDestinationUpdateMessage } from "./ListenDeliveryDestinationUpdate"
// import { getDeliveryStatsWebsocket } from "./dashboardWebsockets/getDeliveryStatsWebsocket"
// import { DeliveriesTrackBySite } from "./AllDeliveryTrack"


/**
 * register all message types and handlers here
 *
 */
export const messageHandlers: MessageHandlers = new Map([
  ["echo", EchoMessage],
  ["chat-gpt", chatWithGPT],
  ["chat-test", chatWithGPTTesting],
  // ["driver.delivery.start", DriverDeliveryStartMessage],
  // ["delivery.track", DeliveryTrackMessage],
  // ["delivery.end", DeliveryEndMessage],
  // ["listen.order.locations", ListenOrderLocationMessage],
  // ["listen.delivery.inprogress", ListenDeliveryInProgressMessage],
  // ["listen.delivery.completed", ListenDeliveryCompletedMessage],
  // ["listen.deliveries", DeliveriesTrackBySite],
  // [
  //   "listen.delivery.destination.update",
  //   ListenDeliveryDestinationUpdateMessage,
  // ],
  // ['deliveryStats', getDeliveryStatsWebsocket]
])
