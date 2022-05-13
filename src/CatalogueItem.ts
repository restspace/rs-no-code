export type ComponentMode = "source" | "target" | "process" | "transform" | "terminal";
export interface ApiSpec {
	mode: ComponentMode;
	title: string;
	description: string;
}
export interface CatalogueItem {
	name: string;
	type: string;
	logo: string;
	description: string;
	apis: ApiSpec[];
	configSchema?: any;
}
export interface ConfiguredComponent extends CatalogueItem {
	configuration?: any;
}