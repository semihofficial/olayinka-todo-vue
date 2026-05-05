<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { CheckSquare, Plus, AlertTriangle } from 'lucide-vue-next'

const route = useRoute()
const mobileMenuOpen = ref(false)

const navLinks = [
  { to: '/', label: 'Todos', icon: CheckSquare },
  { to: '/create', label: 'New Todo', icon: Plus },
  { to: '/error-test', label: 'Error Test', icon: AlertTriangle },
]
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
      <nav
        class="container mx-auto flex items-center justify-between px-4 py-3"
        aria-label="Main navigation"
      >
        <RouterLink to="/" class="flex items-center gap-2 text-lg font-bold text-foreground">
          <CheckSquare class="h-6 w-6 text-primary" />
          <span>TodoApp</span>
        </RouterLink>

        <!-- Desktop nav -->
        <ul class="hidden items-center gap-1 md:flex" role="list">
          <li v-for="link in navLinks" :key="link.to">
            <RouterLink
              :to="link.to"
              :class="[
                'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                route.path === link.to
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              ]"
              :aria-current="route.path === link.to ? 'page' : undefined"
            >
              <component :is="link.icon" class="h-4 w-4" />
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>

        <!-- Mobile toggle -->
        <button
          class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
          @click="mobileMenuOpen = !mobileMenuOpen"
          :aria-expanded="mobileMenuOpen"
          aria-label="Toggle navigation menu"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              v-if="mobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              :stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              :stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="border-t md:hidden">
        <ul class="container mx-auto space-y-1 px-4 py-2" role="list">
          <li v-for="link in navLinks" :key="link.to">
            <RouterLink
              :to="link.to"
              @click="mobileMenuOpen = false"
              :class="[
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                route.path === link.to
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              ]"
              :aria-current="route.path === link.to ? 'page' : undefined"
            >
              <component :is="link.icon" class="h-4 w-4" />
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6" id="main-content">
      <slot />
    </main>
  </div>
</template>
