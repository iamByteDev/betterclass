import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const registerClient = mutation({
  args: {
    classCode: v.string(),
    clientName: v.string(),
  },
  handler: async (ctx, { classCode, clientName }) => {
    // TODO: find class by class code
    // TODO: create client
    console.log(classCode, clientName)
  },
})

export const isValidClient = query({
  args: {
    clientSecret: v.string(),
  },
  handler: async (ctx, { clientSecret }) => {
    const clientData = await ctx.db
      .query("classClients")
      .withIndex("secret", (q) => q.eq("secret", clientSecret))
      .unique()

    if (clientData == null) {
      return false
    }
    return true
  },
})
