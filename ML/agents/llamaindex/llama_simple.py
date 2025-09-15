import asyncio
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.llms.openai import OpenAI
from llama_index.core.tools import FunctionTool


from llama_index.core import set_global_handler
set_global_handler("simple")  # or "rich" for a nicer tree view


import os
from dotenv import load_dotenv


# =========================
# Env & LLM
# =========================
load_dotenv()
if not os.environ.get("OPENAI_API_KEY"):
    print("Create a .env with OPENAI_API_KEY=...")


# Define a simple calculator tool
def multiply(a: float, b: float) -> float:
    """Useful for multiplying two numbers."""
    return a * b


multiply_tool = FunctionTool.from_defaults(fn=multiply, name="multiply")


# Create an agent workflow with our calculator tool
agent = FunctionAgent(
    tools=[multiply_tool],
    llm=OpenAI(model="gpt-4o-mini"),
    system_prompt="You are a helpful assistant that can multiply two numbers.",
)


async def main():
    # Run the agent
    response = await agent.run("What is 1234 * 4567?")
    print(str(response))


# Run the agent
if __name__ == "__main__":
    asyncio.run(main())
