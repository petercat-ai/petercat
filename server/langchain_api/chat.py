from langchain.chat_models import ChatOpenAI
from langchain.prompts import (
    ChatPromptTemplate,
    AIMessagePromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate
)


def langchain_chat(input_data, openai_api_key):
    try:
        llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.8, openai_api_key=openai_api_key)
        system_prompt = input_data.prompt if input_data.prompt else "You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect."
        prompt_list = [SystemMessagePromptTemplate.from_template(system_prompt)]
        assert len(input_data.messages) >= 1, "Message length should grater than 0"
        assert input_data.messages[-1].role == "user", "Last message role should be user"

        for _, message in enumerate(input_data.messages[:-1]):
            if message.role == "user":
                prompt_list.append(HumanMessagePromptTemplate.from_template(message.content))
            elif message.role == "assistant":
                prompt_list.append(AIMessagePromptTemplate.from_template(message.content))
            else:
                prompt_list.append(ChatPromptTemplate.from_template(message.content))

        prompt_list.append(HumanMessagePromptTemplate.from_template("{text}"))
        prompt = ChatPromptTemplate.from_messages(prompt_list)
        input = input_data.messages[-1].content
        res = llm(prompt.format_prompt(text=input).to_messages()).content
        return {
            "success": True,
            "result": res
        }
    except Exception as e:
        return {
            "success": False,
            "errorMessage": str(e)
        }
