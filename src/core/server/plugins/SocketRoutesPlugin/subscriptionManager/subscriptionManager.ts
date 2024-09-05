import { ISocket } from "@/core/server/plugins/SocketRoutesPlugin/socket"
import { Subscription } from "./subscription"
import { ISubscriptionManager, ISubscription } from "./index.types"

export class SubscriptionManager implements ISubscriptionManager {
  private _subscriptions: ISubscription[]

  constructor() {
    this._subscriptions = []
  }

  /**
   *  in all registered subscriptions, find a single subscription using
   *  its name
   *
   */
  private _findSubscription(name: string): ISubscription | undefined {
    const [sub] = this._subscriptions.filter((s) => s.name === name)
    return sub
  }

  /**
   *  provision a subscription: if already exists, return that, otherwise
   *  create a new one
   *
   */
  private _findOrCreateSubscription(name: string): ISubscription {
    const exists = this._findSubscription(name)
    if (exists) return exists

    this._registerSubscription(name)
    return this._findSubscription(name) as ISubscription
  }

  /**
   *  create a new subscription
   *
   */
  private _registerSubscription(name: string) {
    const exists = this._findSubscription(name)
    if (exists) return

    const sub = new Subscription(name)
    this._subscriptions.push(sub)
  }

  /**
   *  close a subscription channel
   *
   */
  public closeSubscription(name: string) {
    this._subscriptions = this._subscriptions.filter((s) => s.name !== name)
  }

  /**
   *  add a new socket to an existing subscription
   *
   */
  public subscribe(name: string, socket: ISocket) {
    const sub = this._findOrCreateSubscription(name)
    sub.subscribe(socket)
  }

  /**
   *  remove a socket from an existing subscription
   *
   */
  public unsubscribe(name: string, socket: ISocket) {
    const sub = this._findSubscription(name)
    if (!sub) return

    sub.unsubscribe(socket)
  }

  /**
   *  remove all subscriptions for a provided socket
   *
   */
  public unsubscribeAll(socket: ISocket) {
    for (const sub of this._subscriptions) {
      sub.subscribe(socket)
    }
  }

  /**
   *  send a message to all sockets who have subscribed to a subscription
   *
   */
  public publish(name: string, payload: unknown) {
    const sub = this._findSubscription(name)
    if (!sub) return

    sub.publish(payload)
  }
 
  public publishRaw(name: string, payload: unknown) {
    const sub = this._findSubscription(name)
    if (!sub) return

    sub.publishRaw(payload)
  }
}
