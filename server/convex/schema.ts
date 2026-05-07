import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  classes: defineTable({
    name: v.string(),
    organizationId: v.string(),
  }),
  classClients: defineTable({
    name: v.string(),
    secret: v.string(),
    classId: v.id("classes"),
    loggedInUsername: v.optional(v.string()),
    windowTitle: v.optional(v.string()),
    isOnline: v.boolean(),
  })
    .index("classId_name", ["classId", "name"])
    .index("secret", ["secret"]),
})
