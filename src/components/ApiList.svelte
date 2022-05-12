<script lang="ts">
	import { showApis, suspendedAddNodeToDrawFlow } from "../stores";
	import type { ApiSpec, CatalogueItem } from "../CatalogueItem";

	export let creatingCatalogueItem: CatalogueItem | null;

	const chooseApi = (api: ApiSpec) => () => {
		console.log('click api, can add: ' + !!$suspendedAddNodeToDrawFlow);
		if ($suspendedAddNodeToDrawFlow) {
			$suspendedAddNodeToDrawFlow(api);
		}
		$showApis = false;
	};

	let apis: ApiSpec[];
	$: apis = creatingCatalogueItem?.apis || [];
</script>

<div class="overlay" on:click={() => $showApis = false} style="display: {$showApis ? 'block' : 'none'}"></div>
<dialog id="api-modal" open={$showApis}>
	<h2>Choose an API function</h2>
	<div class="api-list">
		{#each apis as api}
			<div class="panel">
				<h3 on:click={chooseApi(api)}>{api.description}</h3>
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
	}

	h3 {
		cursor: pointer;
	}
</style>