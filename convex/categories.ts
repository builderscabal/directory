import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveCategory = mutation({
  args: {
    name: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const existingCategory = await ctx.db
      .query("categories")
      .filter(q => q.eq(q.field("name"), args.name))
      .unique();

    if (existingCategory) {
      return Promise.resolve();
    }

    await ctx.db.insert("categories", {
      name: args.name
    });
    return Promise.resolve();
  },
});

export const updateCategory = mutation({
  args: {
    categoryId: v.id("categories"),
    name: v.optional(v.string())
  },
  handler: async (ctx, args) => {

    const category = await ctx.db.get(args.categoryId);

    if (!category) {
      throw new ConvexError("Category not found");
    };

    const updateField = {
      ...(args.name !== undefined && { name: args.name })
    };

    await ctx.db.patch(args.categoryId, updateField);

    return args.categoryId;
  },
});

export const deleteCategory = mutation({
  args: {
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.categoryId);

    if (!category) {
      throw new ConvexError("Category not found");
    };

    return await ctx.db.delete(args.categoryId);
  },
});

export const getAllCategories = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("desc").collect();
  },
});

export const getCategoryById = query({
  args: {
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.categoryId);

    return category;
  },
});

export const getCategoryByName = query({
  args: {
    name: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { name } = args;

    const category = await ctx.db
      .query("categories")
      .filter(q => q.eq(q.field("name"), name))
      .unique();

    return category;
  },
});