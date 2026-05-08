import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { organization } from "better-auth/plugins"

export const listClasses = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, { organizationId }) => {
    const userIdentity = await ctx.auth.getUserIdentity()
    if (!userIdentity) {
      return []
    }

    // TODO: make sure user is in the org

    const classes = await ctx.db
      .query("classes")
      .withIndex("orgClasses", (q) => q.eq("organizationId", organizationId))
      .collect()

    return classes
  },
})

export const createClass = mutation({
  args: {
    organizationId: v.string(),
    className: v.string(),
  },
  handler: async (ctx, { organizationId, className }) => {
    const userIdentity = await ctx.auth.getUserIdentity()
    if (!userIdentity) {
      return false
    }

    // TODO: make sure user has permission to create class

    const createClass = await ctx.db.insert("classes", {
      name: className,
      organizationId: organizationId,
    })
    return true
  },
})

export const deleteClass = mutation({
  args: {
    classId: v.id("classes"),
  },
  handler: async (ctx, { classId }) => {
    const userIdentity = await ctx.auth.getUserIdentity()
    if (!userIdentity) {
      return false
    }

    // TODO: make sure user has perms to delete class

    await ctx.db.delete("classes", classId)
    return true
  },
})

export const renameClass = mutation({
  args: {
    classId: v.id("classes"),
    newName: v.string(),
  },
  handler: async (ctx, { classId, newName }) => {
    const userIdentity = await ctx.auth.getUserIdentity()
    if (!userIdentity) {
      return false
    }

    //todo check if user has perms to rename class

    await ctx.db.patch("classes", classId, {
      name: newName,
    })
    return true
  },
})
