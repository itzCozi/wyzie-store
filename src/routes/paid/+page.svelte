<script>
  import { onMount } from "svelte";
  import { Clipboard, CircleCheckBig } from "lucide-svelte";
  import ContentSection from "@/components/ContentSection.svelte";
  import SectionHeader from "@/components/SectionHeader.svelte";
  import CodeBlock from "@/components/CodeBlock.svelte";
  import Footer from "@/components/Footer.svelte";

  let apiToken = "";
  let isLoading = true;
  let hasError = false;
  let errorMessage = "";

  $: exampleApiUsage = `GET "https://sub.wyzie.ru/search?id=tt0264464&key=${apiToken}"`;

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

  onMount(async () => {
    try {
      // In a real implementation, you would:
      // 1. Get payment ID or transaction reference from URL params
      // 2. Make a request to your backend to verify payment and get API token

      // Simulating API call with timeout
      setTimeout(() => {
        apiToken = Array(32)
          .fill(0)
          .map(() =>
            "abcdefghijklmnopqrstuvwxyz0123456789-_".charAt(Math.floor(Math.random() * 36)),
          )
          .join("");

        isLoading = false;

        localStorage.setItem("wyzieApiToken", apiToken);
      }, 1500);
    } catch (error) {
      isLoading = false;
      hasError = true;
      errorMessage = "There was an error retrieving your API token. Please contact support.";
      console.error("Error fetching API token:", error);
    }
  });

  function copyToClipboard() {
    navigator.clipboard
      .writeText(apiToken)
      .then(() => {
        alert("API Token copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy token: ", err);
      });
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

    {#if isLoading}
      <ContentSection>
        <div class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-700">
          </div>
        </div>
        <p class="text-center text-type-dimmed">
          Processing your payment and generating your API token...
        </p>
      </ContentSection>
    {:else if hasError}
      <ContentSection>
        <div class="text-center py-10">
          <div class="text-error-600 text-6xl mb-4">⚠️</div>
          <h2 class="text-2xl font-bold mb-4">Something went wrong</h2>
          <p class="mb-6">{errorMessage}</p>
          <a
            href="mailto:dev@wyzie.ru"
            class="bg-primary-500 hover:bg-primary-600 text-white py-2 px-6 rounded transition-colors duration-200">
            Contact Support
          </a>
        </div>
      </ContentSection>
    {:else}
      <CircleCheckBig class="h-14 w-14 text-success-500 mb-4 mx-auto" />

      <ContentSection>
        <SectionHeader title="Your API Token" />
        <div class="bg-border-50 p-4 rounded mb-6">
          <div class="flex items-center justify-between">
            <p class="font-mono break-all">{apiToken}</p>
            <button
              class=" hover:scale-105 transition-transform"
              on:click={copyToClipboard}
              title="Copy to clipboard">
              <Clipboard class="h-5 w-5 text-type-dark" />
            </button>
          </div>
        </div>
        <div>
          <p class="font-bold text-type-emphasized">Important:</p>
          <p>
            Please save this token in a secure place. For security reasons, we cannot display it
            again. A copy has also been sent to your email address.
          </p>
        </div>
      </ContentSection>
      <ContentSection>
        <SectionHeader title="Getting Started" />
        <ol class="list-decimal ml-5 space-y-3 mb-6">
          <li>Include your API token in the Authorization header of all requests</li>
          <li>You have 50,000 requests included with your subscription</li>
          <li>Additional requests are charged at $0.35 per 5,000 requests</li>
          <li>
            Check your usage in the <a
              href="https://sub.wyzie.ru/dashboard">dashboard</a>
          </li>
        </ol>

        <h3 class="text-lg font-semibold mb-2">Example API Usage</h3>
        <CodeBlock code={exampleApiUsage} />

        <div class="mt-8 text-center">
          <button
            class="bg-primary-500 hover:bg-primary-600 text-white py-2 px-6 rounded transition-colors duration-200"
            on:click={() => (window.location.href = "https://docs.wyzie.ru")}>
            View Full API Documentation
          </button>
        </div>
      </ContentSection>
    {/if}

    <Footer links={footerLinks} />
  </div>
</div>
