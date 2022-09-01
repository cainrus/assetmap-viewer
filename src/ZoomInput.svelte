<script>
    export let value = 1;
</script>

<div class="input-group mb-3 col">
    <div class="input-group-text"><i class="bi bi-zoom-in"></i></div>
    <input type="number" maxlength="4" list="defaultScaleList" min="0.5" max="3" step="0.5"
           class="form-control" bind:value>
    <datalist id="defaultScaleList">
        <option value="0.5">
        <option value="1">
        <option value="2">
        <option value="3">
    </datalist>
</div>
