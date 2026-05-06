import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ConvexClientProvider } from "@/components/providers/convex-client"
import { Toaster } from "sonner"
import { type Metadata } from "next"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "BetterClass",
  description: "BetterClass is a platform for managing your classroom.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <ConvexClientProvider>
              <Toaster richColors position="bottom-right" />
              {children}
            </ConvexClientProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
