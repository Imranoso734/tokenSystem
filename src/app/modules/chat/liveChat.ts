import { db } from "@/core/database"
import { Validate } from "@/core/helpers/Validate"
import { OpenAIService } from "@/core/openAi"
import { openAIConfig } from "@/core/openAi/openAIConfig"
import { PerplexityAIService } from "@/core/perplexity"
import { MessageHandler } from "@/core/server/plugins/SocketRoutesPlugin"
import { FromSchema } from "json-schema-to-ts"
import { ObjectId } from "mongodb"

const textMessageSchema = {
    type: "object",
    properties: {
        userId: { type: "string" },
        text: { type: "string" },
    },
    required: ["text", "userId"],
    additionalProperties: false,
} as const

type textMessage = FromSchema<typeof textMessageSchema>

/**
 *  echo the received message back to the client
 *
 */
export const chatWithGPT: MessageHandler = async (socket, payload) => {

    const body = Validate.validateWithException<textMessage>(
        textMessageSchema,
        payload,
    )

    const resp = await OpenAIService.generateQuery(body.text, body.userId)
    socket.send({ message: "Assistant", reponse: resp })

}

export const chatWithGPTTesting: MessageHandler = async (socket, payload) => {

    const body = Validate.validateWithException<textMessage>(
        textMessageSchema,
        payload,
    )

    // const resp = await OpenAIService.generateQuery(body.text, body.userId)
    // socket.send({ message: "Assistant", reponse: resp })
    const resp = await PerplexityAIService.generateQuery(body.text)


    // const resp = await db.userQuery.findMany()



    socket.send({ message: "Assistant", reponse: resp })

}


export const completeQueryWithGPT: MessageHandler = async (socket, payload) => {

    const body = Validate.validateWithException<textMessage>(
        textMessageSchema,
        payload,
    )

    let messages: { role: "user" | "assistant" | "system"; content: string }[] = [
        {
            role: "system",
            content: openAIConfig.systemRole,
        },
        {
            role: "user",
            content: body.text,
        },
    ];

    let isComplete = false;

    // Loop until the query is complete
    while (!isComplete) {
        // Create a chat completion request to generate interview questions
        const res = await OpenAIService.instance.chat.completions.create({
            model: openAIConfig.generalModel,
            messages: messages,
        });
        const content: any = res.choices[0].message.content;
        messages.push({ role: "assistant", content });

        // Ask user to answer the question
        const userAnswer = await new Promise<string>((resolve, reject) => {
            socket.send({ reponse: content });
            // socket.on("message", (message: any) => {
            //     resolve(message);
            // });
            setTimeout(() => reject("Timed out"), 3000);
        });

        messages.push({ role: "user", content: userAnswer });

        console.log("userAnswer", userAnswer);

        if (userAnswer === "Done.") {
            isComplete = true;
        }
    }

    // Process the final query
    const finalQuery = messages.map((m) => m.content).join(" ");
    console.log("Final Query", finalQuery);

    // Return the final query
    socket.send({ message: "Final Query", reponse: finalQuery });
}