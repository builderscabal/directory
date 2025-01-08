"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BoxIcon,
  LogOutIcon,
  PanelLeftIcon,
  PlusIcon,
  Component,
  Puzzle,
  LayoutDashboard,
  LogInIcon,
  LayoutList,
  Users,
  CreditCard,
} from "lucide-react";
import { cn, truncateString } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/app/providers";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useClerk } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Badge } from "./ui/badge";

interface SectorData {
  _id: Id<"sectors">;
  _creationTime: number;
  name: string;
}

interface CategoryData {
  _id: Id<"categories">;
  _creationTime: number;
  name: string;
}

interface IndustryData {
  _id: Id<"industries">;
  _creationTime: number;
  name: string;
}

export function NavSidebar({
  sectors,
  categories,
  industries,
}: {
  sectors?: SectorData[];
  categories?: CategoryData[];
  industries?: IndustryData[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();
  const userId = user?.id;

  const profile = useQuery(api.users.getUserByClerkId, {
    clerkId: userId,
  });

  const handleLinkClick = () => {
    setSheetOpen(false);
  };

  return (
    <>
      <aside
        className={cn(
          pathname.includes("admin")
            ? "w-16 border-r border-black/10 dark:border-white/10"
            : "w-42",
          "fixed sm:hidden md:flex inset-y-0 left-0 z-10 hidden flex-col bg-[#FAFAFA] dark:bg-background"
        )}
      >
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <StartupNav
            sectors={sectors}
            categories={categories}
            industries={industries}
            handleLinkClick={handleLinkClick}
            searchParams={searchParams}
          >
            <div className="my-4 space-y-3">
              {user ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  onClick={handleLinkClick}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/dashboard/submit"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  onClick={handleLinkClick}
                >
                  <PlusIcon className="h-5 w-5" />
                  Submit startup
                </Link>
              )}
              {user ? (
                <Link
                  href="/dashboard/submit"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  onClick={handleLinkClick}
                >
                  <PlusIcon className="h-5 w-5" />
                  Submit startup
                </Link>
              ) : (
                <Link
                  href="/join"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  onClick={handleLinkClick}
                >
                  <Users className="h-5 w-5" />
                  Join the Cabal
                </Link>
              )}
              <Link
                href="/startups"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
                onClick={handleLinkClick}
              >
                <LayoutList className="h-5 w-5" />
                All startups
              </Link>
              {user ? (
                <p
                  className="flex text-red-400 hover:text-red-500 items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  onClick={() => signOut({ redirectUrl: "/" })}
                >
                  <LogOutIcon className="h-5 w-5" /> Logout
                </p>
              ) : (
                <Link
                  href="/sign-in"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  onClick={handleLinkClick}
                >
                  <LogInIcon className="mr-1 size-4" /> Login
                </Link>
              )}
              <ModeToggle />
            </div>
          </StartupNav>
        </nav>
        <div
          className={
            pathname.includes("admin")
              ? "flex flex-col gap-4 items-center py-5 mt-auto px-2 mx-2"
              : "pl-3 flex flex-col justify-center gap-4 items-start pb-8"
          }
        >
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src={profile?.imageUrl || ""}
                  alt={profile?.firstName || "bc_dir"}
                />
                <AvatarFallback className="bg-gradient-to-r from-blue-300 to-green-300" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gradient-to-t from-primary/70 to-primary/80 rounded-lg"
            >
              <div className="p-[1px] bg-background rounded-md">
                <DropdownMenuLabel>
                  {profile?.firstName || "Directory | BuildersCabal"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary" />
                <DropdownMenuItem>
                  {user ? (
                    <Button
                      className="w-full hover:text-red-500"
                      onClick={() => signOut({ redirectUrl: "/" })}
                    >
                      <LogOutIcon className="mr-1 stroke-red-500 size-4" />{" "}
                      Logout
                    </Button>
                  ) : (
                    <Link href="/sign-in">
                      <Button className="w-full hover:text-red-500">
                        <LogInIcon className="mr-1 stroke-red-500 size-4" />{" "}
                        Login
                      </Button>
                    </Link>
                  )}
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="">
            <ModeToggle />
          </div>
        </div>

        <>
          <nav className="flex flex-col items-start gap-4 px-2 py-5">
            <StartupNav
              sectors={sectors}
              categories={categories}
              industries={industries}
              handleLinkClick={handleLinkClick}
              searchParams={searchParams}
            >
              <div className="my-4 space-y-3">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    prefetch={false}
                    onClick={handleLinkClick}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/submit"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    prefetch={false}
                    onClick={handleLinkClick}
                  >
                    <PlusIcon className="h-5 w-5" />
                    Submit startup
                  </Link>
                )}
                {user ? (
                  <Link
                    href="/dashboard/submit"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    prefetch={false}
                    onClick={handleLinkClick}
                  >
                    <PlusIcon className="h-5 w-5" />
                    Submit startup
                  </Link>
                ) : (
                  <Link
                    href="/join"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    prefetch={false}
                    onClick={handleLinkClick}
                  >
                    <Users className="h-5 w-5" />
                    Join the Cabal
                  </Link>
                )}
                <Link
                  href="/startups"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  onClick={handleLinkClick}
                >
                  <LayoutList className="h-5 w-5" />
                  All startups
                </Link>
                {user ? (
                  <p
                    className="flex text-red-400 hover:text-red-500 items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    onClick={() => signOut({ redirectUrl: "/" })}
                  >
                    <LogOutIcon className="h-5 w-5" /> Logout
                  </p>
                ) : (
                  <Link
                    href="/sign-in"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    prefetch={false}
                    onClick={handleLinkClick}
                  >
                    <LogInIcon className="mr-1 size-4" /> Login
                  </Link>
                )}
              </div>
            </StartupNav>
          </nav>
          <div className="flex flex-col items-start pl-4">
            <nav className="mb-6   flex gap-4 ">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage
                      src={profile?.imageUrl || ""}
                      alt={profile?.firstName || "bc_dir"}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-300 to-blue-300" />
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-gradient-to-t from-primary/70 to-primary/80 rounded-lg"
                >
                  <div className="p-[1px] bg-background rounded-md">
                    <DropdownMenuLabel>
                      {profile?.firstName || "Directory | BuildersCabal"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-primary" />
                    <DropdownMenuItem>
                      {user ? (
                        <Button
                          className="w-full hover:text-red-500"
                          onClick={() => signOut({ redirectUrl: "/" })}
                        >
                          <LogOutIcon className="mr-1 stroke-red-500 size-4" />{" "}
                          Logout
                        </Button>
                      ) : (
                        <Link href="/sign-in">
                          <Button className="w-full">
                            <LogInIcon className="mr-1 size-4" /> Login
                          </Button>
                        </Link>
                      )}
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <ModeToggle />
            </nav>
          </div>
        </>
      </aside>
      <div className="flex flex-col gap-4 pb-2 px-2">
        <header
          className={cn(
            "sticky top-0 z-30 flex h-14 mx-1 md:mx-0 rounded-b-lg items-center gap-4 bg-background dark:bg-[#1E1E1E] px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)]",
            "dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]"
          )}
        >
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden bg-accent">
                <PanelLeftIcon />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <div className="ml-auto mt-1 md:hidden">
              <DirectoryLogo />
            </div>
            <SheetContent
              side="left"
              className="sm:max-w-[15rem] py-4 pl-1 border-r border-primary/10"
            >
              <>
                <nav className="flex flex-col items-start gap-4 px-2 py-5">
                  <StartupNav
                    sectors={sectors}
                    categories={categories}
                    industries={industries}
                    handleLinkClick={handleLinkClick}
                    searchParams={searchParams}
                  >
                    <div className="my-4 space-y-3">
                      {user ? (
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                          prefetch={false}
                          onClick={handleLinkClick}
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          Dashboard
                        </Link>
                      ) : (
                        <Link
                          href="/dashboard/submit"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                          prefetch={false}
                          onClick={handleLinkClick}
                        >
                          <PlusIcon className="h-5 w-5" />
                          Submit startup
                        </Link>
                      )}

                      {user ? (
                        <Link
                          href="/dashboard/submit"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                          prefetch={false}
                          onClick={handleLinkClick}
                        >
                          <PlusIcon className="h-5 w-5" />
                          Submit startup
                        </Link>
                      ) : (
                        <Link
                          href="/join"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                          prefetch={false}
                          onClick={handleLinkClick}
                        >
                          <Users className="h-5 w-5" />
                          Join the Cabal
                        </Link>
                      )}
                      <Link
                        href="/startups"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        prefetch={false}
                        onClick={handleLinkClick}
                      >
                        <LayoutList className="h-5 w-5" />
                        All startups
                      </Link>
                      {user ? (
                        <p
                          className="flex text-red-400 hover:text-red-500 items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                          onClick={() => signOut({ redirectUrl: "/" })}
                        >
                          <LogOutIcon className="h-5 w-5" /> Logout
                        </p>
                      ) : (
                        <Link
                          href="/sign-in"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                          prefetch={false}
                          onClick={handleLinkClick}
                        >
                          <LogInIcon className="mr-1 size-4" /> Login
                        </Link>
                      )}
                    </div>
                  </StartupNav>
                </nav>
                <div className="flex flex-col items-start pl-4">
                  <nav className="mb-6   flex gap-4 ">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Avatar>
                          <AvatarImage
                            src={profile?.imageUrl || ""}
                            alt={profile?.firstName || "bc_dir"}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-blue-300 to-blue-300" />
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-gradient-to-t from-primary/70 to-primary/80 rounded-lg"
                      >
                        <div className="p-[1px] bg-background rounded-md">
                          <DropdownMenuLabel>
                            {profile?.firstName || "Directory | BuildersCabal"}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-primary" />
                          <DropdownMenuItem>
                            {user ? (
                              <Button
                                className="w-full hover:text-red-500"
                                onClick={() =>
                                  signOut({ redirectUrl: "/" })
                                }
                              >
                                <LogOutIcon className="mr-1 stroke-red-500 size-4" />{" "}
                                Logout
                              </Button>
                            ) : (
                              <Link href="/sign-in">
                                <Button className="w-full">
                                  <LogInIcon className="mr-1 size-4" /> Login
                                </Button>
                              </Link>
                            )}
                          </DropdownMenuItem>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <ModeToggle />
                  </nav>
                </div>
              </>
            </SheetContent>
          </Sheet>
        </header>
      </div>
    </>
  );
}

type StartupNavProps = {
  sectors?: SectorData[];
  categories?: CategoryData[];
  industries?: IndustryData[];
  handleLinkClick?: () => void;
  searchParams: URLSearchParams;
  children?: ReactNode;
};

function StartupNav({
  sectors,
  categories,
  industries,
  searchParams,
  handleLinkClick,
  children,
}: StartupNavProps) {
  return (
    <div className="">
      <DirectoryLogo />
      {children}
      <ScrollArea className="h-[calc(100vh-320px)] md:h-[calc(100vh-200px)] pb-20 flex flex-col gap-4 pl-2">
        {sectors && sectors?.length > 0 && (
          <div className="flex items-center gap-2 mt-6 text-muted-foreground">
            <BoxIcon className="size-5 stroke-blue-400" />
            <p className="text-sm md:hidden">Sector</p>
          </div>
        )}
        <ul className="mt-2 w-36 flex flex-col gap-2 items-start justify-center py-2">
          {sectors?.map((sector: SectorData, index: number) => {
            const sectorName = sector.name;
            const selectedSector = searchParams.get("sector");

            return (
              <li key={`sector-${index}-${sectorName}`}>
                <Link
                  href={`/startups?sector=${sectorName}`}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-start space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 rounded-md px-2 py-0.5",
                    "shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)]",
                    "dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]",
                    "dark:hover:shadow-[0_0_0_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.5)]",
                    selectedSector === sectorName
                      ? "bg-blue-400 text-black dark:text-black"
                      : ""
                  )}
                  prefetch={false}
                >
                  <span className="px-1">
                    {sectorName && truncateString(sectorName, 12)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {categories && categories?.length > 0 && (
          <div className="flex items-center gap-2 mt-6 text-muted-foreground">
            <Component className="size-5 stroke-yellow-400" />
            <p className="text-sm md:hidden">Category</p>
          </div>
        )}
        <ul className="mt-2 w-36 flex flex-col gap-2 items-start justify-center py-2">
          {categories?.map((category: CategoryData, index: number) => {
            const categoryName = category.name;
            const selectedCategory = searchParams.get("category");

            return (
              <li key={`category-${index}-${categoryName}`}>
                <Link
                  href={`/startups?category=${categoryName}`}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-start space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 rounded-md px-2 py-0.5",
                    "shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)]",
                    "dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]",
                    "dark:hover:shadow-[0_0_0_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.5)]",
                    selectedCategory === categoryName
                      ? "bg-yellow-400 text-black dark:text-black"
                      : ""
                  )}
                  prefetch={false}
                >
                  <span className="px-1">
                    {categoryName && truncateString(categoryName, 12)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {industries && industries?.length > 0 && (
          <div className="flex items-center gap-2 mt-6 text-muted-foreground">
            <Puzzle className="size-5 stroke-green-400" />
            <p className="text-sm md:hidden">Industry</p>
          </div>
        )}
        <ul className="mt-2 md:w-36 flex flex-col gap-2 items-start justify-center py-2">
          {industries?.map((industry: IndustryData, index: number) => {
            const industryName = industry.name;
            const selectedIndustry = searchParams.get("industry");

            return (
              <li key={`industry-${index}-${industryName}`}>
                <Link
                  href={`/startups?industry=${industryName}`}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-start space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 rounded-md px-2 py-0.5",
                    "shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)]",
                    "dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]",
                    "dark:hover:shadow-[0_0_0_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.5)]",
                    selectedIndustry === industryName
                      ? "bg-green-400 text-black dark:text-black"
                      : ""
                  )}
                  prefetch={false}
                >
                  <span className="px-1 truncate lowercase">
                    {industryName && truncateString(industryName, 12)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </div>
  );
}

export function DirectoryLogo() {
  return (
    <Link href="/">
      <img
        className="size-12 rounded-lg object-cover"
        src="/logo/platform.png"
        alt="BuildersCabal Logo"
      />
    </Link>
  );
};