<script lang="ts">
	import type { CatalogueItem, ConfiguredComponent } from "../CatalogueItem";
	import { components, showCatalogue } from "../stores";

	export let catalogue: CatalogueItem[];

	const chooseComponent = (component: CatalogueItem) => () => {
		const configuredComponent = component as ConfiguredComponent;
		if (!configuredComponent.configSchema || Object.keys(configuredComponent.configSchema).length === 0) {
			configuredComponent.configuration = {};
		}
		components.update(val => [ ...val, configuredComponent ]);
		$showCatalogue = false;
	};
</script>

<div class="overlay" on:click={() => $showCatalogue = false} style="display: {$showCatalogue ? 'block' : 'none'}"></div>
<dialog id="service-modal" open={$showCatalogue}>
	<h2>Choose a new component</h2>
	<div class="catalogue">
		{#each catalogue as item}
			<div on:click={chooseComponent(item)} class="panel">
				<h3>{item.name}<img alt="{item.name} logo" class="logo" src="/img/{item.logo}"/></h3>
				<h4>{item.type}</h4>
				<p>{item.description}</p>
			</div>
		{/each}
	</div>
</dialog>

<style>
	#service-modal {
		position: fixed;
		height: 75vh;
		width: 75vw;
		top: 12.5vh;
		overflow-y: auto;
		z-index: 100;
	}

	#service-modal h2 {
		text-align: center;
		margin: 1.2em 0 1.8em;
    	text-transform: uppercase;
	}

	.catalogue {
		display: grid;
		grid-gap: 20px;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	}

	.panel {
		background-color: #f8f8f8;
		border: 1px solid #ccc;
		border-radius: 10px;
		padding: 15px;
		cursor: pointer;
	}
	.panel:hover {
		background-color: #f0f0f0;
	}
	.panel h3 {
		margin-top: 0;
		display: flex;
		justify-content: space-between;
		color: var(--dark-background);
	}
	.panel h3 img {
		height: 24px;
	}
	.panel p {
		margin-bottom: 0;
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
</style>