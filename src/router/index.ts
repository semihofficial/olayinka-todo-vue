import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import Index from '@/pages/Index.vue'
import CreateTodo from '@/pages/CreateTodo.vue'
import TodoDetail from '@/pages/TodoDetail.vue'
import ErrorTest from '@/pages/ErrorTest.vue'
import NotFound from '@/pages/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', component: Index },
        { path: 'create', component: CreateTodo },
        { path: 'todos/:id', component: TodoDetail },
        { path: 'error-test', component: ErrorTest },
      ],
    },
    { path: '/:pathMatch(.*)*', component: NotFound },
  ],
})

export default router
