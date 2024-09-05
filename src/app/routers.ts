import { FastifyPlugin } from "@/core/server/plugins"
import { HealthCheckRouter } from "./modules/healthCheck/healthCheckRouter"
import { AuthRouter } from "./modules/auth/authRouter"
import { ForgotPasswordRouter } from "./modules/forgotPassword/forgotPasswordRouter"
import { PasswordRouter } from "./modules/password/passwordRouter"
import { UserRouter } from "./modules/user/userRouter"
import { RouteOptions } from "fastify"
import { serverConfig } from "./config"
import ChatRouter from "./modules/chat"

/**
 * Register all module routers here
 *
 */
export const routers = new Map<string, FastifyPlugin>([
  [`${serverConfig.apiPrefix}/health-check`, HealthCheckRouter],
  [`${serverConfig.apiPrefix}/`, AuthRouter],
  [`${serverConfig.apiPrefix}/forgot-password`, ForgotPasswordRouter],
  [`${serverConfig.apiPrefix}/password`, PasswordRouter],
  [`${serverConfig.apiPrefix}/user`, UserRouter],
])


/**
 * register all routes here
 *
 */
export const routes2: RouteOptions[] = [
  ChatRouter.chat
]