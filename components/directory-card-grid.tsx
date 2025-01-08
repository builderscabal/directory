"use client"

import React, { Suspense } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ResourceCard } from "./directory-startup-card"
import { EmptyResourceCard } from "./empty-directory-startup-card"
import { Id } from "@/convex/_generated/dataModel"
import Link from "next/link"
import LoaderSpinner from "./loader-spinner"

interface StartupData {
  _id: Id<"startups">;
  _creationTime: number;
  listingOwner: Id<"users">;
  founders: string[];
  contact_email: string;
  name?: string;
  routing_name?: string;
  url?: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  logoStorageId?: Id<"_storage">;
  displayImageUrl?: string;
  displayImageStorageId?: Id<"_storage">;
  pitchDeckUrl?: string;
  pitchDeckStorageId?: Id<"_storage">;
  showDeck?: boolean;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  status?: string;
  website_visits: number;
  views: number;
  sector?: string;
  category?: string;
  industry?: string;
  featured?: boolean;
  approved?: boolean;
  upvotes: number;
}
export interface SEOCardGridProps {
  startups: StartupData[]
  featuredStartups: StartupData[] | null
  children?: React.ReactNode
}

export const ResourceCardGrid: React.FC<SEOCardGridProps> = ({
  startups,
  children,
}) => {
  const pathname = usePathname()

  return (
    <div className="flex flex-col md:items-start gap-4 overflow-hidden pb-4 md:mx-4 mx-0 md:ml-[12rem] lg:ml-[12rem] relative">
      <div
        className={cn(
          "px-4",
          pathname.includes("/startups")
            ? "md:p-4 md:gap-3"
            : "bg-white p-4 gap-3 dark:bg-[#1E1E1E] rounded-[2rem] shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]"
        )}
      >
        {children}
      </div>

      <div
        className={cn(
          "p-4 w-full",
          pathname.includes("/startups")
            ? ""
            : "bg-white dark:bg-[#1E1E1E] rounded-[2rem] shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]"
        )}
      >
        <Suspense fallback={<LoaderSpinner />}>
          {Array.isArray(startups) && startups.length > 0 ? (
            <TailwindMasonryGrid filteredData={startups} />
          ) : (
            <div>
              <span className="text-neutral-700 dark:text-neutral-400">
                No startups found
              </span>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}

interface TailwindMasonryGridProps {
  filteredData: StartupData[]
}

const TailwindMasonryGrid: React.FC<TailwindMasonryGridProps> = ({
  filteredData,
}) => {
  return (
    <div className="flex justify-center w-full">
      <div className="gap-4 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {filteredData.map((data, index) => (
            <div key={`${index}-${data._id}`} className="">
              <ResourceCard data={data} order={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const FeaturedGrid: React.FC<{ featuredData: StartupData[] }> = ({
  featuredData,
}) => {
  return (
    <div className="w-full mx-auto max-w-7xl bg-black/20 dark:bg-neutral-950/40 border border-dashed border-black/10 py-3 px-3 rounded-[1.9rem]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-2">
        {featuredData.map((data, index) => (
          <ResourceCard key={`featured-${index}-${data._id}`} trim={true} data={data} order={index} />
        ))}
      </div>
    </div>
  )
};


export const EmptyFeaturedGrid = () => {
  const emptyData = [
    {
      id: "1e66c676-55d5-4f70-820c-cb2cb71589cf",
      codename: "Ad Space",
      tagline: "Affordable ad space",
      startup_website: "https://directory.founderscabal.com/advertise",
      description:
        "Advertise here to reach a targeted audience of entrepreneurs and industry leaders.",
      logo_src: "https://cdn.dribbble.com/users/5951/screenshots/2331225/media/6fbab269ece7956a2df807166e70d4e3.png?resize=800x600&vertical=center",
      tags: ["featured"],
      labels: ["featured-ad"],
    },
    {
      id: "a27bed5e-d5cb-4543-a8e7-833a5fef5e58",
      codename: "Ad Space",
      tagline: "Affordable ad space",
      startup_website: "https://directory.founderscabal.com/advertise",
      description:
        "Advertise here to reach a targeted audience of entrepreneurs and industry leaders.",
      logo_src: "https://cdn.dribbble.com/users/5951/screenshots/2331225/media/6fbab269ece7956a2df807166e70d4e3.png?resize=800x600&vertical=center",
      tags: ["featured"],
      labels: ["featured-ad"],
    },
    {
      id: "7f26205c-15cc-4775-a392-c2161bf76211",
      codename: "Ad Space",
      tagline: "Affordable ad space",
      startup_website: "https://directory.founderscabal.com/advertise",
      description:
        "Advertise here to reach a targeted audience of entrepreneurs and industry leaders.",
      logo_src: "https://cdn.dribbble.com/users/5951/screenshots/2331225/media/6fbab269ece7956a2df807166e70d4e3.png?resize=800x600&vertical=center",
      tags: ["featured"],
      labels: ["featured-ad"],
    },
  ]

  return (
    //Edit here for hiding or showing on mobile
    <div className="hidden lg:block w-full mx-auto max-w-7xl bg-black/20 dark:bg-neutral-950/40 border border-dashed border-black/10 py-3 px-3 rounded-[1.9rem]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-2">
        {emptyData.map((data, index) => (
          <Link
            href="https://directory.founderscabal.com"
            target="_blank"
            rel="noreferrer noopener"
            key={`featured-${index}-${data.codename}`}
            className="md:py-0 "
          >
            <EmptyResourceCard trim={true} data={data} order={index} />
          </Link>
        ))}
      </div>
    </div>
  )
};