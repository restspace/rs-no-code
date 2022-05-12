<script lang="ts">
	import Ajv from "ajv";
	import { Form, components as formComponents } from "@pyoner/svelte-form";
	import { createAjvValidator } from "@pyoner/svelte-form-ajv";
	import { configIdx, components } from "../stores";

	const ajv = new Ajv({
		schemaId: "$id",
		allErrors: true,
		coerceTypes: true
	});

	const validator = createAjvValidator(ajv);

	const value = {};
	let data = "";
	let showSaved = false;

	configIdx.subscribe(() => showSaved = false);
</script>

<Form schema={$components[$configIdx]?.configSchema || {}} components={formComponents} {value} {validator}
	on:submit={e => {
		console.log("submit", e);
		data = JSON.stringify(e.detail);
		components.update(oldComps => {
			const newComps = [ ...oldComps ];
			newComps[$configIdx].configuration = e.detail;
			return newComps;
		});
		showSaved = true;
	}}>
	<button type="submit">Submit</button>
	<div style="display:{showSaved ? 'block' : 'none'}">Saved</div>
</Form>

<style>

</style>

