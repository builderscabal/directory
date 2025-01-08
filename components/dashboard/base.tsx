"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import LoaderSpinner from "../loader-spinner";

export interface SEOCardGridProps {
  children?: React.ReactNode;
}

export const DashboardBaseGrid: React.FC<SEOCardGridProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col md:items-start gap-4 overflow-hidden pb-4 md:mx-4 mx-0 md:ml-[12rem] lg:ml-[12rem] relative">
      <div
        className={cn(
          "p-4 w-full bg-white dark:bg-[#1E1E1E] rounded-[0.6rem] shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]"
        )}
      >
        <Suspense fallback={<LoaderSpinner />}>
          <TailwindMasonryGrid children={children} />
        </Suspense>
      </div>
    </div>
  );
};

interface TailwindMasonryGridProps {
  children?: React.ReactNode;
}

const TailwindMasonryGrid: React.FC<TailwindMasonryGridProps> = ({
  children,
}) => {
  return (
    <div className="flex justify-center w-full">
      <div className="gap-4 w-full">
        <div className="columns-1 sm:columns-1 md:columns-1 lg:columns-1 space-y-3 w-full">
          {children}
        </div>
      </div>
    </div>
  );
};