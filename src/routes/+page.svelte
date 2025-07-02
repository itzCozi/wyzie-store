<script>
  import { CircleMinus, CircleCheckBig } from "lucide-svelte";
  import { onMount } from "svelte";

  function redirectToPayment() {
    // Placeholder for payment redirect
    alert("Redirecting to payment processor for the Paid Plan...");
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

    <div class="grid md:grid-cols-2 gap-8 mb-12">
      <!-- Free Plan -->
      <div
        class="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full border-border-200">
        <div class="mb-6">
          <h2 class="text-2xl font-bold mb-2">Free Plan</h2>
          <p class="text-type-dimmed">Basic access for small projects</p>
        </div>
        <div class="flex-grow mb-6">
          <ul class="space-y-3">
            <li class="flex items-start">
              <CircleCheckBig class="h-5 w-5 text-success-500 mr-2 flex-shrink-0" />
              <span>25 subtitle requests per day</span>
            </li>
            <li class="flex items-start">
              <CircleCheckBig class="h-5 w-5 text-success-500 mr-2 flex-shrink-0" />
              <span>No API token required</span>
            </li>
            <li class="flex items-start">
              <CircleMinus class="h-5 w-5 text-error-500 mr-2 flex-shrink-0" />
              <span>Requests over limit</span>
            </li>
          </ul>
        </div>
        <button
          class="w-full py-2 px-4 rounded bg-border-200 hover:bg-border-300 transition-colors">
          Current Plan
        </button>
      </div>

      <div
        class="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full border-border-200">
        <div class="mb-6">
          <h2 class="text-2xl font-bold mb-2">Paid Plan</h2>
          <p class="text-type-dimmed">Unlimited access for serious users</p>
        </div>
        <div class="mb-6">
          <p class="text-3xl font-bold mb-1">
            $8<span class="text-sm font-normal">/One Time</span>
          </p>
        </div>
        <div class="flex-grow mb-6">
          <ul class="space-y-3">
            <li class="flex items-start">
              <CircleCheckBig class="h-5 w-5 text-success-500 mr-2 flex-shrink-0" />
              <span>10,000 requests included</span>
            </li>
            <li class="flex items-start">
              <CircleCheckBig class="h-5 w-5 text-success-500 mr-2 flex-shrink-0" />
              <span>$0.35 per 5K requests over limit</span>
            </li>
            <li class="flex items-start">
              <CircleCheckBig class="h-5 w-5 text-success-500 mr-2 flex-shrink-0" />
              <span>Priority support</span>
            </li>
          </ul>
        </div>
        <button
          on:click={redirectToPayment}
          class="w-full py-2 px-4 rounded bg-primary-500 hover:bg-primary-600 text-white transition-colors duration-200">
          Subscribe Now
        </button>
      </div>
    </div>

    <div class="bg-border-50 p-8 rounded-lg mb-12">
      <h2 class="text-2xl font-bold mb-4">How It Works</h2>
      <ol class="list-decimal ml-5 space-y-3">
        <li>Complete payment through NOWPayments</li>
        <li>Receive your API token instantly</li>
        <li>Start making API requests for subtitles</li>
        <li>Top up your token when needed!</li>
      </ol>
      <div class="mt-5">
        <h3 class="text-lg font-semibold mb-2">API Usage Example</h3>
        <div class="text-success-400 rounded font-mono text-sm">
          <code>GET https://sub.wyzie.ru/search?id=tt0264464&source=all</code>
        </div>
      </div>
    </div>

    <div class="mb-12">
      <h2 class="text-2xl font-bold mb-5">Frequently Asked Questions</h2>
      <div class="space-y-4">
        <div class="border-b pb-4 border-border-200">
          <h3 class="text-lg font-normal mb-2">Will I be notified when my token is running out?</h3>
          <p>
            Yes, you'll receive an automated email notification when you reach 80% of your request
            limit. The email includes a convenient top-up link to ensure uninterrupted API access.
          </p>
        </div>
        <div class="border-b pb-4 border-border-200">
          <h3 class="text-lg font-normal mb-2">What happens if I exceed my limit?</h3>
          <p>
            On the Paid plan, you will need to top up your account with $0.35 for each additional 5K
            requests. On the Free plan, you'll need to wait until the next day once you hit your
            limit.
          </p>
        </div>
        <div class="border-b pb-4 border-border-200">
          <h3 class="text-lg font-normal mb-2">How can I reset my API token?</h3>
          <p>
            If you need to reset your API token, please contact us via email or on Discord. We charge a small fee of $5 for this to cover the costs of generating a new token.
          </p>
        </div>
        <div class="border-b pb-4 border-border-200">
          <h3 class="text-lg font-normal mb-2">How do I track my usage?</h3>
          <p>
            Once you have an API token, you can check your remaining requests through our <a href="https://sub.wyzie.ru/dashboard" alt="Dashboard" title="Toolset Homepage">dashboard</a>.
          </p>
        </div>
        <div class="border-b pb-4 border-border-200">
          <h3 class="text-lg font-normal mb-2">Do you offer refunds?</h3>
          <p>
            Since our service is a digital product with immediate access, we typically don't offer refunds. However, if you encounter significant issues, please contact our support team.
          </p>
        </div>
      </div>
    </div>

    <footer class="text-center text-sm py-8">
      <div class="flex justify-center space-x-4 mb-4">
        <a href="mailto:dev@wyzie.ru" alt="Contact" title="Contact us">Contact</a>
        <a href="https://docs.wyzie.ru" alt="Documentation" title="Documentation">Documentation</a>
        <a href="https://discord.com/invite/2mxraHBVtB" alt="Documentation" title="Documentation">Discord</a>
      </div>
    </footer>
  </div>
</div>
