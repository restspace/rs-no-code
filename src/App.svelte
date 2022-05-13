<script lang="ts">
	import { onMount } from 'svelte';
	import Drawflow from "drawflow";
	import SideForm from "./components/SideForm.svelte";
	import Catalogue from './components/Catalogue.svelte';
	import catalogueJson from "./catalogue.json";
	import { dragDrop, showForm, nodeData, currentNodeId, showApis, suspendedAddNodeToDrawFlow } from "./stores";
	import ComponentList from './components/ComponentList.svelte';
	import type { ApiSpec, CatalogueItem, ConfiguredComponent } from './CatalogueItem';
	import ApiList from './components/ApiList.svelte';

	let editor: Drawflow;
	let creatingCatalogueItem: CatalogueItem | null = null;

	function nodeSelected(id) {
	}

	onMount(() => {
		let id = document.getElementById("drawflow");
		editor = new Drawflow(id);
		editor.reroute = true;
		const dataToImport = {
		drawflow: {
			Home: {
				data: {}
				}
			}
		};
		editor.start();
		editor.import(dataToImport);
		
		// Events!
		editor.on('nodeCreated', function(id) {
		console.log("Node created " + id);
		})

		editor.on('nodeRemoved', function(id) {
		console.log("Node removed " + id);
		})

		editor.on('nodeSelected', nodeSelected);

		editor.on('moduleCreated', function(name) {
		console.log("Module Created " + name);
		})

		editor.on('moduleChanged', function(name) {
		console.log("Module Changed " + name);
		})

		editor.on('connectionCreated', function(connection) {
		console.log('Connection created');
		console.log(connection);
		})

		editor.on('connectionRemoved', function(connection) {
		console.log('Connection removed');
		console.log(connection);
		})

		editor.on('nodeMoved', function(id) {
		console.log("Node moved " + id);
		})

		editor.on('zoom', function(zoom) {
		console.log('Zoom level ' + zoom);
		})

		editor.on('translate', function(position) {
		console.log('Translate x:' + position.x + ' y:'+ position.y);
		})

		editor.on('addReroute', function(id) {
		console.log("Reroute added " + id);
		})

		editor.on('removeReroute', function(id) {
		console.log("Reroute removed " + id);
		})
	});

    function allowDrop(ev) {
    	ev.preventDefault();
    }

    function drop(ev) {
		if (ev.type === "touchend") {
			var parentdrawflow = document.elementFromPoint( $dragDrop.lastMove.touches[0].clientX, $dragDrop.lastMove.touches[0].clientY).closest("#drawflow");
			if (parentdrawflow != null) {
				createNode($dragDrop.itemSelect, $dragDrop.lastMove.touches[0].clientX, $dragDrop.lastMove.touches[0].clientY);
			}
			$dragDrop.itemSelect = null;
			console.log('touchend');
		} else {
			ev.preventDefault();
			const dataJson = ev.dataTransfer.getData("node");
			const data = JSON.parse(dataJson) as ConfiguredComponent;
			createNode(data, ev.clientX, ev.clientY);
			console.log('not touchend');
		}
    }

	function createNode(data: ConfiguredComponent, x: number, y: number) {
		creatingCatalogueItem = data;
		if (data.apis.length < 2) {
			addNodeToDrawFlow(data, x, y, data.apis?.[0]);
		} else {
			$suspendedAddNodeToDrawFlow = (apiSpec: ApiSpec) => addNodeToDrawFlow(data, x, y, apiSpec);
			$showApis = true;
		}
	}

    function addNodeToDrawFlow(itemSelect: ConfiguredComponent, pos_x, pos_y, apiSpec: ApiSpec) {
		if (editor.editor_mode === 'fixed') {
			return false;
		}
		
		pos_x = pos_x * ( editor['precanvas'].clientWidth / (editor['precanvas'].clientWidth * editor.zoom)) - (editor['precanvas'].getBoundingClientRect().x * ( editor['precanvas'].clientWidth / (editor['precanvas'].clientWidth * editor.zoom)));
		pos_y = pos_y * ( editor['precanvas'].clientHeight / (editor['precanvas'].clientHeight * editor.zoom)) - (editor['precanvas'].getBoundingClientRect().y * ( editor['precanvas'].clientHeight / (editor['precanvas'].clientHeight * editor.zoom)));

		const iconHtml = `<img class="logo" src="/img/${itemSelect.logo}"/>`;
		const title = apiSpec.title.startsWith(":") ? itemSelect.configuration[apiSpec.title.substring(1)] : apiSpec.title;
		let html = `
			<div class="node-title">${itemSelect.name}</div>
			<div class="node-api">${title}</div>
		`;
		if (![ "terminal", "transform" ].includes(apiSpec.mode)) html = iconHtml + html;
		const nInputs = apiSpec.mode === "source" ? 0 : 1;
		const nOutputs = [ "target", "terminal" ].includes(apiSpec.mode) ? 0 : 1;
		const nodeId = editor.addNode(itemSelect.name, nInputs,  nOutputs, pos_x, pos_y, `${itemSelect.name} ${apiSpec.mode}-container`, {}, html, false );
		$suspendedAddNodeToDrawFlow = null;
    }

	let showLock = 'block';
	let showUnlock = 'none';
    function changeMode(option) {
		if (option == 'lock') {
			showLock = 'none';
			showUnlock = 'block';
		} else {
			showLock = 'block';
			showUnlock = 'none';
		}
    }

	const zoomOut = () => {
		console.log('zoom out');
		editor.zoom_out();
	}
	const zoomReset = () => {
		console.log('zoom reset');
		editor.zoom_reset();
	}
	const zoomIn = () => {
		console.log('zoom in');
		editor.zoom_in();
	}

	let serviceModal = false;
	const catalogue = catalogueJson as CatalogueItem[];
</script>

<main>
	<div class="wrapper">
		<ComponentList {drop} />
		<div class="col-right">
			<div id="drawflow" on:drop={drop} on:dragover={allowDrop}>
			  <!--
			  <div class="btn-export" onclick="Swal.fire({title: 'Export', html: '<pre><code>'+JSON.stringify(editor.export(), null,4)+'</code></pre>'})">
				  Export
			  </div>
		  		-->
			  <div class="btn-clear" on:click={editor.clearModuleSelected}>Clear</div>
			  <div class="btn-lock">
				<i id="lock" class="fas fa-lock" on:click={() => { editor.editor_mode='fixed'; changeMode('lock'); }} style="display: {showLock};"></i>
				<i id="unlock" class="fas fa-lock-open" on:click={() => { editor.editor_mode='edit'; changeMode('unlock'); }} style="display: {showUnlock};"></i>
			  </div>
			  <div class="bar-zoom">
				<span on:click={zoomOut}><i class="fas fa-search-minus"></i></span>
				<span on:click={zoomReset}><i class="fas fa-search"></i></span>
				<span on:click={zoomIn}><i class="fas fa-search-plus"></i></span>
			  </div>
			</div>
		</div>
		<div class="form-col {$showForm ? 'show' : 'hide'}">
			<SideForm/>
		</div>
	</div>
	
	<!-- Dialogs -->
	<Catalogue {catalogue} />
	<ApiList bind:creatingCatalogueItem={creatingCatalogueItem} />
</main>

<style>
	:root {
		--border-color: #cacaca;
		--background-color: #ffffff;

		--background-box-title: #f7f7f7;
		--select-color: #a3c8ff;

		--dark-background: rgb(4, 24, 54);
		--dark-background-semi: rgba(144, 164, 194);
	}

	.wrapper {
		width: 100%;
		height: 100vh;
		display: flex;
	}

	.col-right {
		flex: 1 1;
	}

	.form-col {
		flex: 0 0 100px;
		border-left: 1px solid var(--border-color);
	}
	.form-col.hide {
		width: 0px;
		padding: 0px;
		flex-basis: 0px;
	}

	.btn-export {
		float: right;
		position: absolute;
		top: 10px;
		right: 10px;
		color: white;
		font-weight: bold;
		background: var(--dark-background);
		padding: 5px 10px;
		cursor: pointer;
		border-radius: 4px;
		z-index: 5;
	}

	.btn-clear {
		float: right;
		position: absolute;
		top: 10px;
		right: 10px;
		color: white;
		font-weight: bold;
		background: var(--dark-background);
		padding: 5px 10px;
		cursor: pointer;
		border-radius: 4px;
		z-index: 5;
	}

	.btn-lock {
		float: right;
		position: absolute;
		bottom: 10px;
		right: 140px;
		display: flex;
		font-size: 24px;
		color: white;
		padding: 5px 10px;
		background: var(--dark-background);
		border-radius: 4px;
		border-right: 1px solid var(--border-color);
		z-index: 5;
		cursor: pointer;
	}

	.bar-zoom {
		float: right;
		position: absolute;
		bottom: 10px;
		right: 10px;
		display: flex;
		font-size: 24px;
		color: white;
		padding: 5px 10px;
		background: var(--dark-background);
		border-radius: 4px;
		border-right: 1px solid var(--border-color);
		z-index: 5;
	}
	.bar-zoom svg {
		cursor: pointer;
		padding-left: 10px;
	}
	.bar-zoom svg:nth-child(1) {
		padding-left: 0px;
	}

	#drawflow {
		position: relative;
		height: 100%;
		flex: 1 1;
		background: var(--background-color);
		background-size: 25px 25px;
		background-image:
		linear-gradient(to right, #e8e8e8 1px, transparent 1px),
		linear-gradient(to bottom, #e8e8e8 1px, #fafafa 1px);
	}

	@media only screen and (max-width: 768px) {
		.col {
			width: 50px;
		}
		.col .drag-drawflow span {
			display:none;
		}
		#drawflow {
			width: calc(100vw);
		}
	}
</style>