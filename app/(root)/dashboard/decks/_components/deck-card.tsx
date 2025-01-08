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
import { FileTextIcon } from "lucide-react";
import DeckCardActions from "./deck-actions";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface DeckCardProps {
  _id: Id<"startups">;
  deckId: Id<"_storage">;
  name: string;
  url: string;
  logo: string;
  showDeck: boolean;
  lockDeck: boolean;
  deckPassword: string;
}

const DeckCard: React.FC<DeckCardProps> = ({
  _id,
  deckId,
  name,
  url,
  logo,
  showDeck,
  lockDeck,
  deckPassword
}) => {
  const updateDeckStatus = useMutation(api.startups.updateStartup);

  const handleDeckStatusToggle = async (
    isChecked: boolean,
    startupId: Id<"startups">
  ) => {
    if (isChecked) {
      await updateDeckStatus({
        startupId,
        showDeck: true,
      });
    } else {
      await updateDeckStatus({
        startupId,
        showDeck: false,
      });
    }
  };
  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          <div className="flex justify-center">
            {showDeck === true ? (
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
          <DeckCardActions key={_id} _id={_id} url={url} deckId={deckId} lockDeck={lockDeck} deckPassword={deckPassword} />
        </div>
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center">
        <FileTextIcon className="h-20 w-20" />
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
            checked={showDeck === true}
            onCheckedChange={(isChecked) =>
              handleDeckStatusToggle(isChecked, _id)
            }
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default DeckCard;