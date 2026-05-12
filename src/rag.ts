import Anthropic from "@anthropic-ai/sdk";
import { search } from "./vectorStore";
import dotenv from "dotenv";

dotenv.config();

const client = new Anthropic();

export async function ask(question: string): Promise<string> {
  const relevantChunks = await search(question, 2);
  const context = relevantChunks.join("\n");

  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Answer the question using only context below.
                If the answer is not in the context, say "I don't know"

                Context: ${context}

                Question: ${question}`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}
