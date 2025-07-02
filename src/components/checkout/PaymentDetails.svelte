<script>
  import { onMount, onDestroy } from 'svelte';
  import QRCode from 'qrcode';
  
  export let paymentData;
  
  let qrCodeDataUrl = '';
  let currentStatus = paymentData?.payment_status || 'waiting';
  let pollingInterval;
  let copied = false;
  
  onMount(async () => {
    if (paymentData?.pay_address) {
      await generateQRCode();
      startStatusPolling();
    }
  });
  
  onDestroy(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  });
  
  async function generateQRCode() {
    try {
      // Use proper cryptocurrency URI format based on the currency
      let qrText;
      const currency = paymentData.pay_currency.toLowerCase();
      const address = paymentData.pay_address;
      const amount = paymentData.pay_amount;
      
      // Map currencies to their URI schemes
      const uriSchemes = {
        'btc': 'bitcoin',
        'ltc': 'litecoin', 
        'eth': 'ethereum',
        'trx': 'tron',
        'doge': 'dogecoin',
        'bch': 'bitcoincash',
        'xrp': 'ripple',
        'ada': 'cardano',
        'xlm': 'stellar'
      };
      
      const scheme = uriSchemes[currency] || currency;
      
      // For some currencies, use just the address (safer for compatibility)
      if (['eth', 'trx', 'usdt', 'usdc'].includes(currency)) {
        qrText = address; // Just the address for better wallet compatibility
      } else {
        qrText = `${scheme}:${address}?amount=${amount}`;
      }
      
      console.log('Generated QR text for', currency, ':', qrText);
      
      qrCodeDataUrl = await QRCode.toDataURL(qrText, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      // Fallback to just the address if URI format fails
      try {
        qrCodeDataUrl = await QRCode.toDataURL(paymentData.pay_address, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
      } catch (fallbackError) {
        console.error('Fallback QR generation failed:', fallbackError);
      }
    }
  }
  
  function startStatusPolling() {
    // Poll every 10 seconds
    pollingInterval = setInterval(async () => {
      try {
        const response = await fetch(`https://api.nowpayments.io/v1/payment/${paymentData.payment_id}`, {
          headers: {
            'x-api-key': import.meta.env.VITE_NOWPAYMENTS_API_KEY
          }
        });
        
        if (response.ok) {
          const updatedData = await response.json();
          currentStatus = updatedData.payment_status;
          
          // Update amount received
          if (updatedData.amount_received !== paymentData.amount_received) {
            paymentData.amount_received = updatedData.amount_received;
          }
          
          // Stop polling if payment is finished or failed
          if (['finished', 'failed', 'expired'].includes(currentStatus)) {
            clearInterval(pollingInterval);
            
            // Redirect to success page if finished
            if (currentStatus === 'finished') {
              setTimeout(() => {
                window.location.href = '/paid';
              }, 2000);
            }
          }
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
      }
    }, 10000);
  }
  
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
      setTimeout(() => copied = false, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }
  
  function getStatusColor(status) {
    const colors = {
      'waiting': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'confirming': 'text-blue-600 bg-blue-50 border-blue-200',
      'confirmed': 'text-green-600 bg-green-50 border-green-200',
      'sending': 'text-purple-600 bg-purple-50 border-purple-200',
      'finished': 'text-green-700 bg-green-100 border-green-300',
      'failed': 'text-red-600 bg-red-50 border-red-200',
      'expired': 'text-gray-600 bg-gray-50 border-gray-200',
      'partially_paid': 'text-orange-600 bg-orange-50 border-orange-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  }
  
  function getStatusText(status) {
    const texts = {
      'waiting': 'Waiting for Payment',
      'confirming': 'Confirming Transaction',
      'confirmed': 'Payment Confirmed',
      'sending': 'Processing Payment',
      'finished': 'Payment Completed',
      'failed': 'Payment Failed',
      'expired': 'Payment Expired',
      'partially_paid': 'Partially Paid'
    };
    return texts[status] || status;
  }
</script>

<div class="max-w-4xl mx-auto space-y-8">
  <!-- Status Header with Animation -->
  <div class="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
    <div class="text-center">
      <div class="relative">
        <!-- Animated Status Badge -->
        <div class="inline-flex items-center px-6 py-3 rounded-full border-2 {getStatusColor(currentStatus)} mb-6 shadow-lg transform transition-all duration-500 hover:scale-105">
          {#if currentStatus === 'waiting'}
            <div class="w-3 h-3 bg-current rounded-full mr-3 animate-pulse"></div>
          {:else if currentStatus === 'confirming'}
            <div class="w-3 h-3 bg-current rounded-full mr-3 animate-spin"></div>
          {:else if currentStatus === 'finished'}
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          {:else}
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          {/if}
          <span class="font-semibold text-lg">{getStatusText(currentStatus)}</span>
        </div>
        
        <!-- Decorative Elements -->
        <div class="absolute -top-2 -right-2 w-4 h-4 bg-indigo-400 rounded-full opacity-50 animate-ping"></div>
        <div class="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full opacity-30 animate-pulse"></div>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Complete Your Payment
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Send <span class="font-semibold text-indigo-600">{paymentData.pay_amount} {paymentData.pay_currency.toUpperCase()}</span> 
        to the address below to activate your API access
      </p>
    </div>
  </div>

  <!-- Main Payment Card -->
  <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
    <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            {paymentData.pay_currency.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">{paymentData.pay_currency.toUpperCase()} Payment</h2>
            <p class="text-sm text-gray-600">Network: {paymentData.network.toUpperCase()}</p>
          </div>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold text-gray-900">${paymentData.price_amount}</div>
          <div class="text-sm text-gray-600">USD</div>
        </div>
      </div>
    </div>

    <div class="p-8">
      <div class="grid lg:grid-cols-2 gap-8">
        <!-- QR Code Section -->
        <div class="text-center">
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-indigo-300 transition-colors duration-300">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Scan QR Code</h3>
            <p class="text-sm text-gray-600 mb-4">
              {#if ['eth', 'trx', 'usdt', 'usdc'].includes(paymentData.pay_currency.toLowerCase())}
                Address only (enter amount manually)
              {:else}
                Address + amount auto-fill
              {/if}
            </p>
            
            <div class="relative inline-block mx-auto">
              {#if qrCodeDataUrl}
                <div class="bg-white p-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
                  <img src={qrCodeDataUrl} alt="Payment QR Code" class="w-48 h-48 mx-auto" />
                </div>
              {:else}
                <div class="w-48 h-48 bg-gray-200 rounded-2xl flex items-center justify-center p-6">
                  <div class="text-center">
                    <svg class="w-10 h-10 text-gray-400 animate-spin mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p class="text-base text-gray-500 font-medium">Generating QR Code...</p>
                  </div>
                </div>
              {/if}
              
              <!-- QR Code decorative border -->
              <div class="absolute -inset-2 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 rounded-xl opacity-30 -z-10"></div>
            </div>
            
            <p class="text-xs text-gray-500 mt-3">Scan with {paymentData.pay_currency.toUpperCase()} wallet</p>
          </div>
        </div>

        <!-- Payment Details Section -->
        <div class="space-y-6">
          <!-- Amount Card -->
          <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
              Amount to Send
            </h3>
            <div class="bg-white rounded-lg p-4 border border-indigo-200">
              <div class="text-3xl font-bold text-gray-900 mb-1">
                {paymentData.pay_amount}
                <span class="text-xl text-indigo-600 ml-2">{paymentData.pay_currency.toUpperCase()}</span>
              </div>
              <div class="text-sm text-gray-600">Exactly ${paymentData.price_amount} USD</div>
            </div>
          </div>

          <!-- Address Card -->
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Payment Address
            </h3>
            <div class="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div class="flex">
                <div class="flex-1 p-4 font-mono text-sm break-all bg-gray-50 border-r border-gray-200">
                  {paymentData.pay_address}
                </div>
                <button
                  on:click={() => copyToClipboard(paymentData.pay_address)}
                  class="px-4 py-4 bg-white hover:bg-gray-50 transition-colors duration-200 group {copied ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:text-gray-800'}"
                  title={copied ? 'Copied!' : 'Copy address'}
                >
                  {#if copied}
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  {:else}
                    <svg class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  {/if}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Payment Info Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium text-gray-600">Payment ID</h3>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z"></path>
        </svg>
      </div>
      <div class="font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded border">
        {paymentData.payment_id}
      </div>
    </div>

    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium text-gray-600">Amount Received</h3>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      </div>
      <div class="text-xl font-bold text-gray-900">
        {paymentData.amount_received || 0}
        <span class="text-sm text-gray-600 ml-1">{paymentData.pay_currency.toUpperCase()}</span>
      </div>
      <div class="text-xs text-gray-500 mt-1">
        {#if paymentData.amount_received > 0}
          Partial payment received
        {:else}
          Waiting for payment
        {/if}
      </div>
    </div>

    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium text-gray-600">Expires</h3>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <div class="text-sm font-medium text-gray-900">
        {new Date(paymentData.valid_until).toLocaleDateString()}
      </div>
      <div class="text-xs text-gray-500 mt-1">
        {new Date(paymentData.valid_until).toLocaleTimeString()}
      </div>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="flex flex-col sm:flex-row gap-4">
    <button
      on:click={() => window.open(`https://blockchair.com/${paymentData.network}/address/${paymentData.pay_address}`, '_blank')}
      class="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
      </svg>
      View on Blockchain Explorer
    </button>
    <button
      on:click={() => copyToClipboard(paymentData.pay_address)}
      class="flex-1 bg-gray-600 text-white py-4 px-6 rounded-xl hover:bg-gray-700 transition-all duration-300 font-semibold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
      Copy Payment Address
    </button>
  </div>

  <!-- Status Footer -->
  <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 text-center border border-gray-200">
    {#if currentStatus === 'waiting'}
      <div class="flex items-center justify-center text-gray-600 mb-3">
        <div class="w-2 h-2 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
        <span class="text-lg font-medium">Waiting for your payment...</span>
      </div>
      <p class="text-sm text-gray-500">
        Send the exact amount to the address above. Payment will be detected automatically.
      </p>
    {:else if currentStatus === 'confirming'}
      <div class="flex items-center justify-center text-blue-600 mb-3">
        <svg class="w-5 h-5 mr-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        <span class="text-lg font-medium">Payment received! Confirming on blockchain...</span>
      </div>
      <p class="text-sm text-gray-500">
        Your payment is being processed. This usually takes a few minutes.
      </p>
    {:else if currentStatus === 'finished'}
      <div class="flex items-center justify-center text-green-600 mb-3">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="text-lg font-medium">Payment completed! Redirecting...</span>
      </div>
      <p class="text-sm text-gray-500">
        Thank you! Your API access has been activated.
      </p>
    {/if}
  </div>
</div>