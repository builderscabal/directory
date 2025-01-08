"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import DemoCardActions from "./demo-actions";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import DisplayVideo from "./display-video";

interface DemoCardProps {
  _id: Id<"startups">;
  demoId: Id<"_storage">;
  name: string;
  url: string;
  logo: string;
  showDemo: boolean;
  lockDemo: boolean;
  demoPassword: string;
}

const DemoCard: React.FC<DemoCardProps> = ({
  _id,
  demoId,
  name,
  url,
  logo,
  showDemo,
  lockDemo,
  demoPassword
}) => {
  const updateDemoStatus = useMutation(api.startups.updateStartup);

  const handleDemoStatusToggle = async (
    isChecked: any,
    startupId: Id<"startups">
  ) => {
    if (isChecked) {
      await updateDemoStatus({
        startupId,
        showDemo: true,
      });
    } else {
      await updateDemoStatus({
        startupId,
        showDemo: false,
      });
    }
  };
  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          <div className="flex justify-center">
            {showDemo === true ? (
              <Badge
                variant="default"
                className="bg-[#B5E4CA3D] hover:bg-[#B5E4CA3D] text-green-800 dark:text-white"
              >
                Published
              </Badge>
            ) : (
              <Badge variant="outline">Unpublished</Badge>
            )}
          </div>
        </CardTitle>
        <div className="absolute top-2 right-2">
          <DemoCardActions key={_id} _id={_id} url={url} demoId={demoId} lockDemo={lockDemo} demoPassword={demoPassword} />
        </div>
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center">
        <DisplayVideo url={url as any} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2 text-sm w-40 items-center">
          <Avatar className="w-6 h-6">
            <AvatarImage src={logo} />
            <AvatarFallback>BC</AvatarFallback>
          </Avatar>
          {name}
        </div>
        <div className="text-xs text-gray-700">
          <Switch
            id="status"
            checked={showDemo === true}
            onCheckedChange={(isChecked) =>
              handleDemoStatusToggle(isChecked, _id)
            }
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default DemoCard;