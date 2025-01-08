"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface UserProps {
  userId: string;
}

const WatchDemoScreen = ({ userId }: UserProps) => {
  const profile = useQuery(api.users.getUserByClerkId, {
    clerkId: userId,
  });

  const updateUser = useMutation(api.users.updateUser);

  const handleUpdate = async () => {
    try {
      await updateUser({
        userId: profile?._id as Id<"users">,
        watchDemo: true
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-16 md:py-10">
      <div className="relative w-full max-w-4xl aspect-video overflow-hidden rounded-xl shadow-lg">
        <video
          src="/run-it.mp4"
          className="w-full h-full object-cover rounded-xl"
          controls
        />
      </div>

      <div className="flex space-x-4 mt-8">
        <Button
          variant="secondary"
          className="w-32 justify-center transition-all"
          onClick={handleUpdate}
        >
          Skip
        </Button>
        <Button
          variant="default"
          className="w-32 justify-center transition-all"
          onClick={handleUpdate}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default WatchDemoScreen;