import { ChatOpenAI, OpenAI } from '@langchain/openai';
import dotenv from 'dotenv';
import Configuration from 'openai';
dotenv.config();

const openAiConfig: Configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openAi = new OpenAI({
  ...openAiConfig,
  temperature: 0
});

const chatOpenAi = new ChatOpenAI({
  ...openAiConfig,
  temperature: 0,
  __includeRawResponse: false
});

export { chatOpenAi, openAi };

