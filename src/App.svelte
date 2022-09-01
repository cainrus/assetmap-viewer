<script lang="ts">
    import 'svelte-jsoneditor/themes/jse-theme-dark.css';
    import {JSONEditor} from 'svelte-jsoneditor';

    import SpeedRatioInput from './SpeedRatioInput.svelte';
    import ZoomInput from './ZoomInput.svelte';
    import Tabs from './Tabs.svelte';
    import Select from './Select.svelte';
    import assetMetaData from './assets/all.json';
    import getThemeMode from "./utils/getThemeMode";

    const root = document.querySelector(':root');
    const assetNames = Object.keys(assetMetaData)
        .filter(name => !name.startsWith('_'));

    let assetAnimationSpeed = 0;
    let animationSpeedRatio = 1;
    let content = {
        text: undefined,
        json: assetMetaData[assetNames[0]],
    };
    let assetScale = 1;
    let isSourceEnabled = false;
    const defaultAsset = assetMetaData[assetNames[0]];

    function getMax(asset, key) {
        return Math.max(...asset.frames.map(({[key]: value}) => value))
    }

    function syncAsset(asset) {
        content = {
            text: undefined,
            json: asset,
        }
        assetAnimationSpeed = asset.totalDuration;
        setCssVar('width', getMax(asset, 'w') + 'px');
        setCssVar('height', getMax(asset, 'h') + 'px');
        setCssVar('steps', `${asset.length}`);
        syncCss(generateKeyFrames(asset));
    }

    function onChange(event) {
        let asset = assetMetaData[event.target.value];
        syncAsset(asset);
    }

    function generateKeyFrames(asset) {
        const frames = asset.frames.slice(0, asset.length);
        const unit = asset.totalDuration / 100;

        let accumulatedDuration = 0;
        const steps = frames.map(frame => accumulatedDuration = +(frame.duration / unit + accumulatedDuration).toFixed(2));

        const content = frames.map((frame, index) => {
            return `${steps[index]}% {
                background-position-x: -${frame.x}px;
                background-position-y: -${frame.y}px;
                clip-path: polygon(${frame.w}px 0, 0 0, 0 ${frame.h}px, ${frame.w}px ${frame.h}px);
            }`;
        }).join('\n');

        return `@keyframes asset-animation {\n${content} }`;
    }

    function syncCss(cssContent) {
        let style = document.querySelector('style#keyframes');
        if (!style) {
            style = document.createElement('style');
            style.setAttribute('id', 'keyframes');
            document.head.appendChild(style);
        }

        style.innerHTML = cssContent;
        console.log(style.innerHTML)
    }

    function setCssVar(id, value) {
        root.style.setProperty('--' + id, value);
    }

    function toggleEdit() {
        isSourceEnabled = true;
        pauseAnimationState();
    }

    function pauseAnimationState() {
        pauseTab.icon = 'bi-play-fill';
        setCssVar('play-state', 'paused');
    }

    function runAnimationState() {
        pauseTab.icon = 'bi-pause';
        setCssVar('play-state', 'running');
    }

    syncAsset(defaultAsset)

    function selectTab({detail: tab}) {
        console.log(tab)
        tab.onActivate();
    }

    let pauseTab = {
        icon: 'bi-pause',
        active: true,
        onActivate: () => {
            if (pauseTab.icon === 'bi-pause') {
                pauseAnimationState();
            } else {
                runAnimationState();
            }
        },
    };
    let sourceTab = {
        icon: 'bi-braces',
        onActivate: toggleEdit,
    };

    let themeMode = getThemeMode();
    function getThemeTabIcon(themeMode) {
        return themeMode === 'dark' ? 'bi-moon' : 'bi-sun';
    }
    function toggleMode(themeMode) {
        return themeMode === 'dark' ? 'light' : 'dark';
    }
    let themeTab = {
        icon: getThemeTabIcon(themeMode),
        selectable: false,
        onActivate() {
            themeMode = toggleMode(themeMode);
            themeTab.icon = getThemeTabIcon(themeMode);
        },
    };

    $: tabs = [
        pauseTab,
        sourceTab,
        themeTab,
    ];

    $: activeTab = tabs.find((tab) => tab.active);
    $: isPlayTabActive = activeTab === pauseTab;
        $: isSourceTabActive = activeTab === sourceTab;
    $: spriteWrapperStyles = [
        `transform: scale(${assetScale})`,
        'display: ' + pauseTab.active? 'block' : 'none',
    ].join(';');
    $: animationSpeed = assetAnimationSpeed / animationSpeedRatio;
    $: isDarkMode = themeMode === 'dark';
    $: JSONEditorTheme = themeMode === 'dark' ? 'jse-theme-dark' : '';
</script>

<main class="col">
    <h1>Sprite animation map viewer</h1>
    <Select names={ assetNames } on:change={onChange}/>
    <form class="mb-3">
        <div class="col-auto">
            <fieldset>
                <div class="row">
                    <ZoomInput bind:value={assetScale}/>
                    <SpeedRatioInput bind:value={animationSpeedRatio}/>
                </div>
                <Tabs bind:tabs={tabs} on:select={selectTab}/>
            </fieldset>
        </div>
    </form>
    {#if isPlayTabActive}
    <div class="sprite-wrapper clearfix card mb-3"
         style="{spriteWrapperStyles}"
    >
        <div class="sprite" style="animation-duration: {animationSpeed}ms"></div>
    </div>
    {/if}
    {#if isSourceEnabled }
    <div style="display: {isSourceTabActive ? 'block' : 'none'}" class="{ JSONEditorTheme }">
        <JSONEditor bind:content
            readOnly={true}
            indentation={2}
            statusBar={false}
            navigationBar={false}
            mainMenuBar={false}
            class="col"/>
        </div>
    {/if}
</main>

<style lang="scss">
  .sprite-wrapper {
    width: var(--assetMaxWidth);
    height: var(--assetMaxHeight);
    transform-origin: top left;
    min-width: 100px;
    min-height: 100px;
    align-items: center;
    justify-content: center;
  }

  .sprite {
    padding: 0;
    background-image: url(../public/all.png);
    animation-name: asset-animation;
    object-fit: none;
    animation-timing-function: step-end;
    animation-duration: var(--duration);
    animation-iteration-count: infinite;
    animation-play-state: var(--play-state);
    overflow: hidden;
    width: var(--width);
    height: var(--height);

  }

</style>

<svelte:head>
    {#if isDarkMode}
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-dark-5@1.1.3/dist/css/bootstrap-dark.min.css" rel="stylesheet">
    {/if}
</svelte:head>