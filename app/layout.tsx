import "./globals.css"
import LocalFont from "next/font/local"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "./providers"
import ConvexClerkProvider from "@/providers/ConvexClerkProvider"

export const calSans = LocalFont({
  src: "../fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
})

const defaultUrl = process.env.VERCEL_URL
  ? `https://www.builderscabal.com`
  : "http://localhost:3000"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BuildersCabal Directory | Find startups, tools, and products in Africa.",
  openGraph: {
    images: [
      {
        url: `${defaultUrl}/landing.png`,
        width: 1200,
        height: 630,
        alt: "BuildersCabal Directory - Find startups, tools, and products in Africa",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClerkProvider>
      <html lang="en" className={`${calSans.variable} font-calsans`}>
        <body className={calSans.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <main className="bg-[#FAFAFA] dark:bg-background text-foreground flex flex-col justify-center items-center w-full pt-13">
                <div className="w-full">{children}</div>
              </main>
            </TooltipProvider>
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </ConvexClerkProvider>
  )
};