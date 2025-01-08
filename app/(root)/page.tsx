"use client";

import React, { Suspense } from "react"
import { Separator } from "@/components/ui/separator"
import { FadeIn } from "@/components/cabal-ui/fade-in"
import { DirectorySearch } from "@/components/directory-search"
import { Hero } from "@/components/hero"
import {
  EmptyFeaturedGrid,
  FeaturedGrid,
  ResourceCardGrid,
} from "../../components/directory-card-grid"
import { NavSidebar } from "../../components/nav"
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import PageLoader from "@/components/page-loader";
import LoaderSpinner from "@/components/loader-spinner";
import { useUser } from "@clerk/nextjs";
import { NavDefaultSidebar } from "@/components/nav-default";

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

const HomePage = ({ searchParams }: { searchParams: { search?: string } }) => {
  const searchTerm = searchParams?.search || '';
  const startups = useQuery(api.startups.getApprovedStartups, { searchTerm });

  const featured = useQuery(api.startups.getFeaturedStartups);
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

      <div className="max-w-full px-2 md:pl-4 md:pr-0 pt-2">
        <FadeIn>
          <ResourceCardGrid
            startups={sortedStartups as StartupData[]}
            featuredStartups={featured as StartupData[]}
          >
            <div className="grid grid-cols-1 xl:grid-cols-6 lg:gap-16 pb-8 pt-8 relative">
              <div className="col-span-1 md:col-span-2">
                <Hero startupNumber={startups?.length} >
                  <DirectorySearch />
                </Hero>
              </div>
              
              <div className="col-span-1 md:col-span-4 mt-6 md:mt-0">
                {Array.isArray(featured) && featured.length >= 1 ? (
                  <Suspense fallback={<PageLoader />}>
                    <div className="relative">
                      <FeaturedGrid featuredData={featured as StartupData[]} />
                    </div>
                  </Suspense>
                ) : (
                  <div className="relative">
                    <EmptyFeaturedGrid />
                  </div>
                )}
              </div>
            </div>
          </ResourceCardGrid>
        </FadeIn>
      </div>
    </>
  )
};

export default HomePage;