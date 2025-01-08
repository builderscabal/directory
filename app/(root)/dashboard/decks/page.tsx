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
import { StartupPitchDeck } from "./_components/pitch-deck-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, GalleryVerticalEnd, Link } from "lucide-react";
import DeckCard from "./_components/deck-card";
import EmbedPDFUrl from "./_components/embed-pdf-url";
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

const PitchDeckPage = () => {
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

  const pitchDecksData = startups?.map(startup => {
    if (startup.pitchDeckUrl) {
      return {
        pitchDeckUrl: startup.pitchDeckUrl,
        pitchDeckStorageId: startup.pitchDeckStorageId,
        showDeck: startup.showDeck,
        lockDeck: startup.lockDeck,
        deckPassword: startup.deckPassword,
        startupId: startup._id,
        name: startup.name,
        logoUrl: startup.logoUrl
      };
    }
    return null;
  }).filter(Boolean);

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
                <Tabs defaultValue="decks">
                  <TabsList className="ml-auto">
                    <TabsTrigger value="decks">
                      <GalleryVerticalEnd className="h-5 w-5 mr-1.5" />
                      Pitch Decks
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
                  <TabsContent value="decks">
                    <div className="mt-4 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {pitchDecksData && pitchDecksData.length > 0 ? (
                        pitchDecksData.map((deck) => (
                          <DeckCard
                            key={deck?.startupId}
                            _id={deck?.startupId as Id<"startups">}
                            deckId={deck?.pitchDeckStorageId as Id<"_storage">}
                            name={deck?.name as string}
                            url={deck?.pitchDeckUrl as string}
                            logo={deck?.logoUrl as string}
                            showDeck={deck?.showDeck as boolean}
                            lockDeck={deck?.lockDeck as boolean}
                            deckPassword={deck?.deckPassword as string}
                          />
                        ))
                      ) : (
                        <p className="text-base text-muted-foreground">No pitch decks available.</p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="embed">
                    <EmbedPDFUrl userId={userId as string} />
                  </TabsContent>
                  <TabsContent value="upload">
                    <StartupPitchDeck userId={userId as string} />
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

export default PitchDeckPage;