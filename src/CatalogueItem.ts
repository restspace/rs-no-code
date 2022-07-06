export type ComponentMode = "source" | "target" | "process" | "transform" | "terminal";
export interface ConnectSpec {
	mode: ComponentMode;
	title: string;
	description: string;
}
export interface CatalogueItem {
	name: string;
	type: string;
	logo: string;
	description: string;
	apis: ConnectSpec[];
	configSchema?: any;
}
export interface ConfiguredComponent extends CatalogueItem {
	configuration?: any;
}