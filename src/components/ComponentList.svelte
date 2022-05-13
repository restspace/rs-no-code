<script lang="ts">
	import AddItem from "@pyoner/svelte-form/src/components/AddItem.svelte";
	import type { ConfiguredComponent } from "../CatalogueItem";
	import { components, dragDrop, showCatalogue, showForm, configIdx } from "../stores";

	export let drop: (ev: any) => void;

	let configComponent: string = '';

	const drag = (component: ConfiguredComponent) => (ev) => {
		if (!component.configuration) return;
		if (ev.type === "touchstart") {
			$dragDrop.itemSelect = component;
		} else {
			ev.dataTransfer.setData("node", JSON.stringify(component));
		}
	}

	function dragMove(ev) {
     	$dragDrop.lastMove = ev;
   	}

	const editConfig = (idx: number) => () => {
		$configIdx = idx;
		const component = $components[idx];
		showForm.update(s => configComponent === component.name ? !s : true);
		configComponent = configComponent === component.name ? '' : component.name;
		$components = [ ...$components ]; // redraw components to show selected one
	}

	const configured = (idx: number) => !!$components[idx].configuration;

	const componentClass = (idx: number) => {
		const classes = [] as string[];
		classes.push(configured(idx) ? "configured" : "unconfigured");
		if ($configIdx === idx) {
			classes.push("selected");
		}
		return classes.join(' ');
	}

	const transformItem: ConfiguredComponent = {
		name: "Transform",
		type: "Processor",
		logo: "",
		description: "",
		apis: [{
			"mode": "transform",
			"title": "",
			"description": ""
		}],
		configuration: {}
	};
	const terminalItem: ConfiguredComponent = {
		name: "Terminal",
		type: "Processor",
		logo: "",
		description: "",
		apis: [{
			"mode": "terminal",
			"title": "",
			"description": ""
		}],
		configuration: {}
	};
</script>

<div class="col">
	<div class="drag-drawflow drag-heading">
	  <h2>Restspace</h2>
	  <div class="add-service" on:click={() => showCatalogue.update(sc => !sc)}>+</div>
	</div>
	<div class="components">
		<div class="custom">
			<div class="service-heading">
				<div class="service-logo" style="background-image: url(/img/services.svg);"></div>
				<span>Services</span>
			</div>
			{#each $components as component, idx (component)}
				{#if component.type !== "Http"}
				<div class="drag-drawflow {componentClass(idx)}" draggable={configured(idx)}
					on:click={editConfig(idx)}
					on:dragstart={drag(component)}
					on:touchstart={drag(component)} on:touchmove={dragMove} on:touchend={drop}>
					<div class="service-logo" style="background-image: url(/img/{component.logo});"></div>
					<span>{component.name}{configured(idx) ? "" : "..."}</span>
				</div>
				{/if}
			{/each}
		</div>
		<div class="paths">
			<div class="service-heading">
				<div class="service-logo" style="background-image: url(/img/http-white.svg);"></div>
				<span>Url paths</span>
			</div>
			{#each $components as component, idx (component)}
				{#if component.type === "Http"}
				<div class="drag-drawflow {componentClass(idx)}" draggable={configured(idx)}
					on:click={editConfig(idx)}
					on:dragstart={drag(component)}
					on:touchstart={drag(component)} on:touchmove={dragMove} on:touchend={drop}>
					<div class="service-logo" style="background-image: url(/img/{component.logo});"></div>
					<span>{component.configuration?.basePath || component.name}{configured(idx) ? "" : "..."}</span>
				</div>
				{/if}
			{/each}
		</div>
		<div class="generic">
			<div class="service-heading">
				<div class="service-logo" style="background-image: url(/img/function.svg);"></div>
				<span>Functions</span>
			</div>
			<div class="drag-drawflow upward" draggable="true"
				on:dragstart={drag(transformItem)}
				on:touchstart={drag(transformItem)} on:touchmove={dragMove} on:touchend={drop}>
				<div class="service-logo" style="background-image: url(/img/transform.svg);"></div>
				<span>Transform</span>
			</div>
			<div class="drag-drawflow upward" draggable="true"
				on:dragstart={drag(terminalItem)}
				on:touchstart={drag(terminalItem)} on:touchmove={dragMove} on:touchend={drop}>
				<div class="service-logo" style="background-image: url(/img/terminal.svg);"></div>
				<span>Terminal</span>
			</div>
		</div>
	</div>
</div>

  <style>
	h2 {
		margin: 0px;
		line-height: 66px;
		font-family: 'Share Tech', sans-serif;
		font-size: 2em;
		letter-spacing: 0.03em;
	}

	.col {
		overflow: auto;
		width: 300px;
		flex: 0 0 300px;
		height: 100%;
		border-right: 1px solid var(--border-color);
		box-shadow: rgba(4, 24, 54, 0.5) 3px 0 6px 6px;
		display: flex;
		flex-direction: column;
	}

	.components {
		flex: 1 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.custom, .generic {
		flex: 0 0;
	}

	.drag-drawflow, .service-heading {
		line-height: 35px;
		padding: 0 20px;
		cursor: move;
		user-select: none;
		display: flex;
		align-items: center;
	}
	.drag-drawflow.selected {
		background-color: #eee;
	}

	.drag-drawflow {
		padding-left: 40px;
	}
	.drag-drawflow.unconfigured {
		cursor: pointer;
	}

	.service-heading {
		background-color: var(--dark-background-semi);
		color: #fff;
		font-weight: bold;
		font-size: 1.2em;
		line-height: 40px;
		border-top: 3px solid rgb(204, 224, 254);
		cursor: pointer;
	}

	.drag-heading {
		color: white;
		background-color: var(--dark-background);
		justify-content: space-between;
		cursor: auto;
		flex: 0 0;
		padding-left: 20px;
	}
	.drag-heading .add-service {
		font-size: 50px;
		border: 2px solid white;
		border-radius: 20px;
		width: 29px;
		height: 29px;
		padding: 0;
		line-height: 28px;
		cursor: pointer;
	}
	.drag-heading .add-service:hover {
		border: 3px solid white;
		position: relative;
		top: 0;
		left: 1px;
	}
  </style>