from langchain.agents import initialize_agent, Tool
from langchain.prompts import MessagesPlaceholder
from langchain.memory import ConversationBufferMemory

from langchain_openai import ChatOpenAI

import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

if not os.environ.get("OPENAI_API_KEY"):
  print("Create .env and put openai key")

# Initialize LLM
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)


def isInt(s: str) -> bool:
    """Return True if s can be safely converted to int, else False."""
    try:
        int(s)
        return True
    except ValueError:
        return False

def multiplier(s: str) -> str:
    """Multiply two integers given as a comma-separated string."""
    a, b = s.split(",")
    return str(int(a.strip()) * int(b.strip()))

def comparator(s: str) -> str:
    """Compare two integers given as a comma-separated string."""
    a, b = s.split(",")
    a, b = int(a.strip()), int(b.strip())
    if a > b:
        return f"{a} is greater than {b}"
    elif a < b:
        return f"{a} is less than {b}"
    else:
        return f"{a} is equal to {b}"

tools = [
    Tool(
        name="Multiply_nums",
        func=multiplier,
        description="Useful for multiplying 2 integers. Input format: 'a,b'"
    ),
    Tool(
        name="Compare_nums",
        func=comparator,
        description="Compare two integers. Each has to be an integer, not an expression. Input format: 'a,b'"
    ),
    Tool(
        name="IsInt",
        func=isInt,
        description="Check if a string represents a valid integer. Input: a string."
    )
]

system_prompt = """
Always use tools to perform arithmetic.
If there are no tools available, say 'I don't know how to do this.' 
Always check that parameters are integers using the tool.
"""

# Memory for conversation
memory = ConversationBufferMemory(
         memory_key="chat_history", 
         return_messages=True, 
         output_key="output" # tell the memory what the output
)

# Initialize agent in ReAct mode
agent = initialize_agent(
    tools,
    llm,
    agent="chat-conversational-react-description",
    verbose=True,
    memory=memory,
    return_intermediate_steps=True
)

# Run some queries
question = "Which is greater: 2589113 * 7894 or 1894628 * 3581? or 199928 * 29991"
result = agent({"input": system_prompt + question})


for action, observation in result["intermediate_steps"]:
    print("TOOL:", action.tool)
    print("INPUT:", action.tool_input)
    print("OBSERVATION:", observation)

print(result["output"])
