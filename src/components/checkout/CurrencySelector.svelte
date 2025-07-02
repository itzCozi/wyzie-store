<script>
  import { onMount } from 'svelte';
  import CurrencyLogo from './CurrencyLogo.svelte';
  
  export let selectedCurrency = 'ltc';
  export let onCurrencyChange = () => {};
  export let onMinAmountCheck = () => {};
  
  let currencies = [];
  let filteredCurrencies = [];
  let searchTerm = '';
  let loading = true;
  let minimumAmounts = {};
  
  // Popular currencies to show first
  const popularCurrencies = ['btc', 'eth', 'ltc', 'usdt', 'trx', 'xrp', 'doge', 'ada', 'bnb', 'sol'];
  
  onMount(async () => {
    await loadCurrencies();
  });
  
  async function loadCurrencies() {
    try {
      const response = await fetch('https://api.nowpayments.io/v1/full-currencies', {
        headers: {
          'x-api-key': import.meta.env.VITE_NOWPAYMENTS_API_KEY
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Log first few currencies to see logo_url structure
        console.log('Currency data sample:', data.currencies.slice(0, 3));
        
        currencies = data.currencies
          .filter(currency => currency.enable !== false) // Show all currencies unless explicitly disabled
          .map(currency => {
            // Try different base URLs for logos
            let logoUrl = null;
            if (currency.logo_url) {
              // Test different base URLs
              if (currency.logo_url.startsWith('http')) {
                logoUrl = currency.logo_url;
              } else if (currency.logo_url.startsWith('/')) {
                logoUrl = `https://nowpayments.io${currency.logo_url}`;
              } else {
                logoUrl = `https://nowpayments.io/${currency.logo_url}`;
              }
            }
            
            return {
              code: currency.code.toLowerCase(),
              name: currency.name,
              symbol: getCurrencySymbol(currency.code),
              color: getCurrencyColor(currency.code),
              logoUrl,
              popular: popularCurrencies.includes(currency.code.toLowerCase()),
              network: currency.network,
              priority: currency.priority || 999
            };
          });
        
        // Sort by popularity first, then by priority, then alphabetically
        currencies.sort((a, b) => {
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          if (a.popular && b.popular) return a.priority - b.priority;
          return a.name.localeCompare(b.name);
        });
        
        filteredCurrencies = currencies;
        
        // Check minimum amounts for popular currencies
        await checkMinimumAmounts();
        
        // Re-filter currencies after checking minimums
        filteredCurrencies = getFilteredCurrencies();
      }
    } catch (error) {
      console.error('Failed to load currencies:', error);
      // Fallback to popular currencies
      currencies = popularCurrencies.map(code => ({
        code,
        name: getCurrencyName(code),
        symbol: getCurrencySymbol(code),
        color: getCurrencyColor(code),
        logoUrl: null,
        popular: true,
        priority: 1
      }));
      filteredCurrencies = getFilteredCurrencies();
    } finally {
      loading = false;
    }
  }
  
  async function checkMinimumAmounts() {
    for (const currency of currencies.slice(0, 10)) { // Check first 10
      try {
        const response = await fetch(`https://api.nowpayments.io/v1/min-amount?currency_from=${currency.code}&currency_to=usd&fiat_equivalent=usd&is_fixed_rate=false&is_fee_paid_by_user=false`, {
          headers: {
            'x-api-key': import.meta.env.VITE_NOWPAYMENTS_API_KEY
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          minimumAmounts[currency.code] = {
            min_amount: data.min_amount,
            fiat_equivalent: data.fiat_equivalent
          };
        } else {
          console.log(`Min amount API response for ${currency.code}:`, await response.text());
        }
      } catch (e) {
        console.warn(`Could not check minimum for ${currency.code}:`, e);
      }
    }
  }
  
  function handleCurrencySelect(currency) {
    selectedCurrency = currency.code;
    onCurrencyChange(currency.code);
    const minUSD = getMinimumUSD(currency.code);
    onMinAmountCheck(minUSD);
  }
  
  function handleSearch(event) {
    searchTerm = event.target.value.toLowerCase();
    filteredCurrencies = getFilteredCurrencies();
  }
  
  function getFilteredCurrencies() {
    return currencies.filter(currency => {
      // Check if currency matches search term
      const matchesSearch = !searchTerm || 
        currency.name.toLowerCase().includes(searchTerm) || 
        currency.code.toLowerCase().includes(searchTerm);
      
      // Check if currency is usable with base price ($8)
      const minUSD = getMinimumUSD(currency.code);
      const isUsable = !minUSD || minUSD <= 8;
      
      return matchesSearch && isUsable;
    });
  }
  
  function getCurrencyName(code) {
    const names = {
      'btc': 'Bitcoin',
      'eth': 'Ethereum',
      'ltc': 'Litecoin',
      'usdt': 'Tether',
      'trx': 'TRON',
      'xrp': 'Ripple',
      'doge': 'Dogecoin',
      'ada': 'Cardano',
      'bnb': 'Binance Coin',
      'sol': 'Solana',
      'bch': 'Bitcoin Cash',
      'xmr': 'Monero',
      'zec': 'Zcash',
      'dash': 'Dash',
      'xlm': 'Stellar'
    };
    return names[code.toLowerCase()] || code.toUpperCase();
  }
  
  function getCurrencySymbol(code) {
    const symbols = {
      'btc': '₿',
      'eth': 'Ξ',
      'ltc': 'Ł',
      'usdt': '₮',
      'trx': 'T',
      'xrp': 'X',
      'doge': 'Ð',
      'ada': '₳',
      'bnb': 'B',
      'sol': 'S'
    };
    return symbols[code.toLowerCase()] || code.charAt(0).toUpperCase();
  }
  
  function getCurrencyColor(code) {
    const colors = {
      'btc': 'bg-orange-500',
      'eth': 'bg-blue-500',
      'ltc': 'bg-gray-500',
      'usdt': 'bg-green-500',
      'trx': 'bg-red-500',
      'xrp': 'bg-blue-600',
      'doge': 'bg-yellow-500',
      'ada': 'bg-indigo-500',
      'bnb': 'bg-yellow-600',
      'sol': 'bg-purple-500'
    };
    return colors[code.toLowerCase()] || 'bg-gray-400';
  }
  
  function getMinimumUSD(code) {
    const minData = minimumAmounts[code];
    if (!minData || !minData.fiat_equivalent) return null;
    
    // Use the fiat equivalent from the API
    const minUSD = Math.ceil(minData.fiat_equivalent);
    return minUSD > 8 ? minUSD : null;
  }
</script>

<div class="mb-8">
  <h3 class="text-lg font-semibold text-gray-800 mb-4">Select Cryptocurrency</h3>
  
  <!-- Search Bar -->
  <div class="mb-4">
    <div class="relative">
      <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <input
        type="text"
        placeholder="Search cryptocurrencies..."
        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        on:input={handleSearch}
        bind:value={searchTerm}
      />
    </div>
  </div>
  
  {#if loading}
    <div class="flex items-center justify-center py-8">
      <svg class="animate-spin h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-2 text-gray-600">Loading currencies...</span>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
      {#each filteredCurrencies as currency, index}
        {@const isAboveFold = index < 9} <!-- First 9 currencies (3 rows) load eagerly -->
        <button
          class="flex items-start p-3 border-2 rounded-lg transition-all duration-200 hover:shadow-md w-full {selectedCurrency === currency.code ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}"
          on:click={() => handleCurrencySelect(currency)}
        >
          <div class="w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
            <CurrencyLogo {currency} eager={isAboveFold} />
          </div>
          <div class="text-left flex-1 min-w-0">
            <div class="flex items-start flex-col gap-1">
              <div class="flex items-center flex-wrap gap-1 w-full">
                <span class="font-medium text-gray-900 text-sm truncate flex-shrink">{currency.name}</span>
                {#if currency.popular}
                  <span class="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full whitespace-nowrap flex-shrink-0">Popular</span>
                {/if}
              </div>
              
              <div class="flex items-center flex-wrap gap-1 w-full">
                <span class="text-xs text-gray-500 font-mono">{currency.code.toUpperCase()}</span>
                {#if currency.network && currency.network !== currency.code.toLowerCase()}
                  <span class="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap">{currency.network.toUpperCase()}</span>
                {/if}
              </div>
            </div>
          </div>
        </button>
      {/each}
    </div>
    
    {#if filteredCurrencies.length === 0}
      <div class="text-center py-8 text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12M6 20.291A7.962 7.962 0 016 12m0 8.291A7.962 7.962 0 016 12m0 8.291A7.962 7.962 0 016 12"></path>
        </svg>
        <p>No cryptocurrencies found</p>
        <p class="text-sm">Try a different search term</p>
      </div>
    {/if}
  {/if}
</div>

<style>
  button:focus {
    outline: 2px solid theme('colors.primary.500');
    outline-offset: 2px;
  }
</style>