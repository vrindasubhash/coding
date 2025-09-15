import os
from dotenv import load_dotenv

from crewai import Agent, Task, Crew, Process
from crewai.tools import tool

# ========= Env =========
load_dotenv()
if not os.environ.get("OPENAI_API_KEY"):
    raise SystemExit("Set OPENAI_API_KEY in a .env file or your shell.")

# ========= Tools =========
@tool("Multiply two numbers")
def multiply(a: float, b: float) -> float:
    """Multiply two numbers and return the result."""
    return a * b

@tool("Compare two numbers")
def compare_two(a: float, b: float) -> str:
    """Return which of the two numbers is greater (or if equal)."""
    if a > b:
        return f"{a} is greater than {b}"
    elif a < b:
        return f"{b} is greater than {a}"
    else:
        return f"{a} and {b} are equal"

# ========= Agent (ReAct-style prompting) =========
react_policy = (
    "Follow this strict loop until you can answer:\n"
    "1) Thought: describe the next step.\n"
    "2) Action: call ONE tool with JSON args only.\n"
    "3) Observation: note the tool result.\n"
    "Repeat Thought→Action→Observation as needed. "
    "Do NOT do arithmetic in your head; use tools for all numeric steps. "
    "Only after the last Observation, provide a single Final Answer."
)

judge = Agent(
    role="ReAct-Style Numerical Judge",
    goal=(
        "Given two numeric expressions, compute their values via tools only and decide which is greater."
    ),
    backstory=(
        "You are precise and tool-driven. You never compute internally; you always use tools, "
        "and you present your work in a clear ReAct loop."
    ),
    tools=[multiply, compare_two],
    verbose=True,          # show step logs in the console
    max_iter=10,           # safety cap (not a forced count; stops runaway loops)
)

# ========= Task =========
task = Task(
    description=(
        "Decide which expression is greater: 1234*567 or 3456*78. "
        "You MUST use tools for all arithmetic and comparison. "
        f"{react_policy}"
    ),
    agent=judge,
    expected_output=(
        "Final Answer: <one-line statement identifying the larger value>"
    ),
)

# ========= Run =========
crew = Crew(
    agents=[judge],
    tasks=[task],
    process=Process.sequential,
    verbose=True,
)

if __name__ == "__main__":
    result = crew.kickoff()
    print("\nFINAL RESULT:\n", result)

