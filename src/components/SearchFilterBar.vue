<script setup lang="ts">
import { Search, Filter } from 'lucide-vue-next'

defineProps<{
  search: string
  filter: 'all' | 'completed' | 'incomplete'
}>()

const emit = defineEmits<{
  'search-change': [value: string]
  'filter-change': [value: 'all' | 'completed' | 'incomplete']
}>()

const filters: { value: 'all' | 'completed' | 'incomplete'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Complete' },
  { value: 'incomplete', label: 'Incomplete' },
]
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div class="relative flex-1 max-w-sm">
      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        placeholder="Search todos..."
        :value="search"
        @input="emit('search-change', ($event.target as HTMLInputElement).value)"
        class="w-full rounded-md border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search todos by title"
      />
    </div>
    <div
      class="flex items-center gap-1 rounded-md border bg-card p-1"
      role="radiogroup"
      aria-label="Filter by status"
    >
      <Filter class="ml-2 h-4 w-4 text-muted-foreground" />
      <button
        v-for="f in filters"
        :key="f.value"
        @click="emit('filter-change', f.value)"
        role="radio"
        :aria-checked="filter === f.value"
        :class="[
          'rounded px-3 py-1.5 text-xs font-medium transition-colors',
          filter === f.value
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground',
        ]"
      >
        {{ f.label }}
      </button>
    </div>
  </div>
</template>
