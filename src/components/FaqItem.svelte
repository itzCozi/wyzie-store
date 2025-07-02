<script>
  export let question = "";
  export let answer = "";
  export let showBorder = true;
</script>

<div class={`pb-4 ${showBorder ? 'border-b border-border-200' : ''}`}>
  <h3 class="text-lg font-normal mb-2">{question}</h3>
  <p>
    {@html answer}
  </p>
</div>
