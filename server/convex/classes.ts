import { v } from "convex/values"
import { mutation } from "./_generated/server"
import { error } from "node:console"
import { expectFailure } from "node:test"

export const updateWindowName = mutation({
  args: {
    currentWindow: v.optional(v.string()),
    clientSecret: v.string(),
  },
  handler: async (ctx, { clientSecret, currentWindow }) => {
    const clientData = await ctx.db
      .query("classClients")
      .withIndex("secret", (q) => q.eq("secret", clientSecret))
      .unique()
    if (clientData == null) {
      throw new Error("YOU. SHALL NOT. PASS!!")
      return false
    }
    await ctx.db.patch("classClients", clientData._id, {
      windowTitle: currentWindow,
    })
    return true
  },
})
