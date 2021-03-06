import { Writable, writable } from "svelte/store";
import type { ApiSpec, ConfiguredComponent } from "./CatalogueItem";
import type { NodeSpec } from "./NodeSpec";

export interface DragDrop {
	itemSelect: ConfiguredComponent | null;
	lastMove: any;
}

// components on the ComponentList
export const components: Writable<ConfiguredComponent[]> = writable([]);
// index of configuring component
export const configIdx: Writable<number> = writable(-1);

// info in the component being dragged/dropped
export const dragDrop: Writable<DragDrop> = writable({
	itemSelect: null as ConfiguredComponent | null,
	lastMove: null
});

// UI element visibility
export const showCatalogue = writable(false);
export const showForm = writable(false);
export const showApis = writable(false);

// Nodes on surface
export const nodeData: Writable<Record<number, NodeSpec>> = writable({});

// Selected node
export const currentNodeId: number = 0;

// Holds action to be taken on chosen ApiSpec while showing user dialog for ApiSpec selection
export const suspendedAddNodeToDrawFlow: Writable<(apiSpec: ApiSpec) => void | null> = writable(null);