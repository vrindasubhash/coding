//mastra2/tools/hello.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const hello = createTool({
  id: "hello",
  description: "Returns a friendly greeting. Use this to say hello.",
  inputSchema: z.object({ name: z.string().default("world") }),
  outputSchema: z.object({ message: z.string() }),
  execute: async ({ context: { name } }) => {
    return { message: `Hello, ${name}!` };
  },
});

