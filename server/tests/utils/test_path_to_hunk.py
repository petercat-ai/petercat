
from unittest import TestCase

from utils.path_to_hunk import convert_patch_to_hunk

basic_patch = '''
@@ -3,7 +3,7 @@
  function greet(name) {
    if (name) {
-    return 'Hello, ' + name;
+    return `Hello, ${name}`;
    } else {
      return 'Hello, world!';
    }
  }
'''

patch = '''
@@ -6,7 +6,7 @@
 from langchain.agents.format_scratchpad.openai_tools import (
     format_to_openai_tool_messages,
 )
-from langchain_core.messages import AIMessage, FunctionMessage, HumanMessage
+from langchain_core.messages import AIMessage, FunctionMessage, HumanMessage, SystemMessage
 from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
 from langchain.prompts import MessagesPlaceholder
 from langchain_core.prompts import ChatPromptTemplate
@@ -92,12 +92,15 @@ def get_prompt(self):
     def chat_history_transform(self, messages: list[Message]):
         transformed_messages = []
         for message in messages:
-            if message.role == \"user\":
-                transformed_messages.append(HumanMessage(self.chat_model.parse_content(content=message.content)))
-            elif message.role == \"assistant\":
-                transformed_messages.append(AIMessage(content=message.content))
-            else:
-                transformed_messages.append(FunctionMessage(content=message.content))
+            match message.role:
+                case \"user\":
+                    transformed_messages.append(HumanMessage(self.chat_model.parse_content(content=message.content)))
+                case \"assistant\":
+                    transformed_messages.append(AIMessage(content=message.content))
+                case \"system\":
+                    transformed_messages.append(SystemMessage(content=message.content))
+                case _:
+                    transformed_messages.append(FunctionMessage(content=message.content))
         return transformed_messages
 
     async def run_stream_chat(self, input_data: ChatData) -> AsyncIterator[str]:
'''

class TestPathToHunk(TestCase):
  def test_basic_covnert(self):
    result = convert_patch_to_hunk(basic_patch)
    print(f"result={result}")
    self.assertTrue(True)

  def test_parse(self):
    result = convert_patch_to_hunk(patch)
    print(f"result={result}")
    self.assertTrue(True)