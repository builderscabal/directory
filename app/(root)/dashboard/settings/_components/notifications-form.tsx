"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { GradientHeading } from "@/components/cabal-ui/gradient-heading";
import { StyledButton } from "@/components/cabal-ui/submit-button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const notificationsFormSchema = z.object({
  method: z.enum(["email"], {
    required_error: "You need to select a notification method.",
  }),
  type: z.enum(["all", "startup opportunities", "directory updates", "none"], {
    required_error: "You need to select a notification type.",
  }),
  communication_updates: z.boolean().default(false).optional(),
  social_updates: z.boolean().default(false).optional(),
  marketing_updates: z.boolean().default(false).optional(),
  security_updates: z.boolean(),
});

interface UserProps {
  userId: string;
}

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

export const NotificationsForm = ({ userId }: UserProps) => {
  const userProfile = useQuery(api.users.getUserByClerkId, {
    clerkId: userId,
  });
  const profileId = userProfile?._id;

  const updateUserNotification = useMutation(api.users.updateUser);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: undefined,
  });

  useEffect(() => {
    if (userProfile) {
      const notificationMethod = userProfile.notificationMethod;
      const notificationType = userProfile.notificationType;

      form.reset({
        method: notificationMethod === "email" ? notificationMethod : "email",
        type:
          notificationType === "all" ||
          notificationType === "startup opportunities" ||
          notificationType === "directory updates" ||
          notificationType === "none"
            ? notificationType
            : "all",
        communication_updates: userProfile.communication_updates,
        social_updates: userProfile.social_updates,
        marketing_updates: userProfile.marketing_updates,
        security_updates: userProfile.security_updates,
      });
    }
  }, [userProfile, form]);

  const handleUpdate = async (data: NotificationsFormValues) => {
    try {
      setIsLoading(true);

      await updateUserNotification({
        userId: profileId as Id<"users">,
        notificationMethod: data.method,
        notificationType: data.type,
        communication_updates: data.communication_updates,
        marketing_updates: data.marketing_updates,
        social_updates: data.social_updates,
        security_updates: data.security_updates,
      });

      toast({
        title: "Success!",
        description: "Your notification settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: NotificationsFormValues) => {
    await handleUpdate(data);
  };

  return (
    <Form {...form}>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 md:p-8 p-0">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              _alerts
            </h2>
            <div className="hidden sm:flex items-center space-x-2">
              <StyledButton
                disabled={isLoading}
                type="submit"
                form="notificationsForm"
              >
                {isLoading ? (
                  <Loader size={20} className="animate-spin ml-2" />
                ) : (
                  "Save preferences"
                )}
              </StyledButton>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-1">
                <div className="">
                  <form
                    id="notificationsForm"
                    className="space-y-8"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <GradientHeading size="xs">
                      How would you like to receive notifications
                    </GradientHeading>
                    <FormField
                      control={form.control}
                      name="method"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Select your preferred method(s)</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="email" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Email
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Notify me about</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="all" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  All new updates
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="startup opportunities" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Startup opportunities
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="directory updates" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Directory updates
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="none" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Nothing
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <h3 className="mb-4 text-lg font-medium">
                        Contact Options
                      </h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="communication_updates"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Communication
                                </FormLabel>
                                <FormDescription>
                                  Receive updates about startup events, grants,
                                  and other opportunities.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="marketing_updates"
                          render={({ field }) => (
                            <FormItem
                              className="flex flex-row items-center justify-between rounded-lg border p-4"
                            >
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Marketing
                                </FormLabel>
                                <FormDescription>
                                  Stay informed about new features and
                                  announcements.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="social_updates"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Social
                                </FormLabel>
                                <FormDescription>
                                  Get updates on BuildersCabal events and
                                  community news.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="security_updates"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Security
                                </FormLabel>
                                <FormDescription>
                                  Receive updates about account activity and
                                  security issues.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex sm:hidden">
                      <StyledButton
                        disabled={isLoading}
                        type="submit"
                        form="notificationsForm"
                      >
                        {isLoading ? (
                          <Loader size={20} className="animate-spin ml-2" />
                        ) : (
                          "Save preferences"
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

export default NotificationsForm;