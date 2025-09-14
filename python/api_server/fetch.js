// run using node fetch.js

const BASE = "http://127.0.0.1:8000";

async function main() {
  // GET
  const g = await fetch(`${BASE}/`);
  console.log("Root:", await g.json());

  // GET with param
  const greet = await fetch(`${BASE}/greet/Vrinda`);
  console.log("Greet:", await greet.json());

  // POST
  const item = await fetch(`${BASE}/items/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Notebook", price: 50.0, quantity: 3 }),
  });
  console.log("Post Item:", await item.json());
}

main().catch(console.error);

