import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").order("desc").collect();
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    return user;
  },
});

export const getUserByConvexId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.userId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    return user;
  }
});

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
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
    occupation: v.optional(v.string()),
    hearAboutUs: v.optional(v.array(v.string())),
    watchDemo: v.optional(v.boolean()), // true or false
    joinCommunity: v.optional(v.boolean()),
    acceptedTerms: v.optional(v.boolean()),
    acceptedPolicy: v.optional(v.boolean()),
    rolesWorkedAt: v.optional(v.array(v.string())),
    startupWorkedAt: v.optional(v.string()),
    investmentSectors: v.optional(v.array(v.string())),
    recentInvestment: v.optional(v.string()),
    advisingSectors: v.optional(v.array(v.string())),
    recentStartupAdvised: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    try {
      const id = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        firstName: args.firstName || "",
        lastName: args.lastName || "",
        whatsappNumber: args.whatsappNumber || +234,
        imageUrl: args.imageUrl,
        imageStorageId: args.imageStorageId,
        twitter: args.twitter,
        linkedin: args.linkedin,
        notificationType: "all",
        notificationMethod: "email",
        communication_updates: true,
        marketing_updates: true,
        social_updates: true,
        security_updates: true,
        interestInPro: false,
        onboardStart: false,
        occupation: args.occupation,
        hearAboutUs: [],
        watchDemo: false,
        joinCommunity: false,
        acceptedTerms: true,
        acceptedPolicy: true,
        rolesWorkedAt: args.rolesWorkedAt,
        startupWorkedAt: args.startupWorkedAt,
        investmentSectors: args.investmentSectors,
        recentInvestment: args.recentInvestment,
        advisingSectors: args.advisingSectors,
        recentStartupAdvised: args.recentStartupAdvised
      });
      const newUser = await ctx.db.get(id);

      return newUser;
    } catch (error) {
      console.error("Error creating user account:", error);
      throw new ConvexError("Failed to create user account.");
    }
  }
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    email: v.optional(v.string()),
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
    onboardStart: v.optional(v.boolean()), // true or false
    occupation: v.optional(v.string()),
    hearAboutUs: v.optional(v.array(v.string())),
    watchDemo: v.optional(v.boolean()), // true or false
    joinCommunity: v.optional(v.boolean()),
    rolesWorkedAt: v.optional(v.array(v.string())),
    startupWorkedAt: v.optional(v.string()),
    investmentSectors: v.optional(v.array(v.string())),
    recentInvestment: v.optional(v.string()),
    advisingSectors: v.optional(v.array(v.string())),
    recentStartupAdvised: v.optional(v.string()),
    onboardFounder: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.userId))
      .unique();

    if (!user) {
      throw new ConvexError("User profile not found");
    }

    const updateProfile = {
      ...(args.imageUrl !== undefined && { imageUrl: args.imageUrl }),
      ...(args.imageStorageId !== undefined && { imageStorageId: args.imageStorageId }),
      ...(args.email !== undefined && { email: args.email }),
      ...(args.whatsappNumber !== undefined && { whatsappNumber: args.whatsappNumber }),
      ...(args.firstName !== undefined && { firstName: args.firstName }),
      ...(args.lastName !== undefined && { lastName: args.lastName }),
      ...(args.twitter !== undefined && { twitter: args.twitter }),
      ...(args.linkedin !== undefined && { linkedin: args.linkedin }),
      ...(args.notificationMethod !== undefined && { notificationMethod: args.notificationMethod }),
      ...(args.notificationType !== undefined && { notificationType: args.notificationType }),
      ...(args.communication_updates !== undefined && { communication_updates: args.communication_updates }),
      ...(args.marketing_updates !== undefined && { marketing_updates: args.marketing_updates }),
      ...(args.social_updates !== undefined && { social_updates: args.social_updates }),
      ...(args.security_updates !== undefined && { security_updates: args.security_updates }),
      ...(args.onboardStart !== undefined && { onboardStart: args.onboardStart }),
      ...(args.occupation !== undefined && { occupation: args.occupation }),
      ...(args.hearAboutUs !== undefined && { hearAboutUs: args.hearAboutUs }),
      ...(args.watchDemo !== undefined && { watchDemo: args.watchDemo }),
      ...(args.joinCommunity !== undefined && { joinCommunity: args.joinCommunity }),
      ...(args.rolesWorkedAt !== undefined && { rolesWorkedAt: args.rolesWorkedAt }),
      ...(args.startupWorkedAt !== undefined && { startupWorkedAt: args.startupWorkedAt }),
      ...(args.investmentSectors !== undefined && { investmentSectors: args.investmentSectors }),
      ...(args.recentInvestment !== undefined && { recentInvestment: args.recentInvestment }),
      ...(args.advisingSectors !== undefined && { advisingSectors: args.advisingSectors }),
      ...(args.recentStartupAdvised !== undefined && { recentStartupAdvised: args.recentStartupAdvised }),
      ...(args.onboardFounder !== undefined && { onboardFounder: args.onboardFounder })
    };

    await ctx.db.patch(args.userId, updateProfile);
    return args.userId;
  },
});

export const recordInterest = mutation({
  args: {
    userId: v.id("users"),
    interestInPro: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.userId))
      .unique();

    if (!user) {
      throw new ConvexError("User profile not found");
    }

    const emailAddress = user.email;

    const updateProfile = {
      ...(args.interestInPro !== undefined && { interestInPro: args.interestInPro })
    };

    await ctx.db.patch(args.userId, updateProfile);
    return args.userId;
  },
});

export const deleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new ConvexError("User profile not found");
    }

    return await ctx.db.delete(args.userId);
  },
});

export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const updateClerkUser = internalMutation({
  args: {
    clerkId: v.string(),
    imageUrl: v.optional(v.string()),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User clerk not found");
    }

    const updateFields = {
      ...(args.clerkId !== undefined && { clerkId: args.clerkId }),
      ...(args.imageUrl !== undefined && { imageUrl: args.imageUrl }),
      ...(args.email !== undefined && { email: args.email }),
      ...(args.firstName !== undefined && { firstName: args.firstName }),
      ...(args.lastName !== undefined && { lastName: args.lastName })
    };

    await ctx.db.patch(user._id, updateFields);
    return user._id;
  },
});

export const deleteClerkUser = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User clerk account not found");
    }

    await ctx.db.delete(user._id);
  },
});