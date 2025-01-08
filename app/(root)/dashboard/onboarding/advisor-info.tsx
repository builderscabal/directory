"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Label } from "@/components/ui/label";

interface UserProps {
  userId: string;
}

const AdvisorInfoScreen = ({ userId }: UserProps) => {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [advisedStartup, setAdvisedStartup] = useState<string>("");
  const [customSector, setCustomSector] = useState<string>("");

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: userId });
  const updateUser = useMutation(api.users.updateUser);

  const handleUpdate = async () => {
    try {
      await updateUser({
        userId: profile?._id as Id<"users">,
        advisingSectors: selectedSectors || [customSector],
        recentStartupAdvised: advisedStartup
      });
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const sectors = [
    { id: "agriculture", name: "Agriculture" },
    { id: "automotive", name: "Automotive" },
    { id: "commerce_retail", name: "Commerce/Retail" },
    { id: "education", name: "Education" },
    { id: "energy", name: "Energy" },
    { id: "fmcg", name: "FMCG" },
    { id: "fashion", name: "Fashion" },
    { id: "finance", name: "Finance" },
    { id: "health", name: "Health" },
    { id: "ict", name: "ICT" },
    { id: "logistics", name: "Logistics" },
    { id: "legal", name: "Legal" },
    { id: "manufacturing", name: "Manufacturing" },
    { id: "media_entertainment", name: "Media & Entertainment" },
    { id: "oil_gas", name: "Oil & Gas" },
    { id: "professional_services", name: "Professional Services" },
    { id: "real_estate", name: "Real Estate" },
    { id: "sports", name: "Sports" },
    { id: "tourism_hospitality", name: "Tourism & Hospitality" },
    { id: "transportation", name: "Transportation" },
    { id: "waste_management", name: "Waste Management" },
    { id: "not_listed_here", name: "Not Listed Here" }
  ];

  const handleSectorSelect = (sectorId: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sectorId) ? prev.filter((id) => id !== sectorId) : [...prev, sectorId]
    );
  };

  const isNotListedSelected = selectedSectors.includes("not_listed_here");

  return (
    <div className="relative overflow-hidden">
      <div className="sm:container py-10 lg:py-14">
        <div className="md:pe-8 md:w-1/2 xl:pe-0 xl:w-5/12">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Tell us about your interests
          </h1>

          <div className="mb-8 mt-3">
            <Label htmlFor="advisedStartup" className="block mb-1 text-sm sm:text-base text-muted-foreground">
              Which startup are you currently advising?
            </Label>
            <Input
              id="advisedStartup"
              value={advisedStartup}
              onChange={(e) => setAdvisedStartup(e.target.value)}
              placeholder="Enter startup name"
            />
          </div>

          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Select the sectors you typically advise startups in
          </p>

          <ScrollArea className="overflow-y-scroll mt-2 max-h-44 sm:max-h-64 rounded-lg border border-gray-200 p-3">
            <div className="space-y-2">
              {sectors.map((sector) => (
                <Card
                  key={sector.id}
                  onClick={() => handleSectorSelect(sector.id)}
                  className={`cursor-pointer transition rounded-lg p-3 ${
                    selectedSectors.includes(sector.id) ? "bg-gray-50 dark:bg-gray-900" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedSectors.includes(sector.id)}
                      onChange={() => handleSectorSelect(sector.id)}
                    />
                    <div>
                      <p className="text-xs sm:text-sm">{sector.name}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {isNotListedSelected && (
            <div className="mt-4">
              <Label htmlFor="customSector" className="block mb-1 text-sm sm:text-base text-muted-foreground">
                Please specify your sector
              </Label>
              <Input
                id="customSector"
                value={customSector}
                onChange={(e) => setCustomSector(e.target.value)}
                placeholder="Enter sector name"
              />
            </div>
          )}

          <Button
            variant="default"
            className="mt-8 w-full justify-center"
            onClick={handleUpdate}
            disabled={!advisedStartup || selectedSectors.length === 0}
          >
            Continue
          </Button>
        </div>
      </div>

      <img
        className="hidden md:block md:absolute md:top-0 md:start-1/2 md:end-0 h-full rounded-xl"
        src="/onboarding/2.png"
        alt="Onboarding graphic"
      />
    </div>
  );
};

export default AdvisorInfoScreen;