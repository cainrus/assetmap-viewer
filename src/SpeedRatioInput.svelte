<script>
    export let value = 1;
</script>


<div class="input-group mb-3 col">
    <div class="input-group-text"><i class="bi bi-speedometer"></i></div>
    <input type="number" list="defaultSpeedList" step="0.1" min="0.1" max="3"
           class="form-control" bind:value={value}>
    <datalist id="defaultSpeedList">
        <option value="0.1">
        <option value="1">
        <option value="2">
        <option value="3">
    </datalist>
</div>
