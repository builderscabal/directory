"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileDown,
  Lock,
  LockOpen,
  MoreVertical,
  Copy,
  TrashIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CopyToClipboard from "react-copy-to-clipboard";

interface DeckCardProps {
  _id: Id<"startups">;
  deckId: Id<"_storage">;
  url: string;
  lockDeck: boolean;
  deckPassword: string;
}

const DeckCardActions: React.FC<DeckCardProps> = ({
  _id,
  deckId,
  url,
  lockDeck,
  deckPassword,
}) => {
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [isExpandDeck, setIsExpandDeck] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const deleteDeck = useMutation(api.startups.deletePitchDeck);
  const savePassword = useMutation(api.startups.updateStartup);
  const lockAndUnlockDeck = useMutation(api.startups.updateStartup);

  const handleSavePassword = async () => {
    try {
      await savePassword({
        startupId: _id,
        deckPassword: password,
        lockDeck: true,
      });
      setPassword("");
      toast({
        title: "success",
        description: "Password saved successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Your password could not be saved",
        variant: "destructive",
      });
    }
  };

  const handleLockToggle = async (isChecked: boolean) => {
    if (!deckPassword) {
      toast({
        title: "Cannot Lock",
        description: "Please set a password before locking the pitch deck.",
        variant: "destructive",
      });
      return;
    }

    await lockAndUnlockDeck({
      startupId: _id,
      lockDeck: isChecked,
    });
  };

  return (
    <>
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogTrigger asChild>
          <></>
        </DialogTrigger>
        <DialogContent
          key={isConfirmOpen ? "open" : "closed"}
          className="max-w-xs sm:max-w-md rounded-xl"
        >
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              pitch deck.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center sm:justify-start sm:ml-auto">
            <Button
              className="text-center justify-center"
              onClick={async () => {
                await deleteDeck({
                  startupId: _id,
                  pitchDeckStorageId: deckId,
                });
                toast({
                  variant: "default",
                  title: "Success",
                  description: "Your pitch deck will be deleted soon.",
                });
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isExpandDeck}
        onOpenChange={(open) => {
          setIsExpandDeck(open);
          if (!open) setPassword("");
        }}
      >
        <DialogTrigger asChild>
          <></>
        </DialogTrigger>
        <DialogContent
          key={isExpandDeck ? "open" : "closed"}
          className="max-w-xs sm:max-w-lg rounded-xl"
        >
          <DialogHeader>
            <DialogTitle>Password Protection</DialogTitle>
            <DialogDescription>
              Safeguard your pitch deck with a secure password, ensuring that
              only individuals you grant access can view it.
            </DialogDescription>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {deckPassword ? (
                <div className="mr-auto mt-2">
                  <span className="text-muted-foreground mr-1">
                    Saved Password:
                  </span>

                  <CopyToClipboard text={deckPassword}>
                    <span
                      onClick={() =>
                        toast({
                          title: "Password has been copied to clipboard!",
                        })
                      }
                      className="inline-flex"
                    >
                      {deckPassword}
                      <Copy className="h-4 w-4 mt-1 ml-1.5 text-blue-500" />
                    </span>
                  </CopyToClipboard>
                </div>
              ) : (
                <div className="mr-auto mt-2">
                  <span className="text-muted-foreground mr-1">
                    Saved Password:
                  </span>
                </div>
              )}
              <div className="flex items-center mt-1.5 sm:ml-auto">
                <Switch
                  id="lockDeck"
                  checked={lockDeck === true}
                  onCheckedChange={(isChecked) => handleLockToggle(isChecked)}
                  disabled={!deckPassword}
                  className="mr-2"
                />

                <span className="text-sm mt-1.5">
                  {lockDeck ? (
                    <span className="inline-flex">
                      <Lock className="h-4 w-4 mr-1 stroke-green-500" />
                      Locked
                    </span>
                  ) : (
                    <span className="inline-flex">
                      <LockOpen className="h-4 w-4 mr-1" />
                      Unlocked
                    </span>
                  )}
                </span>
              </div>
            </div>
          </DialogHeader>
          <div>
            <Label>Password</Label>
            <Input
              type="text"
              placeholder="Enter a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
            />
            <Button onClick={handleSavePassword} className="mb-2 ml-auto flex">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setTimeout(() => setIsExpandDeck(true), 0);
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            <Lock className="w-4 h-4" /> Password Protect
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setTimeout(() => {
                window.open(url, "_blank");
              }, 0);
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            <FileDown className="w-4 h-4" /> Download
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setTimeout(() => setIsConfirmOpen(true), 0);
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            <div className="flex gap-1 text-red-600 items-center cursor-pointer">
              <TrashIcon className="w-4 h-4" /> Delete
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default DeckCardActions;