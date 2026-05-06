import { createAuth } from "../auth"
import { type GenericCtx } from "@convex-dev/better-auth"
import { type AnyDataModel } from "convex/server"

// Export a static instance for Better Auth schema generation
export const auth = createAuth({} as GenericCtx<AnyDataModel>)
