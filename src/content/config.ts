import { defineCollection, z } from "astro:content";

const seoFields = {
  title: z.string(),
  description: z.string(),
  image: z.string().url().optional(),
};

const postFields = {
  pubDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  updatedDate: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
};

const races = defineCollection({
  schema: z.object({
    ...seoFields,
    ...postFields,
    gpxFiles: z.array(
      z.string().startsWith("/src/assets/gpx/").endsWith(".gpx"),
    ),
    links: z.object({
      strava: z.array(z.string().url()).min(1),
      trackleaders: z.string().url(),
    }),
    result: z.object({
      status: z.enum(["Finished", "Scratched"]),
      place: z.number().positive().int().optional(),
      time: z.string().optional(),
    }),
  }),
});

export const collections = { races };
