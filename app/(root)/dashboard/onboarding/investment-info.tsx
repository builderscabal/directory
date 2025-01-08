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

const InvestmentInfoScreen = ({ userId }: UserProps) => {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [recentInvestment, setRecentInvestment] = useState<string>("");
  const [customSector, setCustomSector] = useState<string>("");

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: userId });
  const updateUser = useMutation(api.users.updateUser);

  const handleUpdate = async () => {
    try {
      await updateUser({
        userId: profile?._id as Id<"users">,
        investmentSectors: selectedSectors || [customSector],
        recentInvestment: recentInvestment
      });
    } catch (err) {
      console.error("Update failed:", err);
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
      prev.includes(sectorId)
        ? prev.filter((id) => id !== sectorId)
        : [...prev, sectorId]
    );
  };

  return (
    <div className="relative overflow-hidden">
      <div className="sm:container py-10 lg:py-14">
        <div className="md:pe-8 md:w-1/2 xl:pe-0 xl:w-5/12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Share your investment interests
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Please select the sectors you commonly invest in.
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
                    <p className="text-xs sm:text-sm">{sector.name}</p>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {selectedSectors.includes("not_listed_here") && (
            <div className="mt-4">
              <Label htmlFor="customSector" className="block mb-1 text-sm sm:text-base text-muted-foreground">
                Please specify your sector
              </Label>
              <Input
                id="customSector"
                value={customSector}
                onChange={(e) => setCustomSector(e.target.value)}
                placeholder="Enter your sector"
              />
            </div>
          )}

          <div className="mt-8">
            <Label htmlFor="recentInvestment" className="block mb-1 text-sm sm:text-base text-muted-foreground">
              What was your most recent investment?
            </Label>
            <Input
              id="recentInvestment"
              value={recentInvestment}
              onChange={(e) => setRecentInvestment(e.target.value)}
              placeholder="Describe your latest investment"
            />
          </div>

          <Button
            variant="default"
            className="mt-8 w-full justify-center"
            onClick={handleUpdate}
            disabled={selectedSectors.length === 0 || !recentInvestment}
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

export default InvestmentInfoScreen;