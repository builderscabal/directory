"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DirectoryLogo } from "@/components/nav";
import {
  Blocks,
  ExternalLink,
  User,
  Globe,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Minimize,
  Maximize,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import DOMPurify from "dompurify";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FadeIn } from "@/components/cabal-ui/fade-in";
import LoaderSpinner from "@/components/loader-spinner";
import SideBarDialogPage from "@/components/sidebar";
import markdownit from "markdown-it";

interface StartupProps {
  startupId: Id<"startups">;
}

const md = markdownit();

const EditPreview = ({ startupId }: StartupProps) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const startup = useQuery(api.startups.getStartupById, {
    startupId,
  });

  if (startup === undefined) {
    return <LoaderSpinner />;
  }

  const getFormattedUrl = (baseUrl: any, usernameOrUrl: any) => {
    if (
      usernameOrUrl.startsWith("http://") ||
      usernameOrUrl.startsWith("https://")
    ) {
      return usernameOrUrl;
    }
    const cleanUsername = usernameOrUrl.replace(/^@/, "");
    return `${baseUrl}${cleanUsername}`;
  };

  const normalizeUrl = (url: any) => {
    let cleanUrl = url?.replace(/^(https?:\/\/)?(www\.)?/i, "");
    cleanUrl = cleanUrl?.replace(/\/+$/, "");
    return `https://www.${cleanUrl}`;
  };

  const handleTogglePrompt = () => {
    setShowFullDesc(!showFullDesc);
  };

  const parsedContent = md.render(startup?.description || "");

  return (
    <div className="z-10">
      <div className="py-4 w-full relative mx-auto max-w-6xl">
        <FadeIn>
          <div className="flex items-center">
            {startup?.logoUrl ? (
              <>
                <Link href="/">
                  <img
                    className="w-12 h-12 rounded-lg object-cover"
                    src={startup?.logoUrl}
                    alt={`${startup?.name}'s logo`}
                  />
                </Link>
                <span className="ml-auto">
                  <DirectoryLogo />
                </span>
              </>
            ) : (
              <DirectoryLogo />
            )}
          </div>

          <div className={cn("relative flex flex-col h-full")}>
            <div className="w-full gap-8 py-6 relative items-center">
              <div className="grid grid-cols-6 md:grid-cols-12 gap-8 w-full">
                <div className="space-y-6 col-span-6 md:col-span-5 md:mt-12 z-10">
                  <Breadcrumb className="grid grid-cols-1 sm:grid-cols-2">
                    <BreadcrumbItem>
                      <Breadcrumb>{startup?.name as string}</Breadcrumb>
                    </BreadcrumbItem>
                  </Breadcrumb>
                  <CardTitle className="text-6xl font-extrabold text-neutral-900 dark:text-neutral-200">
                    {startup?.tagline}
                  </CardTitle>
                  <Link
                    href={`/startups?industry=${startup?.industry}`}
                    className="hover:underline"
                  >
                    <CardDescription className="mt-4 md:text-xl text-lg text-neutral-800  dark:text-neutral-400 flex gap-2 items-center ">
                      <Blocks className="stroke-1 size-8" />{" "}
                      <span className="flex-wrap">{startup?.industry}</span>
                    </CardDescription>
                  </Link>
                  {startup?.founders?.length ? (
                    <span>
                      <CardDescription className="mt-3 md:text-xl text-lg capitalize text-neutral-800  dark:text-neutral-400 flex gap-2 items-center ">
                        <User className="stroke-1 size-8" />{" "}
                        <span className="flex-wrap">
                          {startup?.founders.join(", ")}
                        </span>
                      </CardDescription>
                    </span>
                  ) : null}

                  {startup?.url ? (
                    <Link
                      href={normalizeUrl(startup?.url)}
                      className="hover:underline"
                    >
                      <CardDescription className="mt-3 md:text-xl text-lg text-neutral-800  dark:text-neutral-400 flex gap-2 items-center ">
                        <Globe className="stroke-1 size-8" />{" "}
                        <span className="flex-wrap capitalize inline-flex">
                          Visit website{" "}
                          <ExternalLink className="ml-1 h-5 w-6" />
                        </span>
                      </CardDescription>
                    </Link>
                  ) : null}

                  <div className="space-y-2">
                    <h1 className="text-lg">Socials</h1>
                    <span className="grid grid-cols-[repeat(auto-fit,_minmax(20px,_40px))] gap-2 justify-start">
                      {startup?.twitter && (
                        <Link
                          href={getFormattedUrl(
                            "https://x.com/",
                            startup?.twitter
                          )}
                          target="_blank"
                          className="hover:underline lowercase"
                        >
                          <Twitter className="stroke-1 size-8 hover:text-blue-500" />
                        </Link>
                      )}

                      {startup?.linkedin && (
                        <Link
                          href={getFormattedUrl(
                            "https://linkedin.com/company/",
                            startup?.linkedin
                          )}
                          target="_blank"
                          className="hover:underline lowercase"
                        >
                          <Linkedin className="stroke-1 size-8 hover:text-blue-500" />
                        </Link>
                      )}

                      {startup?.facebook && (
                        <Link
                          href={getFormattedUrl(
                            "https://facebook.com/",
                            startup?.facebook
                          )}
                          target="_blank"
                          className="hover:underline lowercase"
                        >
                          <Facebook className="stroke-1 size-8 hover:text-blue-500" />
                        </Link>
                      )}

                      {startup?.instagram && (
                        <Link
                          href={getFormattedUrl(
                            "https://instagram.com/",
                            startup?.instagram
                          )}
                          target="_blank"
                          className="hover:underline lowercase"
                        >
                          <Instagram className="stroke-1 size-8 hover:text-blue-500" />
                        </Link>
                      )}

                      {startup?.youtube && (
                        <Link
                          href={getFormattedUrl(
                            "https://youtube.com/@",
                            startup?.youtube
                          )}
                          target="_blank"
                          className="hover:underline lowercase"
                        >
                          <Youtube className="stroke-1 size-8 hover:text-blue-500" />
                        </Link>
                      )}
                    </span>
                  </div>

                  {startup?._id ? (
                    <span className="items-start justify-start text-start block">
                      <SideBarDialogPage startupId={startup._id} />
                    </span>
                  ) : null}
                </div>

                <div
                  className={cn(
                    "w-full col-span-7 p-3 md:p-7 rounded-[36px] md:rounded-[58px] border border-black/10 space-y-10",
                    "bg-white dark:bg-[#1E1E1E] shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]"
                  )}
                >
                  <div className="w-full p-1 md:p-3 rounded-[28px] md:rounded-[36px] bg-[#3d3d3d]">
                    <Image
                      src={startup?.displayImageUrl as string}
                      alt={`${startup?.name}`}
                      width={100}
                      height={100}
                      className="w-full max-h-[200px] sm:max-h-[400px] rounded-3xl object-cover"
                      quality={100}
                      priority={true}
                      unoptimized={true}
                    />
                  </div>
                  {parsedContent && (
                    <CardDescription className="text-lg sm:text-xl text-neutral-800  dark:text-neutral-400">
                      <article
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            showFullDesc
                              ? parsedContent
                              : `${parsedContent.slice(0, 150)}${
                                  parsedContent.length > 150 ? "..." : ""
                                }`
                          ),
                        }}
                      />
                    </CardDescription>
                  )}
                  {startup?.description && startup.description.length > 150 && (
                    <span
                      className="text-blue-500"
                      onClick={handleTogglePrompt}
                    >
                      {showFullDesc ? (
                        <span className="inline-flex mt-2">
                          <Minimize className="mr-1 mt-1 h-3.5 w-4" />
                          Show less
                        </span>
                      ) : (
                        <span className="inline-flex mt-2">
                          <Maximize className="mr-1 mt-1 h-3.5 w-4" />
                          Show more
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default EditPreview;