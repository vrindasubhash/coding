import "dotenv/config";
import { mastra } from "./mastra";

const agent = mastra.getAgent("recruiter");

const res = await agent.generate([
  { role: "user", content: "Help me write a 2-line outreach to a data engineer." }
]);

console.log(res.text);

