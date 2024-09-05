import { env } from "@/core/helpers/env"

export const openAIConfig = {
  apiKey: env("OPENAI_KEY"),
  generalModel: "gpt-3.5-turbo",
  transcriptionModel: "whisper-1",
  systemRole: "You are a helpful assistant that helps users find and purchase the right product based on their preferences. You are responsible for generating questions based on the user's query and processing the final query."
  ,
  questions: {
    bulletSymbol: "-",
    numQuestions: "five",
  },
}
