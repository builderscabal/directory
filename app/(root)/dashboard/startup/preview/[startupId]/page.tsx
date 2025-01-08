"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { FadeIn } from "@/components/cabal-ui/fade-in"
import { NavDashboardSidebar } from "@/components/nav-dashboard";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import LoaderSpinner from "@/components/loader-spinner";
import { useUser } from "@clerk/nextjs";
import { NavDefaultSidebar } from "@/components/nav-default";
import { DashboardBaseGrid } from "@/components/dashboard/base";
import PreviewDetails from "./details";
import { NavInvestorSidebar } from "@/components/nav-investor";

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

const PreviewPage = () => {
  const router = useRouter();
  const { startupId } = useParams();
  const sectors = useQuery(api.sectors.getAllSectors);
  const categories = useQuery(api.categories.getAllCategories);
  const industries = useQuery(api.industries.getAllIndustries);

  const { user } = useUser();
  const userId = user?.id;

  const profile = useQuery(api.users.getUserByClerkId, {
    clerkId: userId || ""
  });

  useEffect(() => {
    if (
      !userId ||
      (profile &&
        !["founder", "operator"].includes(profile?.occupation as string))
    ) {
      router.push("/dashboard");
    }
  }, [userId, profile, router]);

  return (
    <>
      {!userId ? (
        <NavDefaultSidebar
          sectors={sectors as SectorData[]}
          categories={categories as CategoryData[]}
          industries={industries as IndustryData[]}
        />
      ) : profile?.occupation === "founder" ||
        profile?.occupation === "operator" ? (
        <NavDashboardSidebar />
      ) : profile?.occupation === "investor" ||
        profile?.occupation === "advisor" ? (
        <NavInvestorSidebar />
      ) : (
        <NavDefaultSidebar
          sectors={sectors as SectorData[]}
          categories={categories as CategoryData[]}
          industries={industries as IndustryData[]}
        />
      )}

      <div className="max-w-full px-2 md:pl-4 md:pr-0">
        <FadeIn>
          <DashboardBaseGrid>
            <div className="grid grid-cols-1 lg:gap-16 pb-8 relative">
              <div className="col-span-1 md:col-span-2">
                <PreviewDetails startupId={startupId as Id<"startups">} />
              </div>
            </div>
          </DashboardBaseGrid>
        </FadeIn>
      </div>
    </>
  )
};

export default PreviewPage;