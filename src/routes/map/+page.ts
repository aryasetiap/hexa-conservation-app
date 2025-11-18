import type { PageLoad } from './$types';

import type { GeoJSON } from 'leaflet';

import geojsonString from '$lib/countries.geojson?raw';

export const load: PageLoad = () => {
	try {
		const geojson = JSON.parse(geojsonString) as GeoJSON.FeatureCollection;

		const countries = geojson.features
			.map((feature) => feature.properties?.name)
			.filter(Boolean)
			.sort() as string[];
		return {
			geojson: geojson,
			countries: countries
		};
	} catch (error) {
		console.error('Gagal mem-parse geojson lokal:', error);
		return {
			geojson: null,
			countries: [],
			error: 'Gagal mem-parse file geojson lokal.'
		};
	}
};
