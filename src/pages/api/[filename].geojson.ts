import type { APIRoute } from "astro";
import parser from "@bovan/gpx2geojson";
import { gpx } from "@tmcw/togeojson";
import { DOMParser } from "xmldom";
import { readFile } from "node:fs/promises";

async function parseGpx(path: string): Promise<GeoJSON.GeoJsonObject> {
  let gpxData: string;
    const file = await readFile(path, "utf-8");
    gpxData = new DOMParser().parseFromString(file, "text/xml");
    return gpx(gpxData);
}

export const get: APIRoute = async function get({ params }) {
  const { file } = params;

  if (!file) {
    return {
      status: 400,
      body: "parameter 'file' not found",
    };
  }

  const geojson = await parseGpx(file);
  return {
    status: 200,
    body: geojson,
    headers: {
      "Content-Type": "application/geo+json",
    },
  };
};

export async function getStaticPaths() {
  const files = import.meta.glob("/src/assets/gpx/*.gpx");
  return files.keys().map((file: string) => {
    return {
      params: {
        file,
      },
    };
  });
}
