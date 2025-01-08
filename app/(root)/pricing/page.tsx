"use client";

import React from "react";
import { FadeIn } from "@/components/cabal-ui/fade-in";
import { NavDashboardSidebar } from "@/components/nav-dashboard";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { NavDefaultSidebar } from "@/components/nav-default";
import { DashboardBaseGrid } from "@/components/dashboard/base";
import PricingForm from "./_components/pricing-form";
import PageLoader from "@/components/page-loader";
import PricingFormNoUser from "./_components/pricing-form-noUser";

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

const PricingPage = () => {
  const sectors = useQuery(api.sectors.getAllSectors);
  const categories = useQuery(api.categories.getAllCategories);
  const industries = useQuery(api.industries.getAllIndustries);

  const { user } = useUser();
  const userId = user?.id || "";

  const isLoading = !sectors || !categories || !industries;
  const hasError = sectors === null || categories === null || industries === null;

  if (isLoading) {
    return <PageLoader />;
  }

  if (hasError) {
    return <div>Error loading data. Please load the page again.</div>;
  }

  return (
    <>
      <NavDefaultSidebar
        sectors={sectors as SectorData[]}
        categories={categories as CategoryData[]}
        industries={industries as IndustryData[]}
      />

      <div className="max-w-full px-2 md:pl-4 md:pr-0">
        <FadeIn>
          <DashboardBaseGrid>
            <div className="grid grid-cols-1 lg:gap-16 pb-8 relative">
              <div className="col-span-1 md:col-span-2">
                {userId ? (
                  <PricingForm userId={userId as string} />
                ) : (
                  <PricingFormNoUser />
                )}
              </div>
            </div>
          </DashboardBaseGrid>
        </FadeIn>
      </div>
    </>
  );
};

export default PricingPage;