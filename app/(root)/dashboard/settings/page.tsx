"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/cabal-ui/fade-in";
import { NavDashboardSidebar } from "@/components/nav-dashboard";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { NavDefaultSidebar } from "@/components/nav-default";
import { DashboardBaseGrid } from "@/components/dashboard/base";
import ProfileForm from "./_components/profile-form";
import NotificationsForm from "./_components/notifications-form";
import { Bell, RectangleEllipsis, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordForm from "./_components/password-form";
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

const SettingsPage = () => {
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
                <Tabs defaultValue="profile">
                  <TabsList className="ml-auto">
                    <TabsTrigger value="profile">
                      <User className="h-5 w-5 mr-1.5" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger
                      value="password"
                    >
                      <RectangleEllipsis className="h-5 w-5 mr-1.5" />
                      Password
                    </TabsTrigger>
                    <TabsTrigger
                      value="alerts"
                    >
                      <Bell className="h-5 w-5 mr-1.5" />
                      Alerts
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="profile">
                    <ProfileForm userId={userId as string} />
                  </TabsContent>
                  <TabsContent value="password">
                    <PasswordForm userId={userId as string} />
                  </TabsContent>
                  <TabsContent value="alerts">
                    <NotificationsForm userId={userId as string} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DashboardBaseGrid>
        </FadeIn>
      </div>
    </>
  );
};

export default SettingsPage;