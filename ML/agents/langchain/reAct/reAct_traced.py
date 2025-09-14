from langchain.agents import initialize_agent, Tool
from langchain.prompts import MessagesPlaceholder
from langchain.memory import ConversationBufferMemory
from langchain_openai import ChatOpenAI

from pydantic import BaseModel
from typing import List

import os
from dotenv import load_dotenv


# =========================
# Env & LLM
# =========================
load_dotenv()
if not os.environ.get("OPENAI_API_KEY"):
    print("Create a .env with OPENAI_API_KEY=...")

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)


# =========================
# Tools
# =========================
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
    ),
]


# =========================
# System guidance
# =========================
system_prompt = """
You must use tools to perform arithmetic (no mental math).
Before multiplying or comparing, validate that inputs are integers using IsInt.
If a parameter is not an integer, say so and stop.
"""


# =========================
# Memory (simple buffer)
# =========================
# Note: LangChain warns to migrate to RunnableWithMessageHistory; this keeps your original setup.
memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True,
    output_key="output"
)


# =========================
# Agent (ReAct conversational)
# =========================
agent = initialize_agent(
    tools,
    llm,
    agent="chat-conversational-react-description",
    verbose=True,
    memory=memory,
    return_intermediate_steps=True
)


# =========================
# Planner (visible reasoning)
# =========================
class Plan(BaseModel):
    summary: str
    steps: List[str]
    risks: List[str] = []
    assumptions: List[str] = []

planner = llm.with_structured_output(Plan)


def make_plan(question: str) -> Plan:
    prompt = f"""
You are planning how to solve the user's task using ONLY the available tools.
Do not call any tool and do not solve the math yet. Just plan.

Tools you can use later:
- Multiply_nums(a,b): multiply two integers provided as "a,b"
- Compare_nums(a,b): compare two integers provided as "a,b"
- IsInt(s): check if a string is a valid integer

User question:
{question}

Return:
- summary: brief 1–3 sentence description of your approach
- steps: 2–6 concrete steps in order, starting with input validation
- assumptions: anything you’re assuming about the input
- risks: edge cases or ways the plan could fail
""".strip()
    return planner.invoke(prompt)


# =========================
# Run
# =========================
if __name__ == "__main__":
    question = "Which is greater: 2589113 * 7894 or 1894628 * 3581? or 199928 * 29991"

    """
    # enable for tracing
    # 1) Show a visible PLAN (reasoning before acting)
    plan = make_plan(question)

    print("\n=== PLAN (high-level reasoning) ===")
    print(plan.summary)
    print("\nSteps:")
    for i, s in enumerate(plan.steps, 1):
        print(f"{i}. {s}")
    if plan.assumptions:
        print("\nAssumptions:", "; ".join(plan.assumptions))
    if plan.risks:
        print("Risks:", "; ".join(plan.risks))
    """

    # 2) Execute with the ReAct agent
    print("\n=== EXECUTION (tool trace) ===")
    result = agent.invoke({"input": system_prompt + "\n\n" + question})

    # 3) Show intermediate tool calls and observations
    for action, observation in result["intermediate_steps"]:
        print("\nTOOL:", action.tool)
        print("INPUT:", action.tool_input)
        print("OBSERVATION:", observation)

    # 4) Final answer
    print("\n=== FINAL ANSWER ===")
    print(result["output"])

    # 5) Short explicit reasoning summary (post-hoc, not hidden CoT)
    print("\n=== REASONING SUMMARY ===")
    print(
        "Followed the plan: validated integer-like inputs, computed each product with Multiply_nums, "
        "then used Compare_nums to determine which product is largest and reported it."
    )

