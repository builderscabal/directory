"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DirectoryLogo } from "@/components/nav";
import {
  ArrowLeft,
  Blocks,
  ExternalLink,
  User,
  Globe,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  SquareChevronUp,
  Minimize,
  Maximize,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import DOMPurify from "dompurify";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import ListingSignIn from "@/app/(auth)/sign-in/[[...sign-in]]/_component/listing-signin";
import SideBarDialogPage from "@/components/sidebar";
import markdownit from "markdown-it";

interface DeckHistoryEntry {
  emailAddress?: string;
  phoneNumber?: string;
  timestamp?: string;
  viewerTitle?: string;
  ipAddress?: string;
  feedback?: string;
}

interface DemoHistoryEntry {
  emailAddress?: string;
  phoneNumber?: string;
  timestamp?: string;
  viewerTitle?: string;
  ipAddress?: string;
  feedback?: string;
}

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
  lockDeck?: boolean;
  deckPassword?: string;
  deckHistory?: DeckHistoryEntry[];
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
  demoUrl?: string;
  demoStorageId?: Id<"_storage">;
  showDemo?: boolean;
  lockDemo?: boolean;
  demoPassword?: string;
  demoHistory?: DemoHistoryEntry[];
  startupAge?: string;
  teamSize?: string;
  startupStage?: string;
  upvotesHistory?: [];
  metrics?: Array<{
    id?: string;
    period?: string;
    revenueGrowthRate?: string;
    retentionRate?: string;
    customersAcquired?: string;
    activeUsers?: string;
    report?: string;
    timestamp?: string;
  }>;
}

interface UserData {
  _id: Id<"users">;
  email: string;
  clerkId: string;
  firstName?: string;
  lastName?: string;
}

interface StartupDetailsProps {
  startup: StartupData;
  profile?: UserData;
}

const md = markdownit();

const StartupDetails: React.FC<StartupDetailsProps> = ({ startup, profile }) => {
  const [showSignupPopup, setShowSignupPopup] = React.useState(false);
  const [userIp, setUserIp] = useState("");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const userId = user?.id;

  const updateWebsiteVisit = useMutation(api.startups.updateStartup);

  const recordUpvote = useMutation(api.startups.updateStartup);

  const checkUpvote = useQuery(api.startups.checkUpvotesHistory, {
    userId: profile?._id as Id<"users">,
    startupId: startup._id,
  });

  const updateViews = useMutation(api.startups.updateStartup);

  const generateRandomId = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `random-${randomString}`;
  };

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const ipAddress = await fetch("https://api.ipify.org").then((res) =>
          res.text()
        );
        setUserIp(ipAddress);

        const viewKey = `viewed_${startup._id}_${ipAddress}`;
        const visitKey = `visited_${startup._id}_${ipAddress}`;
        const lastView = localStorage.getItem(viewKey);
        const lastVisit = localStorage.getItem(visitKey);
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

        if (
          !lastVisit ||
          Date.now() - parseInt(lastVisit, 10) > oneDayInMilliseconds
        ) {
          localStorage.setItem(visitKey, Date.now().toString());

          if (!lastView) {
            await incrementViewCount();
            localStorage.setItem(viewKey, Date.now().toString());
          }
        }
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    };

    if (!userIp) {
      fetchIpAddress();
    }
  }, [startup._id, userIp]);

  const incrementViewCount = async () => {
    try {
      const timestamp = new Date().toISOString();

      await updateViews({
        startupId: startup._id,
        views: startup.views + 1,
        viewsHistory: [
          {
            timestamp,
            userId: (profile?._id as Id<"users">) || generateRandomId(),
            startupId: startup._id,
            ipAddress: userIp,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to update website visits:", error);
    }
  };

  const handleUpVote = async () => {
    if (!userId) {
      return setShowSignupPopup(true);
    }

    if (checkUpvote === undefined) {
      return;
    }

    try {
      if (checkUpvote !== null) {
        toast({
          title: "Upvote recorded",
          description: "You have upvoted this startup already!",
        });
      } else {
        const timestamp = new Date().toISOString();

        await recordUpvote({
          startupId: startup._id,
          upvotes: startup.upvotes + 1,
          upvotesHistory: [
            {
              timestamp,
              userId: profile?._id as Id<"users">,
              startupId: startup._id,
              ipAddress: userIp,
            },
          ],
        });

        toast({
          title: "Success",
          description: "Upvote recorded!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record upvote.",
        variant: "destructive",
      });
    }
  };

  const websiteVisitCount = async (
    startupId: Id<"startups">,
    newVisitCount: number
  ) => {
    try {
      const timestamp = new Date().toISOString();
      const url = normalizeUrl(startup?.url);
      const linkClickKey = `clicked_${startupId}_${userIp}`;
      const lastClick = localStorage.getItem(linkClickKey);
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

      if (
        !lastClick ||
        Date.now() - parseInt(lastClick, 10) > oneDayInMilliseconds
      ) {
        await updateWebsiteVisit({
          startupId,
          website_visits: newVisitCount,
          websiteVisitsHistory: [{ timestamp }],
        });

        localStorage.setItem(linkClickKey, Date.now().toString());
      }

      if (url) {
        window.open(url, "_blank");
      } else {
        throw new Error("Invalid URL");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Link click could not be updated",
        variant: "destructive",
      });

      if (startup?.url) {
        window.open(normalizeUrl(startup?.url), "_blank");
      }
    }
  };

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
    <>
      <Dialog open={showSignupPopup} onOpenChange={setShowSignupPopup}>
        <DialogContent className="bg-transparent border-transparent">
          <ListingSignIn startupName={startup.routing_name} />
        </DialogContent>
      </Dialog>
      <div className="flex items-center">
        {startup.logoUrl ? (
          <>
            <Link href="/">
              <img
                className="w-12 h-12 rounded-lg object-cover"
                src={startup?.logoUrl || "/placeholder.png"}
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
                  <BreadcrumbLink href="/">_startup</BreadcrumbLink>/
                  <BreadcrumbLink
                    className="capitalize"
                    href={`/${startup?.routing_name}`}
                  >
                    {startup?.name as string}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              <CardTitle className="text-6xl font-extrabold text-neutral-900 dark:text-neutral-200">
                {startup?.tagline}
              </CardTitle>
              <Link
                href={`/startups?industry=${startup?.industry}`}
                className="hover:underline hover:text-blue-500"
              >
                <CardDescription className="mt-4 md:text-xl text-lg text-neutral-800 dark:text-neutral-400 flex gap-2 items-center ">
                  <Blocks className="stroke-1 size-8" />{" "}
                  <span className="flex-wrap">{startup?.industry}</span>
                </CardDescription>
              </Link>
              {startup?.founders?.length ? (
                <span>
                  <CardDescription className="mt-3 md:text-xl text-lg capitalize text-neutral-800 dark:text-neutral-400 flex gap-2 items-center ">
                    <User className="stroke-1 size-8" />{" "}
                    <span className="flex-wrap">
                      {startup.founders.join(", ")}
                    </span>
                  </CardDescription>
                </span>
              ) : null}

              {startup?.url ? (
                <span
                  className="hover:underline hover:text-blue-500"
                  onClick={() =>
                    websiteVisitCount(startup._id, startup.website_visits + 1)
                  }
                >
                  <CardDescription className="mt-3 md:text-xl text-lg text-neutral-800 dark:text-neutral-400 flex gap-2 items-center ">
                    <Globe className="stroke-1 size-8" />{" "}
                    <span className="flex-wrap capitalize inline-flex">
                      Visit website{" "}
                      <ExternalLink className="ml-1 h-5 w-6 hover:text-blue-500" />
                    </span>
                  </CardDescription>
                </span>
              ) : null}

              <div className="space-y-2">
                <h1 className="text-lg">Socials</h1>
                <span className="grid grid-cols-[repeat(auto-fit,_minmax(20px,_40px))] gap-2 justify-start">
                  {startup?.twitter && (
                    <Link
                      href={getFormattedUrl("https://x.com/", startup?.twitter)}
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

              {startup._id ? (
                <span className="items-start justify-start text-start block">
                  <SideBarDialogPage startupId={startup._id} />
                </span>
              ) : null}

              <Link
                href={`/startups`}
                className="py-4 md:flex items-center text-2xl font-semibold text-blue-500 z-10 hidden hover:underline"
              >
                <ArrowLeft className="mr-2" /> Back to all startups
              </Link>
            </div>

            <div
              className={cn(
                "w-full col-span-7 p-3 md:p-7 rounded-[36px] md:rounded-[58px] border border-black/10 space-y-10",
                "bg-white dark:bg-[#1E1E1E] shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]"
              )}
            >
              <div className="w-full p-1 md:p-3 rounded-[28px] md:rounded-[36px] bg-[#3d3d3d]">
                <Image
                  src={startup?.displayImageUrl as string || "/placeholder.png"}
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
                <CardDescription className="text-lg sm:text-xl text-neutral-800 dark:text-neutral-400">
                  <article
                    className="w-full"
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
                <span className="text-blue-500" onClick={handleTogglePrompt}>
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
              <Button
                asChild
                variant="secondary"
                size="lg"
                onClick={handleUpVote}
                className="w-full flex items-center justify-center py-6 text-lg rounded-[44px]"
              >
                <span>
                  <SquareChevronUp className="mr-1 h-6 w-6" />
                  Upvote ({startup.upvotesHistory?.length ?? 0})
                </span>
              </Button>
            </div>
          </div>
        </div>
        <Link
          href={`/startups`}
          className="py-4 md:hidden items-center text-2xl font-semibold text-blue-500 z-10 w-full flex hover:underline"
        >
          <ArrowLeft className="mr-2" /> Back to all startups
        </Link>
        <div className="absolute top-36 md:top-0 left-[-10%] right-0 h-[400px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(59,130,255,.15),rgba(255,255,255,0))]"></div>
      </div>
    </>
  );
};

export default StartupDetails;