import os
from dotenv import load_dotenv
from datetime import datetime
from datetime import date

# 1) Load env vars
load_dotenv()
if not os.environ.get("OPENAI_API_KEY"):
    raise SystemExit("Create a .env file with OPENAI_API_KEY=...")

# 2) LangChain imports
from langchain.chat_models import init_chat_model
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import AgentExecutor, create_tool_calling_agent

# 3) Define simple tools
@tool
def add(a: int, b: int) -> int:
    """Return the sum of two integers."""
    return a + b

@tool
def multiply(a: int, b: int) -> int:
    """Return the product of two integers."""
    return a * b

@tool
def compare(a: int, b: int) -> str:
    """Compare two integers and return which one is greater."""
    if a > b:
        return f"{a} is greater than {b}"
    elif b > a:
        return f"{b} is greater than {a}"
    else:
        return f"{a} is equal to {b}"

@tool
def get_time() -> str:
    """Return the current local time as an ISO string."""
    return datetime.now().isoformat(timespec="seconds")

@tool
def get_date() -> str:
    """Return the current date as an ISO string (YYYY-MM-DD)."""
    return date.today().isoformat()

tools = [add, multiply, compare, get_time, get_date]

# 4) Make a tool-calling agent
model = init_chat_model("gpt-4o-mini", model_provider="openai")

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant. Use tools when needed and show your final answer clearly."),
        ("human", "{input}"),
        # Agent scratchpad placeholder is required so the agent can think & insert tool traces.
        ("placeholder", "{agent_scratchpad}"),
    ]
)

agent = create_tool_calling_agent(model, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# 5) Run it
# Update the question to match the standardized format
question = "Which is greater: 2589113 * 7894 or 1894628 * 3581? or 199928 * 29991"

# Update the agent execution to use the standardized question
result = agent_executor.invoke({"input": question})

print("\nQ:", question)
print("A:", result["output"])

