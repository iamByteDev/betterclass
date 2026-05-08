import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  classrooms: defineTable({
    name: v.string(),
    organizationId: v.string(),
  }).index("by_organization", ["organizationId"]),
  classroomClients: defineTable({
    name: v.string(),
    secret: v.string(),
    classId: v.id("classrooms"),
    loggedInUsername: v.optional(v.string()),
    windowTitle: v.optional(v.string()),
    isOnline: v.boolean(),
  })
    .index("by_classId_name", ["classId", "name"])
    .index("by_secret", ["secret"]),
})
