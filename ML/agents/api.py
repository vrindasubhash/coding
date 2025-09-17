from fastapi import FastAPI
from pydantic import BaseModel
import subprocess

app = FastAPI()

class Query(BaseModel):
    framework: str
    question: str

@app.post("/query")
async def query_framework(query: Query):
    if query.framework == "crewai":
        result = subprocess.run(["python", "crewai/reAct_style.py", query.question], capture_output=True, text=True)
    elif query.framework == "langchain_reAct":
        result = subprocess.run(["python", "langchain/reAct/reAct_traced.py", query.question], capture_output=True, text=True)
    elif query.framework == "llamaindex":
        result = subprocess.run(["python", "llamaindex/llama_reAct.py", query.question], capture_output=True, text=True)
    elif query.framework == "langchain_tools":
        result = subprocess.run(["python", "langchain/tools/tools.py", query.question], capture_output=True, text=True)
    else:
        return {"error": "Invalid framework"}

    if result.returncode != 0:
        return {"error": result.stderr}

    return {"output": result.stdout}
