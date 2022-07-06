import { components } from "../stores";
import type { CatalogueResponse, IServiceSpec, ServiceManifestLocal } from "./types";

export const initStateFromApi = (services: Record<string, IServiceSpec>, catalogue: CatalogueResponse) => {
	const localManifests = Object.entries(catalogue.catalogue.services).map(([_, manifest]) => {
		return {
			...manifest,
			connects: [] // lazy loaded
		} as ServiceManifestLocal;
	});
	return localManifests;
}