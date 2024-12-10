import { createRouter, createWebHistory } from 'vue-router'
import QuizView from '../views/QuizView.vue';
import CustomQuiz from "../views/CustomQuiz.vue";
import QuizTest from '../views/QuizTest.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'quiz',
      component: QuizView,
    },
    { path: "/custom", component: CustomQuiz }, // Add this route
    { path: "/test", component: QuizTest }, // Add this route
    
  ],
})

export default router
