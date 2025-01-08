"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/cabal-ui/fade-in"
import { NavDashboardSidebar } from "@/components/nav-dashboard";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { NavDefaultSidebar } from "@/components/nav-default";
import { DashboardBaseGrid } from "@/components/dashboard/base";
import DashboardPage from "@/components/dashboard";
import WelcomeScreen from "./onboarding/welcome";
import HearAboutScreen from "./onboarding/hear-about-us";
import WatchDemoScreen from "./onboarding/watch-demo";
import JoinCommunityScreen from "./onboarding/join-community";
import OperatorInfoScreen from "./onboarding/operator-info";
import InvestmentInfoScreen from "./onboarding/investment-info";
import AdvisorInfoScreen from "./onboarding/advisor-info";
import FounderInfoScreen from "./onboarding/founder-info";
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

const AccountDashboard = () => {
  const router = useRouter();
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
                {/** Actual flow
                  {profile?.onboardStart === false || profile?.occupation?.length === 0 ? (
                    <WelcomeScreen userId={userId as string} />
                  ) : profile?.hearAboutUs?.length === 0 ? (
                    <HearAboutScreen userId={userId as string} />
                  ) : profile?.watchDemo === false ? (
                    <WatchDemoScreen userId={userId as string} />
                  ) : profile?.joinCommunity === false ? (
                    <JoinCommunityScreen userId={userId as string} />
                  ) : (
                    <DashboardPage userId={userId as string} />
                  )}
                */}
                {profile?.onboardStart === false || !profile?.occupation ? (
                  <WelcomeScreen userId={userId as string} />
                ) : profile?.occupation === "founder" && (!profile?.onboardFounder) ? (
                  <FounderInfoScreen userId={userId as string} />
                ) : profile?.occupation === "operator"  && (profile?.rolesWorkedAt?.length === 0 || !profile?.startupWorkedAt) ? (
                  <OperatorInfoScreen userId={userId as string} />
                ) : profile?.occupation === "investor" && (profile?.investmentSectors?.length === 0 || !profile?.recentInvestment) ? (
                  <InvestmentInfoScreen userId={userId as string} />
                ) : profile?.occupation === "advisor" && (profile?.advisingSectors?.length === 0 || !profile?.recentStartupAdvised) ? (
                  <AdvisorInfoScreen userId={userId as string} />
                ) : profile?.hearAboutUs?.length === 0 ? (
                  <HearAboutScreen userId={userId as string} />
                ) : profile?.joinCommunity === false ? (
                  <JoinCommunityScreen userId={userId as string} />
                ) : profile?.occupation === "founder" || profile?.occupation === "operator" ? (
                  <DashboardPage userId={userId as string} />
                ) : (
                   <DashboardPage userId={userId as string} />
                )}
              </div>
            </div>
          </DashboardBaseGrid>
        </FadeIn>
      </div>
    </>
  )
};

export default AccountDashboard;