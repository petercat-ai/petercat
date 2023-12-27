import os
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.utilities.dalle_image_generator import DallEAPIWrapper


def img_generator(input_data, openai_api_key):
    try:
        os.environ["OPENAI_API_KEY"] = openai_api_key
        description = input_data.text
        llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.8, openai_api_key=openai_api_key)
        prompt = PromptTemplate(
            input_variables=["image_desc"],
            template="Generate a detailed prompt to generate an image based on the following description : {image_desc}. Result should be in 100 words",
        )
        chain = LLMChain(llm=llm, prompt=prompt)
        chain_res = chain.run(description)
        image_url = DallEAPIWrapper().run(chain_res)
        return {
            "success": True,
            "result": image_url
        }
    except Exception as e:
        return {
            "success": False,
            "errorMessage": str(e)
        }
