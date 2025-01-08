import Image from "next/image";
import React from "react";
import { Timeline } from "./timeline";

export function EventsShowcase() {
  const data = [
    {
      title: "Virtual Launch Party",
      href: "/events/launch",
      date: "31st January, 2025",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Join us as we officially unveil BuildersCabal, an impact-driven
            community for tech builders across Africa. BuildersCabal connects
            founders, operators, and innovators who are actively building and
            scaling tech companies, united by a shared vision: to unlock
            prosperity in Africa through innovation and collaboration.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <Image
              src="/images/launch-event.png"
              alt="startup template"
              width={500}
              height={500}
              quality={100}
              priority={true}
              unoptimized={true}
              className="rounded-lg object-cover h-full w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Meet & Greet (London)",
      href: "#",
      date: "not set",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Coming soon...
          </p>
          <div className="grid grid-cols-1 gap-4">
            <Image
              src="/images/placeholder.svg"
              alt="startup template"
              width={500}
              height={500}
              quality={100}
              priority={true}
              unoptimized={true}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-96 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Meet & Greet (Akure)",
      href: "#",
      date: "not set",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Coming soon...
          </p>
          <div className="grid grid-cols-1 gap-4">
            <Image
              src="/images/placeholder.svg"
              alt="startup template"
              width={500}
              height={500}
              quality={100}
              priority={true}
              unoptimized={true}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-96 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Meet & Greet (Ibadan)",
      href: "#",
      date: "not set",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Coming soon...
          </p>
          <div className="grid grid-cols-1 gap-4">
            <Image
              src="/images/placeholder.svg"
              alt="startup template"
              width={500}
              height={500}
              quality={100}
              priority={true}
              unoptimized={true}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-96 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Meet & Greet (Lagos)",
      href: "#",
      date: "not set",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Coming soon...
          </p>
          <div className="grid grid-cols-1 gap-4">
            <Image
              src="/images/placeholder.svg"
              alt="startup template"
              width={500}
              height={500}
              quality={100}
              priority={true}
              unoptimized={true}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-96 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Meet & Greet (Abuja)",
      href: "#",
      date: "not set",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Coming soon...
          </p>
          <div className="grid grid-cols-1 gap-4">
            <Image
              src="/images/placeholder.svg"
              alt="startup template"
              width={500}
              height={500}
              quality={100}
              priority={true}
              unoptimized={true}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-96 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Meet & Greet (PortHarcourt)",
      href: "#",
      date: "not set",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Coming soon...
          </p>
          <div className="grid grid-cols-1 gap-4">
            <Image
              src="/images/placeholder.svg"
              alt="startup template"
              width={500}
              height={500}
              quality={100}
              priority={true}
              unoptimized={true}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-96 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-background">
      <Timeline data={data} />
    </div>
  );
};