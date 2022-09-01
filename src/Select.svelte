<script>
    export let names = [];
</script>

<select class="form-select mb-3"
        aria-label="Animation name select"
        on:change
>
    {#each names as name}
        <option value="{name}">{name}</option>
    {/each}
</select>
