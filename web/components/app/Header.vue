<template>
  <div class="flex justify-between items-center px-6 py-3">
    <ULink to="/" class="h-12">
      <AppIcon :name="Icons.logo" size="xl" />
    </ULink>
  </div>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";
</script>
