"use client";

import Link from "next/link";
import { DirectoryLogo } from "@/components/nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NoExistStartup = () => {
  return (
    <>
      <div className="flex items-center">
        <DirectoryLogo />
      </div>

      <div className={cn("relative flex flex-col h-full")}>
        <div className="w-full gap-8 py-6 relative items-center">
          <div className="gap-8 w-full">
            <div className="space-y-6 md:mt-12 z-10">
              <div className="grid items-center justify-center text-center py-32">
                <p>This startup does not exist. Click on the button below to go back to all startups.</p>
                <Link href="/startups" className="pr-10 pl-10 mt-4">
                  <Button className="justify-center">
                    Back to all startups
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-36 md:top-0 left-[-10%] right-0 h-[400px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(59,130,255,.15),rgba(255,255,255,0))]"></div>
      </div>
    </>
  );
};

export default NoExistStartup;