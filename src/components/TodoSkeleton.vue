<script setup lang="ts">
const items = Array.from({ length: 5 }, (_, i) => i)
</script>

<template>
  <div class="space-y-3">
    <div v-for="i in items" :key="i" class="flex items-center gap-3 rounded-lg border bg-card p-4">
      <div class="h-5 w-5 rounded bg-muted animate-pulse" />
      <div class="flex-1 space-y-2">
        <div class="h-4 w-3/4 rounded bg-muted animate-pulse" />
        <div class="h-3 w-1/4 rounded bg-muted animate-pulse" />
      </div>
    </div>
  </div>
</template>
