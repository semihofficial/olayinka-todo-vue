<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTodo, useUpdateTodo, useDeleteTodo } from '@/hooks/useTodos'
import { ArrowLeft, CheckCircle2, Circle, Clock, Trash2, Calendar } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { data: todo, isLoading, isError, error } = useTodo(id)
const updateTodo = useUpdateTodo()
const deleteTodo = useDeleteTodo()
const showDeleteConfirm = ref(false)

const st = computed(() => {
  if (todo.value?.status === 'DONE') return { label: 'Done', cls: 'text-primary bg-primary/10' }
  if (todo.value?.status === 'IN_PROGRESS')
    return { label: 'In Progress', cls: 'text-warning bg-warning/10' }
  return { label: 'Todo', cls: 'text-muted-foreground bg-muted' }
})

const priorityColor = computed(() => {
  if (todo.value?.priority === 'HIGH') return 'text-destructive bg-destructive/10'
  if (todo.value?.priority === 'MEDIUM') return 'text-warning bg-warning/10'
  return 'text-muted-foreground bg-muted'
})

function handleToggle() {
  if (!todo.value) return
  const nextStatus = todo.value.status === 'DONE' ? 'TODO' : 'DONE'
  updateTodo.mutate({ id: todo.value.id, payload: { status: nextStatus } })
}

function handleDelete() {
  if (!todo.value) return
  deleteTodo.mutate(todo.value.id, { onSuccess: () => router.push('/') })
}
</script>

<template>
  <!-- Loading -->
  <div v-if="isLoading" class="mx-auto max-w-lg space-y-4 animate-fade-in">
    <div class="h-6 w-16 rounded bg-muted animate-pulse" />
    <div class="h-8 w-3/4 rounded bg-muted animate-pulse" />
    <div class="h-20 w-full rounded bg-muted animate-pulse" />
  </div>

  <!-- Error -->
  <div
    v-else-if="isError || !todo"
    class="mx-auto max-w-lg text-center animate-fade-in"
    role="alert"
  >
    <h2 class="mb-2 text-lg font-semibold text-foreground">Todo not found</h2>
    <p class="mb-4 text-sm text-muted-foreground">
      {{ (error as Error)?.message || "This todo doesn't exist or was deleted." }}
    </p>
    <button
      @click="router.push('/')"
      class="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      <ArrowLeft class="h-4 w-4" />
      Back to Todos
    </button>
  </div>

  <!-- Content -->
  <article v-else class="mx-auto max-w-lg animate-fade-in">
    <button
      @click="router.push('/')"
      class="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft class="h-4 w-4" />
      Back to Todos
    </button>

    <div class="rounded-lg border bg-card p-6">
      <div class="mb-4 flex items-start justify-between gap-4">
        <div class="flex items-start gap-3 min-w-0">
          <button
            @click="handleToggle"
            :disabled="updateTodo.isPending.value"
            class="mt-0.5 shrink-0 text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring rounded"
            :aria-label="`Mark as ${todo.status === 'DONE' ? 'todo' : 'done'}`"
          >
            <CheckCircle2 v-if="todo.status === 'DONE'" class="h-6 w-6 text-primary" />
            <Clock v-else-if="todo.status === 'IN_PROGRESS'" class="h-6 w-6 text-warning" />
            <Circle v-else class="h-6 w-6" />
          </button>
          <h1
            :class="[
              'text-xl font-bold',
              todo.status === 'DONE' ? 'text-muted-foreground line-through' : 'text-foreground',
            ]"
          >
            {{ todo.name }}
          </h1>
        </div>
        <div class="flex shrink-0 gap-2">
          <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', st.cls]">{{
            st.label
          }}</span>
          <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', priorityColor]">{{
            todo.priority
          }}</span>
        </div>
      </div>

      <p v-if="todo.description" class="mb-4 text-sm text-muted-foreground leading-relaxed">
        {{ todo.description }}
      </p>

      <div class="space-y-2 border-t pt-4 text-xs text-muted-foreground">
        <div class="flex items-center gap-2">
          <Calendar class="h-3.5 w-3.5" />
          <span>Created: {{ new Date(todo.createdAt).toLocaleString() }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Clock class="h-3.5 w-3.5" />
          <span>Updated: {{ new Date(todo.updatedAt).toLocaleString() }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-mono">ID: {{ todo.id }}</span>
        </div>
      </div>

      <div class="mt-6 flex gap-2 border-t pt-4">
        <button
          @click="handleToggle"
          :disabled="updateTodo.isPending.value"
          class="flex-1 rounded-md border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
        >
          {{
            updateTodo.isPending.value
              ? 'Updating...'
              : todo.status === 'DONE'
                ? 'Mark Todo'
                : 'Mark Done'
          }}
        </button>

        <div v-if="showDeleteConfirm" class="flex gap-2">
          <button
            @click="handleDelete"
            :disabled="deleteTodo.isPending.value"
            class="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {{ deleteTodo.isPending.value ? 'Deleting...' : 'Confirm' }}
          </button>
          <button
            @click="showDeleteConfirm = false"
            class="rounded-md border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Cancel
          </button>
        </div>

        <button
          v-else
          @click="showDeleteConfirm = true"
          class="inline-flex items-center gap-1 rounded-md border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <Trash2 class="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  </article>
</template>
