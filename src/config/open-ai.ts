import { OpenAI } from "@langchain/openai";
import Configuration from "openai";
import dotenv from "dotenv";
dotenv.config();

var openAiConfig: Configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openAi = new OpenAI({
  ...openAiConfig,
  temperature: 0,
});

export default openAi;
