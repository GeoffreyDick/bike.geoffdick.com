import { defineCollection, z } from "astro:content";

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
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    image: image().refine((img) => img.width >= 1080, {
      message: "Cover image must be at least 1080 pixels wide!",
    }).optional(),
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
