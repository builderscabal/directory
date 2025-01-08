import React from "react";
import Link from "next/link";
import { CalendarRange, PlusIcon, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";

export function Hero({ children, startupNumber = 0 }: { children?: React.ReactNode, startupNumber?: number }) {
  return (
    <div className="flex flex-col items-center md:items-start md:px-2 justify-center gap-2 md:ml-12">
      <div className="flex items-center space-x-2">
        <h1 className="text-5xl font-black text-left">
          <img
            className="h-8 sm:h-10 w-full object-cover hidden dark:flex"
            src="/logo/white.png"
            alt="BuildersCabal Logo"
          />
          <img
            className="h-8 sm:h-10 w-full object-cover dark:hidden"
            src="/logo/black.png"
            alt="BuildersCabal Logo"
          />
        </h1>
        <Badge
          variant="outline"
          className="border border-primary/10 hidden md:flex"
        >
          <span className="h-2 w-2 bg-blue-400 rounded-full animate-pulse mr-1"></span>
          {startupNumber === 1 ? "1 startup" : `${startupNumber} startups`}
        </Badge>
      </div>
      <Badge
        variant="outline"
        className="border border-primary/10 flex md:hidden"
      >
        <span className="h-2 w-2 bg-blue-400 rounded-full animate-pulse mr-1"></span>
        {startupNumber === 1 ? "1 startup" : `${startupNumber} startups`}
      </Badge>
      <div className="flex flex-col items-center md:items-start md:mt-4">
        <Badge variant="default">
          <Link href="https://www.linkedin.com/in/sholajegede" target="_blank">Built & Managed by Shola</Link>
        </Badge>
        <div className="flex w-full items-center mt-2 justify-center md:justify-start">
          <span className="text-xl font-bold text-left">
            Directory | BuildersCabal
          </span>
        </div>
        <p className="mt-2 text-center md:max-w-[90%] md:text-left text-muted-foreground text-sm md:text-base">
          Find startups, tools, and products in Africa
        </p>
      </div>
      <div className="flex mt-4 mb-4 space-x-4">
        <Button variant="secondary" asChild>
          <Link href="/dashboard/submit" className="flex items-center text-black">
            <PlusIcon className="size-4 mr-1 mb-0.5" /> Submit startup
          </Link>
        </Button>
        <Link
          href="/events"
          target="_blank"
          rel="noopener"
          className="flex items-center hover:underline"
        >
          <CalendarRange className="size-4 mr-1 mb-0.5" />
          Events
        </Link>
      </div>
      {children}
    </div>
  );
};