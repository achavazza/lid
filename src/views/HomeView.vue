<template>
  <!-- Display the current question -->
  <div class="hero-body">
    <div class="container has-text-centered">
      <div class="box"  v-if="currentQuestion">
        <div class="question-number"><strong>{{ currentQuestion.id }}</strong></div>
        <div>
          <h2 class="is-size-2 has-text-left mb-5">{{ currentQuestion.question }}</h2>
          <!-- Display the image if it exists -->
          <img v-if="currentQuestion.image" :src="currentQuestion.image" alt="Question Image" class="question-image" />
          <ul class=" has-text-left">
            <li v-for="(choice, index) in currentQuestion.choices" :key="index">
              <button @click="quizStore.selectAnswer(index)" class="button is-medium my-1">
                {{ choice }}
              </button>
            </li>
          </ul>
        </div>
        
        <!-- Display results
        <div>
          <h2>Quiz Results</h2>
          <ul>
            <li v-for="result in quizStore.results" :key="result.question.id">
              <h3>{{ result.question.question }}</h3>
              <p>Your Answer: {{ result.question.choices[result.userAnswer] }}</p>
              <p>Correct Answer: {{ result.question.choices[result.question.correct] }}</p>
              <p :class="{ correct: result.isCorrect, incorrect: !result.isCorrect }">
                {{ result.isCorrect ? "Correct" : "Incorrect" }}
              </p>
            </li>
          </ul>
        </div>
        -->
      </div>
      <p class="mt-5"><span>{{quizStore.selectedState}}</span> {{ quizStore.questions.length - quizStore.currentQuestionIndex - 1 }} questions remaining.</p>

    </div>
  </div>
</template>

<script>
import { computed, watch } from "vue";
import { useQuizStore } from "@/stores/quizStore";
import { useRouter } from "vue-router";

export default {
  setup() {
    const quizStore = useQuizStore();
    const router = useRouter();

    // Load questions when the component mounts
    quizStore.loadQuestions();

    const currentQuestion = computed(() => {
      return quizStore.questions[quizStore.currentQuestionIndex];
    });

    const selectAnswer = (index) => {
      quizStore.selectAnswer(index);

      // If the quiz has ended, redirect to the results page
      if (quizStore.currentQuestionIndex === null && quizStore.results) {
        router.push("/results");
      }
    };
    watch(
      () => quizStore.results,
      (newResults) => {
        if (newResults) {
          router.push("/results");
        }
      }
    );

    return {
      quizStore,
      currentQuestion,
      selectAnswer,
    };
  },
};
</script>

<style>
.correct {
  color: green;
}

.incorrect {
  color: red;
}
</style>
