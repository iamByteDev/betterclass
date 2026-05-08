import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  classrooms: defineTable({
    name: v.string(),
    organizationId: v.string(),
  }).index("orgClassrooms", ["organizationId"]),
  classClients: defineTable({
    name: v.string(),
    secret: v.string(),
    classId: v.id("classrooms"),
    loggedInUsername: v.optional(v.string()),
    windowTitle: v.optional(v.string()),
    isOnline: v.boolean(),
  })
    .index("classId_name", ["classId", "name"])
    .index("secret", ["secret"]),
})
