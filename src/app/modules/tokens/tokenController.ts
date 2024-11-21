import { db } from "@/core/database"
import { ShopId, tokenBody, tokenNumber, TokenProcessBody } from "./token.schema"
import { TokenStatus } from "@prisma/client"
import { Dates } from "@/core/helpers/Dates"
import { Time } from "@/core/helpers/Time"
import { assert } from "node:console"


export const TokenControllerClass = {

  instance: (() => {
    // const headers = {
    // }
    // return { headers } // Return the headers object
  })(),

  async getUserProfile(val: string) {
    return val
  },
  /**
   * Creates a new token in the database for the given user and shop.
   * Generates a unique token number by taking the initials of the user's name and
   * appending a number starting from 1, or incrementing the last number if one exists.
   * @param userId The ID of the user to create the token for.
   * @param body The body of the request containing the shop ID and user's CNIC.
   * @returns The newly created token.
   */
  async createToken(userId: string, body: tokenBody) {

    const user = await db.user.findUnique({ where: { id: userId, }, })

    if (!user) {
      throw Error("cannot find user")
    }

    const shop = await db.shop.findUnique({ where: { id: body.shopId }, })
    if (!shop) {
      throw Error("shop not found")
    }

    const token = await db.token.findFirst({
      where: { shopId: body.shopId, created_at: Dates.currentDate() },
      orderBy: { tokenNumberInt: 'desc' },
    })

    let nextTokenNumberInt = token ? token.tokenNumberInt + 1 : 1


    const nameInitials = this.getInitials(user.name)
    const tokenNumber = `${nameInitials}-${nextTokenNumberInt}`
    const { hours, minutes } = Time.currentTime()
    const newToken = await db.token.create({
      data: {
        shopId: body.shopId,
        userId: user.id,
        tokenNumber: tokenNumber,
        tokenNumberInt: nextTokenNumberInt,
        cnic: body.cnic,
        name: body.name,
        created_at: Dates.currentDate(),
        tokenLogs: {
          create: {
            userId: user.id,
            status: TokenStatus.ACTIVE,
            date_at: Dates.currentDateString(),
            time_at: `${hours}:${minutes}`,
            created_at: await Dates.getDateTime(),

          }
        }
      },
    })

    return newToken

  },

  /**
   * Process a token that is allocated to a user
   *
   * @param tokenNumber the token number
   * @param userId the user id
   * @param body the body of the request
   * @returns the updated token and token logs
   * @throws Error if the token is not found
   * @throws Error if the shop is not found
   * @throws Error if the token is already processed
   */
  async processOnTokenAllocated(tokenNumber: string, userId: string, body: TokenProcessBody) {

    const findToken = await db.token.findFirst({ where: { id: tokenNumber }, include: { tokenLogs: true } })

    if (!findToken) {
      throw Error("cannot find token")
    }

    const shop = await db.shop.findUnique({ where: { id: body.shopId }, })
    if (!shop) {
      throw Error("shop not found")
    }

    for (const tokenLog of findToken.tokenLogs) {
      if (tokenLog.status === TokenStatus.COMPLETE) {
        throw Error("token already processed")
      }
    }

    const token = await db.token.update({
      where: {
        shopId: body.shopId,
        id: tokenNumber
      },
      data: {
        cnic: body.cnic,
        name: body.name,
        surName: body.surName,
        dateOfBirth: body.dateOfBirth,
        issueCnic: body.issueCnic,
        expiryCnic: body.expiryCnic,
        phoneNumber: body.phoneNumber,
        address: body.address,
        status: TokenStatus.COMPLETE
      }
    })

    let tokensLogs
    const { hours, minutes } = Time.currentTime()
    if (token) {
      tokensLogs = await db.tokenLogs.create({
        data: {
          tokenId: findToken.id, // Add this line to establish the relation
          userId: userId,
          status: TokenStatus.COMPLETE,
          date_at: Dates.currentDateString(),
          time_at: `${hours}:${minutes}`,
          created_at: await Dates.getDateTime(),
        }
      })
    }

    return { tokensLogs, token }
  },

  /**
   * Gets a single token with tokenNumberInt equal to the given tokenNumber.
   * It will include the logs of the token and the user who created the log.
   * If no token is found, it will throw an error.
   * @param tokenNumber The token number to find the token.
   * @returns The found token.
   */
  async getOneToken(tokenNumber: string) {
    const token = await db.token.findFirst({
      where: {
        id: tokenNumber
      },
      include: {
        tokenLogs: {
          include: {
            user: {
              select: {
                name: true,
                phone: true,
                role: true
              }
            }
          }
        }
      }
    })

    if (!token) {
      throw Error("there no token with this token number")
    }

    return token
  },

  /**
   * Get list of tokens for shop with status that is ACTIVE
   * and with today date.
   * @param shopId The ID of the shop to get the tokens for.
   * @returns The found tokens.
   */
  async listOfTokens(shopId: string) {

    const shop = await db.shop.findUnique({ where: { id: shopId }, })
    if (!shop) {
      throw Error("shop not found")
    }

    const tokens = await db.token.findMany({
      where: {
        shopId: shopId,
        status: TokenStatus.ACTIVE
      },
      include: {
        tokenLogs: true
      }
    })


    return tokens

  },

  /**
   * Sets the status of the given token to high priority.
   * @param tokenNumber The number of the token to set the status for.
   * @param shopId The ID of the shop of the token.
   * @param userId The ID of the user who is setting the status.
  
   */
  async setTokenStatusHighPriority(tokenNumber: string, shopId: string, userId: string) {

    const user = await db.user.findUnique({ where: { id: userId, } })
    const shop = await db.shop.findUnique({ where: { id: shopId } })

    if (!user) {
      throw Error("cannot find user")
    }

    if (!shop) {
      throw Error("shop not found")
    }

    const token = await db.token.findFirst({ where: { shopId: shopId, id: tokenNumber, isResvered: false } })
    if (!token) {
      throw Error("cannot find token")
    }

    if (token.isSendRequestForHigh) {
      throw Error("token already sent for high priority")
    }

    // const ttoken = await db.token.update({ where: { id: token.id }, data: { isSendRequestForHigh: true } })

    const reservedToken = await db.token.findFirst({
      where: {
        shopId: shopId,
        isResvered: true,
        created_at: Dates.currentDate()
      },
      orderBy: { tokenNumberInt: 'asc' },
    })

    if (!reservedToken) { 
      throw Error("cannot find reserved token day")
    }

    const { hours, minutes } = Time.currentTime()

    const assignNewToken = await db.token.update({
      where: {
        id: reservedToken?.id
      },
      data: {
        status: TokenStatus.HIGH_PRIORITY,
        isResvered: false,
        tokenLogs: {
          create: {
            userId: userId,
            status: TokenStatus.HIGH_PRIORITY,
            date_at: Dates.currentDateString(),
            time_at: `${hours}:${minutes}`,
            created_at: await Dates.getDateTime(),
          }
        }
      }
    })

    return { token: assignNewToken.tokenNumberInt }

  },

  async listOfTokensByPriority(shopId: string) {

    const shop = await db.shop.findUnique({ where: { id: shopId }, })
    if (!shop) {
      throw Error("shop not found")
    }

    const tokens = await db.token.findMany({
      where: {
        shopId: shopId,
        status: TokenStatus.HIGH_PRIORITY
      },
      include: {
        tokenLogs: true
      }
    })
    return tokens
  },



  /**
   * Creates a reserved token for a specified shop and user.
   * This function will add a token with a reserved status in the system.
   * @param shopId The ID of the shop to create the reserved token for.
   * @param userId The ID of the user to associate with the reserved token.
   */

  async createReservedToken(shopId: string, noOftokens: number, userId: string) {
    const user = await db.user.findUnique({ where: { id: userId, }, })
    const shop = await db.shop.findUnique({ where: { id: shopId }, })

    if (!user) {
      throw Error("cannot find user")
    }

    if (!shop) {
      throw Error("shop not found")
    }


    let newToken: any = []
    for (let index = 1; index <= noOftokens; index++) {

      const token = await db.token.findFirst({
        where: { shopId: shopId, created_at: Dates.currentDate() },
        orderBy: { tokenNumberInt: 'desc' },
      })

      const nextTokenNumberInt = token ? token.tokenNumberInt + 1 : 1

      const nameInitials = this.getInitials(user.name)
      const tokenNumber = `SM-${nameInitials}-${nextTokenNumberInt}`
      const { hours, minutes } = Time.currentTime()
      const rrNewToken = await db.token.create({
        data: {
          shopId: shopId,
          userId: user.id,
          tokenNumber: tokenNumber,
          tokenNumberInt: nextTokenNumberInt,
          isResvered: true,
          created_at: Dates.currentDate(),
          tokenLogs: {
            create: {
              userId: user.id,
              status: TokenStatus.ACTIVE,
              date_at: Dates.currentDateString(),
              time_at: `${hours}:${minutes}`,
              created_at: await Dates.getDateTime(),

            }
          }
        },
      })

      newToken.push(rrNewToken.tokenNumberInt)

    }





    return newToken
  },


  async deleteToken() {
    return await db.token.deleteMany()
  },



  getInitials(name: string) {
    return name
      .split(' ')                    // Split the name by spaces to get individual words
      .map(word => word[0].toUpperCase())  // Get the first letter of each word and convert to uppercase
      .join('');                     // Join the initials together
  }


}
