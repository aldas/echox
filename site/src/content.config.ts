import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro:schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    // `description` is required (not optional as in the stock schema): every page uses it
    // for SEO/OG meta, so enforce it at build time rather than by convention.
    schema: docsSchema({ extend: z.object({ description: z.string().min(1) }) }),
  }),
};
