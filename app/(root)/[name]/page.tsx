import React from 'react';
import { Metadata } from "next";
import { FadeIn } from "@/components/cabal-ui/fade-in";
import StartupDetails from "./details";
import NoExistStartup from "./not-exist";
import { currentUser } from '@clerk/nextjs/server';

// Define the expected type for params
interface Params {
  params: {
    name: string;
  };
}

// Function to fetch data from a given URL
const fetchData = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
  return response.json();
};

// Generates metadata based on startup data or defaults if not found
export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
  const { name } = params;
  const url = `${process.env.NEXT_PUBLIC_CONVEX_HTTP_URL}/getStartupByRoutingName?routing_name=${encodeURIComponent(name)}`;

  try {
    const startupData = await fetchData(url);
    return {
      title: startupData?.name || 'BuildersCabal - Discover Startups',
      description: startupData?.description || 'Explore African startups with BuildersCabal, your guide to emerging ventures and innovations.',
      openGraph: {
        title: startupData?.name || 'BuildersCabal',
        description: startupData?.tagline || 'Discover, connect, and grow with African startups.',
        url: `https://www.builderscabal.com/${startupData?.routing_name || ''}`,
        siteName: startupData?.name || 'BuildersCabal',
        images: [{
          url: startupData?.displayImageUrl || "/landing.png",
          width: 1200,
          height: 630,
          alt: startupData?.name || 'BuildersCabal',
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: startupData?.name || 'BuildersCabal',
        description: startupData?.tagline || 'Explore African startups with BuildersCabal.',
        images: [startupData?.displayImageUrl || "/landing.png"],
      },
      icons: {
        icon: startupData?.logoUrl || '/favicon.ico',
      },
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: 'BuildersCabal',
      description: 'Startup directory for Africa',
      openGraph: {
        title: 'BuildersCabal - Discover Startups',
        description: 'Explore African startups with BuildersCabal, your guide to emerging ventures and innovations.',
        url: 'https://www.builderscabal.com/',
        images: [{
          url: '/landing.png',
          width: 1200,
          height: 630,
          alt: 'BuildersCabal - Discover Startups',
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'BuildersCabal - Discover Startups',
        description: 'Explore African startups with BuildersCabal.',
        images: ['/landing.png'],
      },
      icons: {
        icon: '/favicon.ico',
      },
    };
  }
};

export default async function StartupIdPage({ params }: Params) {
  const { name } = params;

  // Fetch user ID if logged in
  let userId;
  try {
    const user = await currentUser();
    userId = user?.id;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
  }

  // Fetch startup and profile data
  try {
    const startupUrl = `${process.env.NEXT_PUBLIC_CONVEX_HTTP_URL}/getStartupByRoutingName?routing_name=${encodeURIComponent(name)}`;
    const startupData = await fetchData(startupUrl);

    let profileData;
    if (userId) {
      const profileUrl = `${process.env.NEXT_PUBLIC_CONVEX_HTTP_URL}/getUserByClerkId?userId=${userId}`;
      profileData = await fetchData(profileUrl);
    }

    return (
      <div className="z-10">
        <div className="py-4 w-full relative mx-auto max-w-6xl">
          <FadeIn>
            <StartupDetails startup={startupData} profile={profileData} />
          </FadeIn>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Data fetch error:", error);
    return (
      <div className="z-10">
        <div className="py-4 w-full relative mx-auto max-w-6xl">
          <FadeIn>
            <NoExistStartup />
          </FadeIn>
        </div>
      </div>
    );
  }
};