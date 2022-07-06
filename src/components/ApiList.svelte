<script lang="ts">
	import { showApis, suspendedAddNodeToDrawFlow } from "../stores";
	import type { ConnectSpec, CatalogueItem, ComponentMode } from "../CatalogueItem";
	import type { ServiceManifestLocal } from "../data/types";

	export let creatingCatalogueItem: ServiceManifestLocal | null;

	const chooseApi = (api: ConnectSpec) => () => {
		console.log('click api, can add: ' + !!$suspendedAddNodeToDrawFlow);
		if ($suspendedAddNodeToDrawFlow) {
			$suspendedAddNodeToDrawFlow(api);
		}
		$showApis = false;
	};

	let apis: ConnectSpec[];
	$: apis = creatingCatalogueItem?.connects || [];

	const apiMode = (mode: ComponentMode) => {
		switch (mode) {
			case "source": return "Trigger: ";
			case "process": return "Action: ";
			default: return "";
		}
	}
</script>

<div class="overlay" on:click={() => $showApis = false} style="display: {$showApis ? 'block' : 'none'}"></div>
<dialog id="api-modal" open={$showApis}>
	<h2>Choose an API function</h2>
	<div class="api-list">
		{#each apis as api}
			<div class="panel" on:click={chooseApi(api)}>
				<h3>{apiMode(api.mode)}{api.title}</h3>
				<p>{api.description}</p>
			</div>
		{/each}
	</div>
</dialog>

<style>
	#api-modal {
		position: fixed;
		height: 75vh;
		width: 75vw;
		top: 12.5vh;
		overflow-y: auto;
		z-index: 100;
	}

	#api-modal h2 {
		text-align: center;
	}

	.overlay {
		width: 100vw;
		height: 100vh;
		background-color: rgba(0,0,0,0.5);
		position: absolute;
		top: 0;
		left: 0;
		display: none;
		z-index: 20;
	}

	.panel {
		cursor: pointer;
		background-color: #eee;
		padding: 1em 1em 0.5em 1em;
    	margin-bottom: 0.5em;
	}
	.panel:hover {
		background-color: #ccc;
	}
	.panel h3 {
		margin: 0 0 1em 0;
		font-size: 1em;
	}
	.panel p {
		margin: 0 0 0.5em 0;
		font-size: 0.8em;
	}
</style>