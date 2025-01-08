"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface UserProps {
  userId: string;
}

const WelcomeScreen = ({ userId }: UserProps) => {
  const [selectedRole, setSelectedRole] = useState<string>("founder");

  const profile = useQuery(api.users.getUserByClerkId, {
    clerkId: userId,
  });

  const updateUser = useMutation(api.users.updateUser);

  const handleUpdate = async () => {
    try {
      await updateUser({
        userId: profile?._id as Id<"users">,
        occupation: selectedRole,
        onboardStart: true
      });
    } catch (err) {
      console.log(err);
    }
  };

  const roles = [
    {
      id: "founder",
      title: "Founder",
      description: "I am building a startup.",
    },
    {
      id: "operator",
      title: "Operator",
      description: "I work as an employee at a startup.",
    },
    {
      id: "investor",
      title: "Investor",
      description: "I invest in startups.",
    },
    
    {
      id: "advisor",
      title: "Advisor",
      description: "I advise startups.",
    }
  ];

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="sm:container py-10 lg:py-14">
          <div className="md:pe-8 md:w-1/2 xl:pe-0 xl:w-5/12">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Welcome to BuildersCabal
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Please select your role in the startup ecosystem. You can select only one option.
            </p>
            <RadioGroup
              value={selectedRole}
              onValueChange={setSelectedRole}
              className="space-y-4 mt-4"
            >
              {roles.map((role) => (
                <Card
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`cursor-pointer transition rounded-lg p-3 ${
                    selectedRole === role.id ? "bg-gray-50 dark:bg-gray-900" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={role.id} id={role.id} checked={selectedRole === role.id} />
                    <Label htmlFor={role.id} className="flex flex-col">
                      <span className="text-base sm:text-lg font-medium">
                        {role.title}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {role.description}
                      </span>
                    </Label>
                  </div>
                </Card>
              ))}
            </RadioGroup>
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
          src="/onboarding/1.png"
          alt="image description"
        />
      </div>
    </>
  );
};

export default WelcomeScreen;