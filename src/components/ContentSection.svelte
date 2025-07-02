<script>
  export let bgColor = "";
  export let padding = "p-8";
  export let marginBottom = "mb-12";
  export let roundedCorners = true;
</script>

<div class="{bgColor} {padding} {roundedCorners ? 'rounded-lg' : ''} {marginBottom}">
  <slot />
</div>
