import { env } from "@/core/helpers/env"

export const perplexityAIConfig = {
  apiKey: env("PERPLEXITY_KEY"),
  generalModel: "llama-3.1-sonar-small-128k-online",
  systemRole: "You are a helpful assistant that provides comprehensive product details along with images, returning the data in JSON format."
}
