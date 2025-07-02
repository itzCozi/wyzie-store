<script>
  import { CircleCheckBig, CircleMinus } from "lucide-svelte";

  export let title = "";
  export let description = "";
  export let price = "";
  export let priceDescription = "";
  export let features = [];
  export let buttonText = "";
  export let isPrimary = false;
  export let onClick = () => {};
</script>

<div
  class="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full border-border-200">
  <div class="mb-6">
    <h2 class="text-2xl font-bold mb-2">{title}</h2>
    <p class="text-type-dimmed">{description}</p>
  </div>

  {#if price}
    <div class="mb-6">
      <p class="text-3xl font-bold mb-1">
        {price}<span class="text-sm font-normal">{priceDescription}</span>
      </p>
    </div>
  {/if}

  <div class="flex-grow mb-6">
    <ul class="space-y-3">
      {#each features as feature}
        <li class="flex items-start">
          {#if feature.included}
            <CircleCheckBig class="h-5 w-5 text-success-500 mr-2 flex-shrink-0" />
          {:else}
            <CircleMinus class="h-5 w-5 text-error-500 mr-2 flex-shrink-0" />
          {/if}
          <span>{feature.text}</span>
        </li>
      {/each}
    </ul>
  </div>

  <button
    on:click={onClick}
    class="w-full py-2 px-4 rounded {isPrimary ?
      'bg-primary-500 hover:bg-primary-600 text-white'
    : 'bg-border-200 hover:bg-border-300'} transition-colors duration-200">
    {buttonText}
  </button>
</div>
