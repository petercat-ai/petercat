import { NextRequest, NextResponse } from 'next/server';
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { z } from 'zod';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';
import zodToJsonSchema from 'zod-to-json-schema';
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';

export const runtime = process.env.PROXY_URL ? undefined : 'edge';

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `{prompt}

Current conversation:
{chat_history}

User: {input}
AI:`;

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const promptString =
      body?.prompt ??
      'You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.';
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    /**
     * You can also try e.g.:
     *
     * import { ChatAnthropic } from "langchain/chat_models/anthropic";
     * const model = new ChatAnthropic({});
     *
     * See a full list of supported models at:
     * https://js.langchain.com/docs/modules/model_io/models/
     */
    const model = new ChatOpenAI({
      temperature: 0.8,
      modelName: 'gpt-4',
      configuration: process.env.PROXY_URL
        ? {
            httpAgent: new HttpsProxyAgent(process.env.PROXY_URL!),
          }
        : undefined,
    });

    const schema = z.object({
      tone: z
        .enum(['positive', 'negative', 'neutral'])
        .describe('The overall tone of the input'),
      output: z.string().describe("answer to the user's question"),
    });

    /**
     * Bind the function and schema to the OpenAI model.
     * Future invocations of the returned model will always use these arguments.
     *
     * Specifying "function_call" ensures that the provided function will always
     * be called by the model.
     */
    const functionCallingModel = model.bind({
      functions: [
        {
          name: 'output_formatter',
          description: 'Should always be used to properly format output',
          parameters: zodToJsonSchema(schema),
        },
      ],
      function_call: { name: 'output_formatter' },
    });

    const chain = prompt
      .pipe(functionCallingModel)
      .pipe(new JsonOutputFunctionsParser());

    const result = await chain.invoke({
      prompt: promptString,
      chat_history: formattedPreviousMessages.join('\n'),
      input: currentMessageContent,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
