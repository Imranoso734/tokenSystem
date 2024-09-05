import fetch from "node-fetch"
import { perplexityAIConfig } from "./perplexityAIConfig";

export const PerplexityAIService = {
    instance: (() => {
        const headers = {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Bearer ${perplexityAIConfig.apiKey}`
        }
        return { headers } // Return the headers object
    })(),

    async generateQuery(userQuery: string) {
        const url = 'https://api.perplexity.ai/chat/completions'
        const options = {
            method: 'POST',
            headers: this.instance.headers, // Use the headers object
            body: JSON.stringify({
                model: perplexityAIConfig.generalModel,
                messages: [
                    { role: 'system', content: perplexityAIConfig.systemRole },
                    { role: 'user', content: `${userQuery}. Please include images of the product as well.` } // Use the userQuery parameter
                ],
                // return_citations: true,
                return_images: true
            })
        }

        try {
            const response = await fetch(url, options);
            const json = await response.json();
            console.log(json.choices);
            return json.choices
        } catch (error) {
            console.error('Error:', error);
            return error
        }
    }
}