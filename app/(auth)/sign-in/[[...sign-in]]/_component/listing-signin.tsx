"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSignUp, useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import PageLoader from "@/components/page-loader";
import { Loader, Mail } from "lucide-react";

interface RoutingName {
  startupName?: string;
  routing_name?: string;
}

const generatePassword = (length = 21) => {
  if (typeof window !== "undefined" && window.crypto) {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[]|:;<>,.?/";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, (x) => charset[x % charset.length]).join("");
  } else {
    return Math.random().toString(36).slice(-length);
  }
};

const ListingSignIn = ({ startupName }: RoutingName) => {
  const router = useRouter();
  const {
    signUp,
    isLoaded: isSignUpLoaded,
    setActive: setActiveSignup,
  } = useSignUp();
  const { signIn, isLoaded: isSignInLoaded, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password] = useState(generatePassword());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  if (!isSignInLoaded) {
    return <PageLoader />;
  }

  if (isSignedIn) {
    router.push("/dashboard");
  }

  const handleSignUpOrSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!isSignUpLoaded || !isSignInLoaded) return;
    const redirectUrl = `${window.location.origin}/${startupName}`;
    try {
      const response = await signUp.create({
        emailAddress: email,
        password,
      });

      if (response) {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_link",
          redirectUrl,
        });

        setActiveSignup({ session: signUp.createdSessionId });
        setShowMessage(true);
      }
    } catch (error: any) {
      if (error.errors.some((e: any) => e.code === "form_identifier_exists")) {
        try {
          const signInAttempt = await signIn.create({
            identifier: email,
          });

          const emailAddressIdObj: any =
            signInAttempt?.supportedFirstFactors?.find(
              (factor) => factor.strategy === "email_link"
            );

          const emailAddressId: any = emailAddressIdObj?.emailAddressId || "";

          if (emailAddressId) {
            await signIn.prepareFirstFactor({
              strategy: "email_link",
              redirectUrl,
              emailAddressId,
            });

            setActive({ session: signInAttempt.createdSessionId });
            setShowMessage(true);
          } else {
            throw new Error("Email address ID not found");
          }
        } catch (signInError) {
          console.error("Sign-in error:", signInError);
          setError("Something went wrong while signing in. Please try again.");
        }
      } else {
        console.error("Sign-up error:", error.errors);
        setError(
          error?.errors[0]?.longMessage ??
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    if (!isSignUpLoaded || !isSignInLoaded) return;
    const redirectUrl = `${window.location.origin}/${startupName}`;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sign-up",
        redirectUrlComplete: redirectUrl,
      });
    } catch (err: any) {
      console.error("Sign-in error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUpOrSignIn}>
      <div className="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto">
        <Card>
          {!showMessage ? (
            <>
              <CardHeader className="text-center">
                <h2 className="text-xl sm:text-2xl font-semibold leading-none tracking-tight">
                  Sign in to your account
                </h2>
                <CardDescription>
                  Don't have an account?{" "}
                  <Link
                    className="text-primary hover:underline underline-offset-4"
                    href="/sign-up"
                  >
                    Sign up here
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  type="button"
                  onClick={signInWithGoogle}
                  className="w-full justify-center"
                  variant={"outline"}>
                  <svg
                    className="w-4 h-auto mr-2"
                    width={46}
                    height={47}
                    viewBox="0 0 46 47"
                    fill="none"
                  >
                    <path
                      d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                      fill="#34A853"
                    />
                    <path
                      d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                      fill="#EB4335"
                    />
                  </svg>
                  Continue with Google
                </Button>
                <div className="relative">
                  <Separator asChild className="my-3 bg-background">
                    <div className="py-3 flex items-center text-xs text-muted-foreground uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6 dark:before:border-gray-700 dark:after:border-gray-700">
                      Or
                    </div>
                  </Separator>
                </div>
                <div className="mt-5">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    className="mt-4"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="grid mt-1 gap-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="mt-3 col-span-2 justify-center"
                    >
                      {loading ? (
                        <Loader size={20} className="animate-spin ml-2" />
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center justify-center items-center">
                <Mail className="text-blue-600 h-8 w-8 animate-bounce text-center justify-center items-center" />
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  You've got mail! Please check "
                  <span className="text-blue-600">{email}</span>" for your
                  personalized access link to securely sign in to BuildersCabal.
                </p>
              </CardContent>
            </>
          )}
        </Card>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </form>
  );
};

export default ListingSignIn;