import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import {ENV} from "./env.js";

let aj = null;

try {
  if (ENV.ARCJET_KEY) {
    aj = arcjet({
      key: ENV.ARCJET_KEY,
      rules: [
        // Shield protects your app from common attacks e.g. SQL injection
        shield({ mode: "LIVE" }),
        // Create a bot detection rule
        detectBot({
          mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
          // Block all bots except the following
          allow: [
            "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
          ],
        }),
        // Create a token bucket rate limit. Other algorithms are supported.
        slidingWindow({
          mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
          max: 100, // Max 100 requests
          interval: 60,
        }),
      ],
    });
  } else {
    console.warn("ARCJET_KEY not set — Arcjet protection is disabled");
  }
} catch (error) {
  console.error("Failed to initialize Arcjet:", error.message);
  aj = null;
}

export default aj;