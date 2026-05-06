<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((error) => {
  hasError.value = true
  errorMessage.value = error.message
  return false
})
</script>

<template>
  <div v-if="hasError" class="flex min-h-[50vh] items-center justify-center p-8" role="alert">
    <div class="max-w-md text-center animate-fade-in">
      <div
        class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            :stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h2 class="mb-2 text-xl font-semibold text-foreground">Something went wrong</h2>
      <p class="mb-4 text-sm text-muted-foreground">
        {{ errorMessage || 'An unexpected error occurred.' }}
      </p>
      <button
        @click="() => window.location.reload()"
        class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Reload Page
      </button>
    </div>
  </div>
  <slot v-else />
</template>
