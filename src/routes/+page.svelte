<script>
  import PricingCard from "@/components/PricingCard.svelte";
  import FaqItem from "@/components/FaqItem.svelte";
  import SectionHeader from "@/components/SectionHeader.svelte";
  import CodeBlock from "@/components/CodeBlock.svelte";
  import ContentSection from "@/components/ContentSection.svelte";
  import Footer from "@/components/Footer.svelte";

  function redirectToPayment() {
    window.location.href = '/checkout';
  }

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

  const freePlanFeatures = [
    { text: "100 requests per day", included: true },
    { text: "Public Discord with support forums", included: true },
    { text: "Access to all subtitles", included: true },
  ];

  const paidPlanFeatures = [
    { text: "50,000 requests included", included: true },
    { text: "$0.35 per 5K requests over limit", included: true },
    { text: "Priority support", included: true },
  ];

  const faqItems = [
    {
      question: "Will I be notified when my token is running out?",
      answer:
        "Yes, you'll receive an automated email notification when you reach 80% of your request limit. The email includes a convenient top-up link to ensure uninterrupted API access.",
    },
    {
      question: "What happens if I exceed my limit?",
      answer:
        "On the Paid plan, you will need to top up your account with $0.35 for each additional 5K requests. On the Free plan, you'll need to wait until the next day once you hit your limit.",
    },
    {
      question: "How can I reset my API token?",
      answer:
        "If you need to reset your API token, please contact us via email or on Discord. We charge a small fee of $5 for this to cover the costs of generating a new token.",
    },
    {
      question: "How do I track my usage?",
      answer:
        'Once you have an API token, you can check your remaining requests through our <a href="https://sub.wyzie.ru/dashboard" alt="Dashboard" title="Toolset Homepage">dashboard</a>.',
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Since our service is a digital product with immediate access, we typically don't offer refunds. However, if you encounter significant issues, please contact our support team.",
    },
  ];
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
      <PricingCard
        title="Free Plan"
        description="Basic access for small projects"
        features={freePlanFeatures}
        buttonText="Current Plan"
        isPrimary={false} />

      <PricingCard
        title="Paid Plan"
        description="Unlimited access for serious users"
        price="$8"
        priceDescription="/One Time"
        features={paidPlanFeatures}
        buttonText="Subscribe Now"
        isPrimary={true}
        onClick={redirectToPayment} />
    </div>

    <ContentSection bgColor="bg-border-50">
      <SectionHeader
        title="How It Works"
        marginBottom="mb-4" />
      <ol class="list-decimal ml-5 space-y-3">
        <li>Complete payment through NOWPayments</li>
        <li>Receive your API token instantly</li>
        <li>Start making API requests for subtitles</li>
        <li>Top up your token when needed!</li>
      </ol>
      <div class="mt-5">
        <h3 class="text-lg font-semibold mb-2">API Usage Example</h3>
        <CodeBlock code="GET https://sub.wyzie.ru/search?id=tt0264464&source=all" />
      </div>
    </ContentSection>

    <ContentSection
      padding="p-0"
      bgColor="">
      <SectionHeader
        title="Frequently Asked Questions"
        marginBottom="mb-5" />
      <div class="space-y-4">
        {#each faqItems as faq, index}
          <FaqItem
            question={faq.question}
            answer={faq.answer}
            showBorder={index !== faqItems.length - 1} />
        {/each}
      </div>
    </ContentSection>

    <Footer links={footerLinks} />
  </div>
</div>
