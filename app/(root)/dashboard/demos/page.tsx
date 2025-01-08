"use client";

import React, { useEffect } from "react";
import { FadeIn } from "@/components/cabal-ui/fade-in";
import { NavDashboardSidebar } from "@/components/nav-dashboard";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { NavDefaultSidebar } from "@/components/nav-default";
import { DashboardBaseGrid } from "@/components/dashboard/base";
import UploadDemo from "./_components/upload-demo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, Upload, Video } from "lucide-react";
import DemoCard from "./_components/demo-card";
import EmbedUrl from "./_components/embed-url";
import { NavInvestorSidebar } from "@/components/nav-investor";
import { useRouter } from "next/navigation";

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

const DemoPage = () => {
  const router = useRouter();
  const sectors = useQuery(api.sectors.getAllSectors);
  const categories = useQuery(api.categories.getAllCategories);
  const industries = useQuery(api.industries.getAllIndustries);

  const { user } = useUser();
  const userId = user?.id;

  const profile = useQuery(api.users.getUserByClerkId, {
    clerkId: userId,
  });

  const profileId = profile?._id as Id<"users">;

  const startups = useQuery(api.startups.getStartupsByUserId, {
    userId: profileId,
  });

  const demosData = startups
    ?.map((startup) => {
      if (startup.demoUrl) {
        return {
          demoUrl: startup.demoUrl,
          demoStorageId: startup.demoStorageId,
          showDemo: startup.showDemo,
          lockDemo: startup.lockDemo,
          demoPassword: startup.demoPassword,
          startupId: startup._id,
          name: startup.name,
          logoUrl: startup.logoUrl,
        };
      }
      return null;
    })
    .filter(Boolean);

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
                <Tabs defaultValue="demos">
                  <TabsList className="ml-auto">
                    <TabsTrigger value="demos">
                      <Video className="h-5 w-5 mr-1.5" />
                      Demos
                    </TabsTrigger>
                    <TabsTrigger value="embed">
                      <Link className="h-5 w-5 mr-1.5" />
                      Embed
                    </TabsTrigger>
                    <TabsTrigger value="upload">
                      <Upload className="h-5 w-5 mr-1.5" />
                      Upload
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="demos">
                    <div className="mt-4 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {demosData && demosData.length > 0 ? (
                        demosData.map((demo) => (
                          <DemoCard
                            key={demo?.startupId}
                            _id={demo?.startupId as Id<"startups">}
                            demoId={demo?.demoStorageId as Id<"_storage">}
                            name={demo?.name as string}
                            url={demo?.demoUrl as string}
                            logo={demo?.logoUrl as string}
                            showDemo={demo?.showDemo as boolean}
                            lockDemo={demo?.lockDemo as boolean}
                            demoPassword={demo?.demoPassword as string}
                          />
                        ))
                      ) : (
                        <p className="text-base text-muted-foreground">
                          No demos available.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="embed">
                    <EmbedUrl userId={userId as string} />
                  </TabsContent>
                  <TabsContent value="upload">
                    <UploadDemo userId={userId as string} />
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

export default DemoPage;