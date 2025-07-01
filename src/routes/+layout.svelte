<script lang="ts">
  import "@/styles/global.css";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
  }
</style>

<div class="app">
  {@render children?.()}
</div>
