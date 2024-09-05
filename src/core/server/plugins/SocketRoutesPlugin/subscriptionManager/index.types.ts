import { ISocket } from "@/core/server/plugins/SocketRoutesPlugin/socket"

export interface ISubscription {
  name: string
  subscribe: (socket: ISocket) => void
  unsubscribe: (socket: ISocket) => void
  publish: (payload: unknown) => void
  publishRaw: (payload: unknown) => void
}

export interface ISubscriptionManager {
  subscribe: (name: string, socket: ISocket) => void
  unsubscribe: (name: string, socket: ISocket) => void
  unsubscribeAll: (socket: ISocket) => void
  publish: (name: string, payload: unknown) => void
  publishRaw: (name: string, payload: unknown) => void
  closeSubscription: (name: string) => void
}
