import { Globe } from "./globe"

export function EventsHero() {
  return (
    <div className="mt-40 relative flex items-center justify-center overflow-hidden bg-[#FAFAFA] dark:bg-background px-40 pb-10 sm:pb-52 pt-8 md:pb-60">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-5xl sm:text-7xl md:text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Events | BuildersCabal
      </span>
      <Globe className="top-20 sm:top-40 md:top-52 lg:top-28 hidden sm:flex" />
    </div>
  )
}