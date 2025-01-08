"use client";

import * as React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "@/app/providers";
import { Linkedin, Send, Twitter } from "lucide-react";

function FooterSection() {
  return (
    <footer className="relative border-t bg-[#FAFAFA] dark:bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Stay Connected
            </h2>
            <p className="mb-6 text-muted-foreground">
              Join our newsletter for the latest updates and exclusive offers.
            </p>
            <form className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 backdrop-blur-sm"
              />

              <Send className="absolute right-1 top-1.5 h-6 w-8 rounded-full text-primary transition-transform hover:scale-110" />
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <Link
                href="/"
                className="block transition-colors hover:text-primary"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block transition-colors hover:text-primary"
              >
                About Us
              </Link>
              <Link
                href="/events"
                className="block transition-colors hover:text-primary"
              >
                Events
              </Link>
              <Link
                href="/resources"
                className="block transition-colors hover:text-primary"
              >
                Resources
              </Link>
              <Link
                href="/startups"
                className="block transition-colors hover:text-primary"
              >
                Startups
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <address className="space-y-2 text-sm not-italic">
              <p>Lagos, Nigeria</p>
              <p>London, United Kingdom</p>
              <p>Email: hi@builderscabal.com</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="https://www.linkedin.com/company/builderscabal"
                      target="_blank"
                    >
                      <Linkedin className="h-8 w-8" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="https://x.com/builderscabal" target="_blank">
                      <Twitter className="h-8 w-8" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <ModeToggle />
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-b pt-4 pb-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BuildersCabal. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <Link
              href="/join"
              target="_blank"
              className="transition-colors hover:text-primary"
            >
              Join the Community
            </Link>
            <Link
              href="/terms"
              target="_blank"
              className="transition-colors hover:text-primary"
            >
              Terms of Service
            </Link>
            <Link
              href="policy"
              target="_blank"
              className="transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
        <div className="w-full flex mt-20 items-center justify-center">
          <h1 className="text-center text-5xl sm:text-8xl lg:text-[12rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 to-neutral-900 select-none">
            BuildersCabal
          </h1>
        </div>
      </div>
    </footer>
  );
}

export { FooterSection };