<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTodos } from '@/hooks/useTodos'
import TodoItem from '@/components/TodoItem.vue'
import SearchFilterBar from '@/components/SearchFilterBar.vue'
import PaginationControls from '@/components/PaginationControls.vue'
import TodoSkeleton from '@/components/TodoSkeleton.vue'
import { RouterLink } from 'vue-router'
import { Plus, Inbox } from 'lucide-vue-next'

const page = ref(1)
const search = ref('')
const filter = ref<'all' | 'completed' | 'incomplete'>('all')

const { data, isLoading, isError, error } = useTodos(page, 10)

const filteredTodos = computed(() => {
  if (!data.value?.data) return []
  let todos = data.value.data

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    todos = todos.filter((t) => t.name.toLowerCase().includes(q))
  }

  if (filter.value === 'completed') {
    todos = todos.filter((t) => t.status === 'DONE')
  } else if (filter.value === 'incomplete') {
    todos = todos.filter((t) => t.status !== 'DONE')
  }

  return todos
})

const totalPages = computed(() => data.value?.meta?.totalPages || 1)
</script>

<template>
  <div class="mx-auto max-w-2xl animate-fade-in">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">My Todos</h1>
        <p class="text-sm text-muted-foreground">
          {{ data?.meta?.total ? `${data.meta.total} total tasks` : 'Manage your tasks' }}
        </p>
      </div>
      <RouterLink
        to="/create"
        class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Plus class="h-4 w-4" />
        New Todo
      </RouterLink>
    </div>

    <div class="mb-4">
      <SearchFilterBar
        :search="search"
        :filter="filter"
        @search-change="search = $event"
        @filter-change="filter = $event"
      />
    </div>

    <TodoSkeleton v-if="isLoading" />

    <div
      v-else-if="isError"
      class="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"
      role="alert"
    >
      <p class="text-sm font-medium text-destructive">Failed to load todos</p>
      <p class="mt-1 text-xs text-muted-foreground">{{ (error as Error)?.message }}</p>
    </div>

    <div
      v-else-if="filteredTodos.length === 0"
      class="flex flex-col items-center gap-3 py-12 text-center"
    >
      <Inbox class="h-10 w-10 text-muted-foreground/50" />
      <p class="text-sm text-muted-foreground">
        {{
          search || filter !== 'all'
            ? 'No todos match your filters.'
            : 'No todos yet. Create one to get started!'
        }}
      </p>
    </div>

    <div v-else class="space-y-2" role="list" aria-label="Todo list">
      <div v-for="todo in filteredTodos" :key="todo.id" role="listitem">
        <TodoItem :todo="todo" />
      </div>
    </div>

    <PaginationControls :page="page" :total-pages="totalPages" @page-change="page = $event" />
  </div>
</template>
