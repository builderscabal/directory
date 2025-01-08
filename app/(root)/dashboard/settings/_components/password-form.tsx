"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GradientHeading } from "@/components/cabal-ui/gradient-heading";
import { StyledButton } from "@/components/cabal-ui/submit-button";
import { passwordSchema } from "../../../../../constants/schema";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";

interface UserProps {
  userId: string;
}

export const PasswordForm = ({ userId }: UserProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const [issues, setIssues] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  const form = useForm<z.output<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
  });

  const { handleSubmit } = form;

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

  const onPasswordFormAction = async (formData: FormData) => {
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";

    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match." });
      return;
    }

    if (!user) {
      toast({ title: "Error", description: "User is not logged in." });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          userId: user.id,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "Password updated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to change password.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to update profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
    let formData = new FormData(formRef.current!);

    try {
      await onPasswordFormAction(formData);
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
              _password
            </h2>
            <div className="hidden sm:flex items-center space-x-2">
              {form.watch("password") && form.watch("confirmPassword") && (
                <StyledButton
                  disabled={loading}
                  type="submit"
                  form="passwordForm"
                >
                  {loading ? (
                    <Loader size={20} className="animate-spin ml-2" />
                  ) : (
                    "Update password"
                  )}
                </StyledButton>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-1">
                <div className="">
                  <form
                    id="passwordForm"
                    ref={formRef}
                    className="space-y-8"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <GradientHeading size="xs">
                      Change your password
                    </GradientHeading>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl className="relative">
                              <Input
                                type="text"
                                placeholder="Enter new password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Enter your password again"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex sm:hidden">
                      {form.watch("password") && form.watch("confirmPassword") && (
                        <StyledButton
                          disabled={loading}
                          type="submit"
                          form="passwordForm"
                        >
                          {loading ? (
                            <Loader size={20} className="animate-spin ml-2" />
                          ) : (
                            "Update password"
                          )}
                        </StyledButton>
                      )}
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

export default PasswordForm;