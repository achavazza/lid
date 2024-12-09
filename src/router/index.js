import { createRouter, createWebHistory } from 'vue-router'
import QuizView from '../views/QuizView.vue';
import CustomQuiz from "../views/CustomQuiz.vue";
import StateView from "../views/StateView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'quiz',
      component: QuizView,
    },
    { path: "/custom", component: CustomQuiz }, // Add this route
    
  ],
})

export default router
