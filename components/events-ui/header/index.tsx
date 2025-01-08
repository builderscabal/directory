"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { DirectoryLogo } from "@/components/nav-default";
import { ModeToggle } from "@/app/providers";

function EventsHeader() {
  const { user } = useUser();
  const userId = user?.id;
  const navigationItems = [
    {
      title: "Navigation",
      description: "Navigate the BuildersCabal platform easily.",
      items: [
        {
          title: "About us",
          href: "/about",
        },
        {
          title: "Startups",
          href: "/startups",
        },
        {
          title: "Contact us",
          href: "/contact",
        },
      ],
    },
  ];

  const [isOpen, setOpen] = useState(false);
  return (
    <header className="w-full top-0 left-0 bg-[#FAFAFA] dark:bg-background">
      <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-2 items-center">
        <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
          <NavigationMenu className="flex justify-start items-start">
            <NavigationMenuList className="flex justify-start gap-4 flex-row">
              <DirectoryLogo />
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <>
                    <NavigationMenuTrigger className="font-medium text-sm">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="!w-[450px] p-4">
                      <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                        <div className="flex flex-col h-full justify-between">
                          <div className="flex flex-col">
                            <p className="text-base">{item.title}</p>
                            <p className="text-muted-foreground text-sm">
                              {item.description}
                            </p>
                          </div>
                          <Link href="mailto:thevictoronyekere@gmail.com?subject=I'd%20like%20to%20advertise%20with%20FoundersCabal&body=Hello%20FoundersCabal%20Team,%0D%0A%0D%0AI%27m%20interested%20in%20advertising%20with%20FoundersCabal.%20Could%20you%20please%20provide%20more%20details%20about%20your%20advertising%20options%2C%20rates%2C%20and%20any%20other%20relevant%20information%3F%0D%0A%0D%0AThank%20you%2C%0D%0A[Your%20Name]%0D%0A[Your%20Company%20Name]%0D%0A[Your%20Contact%20Information]">
                            <Button size="sm" className="mt-10">
                              Advertise with us
                            </Button>
                          </Link>
                        </div>
                        <div className="flex flex-col text-sm h-full justify-end">
                          {item.items?.map((subItem) => (
                            <NavigationMenuLink
                              href={subItem.href}
                              key={subItem.title}
                              className="flex flex-row justify-between items-center bg-[#FAFAFA] dark:bg-background py-2 px-4 rounded"
                            >
                              <span>{subItem.title}</span>
                              <MoveRight className="w-4 h-4 text-muted-foreground" />
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="w-full lg:hidden">
          <DirectoryLogo />
        </div>
        <div className="flex justify-end w-full gap-4">
          <ModeToggle />
          <div className="border-r"></div>
          <Link href="mailto:thevictoronyekere@gmail.com?subject=I'd%20like%20to%20advertise%20with%20FoundersCabal&body=Hello%20FoundersCabal%20Team,%0D%0A%0D%0AI%27m%20interested%20in%20advertising%20with%20FoundersCabal.%20Could%20you%20please%20provide%20more%20details%20about%20your%20advertising%20options%2C%20rates%2C%20and%20any%20other%20relevant%20information%3F%0D%0A%0D%0AThank%20you%2C%0D%0A[Your%20Name]%0D%0A[Your%20Company%20Name]%0D%0A[Your%20Contact%20Information]">
            <Button variant="default" className="mt-0.5 hidden md:inline">
              Advertise with us
            </Button>
          </Link>
          {userId ? (
            <Link href="/dashboard" target="_blank">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <Link href="/sign-in" target="_blank">
              <Button variant="outline" className="mt-0.5">
                Login
              </Button>
            </Link>
          )}
        </div>
        <div className="flex w-12 shrink lg:hidden items-end justify-end">
          <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          {isOpen && (
            <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-[#FAFAFA] dark:bg-background shadow-lg py-4 container gap-8">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <div className="flex flex-col gap-2">
                    <p className="text-lg">{item.title}</p>
                    {item.items &&
                      item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="flex justify-between items-center"
                        >
                          <span className="text-muted-foreground">
                            {subItem.title}
                          </span>
                          <MoveRight className="w-4 h-4 stroke-1" />
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export { EventsHeader };