<script>
	let files = $state();
	let number = $state();

	$effect(() => {
		if (files) {
			console.log(files);

			for (const file of files) {
				console.log(`${file.name}: ${file.size} bytes`);
			}
		}
	});
</script>

<div class="flex flex-col">
	<form method="POST">
		<label for="geojsonFile">Upload a File:</label>
		<input accept="geojson" bind:files id="geojsonFile" name="geojsonFile" type="file" />
		<label for="buffer_value">Input Buffer Value:</label>
		<input id="buffer_value" name="buffer_value" type="number">
		<button>Buffer Now</button>
	</form>
</div>

{#if files}
	<h2>Selected files:</h2>
	{#each Array.from(files) as file}
		<p>{file.name} ({file.size} bytes)</p>
	{/each}
{/if}
