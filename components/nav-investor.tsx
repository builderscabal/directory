"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOutIcon,
  PanelLeftIcon,
  Settings,
  ScanEye,
  ListTree,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/app/providers";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useClerk } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export function NavInvestorSidebar() {
  const pathname = usePathname();
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
          <StartupNav>
            <div className="my-4 space-y-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
                onClick={handleLinkClick}
              >
                <ScanEye className="h-5 w-5" />
                WatchList
              </Link>

              <Link
                href="/dashboard/deals"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
                onClick={handleLinkClick}
              >
                <ListTree className="h-5 w-5" />
                Curated Deal Flow
              </Link>

              <Link
                href="/dashboard/settings"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
                onClick={handleLinkClick}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>

              <p
                className="flex text-red-400 hover:text-red-500 items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => signOut({ redirectUrl: "/" })}
              >
                <LogOutIcon className="h-5 w-5" /> Logout
              </p>
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
                    <Button
                      className="w-full hover:text-red-500"
                      onClick={() => signOut({ redirectUrl: "/" })}
                    >
                      <LogOutIcon className="mr-1 stroke-red-500 size-4" />{" "}
                      Logout
                    </Button>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
          </nav>
        </div>
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
                      <Button
                        className="w-full hover:text-red-500"
                        onClick={() => signOut({ redirectUrl: "/" })}
                      >
                        <LogOutIcon className="mr-1 stroke-red-500 size-4" />{" "}
                        Logout
                      </Button>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <SheetContent
              side="left"
              className="sm:max-w-[15rem] py-4 pl-1 border-r border-primary/10"
            >
              <>
                <nav className="flex flex-col items-start gap-4 px-2 py-5">
                  <StartupNav>
                    <div className="my-4 space-y-3">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        prefetch={false}
                        onClick={handleLinkClick}
                      >
                        <ScanEye className="h-5 w-5" />
                        WatchList
                      </Link>

                      <Link
                        href="/dashboard/deals"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        prefetch={false}
                        onClick={handleLinkClick}
                      >
                        <ListTree className="h-5 w-5" />
                        Curated Deal Flow
                      </Link>

                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        prefetch={false}
                        onClick={handleLinkClick}
                      >
                        <Settings className="h-5 w-5" />
                        Settings
                      </Link>

                      <p
                        className="flex text-red-400 hover:text-red-500 items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        onClick={() => signOut({ redirectUrl: "/" })}
                      >
                        <LogOutIcon className="h-5 w-5" /> Logout
                      </p>
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
                            <Button
                              className="w-full hover:text-red-500"
                              onClick={() => signOut({ redirectUrl: "/" })}
                            >
                              <LogOutIcon className="mr-1 stroke-red-500 size-4" />{" "}
                              Logout
                            </Button>
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
  children?: ReactNode;
};

function StartupNav({ children }: StartupNavProps) {
  return (
    <div className="">
      <DirectoryLogo />
      {children}
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
}