import "dotenv/config";
import { writeFileSync } from "fs";
import { mastra } from "./mastra";
import { WireframeTool } from "./mastra/tools/wireframe-excalidraw.tool";

async function main() {
  const diagrammer = mastra.getAgent("diagrammer");

  const prompt = `
Create a lo-fi UI wireframe for a "Team Dashboard".
Include: Header, Sidebar, Content area listing: Projects, Activity, Settings.
Use the wireframe-excalidraw tool and return ONLY the tool output.
`;

  const res = await diagrammer.generate([{ role: "user", content: prompt }]);

  // Prefer tool output if the agent called the tool
  let scene = (res as any).tool?.output?.scene;

  // Fallback: call the tool directly so your demo still succeeds
  if (!scene) {
    const direct = await WireframeTool.execute({
      args: {
        pageTitle: "Team Dashboard",
        sections: ["Projects", "Activity", "Settings"],
      },
    });
    scene = direct.scene;
  }

  writeFileSync("wireframe.excalidraw.json", JSON.stringify(scene, null, 2));
  console.log("Wireframe saved to wireframe.excalidraw.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

