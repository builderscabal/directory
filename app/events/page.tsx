import React from 'react'
import { EventsHeader } from '@/components/events-ui/header'
import { EventsHero } from '@/components/events-ui/hero'
import { EventsShowcase } from '@/components/events-ui/showcase'
import { EventsFooter } from '@/components/events-ui/footer'

const page = () => {
  return (
    <div className="bg-[#FAFAFA] dark:bg-background">
      <EventsHeader />
      <EventsHero />
      <EventsShowcase />
      <EventsFooter />
    </div>
  )
}

export default page