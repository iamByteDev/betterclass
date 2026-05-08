import { defineSchema } from "convex/server"
import { tables } from "./generatedSchema"

const schema = defineSchema({
  ...tables,
  member: tables.member.index("by_organization_user", [
    "organizationId",
    "userId",
  ]),
  invitation: tables.invitation.index("by_email_organization_status", [
    "email",
    "organizationId",
    "status",
  ]),
})

export default schema
