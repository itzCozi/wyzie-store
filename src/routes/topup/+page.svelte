<script>
  import { onMount } from "svelte";
  import { Plus, Minus } from "lucide-svelte";
  import ContentSection from "@/components/ContentSection.svelte";
  import SectionHeader from "@/components/SectionHeader.svelte";
  import Footer from "@/components/Footer.svelte";

  let quantity = 1;
  let totalPrice = 0.35;
  let isProcessing = false;
  let success = false;
  let error = false;
  let errorMessage = "";
  let apiToken = "";
  let isTokenVerified = false;
  let btcPrice = null;
  let btcEquivalent = null;
  let isFetchingBtc = false;

  // Add interval variables for button holding
  let buttonHoldInterval;
  let buttonHoldTimeout;
  const initialDelay = 500; // ms before rapid increment/decrement starts
  const intervalSpeed = 100; // ms between increment/decrement when holding

  const footerLinks = [
    { url: "mailto:dev@wyzie.ru", text: "Contact", alt: "Contact", title: "Contact us" },
    {
      url: "https://docs.wyzie.ru",
      text: "Documentation",
      alt: "Documentation",
      title: "Documentation",
    },
    {
      url: "https://discord.com/invite/2mxraHBVtB",
      text: "Discord",
      alt: "Discord",
      title: "Join our Discord",
    },
  ];

  onMount(() => {
    // Fetch Bitcoin price
    fetchBitcoinPrice();

    // Clean up any intervals on component destruction
    return () => {
      clearButtonHold();
    };
  });

  async function fetchBitcoinPrice() {
    try {
      isFetchingBtc = true;
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Bitcoin price");
      }
      const data = await response.json();
      btcPrice = data.bitcoin.usd;
      updateBtcEquivalent();
    } catch (err) {
      console.error("Error fetching Bitcoin price:", err);
      btcPrice = null;
    } finally {
      isFetchingBtc = false;
    }
  }

  function updateBtcEquivalent() {
    if (btcPrice) {
      btcEquivalent = (totalPrice / btcPrice).toFixed(8);
    }
  }

  function decreaseQuantity() {
    if (quantity > 1) {
      quantity -= 1;
      updateTotalPrice();
    }
  }

  function increaseQuantity() {
    // Optional: You could add an upper limit here if needed
    // e.g., if (quantity < 100) {
    quantity += 1;
    updateTotalPrice();
  }

  // Start button hold action
  function startButtonHold(action) {
    // Clear any existing intervals/timeouts
    clearButtonHold();

    // Execute the action once immediately
    action();

    // Set timeout for when to start rapid changes
    buttonHoldTimeout = setTimeout(() => {
      // Start interval for rapid changes
      buttonHoldInterval = setInterval(action, intervalSpeed);
    }, initialDelay);
  }

  // Clear intervals and timeouts
  function clearButtonHold() {
    if (buttonHoldInterval) clearInterval(buttonHoldInterval);
    if (buttonHoldTimeout) clearTimeout(buttonHoldTimeout);
    buttonHoldInterval = null;
    buttonHoldTimeout = null;
  }

  function updateTotalPrice() {
    totalPrice = parseFloat((quantity * 0.35).toFixed(2));
    updateBtcEquivalent();
  }

  function verifyToken() {
    // Verify token is not empty
    if (!apiToken.trim()) {
      alert("Please enter a valid API token");
      isTokenVerified = false;
      return false;
    }

    // In a real implementation, you would verify the token with the server
    isTokenVerified = true;
    return true;
  }

  function handleSubmit() {
    // Verify the API token is provided and valid
    if (!apiToken.trim()) {
      error = true;
      errorMessage = "Please enter your API token";
      return;
    }

    if (!isTokenVerified && !verifyToken()) {
      return;
    }

    isProcessing = true;

    // In a real implementation, you would process payment here
    // and make API call to add credits to user's account

    // Simulating API call
    setTimeout(() => {
      isProcessing = false;
      success = true;
    }, 1500);
  }
</script>

<div class="items-center justify-center min-h-screen">
  <div class="max-w-4xl mx-auto p-6">
    <header class="text-center mb-12 mt-8">
      <h1 class="text-4xl font-bold text-primary-700">
        <a
          class="hover:underline"
          href="https://wyzie.ru"
          alt="Toolset homepage"
          title="Toolset Homepage">Wyzie</a> <span class="text-type-emphasized">Subs</span>
      </h1>
      <p class="text-type-dimmed">Powerful Subtitle API for Developers</p>
    </header>

    {#if success}
      <ContentSection>
        <div class="text-center py-10">
          <div class="text-success-500 text-6xl mb-4">✓</div>
          <h2 class="text-2xl font-bold mb-4">Purchase Successful!</h2>
          <p class="mb-6">
            Your account has been topped up with {(quantity * 5000).toLocaleString()} additional API
            requests.
            {#if btcPrice}
              <br />
              <span class="text-sm text-type-dimmed mt-2 block"
                >Payment amount: ${totalPrice.toFixed(2)} (₿ {btcEquivalent})</span>
            {/if}
          </p>
          <div class="flex justify-center gap-4">
            <a
              href="https://sub.wyzie.ru/dashboard"
              class="bg-primary-500 hover:bg-primary-600 text-white py-2 px-6 rounded transition-colors duration-200">
              View Dashboard
            </a>
            <button
              on:click={() => (success = false)}
              class="bg-border-200 hover:bg-border-300 py-2 px-6 rounded-md">
              Buy More
            </button>
          </div>
        </div>
      </ContentSection>
    {:else if error}
      <ContentSection>
        <div class="text-center py-10">
          <div class="text-error-500 text-6xl mb-4">⚠️</div>
          <h2 class="text-2xl font-bold mb-4">Something went wrong</h2>
          <p class="mb-6">{errorMessage || "There was an error processing your payment."}</p>
          <div class="flex justify-center gap-4">
            <a
              href="mailto:dev@wyzie.ru"
              class="bg-primary-500 hover:bg-primary-600 text-white py-2 px-6 rounded transition-colors duration-200">
              Contact Support
            </a>
            <button
              on:click={() => (error = false)}
              class="bg-border-200 hover:bg-border-300 py-2 px-6 rounded-md">
              Try Again
            </button>
          </div>
        </div>
      </ContentSection>
    {:else}
      {#if !isTokenVerified}
        <div class="mb-4 p-3 bg-error-100 border border-error-500 rounded max-w-md mx-auto">
          <div class="flex items-center h-8">
            <input
              type="text"
              bind:value={apiToken}
              placeholder="Enter your API token"
              class="flex-1 h-full text-sm border border-border-300 rounded-l focus:outline-none focus:ring-1 focus:ring-primary-500 px-2" />
            <button
              on:click={verifyToken}
              class="bg-primary-500 hover:bg-primary-600 text-white text-sm h-full px-3 rounded-r border border-primary-500">
              Verify
            </button>
          </div>
          <p class="text-xs mt-1">
            No token? <a href="/paid" class="underline text-primary-700">Get the paid plan</a>
          </p>
        </div>
      {/if}
      <ContentSection>
        <SectionHeader
          title="Top Up Your API Requests"
          subtitle="Add more API requests to your existing subscription"
          centerText={true} />

        <div class="max-w-lg mx-auto">
          <div class="bg-border-50 rounded-lg p-6 mb-8">
            <div class="mb-6">
              <p class="font-xl font-semibold mb-2">Choose Quantity:</p>
              <div class="flex items-center h-12">
                <button
                  on:mousedown={() => startButtonHold(decreaseQuantity)}
                  on:mouseup={clearButtonHold}
                  on:mouseleave={clearButtonHold}
                  on:touchstart={() => startButtonHold(decreaseQuantity)}
                  on:touchend={clearButtonHold}
                  class="bg-border-200 hover:bg-border-300 rounded-l flex items-center justify-center w-12 h-12"
                  disabled={quantity <= 1}>
                  <Minus class="h-6 w-6" />
                </button>
                <div
                  class="border-t border-b border-border-200 flex-1 h-12 text-center flex items-center justify-center">
                  <span class="font-medium">{(quantity * 5000).toLocaleString()} requests</span>
                </div>
                <button
                  on:mousedown={() => startButtonHold(increaseQuantity)}
                  on:mouseup={clearButtonHold}
                  on:mouseleave={clearButtonHold}
                  on:touchstart={() => startButtonHold(increaseQuantity)}
                  on:touchend={clearButtonHold}
                  class="bg-border-200 hover:bg-border-300 rounded-r flex items-center justify-center w-12 h-12">
                  <Plus class="h-6 w-6" />
                </button>
              </div>
            </div>

            <div class="mb-6">
              <div class="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              {#if btcPrice !== null}
                <div class="flex justify-between items-center mt-2 text-sm text-type-dimmed">
                  <span>Bitcoin equivalent:</span>
                  <span>₿ {btcEquivalent}</span>
                </div>
              {:else if isFetchingBtc}
                <div class="flex justify-between items-center mt-2 text-sm text-type-dimmed">
                  <span>Bitcoin equivalent:</span>
                  <span class="inline-block animate-pulse">Loading...</span>
                </div>
              {:else}
                <div class="flex justify-between items-center mt-2 text-sm text-type-dimmed">
                  <span>Bitcoin equivalent:</span>
                  <button
                    on:click={fetchBitcoinPrice}
                    class="text-primary-600 underline">Load BTC price</button>
                </div>
              {/if}
            </div>

            <button
              on:click={handleSubmit}
              disabled={isProcessing || !apiToken || !isTokenVerified}
              class="w-full py-3 px-4 rounded bg-primary-500 hover:bg-primary-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {#if isProcessing}
                <span class="inline-block animate-pulse">Processing...</span>
              {:else}
                Add {(quantity * 5000).toLocaleString()} Requests
              {/if}
            </button>
          </div>

          <div class="text-sm text-type-dimmed">
            <h3 class="font-medium mb-2">Notes:</h3>
            <ul class="list-disc pl-5 space-y-1">
              <li>Additional requests are charged at $0.35 per 5,000 requests.</li>
              <li>We accept crypto payments <em>only</em>.</li>
              <li>Purchased requests are added to your existing balance.</li>
              <li>
                You can check your current usage in the <a
                  href="https://sub.wyzie.ru/dashboard"
                  class="text-primary-700 underline">dashboard</a
                >.
              </li>
              <li>
                For larger volume needs, please <a
                  href="mailto:dev@wyzie.ru"
                  class="text-primary-700 underline">contact us</a> for custom pricing.
              </li>
            </ul>
          </div>
        </div>
      </ContentSection>
    {/if}

    <Footer links={footerLinks} />
  </div>
</div>
