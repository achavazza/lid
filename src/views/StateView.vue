<template>
  <!-- Display the current question -->
  <div class="hero-body">
    <div class="container has-text-centered">
      <div class="box">
        
          <h1 class="is-size-2  mb-5">Select Your State</h1>
          <div class="states">
            <button
                v-for="state in states"
                :key="state"
                @click="selectState(state)"
                class="button is-medium mx-1"
            >
                {{ state }}
            </button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { computed, watch, onMounted } from 'vue';
import { useQuizStore } from "@/stores/quizStore";
import { useRouter } from "vue-router";

export default {
    setup() {
        const quizStore = useQuizStore();
        const router = useRouter();

        // Load questions when the component mounts
        onMounted(() => {
            if (!quizStore.stateQuestions || Object.keys(quizStore.stateQuestions).length === 0) {
                quizStore.loadQuestions();
            }
        });

        const states = computed(() => {
            if (!quizStore.stateQuestions) return [];
            return Object.keys(quizStore.stateQuestions).filter((key) => key !== "generalQuestions");
        });

        watch(states, (newStates) => {
            console.log("Available states:", newStates);
        });

        const selectState = (state) => {
            quizStore.setState(state);
            router.push("/quiz"); // Redirect to the quiz page
        };

        return { states, selectState };
    }
};
</script>
