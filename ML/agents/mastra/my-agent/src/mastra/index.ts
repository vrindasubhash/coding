import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";

// your existing bits
import { weatherWorkflow } from "./workflows/weather-workflow";
import { weatherAgent } from "./agents/weather-agent";
import { recruiter } from "./agents/recruiter";

// NEW: import the *same* diagrammer we exported above
import { diagrammer } from "./agents/diagrammer";

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: {
    weatherAgent,
    recruiter,
    diagrammer, // ← registered with the exact key you'll use in getAgent("diagrammer")
  },
  storage: new LibSQLStore({ url: ":memory:" }),
  logger: new PinoLogger({ name: "Mastra", level: "info" }),
});

