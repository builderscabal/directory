"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useOptimistic } from "react";
import { motion } from "framer-motion";
import {
  Component,
  Eye,
  SquareChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MinimalCard, {
  MinimalCardContent,
  MinimalCardDescription,
  MinimalCardFooter,
  MinimalCardImage,
  MinimalCardTitle,
} from "@/components/cabal-ui/minimal-card";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const getBasePath = (url: string) => {
  return new URL(url).hostname.replace("www.", "").split(".")[0];
};

export const getLastPathSegment = (url: string, maxLength: number): string => {
  try {
    const pathname = new URL(url).pathname;
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments.pop() || "";

    if (lastSegment.length > maxLength) {
      return `/${lastSegment.substring(0, maxLength)}`;
    }

    return lastSegment ? `/${lastSegment}` : "";
  } catch (error) {
    console.error("Invalid URL:", error);
    return "";
  }
};

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
  upvotesHistory?: [];
  viewsHistory?: [];
}

export const ResourceCard: React.FC<{
  trim?: boolean;
  data: StartupData;
  order: any;
}> = ({ trim, data, order }) => {
  const [optimisticResource, addOptimisticUpdate] = useOptimistic<
    StartupData,
    Partial<StartupData>
  >(data, (currentResource, newProperties) => {
    return { ...currentResource, ...newProperties };
  });

  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;

  const profile = userId
    ? useQuery(api.users.getUserByClerkId, {
        clerkId: userId || "",
      })
    : null;

  const [userIp, setUserIp] = useState("");

  useEffect(() => {
    const fetchIpAddressAndDeviceInfo = async () => {
      try {
        const ipAddress = await fetch("https://api.ipify.org").then((res) =>
          res.text()
        );
        setUserIp(ipAddress);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchIpAddressAndDeviceInfo();
  }, [data._id]);

  const updateViews = useMutation(api.startups.updateStartup);

  const generateRandomId = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `random-${randomString}`;
  };

  const incrementClickCount = async (
    startupId: Id<"startups">,
    newClickCount: number
  ) => {
    try {
      const timestamp = new Date().toISOString();
      const viewKey = `viewed_${startupId}_${userIp}`;
      const lastView = localStorage.getItem(viewKey);
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

      if (
        !lastView ||
        Date.now() - parseInt(lastView, 10) > oneDayInMilliseconds
      ) {
        await updateViews({
          startupId,
          views: newClickCount,
          viewsHistory: [
            {
              timestamp,
              userId: profile?._id as Id<"users"> || generateRandomId(),
              startupId: data._id,
              ipAddress: userIp,
            },
          ],
        });

        localStorage.setItem(viewKey, Date.now().toString());
      }
    
      router.push(`/${data.routing_name}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Views could not be updated",
        variant: "destructive",
      });
      router.push(`/${data.routing_name}`);
    }
  };

  const handleClick = () => {
    const newClickCount = (optimisticResource.views || 0) + 1;
    addOptimisticUpdate({ views: newClickCount });
    incrementClickCount(data._id, newClickCount);
  };

  return (
    <motion.div
      key={`resource-card-${data._id}-${order}`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative break-inside-avoid w-full"
    >
      <Link
        key={data._id}
        className=""
        onClick={handleClick}
        href={`/${data.routing_name}`}
      >
        <div className="w-full">
          <MinimalCard
            className={cn(optimisticResource.views > 0 ? "" : "", "w-full")}
          >
            {data.displayImageUrl ? (
              <MinimalCardImage
                alt={data.name as string}
                src={
                  (data.displayImageUrl as string)
                }
              />
            ) : (
              <MinimalCardImage
                alt="BuildersCabal startup"
                src="/placeholder.png"
              />
            )}

            <MinimalCardTitle
              className={cn(
                "font-semibold mb-0.5 capitalize",
                optimisticResource.views > 100 ? "" : ""
              )}
            >
              {data.name as string}
            </MinimalCardTitle>

            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs leading-3 mb-2 text-neutral-500 inline-flex"
            >
              <Component className="w-4 h-4 mr-1" />
              <span className="mt-1">{data.category}</span>
            </motion.p>

            <MinimalCardDescription
              className={cn(
                "text-sm",
                optimisticResource.views > 100 ? " text-neutral-700" : ""
              )}
            >
              {data.featured === true ? (
                <span>{data.description?.slice(0, 50)}...</span>
              ) : (
                <span>{data.description?.slice(0, 100)}...</span>
              )}
            </MinimalCardDescription>

            <MinimalCardContent />

            <MinimalCardFooter>
              <div
                className={cn(
                  "p-1 py-1.5 px-1.5 rounded-md text-neutral-500 flex items-center gap-1 absolute bottom-2 right-2 rounded-br-[16px]",
                  optimisticResource.views > 100 ? "" : ""
                )}
              >
                <p className="flex items-center gap-1 tracking-tight text-neutral pr-1 text-sm">
                  <SquareChevronUp className="w-5 h-5" /> {data.upvotesHistory?.length ?? 0}
                </p>
                <p className="ml-2 flex items-center gap-1 tracking-tight text-neutral pr-1 text-sm">
                  <Eye className="w-5 h-5" />{" "}
                  {data.viewsHistory?.length ?? 0}
                </p>
              </div>
            </MinimalCardFooter>
          </MinimalCard>
        </div>
      </Link>
    </motion.div>
  );
};