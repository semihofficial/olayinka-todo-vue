<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateTodo } from '@/hooks/useTodos'
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const createTodo = useCreateTodo()

const name = ref('')
const description = ref('')
const priority = ref<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM')

function handleSubmit() {
  if (!name.value.trim()) return
  createTodo.mutate(
    {
      name: name.value.trim(),
      description: description.value.trim() || undefined,
      priority: priority.value,
    },
    { onSuccess: () => router.push('/') },
  )
}
</script>

<template>
  <div class="mx-auto max-w-lg animate-fade-in">
    <button
      @click="router.go(-1)"
      class="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft class="h-4 w-4" />
      Back
    </button>

    <h1 class="mb-6 text-2xl font-bold text-foreground">Create Todo</h1>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="name" class="mb-1.5 block text-sm font-medium text-foreground">
          Title <span class="text-destructive">*</span>
        </label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          placeholder="What needs to be done?"
          class="w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label for="description" class="mb-1.5 block text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          id="description"
          v-model="description"
          placeholder="Add more details (optional)"
          :rows="3"
          class="w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      <div>
        <label for="priority" class="mb-1.5 block text-sm font-medium text-foreground">
          Priority
        </label>
        <select
          id="priority"
          v-model="priority"
          class="w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <button
        type="submit"
        :disabled="createTodo.isPending.value || !name.trim()"
        class="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        {{ createTodo.isPending.value ? 'Creating...' : 'Create Todo' }}
      </button>

      <p v-if="createTodo.isError.value" class="text-sm text-destructive" role="alert">
        Failed to create todo. Please try again.
      </p>
    </form>
  </div>
</template>
