<script>
  import CurrencySelector from './CurrencySelector.svelte';
  
  export let onPaymentCreate;
  export let loading = false;
  export let error = '';
  
  let selectedCurrency = 'ltc';
  let minimumAmount = null;
  let adjustedPrice = 8;
  let showAdjustment = false;
  
  const planDetails = {
    name: 'Paid Plan',
    basePrice: 8,
    currency: 'USD',
    description: '10,000 API requests + $0.40 per 5K over limit',
    features: [
      '10,000 subtitle requests included',
      '$0.40 per 5K requests over limit',
      'Priority support',
      'API token included',
      'Instant activation'
    ]
  };
  
  function handleCurrencyChange(currency) {
    selectedCurrency = currency;
  }
  
  async function handleMinAmountCheck(minUSD) {
    if (minUSD && minUSD > planDetails.basePrice) {
      adjustedPrice = minUSD;
      showAdjustment = true;
    } else {
      adjustedPrice = planDetails.basePrice;
      showAdjustment = false;
    }
  }
  
  function handleSubmit() {
    onPaymentCreate(selectedCurrency, adjustedPrice);
  }
</script>

<div class="space-y-8">
  <!-- Plan Summary -->
  <div class="bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-6">
    <div class="flex items-start justify-between mb-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">{planDetails.name}</h2>
        <p class="text-gray-600">{planDetails.description}</p>
      </div>
      <div class="text-right">
        <div class="text-4xl font-bold text-primary-700">
          ${adjustedPrice}
          {#if showAdjustment}
            <div class="text-lg text-gray-500 line-through">${planDetails.basePrice}</div>
          {/if}
        </div>
        <div class="text-sm text-gray-500">One-time payment</div>
        {#if showAdjustment}
          <div class="text-xs text-orange-600 font-medium mt-1">
            *Adjusted for {selectedCurrency.toUpperCase()} minimum
          </div>
        {/if}
      </div>
    </div>
    
    <div class="border-t border-primary-200 pt-4">
      <h4 class="font-semibold text-gray-800 mb-3">What's included:</h4>
      <ul class="space-y-2">
        {#each planDetails.features as feature}
          <li class="flex items-center text-sm text-gray-700">
            <svg class="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {feature}
          </li>
        {/each}
      </ul>
    </div>
  </div>
  
  <!-- Currency Selection -->
  <CurrencySelector 
    {selectedCurrency} 
    onCurrencyChange={handleCurrencyChange}
    onMinAmountCheck={handleMinAmountCheck}
  />
  
  <!-- Error Display -->
  {#if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h4 class="font-medium text-red-800">Payment Error</h4>
          <p class="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Payment Button -->
  <button 
    on:click={handleSubmit}
    disabled={loading}
    class="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-primary-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
  >
    {#if loading}
      <div class="flex items-center justify-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Creating Payment...
      </div>
    {:else}
      <div class="flex items-center justify-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        Pay with {selectedCurrency.toUpperCase()}
      </div>
    {/if}
  </button>
  
  <div class="text-center text-sm text-gray-500">
    <div class="flex items-center justify-center mb-2">
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
      </svg>
      Secure payment powered by NOWPayments
    </div>
    <p>Your payment is processed securely. No personal information is stored.</p>
  </div>
</div>