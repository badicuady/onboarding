<script>
  import { fadeIn, fadeOut } from "../actions/pageFade.js";
</script>

<div class="content-wrapper">
  <div class="content-header" in:fadeIn out:fadeOut>
    <slot name="content-header" />
  </div>
  <div class="content" in:fadeIn out:fadeOut>
    <slot name="content" />
  </div>
</div>
