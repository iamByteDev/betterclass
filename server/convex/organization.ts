// Supplements Better Auth's Organization Plugin

// Imports
import { organization } from "better-auth/plugins/organization"
import { Statements, createAccessControl } from "better-auth/plugins/access"
import {
  defaultStatements,
  memberAc,
  adminAc,
  ownerAc,
} from "better-auth/plugins/organization/access"
import { type AuthTriggers } from "./auth"
import { query } from "./_generated/server"
import { v } from "convex/values"
import { getAuth } from "./auth"
import { deleteOrgClassrooms } from "./classrooms"

// Access Control
const accessControlStatements = {
  ...defaultStatements,
  classroom: ["create", "read", "update", "delete"],
} satisfies Statements
const ac = createAccessControl(accessControlStatements)

// Roles
const memberRole = ac.newRole({
  ...memberAc.statements,
  classroom: ["read"],
})
const adminRole = ac.newRole({
  ...adminAc.statements,
  classroom: ["create", "read", "update", "delete"],
})
const ownerRole = ac.newRole({
  ...ownerAc.statements,
  classroom: ["create", "read", "update", "delete"],
})

const roles = {
  member: memberRole,
  admin: adminRole,
  owner: ownerRole,
}

// Triggers
export const organizationTriggers: AuthTriggers["organization"] = {
  onDelete: async (ctx, doc) => {
    await deleteOrgClassrooms(ctx, doc._id)
  },
}

// Plugin
export const organizationPlugin = organization({
  ac,
  roles,
})

// Queries
export const getOrgData = query({
  args: {
    organizationSlug: v.string(),
  },
  handler: async (ctx, { organizationSlug }) => {
    const { auth, headers } = await getAuth(ctx)

    try {
      const organization = await auth.api.getFullOrganization({
        query: {
          organizationSlug: organizationSlug,
        },
        headers,
      })
      return organization
    } catch {
      // May be caused by org not being found, user not being a member of the org, etc.
      return null
    }
  },
})

export const listUserOrgs = query({
  args: {},
  handler: async (ctx) => {
    const { auth, headers } = await getAuth(ctx)

    try {
      return await auth.api.listOrganizations({
        headers,
      })
    } catch {
      return []
    }
  },
})

export const listOrgInvitations = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, { organizationId }) => {
    const { auth, headers } = await getAuth(ctx)

    try {
      return await auth.api.listInvitations({
        query: {
          organizationId: organizationId,
        },
        headers,
      })
    } catch {
      return []
    }
  },
})

export const listUserInvitations = query({
  handler: async (ctx) => {
    const { auth, headers } = await getAuth(ctx)

    const invitations = await auth.api.listUserInvitations({
      headers,
    })
    return invitations
  },
})
