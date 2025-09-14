from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Example data model
class Item(BaseModel):
    name: str
    price: float
    quantity: int

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Hello, API is running!"}

# GET endpoint with parameter
@app.get("/greet/{username}")
def greet_user(username: str):
    return {"message": f"Hello, {username}!"}

# GET endpoint with parameter
@app.get("/bark/{username}")
def bark_at_user(username: str):
    return {"message": f"Bow bow, {username}!"}

# POST endpoint to accept JSON body
@app.post("/items/")
def create_item(item: Item):
    total_cost = item.price * item.quantity
    return {"item": item.name, "total_cost": total_cost}

