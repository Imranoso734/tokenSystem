import { SubscriptionManager } from "./subscriptionManager"

export class SubscriptionManagerSingleton {
  private static _instance: SubscriptionManager

  private constructor() {}

  public static get instance(): SubscriptionManager {
    if (!SubscriptionManagerSingleton._instance) {
      SubscriptionManagerSingleton._instance = new SubscriptionManager()
    }

    return this._instance
  }
}
