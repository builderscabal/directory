import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveIndustry = mutation({
  args: {
    name: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const existingIndustry = await ctx.db
      .query("industries")
      .filter(q => q.eq(q.field("name"), args.name))
      .unique();

    if (existingIndustry) {
      return Promise.resolve();
    }

    await ctx.db.insert("industries", {
      name: args.name
    });
    return Promise.resolve();
  },
});

export const updateIndustry = mutation({
  args: {
    industryId: v.id("industries"),
    name: v.optional(v.string())
  },
  handler: async (ctx, args) => {

    const industry = await ctx.db.get(args.industryId);

    if (!industry) {
      throw new ConvexError("Industry not found");
    };

    const updateField = {
      ...(args.name !== undefined && { name: args.name })
    };

    await ctx.db.patch(args.industryId, updateField);

    return args.industryId;
  },
});

export const deleteIndustry = mutation({
  args: {
    industryId: v.id("industries"),
  },
  handler: async (ctx, args) => {
    const industry = await ctx.db.get(args.industryId);

    if (!industry) {
      throw new ConvexError("Industry not found");
    };

    return await ctx.db.delete(args.industryId);
  },
});

export const getAllIndustries = query({
  handler: async (ctx) => {
    return await ctx.db.query("industries").order("desc").collect();
  },
});

export const getIndustryById = query({
  args: {
    industryId: v.id("industries"),
  },
  handler: async (ctx, args) => {
    const industry = await ctx.db.get(args.industryId);

    return industry;
  },
});

export const getIndustryByName = query({
  args: {
    name: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { name } = args;

    const industry = await ctx.db
      .query("industries")
      .filter(q => q.eq(q.field("name"), name))
      .unique();

    return industry;
  },
});