<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { CheckCircle2, Circle, ChevronRight, Trash2, Clock } from 'lucide-vue-next'
import type { Todo } from '@/types/todo'
import { useUpdateTodo, useDeleteTodo } from '@/hooks/useTodos'

const props = defineProps<{ todo: Todo }>()

const updateTodo = useUpdateTodo()
const deleteTodo = useDeleteTodo()
const showConfirm = ref(false)

function handleToggle(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  const nextStatus = props.todo.status === 'DONE' ? 'TODO' : 'DONE'
  updateTodo.mutate({ id: props.todo.id, payload: { status: nextStatus } })
}

function handleDelete(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  if (showConfirm.value) {
    deleteTodo.mutate(props.todo.id)
    showConfirm.value = false
  } else {
    showConfirm.value = true
  }
}
</script>

<template>
  <article
    class="group flex items-center gap-3 rounded-lg border bg-card p-4 transition-all hover:shadow-sm animate-fade-in"
  >
    <button
      @click="handleToggle"
      class="shrink-0 text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
      :aria-label="`Mark '${todo.name}' as ${todo.status === 'DONE' ? 'todo' : 'done'}`"
      :disabled="updateTodo.isPending.value"
    >
      <CheckCircle2 v-if="todo.status === 'DONE'" class="h-5 w-5 text-primary" />
      <Clock v-else-if="todo.status === 'IN_PROGRESS'" class="h-5 w-5 text-warning" />
      <Circle v-else class="h-5 w-5" />
    </button>

    <RouterLink :to="`/todos/${todo.id}`" class="flex flex-1 items-center gap-2 min-w-0">
      <div class="min-w-0 flex-1">
        <h3
          :class="[
            'truncate text-sm font-medium',
            todo.status === 'DONE' ? 'text-muted-foreground line-through' : 'text-foreground',
          ]"
        >
          {{ todo.name }}
        </h3>
        <div class="flex items-center gap-2">
          <span
            :class="[
              'text-xs font-medium',
              todo.priority === 'HIGH'
                ? 'text-destructive'
                : todo.priority === 'MEDIUM'
                  ? 'text-warning'
                  : 'text-muted-foreground',
            ]"
          >
            {{ todo.priority }}
          </span>
          <time class="text-xs text-muted-foreground" :datetime="todo.createdAt">
            {{ new Date(todo.createdAt).toLocaleDateString() }}
          </time>
        </div>
      </div>
      <ChevronRight
        class="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
      />
    </RouterLink>

    <div class="shrink-0 flex items-center gap-1">
      <span v-if="showConfirm" class="text-xs text-destructive mr-1">Sure?</span>
      <button
        @click="handleDelete"
        @blur="showConfirm = false"
        class="rounded p-1 text-muted-foreground transition-colors hover:text-destructive focus:outline-none"
        :aria-label="`Delete '${todo.name}'`"
        :disabled="deleteTodo.isPending.value"
      >
        <Trash2 class="h-4 w-4" />
      </button>
    </div>
  </article>
</template>
