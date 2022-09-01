<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let tabs = [];

    function onClick(tab) {
        if (tab.selectable !== false) {
            tabs.forEach(item => {
                item.active = tab === item;
            });
        }
        dispatch('select', tab);
    }

</script>
<ul class="nav nav-pills">
    {#each tabs as tab}
        <li class="nav-item" on:click={() => onClick(tab)}>
            <button class="btn" type="button">
                <i class="bi {tab.icon}"></i>
            </button>
        </li>
    {/each}

</ul>
