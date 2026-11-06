import * as pendo from "pendo-server-sdk";
import { createApp } from "./app.js";

// Pendo Agent Analytics for the Tripwise Assistant (writeAssistantReply). Once per process, before the server starts.
pendo.init({
  apiKey: "e363316f-7cf2-4480-aa93-fdad40f36eeb",
  agentId: "a6R1ZSfhd8bO5nkD1pcWX6j0sfE",
  endpoint: "https://app.pendo-dev.pendo-dev.com",
  autoPatch: true,
});

const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const server = createApp(corsOrigin).listen(port, () => {
  console.log(`Tripwise API on port ${port}, allowing ${corsOrigin}`);
});

/** Stops taking requests and sends Pendo's buffered events before the process exits. */
async function stop(): Promise<void> {
  server.close();
  await pendo.shutdown();
  process.exit(0);
}

process.on("SIGINT", () => void stop());
process.on("SIGTERM", () => void stop());
