# 🦉 Snowy Owl (xuě xiāo)

English | <img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18">  [简体中文](./README.zh-CN.md) 

Pitaoren Company. Here, you can freely create an organization, company, or project and hire different Pitouren  (bots) to help you complete the work. This allows you to overcome your own shortcomings and focus on your strengths.

Definition:

* Pitaoren: Atomic functions, electronic avatars that can have pre-set identities and abilities.
* Organization: A group of Pitaoren that define collaborative workflows to collectively achieve multiple goals.
* Company: Can define company functions and hire pitouren.
* Scenario: By using pre-set scenario templates, you can easily replicate the Pitaoren and their collaborative workflows required for a specific scenario.

Example:

* eg: I want to create a project. I can create an organization named "xuexiao" and define roles within the organization such as designer, developer, and tester. I can set project goals and use Pitaoren to complete the entire project lifecycle.
* eg: I want to release a song, but I only have a demo. So, I need a Pitaoren music studio where I can add Pitaoren lyricists, Pitaoren composers, and Pitaoren singers to produce a complete work.
* eg: AI town, game...

## 🚀 Getting Started

First, clone this repo and download it locally.

Next, you'll need to set up environment variables in your repo's `.env.local` file. Copy the `.env.example` file to `.env.local`.
To start with the basic examples, you'll just need to add your OpenAI API key.

Next, install the required packages using your preferred package manager (e.g. `yarn`).

Now you're ready to run the development server:


```bash  
yarn run bootstrap                                                                                                                                            
yarn run dev
yarn run fastapi-dev
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result! Ask the bot something and you'll see a streamed response:

![A streaming conversation between the user and the AI](/public/images/chat-conversation.png)

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Backend logic lives in `app/api/chat/route.ts`. From here, you can change the prompt and model, or add other modules and logic.

## 🧱 Structured Output

The second example shows how to have a model return output according to a specific schema using OpenAI Functions.
Click the `Structured Output` link in the navbar to try it out:

![A streaming conversation between the user and an AI agent](/public/images/structured-output-conversation.png)

The chain in this example uses a [popular library called Zod](https://zod.dev) to construct a schema, then formats it in the way OpenAI expects.
It then passes that schema as a function into OpenAI and passes a `function_call` parameter to force OpenAI to return arguments in the specified format.

For more details, [check out this documentation page](https://js.langchain.com/docs/modules/chains/popular/structured_output).

## 🦜 Agents

To try out the agent example, you'll need to give the agent access to the internet by populating the `SERPAPI_API_KEY` in `.env.local`.
Head over to [the SERP API website](https://serpapi.com/) and get an API key if you don't already have one.

You can then click the `Agent` example and try asking it more complex questions:

![A streaming conversation between the user and an AI agent](/public/images/agent-conversation.png)

This example uses the OpenAI Functions agent, but there are a few other options you can try as well.
See [this documentation page for more details](https://js.langchain.com/docs/modules/agents/agent_types/).

## 🐶 Retrieval

The retrieval examples both use Supabase as a vector store. However, you can swap in
[another supported vector store](https://js.langchain.com/docs/modules/data_connection/vectorstores/integrations/) if preferred by changing
the code under `app/api/retrieval/ingest/route.ts`, `app/api/chat/retrieval/route.ts`, and `app/api/chat/retrieval_agents/route.ts`.

For Supabase, follow [these instructions](https://js.langchain.com/docs/modules/data_connection/vectorstores/integrations/supabase) to set up your
database, then get your database URL and private key and paste them into `.env.local`.

You can then switch to the `Retrieval` and `Retrieval Agent` examples. The default document text is pulled from the LangChain.js retrieval
use case docs, but you can change them to whatever text you'd like.

For a given text, you'll only need to press `Upload` once. Pressing it again will re-ingest the docs, resulting in duplicates.
You can clear your Supabase vector store by navigating to the console and running `DELETE FROM docuemnts;`.

After splitting, embedding, and uploading some text, you're ready to ask questions!

![A streaming conversation between the user and an AI retrieval chain](/public/images/retrieval-chain-conversation.png)

![A streaming conversation between the user and an AI retrieval agent](/public/images/retrieval-agent-conversation.png)

For more info on retrieval chains, [see this page](https://js.langchain.com/docs/use_cases/question_answering/).
The specific variant of the conversational retrieval chain used here is composed using LangChain Expression Language, which you can
[read more about here](https://js.langchain.com/docs/guides/expression_language/cookbook). This chain example will also return cited sources
via header in addition to the streaming response.

For more info on retrieval agents, [see this page](https://js.langchain.com/docs/use_cases/question_answering/conversational_retrieval_agents).


