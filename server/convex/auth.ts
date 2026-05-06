import { createClient, type GenericCtx } from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"
import { components } from "./_generated/api"
import { DataModel } from "./_generated/dataModel"
import { query } from "./_generated/server"
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal"
import authConfig from "./auth.config"
import authSchema from "./betterAuth/schema"
import { ConvexError } from "convex/values"
import { organization } from "better-auth/plugins"

const siteUrl = process.env.SITE_URL!

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: {
      schema: authSchema,
    },
  }
)

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex({ authConfig }),
      // Organisation
      organization(),
    ],
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
  } satisfies BetterAuthOptions
}

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx))
}

// Query to get the current user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userIdentity = await ctx.auth.getUserIdentity()
    if (!userIdentity) {
      return null
    }

    // Protect against @convex-dev/better-auth from throwing an error when the user is logging out.
    return authComponent.getAuthUser(ctx).catch((error) => {
      if (error instanceof ConvexError && error.message === "Unauthenticated") {
        return null
      }
      throw error
    })
  },
})
