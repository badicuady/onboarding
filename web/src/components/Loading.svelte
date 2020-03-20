<script>
  import { onDestroy } from "svelte";
  import loadingStore from "../services/loading.service.js";

  let visible = true;
  const unsubscribe = loadingStore.subscribe(value => {
    visible = value;
  });

  onDestroy(unsubscribe);
</script>

<style>
  .main-loader {
    position: fixed;
    top: 5px;
	right: 5px;
	z-index: 9999;
  }
  .loader {
    border-width: 3px;
    border-style: solid;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border-left-color: transparent;
    border-right-color: transparent;
  }
  .loader-inner {
    position: relative;
    top: 2px;
    left: 2px;
  }
  .loader1 {
    border-top-color: #00959C;
    border-bottom-color: #00959C;
    animation: rotate 2s cubic-bezier(0.26, 1.36, 0.74, 0.29) infinite;
  }
  .loader2 {
    border-top-color: #334293;
    border-bottom-color: #334293;
    width: 70px;
    height: 70px;
    animation: rotate 2s cubic-bezier(0.26, 1.36, 0.74, 0.29) infinite;
  }
  .loader3 {
    border-top-color: #00959C;
    border-bottom-color: #00959C;
    width: 60px;
    height: 60px;
    animation: rotate 2s cubic-bezier(0.26, 1.36, 0.74, 0.29) infinite;
  }
  .loader4 {
    border-top-color: #334293;
    border-bottom-color: #334293;
    width: 50px;
    height: 50px;
    animation: rotate 2s cubic-bezier(0.26, 1.36, 0.74, 0.29) infinite;
  }
  @keyframes rotate {
    0% {
      transform: rotateZ(-360deg);
    }
    100% {
      transform: rotateZ(0deg);
    }
  }
  .loading-text {
    color: #999;
    font-family: Arial;
    font-size: 10px;
    font-weight: lighter;
    display: block;
    margin-top: 13px;
  }
</style>

{#if visible}
  <div class="main-loader loader loader1">
    <div class="loader loader-inner loader2">
      <div class="loader loader-inner loader3">
        <div class="loader loader-inner loader4">
          <span class="loading-text">LOADING</span>
        </div>
      </div>
    </div>
  </div>
{/if}
