import parser from '@bovan/gpx2geojson';
import { readFile } from 'node:fs/promises';

export async function parseGpx(path: string): Promise<GeoJSON.GeoJsonObject> {
	let gpxData: string;
	try {
		gpxData = await readFile(path, 'utf-8');
		return parser(gpxData);
	} catch (error: any) {
		throw new Error(error?.message);
	}
}
