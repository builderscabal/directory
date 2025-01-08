"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { CheckCheck, Copy, FileUp, Send, X } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "../ui/use-toast";
import LoaderSpinner from "../loader-spinner";
import CopyToClipboard from "react-copy-to-clipboard";

interface DashboardPageProps {
  userId: string;
}

interface EmailViewResult {
  email: string;
  viewedDemo?: boolean;
  viewedDeck?: boolean;
  occupation: string;
  startup: string;
}

export default function StartupLeads({ userId }: DashboardPageProps) {
  const { toast } = useToast();

  const profile = useQuery(api.users.getUserByClerkId, {
    clerkId: userId,
  });

  const startups = useQuery(api.startups.getStartupsByUserId, {
    userId: profile?._id as Id<"users">,
  });

  const [selectedStartup, setSelectedStartup] = useState<string | null>(null);
  const [selectedOccupation, setSelectedOccupation] = useState<string | null>(
    null
  );

  if (!startups) return <LoaderSpinner />;

  // Prepare email view results
  const emailViewResults: EmailViewResult[] = [];

  startups.forEach((startup) => {
    const demoHistory = startup.demoHistory || [];
    const deckHistory = startup.deckHistory || [];
    const emailSet = new Set<string>();

    // Populate emailViewResults with deck history
    deckHistory.forEach((entry) => {
      const email = entry.emailAddress;
      const viewerTitle = entry.viewerTitle || "no occupation available";
      if (email && !emailSet.has(email)) {
        emailSet.add(email);
        emailViewResults.push({
          email,
          viewedDeck: true,
          occupation: viewerTitle,
          startup: startup.name as string,
        });
      }
    });

    // Populate emailViewResults with demo history
    demoHistory.forEach((entry) => {
      const email = entry.emailAddress;
      const viewerTitle = entry.viewerTitle || "no occupation available";
      if (email && !emailSet.has(email)) {
        emailSet.add(email);
        emailViewResults.push({
          email,
          viewedDemo: true,
          occupation: viewerTitle,
          startup: startup.name as string,
        });
      } else {
        const existingEntry = emailViewResults.find(
          (result) => result.email === email
        );
        if (existingEntry) {
          existingEntry.viewedDemo = true;
        }
      }
    });
  });

  // Filter the results based on selected filters
  const filteredResults = emailViewResults.filter((result) => {
    const matchesStartup = selectedStartup
      ? result.startup === selectedStartup
      : true;
    const matchesOccupation = selectedOccupation
      ? result.occupation === selectedOccupation
      : true;
    return matchesStartup && matchesOccupation;
  });

  const handleExport = () => {
    const csvContent = [
      [
        "Startup",
        "Pitch Deck Viewed",
        "Demo Viewed",
        "Email Address",
        "Occupation",
      ],
      ...filteredResults.map((result) => [
        result.startup,
        result.viewedDeck ? "Yes" : "No",
        result.viewedDemo ? "Yes" : "No",
        result.email,
        result.occupation,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "builderscabal_leads.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Success",
      description: "Leads exported successfully!",
    });
  };

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 md:p-8 p-0">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            _leads
          </h2>
        </div>
        <div className="flex">
          <div className="mr-auto inline-flex gap-2">
            <Select onValueChange={setSelectedStartup}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by startup" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {startups.map((startup) => (
                    <SelectItem
                      key={startup._id}
                      value={startup.name as string}
                    >
                      {startup.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedOccupation}>
              <SelectTrigger className="w-[180px] hidden sm:flex">
                <SelectValue placeholder="Filter by occupation" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="advisor">Advisor</SelectItem>
                  <SelectItem value="operator">Operator</SelectItem>
                  <SelectItem value="founder">Founder</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button className="ml-auto" onClick={handleExport}>
            <FileUp className="h-5 w-5 mr-0 sm:mr-1" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export all leads
            </span>
          </Button>
        </div>
        <div className="space-y-4">
          <main className="grid flex-1">
            <Card>
              <CardHeader>
                <CardDescription>
                  Leads generated from your published pitch decks and demos will be automatically captured and listed here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Startup</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Pitch deck viewed
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Demo viewed
                      </TableHead>
                      <TableHead>Email address</TableHead>
                      {/** 
                      <TableHead className="hidden sm:table-cell">
                        Phone number
                      </TableHead>
                      */}
                      <TableHead className="hidden sm:table-cell">
                        Occupation
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium capitalize">
                          {result.startup}{" "}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.viewedDeck ? (
                            <CheckCheck className="h-5 w-5 stroke-green-500" />
                          ) : (
                            <X className="h-5 w-5 stroke-red-500" />
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.viewedDemo ? (
                            <CheckCheck className="h-5 w-5 stroke-green-500" />
                          ) : (
                            <X className="h-5 w-5 stroke-red-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          <CopyToClipboard text={result.email}>
                            <span
                              onClick={() =>
                                toast({
                                  title: "Email address copied to clipboard!",
                                })
                              }
                            >
                              {result.email}
                              <Copy className="h-4 w-4 inline-flex ml-1 text-blue-500" />
                            </span>
                          </CopyToClipboard>
                        </TableCell>
                        {/** 
                            <TableCell className="hidden sm:table-cell">
                              <CopyToClipboard text={result.phone}>
                                <span
                                  onClick={() =>
                                    toast({
                                      title: "Phone number copied to clipboard!",
                                    })
                                  }
                                >
                                  {result.phone}
                                  <Copy className="h-4 w-4 inline-flex ml-1 text-blue-500" />
                                </span>
                              </CopyToClipboard>
                            </TableCell>
                          */}
                        <TableCell className="hidden sm:table-cell capitalize">
                          {result.occupation}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Link href={`mailto:${result.email}`}>
                            <Button variant={"outline"} size="sm" className="h-8 gap-1">
                              <Send className="h-3.5 w-3.5" />
                              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Send an email
                              </span>
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};