import { defineSchema } from "convex/server"
import { tables } from "./generatedSchema"

const schema = defineSchema({
  ...tables,
  member: tables.member.index("organization_user", [
    "organizationId",
    "userId",
  ]),
})

export default schema
