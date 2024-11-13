import { db } from "@/core/database"
import { UserRole } from "@prisma/client"
import { Password as Pwd } from "@/core/helpers"
import { Body, params } from "./shoper.schema"
import { Dates } from "@/core/helpers/Dates"


export const ShoperControllerClass = {

  instance: (() => {
    // const headers = {
    // }
    // return { headers } // Return the headers object
  })(),
  async getSingleAgent(agentId: string, shopId: string) {
    const agent = await db.user.findUnique({
      where: {
        id: agentId,
        role: UserRole.AGENT,
        allocatShop: {
          shopId: shopId
        },
      },
      include: {
        password: true,
        allocatShop: true,
        tokens: true,
      }
    })
    return agent
  },
  async getAllAgents(shopId: string) {
    const agent = await db.user.findMany({
      where: {
        allocatShop: {
          shopId: shopId
        },
        role: UserRole.AGENT
      },
      include: {
        password: true,
        allocatShop: true,
        tokens: true,
      }
    })
    return agent
  },
  async CreateNewAgent(agr: Body, shopId: string) {

    const email = await db.user.findUnique({
      where: {
        email: agr.email
      }
    })
    if (email) throw new Error("Email already taken")

    const shop = await db.user.create({
      data: {
        name: agr.name,
        email: agr.email,
        mobile: agr.mobile,
        role: UserRole.AGENT,
        created_at: await Dates.getDateTime(),
        password: agr.password && agr.password.length > 0 ? {
          create: {
            hash: await Pwd.hash(agr.password),
            passwordText: agr.password
          },
        } : undefined,
        allocatShop: {
          create: {
            shopId: shopId
          }
        }
      },
      include: {
        shop: {
          include: {
            shopUser: true
          }
        },
        password: true,
      }
    })
    return shop
  },
  async updateAgent(agr: Body, agentId: string) {

    const user = await db.user.findUnique({
      where: {
        id: agentId
      }
    })
    if (!user) throw new Error("Agent not found")
    // if (user.email === agr.email) throw new Error("Email already taken")


    const agent = await db.user.update({
      where: {
        id: agentId
      },
      data: {
        name: agr.name,
        mobile: agr.mobile,
        email: agr.email,
        password: agr.password && agr.password.length > 0 ? {
          update: {
            hash: await Pwd.hash(agr.password),
            passwordText: agr.password
          },
        } : undefined,
      },
      include: {
        password: true,
        allocatShop: true,
        tokens: true,
      }
    })
    return agent

  }

}
