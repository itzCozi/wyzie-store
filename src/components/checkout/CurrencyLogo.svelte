<script>
  export let currency;
  export let eager = false; // For above-the-fold images
  
  let imageError = false;
  
  function handleImageError() {
    imageError = true;
  }
</script>

{#if currency.logoUrl && !imageError}
  <img 
    src={currency.logoUrl} 
    alt={currency.name}
    width="32"
    height="32"
    class="w-8 h-8 object-contain rounded"
    loading={eager ? 'eager' : 'lazy'}
    decoding="async"
    on:error={handleImageError}
  />
{:else}
  <div class="w-8 h-8 rounded-full {currency.color} flex items-center justify-center text-white font-bold text-sm shadow-sm">
    {currency.symbol}
  </div>
{/if}