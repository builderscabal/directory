import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    clerkId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    whatsappNumber: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    twitter: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    notificationMethod: v.optional(v.string()), // email
    notificationType: v.optional(v.string()), // all, startup opportunities, directory updates, none
    communication_updates: v.optional(v.boolean()), // true or false : default = true
    marketing_updates: v.optional(v.boolean()), // true or false
    social_updates: v.optional(v.boolean()), // true or false
    security_updates: v.optional(v.boolean()), // true or false : default = true
    interestInPro: v.optional(v.boolean()),
    onboardStart: v.optional(v.boolean()), // true or false
    occupation: v.optional(v.string()), // founder, operator, investor, advisor
    hearAboutUs: v.optional(v.array(v.string())),
    watchDemo: v.optional(v.boolean()), // true or false
    joinCommunity: v.optional(v.boolean()), // true or false
    acceptedTerms: v.optional(v.boolean()),
    acceptedPolicy: v.optional(v.boolean()),

    //Founder Extras
    onboardFounder: v.optional(v.boolean()),

    //Operator Extras
    rolesWorkedAt: v.optional(v.array(v.string())),
    startupWorkedAt: v.optional(v.string()),

    //Investor Extras
    investmentSectors: v.optional(v.array(v.string())),
    recentInvestment: v.optional(v.string()),

    //Advisor Extras
    advisingSectors: v.optional(v.array(v.string())),
    recentStartupAdvised: v.optional(v.string())
  }),

  startups: defineTable({
    listingOwner: v.id("users"), // founder or operator
    founders: v.optional(v.array(v.string())),
    contact_email: v.string(),
    name: v.optional(v.string()),
    routing_name: v.optional(v.string()),
    url: v.optional(v.string()),
    tagline: v.optional(v.string()),
    description: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    displayImageUrl: v.optional(v.string()),
    displayImageStorageId: v.optional(v.id("_storage")),
    twitter: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    instagram: v.optional(v.string()),
    facebook: v.optional(v.string()),
    youtube: v.optional(v.string()),
    status: v.optional(v.string()), // draft or published
    website_visits: v.number(),
    websiteVisitsHistory: v.optional(v.array(v.object({
      timestamp: v.string(),
    }))),
    views: v.number(),
    viewsHistory: v.optional(v.array(v.object({
      timestamp: v.string(),
      userId: v.optional(
        v.union(
          v.id("users"),
          v.string()
        )
      ),
      startupId: v.optional(v.id("startups")),
      ipAddress: v.optional(v.string()),
    }))),
    sector: v.optional(v.string()),
    category: v.optional(v.string()),
    industry: v.optional(v.string()),
    featured: v.optional(v.boolean()), // true or false | default: false
    approved: v.optional(v.boolean()),
    upvotes: v.number(),
    upvotesHistory: v.optional(v.array(v.object({
      timestamp: v.string(),
      userId: v.optional(v.id("users")),
      startupId: v.optional(v.id("startups")),
      ipAddress: v.optional(v.string()),
    }))),

    // Startup Deck
    pitchDeckUrl: v.optional(v.string()),
    pitchDeckStorageId: v.optional(v.id("_storage")),
    showDeck: v.optional(v.boolean()),

    lockDeck: v.optional(v.boolean()),
    deckPassword: v.optional(v.string()),

    deckHistory: v.optional(v.array(v.object({
      emailAddress: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      timestamp: v.optional(v.string()),
      viewerTitle: v.optional(v.string()), // Investor, Advisor, Founder, Operator
      ipAddress: v.optional(v.string()),
      feedBack: v.optional(v.string()),
    }))),

    // Startup Demo
    demoUrl: v.optional(v.string()),
    demoStorageId: v.optional(v.id("_storage")),
    showDemo: v.optional(v.boolean()),

    lockDemo: v.optional(v.boolean()),
    demoPassword: v.optional(v.string()),

    demoHistory: v.optional(v.array(v.object({
      emailAddress: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      timestamp: v.optional(v.string()),
      viewerTitle: v.optional(v.string()), // Investor, Advisor, Founder, Operator
      ipAddress: v.optional(v.string()),
      feedBack: v.optional(v.string()),
    }))),

    startupAge: v.optional(v.string()),
    teamSize: v.optional(v.string()),
    startupStage: v.optional(v.string()),

    // Startup Metrics
    metrics: v.optional(v.array(v.object({
      id: v.optional(v.string()),
      period: v.optional(v.string()),
      revenueGrowthRate: v.optional(v.string()),
      retentionRate: v.optional(v.string()),
      customersAcquired: v.optional(v.string()),
      activeUsers: v.optional(v.string()),
      report: v.optional(v.string()),
      timestamp: v.optional(v.string()),
    }))),
  }),

  // TODO: Before ProductHunt Launch
  // Build startup deck and demo views history

  sectors: defineTable({
    name: v.optional(v.string())
  }),

  categories: defineTable({
    name: v.optional(v.string())
  }),

  industries: defineTable({
    name: v.optional(v.string())
  }),

  resources: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    tags: v.optional(v.array(v.string())),
    fileUrl: v.optional(v.string()),
    fileStorageId: v.optional(v.id("_storage")),
    videoUrl: v.optional(v.string()),
    videoStorageId: v.optional(v.id("_storage")),
    author: v.optional(v.id("users")),
    isFeatured: v.optional(v.boolean()),
    visibility: v.optional(v.string()),
    views: v.optional(v.number()),
    viewHistory: v.optional(v.array(v.object({
      userId: v.optional(v.id("users")),
      timestamp: v.optional(v.string()),
    }))),
    updates: v.optional(v.array(v.object({
      timestamp: v.optional(v.string()),
      updatedBy: v.optional(v.id("users")),
      changeDescription: v.optional(v.string()),
    })))
  }),
});