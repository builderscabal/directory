"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GradientHeading } from "@/components/cabal-ui/gradient-heading";
import { StyledButton } from "@/components/cabal-ui/submit-button";
import { pitchDeckSchema } from "@/constants/schema";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserProps {
  userId: string;
}

const EmbedPDFUrl = ({ userId }: UserProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [issues, setIssues] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  const profile = useQuery(api.users.getUserByClerkId, {
    clerkId: userId,
  });

  const startups = useQuery(api.startups.getStartupsByUserId, {
    userId: profile?._id as Id<"users">,
  });

  const deckUpload = useMutation(api.startups.uploadStartupDeck);

  const form = useForm<z.output<typeof pitchDeckSchema>>({
    resolver: zodResolver(pitchDeckSchema),
    mode: "onChange",
    defaultValues: {
      startupId: "",
      pitchDeckUrl: "",
      showDeck: false,
    },
  });

  const { handleSubmit, watch } = form;
  const selectedStartupId = watch("startupId");

  useEffect(() => {
    if (message) {
      toast({
        title: "Success",
        description: message,
        variant: "destructive",
      });
    }
    if (issues.length > 0) {
      toast({
        title: "Error",
        description: issues.join(", "),
        variant: "destructive",
      });
      setLoading(false);
    }
    setLoading(false);
  }, [message, issues]);

  const onSubmitDeckAction = async (data: z.infer<typeof pitchDeckSchema>) => {
    try {
      const startupId = data.startupId;
      const embedUrl = data.pitchDeckUrl;

      await deckUpload({
        startupId: startupId as Id<"startups">,
        pitchDeckUrl: embedUrl || "",
        showDeck: false,
      });

      toast({
        title: "Success",
        description: "Pitch deck has been uploaded!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to upload pitch deck.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof pitchDeckSchema>) => {
    setLoading(true);
    try {
      await onSubmitDeckAction(data);
      window.location.reload();
    } catch (error: any) {
      setIssues([`Submission failed: ${error.message}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      {issues.length > 0 && (
        <div className="text-red-500">
          <ul>
            {issues.map((issue, index) => (
              <li key={index} className="flex gap-1">
                <X fill="red" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 md:p-8 p-0">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              _embed
            </h2>
            <div className="hidden sm:flex items-center space-x-2">
              <StyledButton
                disabled={loading}
                type="submit"
                form="startupForm"
              >
                {loading ? (
                  <Loader size={20} className="animate-spin ml-2" />
                ) : (
                  "Embed pitch deck"
                )}
              </StyledButton>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-1">
                <div className="">
                  <form
                    id="startupForm"
                    ref={formRef}
                    className="space-y-8"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <GradientHeading size="xs">
                      Select a startup to embed a pitch deck
                    </GradientHeading>

                    <FormField
                      control={form.control}
                      name="startupId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Startups</FormLabel>
                          <Select
                            onValueChange={(value: any) => {
                              form.setValue("startupId", value);
                            }}
                            defaultValue={form.getValues("startupId")}
                          >
                            <FormControl>
                              <SelectTrigger>
                                {form.watch("startupId") ? (
                                  <SelectValue>
                                    <span className="capitalize">
                                      {startups?.find(
                                        (startup) =>
                                          startup._id ===
                                          form.watch("startupId")
                                      )?.name || "Select a startup"}
                                    </span>
                                  </SelectValue>
                                ) : (
                                  <span className="placeholder">
                                    Select a startup
                                  </span>
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {startups?.map((startup) => (
                                <SelectItem
                                  key={startup._id}
                                  value={startup._id}
                                >
                                  {startup.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            <span className="text-blue-500">Platforms supported:</span> google drive, dropbox, docsend, papermark, scribd, box, issuu, pitch, flowpaper, calaméo, publitas, flipsnack, yumpu
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedStartupId && (
                      <FormField
                        control={form.control}
                        name="pitchDeckUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Embed Link
                            </FormLabel>
                            <FormControl className="relative">
                              <Input
                                type="text"
                                placeholder="Paste url"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="flex sm:hidden">
                      <StyledButton
                        disabled={loading}
                        type="submit"
                        form="startupForm"
                      >
                        {loading ? (
                          <Loader size={20} className="animate-spin ml-2" />
                        ) : (
                          "Embed pitch deck"
                        )}
                      </StyledButton>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default EmbedPDFUrl;