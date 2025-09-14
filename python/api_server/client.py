import requests

BASE_URL = "http://127.0.0.1:8000"

# Test root endpoint
response = requests.get(BASE_URL + "/")
print("Root:", response.json())

# Test GET with path parameter
response = requests.get(BASE_URL + "/greet/Vrinda")
print("Greet:", response.json())

# Test POST with JSON body
item_data = {"name": "Notebook", "price": 50.0, "quantity": 3}
response = requests.post(BASE_URL + "/items/", json=item_data)
print("Post Item:", response.json())

