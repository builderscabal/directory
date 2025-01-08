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

const OperatorInfoScreen = ({ userId }: UserProps) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [workedAtStartup, setWorkedAtStartup] = useState<string>("");
  const [customRole, setCustomRole] = useState<string>("");

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: userId });
  const updateUser = useMutation(api.users.updateUser);

  const handleUpdate = async () => {
    try {
      await updateUser({
        userId: profile?._id as Id<"users">,
        rolesWorkedAt: selectedRoles || [customRole],
        startupWorkedAt: workedAtStartup
      });
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const roles = [
    { id: "operations", name: "Operations" },
    { id: "product_management", name: "Product Management" },
    { id: "engineering_technology", name: "Engineering/Technology" },
    { id: "growth_marketing", name: "Growth/Marketing" },
    { id: "customer_success", name: "Customer Success" },
    { id: "sales", name: "Sales" },
    { id: "data_analytics", name: "Data Analytics" },
    { id: "finance", name: "Finance" },
    { id: "human_resources", name: "Human Resources" },
    { id: "design", name: "Design" },
    { id: "legal_compliance", name: "Legal/Compliance" },
    { id: "business_development", name: "Business Development" },
    { id: "it_security", name: "IT/Security" },
    { id: "supply_chain_logistics", name: "Supply Chain/Logistics" },
    { id: "admin_office_management", name: "Admin/Office Management" },
    { id: "executive_leadership", name: "Executive Leadership" },
    { id: "not_listed_here", name: "Not Listed Here" },
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const isNotListedSelected = selectedRoles.includes("not_listed_here");

  return (
    <div className="relative overflow-hidden">
      <div className="sm:container py-10 lg:py-14">
        <div className="md:pe-8 md:w-1/2 xl:pe-0 xl:w-5/12">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Tell us about your experience
          </h1>

          <div className="mb-8 mt-3">
            <Label htmlFor="workedAtStartup" className="block mb-1 text-sm sm:text-base text-muted-foreground">
              Which startup do you work at?
            </Label>
            <Input
              id="workedAtStartup"
              value={workedAtStartup}
              onChange={(e) => setWorkedAtStartup(e.target.value)}
              placeholder="Enter startup name"
            />
          </div>

          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            What is/are your role(s)?
          </p>

          <ScrollArea className="overflow-y-scroll mt-2 max-h-44 sm:max-h-64 rounded-lg border border-gray-200 p-3">
            <div className="space-y-2">
              {roles.map((role) => (
                <Card
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`cursor-pointer transition rounded-lg p-3 ${
                    selectedRoles.includes(role.id) ? "bg-gray-50 dark:bg-gray-900" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => handleRoleSelect(role.id)}
                    />
                    <div>
                      <p className="text-xs sm:text-sm">{role.name}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {isNotListedSelected && (
            <div className="mt-4">
              <Label htmlFor="customRole" className="block mb-1 text-sm sm:text-base text-muted-foreground">
                Please specify your role
              </Label>
              <Input
                id="customRole"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="Enter your role"
              />
            </div>
          )}

          <Button
            variant="default"
            className="mt-8 w-full justify-center"
            onClick={handleUpdate}
            disabled={!workedAtStartup || selectedRoles.length === 0}
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

export default OperatorInfoScreen;