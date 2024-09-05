import { Socket } from "./socket"
export type MessageHandler = (socket: Socket, payload: unknown) => Promise<void>
export type MessageHandlers = Map<string, MessageHandler>
