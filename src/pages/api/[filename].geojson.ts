import type { APIRoute } from 'astro';
import { gpx } from '@tmcw/togeojson';
import { DOMParser } from 'xmldom';
import { readFile } from 'node:fs/promises';

async function parseGpx(path: string): Promise<string> {
	let file: string;
	try {
		file = await readFile(path, 'utf-8');
	} catch (error: any) {
		throw new Error(error?.message);
	}
	const gpxData = new DOMParser().parseFromString(file, 'text/xml');
	return JSON.stringify(gpx(gpxData));
}

export const get: APIRoute = async function get({ params }) {
	const { filename } = params;

	if (!filename) {
		return {
			status: 400,
			body: "parameter 'filename' not found",
		};
	}

	const filePath = `./src/assets/gpx/${filename}.gpx`;

	const geojson = await parseGpx(filePath);

	return {
		status: 200,
		body: geojson,
		headers: {
			'Content-Type': 'application/geo+json',
		},
	};
};

export async function getStaticPaths() {
	const glob = import.meta.glob('/src/assets/gpx/*.gpx', { as: 'raw', eager: true });
	let files: string[] = [];
	for (let key in glob) {
		files.push(key);
	}
	return files.map((file: string) => {
		return {
			params: {
				filename: file.replace('/src/assets/gpx/', '').replace('.gpx', ''),
			},
		};
	});
}
