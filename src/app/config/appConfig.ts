import { env } from "@/core/helpers"
const frontendURL = "http://localhost:3000/"

export const appConfig = {
  appName: "Node API",
  frontendURL,
  urls: {
    resetPassword: frontendURL + "forgot-password/reset?token=",
    accountSetup: frontendURL + "configure-account?token=",
  },
  pagination: {
    perPage: 20,
  },
}
