import { db } from "@/core/database"
import { Body, params } from "./admin.schema"
import { UserRole } from "@prisma/client"
import { Password as Pwd } from "@/core/helpers"
import { Dates } from "@/core/helpers/Dates"


export const ShopControllerClass = {

  instance: (() => {
    // const headers = {
    // }
    // return { headers } // Return the headers object
  })(),

  async getSingleShop(params: params) {
    const shops = await db.shop.findUnique({
      where: {
        id: params.shopId
      },
      include: {
        user: {
          include: {
            password: true
          }
        },
        shopUser: true,
        tokens: true,
      }
    })
    return shops
  },
  async getAllShops() {
    const shops = await db.shop.findMany({
      include: {
        user: {
          include: {
            password: true
          }
        },
        shopUser: true,
        tokens: true,
      }
    })
    return shops
  },

  async CreateNewShop(agr: Body) {

    const email = await db.user.findUnique({
      where: {
        email: agr.email
      }
    })
    if (email) throw new Error("Email already taken")


    const shop = await db.user.create({
      data: {
        name: agr.shopkeeperName,
        email: agr.email,
        mobile: agr.mobile,
        role: UserRole.SHOPKEEPER,
        created_at: await Dates.getDateTime(),
        password: agr.password && agr.password.length > 0 ? {
          create: {
            hash: await Pwd.hash(agr.password),
            passwordText: agr.password
          },
        } : undefined,
        shop: {
          create: {
            name: agr.shopName,
            location: agr.location
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

  async updateShop(agr: Body, shopId: string) {

    const user = await db.user.findUnique({
      where: {
        id: shopId
      }
    })
    if (!user) throw new Error("user not found")
    if (user.email === agr.email) throw new Error("Email already taken")

    const shop = await db.shop.update({
      where: {
        id: shopId
      },
      data: {
        name: agr.shopName,
        location: agr.location,
        user: {
          update: {
            name: agr.shopkeeperName,
            email: agr.email,
            mobile: agr.mobile,
            password: agr.password && agr.password.length > 0 ? {
              update: {
                hash: await Pwd.hash(agr.password),
                passwordText: agr.password
              },
            } : undefined,
          }
        }
      },
      include: {
        user: {
          include: {
            password: true
          }
        }
      }
    })
    
    return shop
  }

}
