import { ConvexClient } from "convex/browser";

const DEFAULT_CONVEX_URL = "https://fine-terrier-887.convex.cloud";
const CONVEX_URL = DEFAULT_CONVEX_URL;

export const convexClient = new ConvexClient(CONVEX_URL);
