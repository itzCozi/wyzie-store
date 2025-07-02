<script>
  export let links = [];
</script>

<footer class="text-center text-sm py-8">
  <div class="flex justify-center space-x-4 mb-4">
    {#each links as link}
      <a
        href={link.url}
        alt={link.alt}
        title={link.title}>{link.text}</a>
    {/each}
  </div>
  <slot />
</footer>
