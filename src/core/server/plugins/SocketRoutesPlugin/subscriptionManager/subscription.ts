import { ISubscription } from "./index.types"
import { ISocket } from "@/core/server/plugins/SocketRoutesPlugin/socket"

export class Subscription implements ISubscription {
  public readonly name: string
  private _sockets: ISocket[]

  constructor(name: string) {
    this.name = name
    this._sockets = []
  }

  /**
   *  allow a new socket to subscribe to the subscription
   *
   */
  public subscribe(socket: ISocket) {
    const [exists] = this._sockets.filter((s) => s.id === socket.id)
    if (exists) return

    this._sockets.push(socket)
  }

  /**
   *  remove socket from subscription
   *
   */
  public unsubscribe(socket: ISocket) {
    this._sockets = this._sockets.filter((s) => s.id !== socket.id)
  }

  /**
   *  push a message to all sockets subscribed to the current subscription
   *
   */
  public publish(payload: unknown) {
    for (const socket of this._sockets) {
      socket.send({
        type: this.name,
        payload,
      })
    }
  }

  public publishRaw(payload: unknown) {
    for (const socket of this._sockets) {
      socket.send(
        payload,
      )
    }
  }
}
