import { v } from "convex/values"
import { mutation, MutationCtx, query } from "./_generated/server"
import { getAuth } from "./auth"

export async function deleteOrgClassrooms(
  ctx: MutationCtx,
  organizationId: string
) {
  const classrooms = await ctx.db
    .query("classrooms")
    .withIndex("orgClassrooms", (q) => q.eq("organizationId", organizationId))
    .collect()

  for (const classroom of classrooms) {
    await ctx.db.delete("classrooms", classroom._id)
  }
  return classrooms.length
}

export const listClassrooms = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, { organizationId }) => {
    const userIdentity = await ctx.auth.getUserIdentity()
    if (!userIdentity) {
      return []
    }

    // Make sure user has read permission for org's classrooms
    const { auth, headers } = await getAuth(ctx)
    const { success: hasPermission } = await auth.api.hasPermission({
      body: {
        organizationId: organizationId,
        permissions: {
          classroom: ["read"],
        },
      },
      headers,
    })
    if (!hasPermission) {
      return []
    }

    // Get all classrooms for the organization
    const classrooms = await ctx.db
      .query("classrooms")
      .withIndex("orgClassrooms", (q) => q.eq("organizationId", organizationId))
      .collect()

    return classrooms
  },
})

export const createClassroom = mutation({
  args: {
    organizationId: v.string(),
    classroomName: v.string(),
  },
  handler: async (ctx, { organizationId, classroomName }) => {
    const userIdentity = await ctx.auth.getUserIdentity()
    if (!userIdentity) {
      return false
    }

    // Make sure user has create permission for org's classrooms
    const { auth, headers } = await getAuth(ctx)
    const { success: hasPermission } = await auth.api.hasPermission({
      body: {
        organizationId: organizationId,
        permissions: {
          classroom: ["create"],
        },
      },
      headers,
    })
    if (!hasPermission) {
      return false
    }

    // Create the classroom
    await ctx.db.insert("classrooms", {
      name: classroomName,
      organizationId: organizationId,
    })
    return true
  },
})

export const deleteClassroom = mutation({
  args: {
    classroomId: v.id("classrooms"),
  },
  handler: async (ctx, { classroomId }) => {
    const userIdentity = await ctx.auth.getUserIdentity()
    if (!userIdentity) {
      return false
    }

    // Get the classroom
    const classroom = await ctx.db.get("classrooms", classroomId)
    if (!classroom) {
      return false
    }

    // Make sure user has delete permission for org's classrooms
    const { auth, headers } = await getAuth(ctx)
    const { success: hasPermission } = await auth.api.hasPermission({
      body: {
        organizationId: classroom.organizationId,
        permissions: {
          classroom: ["delete"],
        },
      },
      headers,
    })
    if (!hasPermission) {
      return false
    }

    // Delete the classroom
    await ctx.db.delete("classrooms", classroomId)
    return true
  },
})

export const renameClassroom = mutation({
  args: {
    classroomId: v.id("classrooms"),
    newName: v.string(),
  },
  handler: async (ctx, { classroomId, newName }) => {
    const userIdentity = await ctx.auth.getUserIdentity()
    if (!userIdentity) {
      return false
    }

    // Get the classroom
    const classroom = await ctx.db.get("classrooms", classroomId)
    if (!classroom) {
      return false
    }

    // Make sure user has update permission for org's classrooms
    const { auth, headers } = await getAuth(ctx)
    const { success: hasPermission } = await auth.api.hasPermission({
      body: {
        organizationId: classroom.organizationId,
        permissions: {
          classroom: ["update"],
        },
      },
      headers,
    })
    if (!hasPermission) {
      return false
    }

    // Rename the classroom
    await ctx.db.patch("classrooms", classroomId, {
      name: newName,
    })
    return true
  },
})
