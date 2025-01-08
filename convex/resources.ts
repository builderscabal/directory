import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createResource = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    fileUrl: v.optional(v.string()),
    fileStorageId: v.optional(v.id("_storage")),
    videoUrl: v.optional(v.string()),
    videoStorageId: v.optional(v.id("_storage")),
    author: v.optional(v.id("users")),
    isFeatured: v.optional(v.boolean()),
    visibility: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingResource = await ctx.db
      .query("resources")
      .filter(q => q.eq(q.field("title"), args.title))
      .unique();

    if (existingResource) {
      return Promise.resolve();
    }

    await ctx.db.insert("resources", {
      title: args.title,
      category: args.category,
      views: 0,
      description: args.description,
      tags: args.tags,
      author: args.author,
      visibility: args.visibility,
      isFeatured: args.isFeatured,
      fileUrl: args.fileUrl,
      fileStorageId: args.fileStorageId,
      videoUrl: args.videoUrl,
      videoStorageId: args.videoStorageId
    });
    return Promise.resolve();
  },
});

export const updateResource = mutation({
  args: {
    resourceId: v.id("resources"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    fileUrl: v.optional(v.string()),
    fileStorageId: v.optional(v.id("_storage")),
    videoUrl: v.optional(v.string()),
    videoStorageId: v.optional(v.id("_storage")),
    author: v.optional(v.id("users")),
    isFeatured: v.optional(v.boolean()),
    visibility: v.optional(v.string()),
    views: v.optional(v.number()),
    viewHistory: v.optional(
      v.array(
        v.object({
          userId: v.optional(v.id("users")),
          timestamp: v.optional(v.string()),
        })
      )
    ),
    updates: v.optional(
      v.array(
        v.object({
          timestamp: v.optional(v.string()),
          updatedBy: v.optional(v.id("users")),
          changeDescription: v.optional(v.string()),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const resource = await ctx.db.get(args.resourceId);

    if (!resource) {
      throw new ConvexError("Resource not found");
    }

    const updateFields = {
      ...(args.title !== undefined && { title: args.title }),
      ...(args.description !== undefined && { description: args.description }),
      ...(args.category !== undefined && { category: args.category }),
      ...(args.tags !== undefined && { tags: args.tags }),
      ...(args.fileUrl !== undefined && { fileUrl: args.fileUrl }),
      ...(args.fileStorageId !== undefined && { fileStorageId: args.fileStorageId }),
      ...(args.videoUrl !== undefined && { videoUrl: args.videoUrl }),
      ...(args.videoStorageId !== undefined && { videoStorageId: args.videoStorageId }),
      ...(args.author !== undefined && { author: args.author }),
      ...(args.isFeatured !== undefined && { isFeatured: args.isFeatured }),
      ...(args.visibility !== undefined && { visibility: args.visibility }),
      ...(args.views !== undefined && { views: args.views }),
      ...(args.viewHistory !== undefined && { viewHistory: args.viewHistory }),
      ...(args.updates !== undefined && { updates: args.updates }),
    };

    await ctx.db.patch(args.resourceId, updateFields);

    return args.resourceId;
  },
});

export const deleteResource = mutation({
  args: {
    resourceId: v.id("resources"),
  },
  handler: async (ctx, args) => {
    const resource = await ctx.db.get(args.resourceId);

    if (!resource) {
      throw new ConvexError("resource not found");
    };

    return await ctx.db.delete(args.resourceId);
  },
});

export const getAllResources = query({
  handler: async (ctx) => {
    return await ctx.db.query("resources").order("desc").collect();
  },
});

export const getResourceById = query({
  args: {
    resourceId: v.id("resources"),
  },
  handler: async (ctx, args) => {
    const resource = await ctx.db.get(args.resourceId);

    return resource;
  },
});

export const getResourceByTitle = query({
  args: {
    title: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { title } = args;

    const resource = await ctx.db
      .query("resources")
      .filter(q => q.eq(q.field("title"), title))
      .unique();

    return resource;
  },
});