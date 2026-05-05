<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const withGaps = computed(() => {
  const pages = Array.from({ length: props.totalPages }, (_, i) => i + 1)
  const visiblePages = pages.filter(
    (p) => p === 1 || p === props.totalPages || Math.abs(p - props.page) <= 1,
  )
  const result: (number | 'gap')[] = []
  visiblePages.forEach((p, i) => {
    if (i > 0 && p - visiblePages[i - 1] > 1) result.push('gap')
    result.push(p)
  })
  return result
})
</script>

<template>
  <nav
    v-if="totalPages > 1"
    aria-label="Pagination"
    class="flex items-center justify-center gap-1 pt-4"
  >
    <button
      @click="emit('page-change', page - 1)"
      :disabled="page <= 1"
      class="inline-flex items-center justify-center rounded-md p-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
      aria-label="Previous page"
    >
      <ChevronLeft class="h-4 w-4" />
    </button>

    <template v-for="(item, i) in withGaps" :key="i">
      <span v-if="item === 'gap'" class="px-2 text-muted-foreground">…</span>
      <button
        v-else
        @click="emit('page-change', item as number)"
        :aria-current="page === item ? 'page' : undefined"
        :class="[
          'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors',
          page === item
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
        ]"
      >
        {{ item }}
      </button>
    </template>

    <button
      @click="emit('page-change', page + 1)"
      :disabled="page >= totalPages"
      class="inline-flex items-center justify-center rounded-md p-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
      aria-label="Next page"
    >
      <ChevronRight class="h-4 w-4" />
    </button>
  </nav>
</template>
