"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Copy,
  Eye,
  GalleryVertical,
  MousePointerClick,
  PlusIcon,
  SquareChevronUp,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "../ui/use-toast";
import LoaderSpinner from "../loader-spinner";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import CopyToClipboard from "react-copy-to-clipboard";

interface DashboardPageProps {
  userId: string;
}

interface HistoryEntry {
  timestamp: string;
}

export default function DashboardPage({ userId }: DashboardPageProps) {
  const { toast } = useToast();

  const [selectedPeriod, setSelectedPeriod] = useState("all time");
  const [showUrlPopup, setShowUrlPopup] = useState(false);
  const [selectedStartupName, setSelectedStartupName] = useState<string>("");

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedStartupId, setSelectedStartupId] =
    useState<Id<"startups"> | null>(null);
  const [selectedLogoStorageId, setSelectedLogoStorageId] =
    useState<Id<"_storage"> | null>(null);
  const [selectedDisplayImageStorageId, setSelectedDisplayImageStorageId] =
    useState<Id<"_storage"> | null>(null);
  const [selectedPitchDeckStorageId, setSelectedPitchDeckStorageId] =
    useState<Id<"_storage"> | null>(null);

  const profile = useQuery(api.users.getUserByClerkId, {
    clerkId: userId,
  });

  const details = useQuery(api.startups.getStartupsByUserId, {
    userId: profile?._id as Id<"users">,
  });

  const deleteListing = useMutation(api.startups.deleteStartup);

  const updateStartupStatus = useMutation(api.startups.updateStartup);

  if (!details) return <LoaderSpinner />;

  const filterDataByPeriod = (history: HistoryEntry[], period: string) => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (period) {
      case "today":
        cutoffDate.setHours(0, 0, 0, 0);
        break;
      case "1 week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "1-month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "3-months":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case "6-months":
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case "12-months":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all time":
        return history;
      default:
        return history;
    }

    return history.filter((item) => new Date(item.timestamp) >= cutoffDate);
  };

  const calculatePercentageChange = (
    currentValue: number,
    previousValue: number
  ) => {
    if (previousValue === 0) return currentValue > 0 ? 100 : 0;
    const difference = currentValue - previousValue;
    return (difference / previousValue) * 100;
  };

  const getPreviousMonthData = (history: HistoryEntry[]) => {
    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    return history.filter((item) => {
      const date = new Date(item.timestamp);
      return date >= lastMonthStart && date <= lastMonthEnd;
    }).length;
  };

  const totalWebsiteVisits =
    details
      ?.map((startup) => {
        const filteredVisits = filterDataByPeriod(
          startup.websiteVisitsHistory || [],
          selectedPeriod
        );
        return filteredVisits.length;
      })
      .reduce((acc, count) => acc + count, 0) || 0;

  const totalUpvotes =
    details
      ?.map((startup) => {
        const filteredUpvotes = filterDataByPeriod(
          startup.upvotesHistory || [],
          selectedPeriod
        );
        return filteredUpvotes.length;
      })
      .reduce((acc, count) => acc + count, 0) || 0;

  const totalViews =
    details
      ?.map((startup) => {
        const filteredViews = filterDataByPeriod(
          startup.viewsHistory || [],
          selectedPeriod
        );
        return filteredViews.length;
      })
      .reduce((acc, count) => acc + count, 0) || 0;

  const previousWebsiteVisits =
    details
      ?.map((startup) =>
        getPreviousMonthData(startup.websiteVisitsHistory || [])
      )
      .reduce((acc, count) => acc + count, 0) || 0;

  const previousUpvotes =
    details
      ?.map((startup) => getPreviousMonthData(startup.upvotesHistory || []))
      .reduce((acc, count) => acc + count, 0) || 0;

  const previousViews =
    details
      ?.map((startup) => getPreviousMonthData(startup.viewsHistory || []))
      .reduce((acc, count) => acc + count, 0) || 0;

  const websiteVisitChange = calculatePercentageChange(
    totalWebsiteVisits,
    previousWebsiteVisits
  );
  const upvoteChange = calculatePercentageChange(totalUpvotes, previousUpvotes);
  const viewChange = calculatePercentageChange(totalViews, previousViews);

  const handleCopyUrl = (startupName: string) => {
    setSelectedStartupName(startupName);
    setTimeout(() => setShowUrlPopup(true), 0);
  };

  const handleDelete = (
    startupId: Id<"startups">,
    logoStorageId: Id<"_storage">,
    displayImageStorageId: Id<"_storage">,
    pitchDeckStorageId: Id<"_storage">
  ) => {
    setSelectedStartupId(startupId);
    setSelectedLogoStorageId(logoStorageId);
    setSelectedDisplayImageStorageId(displayImageStorageId);
    setSelectedPitchDeckStorageId(pitchDeckStorageId);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (selectedStartupId) {
      await deleteListing({
        startupId: selectedStartupId,
        logoStorageId: selectedLogoStorageId ?? undefined,
        displayImageStorageId: selectedDisplayImageStorageId ?? undefined,
        pitchDeckStorageId: selectedPitchDeckStorageId ?? undefined,
      });
      toast({
        title: "Success",
        description: "You have successfully deleted your startup listing!",
      });
      setShowDeletePopup(false);
    }
  };

  function formatNumber(number: number): string {
    if (number >= 1000000) {
      const formatted = (number / 1000000).toFixed(1);
      return formatted.endsWith(".0")
        ? formatted.slice(0, -2) + "M"
        : formatted + "M";
    } else if (number >= 1000) {
      const formatted = (number / 1000).toFixed(1);
      return formatted.endsWith(".0")
        ? formatted.slice(0, -2) + "K"
        : formatted + "K";
    }
    return number.toLocaleString();
  }

  const handleStatusToggle = async (
    isChecked: any,
    startupId: Id<"startups">
  ) => {
    if (isChecked) {
      await updateStartupStatus({
        startupId,
        status: "published",
      });
    } else {
      await updateStartupStatus({
        startupId,
        status: "draft",
      });
    }
  };

  return (
    <>
      <Dialog open={showUrlPopup} onOpenChange={setShowUrlPopup}>
        <DialogTrigger asChild>
          <></>
        </DialogTrigger>
        <DialogContent className="max-w-xs sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Startup Url</DialogTitle>
            <DialogDescription>
              <Input
                value={`https://www.builderscabal.com/${selectedStartupName}`}
                readOnly
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center sm:justify-start sm:ml-auto">
            <CopyToClipboard
              text={`https://www.builderscabal.com/${selectedStartupName}`}
            >
              <Button
                className="text-center justify-center"
                onClick={() =>
                  toast({
                    title: "Startup link copied to clipboard!",
                  })
                }
              >
                Copy
                <Copy className="h-5 w-4 ml-1.5" />
              </Button>
            </CopyToClipboard>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeletePopup} onOpenChange={setShowDeletePopup}>
        <DialogTrigger asChild>
          <></>
        </DialogTrigger>
        <DialogContent className="max-w-xs sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              startup listing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start ml-auto">
            <Button
              onClick={confirmDelete}
              className="bg-red-500"
              type="button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 md:p-8 p-0">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              _dashboard
            </h2>
            <div className="flex items-center space-x-2">
              <Select onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder="Select period"
                    defaultValue={selectedPeriod}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="1 week">1 week</SelectItem>
                    <SelectItem value="1-month">1 month</SelectItem>
                    <SelectItem value="3-months">3 months</SelectItem>
                    <SelectItem value="6-months">6 months</SelectItem>
                    <SelectItem value="12-months">12 months</SelectItem>
                    <SelectItem value="all time">All time</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-[#B5E4CA3D] dark:bg-[#2C3A32]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium text-black dark:text-white">
                      Views
                    </CardTitle>
                    <Eye className="h-10 w-10 text-muted-foreground dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl mt-8 mb-1 font-bold text-black dark:text-white">
                      {formatNumber(totalViews)}
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      {viewChange >= 0 ? "+" : ""}
                      {viewChange.toFixed(1)}% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-[#B1E5FC40] dark:bg-[#1F3B4D]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium text-black dark:text-white">
                      Website visits
                    </CardTitle>
                    <MousePointerClick className="h-10 w-10 text-muted-foreground dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl mt-8 mb-1 font-bold text-black dark:text-white">
                      {formatNumber(totalWebsiteVisits)}
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      {websiteVisitChange >= 0 ? "+" : ""}
                      {websiteVisitChange.toFixed(1)}% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-[#FBF1D2] dark:bg-[#403A2D]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium text-black dark:text-white">
                      Upvotes
                    </CardTitle>
                    <SquareChevronUp className="h-10 w-10 text-muted-foreground dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl mt-8 mb-1 font-bold text-black dark:text-white">
                      {formatNumber(totalUpvotes)}
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      {upvoteChange >= 0 ? "+" : ""}
                      {upvoteChange.toFixed(1)}% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              <main className="grid flex-1 items-start">
                <Tabs defaultValue="all" className="mt-8">
                  <div className="flex items-center">
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="published">Published</TabsTrigger>
                      <TabsTrigger value="draft">Draft</TabsTrigger>
                    </TabsList>
                    <Link
                      href="/dashboard/submit"
                      className="ml-auto flex items-center gap-2"
                    >
                      <Button size="sm" className="h-8 gap-1">
                        <PlusIcon className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Submit startup
                        </span>
                      </Button>
                    </Link>
                  </div>
                  <TabsContent value="all">
                    <Card className="">
                      <CardHeader>
                        <CardTitle>All Startups</CardTitle>
                        <CardDescription>
                          Manage your startups and view their performance.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Image</span>
                              </TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead className="hidden md:table-cell">
                                Views
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Website visits
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Upvotes
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Status
                              </TableHead>
                              <TableHead>Toggle Status</TableHead>
                              <TableHead>
                                <span className="sr-only">Actions</span>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {details &&
                              details
                                // Sort: published startups first
                                .sort((a, b) =>
                                  a.status === "published" ? -1 : 1
                                )
                                .map((startup) => (
                                  <TableRow key={startup._id}>
                                    <TableCell className="hidden sm:table-cell">
                                      <Image
                                        alt={startup.name || "Startup image"}
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={
                                          startup.logoUrl ||
                                          startup.displayImageUrl ||
                                          "/images/placeholder.svg"
                                        }
                                        width="64"
                                        quality={100}
                                        unoptimized
                                      />
                                    </TableCell>
                                    <TableCell className="font-medium capitalize">
                                      {startup.name as string}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {formatNumber(startup.viewsHistory?.length ?? 0)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {formatNumber(startup.websiteVisitsHistory?.length ?? 0)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {formatNumber(startup.upvotesHistory?.length ?? 0)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {startup.status === "published" ? (
                                        <Badge
                                          variant="default"
                                          className="bg-[#B5E4CA3D] hover:bg-[#B5E4CA3D] text-green-800 dark:text-white"
                                        >
                                          {startup.status}
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline">
                                          {startup.status || "draft"}
                                        </Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <Switch
                                        id="status"
                                        checked={startup.status === "published"}
                                        onCheckedChange={(isChecked) =>
                                          handleStatusToggle(
                                            isChecked,
                                            startup._id
                                          )
                                        }
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <GalleryVertical className="h-4 w-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleCopyUrl(
                                                startup.routing_name as string
                                              )
                                            }
                                          >
                                            Get Startup Url
                                          </DropdownMenuItem>
                                          <Separator />
                                          <Link
                                            href={`/dashboard/startup/traction/${startup._id}`}
                                          >
                                            <DropdownMenuItem>
                                              Traction report
                                            </DropdownMenuItem>
                                          </Link>
                                          <Link
                                            href={`/dashboard/startup/preview/${startup._id}`}
                                          >
                                            <DropdownMenuItem>
                                              Preview
                                            </DropdownMenuItem>
                                          </Link>
                                          <Link
                                            href={`/dashboard/startup/${startup._id}`}
                                          >
                                            <DropdownMenuItem>
                                              Edit
                                            </DropdownMenuItem>
                                          </Link>
                                          <DropdownMenuItem
                                            className="text-red-500"
                                            onClick={() =>
                                              handleDelete(
                                                startup._id,
                                                startup.logoStorageId!,
                                                startup.displayImageStorageId!,
                                                startup.pitchDeckStorageId!
                                              )
                                            }
                                          >
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                  </TableRow>
                                ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="published">
                    <Card className="">
                      <CardHeader>
                        <CardTitle>Published Startups</CardTitle>
                        <CardDescription>
                          Manage your published startups and view their
                          performance.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Image</span>
                              </TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead className="hidden md:table-cell">
                                Views
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Website visits
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Upvotes
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Status
                              </TableHead>
                              <TableHead>Toggle Status</TableHead>
                              <TableHead>
                                <span className="sr-only">Actions</span>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {details &&
                            details.filter(
                              (startup) => startup.status === "published"
                            ).length === 0 ? (
                              <tr>
                                <td
                                  colSpan={7}
                                  className="text-center py-4 text-muted-foreground"
                                >
                                  No published startup available
                                </td>
                              </tr>
                            ) : (
                              details
                                .filter(
                                  (startup) => startup.status === "published"
                                )
                                .map((startup) => (
                                  <TableRow key={startup._id}>
                                    <TableCell className="hidden sm:table-cell">
                                      <Image
                                        alt={startup.name || "Startup image"}
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={
                                          startup.logoUrl ||
                                          startup.displayImageUrl ||
                                          "/images/placeholder.svg"
                                        }
                                        width="64"
                                        quality={100}
                                        unoptimized
                                      />
                                    </TableCell>
                                    <TableCell className="font-medium capitalize">
                                      {startup.name as string}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {formatNumber(startup.viewsHistory?.length ?? 0)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {formatNumber(startup.websiteVisitsHistory?.length ?? 0)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {formatNumber(startup.upvotesHistory?.length ?? 0)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      <Badge
                                        variant="default"
                                        className="bg-[#B5E4CA3D] hover:bg-[#B5E4CA3D] text-green-800 dark:text-white"
                                      >
                                        {startup.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Switch
                                        id="status"
                                        checked={startup.status === "published"}
                                        onCheckedChange={(isChecked) =>
                                          handleStatusToggle(
                                            isChecked,
                                            startup._id
                                          )
                                        }
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <GalleryVertical className="h-4 w-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleCopyUrl(
                                                startup.routing_name as string
                                              )
                                            }
                                          >
                                            Get Startup Url
                                          </DropdownMenuItem>
                                          <Separator />
                                          <Link
                                            href={`/dashboard/startup/traction/${startup._id}`}
                                          >
                                            <DropdownMenuItem>
                                              Traction report
                                            </DropdownMenuItem>
                                          </Link>
                                          <Link
                                            href={`/dashboard/startup/preview/${startup._id}`}
                                          >
                                            <DropdownMenuItem>
                                              Preview
                                            </DropdownMenuItem>
                                          </Link>
                                          <Link
                                            href={`/dashboard/startup/${startup._id}`}
                                          >
                                            <DropdownMenuItem>
                                              Edit
                                            </DropdownMenuItem>
                                          </Link>
                                          <DropdownMenuItem
                                            className="text-red-500"
                                            onClick={() =>
                                              handleDelete(
                                                startup._id,
                                                startup.logoStorageId!,
                                                startup.displayImageStorageId!,
                                                startup.pitchDeckStorageId!
                                              )
                                            }
                                          >
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                  </TableRow>
                                ))
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="draft">
                    <Card className="">
                      <CardHeader>
                        <CardTitle>Startup Drafts</CardTitle>
                        <CardDescription>
                          Manage your startup drafts.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Image</span>
                              </TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead className="hidden md:table-cell">
                                Views
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Website visits
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Upvotes
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Status
                              </TableHead>
                              <TableHead>Toggle Status</TableHead>
                              <TableHead>
                                <span className="sr-only">Actions</span>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {details &&
                            details.filter(
                              (startup) => startup.status === "draft"
                            ).length === 0 ? (
                              <tr>
                                <td
                                  colSpan={7}
                                  className="text-center py-4 text-muted-foreground"
                                >
                                  No startup draft available
                                </td>
                              </tr>
                            ) : (
                              details
                                .filter((startup) => startup.status === "draft")
                                .map((startup) => (
                                  <TableRow key={startup._id}>
                                    <TableCell className="hidden sm:table-cell">
                                      <Image
                                        alt={startup.name || "Startup image"}
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={
                                          startup.logoUrl ||
                                          startup.displayImageUrl ||
                                          "/images/placeholder.svg"
                                        }
                                        width="64"
                                        quality={100}
                                        unoptimized
                                      />
                                    </TableCell>
                                    <TableCell className="font-medium capitalize">
                                      {startup.name as string}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {formatNumber(startup.viewsHistory?.length ?? 0)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {formatNumber(startup.websiteVisitsHistory?.length ?? 0)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {formatNumber(startup.upvotesHistory?.length ?? 0)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      <Badge variant="outline">
                                        {startup.status || "draft"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Switch
                                        id="status"
                                        checked={startup.status !== "draft"}
                                        onCheckedChange={(isChecked) =>
                                          handleStatusToggle(
                                            isChecked,
                                            startup._id
                                          )
                                        }
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <GalleryVertical className="h-4 w-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleCopyUrl(
                                                startup.routing_name as string
                                              )
                                            }
                                          >
                                            Get Startup Url
                                          </DropdownMenuItem>
                                          <Separator />
                                          <Link
                                            href={`/dashboard/startup/traction/${startup._id}`}
                                          >
                                            <DropdownMenuItem>
                                              Traction report
                                            </DropdownMenuItem>
                                          </Link>
                                          <Link
                                            href={`/dashboard/startup/preview/${startup._id}`}
                                          >
                                            <DropdownMenuItem>
                                              Preview
                                            </DropdownMenuItem>
                                          </Link>
                                          <Link
                                            href={`/dashboard/startup/${startup._id}`}
                                          >
                                            <DropdownMenuItem>
                                              Edit
                                            </DropdownMenuItem>
                                          </Link>
                                          <DropdownMenuItem
                                            className="text-red-500"
                                            onClick={() =>
                                              handleDelete(
                                                startup._id,
                                                startup.logoStorageId!,
                                                startup.displayImageStorageId!,
                                                startup.pitchDeckStorageId!
                                              )
                                            }
                                          >
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                  </TableRow>
                                ))
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};