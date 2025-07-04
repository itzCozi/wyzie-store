<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import PaymentForm from '@/components/checkout/PaymentForm.svelte';
  import PaymentDetails from '@/components/checkout/PaymentDetails.svelte';

  let loading = false;
  let error = '';
  let paymentData = null;


  async function createPayment(selectedCurrency, adjustedPrice = 8) {
    loading = true;
    error = '';

    try {
      const response = await fetch('https://api.nowpayments.io/v1/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_NOWPAYMENTS_API_KEY
        },
        body: JSON.stringify({
          price_amount: adjustedPrice,
          price_currency: 'usd',
          pay_currency: selectedCurrency,
          order_id: `wyzie-${Date.now()}`,
          order_description: 'Wyzie Subs API Access - 50,000 requests + priority support',
          ipn_callback_url: window.location.origin + '/api/payment-callback',
          success_url: window.location.origin + '/paid',
          cancel_url: window.location.origin + '/checkout'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.message && errorData.message.includes('less than minimal')) {
          throw new Error(`This cryptocurrency requires a higher minimum payment. The system should have adjusted the price automatically. Please try refreshing the page or contact support.`);
        }
        throw new Error(errorData.message || `Payment creation failed: ${response.status}`);
      }

      paymentData = await response.json();
    } catch (err) {
      error = err.message || 'An unexpected error occurred';
      console.error('Payment creation error:', err);
    } finally {
      loading = false;
    }
  }

  function goBack() {
    window.history.back();
  }
</script>

<svelte:head>
  <title>Checkout - Wyzie Subs</title>
  <meta name="description" content="Complete your Wyzie Subs payment with cryptocurrency" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
  <div class="max-w-4xl mx-auto px-4">
    <!-- Header -->
    <div class="text-center mb-8">
      <button
        on:click={goBack}
        class="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back to Home
      </button>
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
      <p class="text-gray-600">Complete your purchase with cryptocurrency</p>
    </div>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        {#if !paymentData}
          <PaymentForm
            onPaymentCreate={createPayment}
            {loading}
            {error}
          />
        {:else}
          <PaymentDetails {paymentData} />
        {/if}
      </div>

      <!-- Trust Indicators -->
      <div class="mt-8 text-center">
        <div class="flex items-center justify-center space-x-8 text-sm text-gray-500">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            SSL Secured
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            Trusted by 1000+ developers
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Instant Access
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
