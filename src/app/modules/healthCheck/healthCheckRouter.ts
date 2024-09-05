import { FastifyPlugin } from "@/core/server/plugins"
import { HealthCheckController, HealthCheckGPT, HealthCheckPerplexity } from "./healthCheckController"

export const HealthCheckRouter: FastifyPlugin = (app, _opts, next) => {
  app.get("/", HealthCheckController.healthCheck)
  app.get("/memory", HealthCheckController.memoryUsage)
  app.post("/check-gpt", HealthCheckGPT.healthCheck)
  app.post("/check-perplexity", HealthCheckPerplexity.healthCheck)

  next()
}
