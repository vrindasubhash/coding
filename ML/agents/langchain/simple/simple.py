import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

if not os.environ.get("OPENAI_API_KEY"):
  print("Create .env and put openai key")

from langchain.chat_models import init_chat_model

model = init_chat_model("gpt-4o-mini", model_provider="openai")

result = model.invoke("Hello, world!")
print(result.content)
