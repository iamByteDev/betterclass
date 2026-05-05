interface EnsureNoSessionProps {
  children: React.ReactNode
  allowAuthenticatedWithParam?: [string, string]
  skipAuthLoading?: boolean
  redirect?: string
}

export function EnsureNoSession({ children }: EnsureNoSessionProps) {
  // TODO: Implement this after authentication is implemented
  return <>{children}</>
}
