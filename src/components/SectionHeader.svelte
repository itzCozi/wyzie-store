<script>
  export let title = "";
  export let subtitle = "";
  export let centerText = false;
  export let marginBottom = "mb-5";
</script>

<div class="{centerText ? 'text-center' : ''} {marginBottom}">
  <h2 class="text-2xl font-bold mb-2">{title}</h2>
  {#if subtitle}
    <p class="text-type-dimmed">{subtitle}</p>
  {/if}
</div>
