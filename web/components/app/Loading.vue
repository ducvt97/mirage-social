<template>
  <div v-show="isLoading" class="loading-back-drop"></div>
</template>

<script setup lang="ts">
const { isLoading } = useLoading();
</script>

<style>
.loading-back-drop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  cursor: default;
  background: rgba(212, 212, 212, 0.847) url("@/public/loading.svg") no-repeat
    center;
  background-size: 100px;
}
</style>
