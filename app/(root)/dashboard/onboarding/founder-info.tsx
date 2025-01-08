"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserProps {
  userId: string;
}

const FounderInfoScreen = ({ userId }: UserProps) => {
  const [startupName, setStartupName] = useState<string>("");
  const [selectedStartupAge, setSelectedStartupAge] = useState<string>("");
  const [selectedTeamSize, setSelectedTeamSize] = useState<string>("");
  const [selectedStartupStage, setSelectedStartupStage] = useState<string>("");

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: userId });
  const newStartup = useMutation(api.startups.createStartup);
  const updateUser = useMutation(api.users.updateUser);

  const handleUpdate = async () => {
    try {
      const onboard = await newStartup({
        listingOwner: profile?._id as Id<"users">,
        contact_email: profile?.email as string,
        name: startupName,
        website_visits: 0,
        views: 0,
        upvotes: 0,
        startupAge: selectedStartupAge,
        teamSize: selectedTeamSize,
        startupStage: selectedStartupStage
      });

      if (onboard) {
        await updateUser({
          userId: profile?._id as Id<"users">,
          onboardFounder: true
        });
      }
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const startupAgeOptions = [
    { id: "below_1_year", name: "Less than 1 year" },
    { id: "1_5_years", name: "1-5 years" },
    { id: "6_10_years", name: "6-10 years" },
    { id: "above_10_years", name: "More than 10 years" },
    { id: "does_not_apply", name: "Not applicable" },
  ];

  const teamSizeOptions = [
    { id: "solo_founder", name: "Solo Founder" },
    { id: "2_10", name: "2-10 Members" },
    { id: "11_20", name: "11-20 Members" },
    { id: "21_30", name: "21-30 Members" },
    { id: "31_40", name: "31-40 Members" },
    { id: "above_40", name: "More than 40 Members" },
  ];

  const startupStageOptions = [
    { id: "idea", name: "Idea Stage" },
    { id: "pre_mvp", name: "Pre-MVP" },
    { id: "mvp", name: "MVP Launched" },
    { id: "growth", name: "Growth Stage" },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="sm:container py-10 lg:py-14">
        <div className="md:pe-8 md:w-1/2 xl:pe-0 xl:w-5/12">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            What are you building?
          </h1>

          <div className="mt-4">
            <Label
              htmlFor="startupName"
              className="block mb-1 text-sm sm:text-base text-muted-foreground"
            >
              What is your startup called?
            </Label>
            <Input
              id="startupName"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              placeholder="Enter startup name"
            />
          </div>

          <div className="mt-8">
            <Label
              htmlFor="startupAge"
              className="block mb-1 text-sm sm:text-base text-muted-foreground"
            >
              How long has it been operating?
            </Label>
            <Select onValueChange={(value) => setSelectedStartupAge(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select startup age" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {startupAgeOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-8">
            <Label
              htmlFor="teamSize"
              className="mt-4 text-sm sm:text-base text-muted-foreground"
            >
              What is your current team size?
            </Label>
            <Select onValueChange={(value) => setSelectedTeamSize(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {teamSizeOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-8">
            <Label
              htmlFor="startupStage"
              className="mt-4 text-sm sm:text-base text-muted-foreground"
            >
              Which stage is your startup currently in?
            </Label>
            <Select onValueChange={(value) => setSelectedStartupStage(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select startup stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {startupStageOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="default"
            className="mt-8 w-full justify-center"
            onClick={handleUpdate}
            disabled={
              !startupName ||
              !selectedStartupAge ||
              !selectedTeamSize ||
              !selectedStartupStage
            }
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

export default FounderInfoScreen;