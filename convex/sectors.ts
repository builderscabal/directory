import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveSector = mutation({
  args: {
    name: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const existingSector = await ctx.db
      .query("sectors")
      .filter(q => q.eq(q.field("name"), args.name))
      .unique();

    if (existingSector) {
      return Promise.resolve();
    }

    await ctx.db.insert("sectors", {
      name: args.name
    });
    return Promise.resolve();
  },
});

export const updateSector = mutation({
  args: {
    sectorId: v.id("sectors"),
    name: v.optional(v.string())
  },
  handler: async (ctx, args) => {

    const sector = await ctx.db.get(args.sectorId);

    if (!sector) {
      throw new ConvexError("Sector not found");
    };

    const updateField = {
      ...(args.name !== undefined && { name: args.name })
    };

    await ctx.db.patch(args.sectorId, updateField);

    return args.sectorId;
  },
});

export const deleteSector = mutation({
  args: {
    sectorId: v.id("sectors"),
  },
  handler: async (ctx, args) => {
    const sector = await ctx.db.get(args.sectorId);

    if (!sector) {
      throw new ConvexError("Sector not found");
    };

    return await ctx.db.delete(args.sectorId);
  },
});

export const getAllSectors = query({
  handler: async (ctx) => {
    return await ctx.db.query("sectors").order("desc").collect();
  },
});

export const getSectorById = query({
  args: {
    sectorId: v.id("sectors"),
  },
  handler: async (ctx, args) => {
    const sector = await ctx.db.get(args.sectorId);

    return sector;
  },
});

export const getSectorByName = query({
  args: {
    name: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { name } = args;

    const sector = await ctx.db
      .query("sectors")
      .filter(q => q.eq(q.field("name"), name))
      .unique();

    return sector;
  },
});