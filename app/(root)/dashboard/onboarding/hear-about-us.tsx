"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface UserProps {
  userId: string;
}

const HearAboutScreen = ({ userId }: UserProps) => {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const profile = useQuery(api.users.getUserByClerkId, {
    clerkId: userId,
  });

  const updateUser = useMutation(api.users.updateUser);

  const handleUpdate = async () => {
    try {
      await updateUser({
        userId: profile?._id as Id<"users">,
        hearAboutUs: selectedLocations
      });
    } catch (err) {
      console.log(err);
    }
  };

  const locations = [
    { id: "producthunt", location: "Product Hunt" },
    { id: "techcabal", location: "TechCabal" },
    { id: "consonance_club", location: "Consonance Club Community" },
    { id: "builderscabal_community", location: "BuildersCabal Community" },
    { id: "twitter", location: "Twitter" },
    { id: "linkedin", location: "LinkedIn" },
    { id: "facebook", location: "Facebook" },
    { id: "instagram", location: "Instagram" },
    { id: "youtube", location: "YouTube" },
    { id: "whatsapp", location: "WhatsApp" },
    { id: "google_search", location: "Google Search" },
    { id: "friend_or_family", location: "Friend or Family" }
  ];

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId)
        ? prev.filter((id) => id !== locationId)
        : [...prev, locationId]
    );
  };

  return (
    <div className="relative overflow-hidden">
      <div className="sm:container py-10 lg:py-14">
        <div className="md:pe-8 md:w-1/2 xl:pe-0 xl:w-5/12">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            We are curious
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            How did you hear about us? You can
              select more than one option.
          </p>

          <ScrollArea className="overflow-y-scroll mt-4 max-h-80 sm:max-h-96 rounded-lg border border-gray-200 p-3">
            <div className="space-y-2">
              {locations.map((location) => (
                <Card
                  key={location.id}
                  onClick={() => handleLocationSelect(location.id)}
                  className={`cursor-pointer transition rounded-lg p-3 ${
                    selectedLocations.includes(location.id) ? "bg-gray-50 dark:bg-gray-900" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedLocations.includes(location.id)}
                      onChange={() => handleLocationSelect(location.id)}
                    />
                    <div>
                      <p className="text-xs sm:text-sm">{location.location}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <Button
            variant="default"
            className="mt-8 w-full justify-center"
            onClick={handleUpdate}
          >
            Continue
          </Button>
        </div>
      </div>

      <img
        className="hidden md:block md:absolute md:top-0 md:start-1/2 md:end-0 h-full rounded-xl"
        src="/onboarding/2.png"
        alt="image description"
      />
    </div>
  );
};

export default HearAboutScreen;