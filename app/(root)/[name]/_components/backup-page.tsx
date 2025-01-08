"use client";

import React, { useEffect, useState } from "react";
import { FadeIn } from "@/components/cabal-ui/fade-in";
import StartupDetails from "../details";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import LoaderSpinner from "@/components/loader-spinner";
import NoExistStartup from "../not-exist";
import Head from "next/head";

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

const StartupIdPage = async ({ params }: { params: { name: string } }) => {
  const { name } = params;
  const startup = useQuery(api.startups.getStartupByRoutingName, {
    routing_name: name,
  });
  const [showError, setShowError] = useState(false);
  const [metaData, setMetaData] = useState<StartupData | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (startup === undefined) {
        setShowError(true);
      }
    }, 10000);

    if (startup !== undefined) {
      clearTimeout(timeoutId);
      if (startup) {
        setMetaData(startup as StartupData);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [startup]);

  useEffect(() => {
    if (metaData) {
      document.title = metaData.name || "Startup | BuildersCabal";

      const faviconLink = document.querySelector(
        "link[rel~='icon']"
      ) as HTMLLinkElement | null;
      if (faviconLink) {
        faviconLink.href = metaData.logoUrl || "/favicon.ico";
      } else {
        const newFavicon = document.createElement("link");
        newFavicon.rel = "icon";
        newFavicon.href = metaData.logoUrl || "/favicon.ico";
        document.head.appendChild(newFavicon);
      }

      const metaTags = [
        { property: "description", content: metaData.tagline || "Learn more" },
                { property: "og:title", content: metaData.name || "Startup | BuildersCabal" },
        {
          property: "og:description",
          content: metaData.tagline || "Learn more about this startup",
        },
        {
          property: "og:image",
          content: metaData.displayImageUrl || "/default-image.png",
        },
        { property: "og:url", content: metaData.url || window.location.href },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: metaData.name || "Startup | BuildersCabal" },
        {
          name: "twitter:description",
          content: metaData.tagline || "Learn more about this startup",
        },
        {
          name: "twitter:image",
          content: metaData.displayImageUrl || "/default-image.png",
        },
        {
          property: "linkedin:title",
          content: metaData.name || "Startup | BuildersCabal",
        },
        {
          property: "linkedin:description",
          content: metaData.tagline || "Learn more about this startup",
        },
        {
          property: "linkedin:image",
          content: metaData.displayImageUrl || "/default-image.png",
        },
        {
          property: "pinterest:image",
          content: metaData.displayImageUrl || "/default-image.png",
        },
        {
          property: "quora:title",
          content: metaData.name || "Startup | BuildersCabal",
        },
        {
          property: "quora:description",
          content: metaData.tagline || "Learn more about this startup",
        },
        {
          property: "reddit:title",
          content: metaData.name || "Startup | BuildersCabal",
        },
        {
          property: "reddit:description",
          content: metaData.tagline || "Learn more about this startup",
        },
      ];

      metaTags.forEach(({ property, name, content }) => {
        if (property) {
          let tag = document.querySelector(
            `meta[property='${property}']`
          ) as HTMLMetaElement | null;
          if (tag) {
            tag.setAttribute("content", content);
          } else {
            const newTag = document.createElement("meta");
            newTag.setAttribute("property", property);
            newTag.setAttribute("content", content);
            document.head.appendChild(newTag);
          }
        } else if (name) {
          let tag = document.querySelector(
            `meta[name='${name}']`
          ) as HTMLMetaElement | null;
          if (tag) {
            tag.setAttribute("content", content);
          } else {
            const newTag = document.createElement("meta");
            newTag.setAttribute("name", name);
            newTag.setAttribute("content", content);
            document.head.appendChild(newTag);
          }
        }
      });
    }
  }, [metaData]);

  if (startup === null) {
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

  if (showError) {
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

  if (startup === undefined) {
    return <LoaderSpinner />;
  }

  return (
    <>
      <Head>
        <title>{startup?.name || "Title | BuildersCabal"}</title>
        <meta
          name="description"
          content={startup?.tagline || "Description | BuildersCabal"}
        />
        <meta
          property="og:title"
          content={startup?.name || "Title | BuildersCabal"}
        />
        <meta
          property="og:description"
          content={startup?.tagline || "Learn more about this startup"}
        />
        <meta
          property="og:image"
          content={
            startup?.logoUrl || startup?.displayImageUrl || "/default-image.png"
          }
        />
        <meta
          property="og:url"
          content={startup?.url || window.location.href}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={startup?.name} />
        <meta name="twitter:description" content={startup?.tagline} />
        <meta
          name="twitter:image"
          content={startup?.displayImageUrl || "/default-image.png"}
        />
        <link
          rel="shortcut icon"
          type="image/png"
          sizes="32x32"
          href={startup?.logoUrl || "/favicon.ico"}
        />
        <link
          rel="shortcut icon"
          type="image/png"
          sizes="16x16"
          href={startup?.logoUrl || "/favicon.ico"}
        />
      </Head>

      <div className="z-10">
        <div className="py-4 w-full relative mx-auto max-w-6xl">
          <FadeIn>
            <StartupDetails startup={startup as StartupData} />
          </FadeIn>
        </div>
      </div>
    </>
  );
};

export default StartupIdPage;