// Organization Member Roles
export const MEMBER_ROLES = [
  { value: "member", label: "Member" },
  { value: "admin", label: "Admin" },
  { value: "owner", label: "Owner" },
] as const
export type MemberRole = (typeof MEMBER_ROLES)[number]["value"]

// Show option to set organization logo
export const IS_SET_LOGO_ENABLED = false
