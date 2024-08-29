
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
basic_hunk = '''NewFile OldFile SourceCode 
0     0     
3     3       function greet(name) {
4     4         if (name) {
      5     -    return 'Hello, ' + name;
5           +    return `Hello, ${name}`;
6     6         } else {
7     7           return 'Hello, world!';
8     8         }
9     9       }'''

long_patch = '''
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

long_hunk = '''NewFile OldFile SourceCode 
0     0     
6     6      from langchain.agents.format_scratchpad.openai_tools import (
7     7          format_to_openai_tool_messages,
8     8      )
      9     -from langchain_core.messages import AIMessage, FunctionMessage, HumanMessage
9           +from langchain_core.messages import AIMessage, FunctionMessage, HumanMessage, SystemMessage
10    10     from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
11    11     from langchain.prompts import MessagesPlaceholder
12    12     from langchain_core.prompts import ChatPromptTemplate
92    92         def chat_history_transform(self, messages: list[Message]):
93    93             transformed_messages = []
94    94             for message in messages:
      95    -            if message.role == "user":
      96    -                transformed_messages.append(HumanMessage(self.chat_model.parse_content(content=message.content)))
      97    -            elif message.role == "assistant":
      98    -                transformed_messages.append(AIMessage(content=message.content))
      99    -            else:
      100   -                transformed_messages.append(FunctionMessage(content=message.content))
95          +            match message.role:
96          +                case "user":
97          +                    transformed_messages.append(HumanMessage(self.chat_model.parse_content(content=message.content)))
98          +                case "assistant":
99          +                    transformed_messages.append(AIMessage(content=message.content))
100         +                case "system":
101         +                    transformed_messages.append(SystemMessage(content=message.content))
102         +                case _:
103         +                    transformed_messages.append(FunctionMessage(content=message.content))
104   101            return transformed_messages
105   102    
106   103        async def run_stream_chat(self, input_data: ChatData) -> AsyncIterator[str]:'''
class TestPathToHunk(TestCase):
  def test_basic_covnert(self):
    result = convert_patch_to_hunk(basic_patch)
    self.assertEqual(result.replace("\\n", "\n"), basic_hunk)

  def test_parse(self):
    result = convert_patch_to_hunk(long_patch)
    self.assertEqual(result, long_hunk.replace("\\n", "\n"))