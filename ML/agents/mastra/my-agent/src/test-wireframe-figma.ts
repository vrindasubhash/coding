import "dotenv/config";
import { writeFileSync } from "fs";
import { mastra } from "./mastra";
import { FigmaWireframeTool } from "./mastra/tools/wireframe-figma.tool";

async function main() {
  const diagrammer = mastra.getAgent("diagrammer");

  const prompt = `
Create a lo-fi UI wireframe for a "Team Dashboard".
Include: Header, Sidebar, Content area listing: Projects, Activity, Settings.
Use the wireframe-figma tool and return ONLY the tool output.
`;

  const res = await diagrammer.generate([{ role: "user", content: prompt }]);

  // Prefer tool output if the agent called the tool
  let figma = (res as any).tool?.output?.figma;

  // Fallback: call the tool directly so the demo still succeeds
  if (!figma) {
    const direct = await FigmaWireframeTool.execute({
      args: {
        pageTitle: "Team Dashboard",
        sections: ["Projects", "Activity", "Settings"],
      },
    } as any);
    figma = direct.figma;
  }

  writeFileSync("wireframe.figma.json", JSON.stringify(figma, null, 2));
  console.log("Figma payload saved to wireframe.figma.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
