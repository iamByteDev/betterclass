import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getAuth } from "./auth"

export const listClasses = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, { organizationId }) => {
    const userIdentity = await ctx.auth.getUserIdentity()
    if (!userIdentity) {
      return []
    }

    // Make sure user has read permission for org's classes
    const { auth, headers } = await getAuth(ctx)
    const { success: hasPermission } = await auth.api.hasPermission({
      body: {
        organizationId: organizationId,
        permissions: {
          class: ["read"],
        },
      },
      headers,
    })
    if (!hasPermission) {
      return []
    }

    // Get all classes for the organization
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

    // Make sure user has create permission for org's classes
    const { auth, headers } = await getAuth(ctx)
    const { success: hasPermission } = await auth.api.hasPermission({
      body: {
        organizationId: organizationId,
        permissions: {
          class: ["create"],
        },
      },
      headers,
    })
    if (!hasPermission) {
      return false
    }

    // Create the class
    await ctx.db.insert("classes", {
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

    // Get the class
    const classData = await ctx.db.get("classes", classId)
    if (!classData) {
      return false
    }

    // Make sure user has delete permission for org's classes
    const { auth, headers } = await getAuth(ctx)
    const { success: hasPermission } = await auth.api.hasPermission({
      body: {
        organizationId: classData.organizationId,
        permissions: {
          class: ["delete"],
        },
      },
      headers,
    })
    if (!hasPermission) {
      return false
    }

    // Delete the class
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

    // Get the class
    const classData = await ctx.db.get("classes", classId)
    if (!classData) {
      return false
    }

    // Make sure user has update permission for org's classes
    const { auth, headers } = await getAuth(ctx)
    const { success: hasPermission } = await auth.api.hasPermission({
      body: {
        organizationId: classData.organizationId,
        permissions: {
          class: ["update"],
        },
      },
      headers,
    })
    if (!hasPermission) {
      return false
    }

    // Rename the class
    await ctx.db.patch("classes", classId, {
      name: newName,
    })
    return true
  },
})
