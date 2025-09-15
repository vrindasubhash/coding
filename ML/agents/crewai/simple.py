import os
from dotenv import load_dotenv

from crewai import Agent, Task, Crew, Process
from crewai.tools import tool

# --- env ---
load_dotenv()
if not os.environ.get("OPENAI_API_KEY"):
    raise SystemExit("Set OPENAI_API_KEY in a .env file or your shell.")

# --- a tiny tool: compare two numbers ---

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

# --- an agent that can use the tool ---
judge = Agent(
    role="Numerical Judge",
    goal="Given two numeric expressions, determine which is greater using tools before answering.",
    backstory="You are precise, cautious, and always verify with the compare tool.",
    tools=[multiply, compare_two],
    verbose=True,         # show step logs
    max_iter=5,           # keep it small but not 1; adjust if you want
)

# --- a single task using that agent ---
task = Task(
    description=(
        "Decide which is greater: 1234*567 or 3456*78. "
        "Do not compute directly. Instead, you must use the provided tools "
        "to multiply and compare before answering."
    ),
    agent=judge,
    expected_output="A one-line statement identifying the larger value.",
)

# --- assemble & run ---
crew = Crew(
    agents=[judge],
    tasks=[task],
    process=Process.sequential,  # simple linear flow
    verbose=True,
)

if __name__ == "__main__":
    result = crew.kickoff()
    print("\nFINAL RESULT:\n", result)

