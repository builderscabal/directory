import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createStartup = mutation({
  args: {
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
    pitchDeckUrl: v.optional(v.string()),
    pitchDeckStorageId: v.optional(v.id("_storage")),
    showDeck: v.optional(v.boolean()),
    demoUrl: v.optional(v.string()),
    demoStorageId: v.optional(v.id("_storage")),
    showDemo: v.optional(v.boolean()),
    twitter: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    instagram: v.optional(v.string()),
    facebook: v.optional(v.string()),
    youtube: v.optional(v.string()),
    status: v.optional(v.string()), // draft or published
    website_visits: v.number(),
    views: v.number(),
    sector: v.optional(v.string()),
    category: v.optional(v.string()),
    industry: v.optional(v.string()),
    featured: v.optional(v.boolean()), // true or false | default: false
    approved: v.optional(v.boolean()),
    upvotes: v.number(),

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
  },
  handler: async (ctx, args) => {
    const startupId = await ctx.db.insert("startups", {
      listingOwner: args.listingOwner,
      founders: args.founders,
      contact_email: args.contact_email,
      name: args.name,
      routing_name: args.routing_name,
      url: args.url,
      tagline: args.tagline,
      description: args.description,
      logoUrl: args.logoUrl,
      logoStorageId: args.logoStorageId,
      displayImageUrl: args.displayImageUrl,
      displayImageStorageId: args.displayImageStorageId,
      pitchDeckUrl: args.pitchDeckUrl,
      pitchDeckStorageId: args.pitchDeckStorageId,
      showDeck: false,
      demoUrl: args.demoUrl,
      demoStorageId: args.demoStorageId,
      showDemo: false,
      twitter: args.twitter,
      linkedin: args.linkedin,
      instagram: args.instagram,
      facebook: args.facebook,
      youtube: args.youtube,
      status: args.status,
      views: 0,
      website_visits: 0,
      sector: args.sector,
      category: args.category,
      industry: args.industry,
      featured: false,
      approved: false,
      upvotes: 0,
      startupAge: args.startupAge,
      teamSize: args.teamSize,
      startupStage: args.startupStage,
      metrics: [{
        activeUsers: "0",
        customersAcquired: "0",
        id: "dummy-data",
        period: "October, 2024",
        report: "No report available.",
        retentionRate: "0%",
        revenueGrowthRate: "0%",
        timestamp: "2024-05-31T23:59:59Z",
      }],
    });

    return startupId;
  },
});

export const updateStartup = mutation({
  args: {
    startupId: v.id("startups"),
    listingOwner: v.optional(v.id("users")), // founder or operator
    founders: v.optional(v.array(v.string())),
    contact_email: v.optional(v.string()),
    name: v.optional(v.string()),
    routing_name: v.optional(v.string()),
    url: v.optional(v.string()),
    tagline: v.optional(v.string()),
    description: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    displayImageUrl: v.optional(v.string()),
    displayImageStorageId: v.optional(v.id("_storage")),
    pitchDeckUrl: v.optional(v.string()),
    pitchDeckStorageId: v.optional(v.id("_storage")),
    showDeck: v.optional(v.boolean()),
    lockDeck: v.optional(v.boolean()),
    deckPassword: v.optional(v.string()),
    lockDemo: v.optional(v.boolean()),
    demoPassword: v.optional(v.string()),
    demoUrl: v.optional(v.string()),
    demoStorageId: v.optional(v.id("_storage")),
    showDemo: v.optional(v.boolean()),
    twitter: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    instagram: v.optional(v.string()),
    facebook: v.optional(v.string()),
    youtube: v.optional(v.string()),
    status: v.optional(v.string()), // draft or published
    website_visits: v.optional(v.number()),
    views: v.optional(v.number()),
    sector: v.optional(v.string()),
    category: v.optional(v.string()),
    industry: v.optional(v.string()),
    featured: v.optional(v.boolean()), // true or false | default: false
    approved: v.optional(v.boolean()),
    upvotes: v.optional(v.number()),
    websiteVisitsHistory: v.optional(v.array(v.object({
      timestamp: v.string(),
    }))),
    viewsHistory: v.optional(v.array(v.object({
      timestamp: v.string(),
      userId: v.optional(
        v.union(
          v.id("users"),
          v.string()
        )
      ),
      startupId: v.optional(v.id("startups")),
      ipAddress: v.optional(v.string())
    }))),
    upvotesHistory: v.optional(v.array(v.object({
      timestamp: v.string(),
      userId: v.optional(v.id("users")),
      startupId: v.optional(v.id("startups")),
      ipAddress: v.optional(v.string())
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
  },
  handler: async (ctx, args) => {
    const startup = await ctx.db.get(args.startupId);

    if (!startup) {
      throw new ConvexError("Startup listing not found");
    }

    const updateListing = {
      ...(args.listingOwner !== undefined && { listingOwner: args.listingOwner }),
      ...(args.founders !== undefined && { founders: args.founders }),
      ...(args.contact_email !== undefined && {
        contact_email: args.contact_email,
      }),
      ...(args.name !== undefined && { name: args.name }),
      ...(args.routing_name !== undefined && { routing_name: args.routing_name }),
      ...(args.url !== undefined && { url: args.url }),
      ...(args.tagline !== undefined && { tagline: args.tagline }),
      ...(args.description !== undefined && { description: args.description }),
      ...(args.logoUrl !== undefined && { logoUrl: args.logoUrl }),
      ...(args.logoStorageId !== undefined && {
        logoStorageId: args.logoStorageId,
      }),
      ...(args.displayImageUrl !== undefined && {
        displayImageUrl: args.displayImageUrl,
      }),
      ...(args.displayImageStorageId !== undefined && {
        displayImageStorageId: args.displayImageStorageId,
      }),
      ...(args.pitchDeckUrl !== undefined && {
        pitchDeckUrl: args.pitchDeckUrl,
      }),
      ...(args.pitchDeckStorageId !== undefined && {
        pitchDeckStorageId: args.pitchDeckStorageId,
      }),
      ...(args.showDeck !== undefined && {
        showDeck: args.showDeck,
      }),
      ...(args.lockDeck !== undefined && {
        lockDeck: args.lockDeck,
      }),
      ...(args.lockDemo !== undefined && {
        lockDemo: args.lockDemo,
      }),
      ...(args.demoUrl !== undefined && {
        demoUrl: args.demoUrl,
      }),
      ...(args.demoStorageId !== undefined && {
        demoStorageId: args.demoStorageId,
      }),
      ...(args.showDemo !== undefined && {
        showDemo: args.showDemo,
      }),
      ...(args.deckPassword !== undefined && {
        deckPassword: args.deckPassword,
      }),
      ...(args.demoPassword !== undefined && {
        demoPassword: args.demoPassword,
      }),
      ...(args.twitter !== undefined && { twitter: args.twitter }),
      ...(args.linkedin !== undefined && { linkedin: args.linkedin }),
      ...(args.instagram !== undefined && { instagram: args.instagram }),
      ...(args.facebook !== undefined && { facebook: args.facebook }),
      ...(args.youtube !== undefined && { youtube: args.youtube }),
      ...(args.status !== undefined && { status: args.status }),
      ...(args.website_visits !== undefined && {
        website_visits: args.website_visits,
      }),
      ...(args.views !== undefined && { views: args.views }),
      ...(args.sector !== undefined && { sector: args.sector }),
      ...(args.category !== undefined && { category: args.category }),
      ...(args.industry !== undefined && { industry: args.industry }),
      ...(args.featured !== undefined && { featured: args.featured }),
      ...(args.approved !== undefined && { approved: args.approved }),
      ...(args.upvotes !== undefined && { upvotes: args.upvotes }),

      ...(args.upvotes !== undefined && { upvotes: args.upvotes }),
      ...(args.upvotes !== undefined && { upvotes: args.upvotes }),
      ...(args.upvotes !== undefined && { upvotes: args.upvotes }),

      websiteVisitsHistory: args.websiteVisitsHistory
        ? (startup.websiteVisitsHistory || []).concat(args.websiteVisitsHistory)
        : startup.websiteVisitsHistory,
      viewsHistory: args.viewsHistory
        ? (startup.viewsHistory || []).concat(args.viewsHistory)
        : startup.viewsHistory,
      upvotesHistory: args.upvotesHistory
        ? (startup.upvotesHistory || []).concat(args.upvotesHistory)
        : startup.upvotesHistory,

      ...(args.startupAge !== undefined && { startupAge: args.startupAge }),
      ...(args.teamSize !== undefined && { teamSize: args.teamSize }),
      ...(args.startupStage !== undefined && { startupStage: args.startupStage }),

      ...(args.metrics !== undefined && { metrics: [
          ...(startup.metrics || []),
          ...(args.metrics || [])
      ] }),
    };

    await ctx.db.patch(args.startupId, updateListing);

    return args.startupId;
  },
});

export const saveNewLead = mutation({
  args: {
    startupId: v.id("startups"),
    deckHistory: v.optional(v.array(v.object({
      emailAddress: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      timestamp: v.optional(v.string()),
      viewerTitle: v.optional(v.string()), // Investor, Advisor, Founder, Operator
      ipAddress: v.optional(v.string()),
      feedBack: v.optional(v.string()),
    }))),
  },
  handler: async (ctx, args) => {
    const startup = await ctx.db.get(args.startupId);

    if (!startup) {
      throw new ConvexError("Startup listing not found");
    }

    const existingHistory = startup.deckHistory || [];
    const newHistory = args.deckHistory || [];

    // Filter out any new entries that already have the same email or phone number in existingHistory
    const uniqueNewEntries = newHistory.filter(newEntry => {
      return !existingHistory.some(existing => 
        existing.emailAddress === newEntry.emailAddress &&
        existing.phoneNumber === newEntry.phoneNumber
      );
    });

    // Update the deckHistory only if there are unique new entries
    if (uniqueNewEntries.length > 0) {
      const updatedHistory = [...existingHistory, ...uniqueNewEntries];
      await ctx.db.patch(args.startupId, { deckHistory: updatedHistory });
    }

    return args.startupId;
  },
});

export const saveNewDemoLead = mutation({
  args: {
    startupId: v.id("startups"),
    demoHistory: v.optional(v.array(v.object({
      emailAddress: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      timestamp: v.optional(v.string()),
      viewerTitle: v.optional(v.string()), // Investor, Advisor, Founder, Operator
      ipAddress: v.optional(v.string()),
      feedBack: v.optional(v.string()),
    }))),
  },
  handler: async (ctx, args) => {
    const startup = await ctx.db.get(args.startupId);

    if (!startup) {
      throw new ConvexError("Startup listing not found");
    }

    const existingHistory = startup.demoHistory || [];
    const newHistory = args.demoHistory || [];

    // Filter out any new entries that already have the same email or phone number in existingHistory
    const uniqueNewEntries = newHistory.filter(newEntry => {
      return !existingHistory.some(existing => 
        existing.emailAddress === newEntry.emailAddress &&
        existing.phoneNumber === newEntry.phoneNumber
      );
    });

    // Update the demoHistory only if there are unique new entries
    if (uniqueNewEntries.length > 0) {
      const updatedHistory = [...existingHistory, ...uniqueNewEntries];
      await ctx.db.patch(args.startupId, { demoHistory: updatedHistory });
    }

    return args.startupId;
  },
});

export const addNewMetric = mutation({
  args: {
    startupId: v.id("startups"),
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
  },
  handler: async (ctx, args) => {
    const startup = await ctx.db.get(args.startupId);

    if (!startup) {
      throw new ConvexError("Startup listing not found");
    }

    // Check for existing metrics and their periods
    const existingMetrics = startup.metrics || [];

    // Remove metrics with id "dummy-data"
    const filteredMetrics = existingMetrics.filter(metric => metric.id !== "dummy-data");

    // Filter out metrics that already have the same period
    const newMetrics = args.metrics?.filter(metric => {
      return !filteredMetrics.some(existing => existing.period === metric.period);
    }) || [];

    // Update listing only if there are new metrics to add
    const updateListing = {
      ...(newMetrics.length > 0 && { metrics: [
          ...filteredMetrics,
          ...newMetrics,
      ] }),
    };

    // Only patch if there are new metrics to avoid unnecessary database operations
    if (Object.keys(updateListing).length > 0) {
      await ctx.db.patch(args.startupId, updateListing);
    }

    return args.startupId;
  },
});

export const deleteMetric = mutation({
  args: {
    startupId: v.id("startups"),
    metricId: v.string(),
  },
  handler: async (ctx, args) => {
    const startup = await ctx.db.get(args.startupId);

    if (!startup) {
      throw new ConvexError("Startup listing not found");
    }

    // Filter out the metric with the given metricId
    const updatedMetrics = (startup.metrics || []).filter(metric => metric.id !== args.metricId);

    // Update the startup with the filtered metrics array
    await ctx.db.patch(args.startupId, { metrics: updatedMetrics });

    return args.startupId;
  },
});

export const fetchSingleMetric = query({
  args: {
    startupId: v.id("startups"),
    metricId: v.string(),
  },
  handler: async (ctx, args) => {
    const startup = await ctx.db.get(args.startupId);

    if (!startup) {
      throw new ConvexError("Startup listing not found");
    }

    // Find the specific metric by its ID
    const metric = (startup.metrics || []).find(metric => metric.id === args.metricId);

    if (!metric) {
      throw new ConvexError("Metric not found");
    }

    return metric; // Return the found metric
  },
});

export const updateSingleMetric = mutation({
  args: {
    startupId: v.id("startups"),
    metricId: v.string(),
    updatedMetric: v.object({
      id: v.optional(v.string()),
      period: v.optional(v.string()),
      revenueGrowthRate: v.optional(v.string()),
      retentionRate: v.optional(v.string()),
      customersAcquired: v.optional(v.string()),
      activeUsers: v.optional(v.string()),
      report: v.optional(v.string()),
      timestamp: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const startup = await ctx.db.get(args.startupId);

    if (!startup) {
      throw new ConvexError("Startup listing not found");
    }

    // Map through the metrics to find and update the specific metric
    const updatedMetrics = (startup.metrics || []).map(metric => {
      if (metric.id === args.metricId) {
        return { ...metric, ...args.updatedMetric }; // Merge existing metric with updates
      }
      return metric; // Return the unmodified metric
    });

    // Update the startup with the new metrics array
    await ctx.db.patch(args.startupId, { metrics: updatedMetrics });

    return args.metricId; // Optionally return the updated metric ID
  },
});

export const uploadStartupDeck = mutation({
  args: {
    startupId: v.id("startups"),
    pitchDeckUrl: v.optional(v.string()),
    pitchDeckStorageId: v.optional(v.id("_storage")),
    showDeck: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const startup = await ctx.db.get(args.startupId);

    if (!startup) {
      throw new ConvexError("Startup listing not found");
    }

    const { pitchDeckUrl: existingPitchDeckUrl, pitchDeckStorageId: existingPitchDeckStorageId } = startup;

    const updateListing = {
      ...(args.pitchDeckUrl !== undefined && {
        pitchDeckUrl: args.pitchDeckUrl,
      }),
      ...(args.pitchDeckStorageId !== undefined && {
        pitchDeckStorageId: args.pitchDeckStorageId,
      }),
      ...(args.showDeck !== undefined && {
        showDeck: args.showDeck,
      })
    };

    if (args.pitchDeckUrl !== existingPitchDeckUrl) {
      if (existingPitchDeckStorageId) {
        await ctx.storage.delete(existingPitchDeckStorageId);
      }
    }

    if (Object.keys(updateListing).length > 0) {
      await ctx.db.patch(args.startupId, updateListing);
    }

    return args.startupId;
  },
});

export const uploadStartupDemo = mutation({
  args: {
    startupId: v.id("startups"),
    demoUrl: v.optional(v.string()),
    demoStorageId: v.optional(v.id("_storage")),
    showDemo: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const startup = await ctx.db.get(args.startupId);

    if (!startup) {
      throw new ConvexError("Startup listing not found");
    }

    const { demoUrl: existingDemoUrl, demoStorageId: existingDemoStorageId } = startup;

    const updateListing = {
      ...(args.demoUrl !== undefined && {
        demoUrl: args.demoUrl,
      }),
      ...(args.demoStorageId !== undefined && {
        demoStorageId: args.demoStorageId,
      }),
      ...(args.showDemo !== undefined && {
        showDemo: args.showDemo,
      })
    };

    if (args.demoUrl !== existingDemoUrl) {
      if (existingDemoStorageId) {
        await ctx.storage.delete(existingDemoStorageId);
      }
    }

    if (Object.keys(updateListing).length > 0) {
      await ctx.db.patch(args.startupId, updateListing);
    }

    return args.startupId;
  },
});

export const deleteStartup = mutation({
  args: {
    startupId: v.id("startups"),
    logoStorageId: v.optional(v.id("_storage")),
    displayImageStorageId: v.optional(v.id("_storage")),
    pitchDeckStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const startup = await ctx.db.get(args.startupId);

    if (!startup) {
      throw new ConvexError("Startup listing not found");
    }

    if (args.logoStorageId) {
      await ctx.storage.delete(args.logoStorageId);
    }

    if (args.displayImageStorageId) {
      await ctx.storage.delete(args.displayImageStorageId);
    }

    if (args.pitchDeckStorageId) {
      await ctx.storage.delete(args.pitchDeckStorageId);
    }

    return await ctx.db.delete(args.startupId);
  },
});

export const getAllStartups = query({
  handler: async (ctx) => {
    return await ctx.db.query("startups").order("desc").collect();
  },
});

export const getStartups = query({
  args: {
    searchTerm: v.optional(v.string()),
    sector: v.optional(v.string()),
    category: v.optional(v.string()),
    industry: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("startups").order("desc");
    const { searchTerm, sector, category, industry } = args;

    // Apply sector, category, and industry filters first
    if (sector) {
      query = query.filter((q) => q.eq(q.field("sector"), sector));
    }

    if (category) {
      query = query.filter((q) => q.eq(q.field("category"), category));
    }

    if (industry) {
      query = query.filter((q) => q.eq(q.field("industry"), industry));
    }

    // Collect records first
    let results = await query.collect();

    // If there's a searchTerm, filter in-memory for partial matches
    if (searchTerm) {
      results = results.filter((startup) =>
        startup?.name?.includes(searchTerm) ||
        startup?.tagline?.includes(searchTerm) ||
        startup?.description?.includes(searchTerm) ||
        startup?.sector?.includes(searchTerm) ||
        startup?.category?.includes(searchTerm) ||
        startup?.industry?.includes(searchTerm)
      );
    }

    return results;
  },
});

export const getFeaturedStartups = query({
  handler: async (ctx) => {
    return await ctx.db.query("startups")
    .filter((q) => q.eq(q.field("featured"), true))
    .order("desc").collect();
  },
});

export const getApprovedStartups = query({
  args: {
    searchTerm: v.optional(v.string()),
    sector: v.optional(v.string()),
    category: v.optional(v.string()),
    industry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("startups")
      .filter((q) => q.eq(q.field("approved"), true))
      .filter((q) => q.eq(q.field("status"), "published"))
      .order("desc");

    const { searchTerm, sector, category, industry } = args;

    if (sector) {
      query = query.filter((q) => q.eq(q.field("sector"), sector));
    }

    if (category) {
      query = query.filter((q) => q.eq(q.field("category"), category));
    }

    if (industry) {
      query = query.filter((q) => q.eq(q.field("industry"), industry));
    }

    let results = await query.collect();

    if (searchTerm) {
      results = results.filter((startup) =>
        startup?.name?.includes(searchTerm) ||
        startup?.tagline?.includes(searchTerm) ||
        startup?.description?.includes(searchTerm) ||
        startup?.sector?.includes(searchTerm) ||
        startup?.category?.includes(searchTerm) ||
        startup?.industry?.includes(searchTerm)
      );
    }

    return results;
  },
});

export const getStartupById = query({
  args: {
    startupId: v.id("startups"),
  },
  handler: async (ctx, args) => {
    const startup = await ctx.db.get(args.startupId);

    return startup;
  },
});

export const getStartupByRoutingName = query({
  args: {
    routing_name: v.string(),
  },
  handler: async (ctx, args) => {
    const { routing_name } = args;

    const startup = await ctx.db
      .query("startups")
      .filter((q) => q.eq(q.field("routing_name"), routing_name))
      .unique();

    return startup;
  },
});

export const getFoundersByIds = query({
  args: {
    ids: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { ids } = args;

    // Fetch founders based on the provided IDs
    const founders = await ctx.db
      .query("users")
      .filter((q) =>
        // Create an array of OR conditions for each founder ID
        ids.map(id => q.eq(q.field("_id"), id))
        .reduce((prev, curr) => q.or(prev, curr)) // Combine them using q.or
      )
      .collect();

    return founders;
  },
});

export const getStartupsByUserId = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    const startups = await ctx.db
      .query("startups")
      .filter(q => q.eq(q.field("listingOwner"), userId))
      .collect();

    return startups;
  },
});

export const checkUpvotesHistory = query({
  args: {
    userId: v.optional(v.id("users")),
    startupId: v.id("startups"),
  },
  handler: async (ctx, args) => {
    const { userId, startupId } = args;

    // Fetch the startup by startupId
    const startup = await ctx.db
      .query("startups")
      .filter(q => q.eq(q.field("_id"), startupId))
      .first();

    if (!startup || !startup.upvotesHistory) {
      return null; // No record found or no upvotes history
    }

    // Check if the userId exists in the upvotesHistory array
    const hasUpvoted = startup.upvotesHistory.some(upvote => upvote.userId === userId);

    return hasUpvoted ? startup : null; // Return the startup if the user has upvoted
  },
});

export const checkViewsHistory = query({
  args: {
    userId: v.id("users"),
    startupId: v.id("startups"),
  },
  handler: async (ctx, args) => {
    const { userId, startupId } = args;

    // Fetch the startup by startupId
    const startup = await ctx.db
      .query("startups")
      .filter(q => q.eq(q.field("_id"), startupId))
      .first();

    if (!startup || !startup.upvotesHistory) {
      return null; // No record found or no upvotes history
    }

    // Check if the userId exists in the upvotesHistory array
    const hasUpvoted = startup.upvotesHistory.some(upvote => upvote.userId === userId);

    return hasUpvoted ? startup : null; // Return the startup if the user has upvoted
  },
});

// this mutation is required to generate the url after uploading startup logo, display image, or pitch deck to storage.
export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const deletePitchDeck = mutation({
  args: {
    startupId: v.id("startups"),
    pitchDeckStorageId: v.id('_storage')
  },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.pitchDeckStorageId);

    await ctx.db.patch(args.startupId, {
      pitchDeckUrl: undefined,
      pitchDeckStorageId: undefined,
      showDeck: false
    });
  },
});

export const deleteSubmitFiles = mutation({
  args: {
    logoStorageId: v.id('_storage'),
    displayImageStorageId: v.id('_storage')
  },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.logoStorageId);
    await ctx.storage.delete(args.displayImageStorageId);
  },
});

export const deleteDemo = mutation({
  args: {
    startupId: v.id("startups"),
    demoStorageId: v.id('_storage')
  },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.demoStorageId);

    await ctx.db.patch(args.startupId, {
      demoUrl: undefined,
      demoStorageId: undefined,
      showDemo: false
    });
  },
});

export const deleteLogo = mutation({
  args: {
    logoStorageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.logoStorageId);
  },
});

export const deleteDisplayImage = mutation({
  args: {
    displayImageStorageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.displayImageStorageId);
  },
});