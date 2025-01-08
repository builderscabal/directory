"use client";

import React, { ReactElement } from "react";
import { BoxIcon, Search, Component, Puzzle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/cabal-ui/fade-in";
import { GradientHeading } from "@/components/cabal-ui/gradient-heading";
import { ResourceCardGrid } from "@/components/directory-card-grid";
import { NavSidebar } from "@/components/nav";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import LoaderSpinner from "@/components/loader-spinner";
import { useUser } from "@clerk/nextjs";
import { NavDefaultSidebar } from "@/components/nav-default";

export const dynamic = "force-dynamic";

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

interface SectorData {
  _id: Id<"sectors">;
  _creationTime: number;
  name: string;
}

interface CategoryData {
  _id: Id<"categories">;
  _creationTime: number;
  name: string;
}

interface IndustryData {
  _id: Id<"industries">;
  _creationTime: number;
  name: string;
}

const StartupsPage = ({
  searchParams,
}: {
  searchParams: {
    search?: string;
    sector?: string;
    category?: string;
    industry?: string;
  };
}): ReactElement => {
  const { search, sector, category, industry } = searchParams;
  
  const startups = useQuery(api.startups.getApprovedStartups, { 
    searchTerm: search,
    sector,
    category,
    industry,
  });

  const sectors = useQuery(api.sectors.getAllSectors);
  const categories = useQuery(api.categories.getAllCategories);
  const industries = useQuery(api.industries.getAllIndustries);
  //if (!startups) return <LoaderSpinner />;

  const { user } = useUser();
  const userId = user?.id;

  const sortedStartups = startups
    ? [...startups].sort((a, b) => b.upvotes - a.upvotes)
    : [];

  return (
    <>
      {userId ? (
        <NavSidebar
          sectors={sectors as SectorData[]}
          categories={categories as CategoryData[]}
          industries={industries as IndustryData[]}
        />
      ) : (
        <NavDefaultSidebar
          sectors={sectors as SectorData[]}
          categories={categories as CategoryData[]}
          industries={industries as IndustryData[]}
        />
      )}

      <div className="max-w-full pt-4">
        <FadeIn>
          <ResourceCardGrid startups={sortedStartups as StartupData[]} featuredStartups={null}>
            {search ?? sector ?? category ?? industry ? (
              <div className="md:mr-auto mx-auto flex flex-col items-center md:items-start">
                <div className="flex mb-1 justify-center md:justify-start">
                  <Link href="/">
                    <p className="mr-1">bc_directory/</p>
                  </Link>
                  {search ? (
                    <Search className="mr-1 bg-neutral-800 fill-blue-300/30 stroke-blue-500 size-6 p-1 rounded-full" />
                  ) : null}
                  {sector ? (
                    <BoxIcon className="mr-1 bg-neutral-800 fill-blue-300/30 stroke-blue-500 size-6 p-1 rounded-full" />
                  ) : null}
                  {category ? (
                    <Component className="mr-1 bg-neutral-800 fill-blue-300/30 stroke-yellow-500 size-6 p-1 rounded-full" />
                  ) : null}
                  {industry ? (
                    <Puzzle className="mr-1 bg-neutral-800 fill-blue-300/30 stroke-green-500 size-6 p-1 rounded-full" />
                  ) : null}
                  {search ? "search" : ""}
                  {sector ? "sector" : ""}
                  {category ? "category" : ""}
                  {industry ? "industry" : ""}
                </div>
                <GradientHeading size="xxl">
                  {search ?? sector ?? category ?? industry}
                </GradientHeading>
              </div>
            ) : (
              <div className="md:mr-auto mx-auto flex flex-col items-center md:items-start">
                <div className="flex mb-1 justify-center md:justify-start">
                  <Link href="/">
                    <p className="mr-1">bc_directory/</p>
                  </Link>
                </div>
                <GradientHeading size="xxls">_startups</GradientHeading>
              </div>
            )}

            {/* <Separator className="mb-12 ml-auto w-[85%] bg-black/5 h-[2px] animate-pulse rounded-l-full" /> */}
          </ResourceCardGrid>
        </FadeIn>
      </div>
    </>
  );
};

export default StartupsPage;