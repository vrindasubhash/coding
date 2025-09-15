import asyncio, os
from dotenv import load_dotenv

from llama_index.llms.openai import OpenAI
from llama_index.core.agent.workflow import ReActAgent, AgentStream, ToolCallResult
from llama_index.core.tools import FunctionTool
from llama_index.core.workflow import Context

# ========= Env =========
load_dotenv()
assert os.environ.get("OPENAI_API_KEY"), "Set OPENAI_API_KEY in your .env"

# ========= Tools =========
def multiply(a: float, b: float) -> float:
    """Multiply two numbers and return the product."""
    return a * b

def verify_product(a: float, b: float) -> str:
    """Recompute the product to verify the prior result; returns a short message."""
    return f"Verified: {a*b}"

multiply_tool = FunctionTool.from_defaults(
    fn=multiply, name="multiply", description="Multiply two numbers."
)
verify_tool = FunctionTool.from_defaults(
    fn=verify_product, name="verify_product",
    description="Recompute the product to confirm the result."
)

# ========= Agent =========
llm = OpenAI(model="gpt-4o-mini", temperature=0)
agent = ReActAgent(tools=[multiply_tool, verify_tool], llm=llm)
ctx = Context(agent)  # maintain state/history across steps

async def main():
    # Nudge the agent to be thorough, but don't force a fixed number of steps.
    q = (
        "Compute 1234 * 4567. If helpful, call tools and verify before answering. "
        "Be thorough and only give the final answer after you’re confident."
    )

    # Start the run; do NOT pass max_iterations (no artificial cap).
    handler = agent.run(q, ctx=ctx)

    # Stream events as they happen:
    async for ev in handler.stream_events():
        if isinstance(ev, ToolCallResult):
            # Shows which tool ran, with args and output
            print(f"\n[TOOL] {ev.tool_name}({ev.tool_kwargs}) -> {ev.tool_output.raw_output}")
        elif isinstance(ev, AgentStream):
            # Live agent output (tokens). Good for progress feedback.
            # (Some models may not stream; LlamaIndex handles that.)
            print(ev.delta, end="", flush=True)

    # Final response object (includes tool_calls for post-hoc inspection)
    response = await handler
    print("\n\nFINAL:", response.response)
    print("TOOL CALLS:", response.tool_calls)

if __name__ == "__main__":
    asyncio.run(main())

