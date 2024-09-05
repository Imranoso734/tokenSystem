import { db } from "@/core/database"


export const ChatControllerClass = {

  instance: (() => {
    // const headers = {
    // }
    // return { headers } // Return the headers object
  })(),

  async getUserProfile(val: string) {
    return val
  },

  async getUserChatHistory(userId: string) {
    const user = await db.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new Error("User not found")
    }

    const history: any = await db.userQuery.findMany({ where: { userId: userId } })
    const chatHistory = history.map((chat: any) => chat.chat)
    return chatHistory
  }


}
