"use client"

import { useOptimistic } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, BoxIcon, Component, Eye, PersonStanding, Tag, View } from "lucide-react"
import { cn } from "@/lib/utils"
import MinimalCard, {
  MinimalCardContent,
  MinimalCardDescription,
  MinimalCardFooter,
  MinimalCardImage,
  MinimalCardTitle,
} from "@/components/cabal-ui/minimal-card"

export const getBasePath = (url: string) => {
  return new URL(url).hostname.replace("www.", "").split(".")[0]
}

export const getLastPathSegment = (url: string, maxLength: number): string => {
  try {
    const pathname = new URL(url).pathname
    const segments = pathname.split("/").filter(Boolean)
    const lastSegment = segments.pop() || ""

    if (lastSegment.length > maxLength) {
      return `/${lastSegment.substring(0, maxLength)}`
    }

    return lastSegment ? `/${lastSegment}` : ""
  } catch (error) {
    console.error("Invalid URL:", error)
    return ""
  }
}

interface StartupData {
  id: string
  startup_website: string
  codename: string
  tagline: string
  description: string
  logo_src: string
  labels: string[]
}

export const EmptyResourceCard: React.FC<{
  trim?: boolean
  data: StartupData
  order: any
}> = ({ trim, data, order }) => {
  const [optimisticResource, addOptimisticUpdate] = useOptimistic<
    StartupData,
    Partial<StartupData>
  >(data, (currentResource, newProperties) => {
    return { ...currentResource, ...newProperties }
  })


  return (
    <motion.div
      key={`resource-card-${data.id}-${order}`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative break-inside-avoid w-full"
    >
      <Link
        href="mailto:thevictoronyekere@gmail.com?subject=I'd%20like%20to%20advertise%20with%20FoundersCabal&body=Hello%20FoundersCabal%20Team,%0D%0A%0D%0AI%27m%20interested%20in%20advertising%20with%20FoundersCabal.%20Could%20you%20please%20provide%20more%20details%20about%20your%20advertising%20options%2C%20rates%2C%20and%20any%20other%20relevant%20information%3F%0D%0A%0D%0AThank%20you%2C%0D%0A[Your%20Name]%0D%0A[Your%20Company%20Name]%0D%0A[Your%20Contact%20Information]"
        key={`/${data.id}`}
        className=""
      >
        <div className="w-full">
          <MinimalCard
            className={cn(
              optimisticResource
                ? ""
                : "",
              "w-full"
            )}
          >
            {data.logo_src ? (
              <MinimalCardImage alt={data.codename} src={data.logo_src} />
            ) : null}

            <MinimalCardDescription
              className={cn(
                "text-sm",
                optimisticResource ? " text-neutral-700" : ""
              )}
            >
              <span className="text-neutral-700 dark:text-neutral-400">
                {trim ? `${data.description.slice(0, 82)}` : data.description}
              </span>
            </MinimalCardDescription>

            <MinimalCardContent />
          </MinimalCard>
        </div>
      </Link>
    </motion.div>
  )
};