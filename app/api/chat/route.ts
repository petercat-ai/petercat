import { NextRequest, NextResponse } from 'next/server';
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';
import { BytesOutputParser } from 'langchain/schema/output_parser';
import { supabase } from '@/share/supabas-client';

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
    let promptString = '';
    if (body?.botId) {
      const res = await supabase
        .from('bots')
        .select('prompt')
        .eq('id', body?.botId);
      if (res?.error) {
        return NextResponse.json(
          { error: 'Bot is not exist' },
          { status: 400 },
        );
      }
      promptString = res?.data[0]?.prompt;
    } else if (body?.prompt) {
      promptString = body?.prompt;
    }
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const enableImgGeneration = body.enableImgGeneration ?? false;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      temperature: 0.8,
      modelName: 'gpt-4',
      maxTokens: -1,
    });

    const outputParser = new BytesOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
      prompt: promptString,
      chat_history: formattedPreviousMessages.join('\n'),
      input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
