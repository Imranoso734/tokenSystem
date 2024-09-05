import OpenAI from "openai"
import { openAIConfig } from "./openAIConfig"
import { v4 as uuid } from "uuid"
import fs from "node:fs"
import { Question, Correspondence } from "./types"
import { db } from "../database"

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface Message {
  id: string;
  userId: string;
  chat: ChatMessage[];
}


export const OpenAIService = {
  instance: (() => {
    return new OpenAI({
      apiKey: openAIConfig.apiKey,
    })
  })(),

  /**
   * Generates a query based on user input and conversation history.
   *
   * This function takes a user's query and their ID, checks their conversation history,
   * constructs a chat completion request, and returns the completion text.
   *
   * @param {string} userQuery - The user's query.
   * @param {string} userId - The user's ID.
   * @return {string} The completion text.
   */
  async generateQuery(userQuery: string, userId: string) {

    const chatInitial: any = [{ role: "system", content: openAIConfig.systemRole }]; // Store conversation history
    const userChatHistory = await db.userQuery.findMany({ where: { userId: userId } })

    let chatdata: any

    if (userChatHistory.length === 0) {
      const dba = await db.userQuery.create({
        data: {
          userId: userId,
          chat: chatInitial,
        }
      })

      chatdata = dba
    } else {
      chatdata = userChatHistory
    }


    // Construct messages by iterating over the history
    const messages: any = chatdata.map((message: Message) => {
      return { role: message.chat[0].role, content: message.chat[0].content }
    })

    // Add latest user input
    messages.push({ role: 'user', content: userQuery })

    // Create a chat completion request to generate interview questions
    const res = await this.instance.chat.completions.create({
      model: openAIConfig.generalModel,
      messages: messages,
    })

    // Get completion text/content
    const completionText: any = res.choices[0].message.content

    const dba = await db.userQuery.createMany({
      data: {
        userId: userId,
        question: userQuery,
        chat: [
          { role: 'user', content: userQuery },
          { role: 'assistant', content: completionText }
        ],
      }
    })

    return completionText
  },

  async interactiveDialogue(userQuery: string): Promise<Question[]> {

    let messages: any = [
      {
        role: 'system',
        content: 'You are a helpful assistant that guides users through purchasing decisions for Apple phones.',
      },
      {
        role: 'user',
        content: 'I want to buy an iphone 15 pro max  ',
      },
    ];

    let isComplete = false;

    while (!isComplete) {
      // Create a chat completion request to generate interview questions
      const res = await this.instance.chat.completions.create({
        model: openAIConfig.generalModel,
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that helps users find and purchase the right product based on their preferences'.`,
          },
          {
            role: "user",
            content: userQuery,
          },
        ],
      })
      const content = res.choices[0].message.content;
      messages.push({ role: 'assistant', content: content });
      console.log("GPT", `Assistant: ${content}`);

    }


    return messages
    // Format the generated questions and return them
    // return this.formatQuestions(content)
  },




  formatQuestions(questions: string): Question[] {
    return questions
      .split("\n")
      .filter((line) => line !== "")
      .map((line) =>
        line.replace(openAIConfig.questions.bulletSymbol + " ", ""),
      )
      .map((line) => ({ id: uuid(), text: line }))
  },

  /**
   * Transcribes an audio file using the OpenAI API.
   * @param inputAudioFilepath - The filepath of the input audio file.
   * @returns The transcribed text.
   */
  async transcribeAudio(inputAudioFilepath: string): Promise<string> {
    // Create a readable stream from the input audio file
    const inputFilestream = fs.createReadStream(inputAudioFilepath)

    // Make a request to the OpenAI API to transcribe the audio
    const res = await this.instance.audio.transcriptions.create({
      model: openAIConfig.transcriptionModel,
      file: inputFilestream,
    })

    // Extract the transcribed text from the API response
    const transcript = res.text

    // Throw an error if the transcript is empty
    if (!transcript) {
      throw new Error("Failed to transcribe audio")
    }

    // Return the transcribed text
    return transcript
  },

  /**
   * Generates the content for a correspondence prompt based on a list of correspondences.
   *
   * @param correspondences - The list of correspondences between the interviewer and the candidate.
   * @returns The generated prompt content.
   */
  generateCorrespondencePromptContent(
    correspondences: Correspondence[],
  ): string {
    // Start with an introductory sentence
    let result =
      "An interview with the candidate was conducted and the following correspondence occurred."

    // Iterate over each correspondence
    for (const c of correspondences) {
      // Generate a sentence for each correspondence
      const sentence = ` The candidate was asked: ${c.question}. They answered: ${c.answer}.`
      result += sentence
    }

    // Add a closing sentence
    result +=
      "Please provide feedback on the candidate's responses. If a response is not relevant or does not answer the question, please mention it. Keep the feedback concise and focused on the candidate's response."

    // Return the final prompt content
    return result
  },

  async generateInterviewFeedback(
    jobTitle: string,
    correspondences: Correspondence[],
  ) {
    const res = await this.instance.chat.completions.create({
      model: openAIConfig.generalModel,
      messages: [
        {
          role: "system",
          content: `You are a hiring manager currently hiring for the position of "'${jobTitle}".`,
        },
        {
          role: "system",
          content: this.generateCorrespondencePromptContent(correspondences),
        },
      ],
    })

    return res.choices
  },
}
