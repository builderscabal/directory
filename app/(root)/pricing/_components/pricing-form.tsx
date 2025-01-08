"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckIcon, MinusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

interface PlanFeature {
  type: string;
  features: {
    name: string;
    free: boolean;
    startup: boolean;
  }[];
}

const planFeatures: PlanFeature[] = [
  {
    type: "Listing",
    features: [
      {
        name: "List up to 3 startups",
        free: false,
        startup: true,
      },
      {
        name: "Upload up to 3 pitch decks",
        free: false,
        startup: true,
      },
      {
        name: "Upload up to 3 demos",
        free: false,
        startup: true,
      },
    ],
  },
  {
    type: "Analytics",
    features: [
      {
        name: "Basic analytics (upvotes, views, clicks)",
        free: true,
        startup: true,
      },
      {
        name: "Pitch deck history tracking",
        free: true,
        startup: true,
      },
      {
        name: "Demo history tracking",
        free: true,
        startup: true,
      },
    ],
  },
  {
    type: "Lead Generation",
    features: [
      {
        name: "Access to pitch deck viewer information",
        free: false,
        startup: true,
      },
      {
        name: "Access to demo viewer information",
        free: true,
        startup: true,
      },
    ],
  },
  {
    type: "Protection & Privacy",
    features: [
      {
        name: "Password-protected access to pitch decks and demos",
        free: false,
        startup: true,
      },
      {
        name: "Custom email notifications for deck and demo views",
        free: false,
        startup: true,
      },
      {
        name: "Monthly customized reports on listing engagement",
        free: false,
        startup: true,
      },
    ],
  },
  {
    type: "Support",
    features: [
      {
        name: "Get personalized content on venture capital networks, grant opportunities, and accelerator programs.",
        free: false,
        startup: true,
      },
    ],
  },
];

interface PricingPageProps {
  userId: string;
}

const PricingForm = ({ userId }: PricingPageProps) => {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);
  const [interestRecorded, setInterestRecorded] = useState(false);

  const profile = useQuery(api.users.getUserByClerkId, {
    clerkId: userId,
  });

  const record = useMutation(api.users.recordInterest);

  const togglePricing = () => {
    setIsAnnual(!isAnnual);
  };

  const getPrice = (monthly: number, yearly: number) => {
    return isAnnual ? yearly : monthly;
  };

  const handleFreePlan = () => {
    router.push("/dashboard");
  };

  const handleStartupPlan = async () => {
    try {
      await record({
        userId: profile?._id as Id<"users">,
        interestInPro: true,
      });
      setInterestRecorded(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Dialog open={interestRecorded} onOpenChange={setInterestRecorded}>
        <DialogTrigger asChild>
          <></>
        </DialogTrigger>
        <DialogContent className="max-w-xs sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Recorded</DialogTitle>
            <DialogDescription>
              Your interest in this plan has been successfully recorded, we
              would reach out to you with updates.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center sm:justify-start sm:ml-auto">
            <Link href="/dashboard" className="text-center justify-center">
              <Button>
                Back to Dashboard
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="sm:container py-16">
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Pricing
          </h2>
          <p className="mt-1 text-muted-foreground">
            Affordable pricing for every startup
          </p>
        </div>
        <div className="flex justify-center items-center">
          <Label htmlFor="pricing-plans" className="me-3">
            Monthly
          </Label>
          <Switch
            className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-400"
            id="pricing-plans"
            checked={isAnnual}
            onCheckedChange={togglePricing}
          />
          <Label htmlFor="pricing-plans" className="relative ms-3">
            Annual
            <span className="absolute -top-10 start-auto -end-28">
              <span className="flex items-center">
                <svg
                  className="w-14 h-8 -me-6 stroke-blue-600 dark:stroke-blue-400"
                  width={45}
                  height={25}
                  viewBox="0 0 45 25"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
                    fill="currentColor"
                    className="text-blue-600 dark:text-blue-400"
                  />
                </svg>
                <Badge className="mt-3 uppercase">Save up to 32%</Badge>
              </span>
            </span>
          </Label>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 pl-0 pr-0 lg:pl-64 lg:pr-64 gap-6 items-center justify-center text-center">
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="mb-7">Launch</CardTitle>
              <span className="font-bold text-5xl">Free</span>
            </CardHeader>
            <CardDescription className="text-center">
              Forever free
            </CardDescription>
            <CardContent>
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Limited listing</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">
                    Limited lead generation
                  </span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Analytics</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleFreePlan}
                className="w-full justify-center"
                variant={"outline"}
              >
                Get plan
              </Button>
            </CardFooter>
          </Card>
          <Card className="border-blue-500">
            <CardHeader className="text-center pb-2">
              <Badge className="uppercase w-max self-center mb-3">Beta</Badge>
              <CardTitle className="!mb-7">Accelerate</CardTitle>
              <span className="font-bold text-5xl">${getPrice(47, 32)}</span>
            </CardHeader>
            <CardDescription className="text-center w-11/12 mx-auto">
              Go from ZERO to ONE
            </CardDescription>
            <CardContent>
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">
                    Everything in launch
                  </span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Lead generation</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">
                    Protection & privacy
                  </span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Startup support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleStartupPlan}
                className="w-full justify-center"
              >
                Get plan
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="mt-20 lg:mt-32">
          <div className="lg:text-center mb-10 lg:mb-20">
            <h3 className="text-2xl font-semibold dark:text-white">
              Compare plans
            </h3>
          </div>
          <Table className="hidden lg:table">
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-2/12 text-primary">Plans</TableHead>
                <TableHead className="w-2/12 text-primary text-lg font-medium text-center">
                  Launch
                </TableHead>
                <TableHead className="w-2/12 text-primary text-lg font-medium text-center">
                  Accelerate
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planFeatures.map((featureType) => (
                <>
                  <TableRow className="bg-muted/50" key={featureType.type}>
                    <TableCell colSpan={5} className="font-bold">
                      {featureType.type}
                    </TableCell>
                  </TableRow>
                  {featureType.features.map((feature) => (
                    <TableRow
                      key={feature.name}
                      className="text-muted-foreground"
                    >
                      <TableCell>{feature.name}</TableCell>
                      <TableCell>
                        <div className="mx-auto w-min">
                          {feature.free ? (
                            <CheckIcon className="h-5 w-5" />
                          ) : (
                            <MinusIcon className="h-5 w-5" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="mx-auto w-min">
                          {feature.startup ? (
                            <CheckIcon className="h-5 w-5" />
                          ) : (
                            <MinusIcon className="h-5 w-5" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ))}
            </TableBody>
          </Table>

          <div className="space-y-24 lg:hidden">
            <section>
              <div className="mb-4">
                <h4 className="text-xl font-medium">Launch</h4>
              </div>
              <Table>
                {planFeatures.map((featureType) => (
                  <>
                    <TableRow
                      key={featureType.type}
                      className="bg-muted hover:bg-muted"
                    >
                      <TableCell
                        colSpan={2}
                        className="w-10/12 text-primary font-bold"
                      >
                        {featureType.type}
                      </TableCell>
                    </TableRow>
                    {featureType.features.map((feature) => (
                      <TableRow
                        className="text-muted-foreground"
                        key={feature.name}
                      >
                        <TableCell className="w-11/12">
                          {feature.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {feature.free ? (
                            <CheckIcon className="h-5 w-5" />
                          ) : feature.startup ? (
                            <MinusIcon className="h-5 w-5" />
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}
              </Table>
            </section>
            <section>
              <div className="mb-4">
                <h4 className="text-xl font-medium">Accelerate</h4>
              </div>
              <Table>
                {planFeatures.map((featureType) => (
                  <>
                    <TableRow
                      key={featureType.type}
                      className="bg-muted hover:bg-muted"
                    >
                      <TableCell
                        colSpan={2}
                        className="w-10/12 text-primary font-bold"
                      >
                        {featureType.type}
                      </TableCell>
                    </TableRow>
                    {featureType.features.map((feature) => (
                      <TableRow
                        className="text-muted-foreground"
                        key={feature.name}
                      >
                        <TableCell className="w-11/12">
                          {feature.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {feature.startup ? (
                            <CheckIcon className="h-5 w-5" />
                          ) : (
                            <MinusIcon className="h-5 w-5" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}
              </Table>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingForm;