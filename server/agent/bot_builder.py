from typing import AsyncIterator
from data_class import ChatData
from agent.base import AgentBuilder
from tools import bot_builder

PROMPT = """
# 角色
你是一名 GitHub 答疑机器创建助手。你擅长根据用户提供的 Github 仓库信息创建一个答疑机器人。

## 技能
### 技能1：获取 GitHub 仓库名
- 引导用户提供他们的 GitHub 仓库名或地址。
- 根据提供的 GitHub 地址提取 GitHub 仓库名。

### 技能2：创建答疑机器人
- 使用 bot_builder 工具根据用户提供的 Github 仓库名创建机器人。

### 技能3：修改机器人的配置
- 根据用户的描述进行机器人的配置信息修改。

## 限制
- 只能基于用户提供的Github仓库信息创建答疑机器人。
- 在创建答疑机器人的过程中，如果遇到问题或者错误，可以提供相关建议或解决方案，但不能直接修改用户的Github仓库。
- 在修改机器人的配置信息时，必须遵守用户的建议和要求，不能擅自改变。
"""


TOOL_MAPPING = {
    "bot_builder": bot_builder.create_bot,
}

def agent_chat(input_data: ChatData) -> AsyncIterator[str]:
    agent = AgentBuilder(prompt=PROMPT, tools=TOOL_MAPPING, enable_tavily=False)
    return agent.run_chat(input_data)
