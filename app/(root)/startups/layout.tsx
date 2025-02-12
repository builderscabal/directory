import { Metadata } from 'next';
import { PropsWithChildren } from "react"

export const metadata: Metadata = {
  title: 'Startup Directory | BuildersCabal',
  description: 'All startups listed on BuildersCabal'
};

export default function StartupsLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen  ">
      <div className=" mx-auto flex  flex-1 flex-col md:px-4  pb-12 relative">
        {children}
      </div>
    </div>
  )
};