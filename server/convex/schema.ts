import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  classes: defineTable({
    name: v.string(),
    organizationId: v.string(),
  }),
})
